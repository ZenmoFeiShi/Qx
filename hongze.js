//2026/07/06
/*
@Name：洪泽论坛 每日签到（多账号）
@Author：怎么肥事
[rewrite_local]
^https:\/\/app\.hongze\.net\/mag\/user\/v1\/User\/getUserInfo url script-request-header https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/hongze.js

[task_local]
8 1 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/hongze.js, tag=洪泽论坛签到, enabled=true

[MITM]
hostname = app.hongze.net

*/

const ckKey = "hongze_accounts";

function readAccounts() {
  try {
    const raw = $prefs.valueForKey(ckKey);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === "object" ? obj : {};
  } catch (e) {
    return {};
  }
}

function saveAccounts(obj) {
  $prefs.setValueForKey(JSON.stringify(obj), ckKey);
}

if ($request) {
  const headers = $request.headers;

  const cookie = headers["Cookie"] || headers["cookie"] || "";
  const ua = headers["User-Agent"] || headers["user-agent"] || "";

  const persist = cookie
    .split(";")
    .map(s => s.trim())
    .filter(s => /^[a-f0-9]{32}=[a-f0-9]{32}$/i.test(s))
    .join("; ");

  if (!persist) {
    $done({});
  } else {
    const uid = persist.split("=")[1];

    const accounts = readAccounts();
    const isNew = !accounts[uid];

    accounts[uid] = {
      "User-Agent": ua || "MAGAPPX",
      "Cookie": persist
    };

    saveAccounts(accounts);

    const total = Object.keys(accounts).length;
    console.log(`【洪泽论坛】${isNew ? "新增" : "更新"}账号 ${uid}，当前共 ${total} 个`);

    $notify("洪泽论坛签到", `${isNew ? "新增" : "更新"}账号成功`, `当前共 ${total} 个账号，凭证已保存`);
    $done({});
  }
} else {
  const accounts = readAccounts();
  const uids = Object.keys(accounts);

  if (uids.length === 0) {
    $notify("洪泽论坛签到", "⚠️ 未获取到账号", "请先打开App进入「我的」页面触发获取");
    console.log("【洪泽论坛】无账号，无法执行签到");
    $done();
    return;
  }

  function signIn(uid, ckObj) {
    const request = {
      url: "https://app.hongze.net/mag/sign/v1/sign/sign",
      method: "GET",
      headers: {
        "Host": "app.hongze.net",
        "User-Agent": ckObj["User-Agent"],
        "Cookie": ckObj["Cookie"],
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "X-Requested-With": "XMLHttpRequest"
      }
    };

    return new Promise(resolve => {
      $task.fetch(request).then(res => {
        console.log(`【洪泽论坛】账号${uid} 响应：${res.statusCode}\n${res.body}`);
        let line;
        try {
          const data = JSON.parse(res.body);
          if (data.success === true || data.code === 100 || data.code === 0) {
            const des = data.data?.des || "签到成功";
            const cont = data.data?.continue_des || "";
            line = `✅ ${uid.slice(0, 6)}… ${des}${cont ? ` | ${cont}` : ""}`;
          } else {
            line = `⚠️ ${uid.slice(0, 6)}… ${data.msg || "失败"}`;
          }
        } catch (e) {
          line = `⚠️ ${uid.slice(0, 6)}… 解析失败，Cookie可能失效`;
        }
        resolve(line);
      }, err => {
        console.log(`【洪泽论坛】账号${uid} 请求失败：${err.error}`);
        resolve(`⚠️ ${uid.slice(0, 6)}… 请求失败 ${err.error || ""}`);
      });
    });
  }

  (async () => {
    const results = [];
    for (const uid of uids) {
      results.push(await signIn(uid, accounts[uid]));
    }
    $notify("洪泽论坛签到完成", `共 ${uids.length} 个账号`, results.join("\n"));
    console.log(`【洪泽论坛】全部完成：\n${results.join("\n")}`);
    $done();
  })();
}