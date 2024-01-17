// 2024-01-17 10:56
const url = $request.url;
const scriptEnvironment = typeof $task != 'undefined' ? 'Surge' : (typeof $loon != 'undefined' ? 'Loon' : (typeof $httpClient != 'undefined' ? 'Qx' : 'Unknown'));

if (!$response.body || scriptEnvironment === 'Unknown') {
  $done({});
}

let obj = JSON.parse($response.body);

if (url.includes("/bds/user/check_in/")) {
  filterProfileEntrances(obj);
} else if (url.includes("/bds/feed/channel_list/")) {
  filterChannelModel(obj);
}

$done({ body: JSON.stringify(obj) });

function filterProfileEntrances(obj) {
  let profileEntrances = obj.data.profile_entrances;
  let titlesToFilter = ['放心借', '创作中心', '原创特权', '小黑屋', '我的订单'];

  obj.data.profile_entrances = profileEntrances.filter(entry => !titlesToFilter.includes(entry.title));
  fixPos(obj.data.profile_entrances);
}

function filterChannelModel(obj) {
  if (obj.data.channel_model) {
    obj.data.channel_model = obj.data.channel_model.filter(item => ["follow_feed", "feed", "immersion_video", "image_text"].includes(item.event_name));
    fixPos(obj.data.channel_model);
  }
}

function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
}
