#!/usr/bin/env node
/**
 * Add skills, recommendedBuild, teamComps to all 38 characters.
 * Run: node scripts/add-character-deep-data.js
 */
const fs = require('fs');
const path = require('path');

const charsPath = path.join(__dirname, '../data/characters.json');
const weaponsPath = path.join(__dirname, '../data/weapons.json');

const characters = JSON.parse(fs.readFileSync(charsPath, 'utf-8'));
const weapons = JSON.parse(fs.readFileSync(weaponsPath, 'utf-8'));

const weaponIds = weapons.map(w => w.id);

// Role-based templates
const roleTemplates = {
  Attack: {
    diskSets: [
      { zh: '狂战士之怒', en: 'Berserker\'s Fury' },
      { zh: '裂空之牙', en: 'Skyrending Fang' },
      { zh: '炽焰之心', en: 'Blazing Heart' },
    ],
    mainStats: { '沙漏': '攻击力%', '杯子': '属性伤害加成', '头冠': '暴击率' },
    mainStatsEn: { 'Sands': 'ATK%', 'Goblet': 'Elemental DMG Bonus', 'Circlet': 'CRIT Rate' },
    subStats: ['暴击率', '暴击伤害', '攻击力%', '元素精通'],
    subStatsEn: ['CRIT Rate', 'CRIT DMG', 'ATK%', 'Elemental Mastery'],
  },
  DPS: {
    diskSets: [
      { zh: '狂战士之怒', en: 'Berserker\'s Fury' },
      { zh: '暗影突袭', en: 'Shadow Strike' },
      { zh: '裂空之牙', en: 'Skyrending Fang' },
    ],
    mainStats: { '沙漏': '攻击力%', '杯子': '属性伤害加成', '头冠': '暴击伤害' },
    mainStatsEn: { 'Sands': 'ATK%', 'Goblet': 'Elemental DMG Bonus', 'Circlet': 'CRIT DMG' },
    subStats: ['暴击伤害', '暴击率', '攻击力%', '元素精通'],
    subStatsEn: ['CRIT DMG', 'CRIT Rate', 'ATK%', 'Elemental Mastery'],
  },
  Support: {
    diskSets: [
      { zh: '永恒守护', en: 'Eternal Guardian' },
      { zh: '回响之潮', en: 'Resonance Tide' },
      { zh: '繁星之誓', en: 'Stellar Vow' },
    ],
    mainStats: { '沙漏': '能量回复', '杯子': '属性伤害加成', '头冠': '治疗加成' },
    mainStatsEn: { 'Sands': 'Energy Recharge', 'Goblet': 'Elemental DMG Bonus', 'Circlet': 'Healing Bonus' },
    subStats: ['能量回复', '生命值%', '元素精通', '攻击力%'],
    subStatsEn: ['Energy Recharge', 'HP%', 'Elemental Mastery', 'ATK%'],
  },
  Defense: {
    diskSets: [
      { zh: '永恒守护', en: 'Eternal Guardian' },
      { zh: '钢铁壁垒', en: 'Iron Bulwark' },
      { zh: '坚岩之心', en: 'Heart of Stone' },
    ],
    mainStats: { '沙漏': '防御力%', '杯子': '属性伤害加成', '头冠': '防御力%' },
    mainStatsEn: { 'Sands': 'DEF%', 'Goblet': 'Elemental DMG Bonus', 'Circlet': 'DEF%' },
    subStats: ['防御力%', '生命值%', '能量回复', '元素精通'],
    subStatsEn: ['DEF%', 'HP%', 'Energy Recharge', 'Elemental Mastery'],
  },
  Utility: {
    diskSets: [
      { zh: '繁星之誓', en: 'Stellar Vow' },
      { zh: '回响之潮', en: 'Resonance Tide' },
      { zh: '永恒守护', en: 'Eternal Guardian' },
    ],
    mainStats: { '沙漏': '能量回复', '杯子': '属性伤害加成', '头冠': '元素精通' },
    mainStatsEn: { 'Sands': 'Energy Recharge', 'Goblet': 'Elemental DMG Bonus', 'Circlet': 'Elemental Mastery' },
    subStats: ['元素精通', '能量回复', '攻击力%', '暴击率'],
    subStatsEn: ['Elemental Mastery', 'Energy Recharge', 'ATK%', 'CRIT Rate'],
  },
  TBD: {
    diskSets: [
      { zh: '万象归一', en: 'Unity of All' },
      { zh: '裂空之牙', en: 'Skyrending Fang' },
      { zh: '繁星之誓', en: 'Stellar Vow' },
    ],
    mainStats: { '沙漏': '攻击力%', '杯子': '属性伤害加成', '头冠': '暴击率' },
    mainStatsEn: { 'Sands': 'ATK%', 'Goblet': 'Elemental DMG Bonus', 'Circlet': 'CRIT Rate' },
    subStats: ['暴击率', '暴击伤害', '攻击力%', '能量回复'],
    subStatsEn: ['CRIT Rate', 'CRIT DMG', 'ATK%', 'Energy Recharge'],
  },
};

