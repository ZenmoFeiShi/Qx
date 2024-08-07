//  2024.08.07 23.04
const url = $request.url;
const userInfoPath = "/v2/user/userinfo";
const isTouristPath = "/v2/user/is_tourist";

if (url.indexOf(userInfoPath) !== -1) {
  let obj = JSON.parse($response.body);
  if (obj.data) {
    obj.data.is_member = 1;
    obj.data.keyboard_num = 9999;
    obj.data.nickname = "你怎么肥事";
    obj.data.is_tourist = 1;
  }
  $done({body: JSON.stringify(obj)});
} else if (url.indexOf(isTouristPath) !== -1) {
  let obj = JSON.parse($response.body);
  if (obj.data) {
    obj.data.is_tourist = 1;
    obj.data.is_memeber = 1;
  }
  $done({body: JSON.stringify(obj)});
} else {
  $done({});
}
