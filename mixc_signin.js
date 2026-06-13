//2026/06/13
/*
@Name：一点万象app 自动化签到
@Author：怎么肥事

[rewrite_local]
^https?:\/\/app\.mixcapp\.com\/mixc\/gateway url script-request-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/mixc_signin.js

[task_local]
30 8,20 * * * ^https?:\/\/app\.mixcapp\.com\/mixc\/gateway url script-request-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/mixc_signin.js, tag=一点万象签到, enabled=true

[MITM]
hostname = app.mixcapp.com 
*/

const $env = (function () {
  const isLoon = typeof $loon !== "undefined";
  const isSurge = typeof $httpClient !== "undefined" && !isLoon;
  const isQX = typeof $task !== "undefined";
  return { isLoon, isSurge, isQX, isCli: isLoon || isSurge };
})();

const STORE_KEY = "mixc_signin_params";

function readStore() {
  let v = null;
  if ($env.isQX) v = $prefs.valueForKey(STORE_KEY);
  else v = $persistentStore.read(STORE_KEY);
  if (!v) return null;
  try { return JSON.parse(v); } catch (e) { return null; }
}

function writeStore(obj) {
  const s = JSON.stringify(obj);
  if ($env.isQX) return $prefs.setValueForKey(s, STORE_KEY);
  return $persistentStore.write(s, STORE_KEY);
}

function notify(title, sub, body) {
  if ($env.isQX) $notify(title, sub, body);
  else $notify(title, sub, body);
}

function finish() { $done(); }

function httpPost(url, headers, body, cb) {
  if ($env.isQX) {
    $task.fetch({ url: url, method: "POST", headers: headers, body: body }).then(
      function (resp) { cb(null, resp.body); },
      function (err) { cb(err && (err.error || JSON.stringify(err)) || "fetch error", null); }
    );
  } else {
    $httpClient.post({ url: url, headers: headers, body: body }, function (err, resp, data) {
      if (err) cb(typeof err === "string" ? err : JSON.stringify(err), null);
      else cb(null, data);
    });
  }
}

function parseForm(str) {
  const out = {};
  if (!str) return out;
  str.split("&").forEach(function (kv) {
    const i = kv.indexOf("=");
    if (i < 0) return;
    const k = kv.substring(0, i);
    const v = kv.substring(i + 1);
    try { out[k] = decodeURIComponent(v); } catch (e) { out[k] = v; }
  });
  return out;
}

const SECRET = "P@Gkbu0shTNHjhM!7F";

