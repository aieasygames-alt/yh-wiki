const fs = require('fs');
const path = require('path');

const buildsPath = path.join(__dirname, '..', 'data', 'builds.json');
const builds = JSON.parse(fs.readFileSync(buildsPath, 'utf8'));

const newBuilds = [
  {
    characterId: "edgar",
    builds: [{
      id: "edgar-support",
      name: "增益辅助流",
      nameEn: "Buffer Support Build",
      description: "以生命和充能为核心的A级增益辅助，为队伍提供攻防增益",
      descriptionEn: "HP and Energy-focused A-rank buffer support, providing ATK and DEF buffs to the team",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["速度", "生命%", "能量回复", "防御%"],
      subStatsEn: ["Speed", "HP%", "Energy Regen", "DEF%"],
      recommendedWeapons: ["soul-lantern"],
      teamComp: ["nanally", "haniel"],
      notes: "A级泛用增益辅助，低配替代早雾的聚怪增伤位。搭配任意主C均可，适合二队。",
      notesEn: "Versatile A-rank buffer, budget substitute for Hotori's grouping+buff slot. Works with any DPS, good for second team."
    }]
  },
  {
    characterId: "nelly",
    builds: [{
      id: "nelly-support",
      name: "能量回复辅助流",
      nameEn: "Energy Regen Support",
      description: "以充能效率为核心的能量回复辅助，加速队伍必杀技循环",
      descriptionEn: "Energy Regen-focused support that accelerates team ultimate rotation",
      mainStat: "能量回复效率",
      mainStatEn: "Energy Regen",
      subStats: ["速度", "生命%", "能量回复", "防御%"],
      subStatsEn: ["Speed", "HP%", "Energy Regen", "DEF%"],
      recommendedWeapons: ["time-hourglass"],
      teamComp: ["baicang", "daffodil"],
      notes: "A级能量辅助，加速白藏浊燃队必杀技循环。搭配高能量消耗主C效果最佳。",
      notesEn: "A-rank energy support, speeds up Baicang Blaze team ultimate rotation. Best with high-cost ult DPS."
    }]
  },
  {
    characterId: "merula",
    builds: [{
      id: "merula-dps",
      name: "创生输出流",
      nameEn: "Genesis DPS Build",
      description: "以暴击为核心的创生属性A级输出，适合作为二队主C",
      descriptionEn: "Crit-focused Genesis attribute A-rank DPS, good as second team carry",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      recommendedWeapons: ["fangs-and-claws"],
      teamComp: ["jiuyuan", "haniel"],
      notes: "A级创生输出，作为娜娜莉的下位替代。搭配九原聚怪+哈尼尔增伤可胜任日常内容。",
      notesEn: "A-rank Genesis DPS, budget alternative to Nanally. Paired with Jiuyuan grouping + Haniel buffs for daily content."
    }]
  },
  {
    characterId: "alphard",
    builds: [{
      id: "alphard-dps",
      name: "混沌属性输出流",
      nameEn: "Chaos DPS Build",
      description: "以暴击伤害为核心的混沌属性输出，利用负面状态增伤",
      descriptionEn: "Crit DMG-focused Chaos attribute DPS, leveraging debuff bonuses",
      mainStat: "暴击伤害",
      mainStatEn: "Crit DMG",
      subStats: ["暴击率", "攻击力%", "属性伤害", "充能效率"],
      subStatsEn: ["Crit Rate", "ATK%", "Elemental DMG", "Energy Regen"],
      recommendedWeapons: ["chaos-orbs"],
      teamComp: ["skia", "adler"],
      notes: "混沌属性A级输出，依赖负面状态触发增伤。翳提供控制，阿德勒提供护盾保生存。",
      notesEn: "Chaos A-rank DPS, relies on debuffs for damage bonus. Skia provides CC, Adler provides shields."
    }]
  },
  {
    characterId: "lingko",
    builds: [{
      id: "lingko-dps",
      name: "近远切换输出流",
      nameEn: "Mid-Range DPS Build",
      description: "以鞭剑远近切换为核心的高速输出，攻速极快",
      descriptionEn: "High-speed DPS using whip-sword range switching, extremely fast attacks",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "速度", "攻击力%"],
      subStatsEn: ["Crit Rate", "Crit DMG", "Speed", "ATK%"],
      recommendedWeapons: ["whip-sword"],
      teamComp: ["sakiri", "mint"],
      notes: "A级近远切换输出，攻速快连击流畅。咲里增益+薄荷治疗保证输出环境。",
      notesEn: "A-rank mid-range DPS with fluid combos. Sakiri buffs + Mint healing for safe damage windows."
    }]
  },
  {
    characterId: "mismo",
    builds: [{
      id: "mismo-support",
      name: "混沌辅助流",
      nameEn: "Chaos Support Build",
      description: "以生命和效果命中为核心的混沌属性辅助，施加负面状态",
      descriptionEn: "HP and Effect Hit-focused Chaos support, applying debuffs to enemies",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["效果命中", "生命%", "速度", "能量回复"],
      subStatsEn: ["Effect Hit", "HP%", "Speed", "Energy Regen"],
      recommendedWeapons: ["chaos-orbs"],
      teamComp: ["black-bird", "alphard"],
      notes: "A级混沌辅助，负面状态施加手。搭配黑鸟或阿尔法德触发混沌系增伤。",
      notesEn: "A-rank Chaos support, debuff applicator. Pair with Black Bird or Alphard for Chaos synergy."
    }]
  },
  {
    characterId: "shinku",
    builds: [{
      id: "shinku-dps",
      name: "血刃献祭输出流",
      nameEn: "Blood Sacrifice DPS Build",
      description: "以暴击为核心的血量献祭型高爆发输出，低血量时伤害翻倍",
      descriptionEn: "Crit-focused HP-sacrifice burst DPS, damage doubles at low HP",
      mainStat: "暴击伤害",
      mainStatEn: "Crit DMG",
      subStats: ["暴击率", "攻击力%", "生命%", "暴击伤害"],
      subStatsEn: ["Crit Rate", "ATK%", "HP%", "Crit DMG"],
      recommendedWeapons: ["blood-blades"],
      teamComp: ["adler", "mint"],
      notes: "A级血刃献祭输出，低血量时伤害极高但需要护盾/治疗保护。阿德勒护盾+薄荷治疗是刚需。",
      notesEn: "A-rank blood sacrifice DPS, massive damage at low HP but needs protection. Adler shield + Mint healing required."
    }]
  },
  {
    characterId: "nitsa",
    builds: [{
      id: "nitsa-support",
      name: "念力屏障辅助流",
      nameEn: "Psychic Barrier Support",
      description: "以生命和防御为核心的治疗护盾辅助，低配替代阿德勒",
      descriptionEn: "HP and DEF-focused healing/shield support, budget alternative to Adler",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["生命%", "防御%", "速度", "能量回复"],
      subStatsEn: ["HP%", "DEF%", "Speed", "Energy Regen"],
      recommendedWeapons: ["psychic-barriers"],
      teamComp: ["baicang", "hotori"],
      notes: "A级护盾辅助，阿德勒的低配替代。提供念力屏障和治疗，适合二队生存位。",
      notesEn: "A-rank shield support, budget alternative to Adler. Provides psychic barriers and healing, good for second team survival."
    }]
  },
  {
    characterId: "jenson",
    builds: [{
      id: "jenson-tank",
      name: "重力嘲讽坦克流",
      nameEn: "Gravity Tank Build",
      description: "以生命和防御为核心的嘲讽坦，吸引敌人火力保护队友",
      descriptionEn: "HP and DEF-focused taunt tank, drawing enemy fire to protect allies",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["防御%", "生命%", "效果命中", "速度"],
      subStatsEn: ["DEF%", "HP%", "Effect Hit", "Speed"],
      recommendedWeapons: ["gravity-hammer"],
      teamComp: ["lacrimosa", "sakiri"],
      notes: "A级嘲讽坦克，重力锤产生引力吸引敌人。搭配拉克莉莫萨AOE输出效果极佳。",
      notesEn: "A-rank taunt tank, gravity hammer draws enemies in. Excellent pairing with Lacrimosa for AoE damage."
    }]
  },
  {
    characterId: "fuuka",
    builds: [{
      id: "fuuka-support",
      name: "风系加速辅助流",
      nameEn: "Wind Speed Buffer Support",
      description: "以速度和充能为核心的加速辅助，提升全队行动速度",
      descriptionEn: "Speed and Energy Regen-focused buffer, increasing team action speed",
      mainStat: "速度",
      mainStatEn: "Speed",
      subStats: ["速度", "生命%", "能量回复", "效果命中"],
      subStatsEn: ["Speed", "HP%", "Energy Regen", "Effect Hit"],
      recommendedWeapons: ["nature-vines"],
      teamComp: ["nanally", "haniel"],
      notes: "A级风系加速辅助，提升全队速度加快输出循环。适合追求快速清图的队伍。",
      notesEn: "A-rank wind speed buffer, accelerates team output cycle. Great for fast clear teams."
    }]
  },
  {
    characterId: "renee",
    builds: [{
      id: "renee-support",
      name: "减防辅助流",
      nameEn: "DEF Reduction Support",
      description: "以效果命中和速度为核心的减防辅助，降低敌人防御提升队伍输出",
      descriptionEn: "Effect Hit and Speed-focused DEF reduction support, lowering enemy DEF for more team damage",
      mainStat: "效果命中",
      mainStatEn: "Effect Hit",
      subStats: ["速度", "效果命中", "生命%", "能量回复"],
      subStatsEn: ["Speed", "Effect Hit", "HP%", "Energy Regen"],
      recommendedWeapons: ["ink-brush"],
      teamComp: ["baicang", "jiuyuan"],
      notes: "A级减防辅助，降低敌人防御提升全队输出。搭配高倍率主C效果最好。",
      notesEn: "A-rank DEF reduction support, boosting team damage by lowering enemy DEF. Best paired with high-multiplier DPS."
    }]
  },
  {
    characterId: "goro",
    builds: [{
      id: "goro-dps",
      name: "物理输出流",
      nameEn: "Physical DPS Build",
      description: "以暴击和攻击为核心的物理A级输出，稳定可靠",
      descriptionEn: "Crit and ATK-focused physical A-rank DPS, reliable and consistent",
      mainStat: "攻击力%",
      mainStatEn: "ATK%",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      recommendedWeapons: ["gravity-boots"],
      teamComp: ["edgar", "nelly"],
      notes: "A级物理输出，不依赖元素反应的伤害稳定。适合应对元素抗性高的敌人。",
      notesEn: "A-rank physical DPS, stable damage independent of elemental reactions. Good against high elemental resist enemies."
    }]
  },
  {
    characterId: "kaito",
    builds: [{
      id: "kaito-dps",
      name: "水属性输出流",
      nameEn: "Water DPS Build",
      description: "以暴击和属性伤害为核心的水属性A级输出",
      descriptionEn: "Crit and Elemental DMG-focused Water attribute A-rank DPS",
      mainStat: "属性伤害",
      mainStatEn: "Elemental DMG",
      subStats: ["暴击率", "暴击伤害", "攻击力%", "充能效率"],
      subStatsEn: ["Crit Rate", "Crit DMG", "ATK%", "Energy Regen"],
      recommendedWeapons: ["frost-fan"],
      teamComp: ["sylphy", "fuuka"],
      notes: "A级水属性输出，冰扇减速+风花加速形成速度差控制。搭配希尔菲充能加速循环。",
      notesEn: "A-rank Water DPS, Frost Fan slow + Fuuka speed creates tempo control. Paired with Sylphy for energy acceleration."
    }]
  },
  {
    characterId: "aurelia",
    builds: [{
      id: "aurelia-support",
      name: "全能辅助流",
      nameEn: "All-Round Support Build",
      description: "以生命和速度为核心的A级全能辅助，兼顾治疗和增益",
      descriptionEn: "HP and Speed-focused A-rank all-round support, combining healing and buffs",
      mainStat: "生命%",
      mainStatEn: "HP%",
      subStats: ["速度", "生命%", "能量回复", "防御%"],
      subStatsEn: ["Speed", "HP%", "Energy Regen", "DEF%"],
      recommendedWeapons: ["mirror-shield"],
      teamComp: ["xiaozhi", "jiuyuan"],
      notes: "A级全能辅助，镜盾反射+治疗+增益三合一。适合需要多功能辅助的队伍。",
      notesEn: "A-rank all-round support, mirror shield reflection + healing + buffs in one. Great for teams needing multifunctional support."
    }]
  }
];

// Add only missing builds
let added = 0;
for (const nb of newBuilds) {
  if (!builds.find(b => b.characterId === nb.characterId)) {
    builds.push(nb);
    added++;
  }
}

fs.writeFileSync(buildsPath, JSON.stringify(builds, null, 2));
console.log(`Added ${added} new builds. Total: ${builds.length}`);
