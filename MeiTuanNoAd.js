
var url = $request.url;
var body = $response.body;

try {
    var obj = JSON.parse(body);

    if (url.indexOf("tabbar/all/query") !== -1) {
        // 底部标签栏: 只保留 首页、神券、我的
        if (obj && obj.data && Array.isArray(obj.data)) {
            obj.data = obj.data.filter(function(item) {
                return item && item.name && ["首页", "神券", "我的"].indexOf(item.name) !== -1;
            });
        }
    }

    else if (url.indexOf("index/aggregate") !== -1) {
        if (obj && obj.data) {
            var d = obj.data;

            // 1. 金刚区: 过滤掉推广/借贷/无关入口
            if (d.jgArea && d.jgArea.resources && Array.isArray(d.jgArea.resources)) {
                var removeNames = [
                    "答题领红包", "免费看小说", "借钱"
                ];
                d.jgArea.resources = d.jgArea.resources.filter(function(r) {
                    if (r && r.materialMap && r.materialMap.name) {
                        return removeNames.indexOf(r.materialMap.name) === -1;
                    }
                    return true;
                });
                // 重算行数: 每行5个
                var total = d.jgArea.resources.length;
                d.jgArea.row = Math.ceil(total / 5);
                if (d.jgArea.firstScreenNum > total) {
                    d.jgArea.firstScreenNum = total;
                }
            }

            // 2. 关闭各种广告/推广区域
            if (d.oneCentBuy) delete d.oneCentBuy;
            if (d.topPromotion) d.topPromotion.display = false;
            if (d.homePageBanner) d.homePageBanner.display = false;
            if (d.newUserArea) d.newUserArea.display = false;
            if (d.discountArea) d.discountArea.display = false;
            if (d.repurchaseCouponCard) d.repurchaseCouponCard.display = false;
            if (d.popWindowUrlSwitch !== undefined) d.popWindowUrlSwitch = false;

            // 3. 关闭智能推单
            if (d.smartOrder) d.smartOrder.display = false;
        }
    }

    else if (url.indexOf("my/resources") !== -1) {
        obj = { code: 0, msg: "success", data: {} };
    }

    else if (url.indexOf("mypage-wallet-info") !== -1) {
        obj = { status: "success", result: {} };
    }

    else if (url.indexOf("conch/verify/queryInfo") !== -1) {
        if (obj && obj.result) {
            obj.result.isShow = false;
        }
    }

    else if (url.indexOf("my/novelZone") !== -1) {
        obj = {};
    }

    else if (url.indexOf("myPage/orderDetail") !== -1) {
    }

    body = JSON.stringify(obj);
} catch (e) {
}

$done({ body: body });
