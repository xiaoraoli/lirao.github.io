/* ============================================
   伍星御瓶 · Mock 数据
   ============================================ */
window.MOCK = {
  // 客户
  clients: ["完美日记", "珀莱雅", "毛戈平", "花西子", "阿道夫", "修正"],
  // 机台
  machines: [
    { id: "IM-01", name: "1 号注塑机", status: "run", oee: 87 },
    { id: "IM-02", name: "2 号注塑机", status: "run", oee: 82 },
    { id: "IM-03", name: "3 号注塑机", status: "run", oee: 91 },
    { id: "IM-04", name: "4 号注塑机", status: "idle", oee: 0 },
    { id: "IM-05", name: "5 号注塑机", status: "run", oee: 78 },
    { id: "BM-01", name: "1 号吹塑机", status: "run", oee: 84 },
    { id: "BM-02", name: "2 号吹塑机", status: "run", oee: 76 },
    { id: "BM-03", name: "3 号吹塑机", status: "maint", oee: 0 },
    { id: "BM-04", name: "4 号吹塑机", status: "run", oee: 80 },
    { id: "SP-01", name: "1 号丝印机", status: "run", oee: 89 },
    { id: "SP-02", name: "2 号丝印机", status: "run", oee: 73 },
    { id: "SP-03", name: "3 号丝印机", status: "run", oee: 85 },
    { id: "AS-01", name: "1 号装配线", status: "run", oee: 92 },
    { id: "AS-02", name: "2 号装配线", status: "run", oee: 88 },
    { id: "AS-03", name: "3 号装配线", status: "idle", oee: 0 },
  ],
  // 模具池
  moulds: [
    // 开发中 3 套
    { id: "M-PETG-A45", client: "花西子", prod: "花瓣精华瓶", ver: "V1", state: "dev", devStart: "2026-07-20", devDays: 36, life: 0, total: 50000, color: "#3B82F6", icon: "🌸" },
    { id: "M-PL-J40", client: "毛戈平", prod: "高定粉底瓶", ver: "V1", state: "dev", devStart: "2026-08-01", devDays: 24, life: 0, total: 50000, color: "#3B82F6", icon: "💄" },
    { id: "M-CR-F22", client: "珀莱雅", prod: "双抗精华瓶", ver: "V1", state: "dev", devStart: "2026-08-10", devDays: 15, life: 0, total: 50000, color: "#3B82F6", icon: "✨" },

    // 在产 14 套
    { id: "M-PETG-A22", client: "完美日记", prod: "动物眼影精华瓶 30ml", ver: "V3", state: "prod", machine: "IM-03", life: 12500, total: 50000, color: "#10B981", icon: "🦊", progress: 64 },
    { id: "M-PL-J27", client: "珀莱雅", prod: "红宝石乳液瓶 50ml", ver: "V2", state: "prod", machine: "IM-01", life: 32000, total: 50000, color: "#10B981", icon: "💎", progress: 88 },
    { id: "M-CR-F15", client: "毛戈平", prod: "光感膏霜瓶 30g", ver: "V2", state: "prod", machine: "IM-02", life: 8200, total: 50000, color: "#10B981", icon: "🌟", progress: 42 },
    { id: "M-PETG-B18", client: "花西子", prod: "苗族印象卸妆油瓶 150ml", ver: "V1", state: "prod", machine: "BM-02", life: 21500, total: 50000, color: "#10B981", icon: "🌿", progress: 71 },
    { id: "M-PL-J35", client: "完美日记", prod: "动物眼影腮红液 25ml", ver: "V1", state: "prod", machine: "IM-05", life: 18600, total: 50000, color: "#10B981", icon: "🌸", progress: 55 },
    { id: "M-CR-F12", client: "阿道夫", prod: "精油修护瓶 30ml", ver: "V3", state: "prod", machine: "IM-04", life: 41200, total: 50000, color: "#F59E0B", icon: "🧴", progress: 95 },
    { id: "M-PETG-C30", client: "修正", prod: "烟酰胺原液瓶 30ml", ver: "V2", state: "prod", machine: "BM-01", life: 9800, total: 50000, color: "#10B981", icon: "💧", progress: 38 },
    { id: "M-PL-J29", client: "毛戈平", prod: "无痕粉底液瓶 30ml", ver: "V1", state: "prod", machine: "BM-04", life: 5200, total: 50000, color: "#10B981", icon: "🎀", progress: 28 },
    { id: "M-CR-F20", client: "珀莱雅", prod: "红宝石面霜瓶 50g", ver: "V2", state: "prod", machine: "SP-01", life: 28400, total: 50000, color: "#10B981", icon: "💠", progress: 79 },
    { id: "M-PETG-D12", client: "阿道夫", prod: "植萃洗发水瓶 500ml", ver: "V1", state: "prod", machine: "BM-04", life: 15800, total: 50000, color: "#10B981", icon: "🌱", progress: 48 },
    { id: "M-PL-J31", client: "完美日记", prod: "动物眼影粉底液 30ml", ver: "V2", state: "prod", machine: "AS-01", life: 35200, total: 50000, color: "#10B981", icon: "🦋", progress: 92 },
    { id: "M-CR-F18", client: "修正", prod: "寡肽精华液瓶 30ml", ver: "V1", state: "prod", machine: "IM-02", life: 6800, total: 50000, color: "#F59E0B", icon: "💎", progress: 33 },
    { id: "M-PETG-E25", client: "花西子", prod: "百鸟朝凤眼影盘外盒", ver: "V1", state: "prod", machine: "SP-02", life: 12200, total: 50000, color: "#10B981", icon: "🦚", progress: 45 },
    { id: "M-PL-J33", client: "毛戈平", prod: "高光修容盘 12g", ver: "V1", state: "prod", machine: "SP-03", life: 22800, total: 50000, color: "#10B981", icon: "✨", progress: 67 },

    // 待保养 2 套
    { id: "M-CR-F08", client: "阿道夫", prod: "老款洗发水瓶 400ml", ver: "V4", state: "maint", machine: null, life: 47800, total: 50000, color: "#F59E0B", icon: "🧴" },
    { id: "M-PETG-A18", client: "完美日记", prod: "老款动物眼影瓶 25ml", ver: "V2", state: "maint", machine: null, life: 46200, total: 50000, color: "#F59E0B", icon: "🦊" },

    // 待报废 1 套
    { id: "M-PL-J12", client: "珀莱雅", prod: "老款红宝石水乳瓶", ver: "V1", state: "scrap", machine: null, life: 49500, total: 50000, color: "#EF4444", icon: "💎" },
  ],
  // 异常流水
  issues: [
    { time: "14:32", level: "err", title: "M-PL-J29 模具温度异常", desc: "5 秒内波动 8℃ · 已派工 张师傅", action: "查看" },
    { time: "13:58", level: "warn", title: "M-CR-F08 寿命告警", desc: "剩余 4.4% · 建议本周内大保养", action: "派单" },
    { time: "11:20", level: "info", title: "新订单 SO-20260825-0192 已下发", desc: "毛戈平 · 高定粉底瓶 5 万只", action: "查看" },
  ],
  // AGV 任务
  agvs: [
    { id: "AGV-01", name: "1 号 AGV", task: "取模 M-PETG-A22 → IM-03", state: "busy", progress: 65 },
    { id: "AGV-02", name: "2 号 AGV", task: "归还 M-CR-F12 → 模仓 A-12", state: "busy", progress: 32 },
    { id: "AGV-03", name: "3 号 AGV", task: "待命", state: "idle", progress: 0 },
  ],
  // 客户订单
  orders: [
    { no: "SO-20260825-0188", client: "完美日记", prod: "动物眼影精华瓶 30ml · 8 万只", due: "2026-09-05", state: "prod", progress: 64 },
    { no: "SO-20260824-0201", client: "珀莱雅", prod: "红宝石乳液瓶 50ml · 12 万只", due: "2026-09-10", state: "prod", progress: 88 },
    { no: "SO-20260823-0156", client: "毛戈平", prod: "光感膏霜瓶 30g · 6 万只", due: "2026-09-02", state: "prod", progress: 42 },
    { no: "SO-20260822-0099", client: "花西子", prod: "苗族印象卸妆油瓶 150ml · 4 万只", due: "2026-08-30", state: "risk", progress: 28 },
    { no: "SO-20260820-0078", client: "阿道夫", prod: "精油修护瓶 30ml · 10 万只", due: "2026-09-15", state: "prod", progress: 95 },
    { no: "SO-20260818-0062", client: "修正", prod: "烟酰胺原液瓶 30ml · 7 万只", due: "2026-09-08", state: "prod", progress: 38 },
  ],
};
