//2024.12.23


!(async () => {
  if (typeof $request !== "undefined") {
    try {
      const auth = $request.headers?.Authorization;
      if (!auth) {
        console.log("[捕获失败] 未获取到 Authorization");
        return $done();
      }
      const saveKey = "MY_AUTH_LIST";
      let authList = [];
      const raw = $prefs.valueForKey(saveKey);
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
        $notify("获取参数跳过", "", "发现重复的 Authorization，已忽略");
        return $done();
      }

      authList.push(auth);
      const success = $prefs.setValueForKey(JSON.stringify(authList), saveKey);
      if (success) {
        console.log("[捕获成功] 新增 Authorization: " + auth);
        $notify("获取参数成功", "", `已新增账号：${auth}`);
      } else {
        console.log("[捕获失败] 写入 $prefs 失败");
      }
    } catch (err) {
      console.log("脚本执行异常:", err);
    } finally {
      return $done();
    }
  }

  try {
    const saveKey = "MY_AUTH_LIST";
    let authList = [];
    const raw = $prefs.valueForKey(saveKey);
    if (raw) {
      try {
        authList = JSON.parse(raw);
      } catch (e) {
        console.log("[解析失败] MY_AUTH_LIST 非法，脚本结束");
        $notify("重放失败", "", "MY_AUTH_LIST 数据异常，无法解析");
        return $done();
      }
    }

    if (!authList || authList.length === 0) {
      console.log("尚未捕获到任何账号信息，无法重放");
      $notify("重放失败", "", "请先让脚本捕获至少一个 Authorization");
      return $done();
    }

    console.log(`[多账号] 本次共检测到 ${authList.length} 个账号`);

    const baseHeaders = {
      "Accept-Encoding": "gzip,compress,br,deflate",
      "content-type": "application/x-www-form-urlencoded",
      "Connection": "keep-alive",
      "openid": "oOO3c4h2u7CciZz-hTy8Yew0Q2Tw",
      "Referer": "https://servicewechat.com/wxa68db1dabe823e7e/421/page-frame.html",
      "Host": "shop.laichon.com",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.54(0x18003637) NetType/WIFI Language/zh_CN",
      "Service-Code": "WYC-MI-WEIXIN"
    };

    const tasks = [
      {
        desc: "签到", 
        body: "", 
        url: "https://shop.laichon.com/api/v1/task/signComplete"
      },
      {
        desc: "观看视频", 
        body: "task_id=4",
        url: "https://shop.laichon.com/api/v1/task/taskComplete"
      },
      {
        desc: "充电任务", 
        body: "task_id=3", 
        url: "https://shop.laichon.com/api/v1/task/taskComplete"
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
          body
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
    $notify(notifyTitle, "", notifyBody);

  } catch (err) {
    console.log("脚本执行异常:", err);
  } finally {
    $done();
  }
})();


function doRequest(reqObj) {
  return new Promise((resolve) => {
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
  });
}
