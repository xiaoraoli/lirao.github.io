/* ============================================================
   mock.js — 单一模拟数据源（Design Contract §Mock Schema）
   ============================================================ */
window.DB = {
  user: { id:1, name:'孟晓慧', company:'广州珀美实业', role:'ODM 官网销售', roleEn:'SALES' },

  suppliers: [
    { id:'SUP01', name:'广州玖鑫包材', region:'白云区', items:3280, digital:92 },
    { id:'SUP02', name:'苏州晶瑞玻璃', region:'苏州', items:1864, digital:78 },
    { id:'SUP03', name:'汕头益丰塑胶', region:'汕头', items:2431, digital:85 },
    { id:'SUP04', name:'东莞粤港实业', region:'东莞', items:1506, digital:64 }
  ],

  assets: [
    { id:'A101', name:'磨砂渐变精华瓶 30ml', cat:'精华瓶', material:'PET · 磨砂', processes:['烫金','丝印'], color:'#b98a72', supplier:'广州玖鑫包材', price:'0.86', moq:3000, adopted:128, cover:'tint-caramel' },
    { id:'A102', name:'高透玻璃乳霜罐 50g', cat:'乳霜罐', material:'玻璃', processes:['烫银','UV'], color:'#2F6E6E', supplier:'苏州晶瑞玻璃', price:'1.24', moq:2000, adopted:96, cover:'tint-teal' },
    { id:'A103', name:'马卡龙色口红管 3.2g', cat:'口红管', material:'铝 · 阳极氧化', processes:['丝印','镭射'], color:'#C9572F', supplier:'东莞粤港实业', price:'2.08', moq:5000, adopted:74, cover:'tint-terracotta' },
    { id:'A104', name:'哑光安瓶 5ml', cat:'安瓶', material:'玻璃', processes:['喷砂','烫金'], color:'#C88A2D', supplier:'汕头益丰塑胶', price:'0.52', moq:8000, adopted:151, cover:'tint-gold' },
    { id:'A105', name:'PET 按压泵瓶 100ml', cat:'泵瓶', material:'PET', processes:['UV','丝印'], color:'#707A86', supplier:'广州玖鑫包材', price:'1.62', moq:4000, adopted:63, cover:'tint-graphite' },
    { id:'A106', name:'透明晶钻喷雾瓶 50ml', cat:'喷雾瓶', material:'PETG', processes:['幻彩镭射'], color:'#2F6E6E', supplier:'东莞粤港实业', price:'1.10', moq:3000, adopted:48, cover:'tint-teal' },
    { id:'A107', name:'翡翠绿滴管瓶 30ml', cat:'滴管瓶', material:'玻璃 · 翡翠绿', processes:['烫金','磨砂'], color:'#3a6b4f', supplier:'苏州晶瑞玻璃', price:'1.46', moq:3000, adopted:112, cover:'tint-green' },
    { id:'A108', name:'软管洗面奶 120g', cat:'软管', material:'LDPE', processes:['丝印','覆膜'], color:'#a95a6d', supplier:'汕头益丰塑胶', price:'0.94', moq:6000, adopted:59, cover:'tint-rose' }
  ],

  projects: [
    { id:'PJ-2401', name:'「初雾」保湿精华瓶提案', customer:'初雾生物', bottle:'A101', status:'提案中', updated:'今天 09:40' },
    { id:'PJ-2402', name:'青黛堂乳霜罐虚拟打样', customer:'青黛堂', bottle:'A102', status:'待打样', updated:'昨天' },
    { id:'PJ-2403', name:'FLEUR 口红管国际版', customer:'FLEUR Paris', bottle:'A103', status:'询价中', updated:'08-24' },
    { id:'PJ-2404', name:'可回购安瓶礼盒', customer:'悦肤', bottle:'A104', status:'提案中', updated:'08-23' }
  ],

  proposals: [
    { id:'PO-2026-0081', title:'「初雾」保湿精华瓶 30ml', customer:'初雾生物', bottle:'磨砂渐变精华瓶', process:'烫金 · 丝印', price:'2.14', views:38, status:'进行中', created:'2026-08-25' },
    { id:'PO-2026-0080', title:'青黛堂乳霜罐 50g', customer:'青黛堂', bottle:'高透玻璃乳霜罐', process:'烫银 · UV', price:'3.06', views:52, status:'待打样', created:'2026-08-24' },
    { id:'PO-2026-0079', title:'FLEUR 口红管 3.2g 限量版', customer:'FLEUR Paris', bottle:'马卡龙色口红管', process:'镭射 · 丝印', price:'4.32', views:71, status:'询价中', created:'2026-08-23' },
    { id:'PO-2026-0076', title:'可回购精华安瓶 5ml', customer:'悦肤', bottle:'哑光安瓶', process:'喷砂 · 烫金', price:'1.58', views:20, status:'已完成', created:'2026-08-20' }
  ],

  aiIdeas: [
    { id:'AI01', prompt:'东方草本 · 青瓷釉面质感精华瓶', tags:['青瓷','釉面','24K 微烫金','PET'], feasible:true, cover:'tint-teal' },
    { id:'AI02', prompt:'海洋凝润 · 波光流体渐变乳霜罐', tags:['流体渐变','镜面','珍珠母贝'], feasible:true, cover:'tint-caramel' },
    { id:'AI03', prompt:'极简蒙德里安 · 三色几何口红管', tags:['几何分割','阳极氧化','撞色'], feasible:true, cover:'tint-terracotta' },
    { id:'AI04', prompt:'鎏金纸醉 · 复古酒红香水喷雾', tags:['鎏金','酒红','幻彩镭射'], feasible:false, cover:'tint-rose' }
  ],

  orders: [
    { id:'SO-2026-0312', type:'打样', bottle:'高透玻璃乳霜罐', customer:'青黛堂', qty:'3 套', amount:980, status:'打样中', date:'2026-08-26', supplier:'苏州晶瑞玻璃' },
    { id:'SO-2026-0311', type:'采购', bottle:'磨砂渐变精华瓶', customer:'初雾生物', qty:'6,000', amount:5160, status:'生产中', date:'2026-08-25', supplier:'广州玖鑫包材' },
    { id:'SO-2026-0309', type:'打样', bottle:'马卡龙色口红管', customer:'FLEUR Paris', qty:'5 套', amount:1240, status:'待打样', date:'2026-08-24', supplier:'东莞粤港实业' },
    { id:'SO-2026-0305', type:'采购', bottle:'哑光安瓶', customer:'悦肤', qty:'8,000', amount:4160, status:'已发货', date:'2026-08-20', supplier:'汕头益丰塑胶' },
    { id:'SO-2026-0302', type:'采购', bottle:'翡翠绿滴管瓶', customer:'景和堂', qty:'3,000', amount:4380, status:'已完成', date:'2026-08-15', supplier:'苏州晶瑞玻璃' }
  ],

  bom: [
    { name:'瓶身 — 磨砂渐变精华瓶', spec:'H88 · PET 磨砂', qty:1, unit:'个', estimate:'0.86' },
    { name:'瓶盖 — 哑光乳白盖', spec:'PP 24/410', qty:1, unit:'个', estimate:'0.42' },
    { name:'内塞 — 透明内盖', spec:'PP', qty:1, unit:'个', estimate:'0.18' },
    { name:'印刷后道 — 烫金', spec:'局部烫金 · 距瓶底 12mm', qty:1, unit:'道', estimate:'0.38' },
    { name:'丝印', spec:'2 色 · UV 油墨', qty:1, unit:'道', estimate:'0.30' }
  ]
};