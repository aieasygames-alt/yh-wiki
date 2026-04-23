const fs = require('fs');
const path = require('path');

const buildsPath = path.join(__dirname, '..', 'data', 'builds.json');
const builds = JSON.parse(fs.readFileSync(buildsPath, 'utf8'));

const updates = {
  nanally: {
    builds: [{
      id: "nanally-dps",
      name: "创生主C输出流",
      nameEn: "Genesis DPS Build",
      description: "以暴击和攻击力为核心的创生反应主C Build，搭配九原聚怪+早雾增伤",
      descriptionEn: "Crit and ATK-focused Genesis reaction DPS build, paired with Jiuyuan grouping and Hotori buffs",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      recommendedWeapons: ["fangs-and-claws"],
      teamComp: ["jiuyuan", "hotori"],
      notes: "娜娜莉创生队核心，九原聚怪+早雾增伤+主角即瞬环合。0觉无治疗，九原1觉补奶。",
      notesEn: "Nanally Genesis team core. Jiuyuan groups, Hotori buffs, Protagonist instant Ring Fusion. No healing at 0-awaken, Jiuyuan 1-awaken adds heal."
    }]
  },
  jiuyuan: {
    builds: [{
      id: "jiuyuan-support",
      name: "聚怪奶妈辅助流",
      nameEn: "Grouping Healer Support",
      description: "以生命和充能为核心的聚怪+治疗辅助 Build，1觉解锁奶妈能力",
      descriptionEn: "HP and energy-focused grouping + healing support, unlocks healer role at 1-awaken",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["生命%", "能量回复", "速度", "防御%"],
      subStatsEn: ["HP%", "Energy Regen", "Speed", "DEF%"],
      recommendedWeapons: ["kiroumaru"],
      teamComp: ["nanally", "hotori"],
      notes: "常驻S首选自选，超大范围聚怪泛用性顶级。1觉质变可客串奶妈，几乎所有队伍都能就业。",
      notesEn: "Best standard S pick, huge AoE grouping with top versatility. 1-awaken adds healing, fits almost every team."
    }]
  },
  baicang: {
    builds: [{
      id: "baicang-dps",
      name: "浊燃输出流",
      nameEn: "Blaze DPS Build",
      description: "以暴击为核心的浊燃反应主C Build，搭配达芙蒂尔触发浊燃",
      descriptionEn: "Crit-focused Blaze reaction DPS build, paired with Daffodil for Blaze trigger",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      recommendedWeapons: ["power-of-words"],
      teamComp: ["hotori", "daffodil"],
      notes: "白藏浊燃队核心，刚需达芙蒂尔触发浊燃。注意1.1版本安魂曲可能上位替代。",
      notesEn: "Baicang Blaze team core, requires Daffodil for Blaze trigger. Requiem in v1.1 may powercreep."
    }]
  },
  hotori: {
    builds: [{
      id: "hotori-support",
      name: "聚怪增伤辅助流",
      nameEn: "Grouping Buffer Support",
      description: "以生命和充能为核心的唯一S级辅助 Build，聚怪+加攻，1觉拐力翻倍",
      descriptionEn: "HP and energy-focused only S-rank support, grouping + ATK buff, 1-awaken doubles buff power",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["生命%", "能量回复", "速度", "防御%"],
      subStatsEn: ["HP%", "Energy Regen", "Speed", "DEF%"],
      recommendedWeapons: ["umbrella-katana"],
      teamComp: ["nanally", "jiuyuan"],
      notes: "唯一S级辅助，兼顾聚怪+加攻。1觉质变拐力翻倍，常驻S兑换优先级仅次于九原。",
      notesEn: "Only S-rank support with grouping + ATK buff. 1-awaken doubles buff, second priority after Jiuyuan for standard S pick."
    }]
  },
  xiaozhi: {
    builds: [{
      id: "xiaozhi-dps",
      name: "盈蓄主C输出流",
      nameEn: "Accumulation DPS Build",
      description: "以暴击和攻击为核心的盈蓄反应主C Build，都市大亨免费满配6+5",
      descriptionEn: "Crit and ATK-focused Accumulation reaction DPS, free 6+5 from City Tycoon",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "速度"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Speed"],
      recommendedWeapons: ["dual-blades"],
      teamComp: ["jiuyuan", "hathor"],
      notes: "都市大亨免费6+5满配，满配后强度超过所有主C。搭配九原+哈索尔触发盈蓄反应。",
      notesEn: "Free 6+5 from City Tycoon, outperforms all DPS at max investment. Pair with Jiuyuan + Hathor for Accumulation reaction."
    }]
  },
  haniel: {
    builds: [{
      id: "haniel-support",
      name: "加攻拐辅助流",
      nameEn: "ATK Buffer Support",
      description: "以生命和速度为核心的A级战神辅助 Build，满觉12%暴伤加成",
      descriptionEn: "HP and Speed-focused A-rank powerhouse support, 12% crit DMG at max awaken",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["速度", "生命%", "能量回复", "攻击力%"],
      subStatsEn: ["Speed", "HP%", "Energy Regen", "ATK%"],
      recommendedWeapons: ["liquid-arc"],
      teamComp: ["nanally", "xiaozhi"],
      notes: "A级战神，开服送一只。满觉后12%暴伤加成，二队必练的泛用拐。",
      notesEn: "A-rank powerhouse, given free at launch. 12% crit DMG at max awaken, must-build for second team."
    }]
  },
  adler: {
    builds: [{
      id: "adler-survival",
      name: "护盾生存流",
      nameEn: "Shield Survival Build",
      description: "以生命和防御为核心的1.0最佳生存位 Build，护盾+减攻+属性抗性",
      descriptionEn: "HP and DEF-focused best 1.0 survival slot, shield + ATK reduction + elemental resist",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["生命%", "防御%", "能量回复", "速度"],
      subStatsEn: ["HP%", "DEF%", "Energy Regen", "Speed"],
      recommendedWeapons: ["cane-sword-and-sunyas"],
      teamComp: ["baicang", "hotori"],
      notes: "1.0最佳生存位，护盾+减攻+属性抗性+倾陷效率。咒队额外10%增伤。",
      notesEn: "Best 1.0 survival, shield + ATK reduction + resist + break efficiency. Extra 10% DMG for Incantation teams."
    }]
  },
  daffodil: {
    builds: [{
      id: "daffodil-subdps",
      name: "浊燃反应副C流",
      nameEn: "Blaze Reaction Sub-DPS",
      description: "以攻击和暴击为核心的高频振刀Boss特化输出 Build",
      descriptionEn: "ATK and Crit-focused high-frequency parry boss specialist sub-DPS",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      recommendedWeapons: ["liquid-arc"],
      teamComp: ["baicang", "hotori"],
      notes: "白藏队刚需副C，高频振刀Boss特化。浊燃反应触发位，不可替代。",
      notesEn: "Required for Baicang team, high-frequency parry boss specialist. Blaze reaction trigger, irreplaceable."
    }]
  },
  sakiri: {
    builds: [{
      id: "sakiri-support",
      name: "增益支援流",
      nameEn: "Buff Support Build",
      description: "以生命和充能为核心的支援 Build，搭配任意输出角色",
      descriptionEn: "HP and energy-focused support, pairs with any DPS character",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["生命%", "能量回复", "防御%", "速度"],
      subStatsEn: ["HP%", "Energy Regen", "DEF%", "Speed"],
      recommendedWeapons: ["kiroumaru"],
      teamComp: ["nanally", "zero"],
      notes: "核心增益辅助，搭配任意输出角色均可。灵属性共鸣提供稳定增益。",
      notesEn: "Core buff support, works with any DPS. Anima resonance provides consistent buffs."
    }]
  }
};

// Update builds
builds.forEach(b => {
  const update = updates[b.characterId];
  if (update) {
    b.builds = update.builds;
  }
});

// Ensure key characters exist in builds
const existingIds = new Set(builds.map(b => b.characterId));
const newEntries = [
  { characterId: "xiaozhi", builds: updates.xiaozhi.builds },
  { characterId: "haniel", builds: updates.haniel.builds },
  { characterId: "adler", builds: updates.adler.builds },
];
newEntries.forEach(entry => {
  if (!existingIds.has(entry.characterId)) {
    builds.push(entry);
  }
});

fs.writeFileSync(buildsPath, JSON.stringify(builds, null, 2));
console.log('Updated builds for', Object.keys(updates).length, 'characters');
console.log('Total builds:', builds.length);
