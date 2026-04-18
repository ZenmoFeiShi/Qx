const API_BASE = 'https://iios-api.suil.dpdns.org';
const API_SECRET = '5SAi3saB9A7pDRIoKdrmB1HYnQq7exe2';
const START_URL = API_BASE + '/iios/checkin_login_batch_async';
const START_URL_SINGLE = API_BASE + '/iios/checkin_login_async';
const RESULT_URL = API_BASE + '/iios/checkin_result';

const ACCOUNTS_KEY = 'iios_login_accounts';
const EMAIL_KEY = 'iios_login_email';
const PASSWORD_KEY = 'iios_login_password';
const CLIENT_ID_KEY = 'iios_client_id';

const POLL_INTERVAL = 5000;
const MAX_POLLS = 40;

const Env = (() => {
  const isQX = typeof $task !== 'undefined' && typeof $prefs !== 'undefined';
  const isSurge = typeof $httpClient !== 'undefined' && typeof $persistentStore !== 'undefined' && typeof $loon === 'undefined';
  const isLoon = typeof $loon !== 'undefined' || (typeof $httpClient !== 'undefined' && typeof $persistentStore !== 'undefined' && typeof $environment === 'undefined');

  function read(key) {
    if (isQX) return $prefs.valueForKey(key) || '';
    if (isSurge || isLoon) return $persistentStore.read(key) || '';
    return '';
  }

  function notify(title, subTitle, message) {
    const t = String(title || '');
    const s = String(subTitle || '');
    const m = String(message || '');
    if (typeof $notify !== 'undefined') {
      $notify(t, s, m);
      return;
    }
    if (typeof $notification !== 'undefined' && $notification && typeof $notification.post === 'function') {
      $notification.post(t, s, m);
      return;
    }
  }

  function done(value) {
    if (typeof $done !== 'undefined') $done(value);
  }

  function request(options) {
    if (isQX) {
      return $task.fetch(options).then(resp => ({
        status: resp.statusCode || resp.status,
        headers: resp.headers || {},
        body: resp.body || ''
      }));
    }
    return new Promise((resolve, reject) => {
      const method = String(options.method || 'GET').toUpperCase();
      const cb = (err, resp, body) => {
        if (err) return reject(err);
        resolve({
          status: resp && (resp.status || resp.statusCode),
          headers: (resp && resp.headers) || {},
          body: body || ''
        });
      };
      if (method === 'POST') {
        $httpClient.post(options, cb);
      } else {
        $httpClient.get(options, cb);
      }
    });
  }

  return { isQX, isSurge, isLoon, read, notify, done, request };
})();

function isRequestPhase() {
  return typeof $request !== 'undefined' && !!$request;
}

function parseBody(body) {
  try { return JSON.parse(body || '{}'); } catch (e) { return {}; }
}

function authHeaders() {
  return {
    'Authorization': `Bearer ${API_SECRET}`,
    'Content-Type': 'application/json'
  };
}

function maskAccount(v) {
  const s = String(v || '').trim();
  if (!s) return '';
  if (s.includes('@')) {
    const parts = s.split('@');
    const left = parts[0] || '';
    const right = parts.slice(1).join('@');
    if (left.length <= 2) return `${left[0] || '*'}***@${right}`;
    return `${left.slice(0, 2)}***@${right}`;
  }
  if (s.length <= 4) return s[0] + '***';
  return s.slice(0, 2) + '***' + s.slice(-2);
}

/**
 * 解析多账号字符串
 * 格式: 邮箱@密码,邮箱2@密码2
 * 按最后一个 @ 分割账号和密码
 */
function parseAccounts(raw) {
  if (!raw || !raw.trim()) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean).map(entry => {
    const lastAt = entry.lastIndexOf('@');
    if (lastAt <= 0) return null;
    const email = entry.substring(0, lastAt).trim();
    const password = entry.substring(lastAt + 1).trim();
    if (!email || !password) return null;
    return { email, password };
  }).filter(Boolean);
}

