// 2024.07.18 08:08

const url = $request.url;
const obj = JSON.parse($response.body);

if (url.includes("/v6/account/loadConfig?key=my_page_card_config")) {
    obj.data = obj.data.filter(item => {
        if (item.entities) {
            item.entities = item.entities.filter(entity => entity.entityType !== 'textLink');
        }
        return item.entityType !== 'textLink' && item.entityId !== 1004 && item.entityId !== 1005 && item.entityId !== 1002 && item.entityId !== 1001 && item.entityId !== 1003;
    });
} else if (url.includes("/v6/page/dataList")) {
    obj.data = obj.data.filter(item => item.title !== "话题热议" && item.entityId !== 36104 && item.entityId !== 24309 && item.entityId !== 12889 && item.entityId !== 21063 && item.entityId !== 35730 && item.entityId !== 35846 && item.entityId !== 28374 && item.entityId !== 28375 && item.entityId !== 27332 && item.entityId !== 20090 && item.entityId !== 28773 && item.entityId !== 29343 && item.entityId !== 21106);
    obj.data.forEach(item => {
        if (item.entities) {
            item.entities = item.entities.filter(entity => entity.title !== "睡个好觉需要什么？");
        }
    });
} else if (url.includes("/v6/main/indexV8")) {
    obj.data = obj.data.filter(item => 
        item.entityId !== 32557 && item.entityId !== 29349 &&
        !item.title.includes("值得买") &&
        !item.title.includes("红包")
    );
} else if (url.includes("/v6/main/init")) {
    obj.data = obj.data.filter(item => {
        if (item.title === "关注") {
            return false;
        }
        if (item.entities) {
            item.entities = item.entities.filter(entity => entity.title !== "关注");
        }
        return true;
    });
}

$done({ body: JSON.stringify(obj) });