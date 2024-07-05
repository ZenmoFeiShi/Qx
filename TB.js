//2024.07.06   00:53

const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes("/user/profile")) {
    delete obj.custom_grid;
    delete obj.finance_tab;
    delete obj.video_channel_info;
    delete obj.namoaixud;
    delete obj.recom_naws_list;
    delete obj.banner;
    delete obj.duxiaoman_entry;
    delete obj.zone_info;
    delete obj.namoaixud_entry;
    delete obj.duxiaoman;
    delete obj.vip_banner;
    delete obj.bubble_info;
    delete obj.recom_swan_list;
    }

if (url.includes("/sidebar/home")) {
    delete obj.vip_banner;
    delete obj.tools;
    }

if (url.includes('c/s/sync')) {
    delete obj.floating_icon.homepage.icon_url;
    delete obj.mainbar;
    delete obj.duxiaoman_url;
    delete obj.whitelist;
    delete obj.yy_live_tab;
    }

if (url.includes("/livefeed/feed")) {
    delete obj.data.banner.items;
    }

$done({body: JSON.stringify(obj)});
