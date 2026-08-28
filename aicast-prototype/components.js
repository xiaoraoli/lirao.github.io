/* ============================================================
   AICast 内容矩阵平台 · App Shell 注入
   冻结的侧边栏导航 + 顶栏。所有页面共用，body[data-page] 决定激活项。
   离线可用：图标均为内联 Lucide SVG。
   ============================================================ */
(function () {
  'use strict';
  if (window.UI) return;
  window.UI = { toast: null, modal: null };

  /* ---------- Lucide 内联 SVG 图标集 (stroke 风格) ---------- */
  function icon(name, cls, size) {
    var s = size || 18;
    var paths = {
      'grid': '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>',
      'file-plus': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"></path><path d="M14 2v6h6"></path><path d="M12 11v6"></path><path d="M9 14h6"></path>',
      'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
      'calendar': '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path>',
      'bar': '<path d="M3 3v18h18"></path><rect x="7" y="12" width="3" height="6"></rect><rect x="12" y="8" width="3" height="10"></rect><rect x="17" y="5" width="3" height="13"></rect>',
      'target': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
      'search': '<circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path>',
      'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"></path>',
      'chev-down': '<path d="m6 9 6 6 6-6"></path>',
      'chev-right': '<path d="m9 6 6 6-6 6"></path>',
      'check': '<path d="M20 6 9 17l-5-5"></path>',
      'x': '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
      'alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
      'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
      'zap': '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>',
      'cpu': '<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"></path>',
      'globe': '<circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>',
      'clock': '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>',
      'play': '<path d="M6 3h12l6 9-6 9H6l-6-9z"></path><path d="M5 6h4l3 5 4-5h1"></path>',
      'filter': '<path d="M22 3H2l8 9.46V19l4 2v-8.54Z"></path>',
      'refresh': '<path d="M21 12a9 9 0 1 1-3-6.7"></path><path d="M21 3v6h-6"></path>',
      'trash': '<path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>',
      'edit': '<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>',
      'send': '<path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path>',
      'wand': '<path d="m21.6 8 1.4.1-1.08 1.4L23.5 11l-.8 1.16L22 11.9l-.5 1.2L19.3 11l1.3-1 .1.5z"></path><path d="M15 3l6 6"></path><path d="M13 7 5 15l4 4 8-8"></path><path d="m4 18 1 1 1-1 1 1"></path>',
      'arrow-right': '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>',
      'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path>',
      'db': '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14a9 3 0 0 0 18 0V5"></path><path d="M3 12a9 3 0 0 0 18 0"></path>',
      'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>',
      'smile': '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><path d="M9 9h.01"></path><path d="M15 9h.01"></path>'
    };
    var p = paths[name] || paths['grid'];
    return '<svg class="' + (cls || '') + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }
  window.UI.icon = icon;
  window.UI.ic = icon;

  /* ---------- 冻结的导航定义 (禁止增删改序) ---------- */
  var NAV = [
    { key: 'dashboard', label: '控制台',  href: 'index.html',   ico: 'grid' },
    { key: 'generator', label: '内容生成', href: 'generator.html', ico: 'wand' },
    { key: 'accounts',  label: '矩阵账户', href: 'accounts.html',  ico: 'users',  badge: '2', bwarn: 1 },
    { key: 'schedule',  label: '预审调度', href: 'schedule.html',  ico: 'calendar', badge: '3', bwarn: 1 },
    { key: 'analytics', label: '数据回流', href: 'analytics.html', ico: 'bar' },
    { key: 'decisions', label: '决策面板', href: 'decisions.html', ico: 'target' }
  ];

  var PAGES = {
    dashboard: ['控制台', '今日矩阵运行总览'],
    generator: ['内容生成台', 'AI 批量产内容 · 逐条可审'],
    accounts:  ['矩阵账户与环境', '账号健康 · 独立环境隔离'],
    schedule:  ['预审与调度', '分时错峰 · 规避平台互禁'],
    analytics: ['数据回流看板', '4D 归因 · 反哺下一轮生成'],
    decisions: ['每日决策面板', '10 分钟拍板今日动作']
  };

  /* ---------- 侧边栏 ---------- */
  function buildSidebar(active) {
    var links = NAV.map(function (n) {
      var badge = n.badge ? '<span class="nav-badge' + (n.bwarn ? ' warn' : '') + '">' + n.badge + '</span>' : '';
      var cls = 'nav-link' + (n.key === active ? ' active' : '');
      return '<a class="' + cls + '" href="' + n.href + '" data-nav="' + n.key + '"' + (n.key === active ? ' aria-current="page"' : '') + '>' +
        icon(n.ico) + '<span>' + n.label + '</span>' + badge + '</a>';
    }).join('');
    return '' +
      '<aside class="side" id="app-nav">' +
        '<div class="brand"><div class="logo">' + icon('zap', '', 19) + '</div>' +
        '<div class="name">AICast<small>CONTENT MATRIX</small></div></div>' +
        '<div class="nav-group">工作台</div>' +
        '<nav>' + links + '</nav>' +
        '<div class="side-user"><div class="avatar">运营</div>' +
        '<div><div class="u-name">内容运营小宋</div><div class="u-role">高级运营 · 8 个账号</div></div></div>' +
      '</aside>';
  }

  /* ---------- 顶栏 ---------- */
  function buildTopbar(page) {
    var t = PAGES[page] || ['', ''];
    return '' +
      '<header class="topbar" id="app-topbar">' +
        '<div class="page-title"><h1>' + t[0] + '</h1><p>' + t[1] + '</p></div>' +
        '<div class="topbar-right">' +
          '<div class="status-pill"><span class="live-dot"></span>本地守护在线</div>' +
          '<div class="search">' + icon('search') + '<input placeholder="搜索内容 / 账号 / 任务…" aria-label="搜索"></div>' +
          '<button class="icon-btn" aria-label="通知">' + icon('bell') + '<span class="dot"></span></button>' +
          '<div class="user-pill"><div class="avatar">运营</div><span class="small muted">小宋</span>' + icon('chev-down', '', 15) + '</div>' +
        '</div>' +
      '</header>';
  }

  /* ---------- init (同步、幂等) ---------- */
  function init() {
    if (document.getElementById('app-nav')) return;
    var page = (document.body.getAttribute('data-page') || 'dashboard');
    // 登录页等无壳页面：注入公共工具（UI.toast/icon），但不挂 App Shell
    if (page === 'login') return;
    // 侧边栏注入到 body 最前
    document.body.insertAdjacentHTML('afterbegin', buildSidebar(page));
    // 顶栏注入到 content 顶部
    var content = document.querySelector('main.content');
    if (content) content.insertAdjacentHTML('afterbegin', buildTopbar(page));
  }
  init();

  /* ---------- Toast / Modal 全局 ---------- */
  window.UI.toast = function (msg, type) {
    var t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    var ico = type === 'ok' ? 'check' : (type === 'err' ? 'alert' : 'bell');
    t.innerHTML = icon(ico) + '<span class="t-msg">' + msg + '</span>';
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2600);
  };
})();