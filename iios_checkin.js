

const API_BASE = 'https://iios-api.suil.dpdns.org';
const API_SECRET = '5SAi3saB9A7pDRIoKdrmB1HYnQq7exe2';
const START_URL = API_BASE + '/iios/checkin_login_async';
const RESULT_URL = API_BASE + '/iios/checkin_result';

const EMAIL_KEY = 'iios_login_email';
const PASSWORD_KEY = 'iios_login_password';
const CLIENT_ID_KEY = 'iios_client_id';

const POLL_INTERVAL = 3000;
const MAX_POLLS = 15;

function read(key) {
  return $prefs.valueForKey(key) || '';
}

function notify(title, subTitle, message) {
  $notify(String(title || ''), String(subTitle || ''), String(message || ''));
}

function done(value) {
  $done(value);
}

function parseBody(body) {
  try { return JSON.parse(body || '{}'); } catch (e) { return {}; }
}

function request(options) {
  return $task.fetch(options).then(resp => ({
    status: resp.statusCode || resp.status,
    headers: resp.headers || {},
    body: resp.body || ''
  }));
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
    const right = parts[1] || '';
    if (left.length <= 2) return `${left[0] || '*'}***@${right}`;
    return `${left.slice(0, 2)}***@${right}`;
  }
  if (s.length <= 4) return s[0] + '***';
  return s.slice(0, 2) + '***' + s.slice(-2);
}

let finished = false;

function finish(title, subTitle, message) {
  if (finished) return;
  finished = true;
  notify(title, subTitle, String(message || ''));
  done();
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
  request({
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
  request({
    url: START_URL,
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

const email = String(read(EMAIL_KEY) || '').trim();
const password = String(read(PASSWORD_KEY) || '');
const clientId = String(read(CLIENT_ID_KEY) || 'default').trim() || 'default';

if (!email || !password) {
  finish('iios.fun', '缺少账号参数', '请先在 BoxJS 填写邮箱和密码');
} else {
  notify('iios.fun', '开始登录签到', '账号：' + maskAccount(email));
  startCheckinByLogin(email, password, clientId);
}
