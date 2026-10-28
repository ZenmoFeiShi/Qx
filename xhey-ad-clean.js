var xhUrl = ($request && $request.url) || "";
var xhFinished = false;

function xhDone(body) {
  if (xhFinished) return;
  xhFinished = true;
  $done(typeof body === "string" ? { body: body } : {});
}

function xhParse(text) {
  try {
    var o = JSON.parse(text);
    return o && typeof o === "object" && !Array.isArray(o) ? o : null;
  } catch (e) {
    return null;
  }
}

var XH_FORCE = {
  CloseAllAd: { type: "BOOLEAN", value: "true" }
};

function xhHasForced(item) {
  if (!item || !Array.isArray(item.variables)) return false;
  for (var i = 0; i < item.variables.length; i++) {
    var v = item.variables[i];
    if (v && Object.prototype.hasOwnProperty.call(XH_FORCE, v.name)) return true;
  }
  return false;
}

function xhSubject(results) {
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    if (r && r.subject_id) return { id: String(r.subject_id), name: r.subject_name || "USER" };
  }
  var req = xhParse(($request && $request.body) || "");
  if (req) {
    var id = req.login_id || req.distinct_id || req.anonymous_id;
    if (id) return { id: String(id), name: "USER" };
  }
  return null;
}

function xhSensorsAB(text) {
  var o = xhParse(text);
  if (!o || o.status !== "SUCCESS") return null;
  var results = Array.isArray(o.results) ? o.results : [];
  var subject = xhSubject(results);
  var kept = [];
  for (var i = 0; i < results.length; i++) {
    if (!xhHasForced(results[i])) kept.push(results[i]);
  }
  var seq = 0;
  for (var name in XH_FORCE) {
    if (!Object.prototype.hasOwnProperty.call(XH_FORCE, name)) continue;
    seq++;
    var expId = String(990000 + seq);
    var item = {
      abtest_experiment_id: expId,
      abtest_experiment_group_id: "1",
      is_control_group: false,
      is_white_list: true,
      experiment_type: "CODE",
      variables: [{ name: name, type: XH_FORCE[name].type, value: XH_FORCE[name].value }],
      abtest_experiment_result_id: expId + "0101",
      abtest_experiment_version: "1",
      cacheable: true
    };
    if (subject) {
      item.subject_id = subject.id;
      item.subject_name = subject.name;
    }
    kept.push(item);
  }
  o.results = kept;
  if (Array.isArray(o.out_list)) {
    o.out_list = o.out_list.filter(function (x) { return !xhHasForced(x); });
  }
  if (Array.isArray(o.fuzzy_experiments)) {
    o.fuzzy_experiments = o.fuzzy_experiments.filter(function (n) {
      return !Object.prototype.hasOwnProperty.call(XH_FORCE, n);
    });
  }
  return JSON.stringify(o);
}

function xhJtConfig(text) {
  var o = xhParse(text);
  if (!o) return null;
  o.enableAppStoreOpt = 0;
  o.adWindowEnable = 0;
  o.splashShowType = 0;
  o.interstitialShowType = 0;
  o.rewardShowType = 0;
  return JSON.stringify(o);
}

try {
  var xhBody = ($response && $response.body) || "";
  var xhOut = null;
  if (xhBody) {
    if (/\/api\/v2\/abtest\/online\/results/.test(xhUrl)) {
      xhOut = xhSensorsAB(xhBody);
    } else if (/\/iOSConfig\.txt/.test(xhUrl)) {
      xhOut = xhJtConfig(xhBody);
    }
  }
  xhDone(xhOut);
} catch (e) {
  xhDone(null);
}
