
const API_BASE = 'https://iios-api.suil.dpdns.org';
const API_SECRET = '5SAi3saB9A7pDRIoKdrmB1HYnQq7exe2';
const TOKEN_KEY = 'iios_token';
const CLIENT_ID_KEY = 'iios_client_id';
const START_URL = API_BASE + '/iios/checkin_async';
const RESULT_URL = API_BASE + '/iios/checkin_result';
const POLL_INTERVAL = 2500;
const MAX_POLLS = 8;

const Env = (() => {
  const isQX = typeof $task !== 'undefined' && typeof $prefs !== 'undefined';
  const isSurge = typeof $httpClient !== 'undefined' && typeof $persistentStore !== 'undefined' && typeof $loon === 'undefined';
  const isLoon = typeof $loon !== 'undefined' || (typeof $httpClient !== 'undefined' && typeof $persistentStore !== 'undefined' && typeof $environment === 'undefined');

  function read(key) {
    if (isQX) return $prefs.valueForKey(key) || '';
    if (isSurge || isLoon) return $persistentStore.read(key) || '';
    return '';
  }

  function write(val, key) {
    if (isQX) return $prefs.setValueForKey(val, key);
    if (isSurge || isLoon) return $persistentStore.write(val, key);
    return false;
  }

  function notify(title, subTitle, message) {
    if (typeof $notify !== 'undefined') $notify(title, subTitle, String(message || ''));
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

  return { isQX, isSurge, isLoon, read, write, notify, done, request };
})();

function isRequestPhase() {
  return typeof $request !== 'undefined' && $request && $request.headers;
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

if (isRequestPhase()) {
  const headers = $request.headers || {};
  const auth = headers.Authorization || headers.authorization || '';
  if (auth && /^Basic\s+.+/i.test(auth)) {
    const token = auth.replace(/^Basic\s+/i, '').trim();
    if (token) {
      const oldToken = String(Env.read(TOKEN_KEY) || '').trim();
      Env.write(token, TOKEN_KEY);
      if (token !== oldToken) {
        Env.notify('iios.fun', '已抓到 token', '登录态已更新，可执行签到任务');
      } else {
        Env.notify('iios.fun', '已抓到 token', '登录态已保存');
      }
    }
  }
  Env.done({ headers });
} else {
  let finished = false;

  function finish(title, subTitle, message) {
    if (finished) return;
    finished = true;
    Env.notify(title, subTitle, String(message || ''));
    Env.done();
  }

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

  function startCheckin(token, clientId) {
    Env.request({
      url: START_URL,
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ token, client_id: clientId, type: 2, webapp: true })
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

  const token = String(Env.read(TOKEN_KEY) || '').trim();
  const clientId = String(Env.read(CLIENT_ID_KEY) || 'default').trim() || 'default';
  if (!token) {
    finish('iios.fun', '缺少 token', '先打开 iios.fun 并触发一次接口请求，让脚本抓到登录态');
  } else {
    startCheckin(token, clientId);
  }
}
