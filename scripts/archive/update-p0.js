const fs = require('fs');
const basePath = '/Users/robert/Documents/Website/异环/yh-wiki/data';

// ==================== 1. 弧盘系统攻略 ====================
const guides = JSON.parse(fs.readFileSync(`${basePath}/guides.json`, 'utf8'));
const arcGuide = {
  "id": "arc-disc-guide",
  "title": "弧盘系统完全攻略 — S级弧盘获取与搭配推荐",
  "titleEn": "Arc Disc Complete Guide — S-Rank Discs, Acquisition & Best Builds",
  "category": "equipment",
  "categoryZh": "装备系统",
  "categoryEn": "Equipment",
  "summary": "弧盘是异环公测版本最重要的装备系统，战力提升幅度最大。本文详解弧盘获取途径、S级弧盘推荐、弧盘副本攻略和属性选择。",
  "summaryEn": "Arc Discs are the most important equipment system in NTE launch. Complete guide to disc acquisition, S-rank recommendations, dungeon strategies, and stat priorities.",
  "content": "弧盘系统是异环公测版本中战力提升最快的装备系统，每个角色可以装备一个弧盘来获得大量属性加成和特殊效果。以下是完整的弧盘攻略。\n\n## 弧盘是什么？\n\n弧盘（Arc Disc）是一种特殊装备，分为C级、B级、A级和S级四个品质。高品质弧盘提供更高的基础属性和更强的特殊效果。每个角色只能装备一个弧盘，但弧盘的属性可以大幅改变角色的战斗表现。\n\n## 弧盘获取途径\n\n1. **异象挑战**：击败Boss级异象有概率掉落弧盘，其中海囚Boss掉落S级弧盘概率最高\n2. **弧盘副本（高塔）**：专属弧盘挑战副本，C级弧盘稳定获取\n3. **商店兑换**：使用驱动块+卡带在空幕装置商店兑换\n4. **异象收容奖励**：完成斑蝶等异象收容任务获得\n5. **活动奖励**：公测活动赠送A级弧盘\n\n## S级弧盘推荐\n\n| 弧盘名 | 适用角色类型 | 核心效果 |\n|--------|------------|----------|\n| 金色攻击弧盘 | 主C输出 | 攻击力+暴击率大幅提升 |\n| 金色辅助弧盘 | 增益辅助 | 能量回复+效果持续时间延长 |\n| 金色防御弧盘 | 生存防御 | 伤害减免+护盾效果增强 |\n| 金色治疗弧盘 | 治疗支援 | 治疗量+额外回复效果 |\n\n## 弧盘属性选择\n\n输出角色优先：暴击率 > 暴击伤害 > 攻击力% > 属性伤害\n辅助角色优先：能量回复 > 效果命中 > 生命值% > 防御力%\n\n## 弧盘强化\n\n使用相同品质的弧盘作为强化材料。建议优先强化S级弧盘到满级，A级弧盘作为过渡。C级和B级弧盘仅作为强化材料使用。\n\n## 弧盘搭配推荐\n\n根据角色定位选择对应弧盘：\n- 娜娜莉：金色攻击弧盘 + 暴击/攻击副属性\n- 九原：金色辅助弧盘 + 能量回复副属性\n- 白藏：金色防御弧盘 + 防御/生命副属性\n- 哈尼尔：金色辅助弧盘 + 效果命中副属性",
  "contentEn": "Arc Discs are the most impactful equipment system in NTE launch. This guide covers disc acquisition, S-rank recommendations, dungeon strategies, and stat priorities.\n\n## What are Arc Discs?\n\nArc Discs are special equipment items ranked C, B, A, and S. Higher quality discs provide better base stats and stronger effects. Each character equips one disc.\n\n## How to Get Arc Discs\n\n1. **Boss Anomaly drops** — Sea Prisoner has highest S-rank drop rate\n2. **Tower dungeon** — Dedicated disc challenge, guaranteed C-rank\n3. **Shop exchange** — Trade drive blocks + cassettes\n4. **Anomaly containment rewards** — From Spotted Butterfly and other bosses\n5. **Event rewards** — Launch events give A-rank discs\n\n## S-Rank Disc Recommendations\n\n- **Golden ATK Disc**: DPS characters — Crit Rate + Crit DMG\n- **Golden Support Disc**: Buffers — Energy Regen + Effect Duration\n- **Golden DEF Disc**: Tanks — DMG Reduction + Shield Strength\n- **Golden Heal Disc**: Healers — Heal Bonus + Additional Recovery\n\n## Stat Priority\n\nDPS: Crit Rate > Crit DMG > ATK% > Elemental DMG\nSupport: Energy Regen > Effect Hit > HP% > DEF%",
  "tags": ["弧盘", "装备", "攻略", "Arc Disc", "Equipment"],
  "relatedCharacters": [],
  "relatedLocations": [],
  "relatedLore": [],
  "faq": [
    {
      "question": "How to get S-rank Arc Discs in NTE?",
      "questionZh": "异环S级弧盘怎么获得？",
      "answer": "S-rank Arc Discs drop from high-level Boss anomalies, especially Sea Prisoner. You can also get them from Tower dungeons at higher difficulty levels.",
      "answerZh": "S级弧盘主要通过击败高级Boss异象获得，海囚Boss掉落概率最高。高级弧盘副本也有概率产出S级弧盘。"
    }
  ]
};

