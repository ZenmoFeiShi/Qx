// 2024-02-21 19:18
const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes("/buffer/hotList")) {
    delete obj.result.topBanner;
}

if (url.includes("/mang/preview/banners")) {
    delete obj.data;
}

if (url.includes("/bbsallapi/lego/data")) {
    if (obj.data && obj.data.cards) {
        obj.data.cards = obj.data.cards.filter(card => {
            if (card.components && card.components.length > 0) {
                return !card.components.some(component => component.data && component.data.title === "我的应用");
            }
            return true;
        });
    }
}

if (url.includes("/bplapi/user/v1/more")) {
    if (obj.result && obj.result.vipInfo && obj.result.vipInfo.textInfo) {
        delete obj.result.vipInfo.textInfo;
    }
    if (obj.result && obj.result.vipInfo) {
        delete obj.result.vipInfo;
    }
}

$done({ body: JSON.stringify(obj) });
