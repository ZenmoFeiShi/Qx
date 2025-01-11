//2024.01.12  00：58
/*
@Name：莱充小程序
@Author：怎么肥事
使用方法：点击我的自动获取支持多账号，支持qx.loon.surge
[rewrite_local]
^https:\/\/shop\.laichon\.com\/api\/v1\/member\/userinfo url script-request-header https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/LaiChong.js

[task_local]
50 9 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/LaiChong.js, tag=莱充, enabled=true

[MITM]
hostname = shop.laichon.com

*/

!(async () => {
  const isRequest = typeof $request !== "undefined";

  if (isRequest) {
    handleRequest();
  } else {
    await handleTask();
  }
  $done();

  async function handleRequest() {
    try {
      const auth = $request.headers?.Authorization;
      if (!auth) {
        console.log("[捕获失败] 未获取到 Authorization");
        return;
      }
      const saveKey = "MY_AUTH_LIST";
      let authList = [];
      const raw = getPersistentData(saveKey);
      if (raw) {
        try {
          authList = JSON.parse(raw);
        } catch (e) {
          console.log("[解析失败] MY_AUTH_LIST 非法，重置为空数组");
          authList = [];
        }
      }

      if (authList.includes(auth)) {
        console.log("[捕获跳过] 重复账号: " + auth);
        notify("获取参数跳过", "", "发现重复的 Authorization，已忽略");
        return;
      }

      authList.push(auth);
      const success = setPersistentData(saveKey, JSON.stringify(authList));
      if (success) {
        console.log("[捕获成功] 新增 Authorization: " + auth);
        notify("获取参数成功", "", `已新增账号：${auth}`);
      } else {
        console.log("[捕获失败] 写入持久化数据失败");
      }
    } catch (err) {
      console.log("捕获阶段异常:", err);
    }
  }

  async function handleTask() {
    const saveKey = "MY_AUTH_LIST";
    let authList = [];
    const raw = getPersistentData(saveKey);
    if (raw) {
      try {
        authList = JSON.parse(raw);
      } catch (e) {
        console.log("[解析失败] MY_AUTH_LIST 非法");
        notify("请求失败", "", "MY_AUTH_LIST 数据异常，无法解析");
        return;
      }
    }

    if (!authList || authList.length === 0) {
      console.log("尚未捕获到任何账号信息，无法请求");
      notify("请求失败", "", "请先让脚本捕获至少一个 Authorization");
      return;
    }

    console.log(`[多账号] 本次共检测到 ${authList.length} 个账号`);

    const baseHeaders = {
      "Accept-Encoding": "gzip,compress,br,deflate",
      "content-type": "application/x-www-form-urlencoded",
      "Connection": "keep-alive",
      "Referer": "https://servicewechat.com/wxa68db1dabe823e7e/421/page-frame.html",
      "Host": "shop.laichon.com",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.54(0x18003637) NetType/WIFI Language/zh_CN",
      "Service-Code": "WYC-MI-WEIXIN",
    };

    const tasks = [
      {
        desc: "签到",
        body: "",
        url: "https://shop.laichon.com/api/v1/task/signComplete",
      },
      {
        desc: "观看视频",
        body: "task_id=4",
        url: "https://shop.laichon.com/api/v1/task/taskComplete",
      },
      {
        desc: "充电任务",
        body: "task_id=3",
        url: "https://shop.laichon.com/api/v1/task/taskComplete",
      },
    ];

    let finalMsg = [];

    for (let i = 0; i < authList.length; i++) {
      const currentAuth = authList[i];
      console.log(`\n========== 开始执行第 ${i + 1} 个账号 ==========`);

      let totalPoints = 0;
      let detailArr = [];

      for (const item of tasks) {
        const { desc, body, url } = item;

        const requestOpts = {
          url,
          method: "POST",
          headers: {
            ...baseHeaders,
            Authorization: currentAuth,
          },
          body,
        };

        const resp = await doRequest(requestOpts);
        if (!resp) {
          detailArr.push(`${desc}: 请求异常`);
          console.log(`${desc} 请求异常`);
          continue;
        }

        const { code, data, msg } = resp;
        if (code === 1) {
          if (data !== null && data !== undefined) {
            const gotPoints = parseInt(data, 10) || 0;
            totalPoints += gotPoints;
            detailArr.push(`${desc}: 成功(+${gotPoints})`);
            console.log(`${desc} 成功, 积分+${gotPoints}`);
          } else {
            detailArr.push(`${desc}: 成功(+0)`);
            console.log(`${desc} 成功, data=null, 无额外积分`);
          }
        } else {
          detailArr.push(`${desc}: 失败(${msg || "未知错误"})`);
          console.log(`${desc} 失败, 原因: ${msg || "未知"}`);
        }
      }

      const detailStr = detailArr.join("；");
      finalMsg.push(`【账号${i + 1}】本次获得总积分: ${totalPoints} | ${detailStr}`);
    }

    const notifyTitle = "多账号执行结果";
    const notifyBody = finalMsg.join("\n");
    console.log("\n===== 执行完毕，汇总 =====\n" + notifyBody);
    notify(notifyTitle, "", notifyBody);
  }

  function doRequest(reqObj) {
    return new Promise((resolve) => {
      if (typeof $task !== "undefined") {
        $task.fetch(reqObj).then(
          (resp) => {
            try {
              const data = JSON.parse(resp.body || "{}");
              resolve(data);
            } catch (e) {
              console.log("JSON 解析异常:", e);
              resolve(null);
            }
          },
          (err) => {
            console.log("请求异常:", err);
            resolve(null);
          }
        );
      } else if (typeof $httpClient !== "undefined") {
        const { url, method, headers, body } = reqObj;
        $httpClient[method.toLowerCase()](
          { url, headers, body },
          (err, resp, data) => {
            if (err) {
              console.log("请求异常:", err);
              resolve(null);
            } else {
              try {
                const parsedData = JSON.parse(data || "{}");
                resolve(parsedData);
              } catch (e) {
                console.log("JSON 解析异常:", e);
                resolve(null);
              }
            }
          }
        );
      }
    });
  }

  function getPersistentData(key) {
    if (typeof $prefs !== "undefined") return $prefs.valueForKey(key);
    if (typeof $persistentStore !== "undefined")
      return $persistentStore.read(key);
    return null;
  }

  function setPersistentData(key, value) {
    if (typeof $prefs !== "undefined") return $prefs.setValueForKey(value, key);
    if (typeof $persistentStore !== "undefined")
      return $persistentStore.write(value, key);
    return false;
  }

  function notify(title, subtitle, content) {
    if (typeof $notify !== "undefined") $notify(title, subtitle, content);
    if (typeof $notification !== "undefined")
      $notification.post(title, subtitle, content);
  }
