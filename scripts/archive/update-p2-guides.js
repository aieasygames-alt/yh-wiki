const fs = require('fs');
const path = require('path');

const guidesPath = path.join(__dirname, '..', 'data', 'guides.json');
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

// Update tier-list guide with actual character tiers
const tierListIdx = guides.findIndex(g => g.id === 'tier-list');
if (tierListIdx >= 0) {
  guides[tierListIdx].content = `了解角色强度排行可以帮助你更高效地分配有限资源。本排行基于1.0公测版本角色在各类内容中的综合表现评估，包括深渊、异象挑战和日常清图。

## T0级角色（必练）

| 角色 | 属性 | 定位 | 理由 |
|------|------|------|------|
| 娜娜莉 | 生命 | 创生主C | 开服最强限S主C，数值独一档，创生反应核心 |
| 九原 | 灵 | 聚怪辅助 | 常驻S首选自选，超大范围聚怪，1觉解锁治疗，泛用性顶级 |
| 穗鸟 | 暗 | 增伤辅助 | 唯一S级辅助，聚怪+加攻，1觉拐力翻倍 |

## T1级角色（强烈推荐）

| 角色 | 属性 | 定位 | 理由 |
|------|------|------|------|
| 白藏 | 咒 | 浊燃主C | 浊燃队核心，刚需达芙蒂尔触发 |
| 小吱 | 暗 | 盈蓄主C | 都市大亨免费6+5满配，满配超所有主C |
| 达芙蒂尔 | 灵 | 浊燃副C | 白藏队刚需，高频振刀Boss特化 |
| 阿德勒 | 灵 | 生存位 | 1.0最佳生存，护盾+减攻+属性抗性 |
| 赤音 | 火 | 灼烧主C | 灼烧队核心输出，炽焰之心4件套 |
| 黑鸟 | 暗 | 速切输出 | 速切队核心，连携技高频伤害 |

## T2级角色（可选培养）

| 角色 | 属性 | 定位 | 理由 |
|------|------|------|------|
| 零 | 暗 | 剑术输出 | 剑术连击流畅，新手友好 |
| 法蒂亚 | 火 | 攻防一体 | 自带护盾，适合激进输出 |
| 哈尼尔 | 灵 | 增益辅助 | A级战神，满觉12%暴伤，二队必练 |
| 哈索尔 | 生命 | 刃翼输出 | 飞行+攻击机动性极强 |
| 赤子 | 暗 | 重击输出 | 妖锤攻击范围广 |

## 配队推荐

### 创生队（T0）
娜娜莉 + 九原 + 穗鸟
九原聚怪→穗鸟增伤→娜娜莉即瞬环合爆发

### 浊燃队（T1）
白藏 + 达芙蒂尔 + 穗鸟/阿德勒
达芙蒂尔触发浊燃→白藏主C输出

### 零氪队（T1）
小吱 + 哈尼尔 + 九原/哈索尔
都市大亨免费满配小吱+哈尼尔增伤

## 培养优先级

1. 主C → 九原/穗鸟 → 生存位 → 副C
2. 零氪优先：小吱(免费满配) → 哈尼尔(送) → 九原(自选S)
3. 氪金优先：娜娜莉(限S) → 九原(常驻S) → 穗鸟(常驻S)

详细分析请查看[完整角色强度排行](/zh/guides/detailed-tier-list)`;

  guides[tierListIdx].contentEn = `Understanding character tier rankings helps you allocate limited resources efficiently. This tier list is based on 1.0 launch character performance across Abyss, Anomaly challenges, and daily content.

## T0 Characters (Must-Build)

| Character | Element | Role | Reason |
|-----------|---------|------|--------|
| Nanally | Anima | Genesis DPS | Launch best limited S-rank DPS, unmatched numbers, Genesis reaction core |
| Jiuyuan | Anima | Grouping Support | Best standard S pick, huge AoE grouping, 1-awaken adds healing |
| Hotori | Dark | Buffer Support | Only S-rank support with grouping + ATK buff, 1-awaken doubles buff power |

## T1 Characters (Strongly Recommended)

| Character | Element | Role | Reason |
|-----------|---------|------|--------|
| Baicang | Incantation | Blaze DPS | Blaze team core, requires Daffodil for trigger |
| Xiaozhi | Dark | Accumulation DPS | Free 6+5 from City Tycoon, outperforms all DPS at max |
| Daffodil | Anima | Blaze Sub-DPS | Required for Baicang team, high-frequency parry specialist |
| Adler | Anima | Survival | Best 1.0 survival slot, shield + ATK reduction + resist |
| Akane | Fire | Burn DPS | Burn team core, Blazing Heart 4pc |
| Black Bird | Dark | Quick-Swap DPS | Quick-swap core, high-frequency chain attacks |

## T2 Characters (Optional)

| Character | Element | Role | Reason |
|-----------|---------|------|--------|
| Zero | Dark | Sword DPS | Fluid sword combos, beginner-friendly |
| Fadia | Fire | Hybrid DPS | Built-in shields for aggressive play |
| Haniel | Anima | Buffer | A-rank powerhouse, 12% crit DMG at max awaken |
| Hathor | Anima | Blade Wing DPS | Extreme mobility with flight + attack |
| Chiz | Dark | Heavy Strike DPS | Wide attack range yokai hammer |

## Team Recommendations

### Genesis Team (T0)
Nanally + Jiuyuan + Hotori
Jiuyuan groups → Hotori buffs → Nanally instant Ring Fusion burst

### Blaze Team (T1)
Baicang + Daffodil + Hotori/Adler
Daffodil triggers Blaze → Baicang DPS

### F2P Team (T1)
Xiaozhi + Haniel + Jiuyuan/Hathor
Free max Xiaozhi + Haniel buffs

## Build Priority

1. Main DPS → Jiuyuan/Hotori → Survival → Sub-DPS
2. F2P: Xiaozhi (free) → Haniel (free) → Jiuyuan (selector)
3. Paying: Nanally (limited) → Jiuyuan (standard) → Hotori (standard)

See [Detailed Tier List](/en/guides/detailed-tier-list) for full analysis.`;
}

