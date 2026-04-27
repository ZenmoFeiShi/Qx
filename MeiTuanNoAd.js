

let body = $response.body;

try {
    let obj = JSON.parse(body);

    if (obj?.data) {
        if (Array.isArray(obj.data)) {
            obj.data = obj.data.filter(item => {
                if (item && item.name) {
                    return ["首页", "神券", "我的"].includes(item.name);
                }
                return false;
            });
        } else {
            if (obj.data.oneCentBuy) {
                delete obj.data.oneCentBuy;
            }
        }
    }

    body = JSON.stringify(obj);
} catch (e) {
    console.log("处理响应出错: " + e);
}

$done({ body });
