/*
#!name = bilibili星榜全网热播
#!author = 怎么肥事
#!update = 2024-07-07 12:20
0 18 * * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/TaskHotBiliVideo.js, tag=bilibili星榜, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/BiliBili.png, enabled=true
*/

const url = `https://api.bilibili.com/pgc/review/gateway/movie/rank/infos?rank_type=COMBINATION&scene_type=1`;
const method = `GET`;
const headers = {
'Sec-Fetch-Dest' : `empty`,
'Connection' : `keep-alive`,
'Accept-Encoding' : `gzip, deflate, br`,
'Sec-Fetch-Site' : `same-site`,
'Origin' : `https://m.bilibili.com`,
'Sec-Fetch-Mode' : `cors`,
'Host' : `api.bilibili.com`,
'Referer' : `https://m.bilibili.com/bangumi/v2/rank-list?navhide=1&from_spmid=creation.hot-tab.0.0&native.theme=1&night=0`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'Accept' : `application/json, text/plain, */*`
};
const body = ``;

const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
};

$task.fetch(myRequest).then(response => {
    const obj = JSON.parse(response.body);
    let output = "";
    let notificationBody = "";
    let firstMediaCover = ""; 
    if (obj && obj.data && obj.data.rank_media_list) {
        obj.data.rank_media_list.forEach((item, index) => {
            const title = item.media_title;
            const styles = item.media_style_list.map(style => style.name).join(", ");
            const category = item.category_name;
            
            output += (index + 1) + ". " + title + " [" + category + "]\n   - " + styles + "\n\n";
            
            notificationBody += (index + 1) + ". " + title + " (" + styles + ") - " + category + "\n";
            
            if (index === 0) { 
                firstMediaCover = item.media_cover;
            }
        });
    }
    console.log(response.statusCode + "\n\n" + output);
    if (firstMediaCover) {
        $notify("bilibili星榜", "按过去两周热门稿件数量排序，每日18点更新", notificationBody, { 'media-url': firstMediaCover });
    } else {
        $notify("bilibili星榜", "按过去两周热门稿件数量排序，每日18点更新", notificationBody);
    }
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