function md5(string) {
  function RL(x, c) { return (x << c) | (x >>> (32 - c)); }
  function AU(x, y) {
    const x4 = (x & 0x40000000), y4 = (y & 0x40000000);
    const x8 = (x & 0x80000000), y8 = (y & 0x80000000);
    const r = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
    if (x4 & y4) return (r ^ 0x80000000 ^ x8 ^ y8);
    if (x4 | y4) { if (r & 0x40000000) return (r ^ 0xC0000000 ^ x8 ^ y8); else return (r ^ 0x40000000 ^ x8 ^ y8); }
    return (r ^ x8 ^ y8);
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return (x ^ y ^ z); }
  function I(x, y, z) { return (y ^ (x | (~z))); }
  function FF(a, b, c, d, x, s, ac) { a = AU(a, AU(AU(F(b, c, d), x), ac)); return AU(RL(a, s), b); }
  function GG(a, b, c, d, x, s, ac) { a = AU(a, AU(AU(G(b, c, d), x), ac)); return AU(RL(a, s), b); }
  function HH(a, b, c, d, x, s, ac) { a = AU(a, AU(AU(H(b, c, d), x), ac)); return AU(RL(a, s), b); }
  function II(a, b, c, d, x, s, ac) { a = AU(a, AU(AU(I(b, c, d), x), ac)); return AU(RL(a, s), b); }
  function CW(str) {
    let lWC; const lML = str.length, lNWT = lML + 8;
    const lNW = ((lNWT - (lNWT % 64)) / 64 + 1) * 16;
    const lWA = Array(lNW - 1); let lBP = 0, lBC = 0;
    while (lBC < lML) { lWC = (lBC - (lBC % 4)) / 4; lBP = (lBC % 4) * 8; lWA[lWC] = (lWA[lWC] | (str.charCodeAt(lBC) << lBP)); lBC++; }
    lWC = (lBC - (lBC % 4)) / 4; lBP = (lBC % 4) * 8; lWA[lWC] = lWA[lWC] | (0x80 << lBP);
    lWA[lNW - 2] = lML << 3; lWA[lNW - 1] = lML >>> 29; return lWA;
  }
  function WTH(lV) { let WTHV = "", WTHVT = "", lByte, lCount; for (lCount = 0; lCount <= 3; lCount++) { lByte = (lV >>> (lCount * 8)) & 255; WTHVT = "0" + lByte.toString(16); WTHV += WTHVT.substr(WTHVT.length - 2, 2); } return WTHV; }
  function U8E(s) { s = s.replace(/\r\n/g, "\n"); let u = ""; for (let n = 0; n < s.length; n++) { const c = s.charCodeAt(n); if (c < 128) { u += String.fromCharCode(c); } else if ((c > 127) && (c < 2048)) { u += String.fromCharCode((c >> 6) | 192); u += String.fromCharCode((c & 63) | 128); } else { u += String.fromCharCode((c >> 12) | 224); u += String.fromCharCode(((c >> 6) & 63) | 128); u += String.fromCharCode((c & 63) | 128); } } return u; }
  let x = [], k, AA, BB, CC, DD, a, b, c, d;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  string = U8E(string); x = CW(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A); c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF); c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193); c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340); c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6); c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8); c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681); c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9); c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA); c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5); c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97); c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92); c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0); c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82); d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235); c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB); b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AU(a, AA); b = AU(b, BB); c = AU(c, CC); d = AU(d, DD);
  }
  return (WTH(a) + WTH(b) + WTH(c) + WTH(d)).toLowerCase();
}

function calcSign(p) {
  const keys = Object.keys(p).sort();
  let t = "";
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i], v = p[k];
    if (v || v === 0 || v === "") t += k + "=" + v + "&";
  }
  return md5(t + SECRET);
}

function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function nowDate() {
  const d = new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
}

const KEEP = ["X-Mixc-Swimlane", "appId", "appVersion", "deviceParams", "imei", "mallNo", "osVersion", "params", "platform", "token"];

function doCapture() {
  const url = $request.url || "";
  if (url.indexOf("/mixc/gateway") < 0) { finish(); return; }
  const form = parseForm($request.body || "");
  if (form.platform !== "h5" || !form.token || !form.deviceParams) { finish(); return; }
  const saved = {};
  for (let i = 0; i < KEEP.length; i++) {
    const k = KEEP[i];
    if (form[k] !== undefined) saved[k] = form[k];
  }
  if (!saved.appId) saved.appId = "68a91a5bac6a4f3e91bf4b42856785c6";
  if (!saved.platform) saved.platform = "h5";
  if (!saved.apiVersion) saved.apiVersion = "1.0";
  const prev = readStore();
  const changed = !prev || prev.token !== saved.token || prev.mallNo !== saved.mallNo;
  writeStore(saved);
  if (changed) notify("万象星签到", "参数已更新 ✅", "商场 " + saved.mallNo + " · token 已保存，可定时签到");
  finish();
}

function buildBody(p) {
  const parts = [];
  Object.keys(p).forEach(function (k) {
    parts.push(k + "=" + encodeURIComponent(p[k]));
  });
  return parts.join("&");
}

