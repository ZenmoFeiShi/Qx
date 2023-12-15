const requestUrl = $request.url;

if (!$response.body) {
  $done({});
}

let parsedBody = JSON.parse($response.body);

const disorderCards = parsedBody.data?.disorder_cards;
const bottomNavList = disorderCards?.bottom_nav_list;
const isHomepageCore = requestUrl.includes("/homepage/v1/core");

if (isHomepageCore && bottomNavList) {
  const filteredBottomNavList = (bottomNavList.data || []).filter(item => ["v6x_home", "user_center"].includes(item.id));
  parsedBody.data.disorder_cards.bottom_nav_list.data = filteredBottomNavList;
  applyPositionFix(filteredBottomNavList);
}

if (isHomepageCore) {
  removeProperties(parsedBody.data, ["common_params", "omega_params", "order_cards"]);
}

if (requestUrl.includes("/usercenter/me")) {
  const userCards = parsedBody.data?.cards || [];
  parsedBody.data.cards = filterUserCards(userCards, ["priority", "general", "security"]);
  applyPositionFix(parsedBody.data.cards);
}

if (shouldDeleteData(requestUrl)) {
  delete parsedBody.data;
}

$done({ body: JSON.stringify(parsedBody) });

function applyPositionFix(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].pos = i + 1;
  }
}

function filterUserCards(cards, allowedTags) {
  return cards.filter(item => allowedTags.includes(item.tag));
}

function removeProperties(obj, properties) {
  for (const property of properties) {
    delete obj[property];
  }
}

function shouldDeleteData(url) {
  return url.includes("/resapi/activity/mget") || url.includes("/dynamic/conf") || url.includes("/homepage/v1/other/fast") || url.includes("/agent/v3/feeds") || url.includes("/resapi/activity/xpget") || url.includes("/gateway");
}
