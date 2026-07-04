//2026/07/04
/*
@Name：洪泽论坛 每日签到
@Author：怎么肥事
[rewrite_local]
^https:\/\/app\.hongze\.net\/mag\/user\/v1\/user\/deviceLogin url script-request-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/hongze.js

[task_local]
8 1 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/hongze.js, tag=洪泽论坛签到, enabled=true

[MITM]
hostname = app.hongze.net

*/

const ckKey = "hzlt_device_login";
const BASE = "https://app.hongze.net";

if ($request) {
  const headers = $request.headers || {};

  const cookie = headers["Cookie"] || headers["cookie"] || "";
  const ua = headers["User-Agent"] || headers["user-agent"] || "";

  if (!cookie && !$request.body) {
    $done({});
  } else {
    const ckObj = {
      url: $request.url,
      method: $request.method || "POST",
      headers: headers,
      body: typeof $request.body === "string" ? $request.body : ""
    };

    $prefs.setValueForKey(JSON.stringify(ckObj), ckKey);

    console.log(`【洪泽论坛】设备登录凭证获取成功：\nUA：${ua}\nCookie：${cookie}`);

    $notify("洪泽论坛签到", "设备凭证获取成功", "已保存，后续自动续期签到");
    $done({});
  }
} else {
  const raw = $prefs.valueForKey(ckKey);

  if (!raw) {
    $notify("洪泽论坛签到", "⚠️ 未获取到设备凭证", "请打开App进入「我的」页面触发获取");
    console.log("【洪泽论坛】未获取到设备凭证，无法执行签到");
    $done();
    return;
  }

  const dev = JSON.parse(raw);

  function lower(o) {
    const r = {};
    for (const k in o) r[k.toLowerCase()] = o[k];
    return r;
  }

  function parseSetCookie(hs) {
    const h = lower(hs);
    const raw = h["set-cookie"];
    if (!raw) return {};
    const out = {};
    const segs = Array.isArray(raw) ? raw : String(raw).split(/,(?=[^;]+=[^;]+)/);
    for (const seg of segs) {
      const first = String(seg).split(";")[0].trim();
      const i = first.indexOf("=");
      if (i <= 0) continue;
      const name = first.slice(0, i).trim();
      if (/^(expires|max-age|path|domain|httponly|secure|samesite)$/i.test(name)) continue;
      out[name] = first.slice(i + 1).trim();
    }
    return out;
  }

  function mergeCookie(oldCk, patch) {
    const map = {};
    String(oldCk || "").split(";").forEach(p => {
      const i = p.indexOf("=");
      if (i > 0) map[p.slice(0, i).trim()] = p.slice(i + 1).trim();
    });
    Object.assign(map, patch);
    return Object.entries(map).map(([k, v]) => `${k}=${v}`).join("; ");
  }

  const ua = lower(dev.headers)["user-agent"] || "MAGAPPX";

  function fetchP(opt) {
    return new Promise((resolve, reject) => {
      $task.fetch(opt).then(
        r => resolve({ status: r.statusCode, headers: r.headers || {}, body: r.body || "" }),
        e => reject(e && e.error ? e.error : e)
      );
    });
  }

  function req(cookie, path, method, form) {
    const headers = {
      "Host": "app.hongze.net",
      "Cookie": cookie,
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      "User-Agent": ua,
      "X-Requested-With": "XMLHttpRequest"
    };
    let body;
    if (form) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      body = Object.entries(form).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    }
    const o = { url: BASE + path, method: method || "GET", headers };
    if (body != null) o.body = body;
    return fetchP(o).then(r => {
      try { return JSON.parse(r.body); } catch { return { _raw: r.body }; }
    });
  }

  (async () => {
    try {
      const dh = Object.assign({}, dev.headers);
      delete dh["Content-Length"];
      delete dh["content-length"];
      const opt = { url: dev.url, method: dev.method || "POST", headers: dh };
      if (dev.body) opt.body = dev.body;

      const res = await fetchP(opt);
      const patch = parseSetCookie(res.headers);
      const baseCk = lower(dev.headers)["cookie"] || "";
      const cookie = mergeCookie(baseCk, patch);

      console.log(`【洪泽论坛】续期完成，新Cookie：${cookie}`);

      const info1 = await req(cookie, "/mag/user/v1/user/myCenter");
      const name = (info1 && info1.data && info1.data.name) || "用户";
      const scoreBefore = info1 && info1.data ? Number(info1.data.score) : null;

      const signRes = await req(cookie, "/mag/sign/v1/sign/sign");
      const signMsg = (signRes && (signRes.msg || (signRes.data && signRes.data.des))) || "已处理";

      const cid = 1000 + Math.floor(Math.random() * 89000);
      await req(cookie, "/mag/circle/v1/show/contentAddApplaud", "POST", { content_id: cid });

      for (let i = 0; i < 5; i++) await req(cookie, "/mag/user/v1/share/successCallBack");
      await req(cookie, "/mag/user/v1/GradeScore/getScoreTaskReward?id=2141772");

      const info2 = await req(cookie, "/mag/user/v1/user/myCenter");
      const scoreAfter = info2 && info2.data ? Number(info2.data.score) : null;
      const delta = scoreBefore != null && scoreAfter != null ? scoreAfter - scoreBefore : null;

      const sub = `${name} 积分：${scoreAfter != null ? scoreAfter : "-"}${delta != null ? `（+${delta}）` : ""}`;
      $notify("洪泽论坛签到成功", sub, `签到：${signMsg}`);
      console.log(`【洪泽论坛】${sub}\n签到：${signMsg}`);
      $done();
    } catch (e) {
      console.log(`【洪泽论坛】签到异常：${e}`);
      $notify("洪泽论坛签到", "⚠️ 签到失败", String(e));
      $done();
    }
  })();
}