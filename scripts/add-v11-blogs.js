const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'data', 'blog.json');
const blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

const newBlogs = [
  {
    "id": "nte-v11-preview-livestream",
    "title": "异环1.1版本「游梦洄廊」前瞻直播汇总 — 新角色、新地图、新兑换码全收录",
    "titleEn": "NTE Version 1.1 'Wandering Corridor' Livestream Summary — New Characters, Map & Codes",
    "category": "版本更新",
    "categoryZh": "版本更新",
    "categoryEn": "Version Update",
    "date": "2026-05-23",
    "tags": ["1.1", "前瞻直播", "安魂曲", "卡厄斯", "新角色", "兑换码", "游梦洄廊", "version update"],
    "summary": "异环1.1版本「游梦洄廊」前瞻特别节目于5月23日19:30播出。暗属性S级安魂曲（上半卡池5/28-6/11）、首位S级限定男角色卡厄斯（下半卡池6/11-7/2）登场，新游乐园地图、船只载具、保时捷联动、保底不歪机制等重磅内容汇总。三组前瞻兑换码已更新。",
    "summaryEn": "NTE Version 1.1 'Wandering Corridor' livestream aired May 23 at 19:30 UTC+8. Lacrimosa (Chaos-attribute S-rank DPS, Phase 1: May 28–June 11) and Chaos (first limited male S-rank, Phase 2: June 11–July 2) headline the update. New amusement park map, ship vehicles, Porsche collab, guarantee-no-lose banner system, and 3 livestream codes confirmed.",
    "internalLinks": [
      {"href": "/characters/lacrimosa", "label": "安魂曲角色页", "labelEn": "Lacrimosa Character Page"},
      {"href": "/characters/chaos", "label": "卡厄斯角色页", "labelEn": "Chaos Character Page"},
      {"href": "/redeem-codes", "label": "兑换码大全", "labelEn": "Redeem Codes"},
      {"href": "/tier-list", "label": "强度排行", "labelEn": "Tier List"}
    ],
    "content": "异环1.1版本「游梦洄廊」前瞻特别节目已于2026年5月23日19:30正式播出。这是异环公测后的首个大版本更新，内容量非常丰富。以下是直播核心内容汇总。\n\n版本上线时间\n\n1.1版本「游梦洄廊」将于2026年5月28日上午10:00正式上线。\n\n卡池安排\n\n上半卡池（安魂曲）: 5月28日 ~ 6月11日\n下半卡池（卡厄斯）: 6月11日 ~ 7月2日\n\n重要: 1.1版本限定卡池开启「保底不歪」机制，玩家抽到保底时必定获得当期UP角色。\n\n新角色\n\n安魂曲（Lacrimosa）— 暗属性（Chaos）S级限定进攻角色。异常控制局ETD-4队员，战斗方式独特：在「平底锅」和「红色果冻」两种模式间切换，通过技能「晨光番茄酱」和「恶魔灵感」操控异能构装体进行协同攻击。核心机制为在敌人身上叠加「噩梦层数」后爆发高额伤害，大招「工作日审判」以主题卡车/车辆进行攻击。适合持续压制+爆发输出的玩法风格，对零氪玩家友好。\n\n卡厄斯（Chaos）— 异环首位S级限定男角色，拉克沙纳/相位元素。出现在主线「猩红研究」剧情中，具体技能和定位以游戏内实装为准。\n\n新地图与探索内容\n\n全新游乐园区域地图开放，包含新的探索点、宝箱和异象收集内容。\n\n新载具与系统\n\n船只载具: 新增船只载具系统，可在水域自由航行。\n车辆智能巡航: 车辆新增智能巡航功能。\n\n社交系统\n\n1.1版本将上线全新的男角色同居社交玩法。\n\n移动端优化\n\n针对手机端进行了专项优化，包括降低发热、提升帧率稳定性、减少内存占用等。新增剧情跳过功能。\n\n保时捷联动\n\n1.1版本将推出与保时捷（Porsche）的联动内容。\n\n上线福利\n\n版本更新福利: 17抽 + 600体力 + 30万方斯。\n\n1.1前瞻兑换码\n\n三组前瞻直播兑换码已发放，有效期至5月25日23:59，请尽快使用：\nDREAMWALK0603\nTOMATO100\nRACENOLIMIT\n\n兑换方式: 游戏内点击头像 → 设置 → 兑换码输入框。\n\n其他更新\n\n新的限时活动和副本、弧盘/武器平衡性调整、UI交互优化等。\n\n当前活动提醒\n\n「零的同伴」活动将于5月27日结束\n「巡逻猫须」活动将于6月3日结束\n\n抽卡建议\n\n零氪/微氪玩家建议优先保底安魂曲（暗系大C，通用性强），有余力再考虑卡厄斯。1.1版本限定卡池保底不歪，安心抽卡。\n\n更多1.1版本详细攻略，包括角色Build、配队推荐、材料规划等，将在版本上线后第一时间更新。关注我们的角色页面和攻略页面获取最新信息。",
    "contentEn": "The NTE Version 1.1 'Wandering Corridor' preview livestream aired on May 23, 2026 at 19:30 (UTC+8). This is the first major update since launch, packed with new content.\n\nRelease Date\n\nVersion 1.1 launches on May 28, 2026 at 10:00 (UTC+8).\n\nBanner Schedule\n\nPhase 1 (Lacrimosa): May 28 – June 11\nPhase 2 (Chaos): June 11 – July 2\n\nImportant: Version 1.1 introduces a guarantee-no-lose banner system — your pity pull is guaranteed to be the featured character.\n\nNew Characters\n\nLacrimosa — Chaos-attribute S-rank limited Attack character. An ETD-4 member with a unique combat style: switches between 'frying pans' and 'red jelly' modes. Her skills 'Morning Tomato' and 'Devilish Inspiration' control Esper Constructs for coordinated attacks. The core mechanic builds 'Nightmare Stacks' on enemies, then detonates for massive damage. Her Ultimate 'Working Day Judgment' features a thematic truck/car attack. F2P-friendly sustained pressure + burst playstyle.\n\nChaos — The first S-rank limited male character in NTE, Lakshana/Phase element. Appears in the 'A Research in Scarlet' main story quest.\n\nNew Map & Exploration\n\nA brand-new amusement park area opens with fresh exploration points, treasure chests, and anomaly collection content.\n\nNew Vehicles & Systems\n\nShip Vehicles: New ship vehicle system lets you sail across water areas.\nVehicle Smart Cruise: Vehicles get a new smart cruise control feature.\n\nSocial System\n\nA new male character co-habitation social system is being introduced.\n\nMobile Optimization\n\nPerformance improvements include reduced overheating, better frame rate stability, and lower memory usage. A story skip feature has been added.\n\nPorsche Collaboration\n\nVersion 1.1 includes a collaboration with Porsche.\n\nLaunch Bonuses\n\nVersion update rewards: 17 pulls + 600 stamina + 300,000 Fons.\n\n1.1 Livestream Redeem Codes\n\nThree livestream codes have been released, expiring May 25 at 23:59 — redeem them quickly:\nDREAMWALK0603\nTOMATO100\nRACENOLIMIT\n\nRedeem via: Profile → Settings → Enter Code.\n\nOther Updates\n\nNew limited-time events and dungeons, arc disc/weapon balance adjustments, UI/UX improvements.\n\nCurrent Event Reminders\n\n'Zero's Companion' event ends May 27\n'Whisker Patrol' event ends June 3\n\nPull Strategy\n\nF2P/low-spenders should prioritize guaranteeing Lacrimosa (strong universal Dark DPS). With the guarantee-no-lose system, you can pull with confidence.\n\nDetailed character builds, team comps, and material planning guides will be updated immediately after the version goes live."
  }
];

// Check if already exists
const existingIds = new Set(blogs.map(b => b.id));
const toAdd = newBlogs.filter(b => !existingIds.has(b.id));

if (toAdd.length === 0) {
  console.log('All blogs already exist, nothing to add.');
  process.exit(0);
}

blogs.unshift(...toAdd);
fs.writeFileSync(blogPath, JSON.stringify(blogs, null, 2), 'utf8');
console.log(`Added ${toAdd.length} blog(s): ${toAdd.map(b => b.id).join(', ')}`);
console.log(`Total blogs: ${blogs.length}`);
