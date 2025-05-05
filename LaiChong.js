//2024.01.17  14：20
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
    await handleRequest();
  } else {
    await handleTask();
  }
  $done();
})();

async function handleRequest() {
  try {
    const auth = $request.headers?.Authorization;
    if (!auth) {
      console.log("[捕获失败] 未获取到 Authorization");
      return;
    }

    const saveKey = "LaichongAuthList";
    let authList = getPersistentData(saveKey) || [];

    if (!Array.isArray(authList)) authList = [];

    if (authList.includes(auth)) {
      console.log(`[捕获跳过] 已存在: ${auth}`);
      notify("获取参数跳过", "", "发现重复的 Authorization，已忽略");
      return;
    }

    if (authList.length >= 2) {
      console.log("[账号管理] 账号数已达上限，移除最早的");
      authList.shift();
    }

    authList.push(auth);
    const success = setPersistentData(saveKey, authList);

    if (success) {
      console.log(`[捕获成功] 新增 Authorization: ${auth}`);
      notify("获取参数成功", "", `已新增账号：${auth}`);
    } else {
      console.log("[捕获失败] 无法写入数据");
    }
  } catch (err) {
    console.log("捕获异常:", err);
  }
}

async function handleTask() {
  const saveKey = "LaichongAuthList";
  let authList = getPersistentData(saveKey) || [];

  if (!Array.isArray(authList)) authList = [];

  if (authList.length === 0) {
    console.log("无已存储的账号信息");
    notify("请求失败", "", "请先运行脚本以获取 Authorization");
    return;
  }

  console.log(`[多账号模式] 检测到 ${authList.length} 个账号`);

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
    { desc: "签到", body: "", url: "https://shop.laichon.com/api/v1/task/signComplete" },
    { desc: "签到翻倍", body: "", url: "https://shop.laichon.com/api/v1/task/pointsDouble" },
    { desc: "观看视频", body: "task_id=4", url: "https://shop.laichon.com/api/v1/task/taskComplete" },
    { desc: "充电任务", body: "task_id=3", url: "https://shop.laichon.com/api/v1/task/taskComplete" },
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
        headers: { ...baseHeaders, Authorization: currentAuth },
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
        const gotPoints = data ? parseInt(data, 10) || 0 : 0;
        totalPoints += gotPoints;
        detailArr.push(`${desc}: 成功(+1)`);
        console.log(`${desc} 成功, 积分+1`);
      } else {
        detailArr.push(`${desc}: 失败(${msg || "未知错误"})`);
        console.log(`${desc} 失败, 错误: ${msg || "未知"}`);
      }
    }

    finalMsg.push(`【账号${i + 1}】| ${detailArr.join("；")}`);
  }

  const notifyTitle = "多账号任务执行结果";
  console.log("\n===== 执行完毕，汇总 =====\n" + finalMsg.join("\n"));
  notify(notifyTitle, "", finalMsg.join("\n"));
}

function doRequest(reqObj) {
  return new Promise((resolve) => {
    if (typeof $task !== "undefined") {
      $task.fetch(reqObj).then(
        (resp) => resolve(JSON.parse(resp.body || "{}")),
        () => resolve(null)
      );
    } else if (typeof $httpClient !== "undefined") {
      $httpClient[reqObj.method.toLowerCase()](
        reqObj,
        (err, resp, data) => resolve(err ? null : JSON.parse(data || "{}"))
      );
    } else {
      resolve(null);
    }
  });
}

function getPersistentData(key) {
  if (typeof $prefs !== "undefined") return JSON.parse($prefs.valueForKey(key) || "[]");
  if (typeof $persistentStore !== "undefined") return JSON.parse($persistentStore.read(key) || "[]");
  return [];
}

function setPersistentData(key, value) {
  const data = JSON.stringify(value);
  if (typeof $prefs !== "undefined") return $prefs.setValueForKey(data, key);
  if (typeof $persistentStore !== "undefined") return $persistentStore.write(data, key);
  return false;
}

function notify(title, subtitle, content) {
  if (typeof $notify !== "undefined") $notify(title, subtitle, content);
  if (typeof $notification !== "undefined") $notification.post(title, subtitle, content);
}
