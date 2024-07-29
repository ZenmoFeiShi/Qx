// 2024.07.29 11:14

const url = $request.url;
const obj = JSON.parse($response.body);

if (url.includes("/v6/main/init")) {
    obj.data = obj.data.filter(item => ![944, 945, 6390].includes(item.entityId));
    obj.data.forEach(item => {
        if (item.entities) {
            item.entities = item.entities.filter(entity => {
                return ![2261, 1633, 413, 417, 1754, 1966, 2274, 1170, 1175, 1190, 2258].includes(entity.entityId) && entity.title !== "关注";
            });
        }
    });
    obj.data = obj.data.filter(item => item.title !== "关注");
}

$done({ body: JSON.stringify(obj) });