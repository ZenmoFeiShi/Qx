//2026/09/15
/*
@Name：WeTalk 自动签到与视频奖励（30.6.3）
@Based on：TG@ZenMoFiShi

[rewrite_local]
^https:\/\/api\.wetalkapp\.com\/app\/(?:queryBalanceAndBonus|checkIn|videoBonus) url script-request-header WeTalk_2026-09-15.js

[task_local]
20 8,20 * * * WeTalk_2026-09-15.js, tag=WeTalk签到, enabled=true

[MITM]
hostname = api.wetalkapp.com
*/

const scriptName = 'WeTalk';
const storeKey = 'wetalk_accounts_v1';
const SECRET = '0fOiukQq7jXZV2GRi9LGlO';
const API_HOST = 'api.wetalkapp.com';
const MAX_VIDEO = 1;
const VIDEO_FIRST_DELAY = 3000;
const VIDEO_DELAY = 8000;
const VIDEO_LIMIT_CODE = 200007;
const ACCOUNT_GAP = 5000;
const NETWORK_RETRIES = 1;

function MD5(string) {
  function RotateLeft(lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); }
  function AddUnsigned(lX, lY) {
    const lX4 = lX & 0x40000000, lY4 = lY & 0x40000000, lX8 = lX & 0x80000000, lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) return (lResult & 0x40000000) ? (lResult ^ 0xC0000000 ^ lX8 ^ lY8) : (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    return lResult ^ lX8 ^ lY8;
  }
  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | (~z)); }
  function FF(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); }
  function GG(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); }
  function HH(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); }
  function II(a, b, c, d, x, s, ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac)); return AddUnsigned(RotateLeft(a, s), b); }
  function ConvertToWordArray(str) {
    const lMessageLength = str.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1).fill(0);
    let lBytePosition = 0, lByteCount = 0;
    while (lByteCount < lMessageLength) {
      const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] |= str.charCodeAt(lByteCount) << lBytePosition;
      lByteCount++;
    }
    const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] |= 0x80 << lBytePosition;
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function WordToHex(lValue) {
    let WordToHexValue = '';
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255;
      const WordToHexValue_temp = '0' + lByte.toString(16);
      WordToHexValue += WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  const x = ConvertToWordArray(string);
  let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a,b,c,d,x[k+0],S11,0xD76AA478); d = FF(d,a,b,c,x[k+1],S12,0xE8C7B756); c = FF(c,d,a,b,x[k+2],S13,0x242070DB); b = FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);
    a = FF(a,b,c,d,x[k+4],S11,0xF57C0FAF); d = FF(d,a,b,c,x[k+5],S12,0x4787C62A); c = FF(c,d,a,b,x[k+6],S13,0xA8304613); b = FF(b,c,d,a,x[k+7],S14,0xFD469501);
    a = FF(a,b,c,d,x[k+8],S11,0x698098D8); d = FF(d,a,b,c,x[k+9],S12,0x8B44F7AF); c = FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1); b = FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a = FF(a,b,c,d,x[k+12],S11,0x6B901122); d = FF(d,a,b,c,x[k+13],S12,0xFD987193); c = FF(c,d,a,b,x[k+14],S13,0xA679438E); b = FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a = GG(a,b,c,d,x[k+1],S21,0xF61E2562); d = GG(d,a,b,c,x[k+6],S22,0xC040B340); c = GG(c,d,a,b,x[k+11],S23,0x265E5A51); b = GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);
    a = GG(a,b,c,d,x[k+5],S21,0xD62F105D); d = GG(d,a,b,c,x[k+10],S22,0x02441453); c = GG(c,d,a,b,x[k+15],S23,0xD8A1E681); b = GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);
    a = GG(a,b,c,d,x[k+9],S21,0x21E1CDE6); d = GG(d,a,b,c,x[k+14],S22,0xC33707D6); c = GG(c,d,a,b,x[k+3],S23,0xF4D50D87); b = GG(b,c,d,a,x[k+8],S24,0x455A14ED);
    a = GG(a,b,c,d,x[k+13],S21,0xA9E3E905); d = GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8); c = GG(c,d,a,b,x[k+7],S23,0x676F02D9); b = GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a = HH(a,b,c,d,x[k+5],S31,0xFFFA3942); d = HH(d,a,b,c,x[k+8],S32,0x8771F681); c = HH(c,d,a,b,x[k+11],S33,0x6D9D6122); b = HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a = HH(a,b,c,d,x[k+1],S31,0xA4BEEA44); d = HH(d,a,b,c,x[k+4],S32,0x4BDECFA9); c = HH(c,d,a,b,x[k+7],S33,0xF6BB4B60); b = HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a = HH(a,b,c,d,x[k+13],S31,0x289B7EC6); d = HH(d,a,b,c,x[k+0],S32,0xEAA127FA); c = HH(c,d,a,b,x[k+3],S33,0xD4EF3085); b = HH(b,c,d,a,x[k+6],S34,0x04881D05);
    a = HH(a,b,c,d,x[k+9],S31,0xD9D4D039); d = HH(d,a,b,c,x[k+12],S32,0xE6DB99E5); c = HH(c,d,a,b,x[k+15],S33,0x1FA27CF8); b = HH(b,c,d,a,x[k+2],S34,0xC4AC5665);
    a = II(a,b,c,d,x[k+0],S41,0xF4292244); d = II(d,a,b,c,x[k+7],S42,0x432AFF97); c = II(c,d,a,b,x[k+14],S43,0xAB9423A7); b = II(b,c,d,a,x[k+5],S44,0xFC93A039);
    a = II(a,b,c,d,x[k+12],S41,0x655B59C3); d = II(d,a,b,c,x[k+3],S42,0x8F0CCC92); c = II(c,d,a,b,x[k+10],S43,0xFFEFF47D); b = II(b,c,d,a,x[k+1],S44,0x85845DD1);
    a = II(a,b,c,d,x[k+8],S41,0x6FA87E4F); d = II(d,a,b,c,x[k+15],S42,0xFE2CE6E0); c = II(c,d,a,b,x[k+6],S43,0xA3014314); b = II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a = II(a,b,c,d,x[k+4],S41,0xF7537E82); d = II(d,a,b,c,x[k+11],S42,0xBD3AF235); c = II(c,d,a,b,x[k+2],S43,0x2AD7D2BB); b = II(b,c,d,a,x[k+9],S44,0xEB86D391);
    a = AddUnsigned(a,AA); b = AddUnsigned(b,BB); c = AddUnsigned(c,CC); d = AddUnsigned(d,DD);
  }
  return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
}

