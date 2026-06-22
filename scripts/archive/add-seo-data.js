/**
 * Adds FAQ data and related links to characters, weapons, and guides JSON files.
 * Run: node scripts/add-seo-data.js
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Read data files
const characters = JSON.parse(fs.readFileSync(path.join(dataDir, 'characters.json'), 'utf-8'));
const weapons = JSON.parse(fs.readFileSync(path.join(dataDir, 'weapons.json'), 'utf-8'));
const guides = JSON.parse(fs.readFileSync(path.join(dataDir, 'guides.json'), 'utf-8'));

// --- Add FAQ data to characters ---
characters.forEach(char => {
  if (char.faq && char.faq.length > 0) return; // Skip if already has FAQ

  char.faq = [
    {
      question: `Is ${char.nameEn} good in Neverness to Everness?`,
      questionZh: `${char.name}值得培养吗？`,
      answer: `${char.nameEn} is a ${char.rank}-rank ${char.roleEn} character in Neverness to Everness. ${char.descriptionEn || `As a ${char.attribute} element ${char.roleEn}, ${char.nameEn} offers unique combat capabilities. Check our tier list for the latest ranking.`}`,
      answerZh: `${char.name}是异环中的${char.rank}级${char.role}角色。${char.description || `作为${char.attribute}属性${char.role}，${char.name}拥有独特的战斗能力。查看我们的强度排行获取最新评级。`}`
    },
    {
      question: `What is the best build for ${char.nameEn}?`,
      questionZh: `${char.name}最佳配装是什么？`,
      answer: `The best build for ${char.nameEn} in Neverness to Everness focuses on maximizing their ${char.roleEn} potential. As a ${char.rank}-rank ${char.attribute} character, prioritize ${char.roleEn === 'Attack' || char.roleEn === 'DPS' ? 'ATK% and CRIT stats' : char.roleEn === 'Support' ? 'Energy Recharge and support stats' : 'defensive and utility stats'}. Use our Build Calculator for detailed recommendations.`,
      answerZh: `${char.name}的最佳配装侧重于最大化其${char.role}潜力。作为${char.rank}级${char.attribute}属性角色，${char.role === '进攻' || char.role === '输出' ? '优先堆叠攻击力和暴击属性' : char.role === '支援' ? '优先能量回复和辅助属性' : '优先防御和功能属性'}。使用我们的配装计算器查看详细推荐。`
    },
    {
      question: `How to get ${char.nameEn} in Neverness to Everness?`,
      questionZh: `如何获得${char.name}？`,
      answer: `${char.nameEn} can be obtained through the gacha system in Neverness to Everness. ${char.rank === 'S' ? 'As an S-rank character, they have a lower drop rate but can be guaranteed through the pity system.' : 'As an A-rank character, they are more commonly available from standard wishes.'} Check our gacha simulator to test your luck!`,
      answerZh: `${char.name}可以通过异环的祈愿系统获得。${char.rank === 'S' ? '作为S级角色，掉落率较低，但可以通过保底系统确保获取。' : '作为A级角色，在常驻祈愿中较容易获得。'}使用我们的抽卡模拟器测试运气！`
    },
    {
      question: `What is the best team for ${char.nameEn}?`,
      questionZh: `${char.name}最佳配队是什么？`,
      answer: `The best team for ${char.nameEn} in Neverness to Everness depends on the content. As a ${char.attribute} ${char.roleEn}, pair them with characters that can trigger elemental reactions and provide synergy. Check our team building guide for detailed recommendations.`,
      answerZh: `${char.name}的最佳配队取决于具体内容。作为${char.attribute}属性${char.role}，建议搭配能触发元素反应和提供协同效果的角色。查看我们的配队指南获取详细推荐。`
    },
    {
      question: `What is the best weapon for ${char.nameEn}?`,
      questionZh: `${char.name}最佳武器是什么？`,
      answer: `The best weapon for ${char.nameEn} depends on your playstyle and available options. ${char.weapon && char.weapon !== 'TBD' ? `They use ${char.weaponEn} type weapons.` : 'Their weapon type is yet to be confirmed.'} Check our weapon tier list for the best options for ${char.nameEn}.`,
      answerZh: `${char.name}的最佳武器取决于你的玩法和可用选项。${char.weapon && char.weapon !== 'TBD' ? `他们使用${char.weapon}类型武器。` : '他们的武器类型尚未确认。'}查看我们的武器排行榜了解${char.name}的最佳选择。`
    }
  ];

  // Add related links for internal linking
  if (!char.relatedCharacters) {
    // Find characters with same attribute (teammates)
    const sameAttr = characters
      .filter(c => c.id !== char.id && c.attribute === char.attribute)
      .slice(0, 3)
      .map(c => c.id);
    char.relatedCharacters = sameAttr;
  }

  if (!char.tierRank) {
    char.tierRank = char.rank === 'S' ? 'S' : 'A';
    char.tierReason = `${char.rank}-rank ${char.roleEn} character in Neverness to Everness.`;
    char.tierReasonZh = `${char.rank}级${char.role}角色。`;
  }
});

// --- Add FAQ data to weapons ---
weapons.forEach(weapon => {
  if (weapon.faq && weapon.faq.length > 0) return;

  const bestFor = weapon.relatedCharacters.length > 0
    ? weapon.relatedCharacters.map(id => {
        const c = characters.find(ch => ch.id === id);
        return c ? c.nameEn : id;
      }).join(', ')
    : 'various characters';

  const bestForZh = weapon.relatedCharacters.length > 0
    ? weapon.relatedCharacters.map(id => {
        const c = characters.find(ch => ch.id === id);
        return c ? c.name : id;
      }).join('、')
    : '多种角色';

  weapon.faq = [
    {
      question: `Is ${weapon.nameEn} good in Neverness to Everness?`,
      questionZh: `${weapon.name}好用吗？`,
      answer: `${weapon.nameEn} is a ${weapon.type} weapon in Neverness to Everness. ${weapon.descriptionEn || 'Check our weapon tier list for detailed ranking and comparison.'}`,
      answerZh: `${weapon.name}是异环中的${weapon.type}类型武器。${weapon.description || '查看我们的武器排行榜了解详细评级和对比。'}`
    },
    {
      question: `How to get ${weapon.nameEn} in Neverness to Everness?`,
      questionZh: `如何获得${weapon.name}？`,
      answer: `${weapon.nameEn} can be obtained through the gacha system, crafting, or as a reward in Neverness to Everness. Check our complete guide for specific acquisition methods.`,
      answerZh: `${weapon.name}可以通过祈愿、锻造或活动奖励获得。查看我们的完整攻略了解具体获取方式。`
    },
    {
      question: `What is the best alternative to ${weapon.nameEn}?`,
      questionZh: `${weapon.name}的最佳替代武器是什么？`,
      answer: `The best alternative to ${weapon.nameEn} depends on your available weapons and the character using it. Check our weapon tier list for alternatives ranked by performance.`,
      answerZh: `${weapon.name}的最佳替代取决于你拥有的武器和使用角色。查看我们的武器排行榜了解按性能排序的替代选择。`
    }
  ];

  if (!weapon.bestFor) {
    weapon.bestFor = bestFor;
    weapon.bestForZh = bestForZh;
  }
});

// --- Add FAQ data to guides ---
guides.forEach(guide => {
  if (guide.faq && guide.faq.length > 0) return;

  const titleEn = guide.titleEn;
  const title = guide.title;

  guide.faq = [
    {
      question: `What is the best ${titleEn.toLowerCase().replace('guide', 'strategy')} in Neverness to Everness?`,
      questionZh: `异环中${title.replace('指南', '').replace('攻略', '')}最重要的是什么？`,
      answer: guide.summaryEn || `${titleEn} is essential for progressing in Neverness to Everness. Read our complete guide for detailed strategies and tips.`,
      answerZh: guide.summary || `${title}是异环中重要的内容。阅读我们的完整攻略了解详细策略和技巧。`
    },
    {
      question: `How to ${titleEn.toLowerCase().includes('beginner') ? 'start playing' : 'improve at'} Neverness to Everness?`,
      questionZh: `如何提升异环的游戏水平？`,
      answer: `Follow our ${titleEn.toLowerCase()} for the best results. This guide covers essential tips and strategies for Neverness to Everness players.`,
      answerZh: `遵循我们的${title}可以获得最佳效果。本攻略涵盖异环玩家必备的技巧和策略。`
    },
    {
      question: `Is ${titleEn.toLowerCase().replace('guide', '')} worth it in Neverness to Everness?`,
      questionZh: `异环${title.replace('指南', '').replace('攻略', '')}值得投入吗？`,
      answer: `Yes, ${guide.summaryEn || `following this guide will help you progress faster in Neverness to Everness.`}`,
      answerZh: guide.summary || `是的，遵循本攻略可以帮助你在异环中更快进步。`
    }
  ];
});

// Write back
fs.writeFileSync(path.join(dataDir, 'characters.json'), JSON.stringify(characters, null, 2) + '\n');
fs.writeFileSync(path.join(dataDir, 'weapons.json'), JSON.stringify(weapons, null, 2) + '\n');
fs.writeFileSync(path.join(dataDir, 'guides.json'), JSON.stringify(guides, null, 2) + '\n');

console.log(`Updated ${characters.length} characters with FAQ data`);
console.log(`Updated ${weapons.length} weapons with FAQ data`);
console.log(`Updated ${guides.length} guides with FAQ data`);
console.log('Done!');
