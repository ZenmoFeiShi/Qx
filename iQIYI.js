// 2024-02-22 22:11
let obj = JSON.parse($response.body);
const url = $request.url;

function matchesUnwantedCriteria(item) {
  return (
    (item.block_type >= 880 && item.block_type <= 885) ||
    item.sub_type === 9 ||
    item.ad_area === "blank" ||
    item.ad_area === "extra_graphic" ||
    item.action_type === 313
  );
}

function filterOutUnwanted(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => filterOutUnwanted(item)).filter(item => {
      if (item && typeof item === 'object') {
        return !matchesUnwantedCriteria(item);
      }
      return true;
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (matchesUnwantedCriteria(obj[key])) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        obj[key] = filterOutUnwanted(obj[key]);
      }
    });
    return obj;
  }
  return obj;
}

function customURLProcessing(obj) {
  if (url.includes("/pop_home")) {
    obj.cards = [];
  }
  if (url.includes("/bottom_theme")) {
    obj.cards.forEach(card => {
      if (card.id === "bottom_tab") {
        card.items = card.items.filter(item => ["首页", "我的"].includes(item.other.name));
      }
    });
  }
  if (url.includes("/getMyMenus")) {
    const retainedTitles = ["观看历史?下载", "设置", "帮助与反馈"];
    obj.data && obj.data.forEach(category => {
      category.menuList = category.menuList.filter(item => retainedTitles.includes(item.title));
    });
  }
  if (url.includes("/player_tabs_v2")) {
  if (obj && obj.cards) {
    obj.cards = obj.cards.filter(card => card.alias_name !== "play_vip_promotion");
 }
}
  if (url.includes('/home_top_menu')) {
    obj.cards.forEach(card => {
      if (card.items && Array.isArray(card.items)) {
        card.items = card.items.filter(item => {
          const txt = item.click_event && item.click_event.txt;
          return txt !== "直播" && txt !== "热点" && txt !== "我要直播";
        });
      }
    });

  if (url.includes("/category_home") && obj.hasOwnProperty("cards")) {
    obj.cards = obj.cards.filter(card => !(
      card.card_type === 7 ||
      (card.id && ["ad_mobile_flow0", "ad_mobile_flow1"].includes(card.id))
    ));
  }
  if (url.includes("/hot_query_search")) {
    delete obj.cards;
    delete obj.base;
  }

  // 对卡片进行整体过滤处理
  if (Array.isArray(obj.cards)) {
    obj.cards = obj.cards.filter(card => {
      const showControl = card.show_control || {};
      const isUnwantedCard = (
        ["R:206085512", "waterfall", "ad_mobile_flow0", "shorts_card"].includes(card.id) ||
        card.strategy_card_id === "shorts_card" ||
        showControl.background_color === "card_bg_waterfall" ||
        (card.name && card.name.includes('会员营销banner'))
      );
      // 兼容/http/category_home去广告
      const isAdCard = card.card_type === 7 ||
        card.id === "ad_mobile_flow0" ||
        card.id === "ad_mobile_flow1";
      return !(isUnwantedCard || isAdCard);
    });
  }

  return obj;
}

function removeVipFixedCardAndRelatedPromos(obj) {
  if (obj.kv_pair && obj.kv_pair.vip_fixed_card) {
    delete obj.kv_pair.vip_fixed_card;
  }

  if (obj.cards && Array.isArray(obj.cards)) {
    obj.cards = obj.cards.filter(card => {
      let isVipRelatedPromo = card.id === 'waterfall' || (card.name && card.name.includes('会员营销banner'));

      if (!isVipRelatedPromo && card.blocks) {
        card.blocks.forEach(block => {
          if (block.metas) {
            block.metas.some(meta => {
              if (meta.text && meta.text.includes("会员")) {
                isVipRelatedPromo = true;
                return true;
              }
            });
          }
        });
      }

      return !isVipRelatedPromo;
    });
  }

  return obj;
}

obj = customURLProcessing(obj);
obj = filterOutUnwanted(obj);
obj = removeVipFixedCardAndRelatedPromos(obj);

$done({ body: JSON.stringify(obj) });