// Check if arc-disc-guide already exists
if (!guides.find(g => g.id === 'arc-disc-guide')) {
  guides.push(arcGuide);
  console.log('Added arc-disc-guide to guides.json');
} else {
  console.log('arc-disc-guide already exists');
}

// ==================== 2-4. 新FAQ ====================
const faqs = JSON.parse(fs.readFileSync(`${basePath}/faqs.json`, 'utf8'));

const newFaqs = [
  {
    "id": "starter-s-rank-selector",
    "question": "异环自选S角色选谁？新手自选S推荐",
    "questionEn": "Which S-rank character should I pick from the selector in NTE?",
    "answer": "新手自选S角色推荐顺序：1) 薄荷（Mint）— 开服最强免费奶妈，几乎必选，创生队/浊燃队都适用；2) 早雾（Hotori）— 聚怪+增伤辅助，如果你打算抽娜娜莉，早雾是最佳搭档；3) 九原（Jiuyuan）— 常驻池可歪，不建议用自选券选。常驻五星整体优先级：薄荷 > 早雾 > 白藏 > 达芙迪尔。结论：90%的新手应该选薄荷，她是最通用的S级角色。",
    "answerEn": "Starter S-rank selector recommendation: 1) Mint — Best free healer, fits almost every team; 2) Hotori — Grouping + ATK buffer, best paired with Nanally; 3) Jiuyuan — Available from standard banner, don't waste selector. Overall priority: Mint > Hotori > Baicang > Daffodil. Conclusion: 90% of new players should pick Mint.",
    "tags": ["beginner", "characters", "selector"],
    "category": "characters",
    "categoryZh": "角色相关",
    "categoryEn": "Characters",
    "relatedCharacters": ["mint", "hotori", "jiuyuan", "baicang"],
    "relatedMaterials": []
  },
  {
    "id": "free-pulls-total",
    "question": "异环公测免费可以抽多少次？470抽怎么拿到？",
    "questionEn": "How many free pulls can you get in NTE launch? How to get 470 pulls?",
    "answer": "公测版本全平台可获取约418-470抽（含预注册奖励、公测活动、主线奖励、成就奖励等）。注意：470抽需要完成大量游戏进度才能全部拿到，实际首日可获取约150-200抽。获取途径：1) 预注册奖励：约80抽；2) 公测登录活动：14天签到约42抽；3) 主线任务推进：约100抽；4) 探索度/成就：约50抽；5) 异象收容/挑战：约30抽；6) 新手福利/教程：约50抽。零氪玩家建议优先推进主线拿抽卡资源。",
    "answerEn": "Total free pulls in launch version: ~418-470 (including pre-registration, events, story, achievements). Note: 470 pulls require significant game progress. Realistic Day 1 pulls: ~150-200. Sources: Pre-registration (~80), 14-day login (~42), Story quests (~100), Exploration/Achievements (~50), Anomaly challenges (~30), Tutorial bonuses (~50). F2P players should prioritize story progression for gacha currency.",
    "tags": ["beginner", "gacha", "currency", "f2p"],
    "category": "gacha",
    "categoryZh": "抽卡系统",
    "categoryEn": "Gacha",
    "relatedCharacters": [],
    "relatedMaterials": []
  },
  {
    "id": "stamina-planning",
    "question": "异环体力怎么分配？零氪开荒体力规划",
    "questionEn": "How to spend stamina in NTE? F2P stamina planning guide",
    "answer": "前期体力分配建议：1-30级：全部投入主线和角色升级材料副本；30-45级：70%角色升级材料 + 30%武器强化材料；45级后：优先弧盘副本 > 技能升级材料 > 武器材料。关键原则：1) 不要平均分配，集中培养2个主力角色；2) 每天先用完体力再下线；3) 优先刷当前卡关需要的材料；4) 弧盘副本收益最高，解锁后优先投入。零氪玩家不要浪费体力在低级副本，直接打能打的最高难度。",
    "answerEn": "Early stamina planning: Lv1-30: All on story + character leveling materials; Lv30-45: 70% character materials + 30% weapon materials; Lv45+: Arc Disc dungeons > Skill materials > Weapon materials. Key tips: 1) Focus on 2 main characters; 2) Use all daily stamina; 3) Prioritize bottleneck materials; 4) Arc Disc dungeons have highest ROI.",
    "tags": ["beginner", "stamina", "f2p", "planning"],
    "category": "beginner",
    "categoryZh": "新手入门",
    "categoryEn": "Beginner",
    "relatedCharacters": [],
    "relatedMaterials": []
  },
  {
    "id": "ring-fusion-mechanics",
    "question": "异环环合反应怎么触发？属性反应机制详解",
    "questionEn": "How do Ring Fusion reactions work in NTE? Elemental reaction guide",
    "answer": "环合反应是异环的核心战斗系统，通过两种不同属性的角色配合触发。游戏共有6种属性：光、灵、相、暗、魂、咒，可触发8种环合反应：\n\n**永动循环线（光属性核心）**：\n- 创生（光+灵）：召唤持续存在的召唤花，触发盈蓄效果持续回复大招能量\n- 延滞（光+相）：强力控怪效果，减速/限制敌人行动\n\n**破盾爆发线（暗属性核心）**：\n- 浊燃（暗+咒）：给敌人挂上点燃状态\n- 黯星（暗+魂）：触发一次性高额爆发伤害\n- 失谐（点燃+爆发）：核心破盾反应\n\n**伤害提升线**：\n- 覆纹（灵+咒）：给敌人挂上易伤debuff\n- 浸染（相+魂）：持续类增伤效果\n\n此外还有2种三属性反应需要三种不同属性角色同时在场。建议新手优先掌握创生和浊燃两条核心反应线。",
    "answerEn": "Ring Fusion is NTE's core combat system, triggered by combining two different attributes. 6 attributes (Light, Spirit, Phase, Dark, Soul, Curse) create 8 reactions:\n\n**Sustain Line (Light core)**: Genesis (Light+Spirit) summons flowers for energy regen; Delay (Light+Phase) slows/CC enemies.\n\n**Shield-break Line (Dark core)**: Turbid Burn (Dark+Curse) applies Ignite; Dark Star (Dark+Soul) burst damage; Disharmony (Ignite+Burst) breaks shields.\n\n**Damage Boost Line**: Overlay (Spirit+Curse) adds vulnerability; Infiltration (Phase+Soul) sustained damage boost.\n\nPlus 2 triple-attribute reactions. Beginners should prioritize Genesis and Turbid Burn lines.",
    "tags": ["combat", "ring-fusion", "mechanics", "beginner"],
    "category": "combat",
    "categoryZh": "战斗机制",
    "categoryEn": "Combat",
    "relatedCharacters": [],
    "relatedMaterials": []
  },
  {
    "id": "arc-disc-faq",
    "question": "异环弧盘系统怎么玩？弧盘获取和强化攻略",
    "questionEn": "How does the Arc Disc system work in NTE? Disc acquisition and upgrade guide",
    "answer": "弧盘是异环公测版本最重要的装备系统，战力提升幅度最大。弧盘分C/B/A/S四个品质，每个角色装备一个。获取途径：1) 击败Boss异象掉落（海囚S级概率最高）；2) 弧盘副本（高塔）挑战；3) 空幕装置商店兑换；4) 异象收容任务奖励；5) 公测活动赠送A级弧盘。强化建议：优先强化S级弧盘到满级，A级作为过渡，C/B级仅做材料。输出角色选暴击率/暴击伤害/攻击力%副属性，辅助角色选能量回复/效果命中/生命值%副属性。",
    "answerEn": "Arc Discs are NTE's most important equipment system. Ranked C/B/A/S, each character equips one. Sources: 1) Boss anomaly drops (Sea Prisoner best for S-rank); 2) Tower dungeon; 3) Shop exchange; 4) Anomaly containment rewards; 5) Event rewards. Upgrade S-rank discs first, A-rank as transition. DPS: Crit/CritDMG/ATK% subs; Support: EnergyRegen/EffectHit/HP% subs.",
    "tags": ["equipment", "arc-disc", "beginner"],
    "category": "equipment",
    "categoryZh": "装备系统",
    "categoryEn": "Equipment",
    "relatedCharacters": [],
    "relatedMaterials": []
  },
  {
    "id": "f2p-beginner-route",
    "question": "异环零氪新手怎么开荒？第一天必做清单",
    "questionEn": "NTE F2P beginner guide: Day 1 must-do checklist",
    "answer": "零氪新手第一天开荒路线：1) 完成全部教程关卡（约30分钟）；2) 推进主线到第三章（获取大量抽卡资源）；3) 使用新手池抽卡，利用6选1自选S级角色（推荐薄荷）；4) 集中资源培养主力队伍（1主C+1辅助+1生存）；5) 解锁所有已探索区域的传送点；6) 完成每日委托；7) 参与公测登录活动领14天签到奖励；8) 兑换3个公测兑换码；9) 不要分散培养，先确定2个核心角色集中投入。零氪玩家约可获得150-200抽，足够组建一支强力队伍。",
    "answerEn": "F2P Day 1 checklist: 1) Complete all tutorials (~30min); 2) Progress story to Chapter 3 (lots of gacha currency); 3) Use beginner banner 6-choose-1 (pick Mint); 4) Focus resources on 1 DPS + 1 Support + 1 Survival; 5) Unlock all discovered teleport points; 6) Complete daily commissions; 7) Claim 14-day login event rewards; 8) Redeem 3 launch codes; 9) Don't spread resources — focus on 2 core characters. F2P can get ~150-200 pulls for a strong team.",
    "tags": ["beginner", "f2p", "day-one", "planning"],
    "category": "beginner",
    "categoryZh": "新手入门",
    "categoryEn": "Beginner",
    "relatedCharacters": ["mint"],
    "relatedMaterials": []
  },
  {
    "id": "ue5-7-engine-update",
    "question": "异环公测引擎升级到UE5.7了吗？有什么变化？",
    "questionEn": "Did NTE upgrade to UE5.7 at launch? What changed?",
    "answer": "是的，异环公测版本从测试阶段的UE5.5升级到了UE5.7。主要变化：1) 画面表现力提升，光影和反射效果更精细；2) 移动端优化改进，但高画质下发热仍然明显；3) 加载速度改善，尤其NVMe SSD用户感受明显；4) 面部表情系统全面改进（公测前后对比差异大）；5) 新增第一人称模式（全球服确认）。UE5.7引擎对硬件要求与之前基本持平，不需要额外升级配置。",
    "answerEn": "Yes, NTE launched on UE5.7 (upgraded from UE5.5 beta). Key changes: 1) Improved visuals with better lighting and reflections; 2) Mobile optimization improved but high settings still cause heating; 3) Faster loading especially on NVMe SSD; 4) Facial expression system overhaul; 5) First-person mode added (confirmed for global). Hardware requirements remain similar to before.",
    "tags": ["technical", "engine", "update"],
    "category": "platform",
    "categoryZh": "平台相关",
    "categoryEn": "Platform",
    "relatedCharacters": [],
    "relatedMaterials": []
  },
  {
    "id": "character-build-priority",
    "question": "异环角色培养优先级是什么？先升谁？",
    "questionEn": "What is the character leveling priority in NTE? Who to build first?",
    "answer": "角色培养优先级建议：第一优先级（必练）：主力输出角色等级+武器 → 等级拉满到当前上限。第二优先级（尽快升）：辅助角色的关键技能等级（影响增益数值）。第三优先级（中期补齐）：生存位角色的防御和生命属性。具体角色优先级：1) 娜娜莉/达芙迪尔（主C，全力投入）；2) 九原/薄荷（辅助核心，技能等级重要）；3) 白藏/阿德勒（生存位，40级够用）；4) 其他A/B级角色按需培养。切记不要平均分配资源，集中投入2-3个核心角色。",
    "answerEn": "Character build priority: 1st priority (must-build): Main DPS level + weapon to max. 2nd: Support key skill levels. 3rd: Survival role DEF/HP. Specific priority: 1) Nanally/Daffodil (main DPS, full investment); 2) Jiuyuan/Mint (core supports, skill levels matter); 3) Baicang/Adler (survival, Lv40 sufficient); 4) Other A/B-ranks as needed. Never spread resources evenly — focus on 2-3 core characters.",
    "tags": ["beginner", "characters", "leveling", "priority"],
    "category": "leveling",
    "categoryZh": "角色升级",
    "categoryEn": "Leveling",
    "relatedCharacters": ["nanally", "daffodil", "jiuyuan", "mint"],
    "relatedMaterials": []
  }
];

