/* ============================================================
   components.js — 共享注入层 / App Shell + 规范导航 + 图标 + toast
   Design Contract: minimal-light · 温润材艺编辑室
   ============================================================ */
(function(){
  var ICONS = {
    'layout-dashboard':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    'box':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    'layers':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    'sparkles':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9.94 14.94 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94a2 2 0 0 0 1.44-1.44l1.58-6.13a.5.5 0 0 1 .96 0l1.58 6.13a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0l-1.63-6.06Z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>',
    'file-output':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 22V4a2 2 0 0 1 2-2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M12 14v4"/><path d="m8 16 4 2 4-2"/></svg>',
    'truck':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
    'search':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    'bell':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33Z"/></svg>',
    'plus':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    'chevron-right':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    'check':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    'refresh': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    'share2':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" x2="15.4" y1="13.5" y2="17.5"/><line x1="15.4" x2="8.6" y1="6.5" y2="10.5"/></svg>',
    'qr':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>',
    'download':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>',
    'zap':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    'check2':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    'alert':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    'filter':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    'x':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    'package':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    'bookmark':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>',
    'settings':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    'user':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'clipboard':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
    'cube':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21 8-9-5-9 5v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 22V13"/></svg>',
    'palette':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
    'eye':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    'clock':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'arrowRight':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
  };

  window.L = function(name, size){ size=size||18; var s=ICONS[name]||ICONS['x'];
    return s.replace('<svg ','<svg width="'+size+'" height="'+size+'" style="flex:none" '); };

  function injectShell(){
    if(document.getElementById('app-shell-injected')) return;
    var page = document.body.dataset.page || 'dashboard';
    var title = document.body.dataset.title || '工作台';
    var navItems = [
      ['dashboard','工作台','layout-dashboard','index.html'],
      ['library','资产库','box','library.html'],
      ['editor','3D 编辑器','layers','editor.html'],
      ['ai','AI 灵感','sparkles','ai.html'],
      ['proposal','提案','file-output','proposal.html'],
      ['orders','打样 / 订单','truck','orders.html']
    ];
    var nav = '<aside class="app-nav" id="app-shell-injected">'
      +'<div class="nav-logo"><div class="mark">'+(ICONS['layers']||'').replace('<svg ','<svg width="18" height="18" ')+'</div>'
      +'<div class="name">AIGC 包材平台<small>PACK&middot;AI</small></div></div>'
      +'<div class="nav-org"><div class="av">广</div><div><b>广州珀美实业</b><span>ODM · 官网销售部</span></div></div>'
      +'<div class="nav-group"><div class="nav-group-label">业务工作台</div>';
    navItems.forEach(function(it){
      nav += '<a class="nav-item'+(it[0]===page?' active':'')+'" data-nav="'+it[0]+'" href="'+it[3]+'"'+(it[0]===page?' aria-current="page"':'')+'>'
        +'<span style="width:18px;display:inline-flex">'+(ICONS[it[2]]||'')+'</span><span>'+it[1]+'</span></a>';
    });
    nav += '</div><div class="nav-group"><div class="nav-group-label">协作</div>'
      +'<a class="nav-item" data-nav="share" href="proposal.html"><span style="width:18px;display:inline-flex">'+ICONS['share2']+'</span><span>分享与回执</span></a>'
      +'<a class="nav-item" data-nav="notif" href="orders.html"><span style="width:18px;display:inline-flex">'+ICONS['bell']+'</span><span>通知</span></a>'
      +'<a class="nav-item" data-nav="mobile" href="mobile.html" target="_blank" rel="noopener"><span style="width:18px;display:inline-flex">'+ICONS['eye']+'</span><span>客户 H5 预览</span></a></div>'
      +'<div class="nav-foot">Pack&middot;AI — 渲染即报价 · 图即订单</div>'
      +'</aside>';
    document.body.insertAdjacentHTML('afterbegin', nav);

    if(!document.getElementById('app-main')){
      // .app-main 必须位于侧栏之后、并包裹【顶栏 + 正文】，否则顶栏会掉到页面底部
      var appMain = document.createElement('div');
      appMain.id = 'app-main';
      appMain.className = 'app-main';
      appMain.innerHTML = '<header class="topbar">'
        +'<span class="bread">'+title+'</span><div class="spacer"></div>'
        +'<div class="search">'+(ICONS['search']||'').replace('<svg ','<svg width="16" height="16" class="ic" ')+'<input placeholder="搜索瓶型 / 素材 / 订单…" data-search-in></div>'
        +'<button class="tbar-btn" title="通知">'+ICONS['bell']+'<span class="dot"></span></button>'
        +'<div class="user-chip"><div class="av">孟</div><b>孟晓慧</b></div>'
        +'<a class="btn primary" href="editor.html">'+ICONS['plus']+'<span>新建提案</span></a>'
        +'</header>';
      // 把页面自身的 main.content 移入 .app-main（紧跟顶栏之后），而非留在 body 底层
      var content = document.body.querySelector('main.content');
      document.body.insertBefore(appMain, document.body.childNodes[1] || null);
      if(content){ appMain.appendChild(content); }
    }
    document.documentElement.style.setProperty('--page', '"'+title+'"');
  }

  function toast(msg, type){
    var w=document.querySelector('.toast-wrap'); if(!w){w=document.createElement('div');w.className='toast-wrap';document.body.appendChild(w);}
    var t=document.createElement('div'); t.className='toast '+((type||'ok')==='ok'?'ok':'err');
    t.innerHTML=(ICONS[(type||'ok')==='ok'?'check2':'alert'])+'<span>'+msg+'</span>';
    w.appendChild(t); setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(function(){t.remove();},300);},2200);
  }

  /* 全局事件：modal / toast 关闭 */
  document.addEventListener('click', function(e){
    if(e.target && (e.target.dataset||{}).closemodal){ e.target.closest('.modal-mask').classList.remove('open'); }
    var open=e.target.closest && e.target.closest('[data-open-modal]');
    if(open){ document.getElementById(open.dataset.openModal).classList.add('open'); }
  });

  document.addEventListener('DOMContentLoaded', function(){ injectShell(); });
  if(document.readyState!=='loading'){ injectShell(); }

  window.toast = toast;
  window.openModal=function(id){document.getElementById(id).classList.add('open');};
  window.closeModal=function(id){document.getElementById(id).classList.remove('open');};
})();