function getUTCSignDate() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth()+1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
}

function normalizeHeaderNameMap(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(k => out[k] = headers[k]);
  return out;
}

function parseQuery(url) {
  const query = (url.split('?')[1] || '').split('#')[0];
  const params = {};
  query.split('&').forEach(pair => {
    if (!pair) return;
    const idx = pair.indexOf('=');
    if (idx < 0) return;
    const key = safeDecode(pair.slice(0, idx).replace(/\+/g, ' '));
    const value = safeDecode(pair.slice(idx + 1).replace(/\+/g, ' '));
    params[key] = value;
  });
  return params;
}

function safeDecode(v) {
  if (v == null) return '';
  try { return decodeURIComponent(String(v)); } catch (e) { return String(v); }
}

function emailKeyOf(params) {
  const email = (params || {}).email;
  return email ? safeDecode(email).trim().toLowerCase() : '';
}

function fingerprintOf(params) {
  const email = emailKeyOf(params);
  if (email) return email;
  const drop = { sign:1, signDate:1, timestamp:1, ts:1, nonce:1, random:1, reqTime:1, reqId:1, requestId:1 };
  const base = Object.keys(params || {}).filter(k => !drop[k]).sort().map(k => `${k}=${params[k]}`).join('&');
  return 'fp_' + MD5(base).slice(0, 12);
}

// 兼容老版本：把以 MD5 fingerprint 为 key 的账号迁移成以 email 为 key。
function migrateStore(store) {
  if (!store || !store.accounts) return store;
  const newAccounts = {};
  const newOrder = [];
  (store.order || Object.keys(store.accounts)).forEach(oldId => {
    const acc = store.accounts[oldId];
    if (!acc) return;
    if (acc.capture && !acc.capture.params && acc.capture.paramsRaw) {
      const decoded = {};
      Object.keys(acc.capture.paramsRaw).forEach(k => decoded[safeDecode(k)] = safeDecode(acc.capture.paramsRaw[k]));
      acc.capture.params = decoded;
    }
    const email = emailKeyOf(acc.capture && (acc.capture.params || acc.capture.paramsRaw));
    const newId = email || oldId;
    const prev = newAccounts[newId];
    if (!prev || (acc.updatedAt || 0) >= (prev.updatedAt || 0)) {
      newAccounts[newId] = Object.assign({}, acc, { id: newId, email: acc.email || email, alias: acc.alias || email || newId });
      if (newOrder.indexOf(newId) < 0) newOrder.push(newId);
    }
  });
  store.version = 3;
  store.accounts = newAccounts;
  store.order = newOrder;
  return store;
}

