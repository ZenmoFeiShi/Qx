const mtqxUrl = (typeof $request !== "undefined" && $request && $request.url) || "";
const mtqxHideTabs = ["video", "xiaotuan"];
const mtqxKeepTabs = ["homepage", "mine"];
const mtqxFeedScenes = ["gwc_feed1_2265", "personalcenter_2154"];
const mtqxMineHide = ["mine_cross_recommend"];

function mtqxIsObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function mtqxTab(obj) {
  const res = obj && obj.data && obj.data.resource;
  if (!mtqxIsObj(res) || !Array.isArray(res.tabArea)) return false;
  const names = res.tabArea.map(t => (mtqxIsObj(t) ? t.tabName : ""));
  if (!mtqxKeepTabs.every(n => names.indexOf(n) >= 0)) return false;
  const kept = res.tabArea.filter(t => !(mtqxIsObj(t) && mtqxHideTabs.indexOf(t.tabName) >= 0));
  if (kept.length === res.tabArea.length) return false;
  res.tabArea = kept;
  return true;
}

function mtqxFeed(obj) {
  const m = mtqxUrl.match(/\/lycoris\/scene\/([A-Za-z0-9_]+)/);
  if (!m || mtqxFeedScenes.indexOf(m[1]) < 0) return false;
  if (!mtqxIsObj(obj) || !Array.isArray(obj.data)) return false;
  obj.data = [];
  obj.bottom = true;
  if (!mtqxIsObj(obj.ext)) obj.ext = {};
  obj.ext.forbidByExp = true;
  return true;
}

function mtqxMine(obj) {
  if (!mtqxIsObj(obj) || !Array.isArray(obj.children)) return false;
  const kept = obj.children.filter(c => !(mtqxIsObj(c) && mtqxMineHide.indexOf(c.name) >= 0));
  if (kept.length === obj.children.length) return false;
  obj.children = kept;
  return true;
}

function mtqxClearArea(root, key) {
  const holders = [root, root && root.data];
  let changed = false;
  holders.forEach(h => {
    if (!mtqxIsObj(h)) return;
    [h.resourcesMap, h.resource].forEach(r => {
      if (mtqxIsObj(r) && Array.isArray(r[key]) && r[key].length) {
        r[key] = [];
        changed = true;
      }
    });
  });
  return changed;
}

(function () {
  const body = typeof $response !== "undefined" && $response ? $response.body : "";
  if (typeof body !== "string" || !body) {
    $done({});
    return;
  }
  let obj;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    $done({});
    return;
  }
  let changed = false;
  try {
    if (/\/aggroup\/indexTab/.test(mtqxUrl)) changed = mtqxTab(obj);
    else if (/\/lycoris\/scene\//.test(mtqxUrl)) changed = mtqxFeed(obj);
    else if (/\/usercenter\/display/.test(mtqxUrl)) changed = mtqxMine(obj);
    else if (/\/mop\/entry\/shoppingCartEntry/.test(mtqxUrl)) changed = mtqxClearArea(obj, "topBannerArea");
    else if (/\/entryModule\/startupPicture/.test(mtqxUrl)) changed = mtqxClearArea(obj, "startupPicArea");
  } catch (e) {
    changed = false;
  }
  if (changed) $done({ body: JSON.stringify(obj) });
  else $done({});
})();
