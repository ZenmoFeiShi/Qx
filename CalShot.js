//2026/07/04
/*
@Name：CalShot 每日打卡
@Author：怎么肥事
[rewrite_local]
^https:\/\/calshotapi\.sdtsdt\.net\/api\/v1\/(check-ins\/statistics|co-builder\/profile) url script-request-header https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/CalShot.js

[task_local]
1 8 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/CalShot.js, tag=CalShot每日打卡, enabled=true

[MITM]
hostname = calshotapi.sdtsdt.net

*/

const ckKey = "calshot_checkin_headers";

if ($request) {
  const headers = $request.headers;

  const auth = headers["Authorization"] || headers["authorization"] || "";

  if (!auth) {
    $done({});
  } else {
    const ckObj = {
      "User-Agent": headers["User-Agent"] || headers["user-agent"] || "Dart/3.11 (dart:io)",
      "Authorization": auth
    };

    $prefs.setValueForKey(JSON.stringify(ckObj), ckKey);

    console.log(`【CalShot】请求头获取成功：\n${JSON.stringify(ckObj, null, 2)}`);

    $notify("CalShot 打卡", "请求头获取成功", "已保存，详情见日志");
    $done({});
  }
} else {
  const headersRaw = $prefs.valueForKey(ckKey);

  if (!headersRaw) {
    $notify("CalShot 打卡", "⚠️ 未获取到请求头", "请先手动打开App触发获取");
    console.log("【CalShot】未获取到请求头，无法执行打卡");
    $done();
    return;
  }

  const ckObj = JSON.parse(headersRaw);

  const request = {
    url: "https://calshotapi.sdtsdt.net/api/v1/check-ins",
    method: "POST",
    headers: {
      "User-Agent": ckObj["User-Agent"],
      "Authorization": ckObj["Authorization"],
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip"
    },
    body: JSON.stringify({ "checkInType": "daily" })
  };

  $task.fetch(request).then(res => {
    console.log(`【CalShot】打卡响应：\n状态码：${res.statusCode}\n返回内容：\n${res.body}`);

    try {
      const data = JSON.parse(res.body);

      if (data.code === 0) {
        const date = data.data?.checkInDate || "";
        $notify("CalShot 打卡成功", "", `已完成 ${date} 每日打卡 +5 共建积分`);
      } else {
        $notify("CalShot 打卡提示", "", data.message || res.body);
      }
    } catch (e) {
      console.log(`【CalShot】解析失败，异常信息：${e}\n原始响应：${res.body}`);
      $notify("CalShot 打卡", "⚠️ 解析失败", "详情见日志");
    }
    $done();
  }, err => {
    console.log(`【CalShot】请求失败，错误信息：${err.error}`);
    $notify("CalShot 打卡", "⚠️ 请求失败", err.error || "");
    $done();
  });
}
