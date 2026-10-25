const mtqxUrl = (typeof $request !== "undefined" && $request && $request.url) || "";
const mtqxHideTabs = ["video", "xiaotuan"];
const mtqxKeepTabs = ["homepage", "mine"];
const mtqxFeedScenes = ["personalcenter_2154", "gwc_feed1_2265"];
const mtqxDropTools = [
  "xiaomeipingshen",
  "meituangongyi",
  "qiyefuwu",
  "ruzhumeituan",
  "mt_mine_myshop",
  "zhaodianhuzhu"
];

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

function mtqxTools(obj) {
  if (!mtqxIsObj(obj) || !Array.isArray(obj.children)) return false;
  let changed = false;
  obj.children.forEach(sec => {
    if (!mtqxIsObj(sec) || sec.name !== "mine_serviceV3") return;
    const d = sec.data;
    if (!mtqxIsObj(d) || !Array.isArray(d.newTools)) return;
    const kept = d.newTools.filter(
      t => !(mtqxIsObj(t) && mtqxDropTools.indexOf(t.identification) >= 0)
    );
    if (!kept.length || kept.length === d.newTools.length) return;
    d.newTools = kept;
    changed = true;
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
    else if (/\/usercenter\/display/.test(mtqxUrl)) changed = mtqxTools(obj);
    else if (/\/mop\/entry\/shoppingCartEntry/.test(mtqxUrl)) changed = mtqxClearArea(obj, "topBannerArea");
    else if (/\/entryModule\/startupPicture/.test(mtqxUrl)) changed = mtqxClearArea(obj, "startupPicArea");
  } catch (e) {
    changed = false;
  }
  if (changed) $done({ body: JSON.stringify(obj) });
  else $done({});
})();
