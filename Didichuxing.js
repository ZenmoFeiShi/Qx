// 2024-08-20 09:49
/* 分流规则（添加到分流配置中）
ip-cidr, 123.207.209.39/32, reject
ip-cidr, 123.207.209.60/32, reject
ip-cidr, 139.199.240.12/32, reject
ip-cidr, 139.199.240.15/32, reject
ip-cidr, 139.199.240.15/32, reject
ip-cidr, 123.207.209.60/32, reject
*/

const url = $request.url;
let body = $response.body;

if (!body) $done({});

let obj = JSON.parse(body);

if (url.includes("/homepage/v1/oversea/layout")) {
    delete obj.data?.instances?.oversea_main_banner;
}

if (url.includes("/other/pGetSceneList")) {
    if (obj.data.scene_list) {
        obj.data.scene_list = obj.data.scene_list.filter(item => item.text !== "优惠商城");
      }
    if (obj.data.show_data) {
      obj.data.show_data.forEach(block => {
        if (block.scene_ids) {
          block.scene_ids = block.scene_ids.filter(id => id !== "优惠商城");
        }
      });
    }
}

if (url.includes("/homepage/v1/oversea/layout")) {
  if (obj?.data?.instances?.oversea_main_banner?.xtpl) {
    delete obj.data.instances.oversea_main_banner.xtpl;
  }
}

if (url.includes("/ota/na/yuantu/infoList")) {
  if (obj.data.disorder_cards?.top_banner_card?.data?.[0]?.T === "yuntu_top_banner") {
    obj.data.disorder_cards.top_banner_card.data.splice(0, 1);
  }
}

if (url.includes("/gulfstream/passenger-center/v2/other/pInTripLayout")) {
  const namesToRemove = ["passenger_common_casper"];
  obj.data.order_components = obj.data.order_components.filter(
    component => !namesToRemove.includes(component.name)
  );
}

if (url.includes("/usercenter/me")) {
  const excludedTitles = ["优惠商城", "天天赚积分", "天天拆福袋", "金融理财", "天天领福利"];
  obj.data.cards = obj.data.cards.filter(card => !excludedTitles.includes(card.title));

  obj.data.cards.forEach(card => {
    if (card.tag === "wallet") {
      if (card.items) {
        card.items = card.items.filter(item => item.title === "优惠券");
      }
      if (card.bottom_items) {
        card.bottom_items = card.bottom_items.filter(item => item.title === "优惠券" || item.title === "红包");
      }
    }
  });
}

$done({ body: JSON.stringify(obj) });
