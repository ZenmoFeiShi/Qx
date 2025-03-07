// 2025-03-07 13:30
/* 分流规则（添加到分流配置中）
ip-cidr, 123.207.209.39/32, reject
ip-cidr, 123.207.209.60/32, reject
ip-cidr, 139.199.240.12/32, reject
ip-cidr, 162.14.157.2/32, reject
ip-cidr, 162.14.157.24/32, reject
ip-cidr, 139.199.240.15/32, reject
*/

const url = $request.url;
let body = $response.body;

if (!body) {
  $done({});
} else {
  let obj = JSON.parse(body);

  try {
    if (url.includes("/homepage/v1/oversea/layout")) {
      delete obj?.data?.instances?.oversea_main_banner;
    }

    if (url.includes("/other/pGetSceneList")) {
      obj.data.scene_list = obj.data.scene_list?.filter(item => item.text !== "优惠商城");
      obj.data.show_data?.forEach(block => {
        block.scene_ids = block.scene_ids?.filter(id => id !== "scene_coupon_mall");
      });
    }

    if (url.includes("/homepage/v1/core")) {
      const keepNavIds = ['dache_anycar', 'driverservice', 'bike', 'carmate'];
      obj.data.order_cards.nav_list_card.data = obj.data.order_cards.nav_list_card.data?.filter(item => keepNavIds.includes(item.nav_id));

      const keepBottomNavIds = ['v6x_home', 'home_page', 'user_center'];
      obj.data.disorder_cards.bottom_nav_list.data = obj.data.disorder_cards.bottom_nav_list.data?.filter(item => keepBottomNavIds.includes(item.id));
    }

    if (url.includes("/ota/na/yuantu/infoList")) {
      if (obj.data.disorder_cards.top_banner_card.data?.[0]?.T === "yuentu_top_banner") {
        obj.data.disorder_cards.top_banner_card.data.splice(0, 1);
      }
    }

    if (url.includes("/gulfstream/passenger-center/v2/other/pInTripLayout")) {
      obj.data.order_components = obj.data.order_components?.filter(component => component.name !== "passenger_common_casper");
    }

    if (url.includes("/homepage/v1/oversea/layout")) {
      delete obj.data.instances.oversea_main_banner.xtpl;
    }

    if (url.includes("/gulfstream/passenger-center/v2/other/pInTripLayout")) {
      obj.data.order_components = obj.data.order_components.filter(component => component.name !== "passenger_common_casper");
    }

    if (url.includes("/ota/na/yuantu/infoList")) {
      obj.data.disorder_cards.top_banner_card.data.shift();
    }

    if (url.includes("/homepage/v1/order")) {
      const keepBottomNavIds = ['dache_anycar', 'driverservice', 'bike', 'carmate'];
      obj.data.bottom_nav.data = obj.data.bottom_nav.data.filter(item => keepBottomNavIds.includes(item.id));
    }

    if (url.includes("/passenger-center/user-info")) {
      const excludedTitles = ["passenger_common_casper"];
      obj.data.order_components = obj.data.order_components.filter(item => !namesToRemove.includes(item.name));
    }

    if (url.includes("/gulfstream/passenger-center/v2/other/pInTripLayout")) {
      const namesToRemove = ["passenger_common_casper"];
      obj.data.order_components = obj.data.order_components.filter(component => !namesToRemove.includes(component.name));
    }

    if (url.includes("/ota/na/yuantu/infoList")) {
      if (obj.data.disorder_cards.top_banner_card.data?.[0]?.T === "yuentu_top_banner") {
        obj.data.disorder_cards.top_banner_card.data.splice(0, 1);
      }
    }

    if (url.includes("/usercenter")) {
      const excludedTitles = ["天天神券", "天天领红包", "天天赚积分", "天天拆福袋"];
      obj.data.cards = obj.data.cards.filter(card => !excludedTitles.includes(card.title));

      obj.data.cards.forEach(card => {
        if (card.tag === "wallet" && card.items) {
          card.items = card.items.filter(item => item.title === "优惠券");
        }
      });
    }
  } catch (e) {
    console.log("Error: ", e);
  }

  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