if (isRequestPhase()) {
  Env.done({ headers: ($request && $request.headers) ? $request.headers : {} });
} else {
  let finished = false;

  function finish(title, subTitle, message) {
    if (finished) return;
    finished = true;
    Env.notify(title, subTitle, String(message || ''));
    Env.done();
  }

  // ========== 多账号批量模式 ==========

  function handleBatchFinal(obj) {
    if (!obj) return finish('iios.fun', '批量签到失败', 'empty response');
    if (obj.status === 'pending') return false;
    if (obj.status === 'error' || obj.ok === false) {
      return finish('iios.fun', '批量签到失败', obj.message || JSON.stringify(obj));
    }

    const results = (obj.data && obj.data.results) || [];
    if (!results.length) {
      return finish('iios.fun', '批量签到完成', JSON.stringify(obj.data || obj));
    }

    const lines = [];
    let okCount = 0;
    let failCount = 0;
    for (const r of results) {
      const acct = maskAccount(r.username || r.email || '');
      const st = (r.data && r.data.status) || r.status || '';
      if (st === 'already_done') {
        okCount++;
        lines.push(`✅ ${acct} 今日已签到`);
      } else if (st === 'checked_in') {
        okCount++;
        const pts = r.data && r.data.result && r.data.result.points;
        lines.push(`✅ ${acct} 签到成功` + (pts ? `(积分:${pts})` : ''));
      } else if (r.ok === false || r.error) {
        failCount++;
        lines.push(`❌ ${acct} ${r.message || r.error || '失败'}`);
      } else {
        okCount++;
        lines.push(`✅ ${acct} 完成`);
      }
    }

    const summary = `成功${okCount}/失败${failCount}`;
    return finish('iios.fun', `批量签到 ${summary}`, lines.join('\n'));
  }

  function pollBatch(jobId, count) {
    const url = RESULT_URL + '?id=' + encodeURIComponent(jobId);
    Env.request({
      url,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${API_SECRET}` }
    }).then(resp => {
      const obj = parseBody(resp.body);
      if (obj.status === 'pending') {
        if (count >= MAX_POLLS) return finish('iios.fun', '批量签到处理中', '服务仍在执行，请稍后手动重试');
        return setTimeout(() => pollBatch(jobId, count + 1), POLL_INTERVAL);
      }
      return handleBatchFinal(obj);
    }).catch(err => {
      finish('iios.fun', '批量查询失败', err && (err.error || err.message) ? (err.error || err.message) : JSON.stringify(err));
    });
  }

  function startBatchCheckin(accounts, clientId) {
    Env.request({
      url: START_URL,
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        accounts: accounts.map(a => ({ username: a.email, password: a.password })),
        client_id: clientId,
        type: 2,
        webapp: true
      })
    }).then(resp => {
      const obj = parseBody(resp.body);
      if (!obj || !obj.ok || !obj.jobId) {
        return finish('iios.fun', '批量启动失败', obj.message || resp.body || 'batch start failed');
      }
      pollBatch(obj.jobId, 1);
    }).catch(err => {
      finish('iios.fun', '批量请求失败', err && (err.error || err.message) ? (err.error || err.message) : JSON.stringify(err));
    });
  }

  // ========== 单账号模式（兼容旧版） ==========

  function handleFinal(obj) {
    if (!obj) return finish('iios.fun', '签到失败', 'empty response');
    if (obj.status === 'pending') return false;
    if (obj.status === 'error' || obj.ok === false) {
      return finish('iios.fun', '签到失败', obj.message || JSON.stringify(obj));
    }

    const data = obj.data || {};
    const status = data.status || obj.status || '';
    const result = data.result || {};

    if (status === 'already_done') {
      return finish('iios.fun', '今日已签到', result.message || '今日已完成');
    }

    if (status === 'checked_in') {
      const msg = [];
      if (typeof result.message !== 'undefined') msg.push(result.message);
      if (typeof result.points !== 'undefined') msg.push('积分：' + result.points);
      return finish('iios.fun', '签到成功', msg.join('，') || '签到成功');
    }

    if (obj.status === 'done' && obj.data) {
      const r = obj.data.result || {};
      if (obj.data.status === 'already_done') return finish('iios.fun', '今日已签到', r.message || '今日已完成');
      if (obj.data.status === 'checked_in') return finish('iios.fun', '签到成功', r.message || '签到成功');
    }

    return finish('iios.fun', '签到完成', JSON.stringify(obj));
  }

  function poll(jobId, count) {
    const url = RESULT_URL + '?id=' + encodeURIComponent(jobId);
    Env.request({
      url,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${API_SECRET}` }
    }).then(resp => {
      const obj = parseBody(resp.body);
      if (obj.status === 'pending') {
        if (count >= MAX_POLLS) return finish('iios.fun', '签到处理中', '服务仍在执行，请稍后手动重试');
        return setTimeout(() => poll(jobId, count + 1), POLL_INTERVAL);
      }
      return handleFinal(obj);
    }).catch(err => {
      finish('iios.fun', '查询失败', err && (err.error || err.message) ? (err.error || err.message) : JSON.stringify(err));
    });
  }

  function startCheckinByLogin(email, password, clientId) {
    Env.request({
      url: START_URL_SINGLE,
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        username: email,
        password,
        client_id: clientId,
        type: 2,
        webapp: true
      })
    }).then(resp => {
      const obj = parseBody(resp.body);
      if (!obj || !obj.ok || !obj.jobId) {
        return finish('iios.fun', '启动失败', obj.message || resp.body || 'start failed');
      }
      poll(obj.jobId, 1);
    }).catch(err => {
      finish('iios.fun', '请求失败', err && (err.error || err.message) ? (err.error || err.message) : JSON.stringify(err));
    });
  }

  const accountsRaw = String(Env.read(ACCOUNTS_KEY) || '').trim();
  const clientId = String(Env.read(CLIENT_ID_KEY) || 'default').trim() || 'default';

  const accounts = parseAccounts(accountsRaw);

  if (accounts.length > 0) {
    const names = accounts.map(a => maskAccount(a.email)).join(', ');
    Env.notify('iios.fun', `开始批量签到 (${accounts.length}个账号)`, names);
    startBatchCheckin(accounts, clientId);
  } else {
    const email = String(Env.read(EMAIL_KEY) || '').trim();
    const password = String(Env.read(PASSWORD_KEY) || '');

    if (!email || !password) {
      finish('iios.fun', '缺少账号参数', '请先在 BoxJS 填写多账号配置或单账号邮箱密码');
    } else {
      Env.notify('iios.fun', '开始登录签到', '账号：' + maskAccount(email));
      startCheckinByLogin(email, password, clientId);
    }
  }
}
