var qx97_body = $response.body;

if (!qx97_body || !/(?:<!doctype|<html)/i.test(qx97_body)) {
  $done({});
} else {
  try {
    var qx97_clear_player_ads = function (match, prefix, quote, raw) {
      try {
        var cfg = JSON.parse(raw);
        var changed = false;
        if (cfg && Array.isArray(cfg.pre_ads)) {
          cfg.pre_ads = [];
          changed = true;
        }
        if (cfg && Array.isArray(cfg.post_ads)) {
          cfg.post_ads = [];
          changed = true;
        }
        if (cfg && (Object.prototype.hasOwnProperty.call(cfg, 'ads_jump_time') || changed)) {
          cfg.ads_jump_time = -1;
          changed = true;
        }
        return changed ? prefix + quote + JSON.stringify(cfg) + quote : match;
      } catch (e) {
        return match;
      }
    };

    qx97_body = qx97_body.replace(/(\bdata-config\s*=\s*)(['"])([\s\S]*?)\2/gi, qx97_clear_player_ads);

    var qx97_css = '<style id="qx97-adblock">'
      + '.adspop,.xqbj-component-adfloat,#adFloat,.horizontal-banner,.article-ads-btn,.article-bottom-apps,.ads-title,article.no-mask,article.post-card-ads,.post-card-ads,.bottom-ads,.message-ad-item,'
      + 'script[src*="adfloat.js"],script[src*="bottom_ad_poll"],script[src*="googletagmanager"],script[src*="google-analytics"],'
      + 'iframe[src*="yandex"],iframe[src*="googletagmanager"],iframe[src*="google-analytics"]'
      + '{display:none!important;width:0!important;height:0!important;max-height:0!important;min-height:0!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}'
      + '</style>';

    var qx97_js = '<script id="qx97-adblock-js">'
      + '!function(){'
      + 'function qx97_clean(){'
      + 'var s=['
      + '".adspop",".xqbj-component-adfloat","#adFloat",".horizontal-banner",".article-ads-btn",".article-bottom-apps",".ads-title",'
      + '"article.no-mask","article.post-card-ads",".post-card-ads",".bottom-ads",".message-ad-item",'
      + '"[class*=adfloat]","[id*=adFloat]","[data-ad-type]","[data-ad_type]","[data-ad-id]","[data-ad_id]"'
      + '];'
      + 's.forEach(function(x){document.querySelectorAll(x).forEach(function(e){e.remove()})});'
      + 'document.querySelectorAll("script,link,iframe").forEach(function(e){'
      + 'var u=(e.src||e.href||"").toLowerCase();'
      + 'if(/adfloat|bottom_ad_poll|popup-feed|googletagmanager|google-analytics|mc\\.yandex|cloudflareinsights|zyudkkup|shuifeng|cghhqca/.test(u))e.remove()'
      + '});'
      + 'document.querySelectorAll("a.tjtagmanager").forEach(function(e){'
      + 'var p=e.closest(".horizontal-banner,.article-ads-btn,.article-bottom-apps,.ads-title,article,.bottom-ads,.message-ad-item");'
      + 'if(p)p.remove();else e.remove()'
      + '});'
      + 'try{window.dataLayer=[];window.tjDataLayer=[];window.gtag=function(){};window.ym=function(){};window.tjtag=function(){}}catch(e){}'
      + '}'
      + 'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",qx97_clean);else qx97_clean();'
      + 'setTimeout(qx97_clean,500);setTimeout(qx97_clean,1500);setTimeout(qx97_clean,4000);setTimeout(qx97_clean,8000)'
      + '}();<\/script>';

    qx97_body = qx97_body.replace(/<script[^>]+(?:adfloat\.js|bottom_ad_poll|googletagmanager|google-analytics|mc\.yandex|cloudflareinsights|tjtag)[^>]*>[\s\S]*?<\/script>/gi, '');
    qx97_body = qx97_body.replace(/<link[^>]+(?:AiSuite|im\.css|googletagmanager|google-analytics)[^>]*>/gi, '');
    qx97_body = qx97_body.replace(/<iframe[^>]+(?:yandex|googletagmanager|google-analytics)[^>]*>[\s\S]*?<\/iframe>/gi, '');
    qx97_body = qx97_body.replace(/<article\b[^>]*class=["'][^"']*\bno-mask\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi, '');
    qx97_body = qx97_body.replace(/<div\b[^>]*class=["'][^"']*\bhorizontal-banner\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
    qx97_body = qx97_body.replace(/<div\b[^>]*class=["'][^"']*\barticle-ads-btn\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
    qx97_body = qx97_body.replace(/<div\b[^>]*class=["'][^"']*\barticle-bottom-apps\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
    qx97_body = qx97_body.replace(/<div\b[^>]*class=["'][^"']*\bads-title\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
    qx97_body = qx97_body.replace(/<div\b[^>]*class=["'][^"']*\bbottom-ads\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
    qx97_body = qx97_body.replace(/<div\b[^>]*class=["'][^"']*\badspop\b[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
    qx97_body = qx97_body.replace(/<script[^>]*id=["']qx97-adblock(?:-js)?["'][^>]*>[\s\S]*?<\/script>/gi, '');
    qx97_body = qx97_body.replace(/<\/head>/i, qx97_css + '</head>');
    qx97_body = qx97_body.replace(/<\/body>/i, qx97_js + '</body>');
    $done({ body: qx97_body });
  } catch (e) {
    $done({});
  }
}