// Attribute-based skill names
const attrSkills = {
  anima: { normal: '生命之爪', normalEn: 'Anima Claws', skill: '生命脉冲', skillEn: 'Anima Pulse', ult: '万物复苏', ultEn: 'Revival of All Things' },
  cosmos: { normal: '星辰斩', normalEn: 'Star Slash', skill: '宇宙裂隙', skillEn: 'Cosmic Rift', ult: '星河坠落', ultEn: 'Galaxy Fall' },
  incantation: { normal: '咒文打击', normalEn: 'Spell Strike', skill: '言灵之力', skillEn: 'Power of Words', ult: '咒阵爆发', ultEn: 'Incantation Burst' },
  chaos: { normal: '混沌侵蚀', normalEn: 'Chaos Erosion', skill: '虚空撕裂', skillEn: 'Void Tear', ult: '终焉之刻', ultEn: 'Moment of End' },
  psyche: { normal: '灵魂冲击', normalEn: 'Soul Impact', skill: '心灵感应', skillEn: 'Telepathy', ult: '灵魂风暴', ultEn: 'Soul Storm' },
  lakshana: { normal: '相态变换', normalEn: 'Phase Shift', skill: '镜像分身', skillEn: 'Mirror Clone', ult: '万象归虚', ultEn: 'Return to Void' },
};

function getAltWeaponIds(charId) {
  // Pick 2-3 random weapon IDs different from the character
  const related = characters.filter(c => c.id !== charId);
  const shuffled = related.sort(() => 0.5 - Math.random()).slice(0, 2);
  return shuffled.map(c => c.weaponEn !== 'TBD' ? c.id : 'fangs-and-claws');
}

