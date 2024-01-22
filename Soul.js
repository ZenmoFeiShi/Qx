//2024-01-22 09:43
const url = $request.url;
let obj = JSON.parse($response.body);

const shouldDeleteData = (url) => {
  return url.includes("/post/homepage/guide/card") ||
         url.includes("/furion/position/content") ||
         url.includes("/hot/soul/rank") ||
         url.includes("/post/gift/list") ||
         url.includes("/mobile/app/version/queryIos");
};

const shouldModifyLimitInfo = (url, obj) => {
  return url.includes("/chat/limitInfo") && obj.data && obj.data.limit !== undefined;
};

const supportedEnvironments = ["Qx", "Loon", "Surge"];
const currentEnvironment = $request.headers["User-Agent"];

if (!currentEnvironment || !supportedEnvironments.some(env => currentEnvironment.includes(env))) {
  $done({});
}

if (!obj.data || shouldDeleteData(url)) {
  delete obj.data;
}

if (shouldModifyLimitInfo(url, obj)) {
  obj.data.limit = false;
}

$done({ body: JSON.stringify(obj) });
