//2024.07.06   11:33

const url = $request.url;
let obj;
try {
    obj = JSON.parse($response.body);
} catch (error) {
    console.error("JSON 解析错误：", error);
    $done({});
    return;
}

if (url.includes("/sidebar/home")) {
    delete obj.vip_banner;
    delete obj.tools;
    }
    
if (url.includes("/user/profile")) {
    delete obj.banner;
    delete obj.duxiaoman_entry;
    delete obj.recom_naws_list;
    delete obj.vip_banner;
    delete obj.namoaixud_entry;
}

if (obj.hasOwnProperty("user") && obj["user"].hasOwnProperty("user_growth")) {
    delete obj["user"]["user_growth"];
}

const typesToRemove = [60, 53,  58, 50, 10, 64, 51, 52, 55, 57, 62];

if (obj.custom_grid && Array.isArray(obj.custom_grid)) {
    obj.custom_grid = obj.custom_grid.filter(item => !typesToRemove.includes(item.type));
}

if (url.includes('c/s/sync')) {
    delete obj.floating_icon?.homepage?.icon_url;
    delete obj.floating_icon?.pb?.icon_url
    delete obj.mainbar;
    delete obj.duxiaoman_url;
    delete obj.whitelist;
    delete obj.yy_live_tab;
}

if (url.includes("/livefeed/feed")) {
    delete obj.data?.banner?.items;
}

$done({body: JSON.stringify(obj)});