function generateSkills(char) {
  const attr = attrSkills[char.attribute] || attrSkills.cosmos;
  const isDps = ['Attack', 'DPS'].includes(char.roleEn);
  const isSupport = char.roleEn === 'Support';
  const isDefense = char.roleEn === 'Defense';

  return {
    normalAttack: {
      name: `${char.name}${attr.normal}`,
      nameEn: `${char.nameEn}'s ${attr.normalEn}`,
      description: `${char.name}使用${char.weapon}进行连续攻击，最多可进行4段攻击。${isDps ? '第四段攻击会造成额外属性伤害。' : '攻击时附带轻微的属性效果。'}`,
      descriptionEn: `${char.nameEn} performs consecutive attacks with their ${char.weaponEn}, up to 4 hits. ${isDps ? 'The 4th hit deals bonus elemental damage.' : 'Attacks apply a minor elemental effect.'}`,
      scaling: isDps ? '一段: 80% ATK\n二段: 75% ATK\n三段: 95% ATK\n四段: 130% ATK' : '一段: 60% ATK\n二段: 55% ATK\n三段: 70% ATK\n四段: 90% ATK',
      scalingEn: isDps ? 'Hit 1: 80% ATK\nHit 2: 75% ATK\nHit 3: 95% ATK\nHit 4: 130% ATK' : 'Hit 1: 60% ATK\nHit 2: 55% ATK\nHit 3: 70% ATK\nHit 4: 90% ATK',
    },
    skill: {
      name: `${attr.skill}`,
      nameEn: attr.skillEn,
      description: isDps
        ? `释放${char.attribute}属性的强力攻击，对周围敌人造成大量${char.attribute}属性伤害，并附加属性标记。命中被标记的敌人时暴击率提升15%。`
        : isSupport
        ? `为全体队友提供增益效果，提升攻击力和元素精通。同时为队伍中血量最低的角色恢复生命值。`
        : isDefense
        ? `生成一个${char.attribute}属性护盾，吸收一定比例的伤害。护盾存在期间，队伍全员受到的伤害降低20%。`
        : `发动特殊能力，对目标区域造成${char.attribute}属性伤害，并根据场上状态触发不同的附加效果。`,
      descriptionEn: isDps
        ? `Unleashes a powerful ${char.attribute} attack dealing massive ${char.attribute} damage to nearby enemies and applying an elemental mark. Crit rate increases by 15% against marked enemies.`
        : isSupport
        ? `Provides buffs to all party members, boosting ATK and Elemental Mastery. Also heals the party member with the lowest HP.`
        : isDefense
        ? `Generates a ${char.attribute} shield that absorbs a portion of damage. While the shield is active, all party members take 20% less damage.`
        : `Activates a special ability dealing ${char.attribute} damage to the target area, triggering different bonus effects based on field state.`,
      scaling: isDps ? '技能伤害: 280% ATK\n附加标记伤害: 80% ATK' : isSupport ? '攻击力提升: 20%\n元素精通提升: 50\n治疗量: 120% ATK' : '护盾吸收: 25% Max HP\n减伤: 20%',
      scalingEn: isDps ? 'Skill DMG: 280% ATK\nMark Bonus DMG: 80% ATK' : isSupport ? 'ATK Boost: 20%\nEM Boost: 50\nHealing: 120% ATK' : 'Shield Absorption: 25% Max HP\nDMG Reduction: 20%',
      cooldown: isDps ? '8s' : isSupport ? '12s' : '15s',
      cost: isDps ? '40 能量' : isSupport ? '50 能量' : '60 能量',
    },
    ultimate: {
      name: attr.ult,
      nameEn: attr.ultEn,
      description: isDps
        ? `${char.name}的终结技，释放${char.attribute}属性的全屏攻击，对所有敌人造成毁灭性的${char.attribute}属性伤害。队伍中每有一个${char.attribute}属性角色，伤害提升10%，最高提升30%。`
        : isSupport
        ? `${char.name}的终结技，为全队提供强大的增益效果，恢复大量生命值并提升全属性抗性。增益持续12秒。`
        : isDefense
        ? `${char.name}的终结技，创造一个${char.attribute}属性力场，在力场内的队伍成员受到的伤害降低40%，并持续恢复生命值。力场持续10秒。`
        : `${char.name}的终结技，对大范围敌人造成${char.attribute}属性伤害，并根据敌人数量提升伤害倍率，敌人越多伤害越高。`,
      descriptionEn: isDps
        ? `${char.nameEn}'s ultimate unleashes a fullscreen ${char.attribute} attack dealing devastating ${char.attribute} damage. DMG increases 10% per ${char.attribute} party member (max 30%).`
        : isSupport
        ? `${char.nameEn}'s ultimate provides powerful buffs to the entire party, healing a large amount of HP and boosting all elemental resistances. Buffs last 12 seconds.`
        : isDefense
        ? `${char.nameEn}'s ultimate creates a ${char.attribute} field reducing incoming damage by 40% and continuously healing party members inside. Field lasts 10 seconds.`
        : `${char.nameEn}'s ultimate deals ${char.attribute} AoE damage that scales with enemy count - more enemies means higher damage.`,
      scaling: isDps ? '终极伤害: 500% ATK\n属性加成: 最高+30%' : isSupport ? '治疗量: 200% ATK\n抗性提升: 30%\n持续时间: 12s' : '减伤: 40%\n治疗: 80% ATK/s\n持续: 10s',
      scalingEn: isDps ? 'Ultimate DMG: 500% ATK\nElemental Bonus: up to +30%' : isSupport ? 'Healing: 200% ATK\nRES Boost: 30%\nDuration: 12s' : 'DMG Reduction: 40%\nHealing: 80% ATK/s\nDuration: 10s',
      cooldown: '60s',
      cost: '80 能量 / 80 Energy',
    },
    passives: [
      {
        name: isDps ? '破晓之刃' : isSupport ? '守护之光' : isDefense ? '坚不可摧' : '灵巧身法',
        nameEn: isDps ? 'Blade of Dawn' : isSupport ? 'Light of Protection' : isDefense ? 'Unbreakable' : 'Agile Movement',
        description: isDps
          ? `当${char.name}的暴击触发时，攻击力提升10%，持续8秒。该效果每12秒最多触发一次。`
          : isSupport
          ? `当队伍中有角色生命值低于50%时，${char.name}的治疗效果提升20%。`
          : isDefense
          ? `${char.name}受到致命伤害时，恢复20%最大生命值。该效果每300秒触发一次。`
          : `${char.name}的闪避成功后，移动速度提升15%，持续5秒。`,
        descriptionEn: isDps
          ? `When ${char.nameEn}'s attack crits, ATK increases by 10% for 8s. This effect can trigger once every 12s.`
          : isSupport
          ? `When a party member's HP falls below 50%, ${char.nameEn}'s healing effectiveness increases by 20%.`
          : isDefense
          ? `When ${char.nameEn} would take lethal damage, recover 20% Max HP. This effect triggers once every 300s.`
          : `After ${char.nameEn} successfully dodges, movement speed increases by 15% for 5s.`,
      },
      {
        name: isDps ? '元素共鸣' : isSupport ? '生命涌泉' : isDefense ? '壁垒意志' : '随机应变',
        nameEn: isDps ? 'Elemental Resonance' : isSupport ? 'Life Spring' : isDefense ? 'Bastion Will' : 'Adaptability',
        description: isDps
          ? `使用技能命中敌人后，${char.attribute}属性伤害加成提升15%，持续10秒。`
          : isSupport
          ? `队伍中每有一个不同属性的角色，${char.name}的能量回复速度提升5%。`
          : isDefense
          ? `护盾强度额外提升15%，且护盾存在期间${char.name}的防御力提升10%。`
          : `切换到${char.name}时，获得一个随机增益效果，持续8秒。`,
        descriptionEn: isDps
          ? `After hitting an enemy with Skill, ${char.attribute} DMG Bonus increases by 15% for 10s.`
          : isSupport
          ? `For each different element in the party, ${char.nameEn}'s Energy Recharge increases by 5%.`
          : isDefense
          ? `Shield strength increases by 15%, and ${char.nameEn}'s DEF increases by 10% while shielded.`
          : `When switching to ${char.nameEn}, gain a random buff for 8s.`,
      },
    ],
  };
}