faqs.push(...newFaqs);
console.log(`Added ${newFaqs.length} FAQs. Total: ${faqs.length}`);

// ==================== 5. S级角色Build ====================
const builds = JSON.parse(fs.readFileSync(`${basePath}/builds.json`, 'utf8'));

const newBuilds = [
  {
    "characterId": "lilina",
    "builds": [{
      "id": "lilina-dps",
      "name": "暗属性主C输出流",
      "nameEn": "Dark DPS Build",
      "description": "利用浊燃反应的暗属性主C，搭配翳触发黯星爆发",
      "descriptionEn": "Dark attribute DPS leveraging Turbid Burn reactions, paired with Skia for Dark Star bursts",
      "mainStat": "攻击力%",
      "mainStatEn": "ATK%",
      "subStats": ["暴击率", "暴击伤害", "攻击力%", "属性伤害"],
      "subStatsEn": ["Crit Rate", "Crit DMG", "ATK%", "Elemental DMG"],
      "recommendedWeapons": ["void-scythe"],
      "teamComp": ["skia", "adler"],
      "notes": "浊燃队核心输出，翳提供浊燃前置，阿德勒破盾触发失谐。0觉即可胜任主C。",
      "notesEn": "Turbid Burn team core DPS. Skia provides Turbid Burn setup, Adler breaks shields for Disharmony. Viable at 0-awaken."
    }]
  },
  {
    "characterId": "black-bird",
    "builds": [{
      "id": "blackbird-dps",
      "name": "混沌属性速切输出",
      "nameEn": "Chaos Quick-Swap DPS",
      "description": "高频切换触发连携技的混沌属性速切输出",
      "descriptionEn": "Chaos attribute quick-swap DPS triggering chain attacks on character switch",
      "mainStat": "暴击伤害",
      "mainStatEn": "Crit DMG",
      "subStats": ["暴击率", "攻击力%", "充能效率", "属性伤害"],
      "subStatsEn": ["Crit Rate", "ATK%", "Energy Regen", "Elemental DMG"],
      "recommendedWeapons": ["chain-scythe"],
      "teamComp": ["zero", "sakiri"],
      "notes": "速切队核心，利用切换角色触发连携技打出高频伤害。需要高充能保证循环。",
      "notesEn": "Quick-swap team core. Uses character switch chain attacks for high-frequency damage. Needs high Energy Regen for rotation."
    }]
  },
  {
    "characterId": "xiaozhen",
    "builds": [{
      "id": "xiaozhen-dps",
      "name": "物理格斗爆发流",
      "nameEn": "Physical Fighting Burst Build",
      "description": "以蓄力重击为核心的高爆发物理输出",
      "descriptionEn": "High-burst physical DPS focused on charged heavy attacks",
      "mainStat": "攻击力%",
      "mainStatEn": "ATK%",
      "subStats": ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      "subStatsEn": ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      "recommendedWeapons": ["magnet-gauntlets"],
      "teamComp": ["baicang", "mint"],
      "notes": "蓄力重击伤害极高但需要安全输出环境，白藏提供护盾+薄荷治疗保生存。适合有一定操作基础的玩家。",
      "notesEn": "Charged attacks deal massive damage but need safe windows. Baicang shields + Mint healing for survivability. Best for players comfortable with mechanics."
    }]
  },
  {
    "characterId": "akane",
    "builds": [{
      "id": "akane-dps",
      "name": "灼烧反应主C流",
      "nameEn": "Blaze Reaction DPS Build",
      "description": "炽焰之心套装核心灼烧主C，搭配创生/浊燃反应提升伤害",
      "descriptionEn": "Blazing Heart set core DPS using burn reactions with Genesis/Turbid Burn synergy",
      "mainStat": "攻击力%",
      "mainStatEn": "ATK%",
      "subStats": ["暴击率", "暴击伤害", "攻击力%", "属性伤害"],
      "subStatsEn": ["Crit Rate", "Crit DMG", "ATK%", "Elemental DMG"],
      "recommendedWeapons": ["sonic-guitar"],
      "teamComp": ["jiuyuan", "haniel"],
      "notes": "灼烧队核心输出，炽焰之心4件套配合必杀技暴击率加成。九原聚怪+哈尼尔增伤打出高额AOE。",
      "notesEn": "Burn team core DPS. Blazing Heart 4pc + ultimate Crit Rate bonus. Jiuyuan groups + Haniel ATK buff for massive AOE."
    }]
  },
  {
    "characterId": "illica",
    "builds": [{
      "id": "illica-dps",
      "name": "狂战士暴击流",
      "nameEn": "Berserker Crit Build",
      "description": "利用狂战士之怒套装的暴击机制打出高频暴击",
      "descriptionEn": "High Crit frequency build using Berserker's Fury set mechanics",
      "mainStat": "暴击伤害",
      "mainStatEn": "Crit DMG",
      "subStats": ["暴击率", "攻击力%", "暴击伤害", "充能效率"],
      "subStatsEn": ["Crit Rate", "ATK%", "Crit DMG", "Energy Regen"],
      "recommendedWeapons": ["plasma-cannon"],
      "teamComp": ["hotori", "mint"],
      "notes": "狂战士之怒4件套核心使用者，暴击率50%以下获得额外暴击率加成，50%以上获得暴击伤害加成，无论哪种都强力。",
      "notesEn": "Core user of Berserker's Fury 4pc. Below 50% Crit Rate gains extra rate, above 50% gains extra Crit DMG. Strong either way."
    }]
  },
  {
    "characterId": "crow",
    "builds": [{
      "id": "crow-dps",
      "name": "裂空高速输出流",
      "nameEn": "Skyrending High-Speed DPS",
      "description": "利用裂空之牙套装的属性反应增伤打出高频属性伤害",
      "descriptionEn": "High-frequency elemental damage using Skyrending Fang reaction bonus",
      "mainStat": "属性伤害",
      "mainStatEn": "Elemental DMG",
      "subStats": ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      "subStatsEn": ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      "recommendedWeapons": ["spirit-bow"],
      "teamComp": ["zero", "daffodil"],
      "notes": "裂空之牙4件套反应增伤核心，搭配零和达芙迪尔触发高频属性反应。建议保证暴击率60%以上。",
      "notesEn": "Skyrending Fang 4pc reaction bonus core. Paired with Zero and Daffodil for high-frequency reactions. Aim for 60%+ Crit Rate."
    }]
  },
  {
    "characterId": "marina",
    "builds": [{
      "id": "marina-dps",
      "name": "裂空反应输出流",
      "nameEn": "Skyrending Reaction DPS",
      "description": "裂空之牙反应增伤的通用属性输出角色",
      "descriptionEn": "General elemental DPS using Skyrending Fang reaction damage bonus",
      "mainStat": "攻击力%",
      "mainStatEn": "ATK%",
      "subStats": ["暴击率", "暴击伤害", "属性伤害", "攻击力%"],
      "subStatsEn": ["Crit Rate", "Crit DMG", "Elemental DMG", "ATK%"],
      "recommendedWeapons": ["frost-fan"],
      "teamComp": ["skia", "mint"],
      "notes": "通用输出角色，裂空之牙4件套配合属性反应增伤。翳提供浊燃前置，薄荷保证生存。适合作为副C使用。",
      "notesEn": "Versatile DPS with Skyrending Fang 4pc reaction bonus. Skia provides Turbid Burn setup, Mint for sustain. Good as sub-DPS."
    }]
  },
  {
    "characterId": "sylphy",
    "builds": [{
      "id": "sylphy-support",
      "name": "回响充能辅助流",
      "nameEn": "Resonance Energy Support",
      "description": "利用回响之潮的充能加成为全队提供能量回复",
      "descriptionEn": "Energy support using Resonance Tide set to provide team-wide energy regen",
      "mainStat": "能量回复效率",
      "mainStatEn": "Energy Regen",
      "subStats": ["能量回复效率", "生命值%", "效果命中", "充能效率"],
      "subStatsEn": ["Energy Regen", "HP%", "Effect Hit", "Energy Regen"],
      "recommendedWeapons": ["soul-lantern"],
      "teamComp": ["nanally", "jiuyuan"],
      "notes": "回响之潮4件套核心辅助，施放必杀技后全队回复15能量。搭配高能量消耗的主C（如娜娜莉）效果最佳。",
      "notesEn": "Core Resonance Tide 4pc support. Ultimate restores 15 Energy to full team. Best with high-cost ult characters like Nanally."
    }]
  }
];

builds.push(...newBuilds);
console.log(`Added ${newBuilds.length} builds. Total: ${builds.length}`);

// ==================== Write all files ====================
fs.writeFileSync(`${basePath}/guides.json`, JSON.stringify(guides, null, 2), 'utf8');
fs.writeFileSync(`${basePath}/faqs.json`, JSON.stringify(faqs, null, 2), 'utf8');
fs.writeFileSync(`${basePath}/builds.json`, JSON.stringify(builds, null, 2), 'utf8');

console.log('All P0 data written successfully.');
console.log(`Guides: ${guides.length}, FAQs: ${faqs.length}, Builds: ${builds.length}`);
