/* ============================================
   伍星御瓶 · 应用主逻辑
   ============================================ */
(function () {
  'use strict';

  // ——— Lucide 图标初始化 ———
  const initIcons = () => { if (window.lucide) window.lucide.createIcons(); };

  // ——— 路由切换 ———
  const PAGES = {
    dashboard:        { title: '数字大脑' },
    'mould-overview': { title: '模具总览' },
    'mould-detail':   { title: '模具档案' },
    'mould-order':    { title: '订单×模具' },
    'mould-maintain': { title: '保养预警' },
    'mould-3d':       { title: '3D 模仓' },
    'mes-schedule':   { title: 'MES 排产看板' },
    'mes-pda':        { title: '工位 PDA' },
    'mes-iot':        { title: 'IoT 实时数据' },
    'mes-issue':      { title: '异常派工' },
    'wms':            { title: 'WMS 仓储' },
    'newplant':       { title: '新厂搬迁协同' },
    'client-portal':  { title: '客户 Portal' },
    'client-carbon':  { title: '碳足迹报告' },
    'client-quality': { title: '质量数据透明' },
    'client-audit':   { title: '远程验厂' },
    'erp-hub':        { title: 'ERP 对接中心' },
    'client-order-detail': { title: '订单详情穿透' },
    'mould-timeline': { title: '模具×订单时间线' },
    'aps-compare':    { title: 'APS 试排对比' },
    'ai-quality':     { title: 'AI 质量预测' },
    'digital-twin':   { title: '数字孪生车间' },
    'supplier-portal':{ title: '供应商协同门户' },
  };

  function go(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.dataset.page === pageId));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === pageId));
    const info = PAGES[pageId];
    if (info) document.getElementById('breadCur').textContent = info.title;
    if (pageId === 'mould-3d' && !window.__three3dInited) {
      initThree();
      window.__three3dInited = true;
    }
    initIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 切到带 ECharts 的页面时，强制让所有 chart 重新计算尺寸（解决隐藏态初始化导致 0 宽）
    requestAnimationFrame(() => {
      (window.__echarts || []).forEach(c => c && c.resize && c.resize());
    });
  }
  window.go = go;

  document.querySelectorAll('.nav-item').forEach(n => {
    n.addEventListener('click', (e) => {
      if (n.classList.contains('disabled')) {
        e.preventDefault();
        toast('该模块尚在规划中，将在二期/三期交付', 'warn');
        return;
      }
      const p = n.dataset.page;
      if (p) go(p);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => go(el.dataset.goto));
  });

  // ——— 厂区切换 ———
  document.querySelectorAll('.site-opt').forEach(s => {
    s.addEventListener('click', () => {
      document.querySelectorAll('.site-opt').forEach(x => x.classList.toggle('active', x === s));
      if (s.dataset.site === 'new') {
        toast('新智造基地正在建设中，设备进场数据为模拟', 'info');
      } else {
        toast('已切换到旧厂 · 3 万 m² 生产基地', 'ok');
      }
    });
  });

  // ——— ERP 切换 ———
  const erpSwitch = document.getElementById('erpSwitch');
  const erpSwitchFoot = document.getElementById('erpSwitchFoot');
  const erpHint = document.getElementById('erpHint');
  function syncErp() {
    if (erpSwitch.checked !== erpSwitchFoot.checked) {
      erpSwitchFoot.checked = erpSwitch.checked;
    }
    if (erpSwitch.checked) {
      erpHint.classList.remove('self');
      erpHint.querySelector('span').innerHTML = '当前为 <b>对接 ERP</b> 模式（演示用） · 自研时可一键接管主数据与业务流程';
    } else {
      erpHint.classList.add('self');
      erpHint.querySelector('span').innerHTML = '<b>自研模式</b> · 已接管主数据与业务流程';
    }
  }
  erpSwitch.addEventListener('change', () => { syncErp(); toast(erpSwitch.checked ? '已切回 ERP 对接模式' : '已切到自研接管模式', erpSwitch.checked ? 'info' : 'ok'); });
  erpSwitchFoot.addEventListener('change', () => { erpSwitch.checked = erpSwitchFoot.checked; syncErp(); });

  // ——— Toast ———
  function toast(msg, type) {
    type = type || 'info';
    const host = document.getElementById('toastHost');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const icons = { ok: 'check-circle-2', warn: 'alert-triangle', err: 'x-circle', info: 'info' };
    t.innerHTML = '<i data-lucide="' + (icons[type] || 'info') + '" class="ti"></i><span>' + msg + '</span>';
    host.appendChild(t);
    initIcons();
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; setTimeout(() => t.remove(), 300); }, 3000);
  }
  window.toast = toast;

  // ——— 顶部时间 ———
  function tickTime() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    document.getElementById('topTime').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  setInterval(tickTime, 1000); tickTime();

  // ====================================================
  // 数字大脑首页
  // ====================================================
  function initDashboard() {
    // KPI 数字滚动
    document.querySelectorAll('.kpi-value').forEach(el => {
      const final = el.textContent;
      const num = parseFloat(final);
      if (isNaN(num)) return;
      let cur = 0;
      const step = num / 30;
      const unit = el.querySelector('.kpi-unit')?.outerHTML || '';
      const interval = setInterval(() => {
        cur += step;
        if (cur >= num) { cur = num; clearInterval(interval); }
        el.innerHTML = (num < 100 ? cur.toFixed(1) : Math.floor(cur)) + unit;
      }, 30);
    });

    // 异常流水
    const issueList = document.getElementById('issueList');
    const issueColors = { err: '#EF4444', warn: '#F59E0B', info: '#3B82F6' };
    const issueBg = { err: 'rgba(239,68,68,.12)', warn: 'rgba(245,158,11,.12)', info: 'rgba(59,130,246,.12)' };
    const issueText = { err: '异常', warn: '告警', info: '通知' };
    issueList.innerHTML = window.MOCK.issues.map((it, i) => `
      <div class="issue-row">
        <div class="issue-time">${it.time}</div>
        <div class="issue-title">
          <span class="issue-tag" style="background:${issueBg[it.level]};color:${issueColors[it.level]}">${issueText[it.level]}</span>
          <span>${it.title}</span>
          <span style="color:var(--text-3);font-size:12px;margin-left:6px">${it.desc}</span>
        </div>
        <div style="color:var(--text-3);font-size:12px">${i === 0 ? '李工' : i === 1 ? '未派单' : '系统'}</div>
        <div style="color:var(--text-3);font-size:12px">${i === 0 ? '处理中' : i === 1 ? '待派单' : '已通知'}</div>
        <button class="btn ghost" style="padding:4px 10px;font-size:12px">${it.action}</button>
      </div>
    `).join('');

    // ① OEE 实时看板 - 多机台堆叠
    const oeeChart = echarts.init(document.getElementById('chartOee'));
    const hours = [];
    for (let i = 0; i < 24; i++) hours.push(String(i).padStart(2, '0') + ':00');
    oeeChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' } },
      legend: { data: ['1号注塑', '2号注塑', '3号注塑', '4号注塑', '5号注塑', '吹塑线', '丝印线'], textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0, right: 0 },
      grid: { left: 40, right: 16, top: 36, bottom: 28 },
      xAxis: { type: 'category', data: hours, axisLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } }, axisLabel: { color: '#64748B', fontSize: 10, interval: 3 } },
      yAxis: { type: 'value', max: 100, axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.05)' } }, axisLabel: { color: '#64748B', fontSize: 10, formatter: '{value}%' } },
      series: [
        { name: '1号注塑', type: 'line', smooth: true, symbol: 'none', data: genOee(), lineStyle: { width: 1.5 }, itemStyle: { color: '#E8B4A0' } },
        { name: '2号注塑', type: 'line', smooth: true, symbol: 'none', data: genOee(80), lineStyle: { width: 1.5 }, itemStyle: { color: '#10B981' } },
        { name: '3号注塑', type: 'line', smooth: true, symbol: 'none', data: genOee(91), lineStyle: { width: 1.5 }, itemStyle: { color: '#3B82F6' } },
        { name: '4号注塑', type: 'line', smooth: true, symbol: 'none', data: genOee(0, 50), lineStyle: { width: 1.5 }, itemStyle: { color: '#F59E0B' } },
        { name: '5号注塑', type: 'line', smooth: true, symbol: 'none', data: genOee(78), lineStyle: { width: 1.5 }, itemStyle: { color: '#D4A574' } },
        { name: '吹塑线', type: 'line', smooth: true, symbol: 'none', data: genOee(82, 30), lineStyle: { width: 1.5 }, itemStyle: { color: '#06B6D4' } },
        { name: '丝印线', type: 'line', smooth: true, symbol: 'none', data: genOee(85, 25), lineStyle: { width: 1.5 }, itemStyle: { color: '#A855F7' } },
      ],
    });
    window.__echarts = window.__echarts || [];
    window.__echarts.push(oeeChart);

    // ④ 客户订单热力
    const heatChart = echarts.init(document.getElementById('chartClientHeat'));
    const clients = window.MOCK.clients;
    const dates = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); dates.push((d.getMonth() + 1) + '/' + d.getDate()); }
    const data = [];
    for (let c = 0; c < clients.length; c++) {
      for (let d = 0; d < 14; d++) {
        const v = Math.floor(Math.random() * 8);
        if (v > 0) data.push([d, c, v]);
      }
    }
    heatChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { position: 'top', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' }, formatter: p => `${clients[p.value[1]]} · ${dates[p.value[0]]}<br/>订单 ${p.value[2]} 单` },
      grid: { left: 70, right: 16, top: 16, bottom: 32 },
      xAxis: { type: 'category', data: dates, axisLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } }, axisLabel: { color: '#64748B', fontSize: 10 }, splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,.01)', 'transparent'] } } },
      yAxis: { type: 'category', data: clients, axisLine: { show: false }, axisLabel: { color: '#94A3B8', fontSize: 11 }, splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,.01)', 'transparent'] } } },
      visualMap: { min: 0, max: 8, calculable: false, orient: 'horizontal', left: 'center', bottom: 0, itemWidth: 10, itemHeight: 80, textStyle: { color: '#64748B', fontSize: 10 }, inRange: { color: ['rgba(232,180,160,.05)', 'rgba(232,180,160,.4)', '#E8B4A0', '#D4A574'] } },
      series: [{ name: '订单量', type: 'heatmap', data: data, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(232,180,160,.5)' } } }],
    });
    window.__echarts.push(heatChart);

    // KPI 迷你 sparkline
    setTimeout(() => {
      ['sparkOee', 'sparkMould', 'sparkOrder', 'sparkIssue'].forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;
        const c = echarts.init(el);
        const colors = ['#E8B4A0', '#10B981', '#3B82F6', '#EF4444'];
        c.setOption({
          backgroundColor: 'transparent',
          grid: { left: 0, right: 0, top: 4, bottom: 0 },
          xAxis: { type: 'category', show: false, data: Array.from({ length: 16 }, (_, i) => i) },
          yAxis: { show: false },
          series: [{ type: 'line', smooth: true, symbol: 'none', data: Array.from({ length: 16 }, () => Math.random() * 100), lineStyle: { width: 1.5, color: colors[idx] }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: colors[idx] + '40' }, { offset: 1, color: 'transparent' }]) } }],
        });
        window.__echarts.push(c);
      });
    }, 50);

    // ==================================================
    // 按钮：导出早会简报
    // ==================================================
    const exportBtn = document.getElementById('dashExportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const clients = window.MOCK.clients || ['修正', '阿道夫', '花西子', '毛戈平', '珀莱雅', '完美日记'];
        const issues = window.MOCK.issues || [];
        const issueLabel = { err: '异常', warn: '告警', info: '通知' };
        const stamps = [];
        const d = new Date();
        for (let i = 3; i >= 0; i--) { const t = new Date(d); t.setDate(t.getDate() - i); stamps.push((t.getMonth() + 1) + '/' + t.getDate()); }
        const heatHtml = stamps.map((s, di) => {
          const cells = clients.map((c, ci) => {
            const v = Math.floor(Math.random() * 8);
            const color = v === 0 ? 'none' : v >= 5 ? '#E8B4A0' : v >= 3 ? '#b98b6a' : 'rgba(232,180,160,.35)';
            return `<td style="width:56px;height:26px;text-align:center;background:${color === 'none' ? 'transparent' : color};color:${color === 'none' ? 'transparent' : '#0B1220'};border:1px solid rgba(255,255,255,.06)">${v||''}</td>`;
          }).join('');
          return `<tr><td style="color:#94A3B8;padding-right:10px">${s}</td>${cells}</tr>`;
        }).join('');
        const issueHtml = issues.slice(0, 4).map(it => `
          <tr>
            <td style="color:#94A3B8">${it.time}</td>
            <td><span style="color:${it.level === 'err' ? '#EF4444' : it.level === 'warn' ? '#F59E0B' : '#3B82F6'}">● ${issueLabel[it.level]}</span></td>
            <td>${it.title}</td>
            <td style="color:#94A3B8">${it.desc}</td>
          </tr>`).join('');
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>伍星御瓶 · 早会简报 ${dateStr}</title>
<style>
  body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:#0B1220;color:#E2E8F0;padding:32px;margin:0;max-width:960px}
  h1{font-size:26px;margin:0 0 4px;color:#E8B4A0} .sub{color:#94A3B8;font-size:13px;margin-bottom:28px}
  .kpis{display:flex;gap:14px;margin-bottom:24px;flex-wrap:wrap}
  .kpi{flex:1;min-width:170px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px}
  .kpi .l{color:#94A3B8;font-size:12px} .kpi .v{font-size:30px;font-weight:700;margin:4px 0;color:#E8B4A0}
  .kpi .t{font-size:11px}
  h2{font-size:16px;margin:26px 0 12px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.1);color:#E8B4A0}
  table{border-collapse:collapse;font-size:12px;width:100%} td,th{padding:8px 10px;border:1px solid rgba(255,255,255,.06);text-align:left}
  th{background:rgba(255,255,255,.03);color:#94A3B8;font-weight:600}
  .heat td{border:1px solid rgba(255,255,255,.06)}
  .bars{margin-top:8px} .bar-l{display:flex;justify-content:space-between;font-size:12px;margin:6px 0}
  .bar{height:8px;background:rgba(255,255,255,.05);border-radius:4px;overflow:hidden;margin-bottom:4px}
  .bar i{display:block;height:100%;border-radius:4px}
  .foot{margin-top:32px;color:#64748B;font-size:11px;border-top:1px solid rgba(255,255,255,.08);padding-top:12px}
</style></head><body>
  <h1>伍星御瓶 · 生产早会简报</h1>
  <div class="sub">总经理早会视角 · 数据截至 ${dateStr} 07:30 · 自动由「数字大脑」生成</div>
  <div class="kpis">
    <div class="kpi"><div class="l">全厂 OEE</div><div class="v">82.4%</div><div class="t" style="color:#10B981">▲ 较昨日 +2.1%</div></div>
    <div class="kpi"><div class="l">在产模具</div><div class="v">14 / 20</div><div class="t" style="color:#94A3B8">开机率 87.5%</div></div>
    <div class="kpi"><div class="l">今日交付订单</div><div class="v">12 单</div><div class="t" style="color:#94A3B8">准时率 96%</div></div>
    <div class="kpi"><div class="l">待处理异常</div><div class="v" style="color:#EF4444">3 项</div><div class="t" style="color:#EF4444">已派工 2 / 3</div></div>
  </div>
  <h2>① 全厂 OEE 实时看板（注塑车间）</h2>
  <table><tr><th style="width:120px">关键机台</th><th>昨日 OEE</th><th>状态</th></tr>
    <tr><td>3 号注塑机 IM-03</td><td>91.2%</td><td style="color:#10B981">● 正常</td></tr>
    <tr><td>5 号注塑机 IM-05</td><td>78.0%</td><td style="color:#F59E0B">● 关注</td></tr>
    <tr><td>吹塑线</td><td>82.0%</td><td style="color:#10B981">● 正常</td></tr>
    <tr><td>丝印线</td><td>85.0%</td><td style="color:#10B981">● 正常</td></tr></table>
  <h2>② 模具健康度</h2>
  <table><tr><th>综合健康度</th><th>健康</th><th>注意</th><th>告警</th><th>停用</th></tr>
    <tr><td style="color:#E8B4A0;font-size:20px;font-weight:700">87%</td><td>14</td><td>4</td><td style="color:#EF4444">2</td><td>0</td></tr></table>
  <h2>③ 新厂建设进度</h2>
  <div class="bars">
    ${[['土建工程',100,'#10B981'],['机电安装',78,'#3B82F6'],['设备进场',42,'#D4A574'],['数字大脑',18,'#E8B4A0'],['试生产',0,'#6B7280']].map(b => `<div class="bar-l"><span>${b[0]}</span><span style="color:#94A3B8">${b[1]}%</span></div><div class="bar"><i style="width:${b[1]}%;background:${b[2]}"></i></div>`).join('')}
  </div>
  <h2>④ 客户订单交付热力（近 4 日）</h2>
  <table class="heat"><tr><th></th>${clients.map(c => `<th style="font-weight:400">${c}</th>`).join('')}</tr>${heatHtml}</table>
  <h2>⑤ 实时异常流水（优先项）</h2>
  <table><tr><th>时间</th><th>级别</th><th>异常</th><th>说明</th></tr>${issueHtml}</table>
  <div class="foot">本简报由伍星御瓶「数字大脑」自动汇总生成 · 更多详情见数字化协同系统 · 生成时间 ${dateStr} 07:30</div>
</body></html>`;
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '伍星御瓶_早会简报_' + dateStr + '.html';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(a.href);
        const btn = exportBtn;
        const old = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i>已导出';
        btn.classList.add('btn-ok');
        setTimeout(() => { btn.innerHTML = old; btn.classList.remove('btn-ok'); }, 1800);
      });
    }

    // ==================================================
    // 按钮：开始巡检（数字大脑自动巡航）
    // ==================================================
    const inspectBtn = document.getElementById('dashInspectBtn');
    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => {
        if (inspectBtn.disabled) return;
        inspectBtn.disabled = true;
        const old = inspectBtn.innerHTML;
        inspectBtn.innerHTML = '<i data-lucide="loader" class="spin"></i>巡检中…';
        const seq = [
          { el: document.querySelector('[data-page="dashboard"] .kpi-row'), name: '核心 KPI', wait: 1500 },
          { el: document.querySelector('#chartOee')?.closest('.dash-card'), name: '① 全厂 OEE', wait: 2200 },
          { el: document.querySelector('[data-page="dashboard"] .mould-health')?.closest('.dash-card'), name: '② 模具健康度', wait: 1600 },
          { el: document.querySelector('[data-page="dashboard"] .build-progress')?.closest('.dash-card'), name: '③ 新厂建设进度', wait: 1600 },
          { el: document.querySelector('#chartClientHeat')?.closest('.dash-card'), name: '④ 客户订单交付', wait: 2200 },
          { el: document.getElementById('issueList'), name: '异常流水', wait: 1800 },
        ].filter(s => s.el);
        const toast = document.createElement('div');
        toast.className = 'inspect-toast';
        toast.textContent = '';
        document.body.appendChild(toast);
        let i = 0;
        const step = () => {
          if (i >= seq.length) {
            toast.textContent = '✅ 巡检完成';
            toast.style.borderColor = 'rgba(16,185,129,.6)';
            setTimeout(() => {
              toast.remove();
              inspectBtn.disabled = false;
              inspectBtn.innerHTML = old;
            }, 1200);
            return;
          }
          const s = seq[i];
          toast.textContent = '● 巡检中：' + s.name;
          s.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.querySelectorAll('.inspect-highlight').forEach(e => e.classList.remove('inspect-highlight'));
          s.el.classList.add('inspect-highlight');
          i++;
          setTimeout(step, s.wait);
        };
        step();
      });
    }
  }

  function genOee(base, jitter) {
    base = base || 87; jitter = jitter || 15;
    return Array.from({ length: 24 }, () => Math.max(0, Math.min(100, base + (Math.random() - 0.5) * jitter)));
  }

  // ====================================================
  // 模具总览
  // ====================================================
  function initMouldOverview() {
    const groups = { dev: [], prod: [], maint: [], scrap: [] };
    window.MOCK.moulds.forEach(m => groups[m.state] && groups[m.state].push(m));

    document.querySelectorAll('.quad-col').forEach(col => {
      const state = col.dataset.state;
      const body = col.querySelector('.quad-body');
      const items = groups[state] || [];
      col.querySelector('.quad-count').textContent = items.length;
      body.innerHTML = items.map(m => renderMouldCard(m)).join('');
      // 更新顶部统计
    });
    document.querySelectorAll('.ms-item .ms-num').forEach((el, i) => {
      const map = ['dev', 'prod', 'maint', 'scrap'];
      if (i < 4) el.textContent = groups[map[i]].length;
      if (i === 4) el.textContent = window.MOCK.moulds.length;
    });

    // 卡片点击
    body_click_init();
  }

  function renderMouldCard(m) {
    const pct = m.life ? Math.round((m.life / m.total) * 100) : 0;
    const lifeColor = m.life > 40000 ? '#EF4444' : m.life > 30000 ? '#F59E0B' : '#10B981';
    const fillColor = m.state === 'dev' ? '#3B82F6' : m.state === 'maint' ? '#F59E0B' : m.state === 'scrap' ? '#EF4444' : lifeColor;
    let foot = '';
    if (m.state === 'dev') {
      foot = '<i data-lucide="clock"></i>开发第 ' + m.devDays + ' 天';
    } else if (m.state === 'prod') {
      foot = '<i data-lucide="map-pin"></i>' + (m.machine || '待派') + ' · ' + (m.progress || 0) + '%';
    } else if (m.state === 'maint') {
      foot = '<i data-lucide="wrench"></i>已停机 · 待保养';
    } else if (m.state === 'scrap') {
      foot = '<i data-lucide="trash-2"></i>已达寿命上限';
    }
    const lifeBlock = m.life > 0 ? `
      <div class="mc-life">
        <div class="mc-life-bar"><div class="mc-life-fill" style="width:${pct}%;background:${fillColor}"></div></div>
        <div class="mc-life-meta"><span>${m.life.toLocaleString()} / ${m.total.toLocaleString()}</span><span>${pct}%</span></div>
      </div>` : `<div class="mc-life"><div class="mc-life-meta" style="justify-content:flex-end;color:var(--info)"><span>开发中 · 试模阶段</span></div></div>`;
    return `
      <div class="mc" data-mould="${m.id}">
        <div class="mc-top">
          <div class="mc-id">${m.icon} ${m.id}</div>
          <span class="status-pill ${m.state === 'prod' ? 'ok' : m.state === 'dev' ? 'info' : m.state === 'maint' ? 'warn' : 'err'}">${m.state === 'dev' ? '开发中' : m.state === 'prod' ? '在产' : m.state === 'maint' ? '待保养' : '待报废'}</span>
        </div>
        <div class="mc-prod">${m.prod} · ${m.ver}</div>
        <div class="mc-client">客户：${m.client}</div>
        ${lifeBlock}
        <div class="mc-foot">${foot}</div>
      </div>
    `;
  }

  function body_click_init() {
    document.querySelectorAll('.mc').forEach(c => {
      c.addEventListener('click', () => {
        go('mould-detail');
        toast('已跳转到模具档案：' + c.dataset.mould, 'info');
      });
    });
  }

  // ====================================================
  // 模具档案详情
  // ====================================================
  function initMouldDetail() {
    // 寿命趋势图
    const lifeChart = echarts.init(document.getElementById('chartLife'));
    const days = Array.from({ length: 30 }, (_, i) => '8/' + (i + 1));
    const usage = Array.from({ length: 30 }, (_, i) => 410 + Math.floor(Math.random() * 30));
    lifeChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' } },
      grid: { left: 30, right: 12, top: 16, bottom: 22 },
      xAxis: { type: 'category', data: days, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 9, interval: 4 } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } }, axisLabel: { color: '#64748B', fontSize: 9 } },
      series: [{ name: '日模塑次数', type: 'bar', data: usage, barWidth: 6, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E8B4A0' }, { offset: 1, color: 'rgba(232,180,160,.2)' }]), borderRadius: [3, 3, 0, 0] } }],
    });
    window.__echarts = window.__echarts || [];
    window.__echarts.push(lifeChart);
  }

  // ====================================================
  // 保养预警
  // ====================================================
  function initMouldMaintain() {
    // 寿命倒计时排行
    const sorted = [...window.MOCK.moulds].filter(m => m.life > 0).sort((a, b) => a.life - b.life);
    const lifeTable = document.getElementById('lifeTable');
    const head = `<div class="lt-row head"><div>排名</div><div>模具</div><div>客户</div><div>剩余/总次</div><div>寿命进度</div><div>状态</div></div>`;
    lifeTable.innerHTML = head + sorted.slice(0, 12).map((m, i) => {
      const pct = ((m.life / m.total) * 100);
      const fill = pct > 95 ? '#EF4444' : pct > 85 ? '#F59E0B' : pct > 50 ? '#10B981' : '#3B82F6';
      const status = pct > 95 ? '<span class="status-pill err">告警</span>' : pct > 85 ? '<span class="status-pill warn">待保养</span>' : pct > 50 ? '<span class="status-pill ok">健康</span>' : '<span class="status-pill info">在产</span>';
      return `<div class="lt-row">
        <div class="num" style="color:${i < 3 ? '#E8B4A0' : 'var(--text-3)'}">#${String(i + 1).padStart(2, '0')}</div>
        <div><span style="margin-right:6px">${m.icon}</span><b>${m.id}</b> <span style="color:var(--text-3);font-size:11px;margin-left:6px">${m.ver}</span><div style="font-size:11px;color:var(--text-3);margin-top:2px">${m.prod}</div></div>
        <div>${m.client}</div>
        <div class="num">${m.life.toLocaleString()} / ${m.total.toLocaleString()}</div>
        <div class="lt-bar"><div class="lt-bar-fill" style="width:${pct}%;background:${fill}"></div></div>
        <div>${status}</div>
      </div>`;
    }).join('');

    // 保养日历（2026 年 8 月）
    const cal = document.getElementById('calendar');
    const headers = ['日', '一', '二', '三', '四', '五', '六'].map((d, i) => `<div class="cal-cell-head ${i === 0 || i === 6 ? 'we' : ''}">${d}</div>`).join('');
    // 2026-08-01 是星期六
    const firstDay = 6;
    const daysInMonth = 31;
    let cells = '';
    for (let i = 0; i < firstDay; i++) cells += '<div class="cal-cell dim"></div>';
    // 模拟保养数据
    const plans = { 5: 'plan', 8: 'plan', 12: 'warn', 15: 'plan', 18: 'ok', 22: 'warn', 25: 'plan', 28: 'ok' };
    for (let d = 1; d <= daysInMonth; d++) {
      const today = d === 25;
      const plan = plans[d];
      let dots = '';
      if (plan === 'plan') dots = '<div class="cal-dots"><span class="cal-dot"></span><span class="cal-dot"></span></div>';
      if (plan === 'warn') dots = '<div class="cal-dots"><span class="cal-dot warn"></span><span class="cal-dot warn"></span><span class="cal-dot"></span></div>';
      if (plan === 'ok') dots = '<div class="cal-dots"><span class="cal-dot ok"></span></div>';
      cells += `<div class="cal-cell ${today ? 'today' : ''}"><div class="day">${d}</div>${dots}</div>`;
    }
    cal.innerHTML = headers + cells;
  }

  // ====================================================
  // 3D 模仓
  // ====================================================
  function initThree() {
    const container = document.getElementById('threeBox');
    if (!container || !window.THREE) return;
    const w = container.clientWidth, h = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B1220);
    scene.fog = new THREE.Fog(0x0B1220, 20, 60);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(18, 16, 22);
    camera.lookAt(0, 4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 灯光
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(20, 30, 15);
    dir.castShadow = true;
    scene.add(dir);
    const point = new THREE.PointLight(0xE8B4A0, 0.8, 30);
    point.position.set(0, 8, 0);
    scene.add(point);

    // 地面
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    // 网格
    const grid = new THREE.GridHelper(50, 50, 0x1F2937, 0x1F2937);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);

    // 货架
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x1A2540, roughness: 0.6, metalness: 0.2 });
    const mouldColors = { dev: 0x3B82F6, prod: 0x10B981, maint: 0xF59E0B, scrap: 0xEF4444 };
    const mouldMeshes = [];
    const slotMeshes = [];

    // 创建 4 排货架，每排 20 个模位
    for (let row = 0; row < 4; row++) {
      const rackX = -9 + row * 6;
      const rack = new THREE.Group();
      // 立柱
      for (let c = 0; c < 2; c++) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 0.3), shelfMat);
        post.position.set(c === 0 ? -0.15 : 14.15, 4, 0);
        rack.add(post);
      }
      // 横梁
      for (let l = 0; l < 4; l++) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(14, 0.2, 0.3), shelfMat);
        beam.position.set(7, 2 + l * 2, 0);
        rack.add(beam);
      }
      rack.position.set(rackX, 0, -4);
      scene.add(rack);

      // 模位
      for (let i = 0; i < 20; i++) {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.5, 0.8),
          new THREE.MeshStandardMaterial({ color: 0x131C2E, roughness: 0.9 })
        );
        const level = i % 4;
        const col = Math.floor(i / 4);
        slot.position.set(rackX + 0.3 + col * 0.72, 1 + level * 2, -4);
        scene.add(slot);
        slotMeshes.push(slot);
      }
    }

    // 放置模具（按 MOCK 数据）
    let idx = 0;
    window.MOCK.moulds.forEach(m => {
      if (m.state === 'dev' || m.state === 'scrap') return;
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.4, 0.7),
        new THREE.MeshStandardMaterial({ color: mouldColors[m.state], emissive: mouldColors[m.state], emissiveIntensity: 0.2, roughness: 0.4, metalness: 0.6 })
      );
      const row = Math.floor(idx / 5);
      const col = idx % 5;
      const level = 0;
      box.position.set(-9 + row * 6 + 0.3 + col * 0.72, 1 + level * 2, -4);
      box.castShadow = true;
      scene.add(box);
      mouldMeshes.push(box);
      idx++;
    });

    // AGV
    const agvGroup = new THREE.Group();
    const agvBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x3B82F6, emissive: 0x3B82F6, emissiveIntensity: 0.3, metalness: 0.5 })
    );
    agvBody.position.y = 0.2;
    agvGroup.add(agvBody);
    const agvTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x1A2540 })
    );
    agvTop.position.y = 0.5;
    agvGroup.add(agvTop);
    // 轮子
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.1, 12),
        new THREE.MeshStandardMaterial({ color: 0x111827 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(i < 2 ? -0.5 : 0.5, 0.05, i % 2 === 0 ? -0.35 : 0.35);
      agvGroup.add(wheel);
    }
    agvGroup.position.set(0, 0, 2);
    scene.add(agvGroup);

    // 中心控制台
    const center = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.2, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0x1A2540, emissive: 0xE8B4A0, emissiveIntensity: 0.1, metalness: 0.4 })
    );
    center.position.set(0, 0.1, 6);
    scene.add(center);
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 5, 16),
      new THREE.MeshStandardMaterial({ color: 0xE8B4A0, emissive: 0xE8B4A0, emissiveIntensity: 0.5 })
    );
    pillar.position.set(0, 2.5, 6);
    scene.add(pillar);
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xE8B4A0, emissive: 0xE8B4A0, emissiveIntensity: 0.8 })
    );
    orb.position.set(0, 5.2, 6);
    scene.add(orb);

    // 动画
    let t = 0;
    // AGV 演练路径（依次访问货架点位，模拟取模→运抵→放模→归位）
    const drillPath = [
      { x: -7.5, z: -4, task: '取模 MJ-05 → 装蓝盒' },
      { x: -1.5, z: -4, task: '取模 MJ-09 → 直线送达' },
      { x: 1.5, z: 6, task: '卸模至机台 IM-03' },
      { x: 7.5, z: -4, task: '取回空模 → 归位 A 区' },
      { x: 0, z: 2, task: '待命 · 演练完成' },
    ];
    const agvState = { drilling: false, wps: [], idx: 0 };
    function animate() {
      requestAnimationFrame(animate);
      t += 0.005;
      if (agvState.drilling) {
        const wp = agvState.wps[agvState.idx];
        if (wp) {
          const dx = wp.x - agvGroup.position.x, dz = wp.z - agvGroup.position.z;
          const dist = Math.hypot(dx, dz);
          const speed = 0.35;
          if (dist < 0.4) { agvState.idx++; } else {
            agvGroup.position.x += dx / dist * speed;
            agvGroup.position.z += dz / dist * speed;
            agvGroup.rotation.y = Math.atan2(dx, dz);
          }
        } else { agvState.drilling = false; }
      } else {
        agvGroup.position.x = Math.sin(t) * 8;
        agvGroup.position.z = 2 + Math.cos(t * 0.5) * 1.5;
      }
      // 中心光晕脉冲
      orb.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
      pillar.material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.2;
      renderer.render(scene, camera);
    }
    animate();

    // 鼠标交互
    let isDown = false, mx = 0, my = 0;
    let camTheta = Math.atan2(camera.position.x, camera.position.z);
    let camPhi = Math.atan2(camera.position.y, Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2));
    let camDist = Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2);
    container.addEventListener('mousedown', e => { isDown = true; mx = e.clientX; my = e.clientY; });
    window.addEventListener('mouseup', () => isDown = false);
    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      camTheta -= (e.clientX - mx) * 0.005;
      camPhi = Math.max(0.2, Math.min(Math.PI / 2 - 0.1, camPhi + (e.clientY - my) * 0.005));
      mx = e.clientX; my = e.clientY;
      camera.position.x = camDist * Math.sin(camPhi) * Math.sin(camTheta);
      camera.position.y = camDist * Math.cos(camPhi);
      camera.position.z = camDist * Math.sin(camPhi) * Math.cos(camTheta);
      camera.lookAt(0, 4, 0);
    });
    container.addEventListener('wheel', e => {
      e.preventDefault();
      camDist = Math.max(15, Math.min(45, camDist + e.deltaY * 0.02));
      camera.position.x = camDist * Math.sin(camPhi) * Math.sin(camTheta);
      camera.position.y = camDist * Math.cos(camPhi);
      camera.position.z = camDist * Math.sin(camPhi) * Math.cos(camTheta);
      camera.lookAt(0, 4, 0);
    });

    // Resize
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // AGV 列表
    const agvList = document.getElementById('agvList');
    agvList.innerHTML = window.MOCK.agvs.map(a => `
      <div class="agv-item">
        <div class="agv-icon"><i data-lucide="${a.state === 'busy' ? 'truck' : 'circle-pause'}"></i></div>
        <div class="agv-body">
          <div class="agv-name">${a.name}</div>
          <div class="agv-task">${a.task}</div>
        </div>
        <span class="agv-state ${a.state}">${a.state === 'busy' ? '执行中' : '待命'}</span>
      </div>
    `).join('');
    initIcons();

    // ===== AGV 任务演练按钮（模拟 AGV 自动搬运取模→运抵→放模→归位） =====
    const drillBtn = document.querySelector('[data-page="mould-3d"] .page-actions .btn.primary');
    if (drillBtn) {
      drillBtn.addEventListener('click', () => {
        if (agvState.drilling || drillBtn.disabled) return;
        drillBtn.disabled = true;
        const old = drillBtn.innerHTML;
        drillBtn.innerHTML = '<i data-lucide="loader" class="spin"></i>演练中…';
        const first = agvList ? agvList.querySelector('.agv-item') : null;
        const toast = document.createElement('div');
        toast.className = 'inspect-toast';
        toast.textContent = '开始 AGV 任务演练…';
        document.body.appendChild(toast);
        agvState.drilling = true;
        agvState.wps = drillPath.slice();
        agvState.idx = 0;
        if (first) first.querySelector('.agv-state').className = 'agv-state busy';
        const timer = setInterval(() => {
          const wp = agvState.wps[agvState.idx];
          if (!wp) {
            clearInterval(timer);
            toast.textContent = '✅ 演练完成';
            if (first) {
              first.querySelector('.agv-task').textContent = '待命';
              first.querySelector('.agv-state').className = 'agv-state idle';
            }
            setTimeout(() => { toast.remove(); drillBtn.disabled = false; drillBtn.innerHTML = old; }, 1100);
            return;
          }
          toast.textContent = '● AGV：' + wp.task;
          if (first) first.querySelector('.agv-task').textContent = wp.task;
        }, 80);
      });
    }
  }

  // ====================================================
  // 订单×模具 - chip 点击
  // ====================================================
  function initMouldOrder() {
    document.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelector('.q-field.grow input').value = c.textContent.split(' · ')[0];
        toast('已加载示例订单 ' + c.textContent.split(' · ')[0], 'info');
      });
    });
  }

  // ====================================================
  // Resize
  // ====================================================
  window.addEventListener('resize', () => {
    if (window.__echarts) window.__echarts.forEach(c => c && c.resize && c.resize());
  });

  // ====================================================
  // 启动
  // ====================================================
  document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initDashboard();
    initMouldOverview();
    initMouldDetail();
    initMouldOrder();
    initMouldMaintain();
    syncErp();
    // 第二波 + 第三波
    initMesSchedule();
    initMesIot();
    initMesIssue();
    initWms();
    initNewPlant();
    initClientPortal();
    initClientCarbon();
    initClientQuality();
    initClientAudit();
    initErpHub();
    // 第四波 · 深化 + 智能化
    initClientOrderDetail();
    initMouldTimeline();
    initApsCompare();
    initAiQuality();
    initDigitalTwin();
    initSupplierPortal();

    // 2 秒后弹一个欢迎 toast
    setTimeout(() => {
      toast('欢迎进入伍星御瓶数智化协同中枢 · v3.0 · 23 个模块已上线', 'ok');
    }, 800);
  });

  // ====================================================
  // 第二波 · MES 排产看板
  // ====================================================
  function initMesSchedule() {
    const grid = document.getElementById('scheduleGrid');
    if (!grid) return;
    const now = new Date();
    const curHour = now.getHours();
    let html = '<div class="sg-head">机台 / 班次</div>';
    for (let h = 0; h < 24; h++) html += '<div class="sg-head hour' + (h === curHour ? ' now' : '') + '">' + String(h).padStart(2, '0') + '</div>';

    // 模拟排产数据
    const sched = [
      { name: '1 号注塑机', cls: 'run', rows: [
        { s: 7, e: 11, t: 'prod', label: '完美日记·精华瓶 8K' },
        { s: 11, e: 12, t: 'change', label: '换模 35min' },
        { s: 12, e: 18, t: 'prod', label: '毛戈平·粉底液 12K' },
      ]},
      { name: '2 号注塑机', cls: 'run', rows: [
        { s: 8, e: 14, t: 'prod', label: '珀莱雅·红宝石 14K' },
        { s: 14, e: 15, t: 'change', label: '换色 40min' },
        { s: 15, e: 22, t: 'prod', label: '修正·原液瓶 8K' },
      ]},
      { name: '3 号注塑机', cls: 'run', rows: [
        { s: 6, e: 13, t: 'prod', label: '完美日记·精华瓶 8K' },
        { s: 13, e: 14, t: 'change', label: '换模 30min' },
        { s: 14, e: 20, t: 'prod', label: '花西子·卸妆油 6K' },
      ]},
      { name: '4 号注塑机', cls: 'idle', rows: [{ s: 10, e: 14, t: 'maint', label: '保养中' }] },
      { name: '5 号注塑机', cls: 'run', rows: [
        { s: 7, e: 11, t: 'prod', label: '完美日记·腮红液 6K' },
        { s: 11, e: 12, t: 'change', label: '换色 50min' },
        { s: 12, e: 18, t: 'prod', label: '毛戈平·无痕 8K' },
      ]},
      { name: '1 号吹塑机', cls: 'run', rows: [
        { s: 8, e: 15, t: 'prod', label: '花西子·卸妆油 4K' },
        { s: 15, e: 16, t: 'change', label: '换模 30min' },
      ]},
      { name: '2 号吹塑机', cls: 'run', rows: [
        { s: 7, e: 12, t: 'prod', label: '修正·原液 5K' },
        { s: 12, e: 13, t: 'change', label: '换色' },
        { s: 13, e: 20, t: 'prod', label: '阿道夫·精油 6K' },
      ]},
      { name: '3 号吹塑机', cls: 'maint', rows: [{ s: 0, e: 24, t: 'maint', label: '大保养' }] },
      { name: '4 号吹塑机', cls: 'run', rows: [
        { s: 8, e: 14, t: 'prod', label: '阿道夫·洗发水 3K' },
        { s: 14, e: 22, t: 'prod', label: '完美日记·粉底 4K' },
      ]},
      { name: '1 号丝印机', cls: 'run', rows: [
        { s: 8, e: 12, t: 'dev', label: '新品试产 1K' },
        { s: 12, e: 18, t: 'prod', label: '毛戈平·粉底液 5K' },
      ]},
      { name: '2 号丝印机', cls: 'run', rows: [
        { s: 9, e: 17, t: 'prod', label: '完美日记·腮红 4K' },
      ]},
      { name: '3 号丝印机', cls: 'run', rows: [
        { s: 8, e: 14, t: 'prod', label: '花西子·眼影盘 2K' },
        { s: 14, e: 15, t: 'change', label: '换版 30min' },
        { s: 15, e: 20, t: 'prod', label: '珀莱雅·面霜瓶 3K' },
      ]},
      { name: '1 号装配线', cls: 'run', rows: [
        { s: 7, e: 19, t: 'prod', label: '完美日记·精华瓶组装 10K' },
      ]},
      { name: '2 号装配线', cls: 'run', rows: [
        { s: 8, e: 20, t: 'prod', label: '珀莱雅·乳液瓶组装 12K' },
      ]},
      { name: '3 号装配线', cls: 'idle', rows: [{ s: 14, e: 18, t: 'maint', label: '设备调试' }] },
    ];

    sched.forEach(s => {
      html += '<div class="sg-row-h ' + s.cls + '"><span class="rh-status"></span><div><div class="rh-name">' + s.name + '</div><div class="rh-meta">' + (s.cls === 'run' ? '运行' : s.cls === 'idle' ? '待机' : '保养') + '</div></div></div>';
      for (let h = 0; h < 24; h++) html += '<div class="sg-cell' + (h === curHour ? ' now' : '') + '"></div>';
    });
    grid.innerHTML = html;

    // 叠加排产 bar
    sched.forEach((s, idx) => {
      const row = grid.children[(idx + 1) * 25];
      s.rows.forEach(r => {
        const bar = document.createElement('div');
        const hours = r.e - r.s;
        // < 2 小时用紧凑样式避免文字被裁成乱码
        if (hours < 2) bar.className = 'sg-bar compact ' + r.t;
        else bar.className = 'sg-bar ' + r.t;
        bar.style.position = 'absolute';
        bar.style.top = '6px';
        bar.style.height = '36px';
        // 找到对应行
        const targetCell = grid.children[(idx + 1) * 25 + r.s + 1];
        if (targetCell) {
          targetCell.appendChild(bar);
          bar.style.left = (r.s * (100 / 24)) + '%';
          bar.style.width = ((r.e - r.s) * (100 / 24)) + '%';
        }
        // 短 bar 只显示图标，长 bar 才显示 label
        const label = hours < 2 ? '' : r.label;
        bar.innerHTML = '<i data-lucide="' + (r.t === 'prod' ? 'circle-dot' : r.t === 'change' ? 'refresh-cw' : r.t === 'dev' ? 'flask-conical' : 'wrench') + '" style="width:12px;height:12px;flex:none"></i><span class="sg-label">' + label + '</span>';
        bar.title = r.label + ' · ' + r.s + ':00 → ' + r.e + ':00';
      });
    });
    initIcons();

    // 当前时间实时
    setInterval(() => {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      const t = pad(d.getHours()) + ':' + pad(d.getMinutes());
      const el = document.getElementById('curTime');
      if (el) el.textContent = t;
    }, 30000);
  }

  // ====================================================
  // 第二波 · MES IoT
  // ====================================================
  function initMesIot() {
    const iotGrid = document.getElementById('iotGrid');
    if (!iotGrid) return;
    const iotItems = [
      { name: '模温', machine: 'IM-03', val: 78, unit: '℃', level: 'ok' },
      { name: '熔体压力', machine: 'IM-03', val: 86, unit: 'MPa', level: 'ok' },
      { name: '注塑周期', machine: 'IM-03', val: 18.2, unit: 's', level: 'ok' },
      { name: '开模次数', machine: 'IM-03', val: 12480, unit: '次', level: 'ok' },
      { name: '环境温度', machine: '车间A', val: 26.5, unit: '℃', level: 'ok' },
      { name: '环境湿度', machine: '车间A', val: 48, unit: '%', level: 'ok' },
      { name: '瞬时电耗', machine: '全厂', val: 286, unit: 'kW', level: 'warn' },
      { name: '瞬时水耗', machine: '全厂', val: 1.8, unit: 'm³/h', level: 'ok' },
    ];
    iotGrid.innerHTML = iotItems.map(it => `
      <div class="iot-card">
        <div class="iot-card-head">
          <span class="iot-name">${it.name}</span>
          <span class="iot-machine">${it.machine}</span>
        </div>
        <div class="iot-val">${it.val.toLocaleString()}<span class="unit">${it.unit}</span></div>
        <div class="iot-trend">
          <span>实时</span>
          <span class="iot-pulse ${it.level}"></span>
        </div>
      </div>
    `).join('');

    // 多参数趋势
    const trend = echarts.init(document.getElementById('chartIotTrend'));
    const x = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0') + 'm');
    trend.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' } },
      legend: { data: ['模温(℃)', '压力(MPa)', '周期(s)×4'], textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0 },
      grid: { left: 40, right: 16, top: 32, bottom: 24 },
      xAxis: { type: 'category', data: x, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 9, interval: 9 } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } }, axisLabel: { color: '#64748B', fontSize: 10 } },
      series: [
        { name: '模温(℃)', type: 'line', smooth: true, symbol: 'none', data: x.map(() => 78 + (Math.random() - .5) * 2), lineStyle: { width: 2, color: '#E8B4A0' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(232,180,160,.3)' }, { offset: 1, color: 'transparent' }]) } },
        { name: '压力(MPa)', type: 'line', smooth: true, symbol: 'none', data: x.map(() => 86 + (Math.random() - .5) * 4), lineStyle: { width: 1.5, color: '#3B82F6' } },
        { name: '周期(s)×4', type: 'line', smooth: true, symbol: 'none', data: x.map(() => 18.2 * 4 + (Math.random() - .5) * 6), lineStyle: { width: 1.5, color: '#10B981' } },
      ],
    });
    (window.__echarts = window.__echarts || []).push(trend);

    // 能耗
    const energy = echarts.init(document.getElementById('chartEnergy'));
    energy.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' } },
      legend: { textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0 },
      series: [{
        name: '能耗', type: 'pie', radius: ['45%', '70%'], center: ['50%', '55%'],
        data: [
          { name: '注塑机', value: 1240, itemStyle: { color: '#E8B4A0' } },
          { name: '吹塑机', value: 480, itemStyle: { color: '#D4A574' } },
          { name: '丝印机', value: 180, itemStyle: { color: '#10B981' } },
          { name: '模温机', value: 320, itemStyle: { color: '#3B82F6' } },
          { name: '空压/水', value: 260, itemStyle: { color: '#F59E0B' } },
          { name: '照明/其他', value: 80, itemStyle: { color: '#6B7280' } },
        ],
        label: { color: '#F3F4F6', fontSize: 11 },
        labelLine: { lineStyle: { color: 'rgba(255,255,255,.2)' } },
      }],
    });
    (window.__echarts = window.__echarts || []).push(energy);
  }

  // ====================================================
  // 第二波 · 异常派工看板
  // ====================================================
  function initMesIssue() {
    const kanban = document.getElementById('issueKanban');
    if (!kanban) return;
    const cols = [
      { title: '待派工', cls: 'err', items: [
        { lvl: 'err', name: 'M-PL-J29 模具温度异常', meta: 'IM-05 · 13:58' },
        { lvl: 'warn', name: 'M-CR-F08 寿命告警', meta: 'A-08 · 12:30' },
        { lvl: 'info', name: 'BM-03 吹塑机大保养到期', meta: 'BM-03 · 11:00' },
      ]},
      { title: '处理中', cls: 'info', items: [
        { lvl: 'warn', name: 'IM-01 注塑不稳', meta: 'IM-01 · 张师傅' },
        { lvl: 'err', name: 'M-PETG-D12 烫金偏移', meta: 'SP-02 · 李工' },
        { lvl: 'info', name: 'BM-04 真空泵异响', meta: 'BM-04 · 王工' },
        { lvl: 'warn', name: 'AS-01 装配气源压力低', meta: 'AS-01 · 陈工' },
        { lvl: 'info', name: 'M-PL-J31 冷却水流量偏低', meta: 'IM-01 · 已处理中' },
      ]},
      { title: '待验收', cls: 'warn', items: [
        { lvl: 'warn', name: 'M-PETG-A22 首件复检', meta: 'IM-03 · 已修复' },
        { lvl: 'info', name: 'SP-03 丝印机校准', meta: 'SP-03 · 待验收' },
      ]},
      { title: '已闭环', cls: 'ok', items: [
        { lvl: 'ok', name: '本月已闭环 18 项', meta: '近 7 天 · 0 复发' },
      ]},
    ];
    kanban.innerHTML = cols.map(c => `
      <div class="ik-col">
        <div class="ik-head">
          <div class="ik-title"><span class="dot" style="background:${c.cls === 'err' ? '#EF4444' : c.cls === 'info' ? '#3B82F6' : c.cls === 'warn' ? '#F59E0B' : '#10B981'}"></span>${c.title}</div>
          <span class="ik-count">${c.items.length}</span>
        </div>
        ${c.items.map(it => `
          <div class="ik-card">
            <span class="ik-level ${it.lvl}">${it.lvl === 'err' ? '严重' : it.lvl === 'warn' ? '警告' : it.lvl === 'info' ? '提示' : '完成'}</span>
            <div class="ik-name">${it.name}</div>
            <div class="ik-meta"><span>${it.meta}</span></div>
            <div class="ik-foot">
              <span class="assigner">处理人 · <b>${c.title === '处理中' ? '张师傅' : c.title === '待验收' ? '李工' : '—'}</b></span>
              <button class="btn ghost" style="padding:2px 8px;font-size:10px">查看</button>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // ====================================================
  // 第二波 · WMS 仓储
  // ====================================================
  function initWms() {
    const heat = echarts.init(document.getElementById('wmsHeatmap'));
    const rows = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'];
    const cols = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const data = [];
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < cols.length; c++) {
        const v = Math.random();
        let level = 0;
        if (v > 0.85) level = 3;       // 缺货
        else if (v > 0.7) level = 2;   // 临期
        else if (v > 0.4) level = 1;   // 占用
        else level = 0;                // 空闲
        data.push([c, r, level]);
      }
    }
    heat.setOption({
      backgroundColor: 'transparent',
      tooltip: { position: 'top', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' }, formatter: p => {
        const labels = ['空闲', '占用', '临期', '缺货'];
        return 'A' + rows[p.value[1]] + '-' + cols[p.value[0]] + ' · ' + labels[p.value[2]];
      }},
      grid: { left: 50, right: 16, top: 16, bottom: 32 },
      xAxis: { type: 'category', data: cols, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 10 }, splitArea: { show: true } },
      yAxis: { type: 'category', data: rows, axisLine: { show: false }, axisLabel: { color: '#94A3B8', fontSize: 10 }, splitArea: { show: true } },
      visualMap: { min: 0, max: 3, calculable: false, show: false, inRange: { color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'] } },
      series: [{ name: '库位', type: 'heatmap', data: data, label: { show: false } }],
    });
    (window.__echarts = window.__echarts || []).push(heat);

    // 库龄表
    const aging = document.getElementById('wmsAging');
    const agingData = [
      { sku: 'PETG-2012-08', name: 'PETG 高透原料', days: 102, qty: '1,200 kg', level: 'err' },
      { sku: 'PETG-2012-07', name: 'PETG 高透原料', days: 78, qty: '2,800 kg', level: 'warn' },
      { sku: 'COLOR-AU-08', name: '玫瑰金色母', days: 95, qty: '40 kg', level: 'err' },
      { sku: 'COLOR-AU-07', name: '玫瑰金色母', days: 62, qty: '80 kg', level: 'ok' },
      { sku: 'CAP-30-A08', name: '30ml 烫金盖', days: 45, qty: '12,000', level: 'ok' },
      { sku: 'CAP-50-A06', name: '50ml 哑光盖', days: 88, qty: '3,200', level: 'warn' },
      { sku: 'BOX-CARTON-A', name: '外箱 (5层)', days: 30, qty: '5,800', level: 'ok' },
      { sku: 'PE-FOAM-A02', name: 'PE 护套', days: 110, qty: '8,400', level: 'err' },
    ];
    aging.innerHTML = agingData.map(a => `
      <div style="display:grid;grid-template-columns:1fr 70px 80px;align-items:center;gap:10px;padding:8px 0;border-bottom:1px dashed var(--line)">
        <div>
          <div style="font-size:12px;color:var(--text)">${a.name}</div>
          <div style="font-size:10px;color:var(--text-3);font-family:var(--mono);margin-top:2px">${a.sku}</div>
        </div>
        <div style="font-size:11px;font-family:var(--mono);color:${a.level === 'err' ? '#EF4444' : a.level === 'warn' ? '#F59E0B' : '#10B981'}">${a.days}天</div>
        <div style="font-size:11px;font-family:var(--mono);text-align:right;color:var(--text-2)">${a.qty}</div>
      </div>
    `).join('') + '<div style="padding:8px 0;font-size:11px;color:var(--text-3);text-align:center">共 8 条预警 · 按 FIFO 优先发货</div>';
  }

  // ====================================================
  // 第二波 · 新厂搬迁
  // ====================================================
  function initNewPlant() {
    // Tab 切换
    document.querySelectorAll('.np-tab').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.np-tab').forEach(x => x.classList.toggle('active', x === t));
        document.querySelectorAll('.np-pane').forEach(p => p.style.display = (p.dataset.pane === t.dataset.np ? 'block' : 'none'));
      });
    });

    // 甘特图
    const gantt = echarts.init(document.getElementById('chartGantt'));
    const equip = [
      { name: '海天 MA1600 注塑机', sup: '海天', s: 0, e: 50, c: 'done' },
      { name: '海天 MA2000 注塑机', sup: '海天', s: 5, e: 55, c: 'done' },
      { name: '海天 MA2500 注塑机', sup: '海天', s: 30, e: 90, c: 'cur' },
      { name: '雅琪吹塑机 BM-12', sup: '雅琪', s: 20, e: 75, c: 'cur' },
      { name: '雅琪吹塑机 BM-15', sup: '雅琪', s: 45, e: 105, c: 'plan' },
      { name: '丝印机 4 台套', sup: '东远', s: 40, e: 95, c: 'plan' },
      { name: '烫金机 2 台套', sup: '海德堡', s: 50, e: 110, c: 'plan' },
      { name: '装配线 3 条', sup: '博之旺', s: 60, e: 120, c: 'plan' },
      { name: 'AGV 系统 5 台', sup: '极智嘉', s: 35, e: 100, c: 'cur' },
      { name: '立体库 1 套', sup: '今天国际', s: 25, e: 95, c: 'cur' },
      { name: '模温机 12 台', sup: '星弘', s: 10, e: 50, c: 'done' },
      { name: '空压机 2 台', sup: '复盛', s: 15, e: 45, c: 'done' },
    ];
    const yAxisData = equip.map(e => e.name);
    gantt.setOption({
      backgroundColor: 'transparent',
      tooltip: { formatter: p => equip[p.value[1]].name + '<br/>' + (p.value[0] + 1) + '天 - ' + (p.value[0] + p.value[2] + 1) + '天' },
      grid: { left: 160, right: 16, top: 16, bottom: 32 },
      xAxis: { type: 'value', min: 0, max: 120, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 10, formatter: 'D{value}' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } } },
      yAxis: { type: 'category', data: yAxisData, axisLine: { show: false }, axisLabel: { color: '#94A3B8', fontSize: 11 } },
      series: [{
        type: 'bar', barWidth: 14, stack: 'total',
        data: equip.map((e, i) => ({ value: [e.s, i, e.e - e.s], itemStyle: { color: e.c === 'done' ? '#10B981' : e.c === 'cur' ? '#E8B4A0' : '#3B82F6', borderRadius: [0, 3, 3, 0] } })),
      }],
    });
    (window.__echarts = window.__echarts || []).push(gantt);

    // 验收调试看板
    const debug = document.getElementById('debugBoard');
    debug.innerHTML = `<div class="lt-row head"><div>序号</div><div>设备</div><div>供应商</div><div>到货</div><div>调试</div><div>验收</div><div>状态</div></div>` + equip.slice(0, 10).map((e, i) => {
      const status = e.c === 'done' ? '<span class="status-pill ok">已验收</span>' : e.c === 'cur' ? '<span class="status-pill info">调试中</span>' : '<span class="status-pill warn">待调试</span>';
      const d1 = e.c === 'done' ? '✓' : e.c === 'cur' ? '✓' : '—';
      const d2 = e.c === 'done' ? '✓' : e.c === 'cur' ? '<span style="color:var(--gold)">~</span>' : '—';
      const d3 = e.c === 'done' ? '✓' : '—';
      return `<div class="lt-row" style="grid-template-columns:60px 1fr 100px 60px 60px 60px 90px"><div class="num">#${String(i + 1).padStart(2, '0')}</div><div>${e.name}</div><div>${e.sup}</div><div style="text-align:center;color:${d1 === '✓' ? 'var(--ok)' : 'var(--text-3)'}">${d1}</div><div style="text-align:center">${d2}</div><div style="text-align:center;color:${d3 === '✓' ? 'var(--ok)' : 'var(--text-3)'}">${d3}</div><div>${status}</div></div>`;
    }).join('');

    // 模具迁移表
    const route = document.getElementById('mouldRouteTable');
    const routes = [
      { m: 'M-PETG-A22', from: '旧厂 A-08', to: '新厂 A-12', win: '08-28 ~ 08-30', who: '陈工', st: 'cur' },
      { m: 'M-PL-J27', from: '旧厂 A-12', to: '新厂 A-15', win: '08-29 ~ 08-31', who: '张工', st: 'plan' },
      { m: 'M-CR-F15', from: '旧厂 B-03', to: '新厂 B-08', win: '09-02 ~ 09-04', who: '李工', st: 'plan' },
      { m: 'M-PETG-B18', from: '旧厂 A-05', to: '新厂 A-10', win: '09-05 ~ 09-07', who: '王工', st: 'plan' },
    ];
    route.innerHTML = routes.map(r => `<tr style="border-bottom:1px solid var(--line)">
      <td style="padding:10px 0;font-family:var(--mono);color:var(--gold)">${r.m}</td>
      <td>${r.from}</td>
      <td>${r.to}</td>
      <td>${r.win}</td>
      <td>${r.who}</td>
      <td>${r.st === 'cur' ? '<span class="status-pill info">运输中</span>' : '<span class="status-pill warn">待执行</span>'}</td>
    </tr>`).join('');

    // 签到列表
    const checkin = document.getElementById('checkinList');
    const checkins = [
      { time: '15:30', who: '张工', type: '进场', loc: '新厂 A 区', target: '5 号注塑机', photo: 3, level: 'ok' },
      { time: '14:45', who: '李工', type: '调试', loc: '新厂 B 区', target: 'BM-04 吹塑机', photo: 5, level: 'info' },
      { time: '13:20', who: '王工', type: '验收', loc: '新厂 A 区', target: '立体库', photo: 8, level: 'ok' },
      { time: '11:05', who: '陈工', type: '进场', loc: '新厂 C 区', target: 'AGV-03', photo: 2, level: 'ok' },
      { time: '10:30', who: '刘工', type: '异常', loc: '新厂 B 区', target: 'BM-12 异响', photo: 4, level: 'err' },
    ];
    checkin.innerHTML = checkins.map(c => `
      <div style="display:grid;grid-template-columns:60px 80px 80px 1fr 60px;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:12px">
        <div style="font-family:var(--mono);color:var(--text-3)">${c.time}</div>
        <div>${c.who}</div>
        <div><span class="status-pill ${c.level === 'err' ? 'err' : c.level === 'info' ? 'info' : 'ok'}">${c.type}</span></div>
        <div>${c.target} <span style="color:var(--text-3);margin-left:6px">${c.loc}</span></div>
        <div style="text-align:right;color:var(--text-3);font-family:var(--mono)"><i data-lucide="camera" style="width:12px;height:12px;vertical-align:-1px"></i> ${c.photo}</div>
      </div>
    `).join('');
    initIcons();
  }

  // ====================================================
  // 第三波 · 客户 Portal
  // ====================================================
  function initClientPortal() {
    const tb = document.getElementById('clientOrderTable');
    const data = [
      { no: 'SO-20260825-0188', prod: '动物眼影精华瓶 30ml', qty: '8 万只', due: '2026-09-05', prog: 64, q: 'A+', c: '0.42' },
      { no: 'SO-20260824-0201', prod: '红宝石乳液瓶 50ml', qty: '12 万只', due: '2026-09-10', prog: 88, q: 'A+', c: '0.58' },
      { no: 'SO-20260822-0099', prod: '苗族印象卸妆油 150ml', qty: '4 万只', due: '2026-08-30', prog: 28, q: 'A', c: '0.86' },
    ];
    tb.innerHTML = data.map(d => `<tr style="border-bottom:1px solid var(--line)">
      <td style="padding:12px 0;font-family:var(--mono);color:var(--gold)">${d.no}</td>
      <td>${d.prod}</td>
      <td>${d.qty}</td>
      <td>${d.due}</td>
      <td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:4px;background:rgba(255,255,255,.05);border-radius:999px;overflow:hidden;max-width:80px"><div style="width:${d.prog}%;height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-2))"></div></div><span style="font-family:var(--mono);color:var(--text-2)">${d.prog}%</span></div></td>
      <td><span class="status-pill ${d.q === 'A+' ? 'ok' : 'info'}">${d.q}</span></td>
      <td style="font-family:var(--mono);color:var(--ok)">${d.c} kgCO₂e</td>
    </tr>`).join('');
  }

  // ====================================================
  // 第三波 · 碳足迹
  // ====================================================
  function initClientCarbon() {
    const chart = echarts.init(document.getElementById('chartCarbon'));
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' }, formatter: '{b}<br/>{c} kgCO₂e ({d}%)' },
      legend: { textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0, type: 'scroll' },
      series: [{
        name: '碳排放', type: 'pie', radius: ['40%', '70%'], center: ['50%', '55%'],
        data: [
          { name: '原料 PETG', value: 0.18, itemStyle: { color: '#10B981' } },
          { name: '注塑成型', value: 0.08, itemStyle: { color: '#3B82F6' } },
          { name: '烫金/丝印', value: 0.06, itemStyle: { color: '#E8B4A0' } },
          { name: '装配物流', value: 0.04, itemStyle: { color: '#F59E0B' } },
          { name: '外箱包装', value: 0.03, itemStyle: { color: '#A855F7' } },
          { name: '辅料/废料', value: 0.03, itemStyle: { color: '#6B7280' } },
        ],
        label: { color: '#F3F4F6', fontSize: 11, formatter: '{b}\n{d}%' },
        labelLine: { lineStyle: { color: 'rgba(255,255,255,.2)' } },
      }],
    });
    (window.__echarts = window.__echarts || []).push(chart);
  }

  // ====================================================
  // 第三波 · 质量透明
  // ====================================================
  function initClientQuality() {
    const chart = echarts.init(document.getElementById('chartQuality'));
    const weeks = Array.from({ length: 12 }, (_, i) => 'W' + (i + 1));
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' } },
      legend: { data: ['不良率', '行业均值'], textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0, right: 0 },
      grid: { left: 40, right: 16, top: 32, bottom: 24 },
      xAxis: { type: 'category', data: weeks, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 10 } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } }, axisLabel: { color: '#64748B', fontSize: 10, formatter: '{value}%' } },
      series: [
        { name: '不良率', type: 'line', smooth: true, data: [0.45, 0.42, 0.38, 0.41, 0.36, 0.34, 0.32, 0.35, 0.30, 0.33, 0.32, 0.32], lineStyle: { width: 2.5, color: '#10B981' }, itemStyle: { color: '#10B981' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(16,185,129,.3)' }, { offset: 1, color: 'transparent' }]) } },
        { name: '行业均值', type: 'line', smooth: true, data: [0.85, 0.82, 0.80, 0.81, 0.78, 0.79, 0.77, 0.78, 0.76, 0.77, 0.76, 0.75], lineStyle: { width: 1.5, color: '#F59E0B', type: 'dashed' }, itemStyle: { color: '#F59E0B' } },
      ],
    });
    (window.__echarts = window.__echarts || []).push(chart);

    // 三检记录
    const qTable = document.getElementById('qualityTable');
    const qData = [
      { batch: 'B20260825-03', prod: '精华瓶 30ml', qty: '8,000', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A+' },
      { batch: 'B20260825-02', prod: '精华瓶 30ml', qty: '8,000', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A+' },
      { batch: 'B20260825-01', prod: '精华瓶 30ml', qty: '8,000', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A+' },
      { batch: 'B20260824-04', prod: '精华瓶 30ml', qty: '7,500', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A+' },
      { batch: 'B20260824-03', prod: '乳液瓶 50ml', qty: '12,000', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A' },
      { batch: 'B20260824-02', prod: '膏霜瓶 30g', qty: '6,000', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A+' },
      { batch: 'B20260824-01', prod: '卸妆油瓶 150ml', qty: '4,000', iqc: '✓', pqc: '⚠ 1 次返工', fqc: '✓', sum: 'A' },
      { batch: 'B20260823-05', prod: '精华瓶 30ml', qty: '8,000', iqc: '✓', pqc: '✓', fqc: '✓', sum: 'A+' },
    ];
    qData.forEach(d => {
      const row = document.createElement('div');
      row.className = 'lt-row';
      row.style.gridTemplateColumns = '130px 1fr 100px 60px 80px 60px 60px';
      row.innerHTML = `<div class="num" style="color:var(--gold)">${d.batch}</div><div>${d.prod}</div><div class="num">${d.qty}</div><div style="text-align:center;color:var(--ok)">${d.iqc}</div><div style="text-align:center;color:${d.pqc.indexOf('⚠') >= 0 ? 'var(--warn)' : 'var(--ok)'}">${d.pqc}</div><div style="text-align:center;color:var(--ok)">${d.fqc}</div><div><span class="status-pill ${d.sum === 'A+' ? 'ok' : 'info'}">${d.sum}</span></div>`;
      qTable.appendChild(row);
    });
  }

  // ====================================================
  // 第三波 · 远程验厂
  // ====================================================
  function initClientAudit() {
    const list = document.getElementById('auditList');
    const items = [
      { name: '营业执照 / 资质文件', st: 'ok' },
      { name: '生产环境与车间布局', st: 'ok' },
      { name: '设备清单与保养记录', st: 'ok' },
      { name: '质量管理体系 ISO 9001', st: 'ok' },
      { name: '环境管理体系 ISO 14001', st: 'ok' },
      { name: '员工培训与操作 SOP', st: 'ok' },
      { name: '原料供应商资质', st: 'ok' },
      { name: '产品 IQC / PQC / FQC 记录', st: 'ok' },
      { name: '客诉处理与 CAPA', st: 'doing' },
      { name: 'ESG 与碳足迹报告', st: 'doing' },
      { name: '信息安全与数据合规', st: 'todo' },
      { name: '应急与安全演练', st: 'todo' },
    ];
    list.innerHTML = items.map((it, i) => `<div class="pda-row">
      <span class="pdr-k" style="color:var(--text)">${i + 1}. ${it.name}</span>
      <span class="pdr-v" style="${it.st === 'ok' ? 'color:var(--ok)' : it.st === 'doing' ? 'color:var(--gold)' : 'color:var(--text-3)'}">${it.st === 'ok' ? '✓ 已通过' : it.st === 'doing' ? '● 进行中' : '○ 待开始'}</span>
    </div>`).join('');
  }

  // ====================================================
  // 第三波 · ERP 对接中心
  // ====================================================
  function initErpHub() {
    const flow = echarts.init(document.getElementById('chartErpFlow'));
    const nodes = [
      { name: 'SAP ERP', x: 100, y: 80, c: '#3B82F6' },
      { name: '现有 MES', x: 100, y: 160, c: '#3B82F6' },
      { name: '现有 WMS', x: 100, y: 240, c: '#3B82F6' },
      { name: '协同中枢', x: 400, y: 160, c: '#E8B4A0' },
      { name: '模具协同', x: 700, y: 40, c: '#10B981' },
      { name: 'IoT 采集', x: 700, y: 100, c: '#10B981' },
      { name: 'MES 增强', x: 700, y: 160, c: '#10B981' },
      { name: '客户 Portal', x: 700, y: 220, c: '#10B981' },
      { name: '碳足迹', x: 700, y: 280, c: '#10B981' },
    ];
    const links = [
      { source: 'SAP ERP', target: '协同中枢' },
      { source: '现有 MES', target: '协同中枢' },
      { source: '现有 WMS', target: '协同中枢' },
      { source: '协同中枢', target: '模具协同' },
      { source: '协同中枢', target: 'IoT 采集' },
      { source: '协同中枢', target: 'MES 增强' },
      { source: '协同中枢', target: '客户 Portal' },
      { source: '协同中枢', target: '碳足迹' },
    ];
    flow.setOption({
      backgroundColor: 'transparent',
      tooltip: { backgroundColor: 'rgba(15,23,42,.95)', borderColor: 'rgba(232,180,160,.3)', textStyle: { color: '#F3F4F6' } },
      series: [{
        type: 'graph', layout: 'none', symbolSize: 50, roam: false, label: { show: true, color: '#F3F4F6', fontSize: 11 },
        lineStyle: { color: 'rgba(232,180,160,.3)', width: 1.5, curveness: 0.2 },
        edgeSymbol: ['none', 'arrow'], edgeSymbolSize: [0, 8],
        emphasis: { focus: 'adjacency', lineStyle: { width: 2.5, color: '#E8B4A0' } },
        data: nodes.map(n => ({ name: n.name, x: n.x, y: n.y, itemStyle: { color: n.c, borderColor: '#fff', borderWidth: 1 } })),
        links: links,
      }],
    });
    (window.__echarts = window.__echarts || []).push(flow);

    // API 列表
    const apis = [
      { m: 'GET', p: '/api/v1/orders', s: '订单列表', st: 'ok' },
      { m: 'POST', p: '/api/v1/orders/{id}/sync', s: '订单同步', st: 'ok' },
      { m: 'GET', p: '/api/v1/materials', s: '物料主数据', st: 'ok' },
      { m: 'POST', p: '/api/v1/bom/sync', s: 'BOM 同步', st: 'ok' },
      { m: 'GET', p: '/api/v1/moulds', s: '模具主数据', st: 'ok' },
      { m: 'POST', p: '/api/v1/iot/telemetry', s: 'IoT 数据上报', st: 'ok' },
      { m: 'GET', p: '/api/v1/carbon/order/{id}', s: '碳足迹查询', st: 'ok' },
      { m: 'POST', p: '/api/v1/quality/iqc', s: 'IQC 报告上传', st: 'ok' },
      { m: 'GET', p: '/api/v1/warehouse/slots', s: '库位状态', st: 'ok' },
      { m: 'PUT', p: '/api/v1/issue/{id}/assign', s: '异常派工', st: 'ok' },
      { m: 'POST', p: '/api/v1/client/notify', s: '客户推送', st: 'ok' },
      { m: 'GET', p: '/api/v1/oee/machine/{id}', s: '机台 OEE', st: 'ok' },
    ];
    const apiList = document.getElementById('apiList');
    apiList.innerHTML = apis.map(a => `<div class="api-item">
      <span class="m ${a.m.toLowerCase()}">${a.m}</span>
      <span class="p">${a.p}</span>
      <span class="s">${a.s}</span>
      <span class="st ok">在线</span>
    </div>`).join('');
  }

  // ====================================================
  // 第四波 · 客户侧订单详情穿透
  // ====================================================
  function initClientOrderDetail() {
    // 瓶身赋码列表
    const list = document.getElementById('bottleCodeList');
    if (!list) return;
    const codes = Array.from({ length: 20 }, (_, i) => {
      const ts = 'WXY-' + (20260825 + Math.floor(i / 3)).toString() + '-' + String(i * 137 + 8881).padStart(5, '0');
      return { code: ts, time: '14:' + String(8 + i * 2).padStart(2, '0'), op: i % 2 ? '张师傅' : '李师傅', ok: Math.random() > 0.05 };
    });
    list.innerHTML = codes.map(c => `
      <div class="bcl-row">
        <div class="bcl-bar"></div>
        <div class="bcl-body">
          <div class="bcl-code">${c.code}</div>
          <div class="bcl-meta">${c.time} · ${c.op} · ${c.ok ? '外观 OK' : '外观 NG'}</div>
        </div>
        <span class="status-pill ${c.ok ? 'ok' : 'err'}">${c.ok ? '✓' : '⚠'}</span>
      </div>
    `).join('');

    // 进度图
    const prog = echarts.init(document.getElementById('chartOrderProgress'));
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
    const plan = [1333, 2666, 4000, 5333, 6666, 8000];
    const actual = [1380, 2640, null, null, null, null];
    prog.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { left: 36, right: 8, top: 8, bottom: 24 },
      xAxis: { type: 'category', data: days, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 10 } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } }, axisLabel: { color: '#64748B', fontSize: 10 } },
      series: [
        { name: '计划', type: 'line', data: plan, smooth: true, symbol: 'none', lineStyle: { width: 1.5, color: '#94A3B8', type: 'dashed' } },
        { name: '实际', type: 'bar', data: actual, barWidth: 14, itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#E8B4A0'},{offset:1,color:'rgba(232,180,160,.2)'}]), borderRadius: [3,3,0,0] } },
      ],
    });
    (window.__echarts = window.__echarts || []).push(prog);
  }

  // ====================================================
  // 第四波 · 模具×订单时间线
  // ====================================================
  function initMouldTimeline() {
    // 90 天时间线
    const chart = echarts.init(document.getElementById('chartMouldTimeline'));
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(today); d.setDate(d.getDate() + i);
      dates.push((d.getMonth() + 1) + '/' + d.getDate());
    }
    const yAxis = [
      'M-PETG-A22 完美日记',
      'M-PL-J27 珀莱雅',
      'M-PETG-D12 毛戈平',
      'M-PL-J29 修正',
      'M-CR-F08 花西子',
      'M-PETG-B18 阿道夫',
      'M-PL-J31 丸美',
      'M-PETG-A24 薇诺娜',
    ];
    // 每个模具下：订单块（蓝）+ 寿命剩余（橙/红）
    const orderData = [];
    const lifeData = [];
    yAxis.forEach((_, i) => {
      const dayStart = Math.floor(Math.random() * 60);
      const dayLen = 5 + Math.floor(Math.random() * 12);
      const life = i < 2 ? 0 : (i < 5 ? 8 : 35); // 撞寿命 / 临期 / 健康
      orderData.push({ value: [dayStart, i, dayLen], itemStyle: { color: '#3B82F6', borderRadius: [3,3,3,3] } });
      lifeData.push({ value: [75, i, life], itemStyle: { color: life === 0 ? '#EF4444' : life < 15 ? '#F59E0B' : '#10B981', borderRadius: [3,3,3,3] } });
    });
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { formatter: p => p.seriesName === '订单' ? '订单排产 ' + dates[p.value[0]] + ' 起 ' + p.value[2] + ' 天' : '模具寿命 ' + dates[p.value[0]] + ' 剩余 ' + p.value[2] + ' 天' },
      legend: { data: ['订单', '模具寿命'], textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0, right: 0 },
      grid: { left: 200, right: 16, top: 32, bottom: 32 },
      xAxis: { type: 'category', data: dates, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 9, interval: 9 } },
      yAxis: { type: 'category', data: yAxis, axisLine: { show: false }, axisLabel: { color: '#94A3B8', fontSize: 11 } },
      series: [
        { name: '订单', type: 'bar', stack: 'o', barWidth: 10, data: orderData },
        { name: '模具寿命', type: 'bar', stack: 'o', barWidth: 6, data: lifeData, itemStyle: { borderRadius: [3,3,3,3] } },
      ],
    });
    (window.__echarts = window.__echarts || []).push(chart);

    // 撞寿命预警清单
    const risks = [
      { m: 'M-PETG-D12', c: '毛戈平', cur: 41500, total: 50000, left: 30, advice: '建议 9-05 前完成当前订单后停机保养' },
      { m: 'M-CR-F08', c: '花西子', cur: 47800, total: 50000, left: 12, advice: '⚠ 仅剩 12 天 · 当前订单预计 9-10 完工' },
    ];
    document.getElementById('riskList').innerHTML = risks.map(r => `
      <div class="rl-row">
        <div class="rl-icon" style="--c:#EF4444"><i data-lucide="siren"></i></div>
        <div class="rl-body">
          <div style="font-weight:600">${r.m} <span style="color:var(--text-3);font-weight:400;font-size:11px;margin-left:6px">${r.c}</span></div>
          <div style="font-size:11px;color:var(--text-3);margin-top:4px;font-family:var(--mono)">${r.cur.toLocaleString()} / ${r.total.toLocaleString()} · 剩余 ${r.left} 天</div>
          <div style="font-size:11px;color:var(--warn);margin-top:4px">${r.advice}</div>
        </div>
        <button class="btn primary" style="padding:6px 12px;font-size:11px">立即派单</button>
      </div>
    `).join('');
    initIcons();
  }

  // ====================================================
  // 第四波 · APS 试排对比
  // ====================================================
  function initApsCompare() {
    // 同一组订单：8 单 × 3 天
    const orders = ['完美日记精华瓶', '珀莱雅红宝石', '毛戈平粉底液', '修正原液', '花西子卸妆油', '阿道夫精油', '丸美眼霜', '薇诺娜面霜'];
    const machines = ['IM-01', 'IM-02', 'IM-03', 'IM-04', 'IM-05'];
    const days = ['08-26', '08-27', '08-28'];

    // 人工排产：随机散落
    const manual = [];
    const algo = [];
    for (let m = 0; m < 5; m++) {
      const row = [];
      for (let d = 0; d < 3; d++) {
        // 人工：随机 0-3 单
        const n = Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) row.push({ value: 1, itemStyle: { color: i === 0 ? '#3B82F6' : i === 1 ? '#10B981' : '#A855F7' } });
      }
      manual.push(row);
    }
    // APS：紧凑、合并
    const apsMatrix = [
      // IM-01
      [{c:'#3B82F6',n:'完美'},{c:'#3B82F6',n:'完美'},{c:'#10B981',n:'珀莱雅'}],
      // IM-02
      [{c:'#10B981',n:'珀莱雅'},{c:'#A855F7',n:'毛戈平'},{c:'#A855F7',n:'毛戈平'}],
      // IM-03
      [{c:'#F59E0B',n:'修正'},{c:'#F59E0B',n:'修正'},{c:'#06B6D4',n:'花西子'}],
      // IM-04
      [{c:'#06B6D4',n:'花西子'},{c:'#D4A574',n:'阿道夫'},{c:'#D4A574',n:'阿道夫'}],
      // IM-05
      [{c:'#EC4899',n:'丸美'},{c:'#EC4899',n:'丸美'},{c:'#84CC16',n:'薇诺娜'}],
    ];

    function makeOption(data, title) {
      return {
        backgroundColor: 'transparent',
        tooltip: { backgroundColor: 'rgba(15,23,42,.95)', textStyle: { color: '#F3F4F6' } },
        grid: { left: 50, right: 16, top: 16, bottom: 32 },
        xAxis: { type: 'category', data: days, axisLabel: { color: '#94A3B8' } },
        yAxis: { type: 'category', data: machines, axisLabel: { color: '#94A3B8' } },
        series: [{
          type: 'heatmap',
          data: data,
          label: { show: true, formatter: p => p.value.n || '', fontSize: 10, color: '#fff' },
          itemStyle: { borderRadius: 4 },
          emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(232,180,160,.5)' } },
        }],
      };
    }

    const manualChart = echarts.init(document.getElementById('chartApsManual'));
    const flat1 = [];
    manual.forEach((row, m) => row.forEach((cell, d) => flat1.push([d, m, cell[0] || { value: 0, itemStyle: { color: 'rgba(255,255,255,.02)' } }])));
    const manualData = manual.flatMap((row, m) => row.map((cell, d) => [d, m, cell]));
    const apsData = apsMatrix.flatMap((row, m) => row.map((cell, d) => [d, m, { value: 1, itemStyle: { color: cell.c, borderRadius: 4 }, n: cell.n }]));

    const optManual = {
      backgroundColor: 'transparent',
      tooltip: { backgroundColor: 'rgba(15,23,42,.95)', textStyle: { color: '#F3F4F6' } },
      grid: { left: 50, right: 16, top: 16, bottom: 32 },
      xAxis: { type: 'category', data: days, axisLabel: { color: '#94A3B8' } },
      yAxis: { type: 'category', data: machines, axisLabel: { color: '#94A3B8' } },
      visualMap: { show: false, min: 0, max: 3, inRange: { color: ['rgba(255,255,255,.04)', '#3B82F6', '#10B981', '#A855F7'] } },
      series: [{ type: 'heatmap', data: manualData, label: { show: false }, itemStyle: { borderRadius: 4 } }],
    };
    const optAlgo = {
      backgroundColor: 'transparent',
      tooltip: { backgroundColor: 'rgba(15,23,42,.95)', textStyle: { color: '#F3F4F6' }, formatter: p => p.value[2].n + ' · ' + machines[p.value[1]] + ' · ' + days[p.value[0]] },
      grid: { left: 50, right: 16, top: 16, bottom: 32 },
      xAxis: { type: 'category', data: days, axisLabel: { color: '#94A3B8' } },
      yAxis: { type: 'category', data: machines, axisLabel: { color: '#94A3B8' } },
      series: [{ type: 'heatmap', data: apsData, label: { show: true, formatter: p => p.value[2].n, fontSize: 10, color: '#fff' }, itemStyle: { borderRadius: 4 } }],
    };
    manualChart.setOption(optManual);
    const algoChart = echarts.init(document.getElementById('chartApsAlgo'));
    algoChart.setOption(optAlgo);
    (window.__echarts = window.__echarts || []).push(manualChart, algoChart);
  }

  // ====================================================
  // 第四波 · AI 质量预测
  // ====================================================
  function initAiQuality() {
    // 预测图
    const chart = echarts.init(document.getElementById('chartAiForecast'));
    const x = [];
    for (let i = -24; i <= 6; i++) {
      const h = (new Date().getHours() + i + 24) % 24;
      x.push(String(h).padStart(2, '0') + ':00');
    }
    const actual = x.map((_, i) => i < 24 ? +(0.32 + Math.sin(i / 4) * 0.08 + Math.random() * 0.04).toFixed(3) : null);
    const predicted = x.map((_, i) => +(0.32 + Math.sin(i / 4) * 0.08).toFixed(3));
    const upper = predicted.map(v => +(v + 0.08).toFixed(3));
    const lower = predicted.map(v => Math.max(0, +(v - 0.08).toFixed(3)));
    // 未来 6h 预警
    for (let i = 24; i <= 30; i++) {
      if (i === 27) actual[i] = 0.62;
      if (i === 28) actual[i] = 0.58;
    }
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,.95)', textStyle: { color: '#F3F4F6' } },
      legend: { data: ['实际不良率', 'AI 预测', '置信区间'], textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0 },
      grid: { left: 40, right: 16, top: 32, bottom: 24 },
      xAxis: { type: 'category', data: x, axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } }, axisLabel: { color: '#64748B', fontSize: 9, interval: 4 } },
      yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } }, axisLabel: { color: '#64748B', fontSize: 10, formatter: '{value}%' } },
      series: [
        { name: '置信区间', type: 'line', data: upper, lineStyle: { opacity: 0 }, stack: 'ci', symbol: 'none', areaStyle: { color: 'rgba(232,180,160,.15)' } },
        { name: '置信区间', type: 'line', data: lower.map((v, i) => +(upper[i] - v - 0.16).toFixed(3)), lineStyle: { opacity: 0 }, stack: 'ci', symbol: 'none', areaStyle: { color: 'transparent' } },
        { name: 'AI 预测', type: 'line', data: predicted, smooth: true, symbol: 'none', lineStyle: { width: 2, color: '#E8B4A0' } },
        { name: '实际不良率', type: 'line', data: actual, symbol: 'none', lineStyle: { width: 1.5, color: '#3B82F6' } },
      ],
    });
    (window.__echarts = window.__echarts || []).push(chart);

    // 预警列表
    document.getElementById('aiAlertList').innerHTML = `
      <div class="aal-row err">
        <div class="aal-time">17:30 预警</div>
        <div class="aal-msg">模温异常 → 预测未来 2h 不良率将达 0.62%</div>
        <div class="aal-action">建议：调低模温 5℃ · 加快抽检频率</div>
      </div>
      <div class="aal-row warn">
        <div class="aal-time">19:00 预警</div>
        <div class="aal-msg">原料批次切换 → 预测色差风险</div>
        <div class="aal-action">建议：首件 IQC 加测色差</div>
      </div>
      <div class="aal-row ok">
        <div class="aal-time">20:00 解除</div>
        <div class="aal-msg">调温后预测不良率回落 0.32%</div>
        <div class="aal-action">系统已自动撤销首件预警</div>
      </div>
    `;

    // 特征重要性
    const feature = echarts.init(document.getElementById('chartFeature'));
    feature.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { left: 100, right: 16, top: 8, bottom: 24 },
      xAxis: { type: 'value', max: 1, axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)' } }, axisLabel: { color: '#64748B', fontSize: 10 } },
      yAxis: { type: 'category', data: ['模温偏差', '压力波动', '周期异常', '原料批次', '环境湿度', '操作员经验', '模具寿命', '色母配比'], axisLabel: { color: '#94A3B8', fontSize: 11 } },
      series: [{ type: 'bar', data: [0.28, 0.22, 0.18, 0.12, 0.08, 0.05, 0.04, 0.03], barWidth: 10, itemStyle: { color: new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#3B82F6'},{offset:1,color:'#E8B4A0'}]), borderRadius: [0, 3, 3, 0] } }],
    });
    (window.__echarts = window.__echarts || []).push(feature);

    // 模型指标
    document.getElementById('aiMetrics').innerHTML = `
      <div class="aim-row"><span>准确率 (Accuracy)</span><b style="color:var(--ok)">94.8%</b></div>
      <div class="aim-row"><span>精确率 (Precision)</span><b>92.1%</b></div>
      <div class="aim-row"><span>召回率 (Recall)</span><b>89.6%</b></div>
      <div class="aim-row"><span>F1 Score</span><b>0.908</b></div>
      <div class="aim-row"><span>AUC-ROC</span><b>0.96</b></div>
      <div class="aim-row"><span>假阴性率</span><b style="color:var(--ok)">1.6%</b></div>
      <div class="aim-row"><span>平均提前预警时长</span><b>4.2 小时</b></div>
    `;
  }

  // ====================================================
  // 第四波 · 数字孪生车间
  // ====================================================
  function initDigitalTwin() {
    const container = document.getElementById('twinBox');
    if (!container || !window.THREE) return;
    if (container.__twinned) return;
    container.__twinned = true;

    const w = container.clientWidth, h = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B1220);
    scene.fog = new THREE.Fog(0x0B1220, 30, 80);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 300);
    camera.position.set(24, 22, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(20, 30, 15);
    dir.castShadow = true;
    scene.add(dir);

    // 地面 + 网格
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.8 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const grid = new THREE.GridHelper(60, 30, 0x1F2937, 0x1F2937);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);

    // 区域划分（3 个车间：注塑 / 吹塑 / 丝印装配）
    const zones = [
      { name: '注塑车间', x: -14, z: 0, w: 14, d: 18, color: 0x1A2540 },
      { name: '吹塑车间', x: 0, z: 0, w: 12, d: 18, color: 0x1A2540 },
      { name: '丝印装配', x: 12, z: 0, w: 12, d: 18, color: 0x1A2540 },
    ];
    zones.forEach(z => {
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(z.w, z.d)),
        new THREE.LineBasicMaterial({ color: 0xE8B4A0, transparent: true, opacity: 0.3 })
      );
      outline.rotation.x = -Math.PI / 2;
      outline.position.set(z.x, 0.02, z.z);
      scene.add(outline);
    });

    // 设备：5 注塑 + 4 吹塑 + 3 丝印 + 3 装配 = 15 台
    const machines = [];
    const stateColors = { run: 0x10B981, idle: 0x94A3B8, warn: 0xF59E0B, err: 0xEF4444 };
    const labels = [];

    // 注塑 5 台
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), new THREE.MeshStandardMaterial({ color: 0x3B82F6, metalness: 0.5, roughness: 0.4 }));
      m.add(body);
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 2.2), new THREE.MeshStandardMaterial({ color: 0x1E40AF, emissive: 0x1E40AF, emissiveIntensity: 0.2 }));
      top.position.y = 1.4;
      m.add(top);
      m.position.set(-20 + i * 2.8, 1.25, -6);
      const st = i === 1 ? 'warn' : i === 3 ? 'idle' : 'run';
      m.children[0].material.color.setHex(stateColors[st]);
      m.children[0].material.emissive = new THREE.Color(stateColors[st]);
      m.children[0].material.emissiveIntensity = st === 'run' ? 0.3 : 0.1;
      scene.add(m);
      machines.push({ mesh: m, name: 'IM-0' + (i+1), state: st, oee: 75 + Math.random() * 20, zone: '注塑' });
    }
    // 吹塑 4 台
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16), new THREE.MeshStandardMaterial({ color: 0xD4A574, metalness: 0.4 }));
      m.add(body);
      m.position.set(-5 + i * 3, 1.25, 6);
      const st = i === 2 ? 'err' : 'run';
      m.children[0].material.color.setHex(stateColors[st]);
      m.children[0].material.emissive = new THREE.Color(stateColors[st]);
      m.children[0].material.emissiveIntensity = st === 'run' ? 0.3 : 0.5;
      scene.add(m);
      machines.push({ mesh: m, name: 'BM-' + String(i+1).padStart(2,'0'), state: st, oee: 70 + Math.random() * 25, zone: '吹塑' });
    }
    // 丝印 + 装配 5 台
    for (let i = 0; i < 5; i++) {
      const m = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: 0xA855F7, metalness: 0.3 }));
      m.add(body);
      m.position.set(8 + i * 2.5, 0.75, -6 + (i % 2) * 12);
      const st = i === 4 ? 'idle' : 'run';
      m.children[0].material.color.setHex(stateColors[st]);
      m.children[0].material.emissive = new THREE.Color(stateColors[st]);
      m.children[0].material.emissiveIntensity = 0.2;
      scene.add(m);
      machines.push({ mesh: m, name: (i < 2 ? 'SP-' : 'AS-') + String((i<2?i+1:i-1)).padStart(2,'0'), state: st, oee: 80 + Math.random() * 18, zone: i < 2 ? '丝印' : '装配' });
    }

    // 异常位置标记（红光柱）
    const alertPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 6, 8),
      new THREE.MeshBasicMaterial({ color: 0xEF4444, transparent: true, opacity: 0.7 })
    );
    alertPillar.position.set(-1, 3, 6);
    scene.add(alertPillar);
    // 异常光环
    const alertRing = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1, 32),
      new THREE.MeshBasicMaterial({ color: 0xEF4444, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    );
    alertRing.rotation.x = -Math.PI / 2;
    alertRing.position.set(-1, 0.05, 6);
    scene.add(alertRing);

    // AGV
    const agv = new THREE.Group();
    const agvBody = new THREE.Mesh(new THREE.BoxGeometry(1, 0.4, 0.6), new THREE.MeshStandardMaterial({ color: 0xE8B4A0, emissive: 0xE8B4A0, emissiveIntensity: 0.4 }));
    agvBody.position.y = 0.2;
    agv.add(agvBody);
    agv.position.set(0, 0, 0);
    scene.add(agv);

    // 人员标记（用小球）
    const people = [
      { pos: [-15, 0, 0], role: '李工' },
      { pos: [0, 0, 3], role: '张工' },
      { pos: [10, 0, -3], role: '王工' },
    ];
    people.forEach(p => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10B981 }));
      dot.position.set(p.pos[0], 0.5, p.pos[2]);
      scene.add(dot);
    });

    // 动画
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.01;
      agv.position.x = Math.sin(t) * 14;
      agv.position.z = Math.cos(t * 0.5) * 8;
      alertPillar.material.opacity = 0.4 + Math.sin(t * 4) * 0.3;
      alertRing.scale.setScalar(1 + Math.sin(t * 3) * 0.2);
      renderer.render(scene, camera);
    }
    animate();

    // 鼠标交互（旋转 + 缩放）
    let isDown = false, mx = 0, my = 0;
    let theta = Math.atan2(camera.position.x, camera.position.z);
    let phi = Math.atan2(camera.position.y, Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2));
    let dist = Math.sqrt(camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2);
    function updateCam() {
      camera.position.x = dist * Math.sin(phi) * Math.sin(theta);
      camera.position.y = dist * Math.cos(phi);
      camera.position.z = dist * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    }
    container.addEventListener('mousedown', e => { isDown = true; mx = e.clientX; my = e.clientY; });
    window.addEventListener('mouseup', () => isDown = false);
    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      theta -= (e.clientX - mx) * 0.005;
      phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.1, phi + (e.clientY - my) * 0.005));
      mx = e.clientX; my = e.clientY;
      updateCam();
    });
    container.addEventListener('wheel', e => {
      e.preventDefault();
      dist = Math.max(15, Math.min(60, dist + e.deltaY * 0.02));
      updateCam();
    });

    window.addEventListener('resize', () => {
      const w = container.clientWidth, h = container.clientHeight;
      if (w && h) { camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
    });

    // 侧边面板：设备状态
    document.getElementById('twinStatus').innerHTML = machines.map(m => `
      <div class="ts-row">
        <div class="ts-dot" style="background:${m.state === 'run' ? '#10B981' : m.state === 'warn' ? '#F59E0B' : m.state === 'err' ? '#EF4444' : '#94A3B8'}"></div>
        <div class="ts-name">${m.name}</div>
        <div class="ts-zone">${m.zone}</div>
        <div class="ts-oee">${Math.round(m.oee)}%</div>
      </div>
    `).join('');

    // 异常事件
    document.getElementById('twinEvents').innerHTML = `
      <div class="te-row err"><i data-lucide="siren"></i><div><b>BM-03 真空泵异响</b><div style="font-size:10px;color:var(--text-3)">吹塑车间 · 14:28 · 王工处理中</div></div></div>
      <div class="te-row warn"><i data-lucide="alert-triangle"></i><div><b>IM-02 模温偏差 ±2℃</b><div style="font-size:10px;color:var(--text-3)">注塑车间 · 持续中</div></div></div>
      <div class="te-row ok"><i data-lucide="check-circle-2"></i><div><b>AS-02 装配线复产</b><div style="font-size:10px;color:var(--text-3)">装配车间 · 13:50 已恢复</div></div></div>
    `;
    document.getElementById('twinAgv').innerHTML = `
      <div class="agv-mini"><div class="am-dot" style="background:#E8B4A0"></div><div><b>AGV-01</b><div style="font-size:10px;color:var(--text-3)">取料 → 注塑车间 A-08</div></div><div class="am-state">执行中</div></div>
      <div class="agv-mini"><div class="am-dot" style="background:#10B981"></div><div><b>AGV-02</b><div style="font-size:10px;color:var(--text-3)">送模 → 立体库</div></div><div class="am-state">执行中</div></div>
      <div class="agv-mini"><div class="am-dot" style="background:#94A3B8"></div><div><b>AGV-03</b><div style="font-size:10px;color:var(--text-3)">待命</div></div><div class="am-state" style="color:var(--text-3)">待命</div></div>
    `;
    document.getElementById('twinPeople').innerHTML = `
      <div class="tp-row"><div class="tp-dot"></div><div><b>李工</b> · 注塑 3 号机<div style="font-size:10px;color:var(--text-3)">在岗 6h 12min</div></div></div>
      <div class="tp-row"><div class="tp-dot"></div><div><b>张工</b> · 吹塑 1 号机<div style="font-size:10px;color:var(--text-3)">在岗 4h 30min</div></div></div>
      <div class="tp-row"><div class="tp-dot"></div><div><b>王工</b> · 吹塑 3 号机（异常处理）<div style="font-size:10px;color:var(--text-3)">响应 3min</div></div></div>
    `;
    initIcons();
  }

  // ====================================================
  // 第四波 · 供应商协同门户
  // ====================================================
  function initSupplierPortal() {
    // 采购订单
    const orders = [
      { sup: '海天机械', no: 'PO-20260825-0088', item: '海天 MA2500 注塑机 × 2', amt: '¥ 86.0 万', eta: '09-15', st: '生产中', pay: '30% 预付' },
      { sup: '海天机械', no: 'PO-20260820-0072', item: '海天 MA1600 注塑机 × 3', amt: '¥ 108.0 万', eta: '08-30', st: '运输中', pay: '已结清' },
      { sup: '雅琪塑机', no: 'PO-20260818-0064', item: '雅琪 BM-15 吹塑机 × 1', amt: '¥ 38.0 万', eta: '09-25', st: '生产中', pay: '30% 预付' },
      { sup: 'SK Chemicals', no: 'PO-20260822-0095', item: 'PETG 高透原料 8 吨', amt: '¥ 14.4 万', eta: '08-28', st: '已到货', pay: '月结 30 天' },
      { sup: '巴斯夫', no: 'PO-20260823-0101', item: '玫瑰金色母 200kg', amt: '¥ 4.6 万', eta: '08-29', st: '运输中', pay: '月结 60 天' },
      { sup: '海德堡', no: 'PO-20260815-0048', item: '烫金机 2 台套', amt: '¥ 52.0 万', eta: '10-08', st: '生产中', pay: '40% 预付' },
    ];
    document.getElementById('supOrderList').innerHTML = orders.map(o => `
      <div class="sol-row">
        <div class="sol-sup">${o.sup}</div>
        <div class="sol-body">
          <div style="font-family:var(--mono);color:var(--gold);font-size:11px">${o.no}</div>
          <div style="font-size:12px;margin-top:2px">${o.item}</div>
          <div style="font-size:10px;color:var(--text-3);margin-top:2px">到货 ${o.eta} · ${o.pay}</div>
        </div>
        <div class="sol-right">
          <div class="sol-amt">${o.amt}</div>
          <span class="status-pill ${o.st === '已到货' ? 'ok' : o.st === '运输中' ? 'info' : 'warn'}">${o.st}</span>
        </div>
      </div>
    `).join('');

    // 对账
    document.getElementById('supRecon').innerHTML = `
      <div class="sr-row"><span>海天机械</span><span class="mono">¥ 108.0 万</span><span class="status-pill ok">已对账</span></div>
      <div class="sr-row"><span>雅琪塑机</span><span class="mono">¥ 22.8 万</span><span class="status-pill warn">待对账</span></div>
      <div class="sr-row"><span>SK Chemicals</span><span class="mono">¥ 14.4 万</span><span class="status-pill ok">已对账</span></div>
      <div class="sr-row"><span>巴斯夫</span><span class="mono">¥ 4.6 万</span><span class="status-pill warn">待对账</span></div>
      <div class="sr-row"><span>海德堡</span><span class="mono">¥ 20.8 万</span><span class="status-pill ok">已对账</span></div>
      <div class="sr-row total"><span>合计应付</span><span class="mono" style="color:var(--gold)">¥ 170.6 万</span><span></span></div>
      <div style="margin-top:12px"><button class="btn primary" style="width:100%">批量付款</button></div>
    `;

    // 供应商绩效雷达
    const radar = echarts.init(document.getElementById('chartSupRadar'));
    radar.setOption({
      backgroundColor: 'transparent',
      tooltip: { backgroundColor: 'rgba(15,23,42,.95)', textStyle: { color: '#F3F4F6' } },
      legend: { data: ['海天机械', '雅琪塑机', 'SK Chemicals', '巴斯夫'], textStyle: { color: '#94A3B8', fontSize: 11 }, top: 0 },
      radar: {
        indicator: [
          { name: '质量', max: 100 },
          { name: '交期', max: 100 },
          { name: '价格', max: 100 },
          { name: '响应', max: 100 },
          { name: '服务', max: 100 },
          { name: '配合度', max: 100 },
        ],
        splitArea: { areaStyle: { color: ['rgba(232,180,160,.02)', 'rgba(232,180,160,.05)'] } },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } },
        name: { textStyle: { color: '#94A3B8', fontSize: 11 } },
      },
      series: [{
        type: 'radar',
        data: [
          { value: [92, 88, 75, 90, 85, 88], name: '海天机械', areaStyle: { color: 'rgba(232,180,160,.2)' }, lineStyle: { color: '#E8B4A0' }, itemStyle: { color: '#E8B4A0' } },
          { value: [88, 92, 80, 85, 82, 80], name: '雅琪塑机', areaStyle: { color: 'rgba(59,130,246,.2)' }, lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' } },
          { value: [95, 90, 70, 88, 90, 92], name: 'SK Chemicals', areaStyle: { color: 'rgba(16,185,129,.2)' }, lineStyle: { color: '#10B981' }, itemStyle: { color: '#10B981' } },
          { value: [90, 85, 72, 82, 88, 85], name: '巴斯夫', areaStyle: { color: 'rgba(168,85,247,.2)' }, lineStyle: { color: '#A855F7' }, itemStyle: { color: '#A855F7' } },
        ],
      }],
    });
    (window.__echarts = window.__echarts || []).push(radar);
  }
})();
