// 2024-02-12 19:42
const url = $request.url;
if (!$response.body) $done({});

let obj = JSON.parse($response.body);

if (url.includes("/homepage/v1/core")) {
  // 保留打车、顺风车、代驾、青桔骑行
  const keepNavIds = ['dache_anycar', 'carmate', 'driverservice', 'bike'];
  if (obj.data && obj.data.order_cards && obj.data.order_cards.nav_list_card && obj.data.order_cards.nav_list_card.data) {
    obj.data.order_cards.nav_list_card.data = obj.data.order_cards.nav_list_card.data.filter(item => keepNavIds.includes(item.nav_id));
  }
  // 保留底部tap首页、我的
  const keepBottomNavIds = ['v6x_home', 'user_center'];
  if (obj.data && obj.data.disorder_cards && obj.data.disorder_cards.bottom_nav_list && obj.data.disorder_cards.bottom_nav_list.data) {
    obj.data.disorder_cards.bottom_nav_list.data = obj.data.disorder_cards.bottom_nav_list.data.filter(item => keepBottomNavIds.includes(item.id));
  }
}
if (url.includes("/usercenter/me")) {
  const excludedTitles = ['天天领福利', '金融服务', '更多服务', '企业服务', '安全中心'];

  if (obj.data && obj.data.cards) {
    obj.data.cards = obj.data.cards.filter(card => !excludedTitles.includes(card.title));

    obj.data.cards.forEach(card => {
      if (card.tag === "wallet") {
        if (card.items) {
          card.items = card.items.filter(item => item.title === "优惠券");
        }
        if (card.card_type === 4 && card.bottom_items) {
          card.bottom_items = card.bottom_items.filter(item => 
            item.title === "省钱套餐" || item.title === "天天神券"
          );
        }
      }
    });
  }
}

if (url.includes("/resapi/activity/mget") || url.includes("/dynamic/conf") || url.includes("/homepage/v1/other/fast") || url.includes("/agent/v3/feeds") || url.includes("/resapi/activity/xpget") || url.includes("/gateway")) {
  delete obj.data;
}

$done({ body: JSON.stringify(obj) });
