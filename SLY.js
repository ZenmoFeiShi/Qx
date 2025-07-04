//2025/07/04  14:17
/*
@Name：随乐游公众号
@Author：怎么肥事号
[rewrite_local]
^https:\/\/m\.suileyoo\.com\/api\/user\/profile url script-request-header https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/SLY.js

[task_local]
1 0 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/SLY.js, tag=随乐游, enabled=true

[MITM]
hostname = m.suileyoo.com

*/

const ckKey = "suileyoo_signin_headers";

if ($request) {
  const headers = $request.headers;

  const ckObj = {
    "User-Agent": headers["User-Agent"] || "",
    "Cookie": headers["Cookie"] || "",
    "Yoo-Uuid": headers["Yoo-Uuid"] || "",
    "x-csrf-token": headers["x-csrf-token"] || ""
  };

  $prefs.setValueForKey(JSON.stringify(ckObj), ckKey);

  $notify("随乐游 签到", "请求头获取成功", "已保存 ");
  $done({});
} else {
  const headersRaw = $prefs.valueForKey(ckKey);

  if (!headersRaw) {
    $notify("随乐游 签到", "⚠️ 未获取到请求头", "请先手动打开App触发获取");
    $done();
  }

  const ckObj = JSON.parse(headersRaw);

  const url = "https://m.suileyoo.com/api/v3/activity/signin/latest";

  const request = {
    url: url,
    method: "POST",
    headers: {
      "User-Agent": ckObj["User-Agent"],
      "Cookie": ckObj["Cookie"],
      "Yoo-Uuid": ckObj["Yoo-Uuid"],
      "x-csrf-token": ckObj["x-csrf-token"]
    }
  };

  $task.fetch(request).then(res => {
    try {
      const data = JSON.parse(res.body);

      if (data.code === 0) {
        const rewardTime = data.data?.reward_play_time || "未知";
        $notify("随乐游 签到成功", "", `赠送游戏时间：${rewardTime}分钟`);
      } else if (data.code === 10001) {
        $notify("随乐游 签到提示", "", data.message || "无返回信息");
      } else {
        console.log(`签到失败：${res.body}`);
      }
    } catch (e) {
      console.log(`解析失败：${res.body}`);
    }
    $done();
  }, err => {
    console.log(`请求失败：${err.error}`);
    $done();
  });
}