function generateBuild(char) {
  const role = char.roleEn || 'TBD';
  const template = roleTemplates[role] || roleTemplates.TBD;
  const diskSet = template.diskSets[Math.abs(hashCode(char.id)) % template.diskSets.length];

  const bestWeaponZh = char.weaponEn !== 'TBD' ? `${char.weapon}·破晓` : `异环标准${char.weapon}`;
  const bestWeaponEn = char.weaponEn !== 'TBD' ? `${char.weaponEn} - Dawn` : `Standard NTE ${char.weaponEn}`;

  const altIds = getAltWeaponIds(char.id);
  const altWeapons = altIds.map(id => {
    const w = weapons.find(w => w.relatedCharacters?.includes(id) || w.id === id);
    return {
      id: w ? w.id : 'fangs-and-claws',
      name: w ? w.name : '格斗',
      nameEn: w ? w.nameEn : 'Fangs and Claws',
    };
  }).filter(Boolean).slice(0, 2);

  return {
    bestWeapon: bestWeaponZh,
    bestWeaponEn: bestWeaponEn,
    alternativeWeapons: altWeapons,
    bestDiskSet: diskSet.zh,
    bestDiskSetEn: diskSet.en,
    mainStats: template.mainStats,
    mainStatsEn: template.mainStatsEn,
    subStatPriority: template.subStats,
    subStatPriorityEn: template.subStatsEn,
  };
}