function loadStore() {
  const raw = $prefs.valueForKey(storeKey);
  if (!raw) return { version: 3, accounts: {}, order: [] };
  try {
    const obj = JSON.parse(raw);
    if (!obj.accounts) obj.accounts = {};
    if (!Array.isArray(obj.order)) obj.order = Object.keys(obj.accounts);
    return migrateStore(obj);
  } catch (e) {
    return { version: 3, accounts: {}, order: [] };
  }
}

function saveStore(store) {
  $prefs.setValueForKey(JSON.stringify(store), storeKey);
}

function buildSignedParams(capture) {
  const params = {};
  const saved = capture.params || capture.paramsRaw || {};
  const alreadyDecoded = !!capture.params;
  Object.keys(saved).forEach(k => {
    if (k !== 'sign' && k !== 'signDate') params[k] = alreadyDecoded ? String(saved[k]) : safeDecode(saved[k]);
  });
  params.signDate = getUTCSignDate();
  const signBase = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  params.sign = MD5(signBase + SECRET);
  return params;
}

function buildUrl(path, capture) {
  const params = buildSignedParams(capture);
  const qs = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  return `https://${API_HOST}/app/${path}?${qs}`;
}

function cloneHeaders(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(k => out[k] = headers[k]);
  return out;
}

function buildHeaders(capture) {
  const headers = cloneHeaders(capture.headers || {});
  Object.keys(headers).forEach(k => {
    const lk = k.toLowerCase();
    if (lk === 'content-length' || lk === 'host' || lk === ':authority' || lk === ':method' || lk === ':path' || lk === ':scheme' || lk === 'connection' || lk === 'proxy-connection' || lk === 'keep-alive' || lk === 'accept-encoding') delete headers[k];
  });
  headers['Host'] = API_HOST;
  if (!Object.keys(headers).some(k => k.toLowerCase() === 'accept')) headers['Accept'] = 'application/json';
  if (!Object.keys(headers).some(k => k.toLowerCase() === 'user-agent') && capture.baseUA) headers['User-Agent'] = capture.baseUA;
  return headers;
}

