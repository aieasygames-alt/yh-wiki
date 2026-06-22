const fs = require('fs');
const path = require('path');

const guidesPath = path.join(__dirname, '..', 'data', 'guides.json');
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

const idx = guides.findIndex(g => g.id === 'team-building');
if (idx === -1) { console.log('NOT FOUND'); process.exit(1); }

guides[idx] = {
  ...guides[idx],
  title: '公测配队推荐 — 最强阵容搭配指南',
  titleEn: 'Launch Best Team Comps — Meta Team Building Guide',
  summary: '异环公测版本最强配队推荐，包括娜娜莉创生队、小吱盈蓄队、白藏浊燃队等毕业阵容，附带零氪平民配队方案。',
  summaryEn: 'Best team compositions for NTE launch version. Nanally Genesis team, Xiaozhi Accumulation team, Baicang Blaze team, and F2P budget options.',
  content: '合理的队伍搭配是异环战斗的核心。公测版本属性反应体系以创生、盈蓄、浊燃三大反应为主轴，围绕核心主C构建队伍。本指南基于公测最新节奏榜，推荐当前版本最优阵容搭配。\n\n## 队伍基础框架\n\n异环每队4人，推荐框架为：主C + 副C/聚怪 + 辅助/增益 + 生存位/功能位。核心原则是围绕一个属性反应体系构建，利用环合（Ring Fusion）机制触发双人或三人反应。\n\n关键机制：异能者-零（主角）拥有唯一即瞬环合能力，一个E技能直接满环合，是几乎所有队伍的润滑剂，必练角色。\n\n## 阵容一：娜娜莉创生队（综合最强）\n\n毕业阵容：娜娜莉（限S）+ 九原（常驻S）+ 异能者-零（主角）+ 早雾（常驻S）\n\n| 位置 | 角色 | 属性 | 作用 |\n|------|------|------|------|\n| 主C | 娜娜莉 | 灵 | 创生反应核心输出，数值独一档 |\n| 副C | 九原 | 灵 | 超大范围聚怪，1觉可补奶 |\n| 辅助 | 早雾 | 咒 | 聚怪+加攻，1觉拐力翻倍 |\n| 功能 | 主角 | 光 | 即瞬环合光速启动 |\n\n下位替代：九原可换薄荷、早雾可换阿德勒（套盾+减抗）或哈尼娅（泛用拐）\n\n核心思路：灵+光触发创生反应，主角即瞬环合快速启动。0觉全队无治疗，九原1觉可补奶；生存压力大换阿德勒。1.0下半浔上线后是主角的上位替代。\n\n常驻S自选建议：九原（聚怪+泛用性最高）大于 早雾（辅助核心）大于 其他\n\n## 阵容二：小吱盈蓄队（平民首选）\n\n毕业阵容：小吱（免费满配）+ 九原 + 哈索尔 + 异能者-零\n\n| 位置 | 角色 | 属性 | 作用 |\n|------|------|------|------|\n| 主C | 小吱 | 光 | 都市大亨免费6+5满配，前几版本必练 |\n| 副C | 九原 | 灵 | 聚怪+灵属性反应触发 |\n| 反应位 | 哈索尔 | 相 | 触发盈蓄反应 |\n| 辅助 | 主角 | 光 | 高频环合需求 |\n\n下位替代：哈索尔可换翳、九原可换薄荷、主角可换早雾/阿德勒/哈尼娅\n\n核心思路：光+灵+相三属性触发盈蓄反应，增伤收益远大于纯堆强度。小吱满配后强度超过所有主C，是零氪玩家绝对首选。通过都市大亨（City Tycoon）系统免费获取。\n\n## 阵容三：白藏浊燃队\n\n毕业阵容：白藏（常驻S）+ 早雾 + 达芙蒂尔 + 法蒂娅\n\n| 位置 | 角色 | 属性 | 作用 |\n|------|------|------|------|\n| 主C | 白藏 | 咒 | 浊燃反应核心输出 |\n| 增益 | 早雾 | 咒 | 聚怪+加攻+咒属性共鸣 |\n| 反应位 | 达芙蒂尔 | 暗 | 浊燃必备，不可替代 |\n| 补位 | 法蒂娅 | 魂 | 失谐反应或减伤 |\n\n核心思路：咒+暗浊燃持续伤害，可扩展为咒暗魂三属性失谐反应。刚需达芙蒂尔无替代。注意1.1版本安魂曲上线后可能上位替代白藏。\n\n## 零氪/微氪配队建议\n\n如果你不打算氪金，按以下优先级培养：\n\n1. 小吱 — 都市大亨免费6+5满配，绝对主C\n2. 九原 — 常驻S自选，聚怪+奶妈，泛用性最高\n3. 哈尼娅 — 开服送一只A级辅助，满觉加攻拐\n4. 主角 — 必练，即瞬环合不可替代\n5. 阿德勒 — 最佳免费生存位\n\n推荐平民阵容：小吱 + 九原 + 哈索尔/翳 + 主角\n\n抽卡策略：娜娜莉限S池能抽则抽，抽不到靠小吱队也能通所有内容。\n\n## 属性反应体系速览\n\n| 反应名称 | 属性组合 | 适用队伍 |\n|----------|---------|----------|\n| 创生 | 灵+光 | 娜娜莉队核心 |\n| 盈蓄 | 光+灵+相 | 小吱队核心 |\n| 浊燃 | 咒+暗 | 白藏队核心 |\n| 失谐 | 咒+暗+魂 | 白藏队进阶 |\n| 覆纹 | 咒+灵 | 白藏队替代 |\n\n## 常驻S级自选优先级\n\n九原（聚怪+奶妈，泛用最高）大于 早雾（唯一S级辅助，拐力翻倍）大于 白藏（需特定配队）大于 其余',
  contentEn: 'Proper team composition is the core of NTE combat. The launch version revolves around three major reaction systems built around a core DPS character.\n\n## Team Framework\n\nEach team has 4 members: Main DPS + Sub-DPS/Grouper + Support/Buffer + Survival/Utility. Build around one elemental reaction system and use Ring Fusion to trigger duo or trio reactions.\n\nKey mechanic: The Protagonist (Zero) has unique Instant Ring Fusion - one E skill fills the gauge instantly. Essential for almost all teams. Must-build character.\n\n## Team 1: Nanally Genesis Team (Overall Best)\n\nOptimal Lineup: Nanally (Limited S) + Jiuyuan (Standard S) + Protagonist + Hotori (Standard S)\n\n| Slot | Character | Element | Role |\n|------|-----------|---------|------|\n| Main DPS | Nanally | Anima | Genesis reaction core, unmatched damage |\n| Sub DPS | Jiuyuan | Anima | Huge AoE grouping, 1-awaken off-heal |\n| Support | Hotori | Incantation | Grouping + ATK buff, 1-awaken doubles buff |\n| Utility | Protagonist | Cosmos | Instant Ring Fusion for fast setup |\n\nBudget replacements: Jiuyuan can be replaced by Mint, Hotori by Adler (shield + resist) or Haniel (buffer).\n\nStrategy: Anima + Cosmos triggers Genesis reaction. No healing at 0-awaken; Jiuyuan 1-awaken adds healing. Xun (1.0 Phase 2) is Protagonist upgrade.\n\nStandard S Pick Priority: Jiuyuan (versatility) > Hotori (support) > Others\n\n## Team 2: Xiaozhi Accumulation Team (F2P Best)\n\nOptimal Lineup: Xiaozhi (Free Max) + Jiuyuan + Hathor + Protagonist\n\n| Slot | Character | Element | Role |\n|------|-----------|---------|------|\n| Main DPS | Xiaozhi | Cosmos | Free 6+5 from City Tycoon |\n| Sub DPS | Jiuyuan | Anima | Grouping + reaction trigger |\n| Reaction | Hathor | Lakshana | Triggers Accumulation |\n| Support | Protagonist | Cosmos | High-frequency Ring Fusion |\n\nBudget replacements: Hathor can be replaced by Skia, Jiuyuan by Mint.\n\nStrategy: Cosmos + Anima + Lakshana triggers Accumulation for massive amplification. Xiaozhi at max investment outperforms all DPS.\n\n## Team 3: Baicang Blaze Team\n\nOptimal Lineup: Baicang (Standard S) + Hotori + Daffodil + Fadia\n\nStrategy: Incantation + Chaos triggers Blaze DoT. Daffodil is irreplaceable. Requiem (v1.1) may powercreep Baicang.\n\n## F2P Priority\n\n1. Xiaozhi (free 6+5, absolute main DPS)\n2. Jiuyuan (Standard S pick, grouping + healing)\n3. Haniel (free A-rank buffer)\n4. Protagonist (irreplaceable Instant Ring Fusion)\n5. Adler (best free survival)\n\nRecommended F2P Team: Xiaozhi + Jiuyuan + Hathor/Skia + Protagonist\n\n## Reaction System Overview\n\n| Reaction | Elements | Best Team |\n|----------|----------|------------|\n| Genesis | Anima + Cosmos | Nanally team |\n| Accumulation | Cosmos + Anima + Lakshana | Xiaozhi team |\n| Blaze | Incantation + Chaos | Baicang team |\n| Discord | Incantation + Chaos + Psyche | Baicang advanced |\n\n## Standard S Pick Priority\n\nJiuyuan (versatility) > Hotori (only S-rank support) > Baicang (team-locked) > Others',
  tags: ['队伍', '搭配', '阵容', '配队', 'Team', 'Composition', 'launch'],
  relatedCharacters: ['nanally', 'jiuyuan', 'xiaozhi', 'baicang', 'hotori', 'zero'],
  faq: [
    {
      question: 'What is the best team in NTE launch version?',
      questionZh: '异环公测版本最强配队是什么？',
      answer: 'Nanally Genesis team (Nanally + Jiuyuan + Protagonist + Hotori) is overall the strongest. For F2P players, Xiaozhi Accumulation team (Xiaozhi + Jiuyuan + Hathor + Protagonist) is the best choice.',
      answerZh: '娜娜莉创生队（娜娜莉+九原+主角+早雾）综合最强。零氪玩家推荐小吱盈蓄队（小吱+九原+哈索尔+主角）。'
    },
    {
      question: 'Which standard S character should I pick in NTE?',
      questionZh: '异环常驻S级角色自选选谁？',
      answer: 'Jiuyuan is the best pick with versatile grouping and off-healing at 1-awaken. Hotori is second for irreplaceable support buffs.',
      answerZh: '九原是最优选，超大范围聚怪+1觉客串奶妈，泛用性顶级。早雾第二选，唯一S级辅助。'
    },
    {
      question: 'Is Xiaozhi worth building for F2P players?',
      questionZh: '零氪玩家小吱值得培养吗？',
      answer: 'Absolutely. Xiaozhi is free 6+5 from City Tycoon and at max investment outperforms all DPS. Must-build for F2P.',
      answerZh: '绝对值得。小吱通过都市大亨免费满配6+5，满配后强度超过所有主C，零氪必练。'
    }
  ]
};

fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2));
console.log('Updated team-building guide successfully');
