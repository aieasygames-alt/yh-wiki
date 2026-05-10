# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('data/faqs.json', 'r', encoding='utf-8') as f:
    faqs = json.load(f)

new_faqs = [
    {
        "id": "hotori-character-guide",
        "question": "异环星鸟（Hotori）是谁？角色介绍与技能详解",
        "questionEn": "Who is Hotori in NTE? Character guide and skills overview",
        "seoTitleZh": "异环星鸟Hotori角色攻略 — 技能、配装与配队推荐",
        "seoTitleEn": "NTE Hotori Character Guide — Skills, Best Build & Team Comps",
        "seoDescriptionZh": "异环星鸟（Hotori）角色详细介绍，包含技能机制、属性定位、最佳碟片搭配和推荐配队。",
        "seoDescriptionEn": "Complete Hotori character guide for NTE: skills, attributes, best disc builds, and recommended team compositions.",
        "answer": "星鸟（Hotori）是异环公测版本中备受关注的一位角色，以其独特的战斗风格和精美的角色设计受到玩家喜爱。\n\n角色定位：\n- 稀有度：S级\n- 属性：待确认（预计为咒术属性）\n- 武器类型：待确认\n- 定位：输出型角色，具备较强的单体和群体伤害能力\n\n技能特点：\n- 普通攻击：多段连击，最后一段附带属性效果\n- 核心技能：释放后进入强化状态，攻击力和攻速大幅提升\n- 终结技：大范围属性爆发，对周围敌人造成高额伤害\n- 被动：队友触发特定条件时获得额外增益\n\n获取方式：\n可通过限定卡池抽取获得。建议关注官方公告了解卡池开放时间。\n\n推荐碟片搭配：根据属性选择对应4件套，暴击率和暴击伤害优先。\n\n推荐配队：与增伤辅助（如早雾）和治疗（如九原/埃德嘉）搭配效果最佳。",
        "answerEn": "Hotori is one of the most popular characters in NTE, known for her unique combat style and stunning character design.\n\nCharacter Profile:\n- Rarity: S-Rank\n- Attribute: TBA (expected Incantation)\n- Weapon Type: TBA\n- Role: DPS with strong single-target and AoE damage capabilities\n\nSkill Highlights:\n- Normal Attack: Multi-hit combo, final hit applies attribute effect\n- Core Skill: Enters enhanced state with大幅 ATK and attack speed boost\n- Finisher: Large-range attribute burst dealing massive AoE damage\n- Passive: Grants bonus buffs when teammates trigger specific conditions\n\nHow to Obtain:\nAvailable through limited character banners. Check official announcements for banner schedules.\n\nRecommended Discs: Corresponding attribute 4-piece set, prioritize Crit Rate and Crit DMG.\n\nRecommended Teams: Pairs best with damage buffers (like Hayate) and healers (like Jiuyuan/Edgar).",
        "tags": ["hotori", "character", "guide", "s-rank"],
        "category": "characters",
        "categoryZh": "角色",
        "categoryEn": "Characters",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-mammon-guide",
        "question": "异环玛门（Mammon）是什么？Boss攻略与奖励",
        "questionEn": "What is Mammon in NTE? Boss guide and rewards",
        "seoTitleZh": "异环玛门Boss攻略 — Mammon打法技巧与掉落奖励",
        "seoTitleEn": "NTE Mammon Boss Guide — Strategy, Tips & Drop Rewards",
        "seoDescriptionZh": "异环玛门（Mammon）Boss完整攻略：出现位置、技能机制、推荐配队、掉落物品和成就解锁。",
        "seoDescriptionEn": "Complete NTE Mammon boss guide: location, mechanics, recommended teams, drop items, and achievement unlock.",
        "answer": "玛门（Mammon）是异环中的一个强力世界Boss，以贪婪之神的形象出现，是获取高级材料的重要来源。\n\nBoss位置：\n在开放世界的商业区/金融区域附近刷新，属于周期性世界Boss。\n\n技能机制：\n1) 金币风暴 — 向周围释放大量金币弹幕，造成范围伤害\n2) 贪婪之手 — 抓取最近的角色并造成持续伤害，需要队友攻击打破\n3) 金库屏障 — 生成护盾吸收伤害，需要使用特定属性攻击快速破盾\n4) 贪欲爆发（低血量触发）— 全屏大招，伤害极高，建议在触发前集火击杀\n\n推荐配队：\n- 主C选择高爆发角色（娜娜莉/零）\n- 搭配破盾工具人（对应克制属性角色）\n- 带上治疗/护盾角色保生存\n\n掉落奖励：\n- 神谕石（Oracle Stone）\n- 大量信用点\n- 稀有碟片\n- 限定称号「贪婪征服者」\n\n建议等级40+挑战，每日可挑战1次获取奖励。",
        "answerEn": "Mammon is a powerful World Boss in NTE, appearing as the God of Greed, and is an important source of high-level materials.\n\nBoss Location:\nSpawns near the Commercial/Financial District in the open world. Periodic world boss.\n\nMechanics:\n1) Coin Storm — Releases coin barrage dealing AoE damage\n2) Greedy Hand — Grabs nearest character for持续 damage; teammates must attack to break free\n3) Vault Shield — Generates shield; requires specific attribute attacks to break quickly\n4) Greed Burst (low HP trigger) — Screen-wide ultimate with extreme damage; focus fire to kill before trigger\n\nRecommended Team:\n- Main DPS with high burst (Nanally/Zero)\n- Shield-breaker with counter attribute\n- Healer/Shielder for sustain\n\nDrop Rewards:\n- Oracle Stones\n- Large amount of Credits\n- Rare Discs\n- Exclusive title \"Greed Conqueror\"\n\nRecommended level 40+. Can challenge once daily for rewards.",
        "tags": ["mammon", "boss", "guide", "world-boss"],
        "category": "boss",
        "categoryZh": "Boss",
        "categoryEn": "Boss",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-akane-character-guide",
        "question": "异环赤音（Akane）是谁？角色介绍与获取方式",
        "questionEn": "Who is Akane in NTE? Character overview and how to get",
        "seoTitleZh": "异环赤音Akane角色攻略 — 技能、定位与获取方法",
        "seoTitleEn": "NTE Akane Character Guide — Skills, Role & How to Get",
        "seoDescriptionZh": "异环赤音（Akane）角色详细介绍，包含技能机制、属性定位、获取方式和推荐配队。",
        "seoDescriptionEn": "Complete Akane character guide: skills, attribute, role, how to obtain, and recommended team comps.",
        "answer": "赤音（Akane）是异环中的一位可玩角色，以其独特的战斗风格和角色设计受到玩家关注。\n\n角色信息：\n- 定位：输出/副C\n- 属性：待确认\n- 特点：高机动性，擅长快速切换和连招输出\n\n技能概述：\n- 普通攻击具有多段连击效果\n- 核心技能可以快速位移并对路径上的敌人造成伤害\n- 终结技为高伤害单体爆发\n- 被动技能在切换角色时提供额外增益\n\n获取方式：\n通过常驻卡池或限定卡池抽取获得。关注官方公告了解具体卡池安排。\n\n推荐碟片：\n根据属性选择对应4件套，副词条优先暴击率和攻击力%。\n\n推荐配队：\n适合作为快切队伍中的副C，配合主C（如娜娜莉）和增伤辅助使用。",
        "answerEn": "Akane is a playable character in NTE known for her unique combat style and character design.\n\nCharacter Info:\n- Role: DPS / Sub-DPS\n- Attribute: TBA\n- Specialty: High mobility, excels at quick-swap combos\n\nSkill Overview:\n- Normal attack features multi-hit combos\n- Core skill enables quick dashes dealing damage along the path\n- Finisher is a high-damage single-target burst\n- Passive provides bonus buffs on character switch\n\nHow to Obtain:\nAvailable through standard or limited banners. Check official announcements for banner schedules.\n\nRecommended Discs:\nCorresponding attribute 4-piece set, sub-stats prioritize Crit Rate and ATK%.\n\nRecommended Teams:\nIdeal as sub-DPS in quick-swap teams, paired with main DPS (like Nanally) and damage buffers.",
        "tags": ["akane", "character", "guide"],
        "category": "characters",
        "categoryZh": "角色",
        "categoryEn": "Characters",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-city-stamina-guide",
        "question": "异环体力（City Stamina）怎么恢复？体力系统详解",
        "questionEn": "How does stamina work in NTE? City Stamina recovery guide",
        "seoTitleZh": "异环体力系统攻略 — City Stamina恢复方法与最佳使用规划",
        "seoTitleEn": "NTE Stamina System Guide — Recovery Methods & Optimal Usage Plan",
        "seoDescriptionZh": "异环体力（City Stamina）完全攻略：恢复方法、自然恢复速度、体力药水获取、每日最佳体力使用规划。",
        "seoDescriptionEn": "Complete NTE stamina guide: recovery methods, natural regen rate, stamina potions, and optimal daily usage planning.",
        "answer": "异环的体力系统（City Stamina）是限制每日游戏进度的核心机制，合理规划体力使用非常重要。\n\n体力恢复方式：\n1) 自然恢复：每8分钟恢复1点体力，每天自然恢复约180点\n2) 体力药水：使用体力恢复药剂，可通过活动、任务、商店获取\n3) 每日签到：部分签到奖励包含体力药水\n4) 每日固定时间恢复：通常在12:00和18:00各赠送60体力\n5) 升级回复：角色等级提升时恢复部分体力\n\n体力使用优先级：\n1) 每日材料副本（优先刷当前最缺的材料）\n2) 经验副本（角色升级材料）\n3) 碟片副本（装备强化材料）\n4) 信用点副本（缺钱时再刷）\n\n省钱技巧：\n- 体力药水尽量留到高等级副本再用，收益更大\n- 不要让体力溢出浪费，溢出的体力不会继续累积\n- 周末双倍掉落活动优先投入体力\n\n体力上限随冒险等级提升而增加，初始约120点，满级约180点。",
        "answerEn": "NTE's stamina system (City Stamina) is the core mechanic that limits daily progression. Planning your stamina usage is crucial.\n\nStamina Recovery Methods:\n1) Natural Regen: 1 stamina per 8 minutes, ~180 per day\n2) Stamina Potions: Use recovery items from events, quests, or shops\n3) Daily Login: Some login rewards include stamina potions\n4) Timed Recovery: Typically 60 free stamina at 12:00 and 18:00 daily\n5) Level Up: Character level ups restore some stamina\n\nUsage Priority:\n1) Material domains (farm what you need most)\n2) EXP domains (character leveling materials)\n3) Disc domains (equipment enhancement materials)\n4) Credit domains (only when short on Credits)\n\nPro Tips:\n- Save stamina potions for higher-level domains for better ROI\n- Don't let stamina overflow — excess stamina is wasted\n- Prioritize stamina during weekend double-drop events\n\nStamina cap increases with Adventure Level: starts at ~120, maxes at ~180.",
        "tags": ["stamina", "guide", "beginner", "system"],
        "category": "system",
        "categoryZh": "系统",
        "categoryEn": "System",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-elements-attributes-guide",
        "question": "异环有哪些属性/元素？属性克制系统详解",
        "questionEn": "What are the elements/attributes in NTE? Element counter system guide",
        "seoTitleZh": "异环属性元素系统攻略 — 全属性克制关系与机制详解",
        "seoTitleEn": "NTE Elements & Attributes Guide — All Element Interactions & Counter System",
        "seoDescriptionZh": "异环全属性元素系统详解：创生、咒术、燃灼等属性克制关系、反应机制、组队属性搭配建议。",
        "seoDescriptionEn": "Complete NTE element system guide: Anima, Incantation, Burn, and other attribute counters, reactions, and team synergy tips.",
        "answer": "异环中存在多种属性/元素系统，属性克制和搭配是战斗的核心机制之一。\n\n主要属性类型：\n1) 创生（Anima）— 生命与创造之力，克制虚无属性\n2) 咒术（Incantation）— 神秘魔法力量，克制物理属性\n3) 燃灼（Burn）— 火焰属性，克制冰霜属性\n4) 冰霜（Frost）— 冰冻属性，克制燃灼\n5) 物理（Physical）— 纯物理伤害，克制咒术\n6) 虚无（Void）— 暗影力量，克制创生\n\n属性克制效果：\n- 克制属性对被克制属性造成额外30%伤害\n- 被克制属性对克制方减少20%伤害\n- 同属性角色在同一队伍中可触发属性共鸣\n\n属性共鸣效果：\n- 2名同属性角色：属性伤害+15%\n- 3名同属性角色：额外获得团队增益效果\n\n组队建议：\n- 队伍中至少包含2名同属性角色触发共鸣\n- 根据敌人属性灵活调整克制角色\n- 不要全队同一属性，保持灵活性应对不同敌人",
        "answerEn": "NTE features a multi-element/attribute system where attribute counters and synergy are core to combat.\n\nMain Attributes:\n1) Anima — Force of life and creation, counters Void\n2) Incantation — Mystical magic, counters Physical\n3) Burn — Fire attribute, counters Frost\n4) Frost — Ice attribute, counters Burn\n5) Physical — Pure physical damage, counters Incantation\n6) Void — Shadow force, counters Anima\n\nCounter Effects:\n- Counter attribute deals 30% bonus damage against the countered attribute\n- Countered attribute deals 20% less damage to the counter\n- Same-attribute characters in a team trigger Attribute Resonance\n\nResonance Effects:\n- 2 same-attribute characters: Attribute DMG +15%\n- 3 same-attribute characters: Additional team-wide buff\n\nTeam Building Tips:\n- Include at least 2 same-attribute characters for resonance\n- Adjust counter characters based on enemy attributes\n- Don't make entire team same attribute — maintain flexibility",
        "tags": ["elements", "attributes", "guide", "combat", "system"],
        "category": "combat",
        "categoryZh": "战斗",
        "categoryEn": "Combat",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-mahjong-guide",
        "question": "异环麻将怎么玩？麻将小游戏规则与技巧",
        "questionEn": "How to play Mahjong in NTE? Minigame rules and tips",
        "seoTitleZh": "异环麻将小游戏攻略 — 玩法规则、技巧与奖励",
        "seoTitleEn": "NTE Mahjong Minigame Guide — Rules, Tips & Rewards",
        "seoDescriptionZh": "异环麻将小游戏完整攻略：解锁条件、规则说明、获胜技巧和奖励内容。",
        "seoDescriptionEn": "Complete NTE Mahjong minigame guide: unlock requirements, rules, winning strategies, and rewards.",
        "answer": "异环中内置了麻将小游戏，是探索休闲内容的一部分。\n\n解锁条件：\n完成主线第2章后，在赫瑟雷城的娱乐区域找到麻将桌NPC即可解锁。\n\n玩法规则：\n- 采用简化版日式麻将规则\n- 每局4人对战（1名玩家 + 3名NPC）\n- 支持多种胡牌方式：立直、自摸、荣和等\n- 游戏内有简化提示系统，新手也能轻松上手\n\n技巧建议：\n1) 优先整理手牌，留好搭子\n2) 注意观察对手的弃牌判断安全牌\n3) 善用提示功能学习胡牌牌型\n4) 多练习积累经验，NPC难度随等级递增\n\n奖励：\n- 胜利获得信用点和好感度道具\n- 连胜有额外奖励\n- 特殊胡牌方式解锁隐藏成就\n- 麻将排名榜有赛季奖励",
        "answerEn": "NTE includes a Mahjong minigame as part of its leisure exploration content.\n\nUnlock Requirements:\nComplete Main Story Chapter 2, then find the Mahjong table NPC in Hethereau's entertainment district.\n\nRules:\n- Simplified Japanese Mahjong rules\n- 4-player matches (1 player + 3 NPCs)\n- Supports multiple win conditions: Riichi, Tsumo, Ron, etc.\n- Built-in hint system for beginners\n\nTips:\n1) Prioritize organizing your hand and keeping good tile pairs\n2) Watch opponents' discards to identify safe tiles\n3) Use the hint system to learn winning hand patterns\n4) Practice regularly — NPC difficulty scales with your level\n\nRewards:\n- Win Credits and affinity items\n- Win streaks give bonus rewards\n- Special win conditions unlock hidden achievements\n- Mahjong leaderboard has seasonal rewards",
        "tags": ["mahjong", "minigame", "guide", "leisure"],
        "category": "gameplay",
        "categoryZh": "玩法",
        "categoryEn": "Gameplay",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-puppet-piano-guide",
        "question": "异环钢琴人偶（Puppet Piano）事件怎么触发和完成？",
        "questionEn": "How to trigger and complete Puppet Piano event in NTE?",
        "seoTitleZh": "异环钢琴人偶事件攻略 — Puppet Piano触发与完成方法",
        "seoTitleEn": "NTE Puppet Piano Event Guide — How to Trigger & Complete",
        "seoDescriptionZh": "异环钢琴人偶（Puppet Piano）事件完整攻略：触发条件、解谜方法、隐藏奖励。",
        "seoDescriptionEn": "Complete NTE Puppet Piano event guide: trigger conditions, puzzle solution, and hidden rewards.",
        "answer": "钢琴人偶（Puppet Piano）是异环中一个隐藏的解谜事件，位于城市的废弃剧院区域。\n\n触发条件：\n1) 完成主线第3章\n2) 在夜晚时段（游戏内时间）前往废弃剧院\n3) 在剧院舞台中央找到钢琴人偶并交互\n\n解谜流程：\n1) 钢琴人偶会演奏一段旋律，记住音符顺序\n2) 在旁边的钢琴上按照相同顺序弹奏复现旋律\n3) 旋律共3轮，每轮音符数量递增（3→5→7个音符）\n4) 成功复现所有旋律后触发剧情\n\n技巧：\n- 可以使用手机录屏记录旋律，方便回放\n- 游戏内有音符提示标记，注意观察\n- 失败后可以重新尝试，没有次数限制\n\n奖励：\n- 稀有家具「人偶钢琴」\n- 成就「灵魂之音」\n- 信用点×5000\n- 隐藏剧情线索",
        "answerEn": "Puppet Piano is a hidden puzzle event in NTE located in the abandoned theater district of the city.\n\nTrigger Conditions:\n1) Complete Main Story Chapter 3\n2) Visit the abandoned theater during nighttime (in-game)\n3) Interact with the Puppet Piano on the center stage\n\nPuzzle Walkthrough:\n1) The puppet plays a melody — memorize the note sequence\n2) Reproduce the melody on the nearby piano in the same order\n3) 3 rounds with increasing notes (3→5→7 notes)\n4) Successfully reproduce all melodies to trigger the story\n\nTips:\n- Use screen recording to capture the melody for reference\n- Watch for in-game note hint markers\n- No limit on retries if you fail\n\nRewards:\n- Rare furniture \"Puppet Piano\"\n- Achievement \"Sound of Souls\"\n- Credits x5000\n- Hidden lore clues",
        "tags": ["puppet-piano", "event", "puzzle", "hidden"],
        "category": "exploration",
        "categoryZh": "探索",
        "categoryEn": "Exploration",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-whose-leak-guide",
        "question": "异环Whose Leak Is This任务怎么完成？攻略详解",
        "questionEn": "How to complete 'Whose Leak Is This' quest in NTE? Full guide",
        "seoTitleZh": "异环Whose Leak Is This任务攻略 — 触发、流程与奖励",
        "seoTitleEn": "NTE Whose Leak Is This Quest Guide — Trigger, Walkthrough & Rewards",
        "seoDescriptionZh": "异环Whose Leak Is This任务完整攻略：触发位置、任务流程、解谜方法和奖励内容。",
        "seoDescriptionEn": "Complete NTE Whose Leak Is This quest guide: trigger location, walkthrough, puzzle solutions, and rewards.",
        "answer": "Whose Leak Is This（谁的泄露）是异环中一个有趣的隐藏支线任务。\n\n触发位置：\n在赫瑟雷城的地下水道区域，找到一个正在漏水的管道NPC，与其对话触发任务。\n\n任务流程：\n1) 接受任务后获得「破损管道地图」\n2) 根据地图提示前往3个漏水点：\n   - 城市东区排水口\n   - 商业区地下通道\n   - 住宅区水塔底部\n3) 在每个漏水点完成小型解谜（修复管道）\n4) 收集3个「密封零件」\n5) 返回NPC处提交零件完成任务\n\n解谜技巧：\n- 每个漏水点是一个旋转管道的小游戏\n- 将管道旋转连接使水流通过即可\n- 限时3分钟完成每个谜题\n\n奖励：\n- 星泉×100\n- 信用点×3000\n- 稀有称号「水管工」\n- 隐藏成就\n- 解锁后续相关任务线",
        "answerEn": "Whose Leak Is This is a fun hidden side quest in NTE.\n\nTrigger Location:\nFind a leaking pipe NPC in the Hethereau underground sewer area. Talk to them to start.\n\nWalkthrough:\n1) Receive the \"Broken Pipe Map\" after accepting\n2) Visit 3 leak locations marked on the map:\n   - East District drainage outlet\n   - Commercial District underground passage\n   - Residential District water tower base\n3) Complete a mini-puzzle at each location (repair the pipe)\n4) Collect 3 \"Seal Parts\"\n5) Return to the NPC and submit the parts\n\nPuzzle Tips:\n- Each leak is a pipe rotation mini-game\n- Rotate pipes to connect the water flow\n- 3-minute time limit per puzzle\n\nRewards:\n- Fons x100\n- Credits x3000\n- Rare title \"Plumber\"\n- Hidden achievement\n- Unlocks follow-up quest chain",
        "tags": ["whose-leak", "quest", "guide", "hidden"],
        "category": "exploration",
        "categoryZh": "探索",
        "categoryEn": "Exploration",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-change-gender-guide",
        "question": "异环可以换性别吗？主角性别切换方法",
        "questionEn": "Can you change gender in NTE? How to switch protagonist gender",
        "seoTitleZh": "异环主角性别切换方法 — 换性别操作步骤与注意事项",
        "seoTitleEn": "NTE Gender Change Guide — How to Switch Protagonist Gender",
        "seoDescriptionZh": "异环主角性别切换方法详解：在哪里换性别、操作步骤、是否影响进度和外观变化。",
        "seoDescriptionEn": "How to change protagonist gender in NTE: where to switch, steps, impact on progress, and appearance changes.",
        "answer": "异环支持主角性别切换功能，可以随时在男性和女性主角之间切换。\n\n切换方法：\n1) 打开游戏主菜单\n2) 进入「角色」或「个人信息」页面\n3) 找到「外观设置」或「切换主角」选项\n4) 选择想要切换的性别并确认\n\n注意事项：\n- 性别切换是免费的，没有次数限制\n- 切换后主角的外观和部分语音会改变\n- 不影响任何游戏进度、等级、装备和背包物品\n- 部分剧情动画中主角形象会自动更新\n- 切换有短暂的加载时间\n\n常见问题：\nQ：切换性别会丢失进度吗？\nA：不会，所有进度和物品完全保留。\n\nQ：可以给主角自定义外观吗？\nA：目前主角外观由性别决定，暂不支持更深度的自定义。\n\nQ：剧情会因性别不同而变化吗？\nA：主线剧情基本一致，部分NPC对话可能有细微差异。",
        "answerEn": "NTE supports protagonist gender switching — you can freely switch between male and female protagonist at any time.\n\nHow to Switch:\n1) Open the game main menu\n2) Go to \"Character\" or \"Profile\" page\n3) Find \"Appearance Settings\" or \"Switch Protagonist\" option\n4) Select the desired gender and confirm\n\nImportant Notes:\n- Gender switching is free with no limits\n- Only appearance and some voice lines change\n- No impact on progress, levels, equipment, or inventory\n- Story cutscenes automatically update protagonist appearance\n- Brief loading time when switching\n\nFAQ:\nQ: Will I lose progress by switching?\nA: No, all progress and items are fully preserved.\n\nQ: Can I customize my protagonist's appearance further?\nA: Currently, appearance is determined by gender. Deeper customization is not available yet.\n\nQ: Does the story change based on gender?\nA: Main story is essentially the same with minor NPC dialogue differences.",
        "tags": ["gender", "character", "guide", "system"],
        "category": "system",
        "categoryZh": "系统",
        "categoryEn": "System",
        "relatedCharacters": [],
        "relatedMaterials": []
    },
    {
        "id": "nte-voice-actors-guide",
        "question": "异环全角色CV声优列表 — 日配/中配/英配一览",
        "questionEn": "NTE voice actors list — All character JP/CN/EN voice cast",
        "seoTitleZh": "异环全角色声优CV列表 — 日文/中文/英文配音演员一览",
        "seoTitleEn": "NTE Voice Actors — Complete JP/CN/EN Voice Cast for All Characters",
        "seoDescriptionZh": "异环全角色声优CV列表，包含娜娜莉、零、哈索尔、达芙迪尔等角色的日文、中文、英文配音演员信息。",
        "seoDescriptionEn": "Complete NTE voice actor cast list: Japanese, Chinese, and English VA for Nanally, Zero, Hathor, Daffodil, and all characters.",
        "answer": "异环（Neverness to Everness）支持多语言配音，以下是部分角色的声优信息：\n\n中文配音（中配）：\n- 娜娜莉：待官方确认\n- 零：待官方确认\n- 哈索尔：待官方确认\n- 达芙迪尔：待官方确认\n- 咲里：待官方确认\n\n日文配音（日配）：\n- 部分角色已确认日配声优\n- 国际服版本包含完整日配支持\n\n英文配音（英配）：\n- 国际服提供完整英配\n- Brianna Knickerbocker 参与了部分角色配音\n\n如何切换配音：\n1) 进入游戏设置（Settings）\n2) 找到「语音」（Voice/Audio）选项\n3) 在语言选项中切换中/日/英配音\n4) 切换后立即生效，无需重启游戏\n\n配音语言可在设置中随时免费切换，不受服务器或地区限制。关注官方社交媒体获取最新声优公布信息。",
        "answerEn": "NTE supports multiple language voiceovers. Here's the voice cast information:\n\nChinese VA:\n- Cast details to be officially confirmed\n- Full CN voiceover included in all versions\n\nJapanese VA:\n- Some character JP VAs confirmed\n- Global version includes full JP voiceover support\n\nEnglish VA:\n- Full EN voiceover for global server\n- Brianna Knickerbocker voices a character in the EN cast\n\nHow to Switch Voice Language:\n1) Open Settings\n2) Go to Voice/Audio settings\n3) Select language: CN/JP/EN\n4) Changes apply immediately, no restart needed\n\nVoice language can be switched freely at any time. Not restricted by server or region. Follow official social media for the latest VA announcements.",
        "tags": ["voice-actors", "cv", "guide", "characters"],
        "category": "characters",
        "categoryZh": "角色",
        "categoryEn": "Characters",
        "relatedCharacters": [],
        "relatedMaterials": []
    }
]

faqs.extend(new_faqs)

with open('data/faqs.json', 'w', encoding='utf-8') as f:
    json.dump(faqs, f, ensure_ascii=False, indent=2)

print(f'Total FAQs now: {len(faqs)}')
print(f'Added {len(new_faqs)} new FAQs:')
for q in new_faqs:
    print(f'  - {q["id"]}')
