// 2024-02-02 13:51
const url = $request.url;
const scriptEnvironment = typeof $task != 'undefined' ? 'Surge' : (typeof $loon != 'undefined' ? 'Loon' : (typeof $httpClient != 'undefined' ? 'Qx' : 'Unknown'));

if (!$response.body || scriptEnvironment === 'Unknown') {
  $done({});
}

let obj = JSON.parse($response.body);

function filterBannerInfo() {
  if (obj.data && obj.data.data && Array.isArray(obj.data.data)) {
    obj.data.data.forEach((item, index) => {
      if (item.banner_info) {
        delete obj.data.data[index].banner_info;
      }
    });
  }
}

function filterProfileEntrances() {
  let profileEntrances = obj.data.profile_entrances;
  let titlesToFilter = ['放心借', '创作中心', '原创特权', '小黑屋', '我的订单'];

  obj.data.profile_entrances = profileEntrances.filter(entry => !titlesToFilter.includes(entry.title));
  fixPos(obj.data.profile_entrances);
}

function filterChannelModel() {
  if (obj.data.channel_model) {
    obj.data.channel_model = obj.data.channel_model.filter(item => ["feed", "image_text"].includes(item.event_name));
    fixPos(obj.data.channel_model);
  }
}

function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
}

if (url.includes("/bds/feed/stream/")) {
  filterBannerInfo();
} else if (url.includes("/bds/user/check_in/")) {
  filterProfileEntrances();
} else if (url.includes("/bds/feed/channel_list/")) {
  filterChannelModel();
}

$done({ body: JSON.stringify(obj) });
