//2025/07/26  22:52
/*
@Name：老百姓大药房小程序
@Author：怎么肥事号
[rewrite_local]
^https:\/\/mall\.lbxcn\.com\/mall\/scc-point-member\/crm-api\/bonus\/sign-in url script-request-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/LBXDYF.js

[task_local]
1 0 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/LBXDYF.js, tag=老百姓大药房签到, enabled=true

[MITM]
hostname = mall.lbxcn.com

*/

const key = "lbx_signin_data";
const signUrl = "https://mall.lbxcn.com/mall/scc-point-member/crm-api/bonus/sign-in";

if ($request) {
  const saved = {
    url: $request.url,
    method: $request.method,
    headers: $request.headers,
    body: $request.body || ""
  };

  $prefs.setValueForKey(JSON.stringify(saved), key);
  $notify("老百姓大药房", "参数获取成功", "");
  $done({});
} else {
  const saved = $prefs.valueForKey(key);
  if (!saved) {
    $notify("老百姓大药房", "❌ 参数未获取", "请先手动打开App签到触发请求");
    $done();
    return;
  }

  const info = JSON.parse(saved);
  const request = {
    url: signUrl,
    method: "POST",
    headers: info.headers,
    body: info.body
  };

  $task.fetch(request).then(response => {
    try {
      const obj = JSON.parse(response.body);
      if (obj.code === 0) {
        const days = obj.data?.consecutiveDay ?? "未知";
        const bonus = obj.data?.bonus ?? "未知";
        $notify("老百姓大药房签到成功", "", `已签到${days}天，获得积分：${bonus}`);
      } else if (obj.message) {
        $notify("老百姓大药房签到失败", "", obj.message);
      } else {
        $notify("老百姓大药房签到返回异常", "", response.body);
      }
    } catch (e) {
      console.log("解析失败: " + e);
      $notify("老百姓大药房签到异常", "", response.body);
    }
    $done();
  }, err => {
    console.log("请求异常: " + JSON.stringify(err));
    $notify("老百姓大药房签到失败", "网络异常", JSON.stringify(err));
    $done();
  });
}
