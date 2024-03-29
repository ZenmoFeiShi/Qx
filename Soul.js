//2024-01-25 13:41  感谢@可莉对去除开屏广告提供的帮助
const url = $request.url;
const scriptEnvironment = typeof $task !== 'undefined' ? 'Surge' : (typeof $loon !== 'undefined' ? 'Loon' : (typeof $httpClient !== 'undefined' ? 'Qx' : 'Unknown'));

if (!$response.body || scriptEnvironment === 'Unknown') {
  $done({});
}

let obj = JSON.parse($response.body);

const shouldDeleteData = (url) => {
  return url.includes("/post/homepage/guide/card") ||
         url.includes("/furion/position/content") ||
         url.includes("/hot/soul/rank") ||
         url.includes("/post/gift/list") ||
         url.includes("/mobile/app/version/queryIos") ||
         url.includes("/teenager/config") ||
         url.includes("/winterfell/v2/getIpByDomain") || 
         url.includes("/official/scene/module");
};

const shouldModifyLimitInfo = (url, obj) => {
  return url.includes("/chat/limitInfo") && obj.data && obj.data.limit !== undefined;
};

if (url.includes("/vip/meet/userInfo")) {
  if (obj.data.superStarDTO && obj.data.superStarDTO.superVIP !== undefined) {
    obj.data.superStarDTO.superVIP = true;
    obj.data.superStarDTO.validTime = 9887893999000;
    obj.data.flyPackageDTO.hasFlyPackage = true;
  }
}

if (url.includes("/privilege/supervip/status")) {
  if (obj.data.superVIP !== undefined) {
    obj.data.superVIP = true;
    obj.data.remainDay = 9887893999000;
    obj.data.hasCancelVIPSubscription = false;
    obj.data.hasCancelVIPSubOfIAP = false;
    obj.data.hasFlyPackage = true;
  }
}

if (!obj.data || shouldDeleteData(url)) {
  delete obj.data;
}

if (shouldModifyLimitInfo(url, obj)) {
  obj.data.limit = false;
}

if (url.includes("/post/recSquare/subTabs")) {
  obj.data = obj.data.filter(item => [7, 6, 2].includes(item.tabType));
}

$done({ body: JSON.stringify(obj) });
