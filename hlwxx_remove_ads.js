

var body = $response.body;

if (!body || (body.indexOf('<!doctype') === -1 && body.indexOf('<!DOCTYPE') === -1 && body.indexOf('<html') === -1)) {
  $done({ body: body });
} else {

var css = '<style id="hlwxx-adblock">'
  // 开屏弹窗
  + '#notice_container,.event-notice,.application-popup,'
  // 底部横条 + 广告栏 + 友情链接
  + '.addbox,.infomation,.post-content,'
  // 详情页广告标签+推荐应用+分享横幅
  + '.list-sec-top,.list-sec,#copy-img,'
  // 整个 footer（大事记/免费领现金/商务合作/加入我们等）
  + '.footer,'
  // 统计 iframe
  + 'iframe[src*="yandex"],iframe[src*="google"]'
  + '{display:none!important;height:0!important;overflow:hidden!important}'
  // 列表中广告条目
  + '.video-item:has(a.gotoclick),.video-item:has(a.tjtagmanager),'
  + '.video-item:has(a[adv_id]){display:none!important;height:0!important}'
  + '</style>';

var js = '<script id="hlwxx-adblock-js">'
  + '!function(){'
  + 'function c(){'
  + 'document.querySelectorAll(".video-item").forEach(function(e){'
  + 'var a=e.querySelector("a");'
  + 'if(a&&(a.classList.contains("gotoclick")||a.classList.contains("tjtagmanager")||a.hasAttribute("adv_id")))e.remove()});'
  + '["notice_container"].forEach(function(i){var e=document.getElementById(i);if(e)e.remove()});'
  + '[".application-popup",".addbox",".infomation",".post-content",".list-sec-top",".list-sec","#copy-img",".event-notice",".footer"]'
  + '.forEach(function(s){document.querySelectorAll(s).forEach(function(e){e.remove()})});'
  + 'document.querySelectorAll("script").forEach(function(s){'
  + 'var r=s.getAttribute("src")||"";'
  + 'if(r.indexOf("stats.kwvprfcr.xyz")>-1||r.indexOf("yandex.ru")>-1||r.indexOf("googletagmanager.com")>-1||r.indexOf("gtag/js")>-1)s.remove()})}'
  + 'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",c);else c();'
  + 'setTimeout(c,1500);setTimeout(c,4000)'
  + '}();'
  + '<\/script>';

body = body.replace('</head>', css + '</head>');
body = body.replace('</body>', js + '</body>');

body = body.replace(/<script[^>]+stats\.kwvprfcr\.xyz[^>]*><\/script>/gi, '');
body = body.replace(/<script[^>]+yandex\.ru\/metrika[^>]*><\/script>/gi, '');
body = body.replace(/<script[^>]+googletagmanager\.com\/gtag[^>]*><\/script>/gi, '');

$done({ body: body });
}