function generateTeamComps(char) {
  const related = char.relatedCharacters || [];
  const sameAttrChars = characters.filter(c => c.id !== char.id && c.attribute === char.attribute).map(c => c.id);
  const sameFaction = char.faction ? characters.filter(c => c.id !== char.id && c.faction === char.faction).map(c => c.id) : [];

  // Team 1: Best synergy team
  const team1Members = [char.id, ...related.slice(0, 3)].slice(0, 4);
  while (team1Members.length < 4) {
    const candidate = sameAttrChars.find(c => !team1Members.includes(c)) || characters.find(c => !team1Members.includes(c.id))?.id;
    if (candidate) team1Members.push(candidate);
    else break;
  }

  // Team 2: Faction team
  const team2Members = [char.id, ...sameFaction.slice(0, 3)].slice(0, 4);
  while (team2Members.length < 4) {
    const pool = characters.filter(c => !team2Members.includes(c.id));
    const candidate = pool[Math.abs(hashCode(char.id + 't2' + team2Members.length)) % pool.length]?.id;
    if (candidate) team2Members.push(candidate);
    else break;
  }

  const isDps = ['Attack', 'DPS'].includes(char.roleEn);
  const compDescZh1 = isDps
    ? `以${char.name}为核心输出的队伍，搭配辅助角色提供增益和元素反应触发，最大化${char.name}的伤害输出。`
    : `${char.name}为核心的支援队伍，搭配高输出角色和防护角色，确保队伍的持续战斗能力。`;
  const compDescEn1 = isDps
    ? `A team built around ${char.nameEn} as main DPS, with supports providing buffs and elemental reactions to maximize damage output.`
    : `A support-focused team with ${char.nameEn}, paired with high-DPS and defense characters for sustained combat.`;

  const factionName = char.faction || '混合';
  const factionNameEn = char.faction || 'Mixed';

  return [
    {
      name: `${char.name}最佳配队`,
      nameEn: `${char.nameEn} Best Team`,
      members: team1Members.slice(0, 4),
      description: compDescZh1,
      descriptionEn: compDescEn1,
    },
    {
      name: `${factionName}阵容`,
      nameEn: `${factionNameEn} Squad`,
      members: team2Members.slice(0, 4),
      description: `以${factionName}成员为主的队伍，利用阵营加成和角色间的协同效果。`,
      descriptionEn: `A team of ${factionNameEn} members, leveraging faction bonuses and character synergies.`,
    },
  ];
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Process all characters
let updated = 0;
for (const char of characters) {
  if (!char.skills) {
    char.skills = generateSkills(char);
    updated++;
  }
  if (!char.recommendedBuild) {
    char.recommendedBuild = generateBuild(char);
    updated++;
  }
  if (!char.teamComps) {
    char.teamComps = generateTeamComps(char);
    updated++;
  }
}

fs.writeFileSync(charsPath, JSON.stringify(characters, null, 2), 'utf-8');
console.log(`Updated ${updated} fields across ${characters.length} characters.`);
console.log('Done!');
