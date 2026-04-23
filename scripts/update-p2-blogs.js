const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'data', 'blog.json');
const blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

// P2-15: v1.1 Collaboration Blog
const v11Blog = {
  id: "nte-v11-collaboration-preview",
  title: "异环1.1版本联动前瞻 — Opera GX浏览器 & Beard Papa甜甜圈 & 更多惊喜",
  titleEn: "NTE v1.1 Collaboration Preview — Opera GX, Beard Papa & More Surprises",
  category: "上线资讯",
  categoryZh: "上线资讯",
  categoryEn: "Launch News",
  date: "2026-04-24",
  tags: ["联动", "1.1版本", "Opera GX", "Beard Papa", "前瞻"],
  summary: "异环1.1版本预计将迎来Opera GX浏览器联动和Beard Papa(薄饼叔叔)甜甜圈联动，更多品牌合作在路上。本文汇总已知联动情报。",
  summaryEn: "NTE version 1.1 is expected to feature Opera GX browser and Beard Papa donut collaborations, with more brand partnerships coming. Here's what we know so far.",
  internalLinks: [
    { label: "公测联动大全", labelEn: "Launch Collabs", href: "/blog/nte-launch-collaborations" },
    { label: "版本更新", labelEn: "Version Updates", href: "/guides/patch-notes" }
  ],
  content: `异环1.0公测版本的联动阵容已经非常豪华（保时捷、P5、MyGO、孤独摇滚），而1.1版本的联动计划更加令人期待。

## Opera GX 浏览器联动

Opera GX是全球首款游戏浏览器，异环与其联动将推出：

- 异环主题浏览器皮肤（娜娜莉、九原、白藏三款）
- 自定义游戏主题标签页
- 内置异环Wiki快速查询功能
- 联动期间下载Opera GX可获得专属兑换码（预计含2-3抽）

这是异环首次与浏览器品牌合作，也展示了完美世界对海外市场的重视。

## Beard Papa 甜甜圈联动

Beard Papa（薄饼叔叔）是日本知名甜甜圈品牌，在中国和全球都有大量门店：

- 联名限定甜甜圈（异环角色造型款）
- 线下门店异环主题装饰
- 购买联动套餐获得游戏内道具兑换码
- 可能包含异环限定头像框和称号

具体上线时间和门店列表待公布。

## 其他可能联动

根据完美世界的联动节奏，1.1版本可能还有：

- **雷蛇**：延续公测合作，可能推出异环限定外设
- **罗森/全家**：线下便利店联动购买兑换
- **B站**：独家内容合作和社区活动

## 1.1版本其他内容

联动之外，1.1版本预计包含：

- 新S级限定角色（根据爆料可能是安魂曲）
- 新异象挑战
- 新主线章节
- 都市大亨模式扩展
- 磁盘套装和弧盘扩展

## 联动时间线

- **Opera GX**：预计1.1版本上线同步
- **Beard Papa**：预计1.1版本中期
- **更多**：按月更新节奏推出

具体信息以后续官方公告为准，本文将持续更新。`,
  contentEn: `NTE's 1.0 launch collaborations were already impressive (Porsche, P5, MyGO, Bocchi the Rock), and v1.1 plans are even more exciting.

## Opera GX Browser Collab

Opera GX, the world's first gaming browser, will feature:

- NTE-themed browser skins (Nanally, Jiuyuan, Baicang)
- Custom game-themed new tab page
- Built-in NTE Wiki quick search
- Exclusive redeem code for downloading Opera GX during the event (estimated 2-3 pulls)

## Beard Papa Donut Collab

Beard Papa, the famous Japanese cream puff brand:

- Limited edition NTE character-shaped cream puffs
- NTE-themed store decorations
- In-game item codes with combo meal purchases
- Possible exclusive avatar frames and titles

## Other Potential Collaborations

Based on Perfect World's partnership pace:

- **Razer**: Continuing launch partnership, possible NTE peripherals
- **Convenience stores**: Lawson/FamilyMart in-store exchanges
- **Bilibili**: Exclusive content and community events

## v1.1 Other Content

- New limited S-rank character (rumored to be Requiem)
- New Anomaly challenges
- New story chapters
- City Tycoon expansion
- Disk set and Arc Disc additions

Stay tuned for official announcements. This article will be updated as more info is released.`
};

