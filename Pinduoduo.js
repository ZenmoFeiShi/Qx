const url = $request.url;
let body = $response.body;

const keepTabs = ["index.html", "chat_list.html", "personal.html"];

function scanFields(s, depthWant, keys) {
  const found = {};
  let depth = 0, i = 0, n = s.length, lastKey = null, keyDepth = -1;
  while (i < n) {
    const c = s[i];
    if (c === '"') {
      let j = i + 1;
      while (j < n && s[j] !== '"') j += s[j] === "\\" ? 2 : 1;
      const str = s.slice(i + 1, j);
      let k = j + 1;
      while (k < n && /\s/.test(s[k])) k++;
      if (s[k] === ":" && depth === depthWant && keys.includes(str)) {
        lastKey = str;
        keyDepth = depth;
        k++;
        while (k < n && /\s/.test(s[k])) k++;
        found[str] = { start: k };
        i = k;
        continue;
      }
      i = j + 1;
      continue;
    }
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (lastKey && depth === keyDepth && found[lastKey].end === undefined) {
        found[lastKey].end = i + 1;
        lastKey = null;
      }
    } else if (lastKey && depth === keyDepth && c === ",") {
      if (found[lastKey].end === undefined) found[lastKey].end = i;
      lastKey = null;
    }
    i++;
  }
  return found;
}

function splice(s, found, fn) {
  const items = Object.keys(found).map(k => ({ k, ...found[k] })).filter(x => x.end > x.start).sort((a, b) => b.start - a.start);
  let changed = false;
  for (const it of items) {
    const raw = s.slice(it.start, it.end);
    const rep = fn(it.k, raw);
    if (rep !== null && rep !== raw) {
      s = s.slice(0, it.start) + rep + s.slice(it.end);
      changed = true;
    }
  }
  return changed ? s : null;
}

function pageOf(link) {
  return String(link || "").split("?")[0].split("#")[0];
}

try {
  let out = null;
  if (/\/api\/alexa\/homepage\/hub/.test(url)) {
    const f = scanFields(body, 2, ["bottom_tabs", "buffer_bottom_tabs"]);
    out = splice(body, f, (k, raw) => {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return null;
      const kept = arr.filter(t => t && keepTabs.includes(pageOf(t.link)));
      if (!kept.length || kept.length === arr.length) return null;
      return JSON.stringify(kept);
    });
  } else if (/\/hungary\/(window\/)?global\//.test(url)) {
    const f = scanFields(body, 1, ["list"]);
    out = splice(body, f, (k, raw) => {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length ? "[]" : null;
    });
  } else if (/\/api\/growth\/nagato\/app\/index\/gather/.test(url)) {
    const f = scanFields(body, 1, ["newer_index_banner", "push_banner"]);
    out = splice(body, f, (k, raw) => {
      const o = JSON.parse(raw);
      return o && typeof o === "object" && o.valid_data !== false ? '{"valid_data":false}' : null;
    });
  }
  if (out !== null) body = out;
} catch (e) {}

$done({ body });
