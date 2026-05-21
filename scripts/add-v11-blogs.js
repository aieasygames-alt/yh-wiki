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
    "summary": "异环1.1版本「游梦洄廊」前瞻特别节目于5月23日播出，暗系大C安魂曲、首位S级限定男角色卡厄斯亮相，新地图、船只载具、移动端优化等重磅内容一文汇总。",
    "summaryEn": "NTE Version 1.1 'Wandering Corridor' preview livestream aired May 23. New S-rank characters Lacrimosa (Dark DPS) and Chaos (first limited male S-rank), new map, ship vehicles, mobile optimization and more.",
    "internalLinks": [
      {"href": "/characters/lacrimosa", "label": "安魂曲角色页", "labelEn": "Lacrimosa Character Page"},
      {"href": "/characters/chaos", "label": "卡厄斯角色页", "labelEn": "Chaos Character Page"},
      {"href": "/redeem-codes", "label": "兑换码大全", "labelEn": "Redeem Codes"},
      {"href": "/tier-list", "label": "强度排行", "labelEn": "Tier List"}
    ],
    "content": "异环1.1版本「游梦洄廊」前瞻特别节目已于2026年5月23日19:30正式播出。这是异环公测后的首个大版本更新，内容量非常丰富。以下是直播核心内容汇总。\n\n新角色\n\n上半卡池 — 安魂曲（Lacrimosa）：暗属性（Chaos）S级限定进攻角色。异常控制局ETD-4队员，擅长操控多个异能构装体进行协同战斗。召唤物拥有优秀的AoE能力，适合群体战斗场景。\n\n下半卡池 — 卡厄斯（Chaos）：异环首位S级限定男角色。出现在主线「猩红研究」剧情中，具体技能和定位以游戏内实装为准。\n\n新地图与探索内容\n\n1.1版本将开放全新游乐园区域地图，包含新的探索点、宝箱和异象收集内容。互动地图将同步更新标记数据。\n\n船只载具\n\n新增船只载具系统，玩家可以在水域自由航行，拓展了探索范围和移动方式。\n\n男角色同居系统\n\n1.1版本或将上线全新的男角色同居社交玩法，具体机制待官方后续公告确认。\n\n移动端优化\n\n针对手机端性能问题进行了专项优化，包括降低发热、提升帧率稳定性、减少内存占用等。\n\n其他更新\n\n新的限时活动和副本、弧盘/武器平衡性调整、UI交互优化等。具体细节请关注游戏内公告。\n\n1.1版本兑换码\n\n前瞻直播期间发放的兑换码已更新至我们的兑换码页面，请尽快使用。兑换方式：游戏内点击头像 → 设置 → 兑换码输入框。\n\n版本上线时间\n\n1.1版本「游梦洄廊」预计于6月初上线，具体日期以官方公告为准。安魂曲预计为上半卡池，卡厄斯预计为下半卡池。\n\n抽卡建议\n\n零氪/微氪玩家建议优先保底安魂曲（暗系大C，通用性强），有余力再考虑卡厄斯。当前版本存够约90抽方可保底一个S级角色。\n\n更多1.1版本详细攻略，包括角色Build、配队推荐、材料规划等，将在版本上线后第一时间更新。关注我们的角色页面和攻略页面获取最新信息。",
    "contentEn": "The NTE Version 1.1 'Wandering Corridor' preview livestream aired on May 23, 2026 at 19:30 (UTC+8). This is the first major update since launch, packed with new content.\n\nNew Characters\n\nPhase 1 Banner — Lacrimosa: Chaos-attribute S-rank limited Attack character. ETD-4 member who controls multiple Esper Constructs for coordinated combat. Her summons excel at AoE damage, making her strong for group fights.\n\nPhase 2 Banner — Chaos: The first S-rank limited male character in NTE. Appears in the 'A Research in Scarlet' main story quest.\n\nNew Map & Exploration\n\nA new amusement park area opens with fresh exploration points, treasure chests, and anomaly collection content. Our interactive map will be updated with all new markers.\n\nShip Vehicles\n\nA new ship vehicle system allows players to sail across water areas, expanding exploration and movement options.\n\nMale Character Co-Habitation System\n\nA new social system for male characters may be introduced in 1.1. Details pending official confirmation.\n\nMobile Optimization\n\nPerformance improvements for mobile include reduced overheating, better frame rate stability, and lower memory usage.\n\nOther Updates\n\nNew limited-time events and dungeons, arc disc/weapon balance adjustments, UI/UX improvements.\n\n1.1 Redeem Codes\n\nLivestream codes have been added to our Redeem Codes page. Redeem via: Profile → Settings → Enter Code.\n\nRelease Date\n\nVersion 1.1 is expected to go live in early June. Lacrimosa in Phase 1, Chaos in Phase 2.\n\nPull Strategy\n\nF2P/low-spenders should prioritize guaranteeing Lacrimosa (strong universal Dark DPS) first. Save ~90 pulls for one S-rank guarantee.\n\nDetailed character builds, team comps, and material planning guides will be updated immediately after the version goes live."
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
