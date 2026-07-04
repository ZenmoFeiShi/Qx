//2026/07/04
/*
@Name：洪泽论坛 每日签到
@Author：怎么肥事
[rewrite_local]
^https:\/\/app\.hongze\.net\/mag\/user\/v1\/User\/getUserInfo url script-request-header https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/hongze.js

[task_local]
8 1 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/hongze.js, tag=洪泽论坛签到, enabled=true

[MITM]
hostname = app.hongze.net

*/

const ckKey = "hongze_signin_headers";

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
    const ckObj = {
      "User-Agent": ua || "MAGAPPX",
      "Cookie": persist
    };

    $prefs.setValueForKey(JSON.stringify(ckObj), ckKey);

    console.log(`【洪泽论坛】长效Cookie获取成功：\n${persist}`);

    $notify("洪泽论坛签到", "Cookie获取成功", "已保存长效凭证，后续自动签到");
    $done({});
  }
} else {
  const headersRaw = $prefs.valueForKey(ckKey);

  if (!headersRaw) {
    $notify("洪泽论坛签到", "⚠️ 未获取到Cookie", "请先打开App进入「我的」页面触发获取");
    console.log("【洪泽论坛】未获取到Cookie，无法执行签到");
    $done();
    return;
  }

  const ckObj = JSON.parse(headersRaw);

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

  $task.fetch(request).then(res => {
    console.log(`【洪泽论坛】签到响应：\n状态码：${res.statusCode}\n返回内容：\n${res.body}`);

    try {
      const data = JSON.parse(res.body);

      if (data.success === true || data.code === 100 || data.code === 0) {
        const des = data.data?.des || "签到成功";
        const cont = data.data?.continue_des || "";
        $notify("洪泽论坛签到成功", des, cont);
      } else {
        $notify("洪泽论坛签到提示", "", data.msg || res.body);
      }
    } catch (e) {
      console.log(`【洪泽论坛】解析失败：${e}\n原始响应：${res.body}`);
      $notify("洪泽论坛签到", "⚠️ 解析失败", "Cookie可能已失效，请重新打开App");
    }
    $done();
  }, err => {
    console.log(`【洪泽论坛】请求失败：${err.error}`);
    $notify("洪泽论坛签到", "⚠️ 请求失败", err.error || "");
    $done();
  });
}