function notify(title, body) {
  console.log(`【${scriptName} 通知】${title}\n${body}`);
  $notify(scriptName, title, body);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function runAccount(acc, index, total) {
  const capture = acc.capture || {};
  const email = acc.email || emailKeyOf(capture.params || capture.paramsRaw);
  const tag = `[账号${index+1}/${total} ${acc.alias || email || acc.id}]`;
  const headers = buildHeaders(capture);
  const msgs = [`${tag}${email ? `\n📧 ${email}` : ''}`];
  let initialBalance = null;

  function fetchApi(path, retry) {
    retry = retry === undefined ? (path === 'queryBalanceAndBonus' ? NETWORK_RETRIES : 0) : retry;
    return $task.fetch({ url: buildUrl(path, capture), method: 'GET', headers: cloneHeaders(headers), opts: { 'auto-cookie': false } }).catch(err => {
      const message = (err && (err.error || String(err))) || '';
      if (retry > 0 && /SSL|SSLSessionState|timeout|timed out|reset|connection|network|stream closed|closed|EOF/i.test(message)) {
        return sleep(1500).then(() => fetchApi(path, retry - 1));
      }
      return Promise.reject(err);
    });
  }

  function parseResponse(res) {
    try { return JSON.parse(res.body || '{}'); } catch (e) { return null; }
  }

  function doVideoLoop(count) {
    let index = 0;
    function next() {
      if (index >= count) return Promise.resolve();
      const delay = index === 0 ? VIDEO_FIRST_DELAY : VIDEO_DELAY;
      return sleep(delay).then(() => {
        index++;
        return fetchApi('videoBonus').then(res => {
          const data = parseResponse(res);
          if (!data) {
            msgs.push(`❌ 视频${index}：响应解析失败`);
            return;
          }
          if (data.retcode === 0) {
            const result = data.result || {};
            msgs.push(`🎬 视频${index}：+${result.bonus == null ? '?' : result.bonus} Coins`);
            return next();
          }
          const message = data.retmsg || `错误 ${data.retcode}`;
          msgs.push(`⏸ 视频${index}：${message}${data.retcode === VIDEO_LIMIT_CODE ? '（已停止，避免继续触发限流）' : ''}`);
        }).catch(err => {
          msgs.push(`❌ 视频${index}：${err.error || String(err) || '请求失败'}`);
        });
      });
    }
    return next();
  }

  return fetchApi('queryBalanceAndBonus').then(res => {
    const data = parseResponse(res);
    if (!data) throw new Error('查询余额响应解析失败');
    if (data.retcode !== 0) throw new Error(data.retmsg || `查询失败 ${data.retcode}`);
    const result = data.result || {};
    initialBalance = Number(result.balance);
    msgs.push(`💰 运行前余额：${result.balance} Coins`);
    if (result.isallowcheckin === false) {
      msgs.push(`⏭ 签到：${result.notallowcheckinreason || '当前不可签到'}`);
      return null;
    }
    return fetchApi('checkIn').then(checkRes => {
      const check = parseResponse(checkRes);
      if (!check) msgs.push('❌ 签到：响应解析失败');
      else if (check.retcode === 0) msgs.push(`✅ 签到：${((check.result || {}).bonusHint || `+${(check.result || {}).bonus || '?'} Coins`).replace(/\n/g, ' ')}`);
      else msgs.push(`⚠️ 签到：${check.retmsg || `错误 ${check.retcode}`}`);
    });
  }).then(() => fetchApi('queryBalanceAndBonus')).then(res => {
    const data = parseResponse(res);
    if (!data || data.retcode !== 0) {
      msgs.push(`⚠️ 视频资格查询：${data ? (data.retmsg || data.retcode) : '解析失败'}`);
      return null;
    }
    const result = data.result || {};
    if (result.isallowvideobonus === false) {
      msgs.push(`⏭ 视频：${result.notallowvideobonusreason || '当前不可领取'}`);
      return null;
    }
    return doVideoLoop(MAX_VIDEO);
  }).then(() => fetchApi('queryBalanceAndBonus')).then(res => {
    const data = parseResponse(res);
    if (data && data.retcode === 0) {
      const balance = (data.result || {}).balance;
      msgs.push(`💰 最新余额：${balance} Coins`);
      if (Number.isFinite(initialBalance) && Number.isFinite(Number(balance))) msgs.push(`📈 本次增加：${(Number(balance) - initialBalance).toFixed(4)} Coins`);
    }
    return msgs.join('\n');
  }).catch(err => {
    msgs.push(`❌ 异常：${err.error || err.message || String(err)}`);
    return msgs.join('\n');
  });
}

if (typeof $request !== 'undefined' && $request) {
  const params = parseQuery($request.url);
  const headersMap = normalizeHeaderNameMap($request.headers || {});
  let baseUA = '';
  Object.keys(headersMap).forEach(k => { if (k.toLowerCase() === 'user-agent') baseUA = headersMap[k]; });

  const email = emailKeyOf(params);
  if (!email) {
    notify('⚠️ 抓取失败', '请求里未取到 email 参数，无法识别账号。请确认已登录后再触发抓包。');
    $done({});
  } else {
    const store = loadStore();
    const accId = email; // 以邮箱作为账号唯一标识
    const now = Date.now();
    const existed = !!store.accounts[accId];
    const alias = existed ? (store.accounts[accId].alias || email) : email;

    store.accounts[accId] = {
      id: accId,
      email: email,
      alias,
      baseUA,
      capture: { url: $request.url, params, headers: headersMap, baseUA },
      createdAt: existed ? store.accounts[accId].createdAt : now,
      updatedAt: now
    };
    if (!existed) store.order.push(accId);
    saveStore(store);

    const total = store.order.length;
    notify(existed ? '🔄 账号参数已更新' : '✅ 新账号已入库', `${email}\n当前账号总数：${total}`);
    console.log(`【${scriptName}】${existed ? 'update' : 'add'} account ${email}`);
    $done({});
  }
} else {
  const store = loadStore();
  const ids = store.order.filter(id => store.accounts[id]);
  if (!ids.length) {
    notify('⚠️ 未抓到任何账号', '请先打开 WeTalk 触发抓包');
    $done();
  } else {
    const total = ids.length;
    const results = [];
    let chain = Promise.resolve();
    ids.forEach((id, idx) => {
      chain = chain.then(() => runAccount(store.accounts[id], idx, total))
        .then(text => { results.push(text); })
        .then(() => idx < ids.length - 1 ? sleep(ACCOUNT_GAP) : null);
    });
    chain.then(() => {
      notify(`🎉 全部完成 (${total}个账号)`, results.join('\n———\n'));
      $done();
    }).catch(err => {
      notify('❌ 任务异常', results.join('\n———\n') + '\n' + (err.error || String(err)));
      $done();
    });
  }
}
