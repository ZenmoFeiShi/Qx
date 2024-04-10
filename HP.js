// 2024-04-10 10:26
const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes("/buffer/hotList")) {
    delete obj.result.topBanner;
}

if (url.includes("/mang/preview/banners")) {
    delete obj.data;
}

if (url.includes("/bbsallapi/lego/data")) {
    obj.data.cards.forEach(card => { 
        if (card.code === "multiIcon") {
            const titlesToRemove = ["个性换肤", "专家预测", "邀请好友", "版主中心", "JRs战术板", "草稿箱"];
            card.components = card.components.filter(component => {
                return !titlesToRemove.includes(component.data.title);
            });
        }
    });
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