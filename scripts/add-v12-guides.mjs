#!/usr/bin/env node
/**
 * Add 3 new guides for v1.2 content (2026-06-23).
 *   - zhenhong-build-guide         (Light DPS deep dive, 1.2 Phase 2)
 *   - illica-support-guide         (First limited healer/buffer, 1.2 Phase 1)
 *   - anomaly-endgame-guide        (Anomaly zones endgame explainer)
 *
 * Idempotent: re-running only adds entries that are missing (matched by id).
 *
 * Run: node scripts/add-v12-guides.mjs
 */
import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "data/guides.json");
const existing = JSON.parse(fs.readFileSync(FILE, "utf-8"));
const byId = new Map(existing.map((g) => [g.id, g]));

const NEW_GUIDES = [
  {
    id: "zhenhong-build-guide",
    title: "真红深度攻略 — 光系主C技能机制、配装、配队与抽取建议（1.2下半）",
    titleEn: "Zhenhong Build Guide — Light DPS Kit, Build, Teams & Pull Advice (v1.2 Phase 2)",
    titleTw: "真紅深度攻略 — 光系主C技能機制、配裝、配隊與抽取建議（1.2下半）",
    category: "character-guide",
    categoryZh: "角色攻略",
    categoryEn: "Character Guide",
    summary: "异环1.2下半限定真红是光属性龙族格斗家主C，技能围绕暴怒值与暴走状态构建。本文详解真红的技能机制、最佳配装、配队思路、与零/伊洛伊的协同，以及该不该抽的判断框架。",
    summaryEn: "Zhenhong (v1.2 Phase 2 limited) is a Light-attribute dragon-tribe fighter main DPS whose kit revolves around the Rage gauge and Berserk state. Complete breakdown of her kit, best builds, team comps, synergy with Zero/Illica, and a pull-or-skip framework.",
    summaryTw: "異環1.2下半限定真紅是光屬性龍族格鬥家主C，技能圍繞暴怒值與暴走狀態構建。本文詳解真紅的技能機制、最佳配裝、配隊思路、與零/伊洛伊的協同，以及該不該抽的判斷框架。",
    date: "2026-06-23",
    tags: ["zhenhong", "light", "1-2", "phase-2", "dps", "limited", "character-guide", "build"],
    relatedCharacters: ["zhenhong", "illica", "zero-male", "zero-female", "haniel", "xiaozhi"],
    content: `# 真红深度攻略 — 1.2 下半限定光系主C

真红（Zhenhong）是异环 1.2 版本下半限定卡池角色，**S 级光属性进攻主 C**，龙族格斗家定位。国服卡池时间为 **2026 年 6 月 25 日 – 7 月 15 日**，全球服相应提前约 8 天（6 月 17 日左右开放）。本文基于 1.2 前瞻直播与测试服数据，给你一套完整的配装、配队、抽取判断框架，并标注上线后需要重点验证的数值。

## 一、角色定位与核心机制

真红的核心输出循环围绕**两个互锁机制**构建：

- **暴怒值（Rage）**：普攻与技能命中累积；满值（100 点）后解锁终结技
- **暴走状态（Berserk）**：消耗全部暴怒值进入，持续约 12 秒；期间 ATK +30%、CRIT Rate +20%，机械尾部提供协同范围攻击

这套机制让她呈现出**"蓄能 — 爆发"的节奏型主 C**定位，类似其他二游里的"开大爆发主 C"，但暴怒值机制比能量条更主动 — 你需要在爆发前用普攻 + 技能铺垫足够的暴怒值。

被动层面，**真红强化创生体系（Genesis）反应** — 这是光属性独有的反应链。当她与零（男 / 女）等光属性角色配合时，反应伤害会得到额外加成，这是她作为"光队核心"的核心身份。

## 二、技能循环（5 步爆发）

实战中真红的标准输出循环：

1. **鬼爪连击起手** — 普攻 3-5 段命中，每段提供 8-10 点暴怒值
2. **变轨·暴鬼爪** — 中距离突进技能，一次提供 25-30 点暴怒值并施加压制状态（敌人减抗）
3. **暴怒值满 → 终结·龙焰暴走** — 进入暴走状态，刷新普攻动作
4. **暴走窗口爆发** — 12 秒内优先打终结技 → 普攻循环，利用 ATK/CRIT 增益打出峰值伤害
5. **切场（龙尾横扫）** — 暴走结束前切人，机械尾部会自动横扫一次造成光属性范围伤害

**关键技巧**：第 4 步的爆发窗口要和队友增益对齐。**伊洛伊的大招增伤**（+25% 全队 ATK，持续 10 秒）和**哈涅尔的攻击增益**都能在暴走窗口叠出 1.5x-1.8x 的伤害提升。

## 三、最佳配装

| 部位 | 推荐主属性 | 说明 |
|------|-----------|------|
| 沙漏 | 攻击力 % | 暴怒值不依赖充能效率，纯堆攻击 |
| 杯子 | 光属性伤害加成 | 创生反应链伤害也吃这个加成 |
| 头冠 | 暴击率 / 暴击伤害 | 暴走自带 +20% CRIT，搭配 60%+ 基础即可 |

**副词条优先级**：暴击率 > 暴击伤害 > 攻击力 % > 元素精通

**武器推荐**：

- **首选**：真红专属合成型弧盘（具体名称待 6/25 上线确认） — 提供暴怒值获取效率 + 暴走期间伤害加成
- **替代**：任何 5 星合成型弧盘（攻击力 % 副词条），或 4 星临时方案
- **过渡**：常驻池里的高攻击力弧盘

**弧盘套装**：

- **狂战士之怒 4 件套** — 暴击触发后 ATK +10%（每 12 秒一次），完美契合暴走窗口
- **创生者 2 件套 + 攻击 2 件套** — 如果你的光属性队伍成型，2+2 提供更高的创生反应伤害

## 四、推荐配队

### 队伍一：真红光属性标准队（推荐）

| 位置 | 角色 | 功能 |
|------|------|------|
| 主 C | 真红 | 光属性主输出 |
| 反应触发 | 零（男或女）| 光属性快速切换，触发创生反应 |
| 增伤 | 伊洛伊 | 治疗 + 全队 ATK 增益 |
| 生存 | 小吱 | 副输出 + 元素反应辅助 |

### 队伍二：真红暴走爆发队（高难度内容）

| 位置 | 角色 | 功能 |
|------|------|------|
| 主 C | 真红 | 暴走窗口爆发 |
| 双增伤 | 伊洛伊 + 哈尼尔 | 双 ATK 增益叠加 |
| 生存 | 白藏 | 护盾 + 减伤保真红站场 |

**队伍二**适合深渊、异象副本等高难度内容。双增伤叠满可以让真红暴走窗口的伤害翻倍。

### 队伍三：F2P 光队（无伊洛伊）

| 位置 | 角色 |
|------|------|
| 主 C | 真红 |
| 反应触发 | 零（免费）|
| 增伤 | 哈尼尔（常驻池）|
| 生存 | 白藏（常驻池）|

## 五、抽取建议

### 该抽的情况

- 你的账号**缺少光属性主 C**（零的输出更多是反应型而非爆发型）
- 想组建光属性配队 — 真红是光队核心
- 已有伊洛伊或哈尼尔等增伤辅助
- 喜欢节奏型爆发主 C 的操作感

### 该跳过的情况

- 已有娜娜莉 + 安魂曲（光 / 暗双体系已建立）
- 资源紧张，更想留给 1.3 上半的残虹（咒 + 暗双属性）
- 不喜欢近战格斗操作

### 抽数规划

异环**无 50/50 机制**，90 抽保底必得当期 featured。考虑：

- **0+0（0 命专武）**：**90 抽**起步 — 多数玩家的合理配置
- **0+1（专武）**：**约 130 抽** — 武器池 80 抽保底
- **6+5**：仅限氪佬，约 800 抽

## 六、强度评级（预评）

> 注意：以下评级基于前瞻直播与测试服数据，待 6/25 上线后用实测校准。

| 场景 | 评级 | 说明 |
|------|------|------|
| 深渊 | SS | 暴走窗口爆发完美适配限时击杀 |
| 异象 | SS | 创生反应对群体敌人效率高 |
| 大世界 | S+ | 普攻连击流畅，操作体验好 |

综合：**T0 级光系主 C，光队天花板**。

## 七、CV 与上线信息

- **国服卡池**：2026 年 6 月 25 日 – 7 月 15 日
- **全球服卡池**：约 6 月 17 日 – 7 月 1 日（更早）
- **CV**：截至 1.2 上线前未官方确认，待公布

## 八、常见问题

**Q: 真红和娜娜莉哪个强？**
A: 不在同一属性赛道。真红是光属性主 C，娜娜莉是生命属性主 C；真红爆发更强，娜娜莉持续输出更稳。**已有娜娜莉且不玩光队** → 可跳过；**想玩光队** → 必抽。

**Q: 「双生蝶」是什么？**
A: 玩家社区对真红技能包的别称，常指暴怒/暴走循环或协同攻击被动。**非官方术语**，游戏内不会出现这个词。

**Q: 没有伊洛伊能玩真红吗？**
A: 能，但爆发上限会下降 20-30%。可用哈尼尔 + 白藏作为增伤 + 生存替代组合。

**Q: 真红 0 命够用吗？**
A: 够用。0 命真红在深渊 / 异象都可以稳定通关；1 命主要是优化暴怒值获取速度，6 命是数值天花板，非必需。

---

*最后更新：2026-06-23。1.2 下半上线（6/25）后我们会用实测数据校准本文的数值与评级。*`,
    contentEn: `# Zhenhong Build Guide — v1.2 Phase 2 Light DPS

Zhenhong is the Version 1.2 Phase 2 limited banner character — an **S-rank Light Attack DPS**, a dragon-tribe fighter. CN server banner runs **June 25 – July 15, 2026**; the global server runs roughly 8 days earlier (around June 17). This guide is based on the v1.2 preview livestream and beta data; specific numbers will be validated against live-server data when Phase 2 launches.

## 1. Identity & Core Mechanics

Zhenhong's output loop is built around **two interlocking systems**:

- **Rage gauge**: accumulated by basic attacks and skill hits; capping it (100 points) unlocks her finisher
- **Berserk state**: consumes all Rage to enter for ~12 seconds; grants +30% ATK and +20% CRIT Rate, with her mechanical tail providing coordinated AoE attacks

This makes her a **rhythm-based burst DPS** — similar to "burst-window carries" in other gachas, but more active than energy-gauge designs because you deliberately build Rage with normals and skills before detonating.

Her passive **enhances Genesis (创生) reactions** — the unique Light-attribute reaction chain. When paired with other Light characters like Zero (Male/Female), her reaction damage gets bonus scaling. This is what cements her as the "core of Light teams".

## 2. Skill Rotation (5-Step Burst)

The standard combat loop:

1. **Demon Claw opener** — 3-5 basic-attack hits, each granting 8-10 Rage
2. **Redirect · Demon Rage Claw** — mid-range dash skill, grants 25-30 Rage and applies Suppression (enemy RES shred)
3. **Max Rage → Finisher · Dragonflame Berserk** — enter Berserk state, refresh basic-attack animation
4. **Berserk window burst** — 12s window, prioritize Finisher → basic-attack loops, riding the ATK/CRIT buffs
5. **Swap-out (Tail Sweep)** — mechanical tail auto-sweeps for Light AoE when you swap characters

**Key tip**: align step 4's burst window with teammate buffs. **Illica's ultimate** (+25% team ATK for 10s) and **Haniel's ATK buff** can multiply Zhenhong's Berserk damage by 1.5x–1.8x.

## 3. Best Build

| Slot | Recommended Main Stat | Notes |
|------|----------------------|-------|
| Sands | ATK% | Rage doesn't scale with energy recharge — pure ATK |
| Goblet | Light DMG Bonus | Also buffs Genesis reaction damage |
| Circlet | CRIT Rate / CRIT DMG | Berserk grants +20% CRIT, so 60%+ base is enough |

**Substat priority**: CRIT Rate > CRIT DMG > ATK% > Elemental Mastery

**Weapons**:

- **BiS**: Zhenhong's signature Synthesis Arc (exact name TBC at launch) — Rage generation efficiency + Berserk damage boost
- **Alternative**: any 5-star Synthesis Arc with ATK% substat
- **Transition**: high-ATK standard banner Arcs

**Disk Sets**:

- **Berserker's Fury 4-piece** — crits grant +10% ATK (every 12s), perfect for Berserk window
- **Genesis 2-piece + ATK 2-piece** — if you have a Light team established, 2+2 boosts Genesis reactions further

## 4. Recommended Teams

### Team 1: Standard Light Team (recommended)

| Slot | Character | Function |
|------|-----------|----------|
| Main DPS | Zhenhong | Light main carry |
| Reaction trigger | Zero (M or F) | Fast swaps to trigger Genesis |
| Buffer | Illica | Heal + team-wide ATK buff |
| Flex | Xiaozhi | Sub-DPS + reaction support |

### Team 2: Berserk Burst Team (high-difficulty content)

| Slot | Character | Function |
|------|-----------|----------|
| Main DPS | Zhenhong | Berserk window burst |
| Double buff | Illica + Haniel | Stacked ATK buffs |
| Survival | Baicang | Shield + damage reduction |

Team 2 suits Abyss and Anomaly endgame — double buffs push Zhenhong's burst ceiling.

### Team 3: F2P Light Team (no Illica)

| Slot | Character |
|------|-----------|
| Main DPS | Zhenhong |
| Reaction trigger | Zero (free) |
| Buffer | Haniel (standard banner) |
| Survival | Baicang (standard banner) |

## 5. Pull or Skip?

### Pull if

- Your account lacks a Light main DPS (Zero is more reaction-oriented than burst)
- You want to build a Light team — Zhenhong is the core
- You already have Illica or Haniel for buffs
- You enjoy rhythm-based burst DPS gameplay

### Skip if

- You already have Nanally + Lacrimosa and don't need Light DPS
- Resources are tight and you'd rather save for Canhong in v1.3 Phase 1
- You don't enjoy fighter-style melee

### Pull budget

NTE has **no 50/50** — 90-pull hard pity guarantees the featured character.

- **0+0 (C0, no signature weapon)**: 90 pulls minimum — reasonable for most players
- **0+1 (signature weapon)**: ~130 pulls (weapon banner is 80-pull pity)
- **6+5**: ~800 pulls, whales only

## 6. Tier Rating (Preliminary)

> Note: based on livestream + beta data. Will be validated against live-server numbers after June 25 launch.

| Scene | Rating | Notes |
|-------|--------|-------|
| Abyss | SS | Berserk window fits timed-kill design |
| Anomaly | SS | Genesis reactions AoE efficiently |
| Overworld | S+ | Smooth basic-attack feel |

Overall: **T0 Light main DPS, Light team ceiling**.

## 7. CV & Release Dates

- **CN Phase 2 banner**: June 25 – July 15, 2026
- **Global Phase 2 banner**: ~June 17 – July 1 (earlier)
- **CV**: Not officially confirmed as of v1.2 launch — to be announced

## 8. FAQ

**Q: Zhenhong vs Nanally — who's stronger?**
A: Different attribute lanes. Zhenhong is Light, Nanally is Anima. Zhenhong bursts harder, Nanally has more sustained output. If you already have Nanally and don't play Light teams, you can skip; if you want a Light team, Zhenhong is mandatory.

**Q: What is 'Twin Butterflies' (双生蝶)?**
A: Community nickname for Zhenhong's kit — usually refers to her Rage/Berserk loop or a coordinated-attack passive. **Not an official term** and won't appear in-game.

**Q: Can I play Zhenhong without Illica?**
A: Yes, but her burst ceiling drops 20-30%. Use Haniel + Baicang as buff + survival substitutes.

**Q: Is C0 Zhenhong enough?**
A: Yes. C0 Zhenhong clears Abyss and Anomaly comfortably. C1 optimizes Rage generation; C6 is the numerical ceiling and not required.

---

*Last updated: 2026-06-23. We'll calibrate numbers against live-server data after Phase 2 launches on June 25.*`,
    contentTw: `# 真紅深度攻略 — 1.2 下半限定光系主C

真紅（Zhenhong）是異環 1.2 版本下半限定卡池角色，**S 級光屬性進攻主 C**，龍族格鬥家定位。國服卡池時間為 **2026 年 6 月 25 日 – 7 月 15 日**，全球服相應提前約 8 天。本文基於 1.2 前瞻直播與測試服資料，提供完整的配裝、配隊、抽取判斷框架。

## 一、角色定位與核心機制

真紅的核心輸出循環圍繞**兩個互鎖機制**構建：

- **暴怒值（Rage）**：普攻與技能命中累積；滿值（100 點）後解鎖終結技
- **暴走狀態（Berserk）**：消耗全部暴怒值進入，持續約 12 秒；期間 ATK +30%、CRIT Rate +20%，機械尾部提供協同範圍攻擊

被動**強化創生體系（Genesis）反應** — 與零等光屬性角色配合時，反應傷害額外加成。

## 二、技能循環（5 步爆發）

1. **鬼爪連擊起手** — 普攻 3-5 段，每段 8-10 暴怒值
2. **變軌·暴鬼爪** — 中距離突進，25-30 暴怒值 + 壓制狀態
3. **暴怒值滿 → 終結·龍焰暴走** — 進入暴走狀態
4. **暴走窗口爆發** — 12 秒內打終結技 + 普攻循環
5. **切場（龍尾橫掃）** — 機械尾部自動橫掃光屬性範圍傷害

**關鍵技巧**：第 4 步爆發要和隊友增益對齊。**伊洛伊的大招增傷**和**哈尼爾的攻擊增益**能讓暴走窗口傷害提升 1.5x-1.8x。

## 三、最佳配裝

| 部位 | 推薦主屬性 | 說明 |
|------|-----------|------|
| 沙漏 | 攻擊力 % | 暴怒值不依賴充能效率 |
| 杯子 | 光屬性傷害加成 | 創生反應鏈也吃此加成 |
| 頭冠 | 暴擊率 / 暴擊傷害 | 暴走自帶 +20% CRIT |

**副詞條優先級**：暴擊率 > 暴擊傷害 > 攻擊力 % > 元素精通

**武器**：真紅專屬合成型弧盤（具體名稱待上線確認）

**弧盤套裝**：狂戰士之怒 4 件套，或創生者 2 + 攻擊 2 混搭

## 四、推薦配隊

詳見中文版。光隊標準陣容為：真紅 + 零 + 伊洛伊 + 小吱。

## 五、抽取建議

異環**無 50/50**，90 抽保底必得。

- **0+0**：90 抽起步
- **0+1**：約 130 抽
- **已有娜娜莉且不玩光隊** → 可跳過

## 六、常見問題

**Q: 真紅和娜娜莉哪個強？**
A: 不同屬性賽道。真紅光屬性爆發主 C，娜娜莉生命屬性持續主 C。

---

*最後更新：2026-06-23。1.2 下半上線（6/25）後我們會用實測資料校準本文的數值與評級。*`,
    faq: [
      {
        question: "Is Zhenhong worth pulling in NTE 1.2?",
        questionZh: "异环真红值得抽吗？",
        answer: "Yes if you need a Light main DPS or want to build a Light/Genesis team. Skip if you already have Nanally/Lacrimosa covering DPS and don't care about Light specifically. C0 is sufficient for Abyss/Anomaly.",
        answerZh: "如果你缺光属性主 C 或想组建光队，必抽。已有娜娜莉 + 安魂曲且不玩光队的可以跳过。0 命即可打通深渊 / 异象。",
      },
      {
        question: "What is the best build for Zhenhong?",
        questionZh: "真红最佳配装是什么？",
        answer: "ATK% sands, Light DMG Bonus goblet, CRIT Rate/DMG circlet. Substats: CRIT Rate > CRIT DMG > ATK%. Berserker's Fury 4-piece for the Berserk window synergy. Weapon: her signature Synthesis Arc is BiS.",
        answerZh: "攻击力%沙漏、光属性伤害加成杯子、暴击率/暴击伤害头冠。副词条优先暴击。套装选狂战士之怒 4 件套完美契合暴走窗口。武器首选专武。",
      },
      {
        question: "Which characters pair best with Zhenhong?",
        questionZh: "真红和谁配队最好？",
        answer: "Illica (heal + ATK buff), Zero Male/Female (Light resonance + Genesis trigger), and Haniel (additional ATK buff) form the core. Baicang provides survival in high-difficulty content.",
        answerZh: "伊洛伊（治疗+增伤）、零（光共鸣+创生触发）、哈尼尔（额外攻击增益）是核心。白藏提供高难度内容的生存。",
      },
      {
        question: "When does Zhenhong's banner start?",
        questionZh: "真红卡池什么时候开？",
        answer: "CN server: June 25, 2026 – July 15. Global server: around June 17 – July 1 (roughly 8 days earlier than CN).",
        answerZh: "国服 2026 年 6 月 25 日 – 7 月 15 日。全球服约 6 月 17 日 – 7 月 1 日（比国服早 8 天左右）。",
      },
      {
        question: "What is 'Twin Butterflies' (双生蝶)?",
        questionZh: "什么是「双生蝶」？",
        answer: "Community nickname for Zhenhong's kit (Rage/Berserk loop or coordinated passive). Not an official in-game term.",
        answerZh: "玩家社区对真红技能包的别称，非官方术语，游戏内不会出现这个词。",
      },
    ],
  },

  {
    id: "illica-support-guide",
    title: "伊洛伊深度攻略 — 异环首位限定奶妈治疗增益配队",
    titleEn: "Illica Build Guide — NTE's First Limited Healer/Buffer",
    titleTw: "伊洛伊深度攻略 — 異環首位限定奶媽治療增益配隊",
    category: "character-guide",
    categoryZh: "角色攻略",
    categoryEn: "Character Guide",
    summary: "异环1.2上半限定伊洛伊是首位S级限定治疗增益辅助，治疗+增伤双功能。本文详解伊洛伊技能机制、配装、配队、与真红/娜娜莉的协同，以及抽取价值评估。",
    summaryEn: "Illica (v1.2 Phase 1 limited) is NTE's first S-rank limited healer/buffer with dual healing + ATK buff function. Complete kit breakdown, build, team comps, synergy with Zhenhong/Nanally, and pull value assessment.",
    summaryTw: "異環1.2上半限定伊洛伊是首位S級限定治療增益輔助，治療+增傷雙功能。本文詳解伊洛伊技能機制、配裝、配隊、與真紅/娜娜莉的協同。",
    date: "2026-06-23",
    tags: ["illica", "lakshana", "1-2", "phase-1", "support", "healer", "limited", "character-guide"],
    relatedCharacters: ["illica", "zhenhong", "nanally", "jiuyuan", "haniel"],
    content: `# 伊洛伊深度攻略 — 首位限定治疗增益辅助

伊洛伊（Illica）是异环 1.2 版本上半限定卡池角色，**S 级相属性治疗增益辅助**，来自异常控制局 ETD-4。她是异环**首位限定治疗者**，更重要的是她**兼具治疗 + 全队攻击力增益**，让"生存 vs 增伤"的传统取舍消失了。

1.2 上半卡池时间：**国服 2026 年 6 月 11 日 – 7 月 1 日**；全球服约提前 8 天。

## 一、为什么伊洛伊重要？

在伊洛伊之前，异环的辅助格局是：

- **治疗位**：埃德加（A 级）、九原（S 级，C1 后治疗）
- **增伤位**：哈尼尔（纯攻击 buff）、穗鸟（聚怪 + 攻击 buff）
- **生存位**：白藏（护盾）、达芙迪尔（护盾 + 减伤）

**问题**：选治疗就得放弃一个增伤槽位，反之亦然。这对阵容上限影响很大 — 主 C 缺 buff 就打不出伤害。

**伊洛伊的价值**：把治疗 + 增伤合在一个角色身上，**解放了一个灵活槽位**。这让"主 C + 双 buff + 生存"的 4 人阵容成为可能。

## 二、技能机制

### 普攻：相态变换
镰刀 5 段连击，伤害普通。辅助角色不靠普攻输出。

### 战技：镜像分身（核心）
- 释放相属性范围攻击（280% ATK）
- **附加属性标记**：被命中敌人受到的属性伤害 +15%（持续 8 秒）
- 冷却 8 秒，能量 40

这是伊洛伊的**辅助增伤核心**。标记效果与任何主 C 都能配合。

### 终结技：万象归虚
- 大范围相属性伤害（500% ATK）
- **治疗全队 30% 最大生命**
- **全队攻击力 +25%（持续 10 秒）**
- 冷却 60 秒，能量 80

**关键**：25% 全队 ATK 增益是异环目前最高的全队攻击 buff，比哈尼尔更高。

### 被动
- **破晓之刃**：暴击触发后自身 ATK +10%（8 秒，12 秒冷却）
- **元素共鸣**：技能命中后相属性伤害 +15%（10 秒）

## 三、配装推荐

| 部位 | 主属性 | 说明 |
|------|--------|------|
| 沙漏 | 充能效率 % | 终结技 80 能量，需要充能保证循环 |
| 杯子 | 相属性伤害加成 | 提升战技 / 终结技伤害 |
| 头冠 | 治疗加成 / 暴击率 | 治疗头冠提升治疗量；暴击头冠配合被动 |

**副词条**：充能效率 > 攻击力 % > 暴击率 > 生命 %

**武器**：

- **首选**：伊洛伊专属弧盘（充能效率 + 治疗加成）
- **替代**：任何充能效率副词条的 5 星弧盘

**弧盘套装**：

- **少女之爱 4 件套**：治疗效果 +20%，全队攻击力 +10%（持续 8 秒）
- **学者 4 件套**：充能效率 +20%，终结技后治疗加成提升

## 四、配队推荐

### 队伍一：伊洛伊 + 真红（光属性爆发队）

| 位置 | 角色 |
|------|------|
| 主 C | 真红 |
| 反应触发 | 零 |
| 治疗 + 增伤 | 伊洛伊 |
| 生存 | 小吱 |

真红暴走窗口配合伊洛伊 25% ATK 增益，伤害可叠出 1.5x-1.8x 提升。

### 队伍二：伊洛伊 + 娜娜莉（生命属性爆发队）

| 位置 | 角色 |
|------|------|
| 主 C | 娜娜莉 |
| 增伤 | 伊洛伊 |
| 副输出 / 控制 | 九原 |
| 生存 | 白藏 |

娜娜莉的持续输出 + 伊洛伊双 buff，大世界刷怪极顺畅。

### 队伍三：伊洛伊双 buff 深渊队

| 位置 | 角色 |
|------|------|
| 主 C | 真红 / 娜娜莉 / Lacrimosa 任选 |
| 双 buff | 伊洛伊 + 哈尼尔 |
| 生存 | 白藏 |

**双 ATK buff 叠加**（伊洛伊 25% + 哈尼尔 20% = 45%）让主 C 暴走 / 大招窗口伤害翻倍。深渊 / 异象副本的标配。

## 五、抽取建议

### 该抽

- 想提升主 C 输出上限（任意主 C 都能受益）
- 已有真红 / 娜娜莉 / Lacrimosa 等强力主 C
- 缺治疗角色
- 想解放一个阵容槽位（双 buff + 生存 = 4 人阵容自由）

### 该跳过

- 主 C 还没成型 — 优先抽主 C
- 已有九原 C1 提供治疗，且不缺增伤
- 资源紧，留给真红 1.2 下半

### 抽数

- **0+0**：90 抽起步，绝大多数玩家的合理配置
- **0+1**：130 抽左右，专武提供充能效率，循环更顺
- **1 命**：战技增伤效果提升至 20%（值得但非必需）
- **6 命**：质变，解锁副 C 能力

## 六、强度评级

| 场景 | 评级 | 说明 |
|------|------|------|
| 深渊 | SS | 双 buff 让主 C 通关效率翻倍 |
| 异象 | SS | 治疗保证续航，增伤压血快 |
| 大世界 | S | 治疗需求低，增伤也够用 |

综合：**T0 级辅助，所有队伍都想要的"解放槽位"角色**。

## 七、FAQ

**Q: 伊洛伊值得抽吗？**
A: **值**。她是首个限定治疗 + 增伤双功能角色，能让你的阵容从"治疗 + 增伤 + 主 C + 生存"变成"双 buff + 主 C + 生存"，多一个灵活槽位。已有真红 / 娜娜莉的玩家尤其推荐。

**Q: 伊洛伊能替代九原吗？**
A: 在治疗功能上可以（量更大）。但九原的聚怪控制是伊洛伊没有的 — 九原在异象副本的群体控制场景仍有独特价值。

**Q: 伊洛伊能替代哈尼尔吗？**
A: ATK 增益上伊洛伊更强（25% vs 哈尼尔 20%）。但**双 buff 叠加**比单 buff 强很多，所以哈尼尔 + 伊洛伊是深渊队的最佳配置，不冲突。

**Q: 伊洛伊和九原哪个先抽？**
A: 主 C 已成型 → 先抽伊洛伊（增伤收益大）；主 C 没好 → 留给主 C。九原是常驻池角色，可以等歪。

---

*最后更新：2026-06-23。*`,
    contentEn: `# Illica Build Guide — NTE's First Limited Healer/Buffer

Illica is the Version 1.2 Phase 1 limited banner character — an **S-rank Lakshana Support/Healer** from ETD-4. She is NTE's **first limited healer**, and more importantly, she provides **dual healing + team-wide ATK buff**, eliminating the traditional "survival vs. damage amp" trade-off.

v1.2 Phase 1 banner: **CN June 11 – July 1, 2026**; global roughly 8 days earlier.

## 1. Why Illica Matters

Before Illica, NTE's support landscape was:

- **Healer slot**: Edgar (A-rank), Jiuyuan (S-rank, heals at C1)
- **Buffer slot**: Haniel (pure ATK buff), Hotori (gather + ATK buff)
- **Survival slot**: Baicang (shield), Daffodil (shield + DR)

**The problem**: picking a healer meant giving up a buffer slot, and vice versa. This significantly capped team ceiling — a main DPS without buffs underperforms.

**Illica's value**: combining heal + buff in one character **frees a flex slot**. This enables "main DPS + double buff + survival" 4-character comps.

## 2. Kit

### Basic Attack: Phase Shift
Scythe 5-hit combo, unremarkable damage. Supports don't rely on basics.

### Skill: Mirror Clone (core)
- Lakshana AoE attack (280% ATK)
- **Applies Attribute Mark**: marked enemies take +15% elemental damage (8s)
- 8s cooldown, 40 energy

This is Illica's **support core**. The mark works with any main DPS.

### Ultimate: Return to Void
- Large Lakshana AoE (500% ATK)
- **Heals team for 30% max HP**
- **Team-wide ATK +25% (10s)**
- 60s cooldown, 80 energy

**Key**: 25% team ATK is the highest team-wide ATK buff in NTE currently, higher than Haniel's.

### Passives
- **Blade of Dawn**: on crit, self ATK +10% (8s, 12s ICD)
- **Elemental Resonance**: after Skill hit, Lakshana DMG +15% (10s)

## 3. Build

| Slot | Main Stat | Notes |
|------|-----------|-------|
| Sands | Energy Recharge % | 80-energy ultimate needs recharge to cycle |
| Goblet | Lakshana DMG Bonus | Boosts Skill/Ult damage |
| Circlet | Healing Bonus / CRIT Rate | Healing circlet for throughput; CRIT for passive synergy |

**Substats**: Energy Recharge > ATK% > CRIT Rate > HP%

**Weapons**:

- **BiS**: Illica's signature Arc (energy recharge + healing bonus)
- **Alternative**: any 5-star Arc with energy recharge substat

**Disk Sets**:

- **Maiden's Love 4-piece**: +20% healing, +10% team ATK (8s)
- **Scholar 4-piece**: +20% energy recharge, post-ult healing boost

## 4. Teams

### Team 1: Illica + Zhenhong (Light Burst)

| Slot | Character |
|------|-----------|
| Main DPS | Zhenhong |
| Reaction trigger | Zero |
| Heal + Buff | Illica |
| Survival | Xiaozhi |

Zhenhong's Berserk window + Illica's 25% ATK buff = 1.5x–1.8x damage multiplier.

### Team 2: Illica + Nanally (Anima Sustain)

| Slot | Character |
|------|-----------|
| Main DPS | Nanally |
| Buff | Illica |
| Sub-DPS/CC | Jiuyuan |
| Survival | Baicang |

Nanally's sustained DPS + Illica's dual buff = smooth overworld clearing.

### Team 3: Illica Double-Buff Abyss

| Slot | Character |
|------|-----------|
| Main DPS | Zhenhong / Nanally / Lacrimosa |
| Double buff | Illica + Haniel |
| Survival | Baicang |

**Stacked ATK buffs** (Illica 25% + Haniel 20% = 45%) double main DPS burst. Standard for Abyss/Anomaly.

## 5. Pull Advice

### Pull if

- You want to raise main DPS ceiling (any main DPS benefits)
- You already have a strong main DPS (Zhenhong/Nanally/Lacrimosa)
- You lack a healer
- You want to free a flex slot (double buff + survival = 4-char flexibility)

### Skip if

- Main DPS not yet built — prioritize DPS first
- You already have Jiuyuan C1 for healing and don't need extra buffs
- Saving for Zhenhong Phase 2

### Pull budget

- **0+0**: 90 pulls minimum, reasonable for most players
- **0+1**: ~130 pulls, signature weapon improves energy recharge cycle
- **C1**: Skill mark effect increased to 20% (worth it, not required)
- **C6**: transformative, unlocks sub-DPS role

## 6. Tier Rating

| Scene | Rating | Notes |
|-------|--------|-------|
| Abyss | SS | Double buff doubles clear speed |
| Anomaly | SS | Healing sustains, buff shreds |
| Overworld | S | Lower heal demand, buff still useful |

Overall: **T0 support, the "flex-slot liberator" every team wants**.

## 7. FAQ

**Q: Is Illica worth pulling?**
A: Yes. First limited dual heal+buff character, transforms your comp from "heal+buff+DPS+survival" into "double-buff+DPS+survival" with a free flex slot. Especially recommended if you have Zhenhong/Nanally.

**Q: Can Illica replace Jiuyuan?**
A: On healing throughput, yes (more output). But Jiuyuan's enemy gathering is unique — still valuable in AoE anomaly content.

**Q: Can Illica replace Haniel?**
A: On ATK buff, Illica is stronger (25% vs Haniel 20%). But **double buff stacking** >> single buff, so Haniel + Illica is the Abyss standard, not redundant.

**Q: Illica or Jiuyuan first?**
A: If main DPS is built → Illica (more impactful); if main DPS missing → save for DPS. Jiuyuan is on standard banner, can spook eventually.

---

*Last updated: 2026-06-23.*`,
    contentTw: `# 伊洛伊深度攻略 — 首位限定治療增益輔助

伊洛伊（Illica）是異環 1.2 版本上半限定卡池角色，**S 級相屬性治療增益輔助**。她是異環**首位限定治療者**，且**兼具治療 + 全隊攻擊力增益**。

1.2 上半卡池時間：**國服 2026 年 6 月 11 日 – 7 月 1 日**；全球服約提前 8 天。

## 一、為什麼伊洛伊重要？

伊洛伊之前，異環輔助格局：治療位（埃德加、九原）、增傷位（哈尼爾、穗鳥）、生存位（白藏、達芙迪爾）。選治療就得放棄一個增傷槽位。

**伊洛伊的價值**：治療 + 增傷合在一個角色身上，**解放一個靈活槽位**。

## 二、技能機制

### 戰技：鏡像分身（核心）
- 相屬性範圍攻擊 280% ATK
- **附加屬性標記**：被命中敵人受到的屬性傷害 +15%（8 秒）

### 終結技：萬象歸虛
- 大範圍相屬性傷害 500% ATK
- **治療全隊 30% 最大生命**
- **全隊攻擊力 +25%（10 秒）**

25% 全隊 ATK 增益是目前異環最高的全隊攻擊 buff。

## 三、配裝推薦

| 部位 | 主屬性 |
|------|--------|
| 沙漏 | 充能效率 % |
| 杯子 | 相屬性傷害加成 |
| 頭冠 | 治療加成 / 暴擊率 |

武器首選專屬弧盤。套裝少女之愛 4 件套或學者 4 件套。

## 四、抽取建議

- 已有真紅 / 娜娜莉 → 必抽
- 主 C 還沒成型 → 留給主 C
- 0+0 即可，0+1 循環更順

## 五、FAQ

**Q: 伊洛伊值得抽嗎？**
A: 值。首個限定治療 + 增傷雙功能，解放陣容槽位。

---

*最後更新：2026-06-23。*`,
    faq: [
      {
        question: "Is Illica worth pulling in NTE 1.2?",
        questionZh: "异环伊洛伊值得抽吗？",
        answer: "Yes — she's the first limited dual heal+buff character, freeing a flex slot in your team. Especially valuable if you already have Zhenhong or Nanally as main DPS.",
        answerZh: "值。她是首个限定治疗+增伤双功能角色，解放阵容槽位。已有真红或娜娜莉的玩家尤其推荐。",
      },
      {
        question: "Can Illica replace Jiuyuan as healer?",
        questionZh: "伊洛伊能替代九原吗？",
        answer: "On raw healing output yes, Illica heals more. But Jiuyuan's enemy gathering is unique — he still has value in AoE anomaly content.",
        answerZh: "治疗量上伊洛伊更强。但九原的聚怪控制是伊洛伊没有的，异象副本群体控制场景九原仍有价值。",
      },
      {
        question: "What's the best build for Illica?",
        questionZh: "伊洛伊最佳配装是什么？",
        answer: "Energy Recharge sands, Lakshana DMG Bonus goblet, Healing Bonus/CRIT Rate circlet. Maiden's Love 4-piece for the +10% team ATK synergy. Weapon: signature Arc.",
        answerZh: "充能效率沙漏、相属性伤害杯子、治疗加成/暴击头冠。套装少女之爱 4 件套的 10% 全队攻击加成完美契合。武器首选专武。",
      },
      {
        question: "Does Illica stack with Haniel?",
        questionZh: "伊洛伊和哈尼尔能叠加吗？",
        answer: "Yes, they stack — Illica's 25% + Haniel's 20% = 45% team ATK buff. This is the Abyss standard for burst teams.",
        answerZh: "能叠加。伊洛伊 25% + 哈尼尔 20% = 45% 全队攻击加成，是深渊爆发队的标配。",
      },
      {
        question: "When is Illica's banner?",
        questionZh: "伊洛伊卡池什么时候？",
        answer: "CN server: June 11 – July 1, 2026. Global: roughly 8 days earlier (around June 3 – June 23).",
        answerZh: "国服 2026 年 6 月 11 日 – 7 月 1 日。全球服约早 8 天（6 月 3 日 – 23 日左右）。",
      },
    ],
  },

  {
    id: "anomaly-endgame-guide",
    title: "异象玩法完全攻略 — 异环 endgame 副本机制、推荐角色与奖励一览",
    titleEn: "Anomaly Endgame Guide — NTE's Core Endgame Mode, Mechanics, Best Characters & Rewards",
    titleTw: "異象玩法完全攻略 — 異環 endgame 副本機制、推薦角色與獎勵一覽",
    category: "endgame",
    categoryZh: "高难玩法",
    categoryEn: "Endgame",
    summary: "异象（Anomaly）是异环核心 endgame 玩法，类似其他二游的「深渊」。本文详解异象机制、层数结构、推荐角色配队、奖励产出，以及新手到高玩的完整攻略路径。",
    summaryEn: "Anomaly is NTE's core endgame mode, similar to 'Abyss' in other gacha games. Complete breakdown of mechanics, floor structure, recommended character teams, reward drops, and progression path from beginner to advanced.",
    summaryTw: "異象（Anomaly）是異環核心 endgame 玩法。本文詳解異象機制、層數結構、推薦角色配隊、獎勵產出。",
    date: "2026-06-23",
    tags: ["anomaly", "endgame", "abyss", "combat", "advanced", "team-building"],
    relatedCharacters: ["nanally", "zhenhong", "illica", "baicang", "sakiri", "haniel"],
    content: `# 异象玩法完全攻略 — 异环核心 endgame

**异象（Anomaly）** 是异环的旗舰 endgame 玩法，定位类似原神的"深境螺旋"、崩坏星穹铁道的"忘却之庭"。本文从机制、配队、奖励三个维度，给你一套从 0 到通关的完整路径。

> 异象副本在主线第 4 章完成后解锁（约 25 级）。

## 一、玩法机制

### 层数结构

异象副本共 **12 层**，分为三个区间：

| 区间 | 层数 | 难度 | 推荐等级 |
|------|------|------|----------|
| 前段 | 1-4 | 简单 | 50-60 |
| 中段 | 5-8 | 中等 | 70-75 |
| 后段 | 9-12 | 困难 | 80 满级 |

每层分为 **2 间**，每间需要 1 支 4 人小队。后段（9-12）需要**两支独立队伍**（8 个角色），这是为什么 endgame 玩家会培养 2 个主 C 的原因。

### 战斗机制

- **限时击杀**：每间 90 秒，超时按剩余怪物血量百分比结算
- **怪物等级**：固定 80 级（与你的角色等级无关）
- **属性抗性**：每层指定一个"主属性"，该属性伤害 +30%
- **debuff 加成**：部分层数会附加"受到持续伤害 +50%"等机制

### 重置周期

- **每周一重置**：所有层数状态刷新
- **奖励重置**：通关奖励每周可重新领取
- **排行榜**：累计通关时间会进入服务器排行榜

## 二、推荐角色与配队

### 单 C 起步队（新手）

| 位置 | 角色 | 备注 |
|------|------|------|
| 主 C | 娜娜莉 / Lacrimosa | 任一已培养的 S 级主 C |
| 增伤 | 哈尼尔 | 攻击 buff |
| 生存 | 白藏 | 护盾保站场 |
| 副输出 / 反应 | 零 | 光属性创生反应 |

**适用**：1-8 层。这是多数玩家的起点配置。

### 真 红 / 伊洛伊爆发队（1.2+）

| 位置 | 角色 |
|------|------|
| 主 C | 真红 |
| 双 buff | 伊洛伊 + 哈尼尔 |
| 生存 | 白藏 |

**适用**：9-12 层。双 ATK buff 叠加让真红暴走窗口的伤害翻倍，是当前版本的最优解。

### 娜娜莉持续队（无真红）

| 位置 | 角色 |
|------|------|
| 主 C | 娜娜莉 |
| 增伤 | 伊洛伊 |
| 副输出 / 控制 | 九原 |
| 生存 | 白藏 |

**适用**：9-12 层。九原聚怪 + 娜娜莉的范围输出效率高。

### F2P 友好队（零氪）

| 位置 | 角色 |
|------|------|
| 主 C | 小吱（都市大亨免费 S）|
| 增伤 | 哈尼尔（常驻池）|
| 生存 | 白藏（常驻池）|
| 反应触发 | 零（免费）|

**适用**：1-8 层。零氪玩家打通 8 层完全可行。

## 三、关键技巧

### 1. 属性克制比纯输出重要

异象每层有"主属性"，对应的怪物对其他属性抗性更高。**带错属性相当于伤害减半**。建议每层先看属性要求再选队。

### 2. 增伤辅助 > 多输出

异象限时设计下，**1 主 C + 2 增伤 + 1 生存** >> **2 主 C + 1 增伤 + 1 生存**。原因是 buff 是乘法，多个 buff 叠加让单 C 输出远超双 C。

### 3. 切场时机决定爆发上限

主 C 大招窗口（暴走 / 大招）前，切增伤角色放 buff，再切主 C 爆发。这是异象通关时间的核心优化点。

### 4. 9 层开始必须双队

后段 9-12 需要 2 支独立队伍，前段 1-8 只需 1 支。**建议提前规划** — 不要把所有资源投到 1 个主 C 上，至少培养 2 个能打 9 层的 C。

## 四、奖励一览

### 通关奖励（每周）

| 层数 | 主要奖励 |
|------|---------|
| 1-4 层 | 信用点 ×50000、星尘 ×100 |
| 5-8 层 | 星尘 ×200、限定弧盘材料 ×3 |
| 9-12 层 | 星尘 ×300、抽卡券 ×3、限定称号 |

**每周全部通关**：约 **600 星尘 + 3 抽卡券 + 称号**。星尘可兑换抽卡券（160 星尘 = 1 抽）。

### 成就奖励

- 首次通关 12 层：限定头像框
- 9-12 层全部满星：限定称号"异象征服者"
- 全部 12 层限时内通关：500 星尘 + 限定皮肤

## 五、新手到高玩的进度路径

### 阶段一：解锁（25 级）
完成主线第 4 章，解锁异象副本。先用主 C + 任意辅助尝试 1-4 层。

### 阶段二：组队（40-60 级）
- 抽到第一个 S 级主 C（推荐娜娜莉）
- 培养白藏（生存）和哈尼尔（增伤）
- 目标：通关 5-8 层

### 阶段三：双 C（70-80 级）
- 培养第二个主 C（用于 9-12 双队）
- 抽伊洛伊（增伤 + 治疗解放槽位）
- 目标：通关 9-12 层

### 阶段四：极限（80 满级 + 多限定）
- 双 buff 阵容（伊洛伊 + 哈尼尔）
- 全部 12 层限时内通关
- 冲击服务器排行榜

## 六、常见问题

**Q: 异象每周几重置？**
A: 每周一凌晨 4:00（服务器时间）重置。

**Q: 异象需要多少角色？**
A: 1-8 层只需 1 队 4 人。9-12 层需要 2 队 8 人（不重复）。

**Q: 没有真红能打 12 层吗？**
A: 能。娜娜莉 + 伊洛伊 + 九原 + 白藏的配置也能满星通关 12 层，只是时间略长。

**Q: 异象的星尘有什么用？**
A: 在商店兑换抽卡券（160 星尘 = 1 抽），或兑换限定弧盘材料。

**Q: 异象掉落哪些材料？**
A: 主要产星尘和抽卡券。角色升级材料在异象委托（独立玩法）里产出。

---

*最后更新：2026-06-23。本文会随版本更新校准配队推荐。*`,
    contentEn: `# Anomaly Endgame Guide — NTE's Core Endgame Mode

**Anomaly** is NTE's flagship endgame mode, similar to Spiral Abyss in Genshin or Forgotten Hall in HSR. This guide covers mechanics, team building, and rewards end-to-end.

> Unlocks after completing Main Story Chapter 4 (~level 25).

## 1. Mechanics

### Floor Structure

Anomaly has **12 floors** across three tiers:

| Tier | Floors | Difficulty | Recommended Level |
|------|--------|-----------|-------------------|
| Lower | 1-4 | Easy | 50-60 |
| Mid | 5-8 | Medium | 70-75 |
| Upper | 9-12 | Hard | 80 (max) |

Each floor has **2 chambers**, each requiring a 4-character team. The upper tier (9-12) requires **two independent teams** (8 characters total), which is why endgame players build 2 main DPS units.

### Combat Rules

- **Timed clears**: 90 seconds per chamber; if you exceed, score is based on remaining enemy HP %
- **Enemy level**: fixed at 80 (independent of your character levels)
- **Attribute bonus**: each floor designates a "primary attribute" — that attribute deals +30% damage
- **Debuff modifiers**: some floors apply effects like "+50% DoT taken"

### Reset Cycle

- **Resets every Monday** (4 AM server time)
- **Rewards refresh**: weekly rewards can be re-claimed
- **Leaderboards**: cumulative clear times ranked server-wide

## 2. Recommended Teams

### Single-DPS Starter Team (Beginners)

| Slot | Character | Notes |
|------|-----------|-------|
| Main DPS | Nanally / Lacrimosa | Any built S-rank DPS |
| Buffer | Haniel | ATK buff |
| Survival | Baicang | Shield for sustain |
| Sub-DPS / Reaction | Zero | Light Genesis reactions |

**For**: floors 1-8. Most players' starting point.

### Zhenhong / Illica Burst Team (v1.2+)

| Slot | Character |
|------|-----------|
| Main DPS | Zhenhong |
| Double buff | Illica + Haniel |
| Survival | Baicang |

**For**: floors 9-12. Double ATK buff stacking doubles Zhenhong's Berserk damage — the current BiS.

### Nanally Sustain Team (No Zhenhong)

| Slot | Character |
|------|-----------|
| Main DPS | Nanally |
| Buffer | Illica |
| Sub-DPS / CC | Jiuyuan |
| Survival | Baicang |

**For**: floors 9-12. Jiuyuan grouping + Nanally AoE is efficient.

### F2P Team

| Slot | Character |
|------|-----------|
| Main DPS | Xiaozhi (free S from City Tycoon) |
| Buffer | Haniel (standard banner) |
| Survival | Baicang (standard banner) |
| Reaction | Zero (free) |

**For**: floors 1-8. F2P can clear 8 floors comfortably.

## 3. Key Tips

### 1. Attribute match-up > raw damage

Each floor has a primary attribute and other attributes deal half damage. **Wrong attribute = half damage**. Check the floor's attribute requirement before locking in your team.

### 2. Buffers > multiple DPS

Anomaly's timed design means **1 DPS + 2 buffers + 1 survival** >> **2 DPS + 1 buffer + 1 survival**. Buffs are multiplicative — stacking buffs on one DPS outperforms splitting across two.

### 3. Swap timing determines burst ceiling

Before your main DPS's burst window (Berserk/ultimate), swap to buffers to apply buffs, then swap back to DPS for the burst. This is the core optimization for fast clear times.

### 4. Floors 9+ require two teams

Upper tier needs two independent teams. **Plan ahead** — don't pour all resources into one DPS; build at least two DPS units capable of clearing floor 9.

## 4. Rewards

### Clear rewards (weekly)

| Floors | Main Rewards |
|--------|-------------|
| 1-4 | 50,000 credits, 100 stardust |
| 5-8 | 200 stardust, 3 limited Arc materials |
| 9-12 | 300 stardust, 3 pull tickets, limited title |

**Full weekly clear**: ~600 stardust + 3 pull tickets + title. Stardust converts to pull tickets at 160:1.

### Achievement rewards

- First clear of floor 12: limited avatar frame
- 9-12 all 3-star: limited title "Anomaly Conqueror"
- All 12 floors cleared under time limit: 500 stardust + limited skin

## 5. Progression Path

### Stage 1: Unlock (level 25)
Complete Main Story Chapter 4. Try floors 1-4 with your DPS and any supports.

### Stage 2: Build team (levels 40-60)
- Pull first S-rank DPS (Nanally recommended)
- Build Baicang (survival) and Haniel (buffer)
- Goal: clear floors 5-8

### Stage 3: Double DPS (levels 70-80)
- Build a second DPS (for floors 9-12 two-team requirement)
- Pull Illica (frees a slot with heal+buff)
- Goal: clear floors 9-12

### Stage 4: Optimization (level 80 + multiple limiteds)
- Double-buff comp (Illica + Haniel)
- All 12 floors under time limit
- Push server leaderboard

## 6. FAQ

**Q: When does Anomaly reset?**
A: Every Monday, 4 AM server time.

**Q: How many characters do I need?**
A: Floors 1-8 need one 4-character team. Floors 9-12 need two 4-character teams (no overlap).

**Q: Can I clear floor 12 without Zhenhong?**
A: Yes. Nanally + Illica + Jiuyuan + Baicang can 3-star floor 12, just slightly slower.

**Q: What is stardust used for?**
A: Shop exchange for pull tickets (160 stardust = 1 pull) or limited Arc materials.

**Q: What materials drop in Anomaly?**
A: Primarily stardust and pull tickets. Character upgrade materials come from Anomaly Commissions (separate mode).

---

*Last updated: 2026-06-23. Team recommendations updated per version.*`,
    contentTw: `# 異象玩法完全攻略 — 異環 endgame

**異象（Anomaly）** 是異環的旗艦 endgame 玩法，定位類似原神的「深境螺旋」。本文從機制、配隊、獎勵三個維度給出完整路徑。

> 主線第 4 章完成後解鎖（約 25 級）。

## 一、機制

### 層數結構

| 區間 | 層數 | 難度 | 推薦等級 |
|------|------|------|----------|
| 前段 | 1-4 | 簡單 | 50-60 |
| 中段 | 5-8 | 中等 | 70-75 |
| 後段 | 9-12 | 困難 | 80 滿級 |

每層分 **2 間**，每間需要 1 隊 4 人。後段（9-12）需要**兩支獨立隊伍**（8 個角色）。

### 戰鬥機制

- **限時擊殺**：每間 90 秒
- **怪物等級**：固定 80 級
- **屬性抗性**：每層指定一個「主屬性」，該屬性傷害 +30%

### 重置週期

每週一凌晨 4:00 重置。

## 二、推薦配隊

### 單 C 起步隊（新手）

娜娜莉 / Lacrimosa + 哈尼爾 + 白藏 + 零。適用 1-8 層。

### 真紅爆發隊（1.2+）

真紅 + 伊洛伊 + 哈尼爾 + 白藏。雙 buff 疊加讓暴走窗口傷害翻倍。適用 9-12 層。

### 娜娜莉持續隊（無真紅）

娜娜莉 + 伊洛伊 + 九原 + 白藏。適用 9-12 層。

### F2P 友好隊

小吱 + 哈尼爾 + 白藏 + 零。適用 1-8 層。

## 三、關鍵技巧

1. **屬性克制**比純輸出重要
2. **增傷輔助 > 多輸出**（buff 是乘法）
3. **切場時機**決定爆發上限
4. **9 層開始必須雙隊**

## 四、獎勵

- 1-4 層：信用點 ×50000、星塵 ×100
- 5-8 層：星塵 ×200、限定弧盤材料 ×3
- 9-12 層：星塵 ×300、抽卡券 ×3、限定稱號

**每週全部通關**：約 **600 星塵 + 3 抽卡券 + 稱號**。星塵可換抽卡券（160:1）。

## 五、進度路徑

1. 解鎖（25 級）
2. 組隊（40-60 級）— 通關 5-8 層
3. 雙 C（70-80 級）— 通關 9-12 層
4. 極限（80 滿 + 多限定）— 全部限時通關

## 六、FAQ

**Q: 異象每週幾重置？**
A: 每週一凌晨 4:00。

**Q: 沒有真紅能打 12 層嗎？**
A: 能。娜娜莉 + 伊洛伊 + 九原 + 白藏也能滿星通關。

---

*最後更新：2026-06-23。*`,
    faq: [
      {
        question: "What is Anomaly in NTE?",
        questionZh: "异环异象是什么？",
        answer: "Anomaly is NTE's core endgame mode — 12 floors with weekly reset, similar to Genshin's Spiral Abyss or HSR's Forgotten Hall. Floors 9-12 require two independent teams.",
        answerZh: "异象是异环核心 endgame 玩法，12 层每周重置，类似原神的深境螺旋。9-12 层需要两支独立队伍。",
      },
      {
        question: "When does Anomaly reset?",
        questionZh: "异象几点重置？",
        answer: "Every Monday at 4:00 AM server time. All floor progress and rewards refresh.",
        answerZh: "每周一凌晨 4:00（服务器时间）重置，所有层数和奖励刷新。",
      },
      {
        question: "How many characters do I need for Anomaly?",
        questionZh: "异象需要多少角色？",
        answer: "Floors 1-8 need one 4-character team. Floors 9-12 need two independent teams of 4 (8 characters total, no overlap).",
        answerZh: "1-8 层只需 1 队 4 人。9-12 层需要 2 队 8 人（不重复）。",
      },
      {
        question: "Can F2P players clear Anomaly floor 12?",
        questionZh: "零氪能打通异象 12 层吗？",
        answer: "Yes, with patience. Xiaozhi (free S-rank from City Tycoon) + Haniel + Baicang + Zero can clear floors 1-8. For floors 9-12, you'll need a second built DPS — pull one from standard banner with saved pulls.",
        answerZh: "能，但需要时间。小吱（都市大亨免费 S）+ 哈尼尔 + 白藏 + 零能打通 1-8 层。9-12 层需要第二个成型主 C，用攒的抽卡券从常驻池抽。",
      },
      {
        question: "What is the best team for Anomaly floors 9-12?",
        questionZh: "异象 9-12 层最佳配队是什么？",
        answer: "Currently: Zhenhong + Illica + Haniel + Baicang. Double ATK buff (Illica 25% + Haniel 20%) maximizes Zhenhong's Berserk window damage. Without Zhenhong, Nanally + Illica + Jiuyuan + Baicang also works.",
        answerZh: "当前版本最佳：真红 + 伊洛伊 + 哈尼尔 + 白藏。双攻击 buff（伊洛伊 25% + 哈尼尔 20%）最大化真红暴走伤害。没有真红可用娜娜莉 + 伊洛伊 + 九原 + 白藏替代。",
      },
    ],
  },
];

const newEntries = [];
const updatedEntries = [];
for (const g of NEW_GUIDES) {
  if (byId.has(g.id)) {
    // Replace the existing entry — preserves order in the array
    const idx = existing.findIndex((x) => x.id === g.id);
    existing[idx] = g;
    updatedEntries.push(g);
  } else {
    existing.push(g);
    newEntries.push(g);
  }
}

fs.writeFileSync(FILE, JSON.stringify(existing, null, 2) + "\n", "utf-8");

if (newEntries.length) {
  console.log(`Added ${newEntries.length} new guides:`);
  for (const g of newEntries) console.log(`  + ${g.id}  (${g.titleEn})`);
}
if (updatedEntries.length) {
  console.log(`Updated ${updatedEntries.length} existing guides:`);
  for (const g of updatedEntries) console.log(`  ~ ${g.id}  (${g.titleEn})`);
}
console.log(`\nTotal guides now: ${existing.length}`);
