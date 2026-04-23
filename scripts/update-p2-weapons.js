const fs = require('fs');
const path = require('path');

const weaponsPath = path.join(__dirname, '..', 'data', 'weapons.json');
const weapons = JSON.parse(fs.readFileSync(weaponsPath, 'utf8'));

// Weapon-specific FAQ data based on character association and weapon type
const weaponDetails = {
  "fangs-and-claws": {
    acquisition: "娜娜莉专属武器，通过限定祈愿池获取。抽取概率S级武器0.6%，保底90抽。",
    acquisitionEn: "Nanally's signature weapon, obtainable from the limited banner. S-rank weapon rate 0.6%, pity at 90 pulls.",
    alternative: "格斗类型A级替代：利爪初型（主线赠送）、裂爪（锻造获取）。满精利爪初型约为专武的65%。",
    alternativeEn: "A-rank alternatives: Basic Claws (main story free), Split Claws (crafting). Max refine Basic Claws is ~65% of signature.",
    tierNote: "格斗是娜娜莉的专属武器类型，目前仅娜娜莉使用。作为S级限定角色专武，强度在T0级别。"
  },
  "kiroumaru": {
    acquisition: "咲里的伴生体桐丸，随角色一起解锁，无需额外获取。",
    acquisitionEn: "Sakiri's companion Kiroumaru, unlocked with the character. No additional acquisition needed.",
    alternative: "桐丸是咲里专属伴生体，无替代武器。咲里通过祈愿获取（常驻池）。",
    alternativeEn: "Kiroumaru is Sakiri's exclusive companion, no alternative. Sakiri from standard banner.",
    tierNote: "伴生体类型武器与角色绑定，不可更换。桐丸提供灵属性共鸣增益。"
  },
  "transforming-cross-shield": {
    acquisition: "法蒂亚专属武器，通过常驻祈愿池获取。S级武器保底90抽。",
    acquisitionEn: "Fadia's signature weapon from the standard banner. S-rank weapon pity at 90 pulls.",
    alternative: "A级替代：铁壁盾牌（商店兑换）、守护之盾（锻造）。法蒂亚自带护盾可适当降配。",
    alternativeEn: "A-rank alternatives: Iron Wall Shield (shop exchange), Guardian Shield (crafting). Fadia's built-in shields allow budget options.",
    tierNote: "变形十字盾攻防一体，法蒂亚专属，攻防切换机制独特。T1级武器。"
  },
  "esper-constructs": {
    acquisition: "拉克莉莫萨专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Lacrimosa's signature weapon from the standard banner.",
    alternative: "A级替代：基础构装体（任务赠送）、改良构装体（锻造）。构装体数量影响输出，建议至少A级。",
    alternativeEn: "A-rank alternatives: Basic Constructs (quest reward), Improved Constructs (crafting). Construct count affects DPS, at least A-rank recommended.",
    tierNote: "异能构装体是召唤流核心武器，构装体数量和伤害倍率随武器等级提升。T1级。"
  },
  "power-of-words": {
    acquisition: "白藏专属武器，通过常驻祈愿池获取。言灵之力是白藏浊燃队的核心。",
    acquisitionEn: "Baicang's signature weapon from the standard banner. Core for Baicang Blaze team.",
    alternative: "A级替代：咒术短杖（锻造）、灵言法杖（商店兑换）。白藏刚需达芙蒂尔触发浊燃，武器可降配。",
    alternativeEn: "A-rank alternatives: Incantation Wand (crafting), Spirit Staff (shop exchange). Baicang needs Daffodil for Blaze, weapon can be budget.",
    tierNote: "言灵之力提供言灵增幅和防护支援，白藏专属T0级武器。"
  },
  "sword": {
    acquisition: "零的起始武器，随角色解锁获得。高级版本通过锻造升级。",
    acquisitionEn: "Zero's starting weapon, unlocked with the character. Upgraded via crafting.",
    alternative: "进阶替代：精锻剑（锻造）、裂空之剑（活动奖励）。零剑术连击流畅，武器差异不大。",
    alternativeEn: "Upgrades: Forged Sword (crafting), Skyrending Blade (event reward). Zero's combos are fluid, weapon gap is small.",
    tierNote: "剑是零的基础武器，获取简单。适合新手过渡使用。"
  },
  "umbrella-katana": {
    acquisition: "早雾穗鸟专属武器，通过常驻祈愿池获取。S级武器保底90抽。",
    acquisitionEn: "Hotori's signature weapon from the standard banner. S-rank weapon pity at 90 pulls.",
    alternative: "A级替代：唐伞初型（商店兑换）、疾风伞（锻造）。早雾聚怪增伤为核心价值，武器可降配。",
    alternativeEn: "A-rank alternatives: Basic Umbrella (shop exchange), Gale Umbrella (crafting). Hotori's grouping/buffs are core value, weapon can be budget.",
    tierNote: "唐伞刀是唯一S级辅助专武，提供聚怪+增伤双重效果。常驻S兑换优先级高。T0级。"
  },
  "liquid-arc": {
    acquisition: "达芙蒂尔专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Daffodil's signature weapon from the standard banner.",
    alternative: "A级替代：液态弧光初型（锻造）。达芙蒂尔高频振刀Boss特化，武器提升振刀倍率。",
    alternativeEn: "A-rank alternative: Basic Liquid Arc (crafting). Daffodil specializes in high-frequency parry, weapon boosts parry multiplier.",
    tierNote: "液态弧光是达芙蒂尔浊燃反应触发位的核心武器，振刀Boss特化。T1级。"
  },
  "vehicle": {
    acquisition: "九原的载具，随角色一起解锁。九原通过常驻池或自选S获取。",
    acquisitionEn: "Jiuyuan's vehicle, unlocked with the character. Jiuyuan from standard banner or S-rank selector.",
    alternative: "载具是九原专属，无替代。建议开服自选S优先选九原。",
    alternativeEn: "Vehicle is Jiuyuan-exclusive, no alternative. Recommend picking Jiuyuan first with S-rank selector.",
    tierNote: "九原载具提供超大范围聚怪，1觉解锁治疗。开服必练辅助，泛用性顶级。"
  },
  "cane-sword-and-sunyas": {
    acquisition: "阿德勒专属武器，通过祈愿获取（A级武器概率较高）。",
    acquisitionEn: "Adler's signature weapon from gacha (A-rank weapons have higher rates).",
    alternative: "替代：杖剑初型（主线赠送）。阿德勒1.0最佳生存位，建议获取专武提升护盾效果。",
    alternativeEn: "Alternative: Basic Cane Sword (main story free). Adler is best 1.0 survival, signature weapon recommended for stronger shields.",
    tierNote: "杖剑与Sunyas协同作战，提供护盾+减攻+属性抗性。1.0最佳生存位武器。T1级。"
  },
  "shadow-manipulation": {
    acquisition: "翳的专属能力，随角色解锁。翳通过祈愿获取（A级角色）。",
    acquisitionEn: "Skia's exclusive ability, unlocked with the character. Skia from gacha (A-rank).",
    alternative: "影操控是翳的专属能力，无替代武器。翳擅长从暗处发起攻击。",
    alternativeEn: "Shadow Manipulation is Skia-exclusive, no alternative. Skia excels at attacking from darkness.",
    tierNote: "影操控提供暗影突袭和隐身机制，翳A级进攻角色中性价比高。"
  },
  "dual-blades": {
    acquisition: "薄荷和小吱共用武器类型，通过祈愿或锻造获取。",
    acquisitionEn: "Shared weapon type for Mint and Xiaozhi, obtainable from gacha or crafting.",
    alternative: "替代：双刃初型（任务赠送）、疾风双刃（锻造）。小吱都市大亨免费满配，武器可免费获取。",
    alternativeEn: "Alternatives: Basic Dual Blades (quest free), Gale Dual Blades (crafting). Xiaozhi gets free max gear from City Tycoon.",
    tierNote: "双刃攻速极快，薄荷和小吱使用。小吱免费满配后双刃价值大增。"
  },
  "construct": {
    acquisition: "泰格多的构装体，随A级角色解锁。",
    acquisitionEn: "Taygedo's constructs, unlocked with the A-rank character.",
    alternative: "构装体是泰格多专属，无替代。A级支援角色获取难度低。",
    alternativeEn: "Constructs are Taygedo-exclusive, no alternative. A-rank support, easy to obtain.",
    tierNote: "构装体兼具攻击和支援能力，泰格多A级支援中泛用性不错。"
  },
  "blade-wings": {
    acquisition: "哈索尔专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Hathor's signature weapon from the standard banner.",
    alternative: "A级替代：初级刃翼（锻造）。哈索尔飞行+攻击机动性极强。",
    alternativeEn: "A-rank alternative: Basic Blade Wings (crafting). Hathor's flight+attack mobility is exceptional.",
    tierNote: "刃翼兼具飞行和攻击能力，哈索尔机动性全角色最高。T1级武器。"
  },
  "yokai-hammer": {
    acquisition: "赤子专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Chiz's signature weapon from the standard banner.",
    alternative: "A级替代：铁锤（锻造）、大鬼锤（活动奖励）。赤子妖锤攻击范围广。",
    alternativeEn: "A-rank alternatives: Iron Hammer (crafting), Oni Hammer (event reward). Chiz's hammer has wide attack range.",
    tierNote: "妖锤是赤子的重击武器，攻击范围广破坏力极强。适合AOE和Boss战。T1级。"
  },
  "appraisal-ability": {
    acquisition: "鉴定师NPC的专属能力，主线剧情解锁。非玩家角色武器。",
    acquisitionEn: "The Appraiser NPC's exclusive ability, unlocked through main story. Not a playable character weapon.",
    alternative: "鉴定能力是鉴定师NPC专属，玩家不可操控。",
    alternativeEn: "Appraisal Ability is exclusive to the Appraiser NPC, not controllable by players.",
    tierNote: "鉴定能力用于识别和分析奇物与异象，是主线剧情推进的关键能力。"
  },
  "whip-sword": {
    acquisition: "凛子的鞭剑，随A级角色解锁。凛子通过祈愿获取。",
    acquisitionEn: "Lingko's Whip Sword, unlocked with the A-rank character. Lingko from gacha.",
    alternative: "替代：鞭剑初型（锻造）。凛子远近切换流畅，A级输出中性价比较高。",
    alternativeEn: "Alternative: Basic Whip Sword (crafting). Lingko's range switching is fluid, good value A-rank DPS.",
    tierNote: "鞭剑可伸缩远近切换，凛子A级进攻中操作手感极佳。"
  },
  "chaos-orbs": {
    acquisition: "密斯莫的混沌宝珠，随A级角色解锁。",
    acquisitionEn: "Mismo's Chaos Orbs, unlocked with the A-rank character.",
    alternative: "混沌宝珠是密斯莫专属，无替代。A级支援获取简单。",
    alternativeEn: "Chaos Orbs are Mismo-exclusive, no alternative. Easy to obtain A-rank support.",
    tierNote: "混沌宝珠是密斯莫的混沌属性辅助武器，施加负面状态增伤。"
  },
  "blood-blades": {
    acquisition: "沁红的血刃，随A级角色解锁。沁红通过祈愿获取。",
    acquisitionEn: "Shinku's Blood Blades, unlocked with the A-rank character. Shinku from gacha.",
    alternative: "替代：血刃初型（锻造）。沁红献祭流需要护盾/治疗角色保护。",
    alternativeEn: "Alternative: Basic Blood Blades (crafting). Shinku's sacrifice playstyle needs shield/healer support.",
    tierNote: "血刃消耗生命换取高伤害，低血量时爆发极高。A级高风险高回报武器。"
  },
  "psychic-barriers": {
    acquisition: "尼察的念力屏障，随A级角色解锁。",
    acquisitionEn: "Nitsa's Psychic Barriers, unlocked with the A-rank character.",
    alternative: "念力屏障是尼察专属，阿德勒的低配替代。A级辅助易获取。",
    alternativeEn: "Psychic Barriers are Nitsa-exclusive, budget alternative to Adler. Easy to obtain A-rank support.",
    tierNote: "念力屏障为队友提供防护，尼察是A级护盾辅助中性价比最高的。"
  },
  "dark-feathers": {
    acquisition: "黑鸟专属武器，通过限定祈愿池获取。S级武器保底90抽。",
    acquisitionEn: "Black Bird's signature weapon from the limited banner. S-rank weapon pity at 90 pulls.",
    alternative: "A级替代：暗羽碎片（锻造）。黑鸟速切队核心，专武提升连携技伤害。",
    alternativeEn: "A-rank alternative: Dark Feather Shards (crafting). Black Bird is quick-swap core, signature weapon boosts chain attack damage.",
    tierNote: "暗羽是黑鸟速切队核心，追踪弹+连携技高频伤害。T0级速切武器。"
  },
  "tiger-fangs": {
    acquisition: "明虎专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Xiaozhen's signature weapon from the standard banner.",
    alternative: "A级替代：虎牙初型（锻造）。明虎蓄力重击需要安全输出环境。",
    alternativeEn: "A-rank alternative: Basic Tiger Fangs (crafting). Xiaozhen's charged attacks need safe windows.",
    tierNote: "虎牙蓄力重击伤害极高，明虎S级物理格斗爆发输出。T1级。"
  },
  "flame-talismans": {
    acquisition: "赤音专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Akane's signature weapon from the standard banner.",
    alternative: "A级替代：焰符初型（锻造）。赤音灼烧队核心输出，专武提升灼烧持续时间。",
    alternativeEn: "A-rank alternative: Basic Flame Talismans (crafting). Akane is burn team core, signature extends burn duration.",
    tierNote: "焰符延迟引爆机制独特，赤音S级灼烧反应主C。T1级。"
  },
  "gravity-hammer": {
    acquisition: "詹森专属武器，随A级角色解锁。",
    acquisitionEn: "Jenson's signature weapon, unlocked with the A-rank character.",
    alternative: "替代：重力锤初型（锻造）。詹森A级嘲讽坦克，吸引敌人保护队友。",
    alternativeEn: "Alternative: Basic Gravity Hammer (crafting). Jenson is A-rank taunt tank, drawing enemies to protect allies.",
    tierNote: "重力锤产生引力效果吸引敌人，A级坦克中聚怪能力突出。"
  },
  "phase-blades": {
    acquisition: "伊利卡专属武器，通过常驻祈愿池获取。",
    acquisitionEn: "Illica's signature weapon from the standard banner.",
    alternative: "A级替代：相位刃初型（锻造）。伊利卡狂战士暴击流核心。",
    alternativeEn: "A-rank alternative: Basic Phase Blades (crafting). Illica is the core user of Berserker crit builds.",
    tierNote: "相位刃穿透防御，伊利卡狂战士暴击流高频暴击。T1级。"
  },
  "sonic-guitar": {
    acquisition: "通用音波武器，通过祈愿池或商店兑换获取。赤音可使用。",
    acquisitionEn: "Universal sonic weapon from gacha or shop exchange. Akane can use it.",
    alternative: "替代：音波吉他初型（锻造）、焰符（赤音专武更好）。范围AOE优秀。",
    alternativeEn: "Alternatives: Basic Sonic Guitar (crafting), Flame Talismans (better for Akane). Excellent AoE.",
    tierNote: "音波吉他范围攻击出色，通用武器中AOE能力突出。适合多目标战斗。"
  },
  "magnet-gauntlets": {
    acquisition: "通用格斗武器，通过祈愿池或锻造获取。明虎可使用。",
    acquisitionEn: "Universal combat weapon from gacha or crafting. Xiaozhen can use it.",
    alternative: "替代：磁力拳套初型（锻造）、虎牙（明虎专武更好）。磁力吸引控制效果不错。",
    alternativeEn: "Alternatives: Basic Magnet Gauntlets (crafting), Tiger Fangs (better for Xiaozhen). Magnetic pull CC is decent.",
    tierNote: "磁力拳套可吸引金属物体，通用格斗武器中有不错的控场能力。"
  },
  "time-hourglass": {
    acquisition: "通用辅助武器，通过祈愿池或活动奖励获取。",
    acquisitionEn: "Universal support weapon from gacha or event rewards.",
    alternative: "替代：时之沙漏初型（锻造）。减速敌人效果对Boss也有效。",
    alternativeEn: "Alternative: Basic Time Hourglass (crafting). Enemy slow works on bosses too.",
    tierNote: "时之沙漏可减缓敌人行动，通用辅助武器中减速效果实用。"
  },
  "ink-brush": {
    acquisition: "通用魔法武器，通过祈愿池或锻造获取。",
    acquisitionEn: "Universal magic weapon from gacha or crafting.",
    alternative: "替代：墨笔初型（锻造）。实体化攻击范围广，适合AOE。",
    alternativeEn: "Alternative: Basic Ink Brush (crafting). Materialized attacks have wide range, good for AoE.",
    tierNote: "墨笔绘出的图案实体化为攻击手段，通用魔法武器中创意十足。"
  },
  "chain-scythe": {
    acquisition: "通用近战武器，通过祈愿池或锻造获取。黑鸟可使用。",
    acquisitionEn: "Universal melee weapon from gacha or crafting. Black Bird can use it.",
    alternative: "替代：链镰初型（锻造）、暗羽（黑鸟专武更好）。远近双距离攻击灵活。",
    alternativeEn: "Alternatives: Basic Chain Scythe (crafting), Dark Feathers (better for Black Bird). Flexible close/long range.",
    tierNote: "链镰近距离挥砍+远距离抛掷，通用近战武器中灵活性突出。"
  },
  "crystal-shards": {
    acquisition: "通用远程武器，通过祈愿池或锻造获取。",
    acquisitionEn: "Universal ranged weapon from gacha or crafting.",
    alternative: "替代：晶碎初型（锻造）。穿透攻击对直线排列的敌人效果极佳。",
    alternativeEn: "Alternative: Basic Crystal Shards (crafting). Piercing attacks excel against enemies in a line.",
    tierNote: "晶碎远程穿透攻击，通用远程武器中对群体效果优秀。"
  },
  "puppet-strings": {
    acquisition: "通用召唤武器，通过祈愿池获取。",
    acquisitionEn: "Universal summon weapon from gacha.",
    alternative: "替代：傀儡线初型（锻造）。控制敌人效果独特但需要操作技巧。",
    alternativeEn: "Alternative: Basic Puppet Strings (crafting). Enemy manipulation is unique but skill-intensive.",
    tierNote: "傀儡线可控制敌人，通用召唤武器中控制能力最独特。"
  },
  "void-scythe": {
    acquisition: "莉莉娜可使用的虚空镰刀，通过祈愿池获取。高稀有度武器。",
    acquisitionEn: "Void Scythe usable by Lilina, from gacha. High rarity weapon.",
    alternative: "替代：虚空镰初型（锻造）、链镰（通用替代）。空间裂缝持续伤害效果不错。",
    alternativeEn: "Alternatives: Basic Void Scythe (crafting), Chain Scythe (universal substitute). Spatial rift DoT is decent.",
    tierNote: "虚空镰切割空间本身，莉莉娜浊燃队核心武器。高倍率持续伤害。"
  },
  "plasma-cannon": {
    acquisition: "通用远程武器，通过祈愿池获取。伊利卡可使用。",
    acquisitionEn: "Universal ranged weapon from gacha. Illica can use it.",
    alternative: "替代：等离子炮初型（锻造）、相位刃（伊利卡专武更好）。单发伤害极高。",
    alternativeEn: "Alternatives: Basic Plasma Cannon (crafting), Phase Blades (better for Illica). Extremely high single-shot damage.",
    tierNote: "等离子炮蓄力型射击武器，通用远程武器中单发伤害最高。"
  },
  "nature-vines": {
    acquisition: "通用辅助武器，通过祈愿池或锻造获取。",
    acquisitionEn: "Universal support weapon from gacha or crafting.",
    alternative: "替代：自然藤蔓初型（锻造）。束缚+治疗双效果实用。",
    alternativeEn: "Alternative: Basic Nature Vines (crafting). Binding + healing dual effect is practical.",
    tierNote: "自然藤蔓束缚+治疗双效果，通用辅助武器中续航能力优秀。"
  },
  "mirror-shield": {
    acquisition: "通用辅助武器，通过祈愿池或锻造获取。奥蕾莉亚可使用。",
    acquisitionEn: "Universal support weapon from gacha or crafting. Aurelia can use it.",
    alternative: "替代：镜盾初型（锻造）。反射敌人攻击是独特防御手段。",
    alternativeEn: "Alternative: Basic Mirror Shield (crafting). Reflecting enemy attacks is a unique defensive option.",
    tierNote: "镜盾可反射敌人攻击，通用辅助武器中防御机制独特。"
  },
  "thunder-drums": {
    acquisition: "通用魔法武器，通过祈愿池或锻造获取。",
    acquisitionEn: "Universal magic weapon from gacha or crafting.",
    alternative: "替代：雷鼓初型（锻造）。范围雷击AOE伤害出色。",
    alternativeEn: "Alternative: Basic Thunder Drums (crafting). AoE thunder damage is excellent.",
    tierNote: "雷鼓范围雷击攻击，通用魔法武器中AOE雷电伤害突出。"
  },
  "frost-fan": {
    acquisition: "通用魔法武器，通过祈愿池或锻造获取。玛丽娜可使用。",
    acquisitionEn: "Universal magic weapon from gacha or crafting. Marina can use it.",
    alternative: "替代：冰扇初型（锻造）。大范围减速控制效果优秀。",
    alternativeEn: "Alternative: Basic Frost Fan (crafting). Wide-area slow CC is excellent.",
    tierNote: "冰扇释放冰霜风暴减速敌人，玛丽娜裂空反应输出核心武器。"
  },
  "gravity-boots": {
    acquisition: "通用近战武器，通过祈愿池或锻造获取。吾郎可使用。",
    acquisitionEn: "Universal melee weapon from gacha or crafting. Goro can use it.",
    alternative: "替代：重力靴初型（锻造）。踢技+墙壁行走机动性高。",
    alternativeEn: "Alternative: Basic Gravity Boots (crafting). Kick attacks + wall walking for high mobility.",
    tierNote: "重力靴强化踢技，可在墙壁和天花板行走。通用近战武器中机动性最高。"
  },
  "spirit-bow": {
    acquisition: "通用远程武器，通过祈愿池或锻造获取。克劳可使用。",
    acquisitionEn: "Universal ranged weapon from gacha or crafting. Crow can use it.",
    alternative: "替代：灵弓初型（锻造）。追踪箭矢对移动敌人效果极佳。",
    alternativeEn: "Alternative: Basic Spirit Bow (crafting). Tracking arrows excel against moving enemies.",
    tierNote: "灵弓追踪箭矢，克劳裂空高频输出核心武器。自动追踪降低操作难度。"
  },
  "nanite-swarm": {
    acquisition: "通用召唤武器，通过祈愿池或锻造获取。",
    acquisitionEn: "Universal summon weapon from gacha or crafting.",
    alternative: "替代：纳米虫群初型（锻造）。攻击+修复双模式灵活切换。",
    alternativeEn: "Alternative: Basic Nanite Swarm (crafting). Attack + repair dual mode switching.",
    tierNote: "纳米虫群兼具攻击和修复能力，通用召唤武器中续航能力不错。"
  },
  "soul-lantern": {
    acquisition: "通用辅助武器，通过祈愿池或锻造获取。希尔菲核心使用。",
    acquisitionEn: "Universal support weapon from gacha or crafting. Core weapon for Sylphy.",
    alternative: "替代：魂灯初型（锻造）。能量回复辅助效果稳定。",
    alternativeEn: "Alternative: Basic Soul Lantern (crafting). Stable energy regen support effect.",
    tierNote: "魂灯吸收释放灵魂能量回复队友，希尔菲回响充能辅助核心武器。"
  }
};

let updated = 0;
for (const weapon of weapons) {
  const detail = weaponDetails[weapon.id];
  if (!detail) continue;
  
  // Update FAQ answers
  if (weapon.faq && weapon.faq.length >= 3) {
    // FAQ 1: Is it good?
    const charName = weapon.bestForZh || weapon.id;
    const charNameEn = weapon.bestFor || weapon.id;
    weapon.faq[0].answer = `${weapon.nameEn} is a ${weapon.type} weapon in Neverness to Everness. ${weapon.descriptionEn} ${detail.tierNote}`;
    weapon.faq[0].answerZh = `${weapon.name}是异环中的${weapon.type}类型武器。${weapon.description} ${detail.tierNote}`;
    
    // FAQ 2: How to get?
    weapon.faq[1].answer = detail.acquisitionEn;
    weapon.faq[1].answerZh = detail.acquisition;
    
    // FAQ 3: Best alternative?
    weapon.faq[2].answer = detail.alternativeEn;
    weapon.faq[2].answerZh = detail.alternative;
    
    updated++;
  }
}

fs.writeFileSync(weaponsPath, JSON.stringify(weapons, null, 2));
console.log(`Updated ${updated} weapon FAQs with specific data. Total weapons: ${weapons.length}`);
