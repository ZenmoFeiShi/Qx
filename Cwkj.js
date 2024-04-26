var body = $response.body;
var url = $request.url;

const path1 = "/nextgame/igwuser/userinfo";
const path2 = "/nextgame/igwuser/useropeninfo";
let obj;

if (url.indexOf(path1) !== -1) {
    obj = JSON.parse(body);
    obj.info.LevelInfo.Level = 999; // 修改Level
    obj.info.LevelInfo.VipLevel = 8; // 修改VipLevel
    obj.info.LevelInfo.Svip = 8; // 修改Svip
    obj.info.LevelInfo.VipExpires = "2099-01-01T00:00:00Z"; // 修改VipExpires
    obj.info.LevelInfo.SVipExpires = "2099-01-01T00:00:00Z"; // 修改SVipExpires
    body = JSON.stringify(obj);
} else if (url.indexOf(path2) !== -1) {
    obj = JSON.parse(body);
    obj.data.LevelInfo.Level = 999; // 修改Level
    obj.data.LevelInfo.VipLevel = 8; // 修改VipLevel
    obj.data.LevelInfo.Svip = 8; // 修改Svip
    obj.data.LevelInfo.VipExpires = "2099-01-01T00:00:00Z"; // 修改VipExpires
    obj.data.LevelInfo.SVipExpires = "2099-01-01T00:00:00Z"; // 修改SVipExpires
    body = JSON.stringify(obj);
}

$done({body});
