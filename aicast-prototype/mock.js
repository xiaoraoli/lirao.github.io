/* ============================================================
   AICast · mock.js — 集中数据源（唯一真源，跨页一致）
   业务口径统一：账号/内容/任务/指标/决策 结构一致
   ============================================================ */
window.DB = {
  /* ---------- 矩阵账号（本号矩阵 · 面向本地生活服务商） ---------- */
  accounts: [
    { id: 'A001', name: '杨记川菜官方号',  platform: '抖音',   short: '川菜', ip: '#172', env: 'ep-01', health: 92, status: 'healthy', fans: '3.2w', todayViews: '1.4w' },
    { id: 'A002', name: '深夜食堂探店',    platform: '快手',   short: '探店', ip: '#203', env: 'ep-02', health: 48, status: 'critical', fans: '9860', todayViews: '2300' },
    { id: 'A003', name: '巷口新店酱',      platform: '小红书', short: '新店', ip: '#319', env: 'ep-03', health: 18, status: 'offline', fans: '4120',  todayViews: '520' },
    { id: 'A004', name: '茉莉奶茶研究所',  platform: '抖音',   short: '奶茶', ip: '#088', env: 'ep-04', health: 85, status: 'healthy', fans: '1.1w', todayViews: '8600' },
    { id: 'A005', name: '巷尾卤味铺',      platform: '视频号', short: '卤味', ip: '#415', env: 'ep-05', health: 71, status: 'healthy', fans: '5300', todayViews: '4100' },
    { id: 'A006', name: '深夜食堂小红书号',platform: '小红书', short: '探店', ip: '#366', env: 'ep-06', health: 64, status: 'healthy', fans: '2700', todayViews: '1900' },
    { id: 'A007', name: '成都一日吃穿',    platform: '快手',   short: '美食', ip: '#507', env: 'ep-07', health: 58, status: 'critical', fans: '1.9w', todayViews: '3100' },
    { id: 'A008', name: '麻将馆招牌菜',    platform: '抖音',   short: '川菜', ip: '#611', env: 'ep-08', health: 90, status: 'healthy', fans: '2.0w', todayViews: '9800' }
  ],

  /* ---------- 内容成品（内容生成台产物，供调度/决策引用） ---------- */
  contents: [
    { id: 'C101', title: '人均30宝藏川菜',      status: 'ready',   template: '探店口播', duration: '00:47', views: '12.4w', watch: '9%', labelTag: '人均30·晚档' },
    { id: 'C102', title: '免单暗号挑战',         status: 'review',  template: '团购优惠', duration: '00:32', views: '0.8w',  watch: '3%', labelTag: '团购·午档' },
    { id: 'C103', title: '隐藏菜单揭秘',         status: 'draft',   template: '探店口播', duration: '00:55', views: '0.3w',  watch: '1%', labelTag: '探店·晚档' },
    { id: 'C104', title: '深夜1点还在排队',      status: 'ready',   template: '商品种草', duration: '00:38', views: '8.9w',  watch: '11%', labelTag: '深夜·跨夜' },
    { id: 'C105', title: '甜品配火锅冷知识',     status: 'ready',   template: '团购优惠', duration: '00:41', views: '3.1w',  watch: '7%', labelTag: '组合·午档' },
    { id: 'C106', title: '老板切的第100000片肉', status: 'draft',   template: '商品种草', duration: '00:36', views: '-',    watch: '-', labelTag: '手法·晚档' },
    { id: 'C107', title: '隐藏款毛肚不贵',       status: 'ready',   template: '探店口播', duration: '00:44', views: '5.6w',  watch: '8%', labelTag: '单品·晚档' },
    { id: 'C108', title: '把人均30吃到饱的方法', status: 'ready',   template: '团购优惠', duration: '00:50', views: '7.2w',  watch: '10%', labelTag: '实惠·午档' }
  ],

  /* ---------- 发布任务（预审调度队列） ---------- */
  scheduleTasks: [
    {
      id: 'T701', content: '人均30宝藏川菜', source: '内容生成台',
      plan: [
        { platform: '抖音',   time: '今日 12:30', status: 'queued', env: 'ep-01' },
        { platform: '小红书', time: '今日 19:20', status: 'queued', env: 'ep-06' }
      ], healthGate: '通过'
    },
    {
      id: 'T702', content: '免单暗号挑战', source: 'Portal 复测',
      plan: [
        { platform: '快手', time: '待排', status: 'pending', env: 'ep-02' }
      ], healthGate: '临界拦截'
    },
    {
      id: 'T703', content: '深夜1点还在排队', source: '决策面板',
      plan: [
        { platform: '抖音',   time: '今日 23:00', status: 'queued', env: 'ep-04' },
        { platform: '视频号', time: '明日 00:20', status: 'queued', env: 'ep-05' }
      ], healthGate: '通过'
    },
    {
      id: 'T704', content: '把人均30吃到饱的方法', source: '决策面板',
      plan: [
        { platform: '小红书', time: '待排', status: 'pending', env: 'ep-06' },
        { platform: '抖音',   time: '待排', status: 'pending', env: 'ep-08' }
      ], healthGate: '通过'
    }
  ],

  /* ---------- 数据回流（4D 归因） ---------- */
  analytics: [
    { labelTag: '人均30·晚档', dimensions: '内容×时段', platform: '抖音',   views: '12.4w', watch: '9%',  likes: '1.1w', word: '人均30', grade: 'high' },
    { labelTag: '深夜·跨夜',  dimensions: '时段×账号', platform: '抖音',   views: '8.9w',  watch: '11%', likes: '0.8w', word: '深夜',   grade: 'high' },
    { labelTag: '实惠·午档',  dimensions: '标题×平台', platform: '抖音',   views: '7.2w',  watch: '10%', likes: '0.7w', word: '吃饱',   grade: 'high' },
    { labelTag: '单品·晚档',  dimensions: '标题×内容', platform: '视频号', views: '5.6w',  watch: '8%',  likes: '0.5w', word: '毛肚',   grade: 'mid' },
    { labelTag: '组合·午档',  dimensions: '内容×时段', platform: '快手',   views: '3.1w',  watch: '7%',  likes: '0.3w', word: '配火锅', grade: 'mid' },
    { labelTag: '团购·午档',  dimensions: '标题×平台', platform: '小红书', views: '0.8w',  watch: '3%',  likes: '0.1w', word: '免单',   grade: 'low' },
    { labelTag: '探店·晚档',  dimensions: '内容×平台', platform: '视频号', views: '0.3w',  watch: '1%',  likes: '0.0w', word: '隐藏',   grade: 'low' }
  ],

  /* ---------- 每日决策建议 ---------- */
  decisions: [
    { id: 'D1', rank: 1, title: '「人均30」同款第二波',  basis: '近 7 日 12.4w 播放 · 完播 9% · 抖音 12:30 高潜', tag: '建议复用', positive: 1, risk: 0 },
    { id: 'D2', rank: 2, title: '「免单暗号」改标题复测', basis: '0.8w 播放偏低，标题吸引力不足 · 建议 A/B 改 3 组', tag: '建议 A/B', positive: 1, risk: 0 },
    { id: 'D3', rank: 3, title: '「隐藏菜单」时段迁移',  basis: '视频号完播仅 1% · 建议从 19:20 迁到深夜档试水', tag: '建议复测', positive: 1, risk: 1 },
    { id: 'D4', rank: 4, title: '「人均30」切换次日 08:00 发布', basis: '早间通勤档尚无该题数据 · A/B 验证时段', tag: '新增 A/B', positive: 0, risk: 0 }
  ],

  /* ---------- 回灌标签库（供生成台读取） ---------- */
  feedbackTags: ['标题含「人均30」在抖音高潜', '深夜档完播率显著更高', '「实惠」类标题午间转化好', '视频号需更长标题说明']
};