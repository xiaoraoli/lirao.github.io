/* ============================================================
   AICast · api.js — API 桩（签名即未来真实 API，仅返回 mock）
   所有函数带 // TODO: replace with ... 标出对接点
   ============================================================ */
(function () {
  'use strict';
  var DB = window.DB || {};
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var api = {};

  /* GET /api/login  — 演示账号 1234/1234 */
  api.login = function (username, password) {
    // TODO: replace with axios.post('/api/login', {username,password})
    return delay(700).then(function () {
      if (username === '1234' && password === '1234') return { ok: true, token: 'demo-token', user: { name: '内容运营小宋', role: '高级运营' } };
      return { ok: false, msg: '账号或密码错误，演示账号 1234 / 1234' };
    });
  };

  /* GET /api/accounts */
  api.fetchAccounts = function () {
    // TODO: replace with fetch('/api/accounts').then(r=>r.json())
    return delay(450).then(function () { return DB.accounts.slice(); });
  };

  /* GET /api/health-overview */
  api.fetchHealthOverview = function () {
    // TODO: replace with fetch('/api/health-overview')
    return delay(380).then(function () {
      var a = DB.accounts;
      return {
        total: a.length,
        healthy: a.filter(function (x) { return x.status === 'healthy'; }).length,
        critical: a.filter(function (x) { return x.status === 'critical'; }).length,
        offline: a.filter(function (x) { return x.status === 'offline'; }).length
      };
    });
  };

  /* GET /api/contents */
  api.fetchContents = function (status) {
    // TODO: replace with fetch(`/api/contents?status=${status}`)
    return delay(500).then(function () {
      var list = DB.contents.slice();
      if (status && status !== 'all') list = list.filter(function (c) { return c.status === status; });
      return list;
    });
  };

  /* POST /api/generate  — mock：返回 3 条变体 */
  api.generate = function (materialId, template) {
    // TODO: replace with POST /api/generate  {materialId, template, count:10}
    return delay(1400).then(function () {
      return {
        scripts: ['「人均30，藏在这种犄角旮旯…」', '「老板连开 100000 片肉的底气…」', '「别告诉别人，这是隐藏菜单…」'],
        draft: { duration: '00:47', subtitles: true, voice: true, cover: true, quality: '720P' }
      };
    });
  };

  /* GET /api/schedule-tasks */
  api.fetchTasks = function () {
    // TODO: replace with fetch('/api/schedule-tasks')
    return delay(420).then(function () { return DB.scheduleTasks.slice(); });
  };

  /* POST /api/schedule  — 错峰排布 */
  api.buildSchedule = function (contentId, platforms) {
    // TODO: replace with POST /api/schedule {contentId, platforms}
    return delay(1100).then(function () {
      var order = { '抖音': '09:00', '小红书': '19:20', '快手': '待排', '视频号': '23:00' };
      return platforms.map(function (p) {
        return { platform: p, time: order[p] || '自动排布', healthGate: '通过' };
      });
    });
  };

  /* GET /api/analytics */
  api.fetchAnalytics = function () {
    // TODO: replace with fetch('/api/analytics?dim=4d')
    return delay(500).then(function () { return DB.analytics.slice(); });
  };

  /* GET /api/decisions */
  api.fetchDecisions = function () {
    // TODO: replace with fetch('/api/decisions/today')
    return delay(400).then(function () { return DB.decisions.slice(); });
  };

  /* POST /api/decisions/confirm */
  api.confirmDecisions = function (ids) {
    // TODO: replace with POST /api/decisions/confirm {ids}
    return delay(900).then(function () { return { ok: true, accepted: ids.length }; });
  };

  /* GET /api/feedback-tags */
  api.fetchFeedbackTags = function () {
    // TODO: replace with fetch('/api/feedback-tags')
    return delay(350).then(function () { return DB.feedbackTags.slice(); });
  };

  window.api = api;
})();