// Update arc-disc-guide with more detail
const arcIdx = guides.findIndex(g => g.id === 'arc-disc-guide');
if (arcIdx >= 0) {
  // Keep existing content, just expand the English version to match
  guides[arcIdx].contentEn = `Arc Discs are the most impactful equipment system in NTE's launch version. Each character equips one disc for massive stat boosts and special effects. This guide covers everything you need to know.

## What Are Arc Discs?

Arc Discs are special equipment ranked C, B, A, and S. Higher quality means better base stats and stronger effects. Each character equips exactly one disc, but the right disc can dramatically change combat performance.

## How to Get Arc Discs

1. **Boss Anomaly drops**: Defeating Boss anomalies has a chance to drop discs. Sea Prisoner has the highest S-rank drop rate.
2. **Tower Dungeon**: Dedicated disc challenge with guaranteed C-rank drops. Higher floors = better drop rates.
3. **Shop Exchange**: Trade Drive Blocks + Cassettes at the Blank Screen Device shop.
4. **Anomaly Containment**: Complete containment missions for Spotted Butterfly and other bosses.
5. **Event Rewards**: Launch events give guaranteed A-rank discs.
6. **City Tycoon**: Xiaozhi's event provides free fully upgraded disc.

## S-Rank Disc Recommendations

| Disc | Best For | Core Effect |
|------|----------|-------------|
| Golden ATK Disc | DPS carries | ATK + Crit Rate major boost |
| Golden Support Disc | Buff supports | Energy Regen + Effect Duration extension |
| Golden DEF Disc | Tanks/Survival | DMG Reduction + Shield Strength enhancement |
| Golden Heal Disc | Healers | Heal Bonus + Additional Recovery effects |

## Stat Priority by Role

**DPS**: Crit Rate > Crit DMG > ATK% > Elemental DMG
**Support**: Energy Regen > Effect Hit > HP% > DEF%
**Tank**: HP% > DEF% > DMG Reduction > Energy Regen
**Healer**: HP% > Energy Regen > Heal Bonus > DEF%

## Disc Enhancement

Use same-quality discs as enhancement material. Priority:
1. S-rank discs: Enhance to max level immediately
2. A-rank discs: Use as transition, enhance to +12 max
3. B/C-rank discs: Use as enhancement fodder only

## Best Discs Per Character

- **Nanally**: Golden ATK Disc with Crit/ATK substats
- **Jiuyuan**: Golden Support Disc with Energy Regen substats
- **Baicang**: Golden ATK Disc with ATK%/Elemental DMG substats
- **Hotori**: Golden Support Disc with HP/Energy Regen substats
- **Adler**: Golden DEF Disc with HP/DEF substats
- **Xiaozhi**: Golden ATK Disc (free from City Tycoon, already maxed)`;
}

fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2));
console.log('Updated tier-list and arc-disc-guide');