function b64encode(str) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "", i = 0;
  const bytes = [];
  for (let n = 0; n < str.length; n++) {
    const c = str.charCodeAt(n);
    if (c < 128) bytes.push(c);
    else if (c < 2048) { bytes.push((c >> 6) | 192); bytes.push((c & 63) | 128); }
    else { bytes.push((c >> 12) | 224); bytes.push(((c >> 6) & 63) | 128); bytes.push((c & 63) | 128); }
  }
  while (i < bytes.length) {
    const b1 = bytes[i++];
    const b2 = i < bytes.length ? bytes[i++] : NaN;
    const b3 = i < bytes.length ? bytes[i++] : NaN;
    const e1 = b1 >> 2;
    const e2 = ((b1 & 3) << 4) | (b2 >> 4);
    let e3 = ((b2 & 15) << 2) | (b3 >> 6);
    let e4 = b3 & 63;
    if (isNaN(b2)) { e3 = e4 = 64; }
    else if (isNaN(b3)) { e4 = 64; }
    out += chars.charAt(e1) + chars.charAt(e2) + (e3 === 64 ? "=" : chars.charAt(e3)) + (e4 === 64 ? "=" : chars.charAt(e4));
  }
  return out;
}

function doSign() {
  const cfg = readStore();
  if (!cfg || !cfg.token) {
    notify("万象星签到", "未抓到参数 ❌", "请先打开万象星App进入签到页，让代理捕获参数");
    finish();
    return;
  }
  const ms = Date.now();
  const p = {
    "X-Mixc-Swimlane": cfg["X-Mixc-Swimlane"] || "s1",
    action: "mixc.app.memberSign.sign",
    apiVersion: cfg.apiVersion || "1.0",
    appId: cfg.appId || "68a91a5bac6a4f3e91bf4b42856785c6",
    appVersion: cfg.appVersion || "4.2.0",
    date: nowDate(),
    deviceParams: cfg.deviceParams,
    imei: cfg.imei || "",
    mallNo: cfg.mallNo,
    osVersion: cfg.osVersion || "26.5",
    params: b64encode(JSON.stringify({ mallNo: cfg.mallNo })),
    platform: "h5",
    t: "" + ms,
    timestamp: "" + (ms + 3),
    token: cfg.token
  };
  p.sign = calcSign(p);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) crland/4.4.0 grayscale/0 /MIXCAPP/4.2.0 AnalysysAgent/Hybrid",
    "Origin": "https://app.mixcapp.com",
    "Referer": "https://app.mixcapp.com/m/m-" + cfg.mallNo + "/signIn?mallNo=" + cfg.mallNo,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9"
  };
  httpPost("https://app.mixcapp.com/mixc/gateway", headers, buildBody(p), function (err, body) {
    if (err) { notify("万象星签到", "请求异常 ❌", "" + err); finish(); return; }
    let r = null;
    try { r = JSON.parse(body); } catch (e) { notify("万象星签到", "解析失败 ❌", (body || "").slice(0, 100)); finish(); return; }
    if (r.code === 0 && r.data) {
      const got = r.data.point != null ? r.data.point : (r.data.signDataMap && r.data.signDataMap.todayPoint);
      const total = r.data.userPoints != null ? r.data.userPoints : "";
      notify("万象星签到", "签到成功 🎉", "本次+" + got + "积分" + (total !== "" ? " · 当前" + total : ""));
    } else if (r.message && r.message.indexOf("已签到") >= 0) {
      notify("万象星签到", "今日已签到 ✅", r.message);
    } else if (r.message && (r.message.indexOf("频繁") >= 0 || r.message.indexOf("稍后") >= 0)) {
      notify("万象星签到", "请求频繁 ⏳", r.message + "（今日大概率已签到，稍后再看）");
    } else if (r.code === 401 || (r.message && (r.message.indexOf("登录") >= 0 || r.message.indexOf("token") >= 0))) {
      notify("万象星签到", "登录态失效 ❌", "请重新打开App进签到页刷新参数");
    } else {
      notify("万象星签到", "签到失败 ❌", "code=" + r.code + " " + (r.message || ""));
    }
    finish();
  });
}

if (typeof $request !== "undefined" && $request && $request.url) {
  doCapture();
} else {
  doSign();
}
