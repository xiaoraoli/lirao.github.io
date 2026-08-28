/* ============================================================
   api.js — API 存根：方法签名即未来真实 API 形状
   交互层只调用 api.*，后端接入时替换实现即可。
   ============================================================ */
window.api = (function(){
  function delay(ms){ return new Promise(function(r){ setTimeout(r, ms||400); }); }

  function req(marker, fn, ms){
    return function(){ var args=[].slice.call(arguments);
      return delay(ms||400).then(function(){ return fn.apply(null,args); }); };
  }

  return {
    // GET /api/kitchen/kpis —— 工作台统计
    getKpis: req('GET /api/kitchen/kpis', function(){ return { code:0, data:{
      proposalsToday:18, viewsWeek:1360, conversion:42, pendingApprovals:7, adoptedThisMonth:86
    }}; }, 320),

    // GET /api/assets?cat=&kw= —— 资产库检索
    getAssets: req('GET /api/assets', function(filter){ filter=filter||{};
      var list=DB.assets.slice();
      if(filter.cat && filter.cat!=='all') list=list.filter(function(a){return a.cat===filter.cat;});
      if(filter.kw) list=list.filter(function(a){return a.name.indexOf(filter.kw)>-1 || (a.supplier||'').indexOf(filter.kw)>-1;});
      return { code:0, data:list, total:list.length };
    }, 360),

    // POST /api/edt/snapshot —— 3D 编辑器：生成渲染快照（模拟）
    renderSnapshot: req('POST /api/edt/snapshot', function(payload){
      return { code:0, data:{ url:'mock://render/'+(payload.bottle||'x')+'.png', ms:280 } };
    }, 700),

    // POST /api/ai/ideate —— AI 灵感生成（接入大模型前为 canned 演示）
    // 请求: { prompt, variant }  返回: { ideas:[...] }
    ideate: req('POST /api/ai/ideate', function(p){
      return { code:0, data:{ ideas:[
        { name:'方案 A · 「p」微调', cover:'tint-teal', tags:['不均分','可制造'], note:'已自动匹配真实模具 A101' },
        { name:'方案 B · 工艺加重', cover:'tint-terracotta', tags:['烫金加重','可制造'], note:'新增局部 UV 节点' }
      ], feasible:true } };
    }, 1100),

    // GET /api/proposals?status= —— 提案列表
    getProposals: req('GET /api/proposals', function(){ return { code:0, data:DB.proposals }; }, 340),

    // POST /api/proposals/:id/draft —— 一键生成 H5 提案
    draftProposal: req('POST /api/proposals/:id/draft', function(id){ return { code:0, data:{ link:'mock://h5/packai/'+id, expiresIn:7, qr:'mock://qr/'+id } }; }, 900),

    // GET /api/orders —— 订单列表
    getOrders: req('GET /api/orders', function(){ return { code:0, data:DB.orders }; }, 380),

    // POST /api/sample/request —— 发起实体打样
    requestSample: req('POST /api/sample/request', function(p){ return { code:0, data:{ orderId:'SO-NEW-'+Date.now(), status:'待打样' } }; }, 600)
  };
})();