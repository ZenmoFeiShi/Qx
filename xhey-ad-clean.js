var qx_xhey_ad_clean_done = false;
function qx_xhey_ad_clean_finish(result) {
  if (!qx_xhey_ad_clean_done) {
    qx_xhey_ad_clean_done = true;
    $done(result || {});
  }
}
try {
  var qx_xhey_ad_clean_body = $response && $response.body;
  if (!qx_xhey_ad_clean_body) {
    qx_xhey_ad_clean_finish({});
  } else {
    var qx_xhey_ad_clean_config = JSON.parse(qx_xhey_ad_clean_body);
    if (!qx_xhey_ad_clean_config || typeof qx_xhey_ad_clean_config !== "object" || Array.isArray(qx_xhey_ad_clean_config)) {
      qx_xhey_ad_clean_finish({});
    } else {
      qx_xhey_ad_clean_config.enableAppStoreOpt = 0;
      qx_xhey_ad_clean_config.adWindowEnable = 0;
      qx_xhey_ad_clean_config.splashShowType = 0;
      qx_xhey_ad_clean_config.interstitialShowType = 0;
      qx_xhey_ad_clean_config.rewardShowType = 0;
      qx_xhey_ad_clean_finish({ body: JSON.stringify(qx_xhey_ad_clean_config) });
    }
  }
} catch (e) {
  qx_xhey_ad_clean_finish({});
}