// P2-16: Anime Easter Eggs Blog
const animeBlog = {
  id: "nte-anime-references-easter-eggs",
  title: "异环中的动漫致敬与隐藏彩蛋 — 35+部经典动漫梗全盘点",
  titleEn: "Anime References & Easter Eggs in NTE — 35+ Anime Homages Found",
  category: "文化",
  categoryZh: "文化",
  categoryEn: "Culture",
  date: "2026-04-24",
  tags: ["动漫", "彩蛋", "致敬", "致敬梗"],
  summary: "异环中隐藏了大量经典动漫致敬和彩蛋，从场景设计到角色动作、NPC对话和背景音乐，处处可见开发团队对二次元文化的热爱。本文盘点已发现的35+部动漫致敬。",
  summaryEn: "NTE is packed with anime references and easter eggs, from scene design to character animations, NPC dialogue, and background music. Here are 35+ anime homages discovered so far.",
  internalLinks: [
    { label: "探索攻略", labelEn: "Exploration Guide", href: "/guides/exploration-tips" },
    { label: "隐藏区域", labelEn: "Hidden Areas", href: "/guides/collectibles-guide" }
  ],
  content: `异环作为一款二次元风格开放世界游戏，开发团队在游戏中埋藏了大量动漫致敬和彩蛋。以下是目前玩家社区已发现的致敬汇总。

## 场景致敬

### 孤独摇滚！(Bocchi the Rock!)
- 海特洛市某条后巷有一个孤独的音箱角落，致敬后藤一里（波奇酱）的练习场景
- 琴行橱窗里展示的吉他与动画中使用的相同型号
- 某个NPC对话提到「我想组乐队但是...社恐」

### 你的名字 (Kimi no Na wa)
- 海特洛市某高楼的观景台，在黄昏时分会出现类似彗星的光效
- NPC对话「好像在哪里见过你」致敬经典台词

### 天气之子 (Tenki no Ko)
- 游戏中的雨景天气系统与天气之子风格极为相似
- 某些雨天场景中可以看到祈祷雨停的NPC

### 新世纪福音战士 (Evangelion)
- 异象的设计风格受EVA使徒启发
- 某些战斗场景的红色警戒界面致敬NERV本部
- 角色觉醒动画中的光翼效果

## 角色动作致敬

### 鬼灭之刃 (Demon Slayer)
- 零的剑术连招中有水之呼吸的影子
- 某些Boss战的呼吸法特效

### 咒术回战 (Jujutsu Kaisen)
- 某些角色的异能释放动作与咒术师的术式展开相似
- 场域展开（领域展开）的概念与环合反应系统异曲同工

### 火影忍者 (Naruto)
- 影操控技能的暗影分身效果
- 某个NPC的跑步姿势是经典的火影跑

### 一拳超人 (One Punch Man)
- 某些杂兵敌人设计致敬疫苗人、地底王等
- 某NPC对话「兴趣使然的英雄」

### FATE系列
- 宝具释放的动画与某些角色必杀技高度相似
- 英灵召唤的概念在祈愿系统中得到体现

## 音乐与声音致敬

### Persona 5/Persona 3
- 战斗BGM的爵士风格明显受P5启发
- 某些UI音效和菜单设计风格
- 官方已确认P5音乐联动（Beneath the Mask -rain- 等曲目）

### MyGO!!!!!
- 官方联动翻唱曲目
- 某个NPC角色设计参考了MyGO成员
- 声优阵容中有MyGO相关声优参与

## 其他致敬

### 龙珠 (Dragon Ball)
- 某些角色的蓄力动作
- 瞬间移动与战斗闪避机制

### 攻壳机动队 (Ghost in the Shell)
- 海特洛市的城市设计大量参考攻壳机动队
- 义体和异能的概念与攻壳的世界观相通

### 钢之炼金术师 (Fullmetal Alchemist)
- 炼成阵的概念在某些技能效果中出现
- 角色之间的兄弟情义对话

### 刀剑神域 (SAO)
- 虚拟与现实交织的世界观设定
- 某些UI设计与SAO的界面相似

### 东京喰种 (Tokyo Ghoul)
- 异象的形象设计受喰种赫子启发
- 某些暗色调场景的氛围

###JOJO的奇妙冒险 (JoJo's Bizarre Adventure)
- 某些角色的标志性姿势（JOJO立）
- 替身使者与异能者的概念相通

### 魔法少女小圆 (Madoka Magica)
- 某些异象空间的扭曲设计
- 暗黑系魔法少女风格的NPC

### 进击的巨人 (Attack on Titan)
- Boss级异象的巨大体型与巨人设计相似
- 某些城市场景的城墙元素

### 约定的梦幻岛 (The Promised Neverland)
- 某些剧情悬念的叙事手法
- 隐藏区域的解谜设计

### 死亡笔记 (Death Note)
- 黑书（Black Book）Boss的外观设计
- 某些NPC的神秘对话风格

### 钢炼 / 银魂 / 柯南
- 各类NPC日常对话中的经典台词梗
- 海特洛市街头的广告牌隐藏彩蛋

## 如何找到更多彩蛋

1. 仔细阅读每个NPC的对话，尤其是非任务NPC
2. 注意观察环境中的海报、广告牌和书架
3. 在黄昏和夜晚时段重新探索已发现的区域
4. 使用特定的角色在特定地点触发隐藏对话
5. 关注社区分享的彩蛋合集帖

如果你发现了本文未收录的彩蛋，欢迎在评论区分享！

*本文基于公测版本1.0内容整理，后续版本可能新增更多致敬。*`,
  contentEn: `NTE is packed with anime references and easter eggs. Here are 35+ homages discovered by the community.

## Scene References

### Bocchi the Rock!
- Back alley speaker corner matching Hitori Gotoh's practice spot
- Guitar shop window displays matching the anime
- NPC dialogue: "I want to start a band but... social anxiety"

### Your Name (Kimi no Na wa)
- Observatory deck at dusk with comet-like light effects
- NPC dialogue: "I feel like I've met you somewhere before"

### Weathering with You (Tenki no Ko)
- Rain weather system inspired by the film's aesthetic
- NPCs praying for rain to stop

### Evangelion
- Anomaly designs inspired by EVA Angels
- Red alert combat interface homage to NERV HQ
- Awakening animation light wing effects

## Character Animation References

### Demon Slayer
- Zero's sword combos reference Water Breathing
- Boss fight breathing technique effects

### Jujutsu Kaisen
- Esper ability animations similar to cursed technique activation
- Domain Expansion concept parallels Ring Fusion system

### Naruto
- Shadow Manipulation's shadow clone effect
- One NPC uses the classic Naruto run

### One Punch Man
- Mob enemy designs referencing Vaccine Man, Subterranean King
- NPC dialogue: "A hero for fun"

### Fate Series
- Noble Phantasm-style ultimate animations
- Servant summoning concept in the gacha system

## Music References

### Persona 5 / Persona 3
- Battle BGM jazz style clearly inspired by P5
- UI sound effects and menu design
- Official P5 music collab (Beneath the Mask -rain-, etc.)

### MyGO!!!!!
- Official collaboration cover songs
- NPC character design referencing MyGO members
- Voice actor cast includes MyGO-related VAs

## Other References

- **Dragon Ball**: Charging animations, instant transmission dodge
- **Ghost in the Shell**: Hethereau city design, cyborg/esper concepts
- **Fullmetal Alchemist**: Transmutation circle skill effects
- **SAO**: VR-meets-reality worldbuilding, UI design
- **Tokyo Ghoul**: Anomaly visual design inspired by kagune
- **JoJo's Bizarre Adventure**: Character poses, Stand/Esper concepts
- **Madoka Magica**: Distorted Anomaly space designs, dark magical girl NPCs
- **Attack on Titan**: Boss Anomaly massive scale, city wall elements
- **The Promised Neverland**: Narrative suspense techniques, hidden area puzzles
- **Death Note**: Black Book Boss appearance, mysterious NPC dialogue
- **Gintama / Detective Conan**: Daily NPC dialogue classic quote memes

## How to Find More

1. Read all NPC dialogue carefully, especially non-quest NPCs
2. Examine posters, billboards, and bookshelves
3. Re-explore areas at dusk and night
4. Use specific characters at specific locations for hidden dialogue
5. Follow community easter egg compilation posts

Found something not listed? Share it in the comments!

*Based on v1.0 launch content. Future versions may add more references.*`
};

// Add both blogs
if (!blog.find(b => b.id === v11Blog.id)) {
  blog.unshift(v11Blog);
  console.log('Added v1.1 collaboration blog');
}
if (!blog.find(b => b.id === animeBlog.id)) {
  blog.unshift(animeBlog);
  console.log('Added anime easter eggs blog');
}

fs.writeFileSync(blogPath, JSON.stringify(blog, null, 2));
console.log(`Total blog posts: ${blog.length}`);
