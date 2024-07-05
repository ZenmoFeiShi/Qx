// 2024.07.05 15:15
const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes("/homePage/getHomePageInfo")) {
    const moduleIdDelete = [120, 810, 119, 819, 7, 852, 122, 801, 13, 688 , 502 , 668];
    obj.data.cmsInfo.cmsList = obj.data.cmsInfo.cmsList.filter(item => 
        !moduleIdDelete.includes(item.moduleId));
}

if (url.includes("/personalCenter/getCmsModuleList")) {
    const idsToDelete = [90, 17, 13, 35, 10, 7];
    const mainTitlesToDelete = ["保养超值卡", "特价团购", "合作加盟", "抖音团购券兑换", "集团客户", "美团兑换", "评价途虎"];

    obj.data.cmsList = obj.data.cmsList.filter(item => 
        !idsToDelete.includes(item.moduleTypeId) && !mainTitlesToDelete.includes(item.mainTitle));
}

if (url.includes("/shopTab/getModuleForC")) {
    delete obj.data.bannersList;

    if (obj && obj.data && obj.data.cmsList) {
        obj.data.cmsList = obj.data.cmsList.reduce((acc, module) => {
            if (module.bottomMargin !== 12) {
                acc.push(module);
            }
            return acc;
        }, []);
    }
}

$done({ body: JSON.stringify(obj) });
