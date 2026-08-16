var body = $response.body;

if (!body || !/(?:<!doctype|<html)/i.test(body)) {
  $done({});
} else {
  try {
    body = body.replace(/(\bdata-config\s*=\s*')([^']*)(')/gi, function (_, open, raw, close) {
      try {
        var config = JSON.parse(raw);
        var keys = [
          "pre_ads",
          "post_ads",
          "preAds",
          "postAds",
          "video_ads_url",
          "video_ads_url_h",
          "backend_video_ads_url",
          "backend_video_ads_url_h",
          "ads_jump_url",
          "backend_ads_jump_url"
        ];
        var changed = false;
        for (var i = 0; i < keys.length; i++) {
          if (Object.prototype.hasOwnProperty.call(config, keys[i])) {
            config[keys[i]] = [];
            changed = true;
          }
        }
        return changed ? open + JSON.stringify(config) + close : _;
      } catch (e) {
        return _;
      }
    });

    var css = '<style id="hl-adblock">'
      + '#notice_container,.event-notice,.application-popup,'
      + '.addbox,.download,.infomation,.post-content,'
      + '.list-sec-top,.list-sec,'
      + '#copy-img,'
      + '.slider-banners,'
      + '.footer,'
      + 'iframe[src*="yandex"],iframe[src*="google"],iframe[src*="kwvprfcr"]'
      + '{display:none!important;height:0!important;overflow:hidden!important;opacity:0!important}'
      + '.video-item:has(a.gotoclick),'
      + '.video-item:has(a.tjtagmanager),'
      + '.video-item:has(a[adv_id])'
      + '{display:none!important;height:0!important}'
      + '</style>';

    var js = '<script id="hl-adblock-js">'
      + '!function(){'
      + 'function isAdItem(e){'
      + 'var a=e.querySelector("a");'
      + 'if(a&&(a.classList.contains("gotoclick")||a.classList.contains("tjtagmanager")||a.hasAttribute("adv_id")))return true;'
      + 'var t=e.querySelector("h2.title,div.title");'
      + 'if(t&&!t.textContent.trim())return true;'
      + 'return false}'
      + 'function clean(){'
      + 'document.querySelectorAll(".video-item").forEach(function(e){if(isAdItem(e))e.remove()});'
      + '["notice_container"].forEach(function(i){var e=document.getElementById(i);if(e)e.remove()});'
      + '[".application-popup",".event-notice",".addbox",".download",".infomation",".post-content",'
      + '".list-sec-top",".list-sec","#copy-img",".slider-banners",".footer"]'
      + '.forEach(function(s){document.querySelectorAll(s).forEach(function(e){e.remove()})});'
      + 'document.querySelectorAll("script").forEach(function(s){'
      + 'var r=s.getAttribute("src")||"";'
      + 'if(r.indexOf("stats.kwvprfcr.xyz")>-1||r.indexOf("yandex.ru")>-1||r.indexOf("googletagmanager.com")>-1||r.indexOf("gtag/js")>-1||r.indexOf("cghhqca.cc")>-1||r.indexOf("cloudflareinsights.com")>-1||r.indexOf("shuifeng.cc")>-1||r.indexOf("zyudkkup.com")>-1)s.remove()});'
      + 'try{window.plausible=function(){};window.gtag=function(){};window.ym=function(){};window.dataLayer=[];window.tjDataLayer=[];window.tjtag=function(){};window.tjtag2=function(){}}catch(e){}'
      + '}'
      + 'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",clean);else clean();'
      + 'setTimeout(clean,1500);setTimeout(clean,4000);setTimeout(clean,8000)'
      + '}();'
      + '<\/script>';

    if (body.indexOf('id="hl-adblock"') === -1) {
      body = body.replace(/<\/head>/i, css + '</head>');
    }
    if (body.indexOf('id="hl-adblock-js"') === -1) {
      body = body.replace(/<\/body>/i, js + '</body>');
    }

    body = body.replace(/<script[^>]+stats\.kwvprfcr\.xyz[^>]*><\/script>/gi, '');
    body = body.replace(/<script[^>]+yandex\.ru\/metrika[^>]*><\/script>/gi, '');
    body = body.replace(/<script[^>]+googletagmanager\.com\/gtag[^>]*><\/script>/gi, '');
    body = body.replace(/<script[^>]+cloudflareinsights\.com[^>]*><\/script>/gi, '');
    body = body.replace(/<script[^>]+shuifeng\.cc[^>]*><\/script>/gi, '');
    body = body.replace(/<script[^>]+zyudkkup\.com[^>]*><\/script>/gi, '');

    body = body.replace(/"video_ads_url":\s*\[[^\]]*\]/g, '"video_ads_url":[]');
    body = body.replace(/"video_ads_url_h":\s*\[[^\]]*\]/g, '"video_ads_url_h":[]');
    body = body.replace(/"backend_video_ads_url":\s*\[[^\]]*\]/g, '"backend_video_ads_url":[]');
    body = body.replace(/"backend_video_ads_url_h":\s*\[[^\]]*\]/g, '"backend_video_ads_url_h":[]');
    body = body.replace(/"ads_jump_url":\s*\[[^\]]*\]/g, '"ads_jump_url":[]');
    body = body.replace(/"backend_ads_jump_url":\s*\[[^\]]*\]/g, '"backend_ads_jump_url":[]');

    $done({ body: body });
  } catch (e) {
    $done({});
  }
}
