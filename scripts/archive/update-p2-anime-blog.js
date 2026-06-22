const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'data', 'blog.json');
const blog = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

const idx = blog.findIndex(b => b.id === 'nte-anime-references-easter-eggs');
if (idx < 0) { console.log('Blog not found'); process.exit(1); }

blog[idx].title = "异环动漫致敬彩蛋大全 — 100+动漫梗实锤盘点（言叶之庭/孤独摇滚/JoJo/你的名字）";
blog[idx].titleEn = "NTE Anime Easter Egg Mega-List — 100+ Anime References Confirmed (Garden of Words, Bocchi, JoJo, Your Name)";

blog[idx].summary = "异环被称为「最懂二次元的游戏」，海特洛市隐藏了100+个经典动漫场景复刻、招牌彩蛋和音乐致敬。本文按场景复刻、招牌广告、音乐联动三大类完整盘点。";
blog[idx].summaryEn = "NTE has been called 'the game that understands ACG culture best', with 100+ anime references hidden throughout Hetro City. Complete catalog organized by scene recreations, sign homages, and music collaborations.";

blog[idx].content = `异环被称为「最懂二次元的游戏」不是没有原因的——海特洛市几乎是一座用动漫梗建成的城市。玩家社区已整理出100+个动漫致敬彩蛋，从场景1:1复刻到招牌文字梗，处处都是开发团队对二次元文化的热爱。

## 场景1:1复刻（最震撼的彩蛋）

这些是海特洛市中完全复刻经典动漫名场面的地点，几乎每个都有对应的拍照打卡位：

| 动漫 | 复刻场景 | 位置提示 |
|------|----------|----------|
| 言叶之庭 | 雨亭场景被完整复刻 | 公园区域 |
| 哆啦A梦 | 空地和水泥管 | 住宅区后街 |
| 蜡笔小新 | 小新的家被复刻 | 郊区住宅 |
| 魔卡少女樱 | 企鹅王公园道具 | 中央公园 |
| CLANNAD | 樱花坡道场景 | 学校附近坡道 |
| 路人女主的养成方法 | 「侦探坡」 | 商业区斜坡 |
| Fate/stay night | 冬木大桥 | 城市大桥 |
| 白色相簿2 | 「熟练街」 | 商业街区域 |
| 数码宝贝 | 富士电视台大楼 | 城市地标 |
| 千与千寻 | 水上列车 | 特定路线 |
| 孤独摇滚！ | 下北泽Live House完整复刻 | 地下展演厅 |
| 轻音少女 | 吉他「吉太」出现 | 乐器店 |
| 头文字D | 藤原豆腐店和AE86 | 街道停车区 |
| 命运石之门 | 标志性招牌和手势场景 | 电器街 |
| 你的名字 | 标志性楼梯/阶梯场景 | 神社附近 |
| 灌篮高手 | 海边平交道口 | 铁路道口 |
| 秒速五厘米 | 铁路道口分离场景 | 铁路沿线 |
| 摇曳露营 | 色调和标志设计复刻 | 露营区 |
| 未闻花名 | 音乐和情感场景 | 秘密基地区域 |
| JoJo的奇妙冒险 | 照相馆切换为JoJo画风；标志性姿势 | 照相馆 |

## 招牌和广告梗（逛街时注意看）

海特洛市的商店招牌、餐厅名称和广告牌隐藏了大量文字梗：

- **龙猫/吉卜力**：「迷糊茶餐厅」等系列梗
- **悠哉日常大王**：日常风格店铺
- **钢之炼金术师**：招牌文字引用
- **东方Project**：游戏厅相关
- **胆大党(Dandadan)**：最新动漫梗
- **赛马娘**：竞技场周边
- **火影忍者**：写轮眼出现在招牌/广告中
- **主播女孩重度依赖**：网络相关店铺
- **狼与香辛料**：商行店铺名
- **银魂**：万事屋风格店铺
- **水星领航员(Aria)**：水都风格区域
- **恋如雨止**：咖啡馆场景
- **女神异闻录5**：官方联动店铺
- **食戟之灵**：餐厅相关
- **小林家的龙女仆**：公寓相关

## 音乐和音频致敬

### 车载收音机
异环的载具系统内置了收音机功能，可以听到多种联动BGM：

- **Persona 5 Royal**：雨天专属曲目「Beneath the Mask -rain-」等
- **P5X（女神异闻录5：夜幕魅影）**：OST可在收音机中播放
- **幻塔**：经典战斗和探索配乐
- **MyGO!!!!!**：游戏内角色明音现场演唱「迷星叫」，配有动态镜头和舞台灯光

### 声优跨次元梗
声优长谷川育美同时关联孤独摇滚！、MyGO!!!!!和异环三个IP，在游戏中实现了跨次元联动。

## 其他有趣彩蛋

- **无首铁驭（Ghost Rider摩托）**：致敬经典角色形象
- **小雪人NPC**：给整个城市带来一场盛夏雪景
- **锈轨花海**：天气相关的隐藏区域，包含战斗遭遇和收集内容
- **隐藏拍照点**：每个场景复刻点都有对应拍照任务

## 如何找到更多彩蛋

1. 推进主线解锁更多城区（许多彩蛋在后期区域）
2. 仔细阅读每个店铺的招牌和广告
3. 开车载着收音机在城市中转（会发现隐藏曲目）
4. 去照相馆触发JoJo画风彩蛋
5. 在不同天气/时段重访已知彩蛋点（部分彩蛋条件触发）
6. 关注B站UP主「苍白回响」的彩蛋合集视频

**推荐视频资源：**
- B站35个彩蛋对比视频：BV1uK3AzKEMu
- B站75个彩蛋合集：BV1WhgUzXEwe
- B站100+彩蛋全集：BV1YR3ozwEQ2

*本文基于公测版本1.0内容整理，持续更新中。发现新彩蛋欢迎补充！*`;

blog[idx].contentEn = `NTE has earned the title of "the game that understands ACG culture best" — and for good reason. Hetro City is essentially built from anime references. The community has cataloged 100+ easter eggs, from 1:1 scene recreations to sign text memes.

## 1:1 Scene Recreations (Most Impressive)

These locations in Hetro City faithfully recreate iconic anime scenes, each with a photo spot:

| Anime | Recreated Scene | Location Hint |
|-------|----------------|---------------|
| The Garden of Words | Rain pavilion scene | Park area |
| Doraemon | Empty lot and concrete pipes | Residential backstreet |
| Crayon Shin-chan | Shin-chan's house | Suburb residence |
| Cardcaptor Sakura | King Penguin park equipment | Central park |
| CLANNAD | Cherry blossom hill slope | Near school |
| Saekano | "Detective Slope" | Commercial district |
| Fate/stay night | Fuyuki Bridge | City bridge |
| White Album 2 | "Skilled Street" | Shopping street |
| Digimon Adventure | Fuji TV building | City landmark |
| Spirited Away | Water train | Specific route |
| Bocchi the Rock! | Shimokitazawa Live House | Underground venue |
| K-On! | Guitar "Gitah" appears | Music shop |
| Initial D | Fujiwara Tofu Shop and AE86 | Street parking |
| Steins;Gate | Iconic sign and hand gesture scene | Electronics district |
| Your Name | Iconic staircase scene | Near shrine |
| Slam Dunk | Seaside railroad crossing | Railway crossing |
| 5 Centimeters per Second | Railroad crossing separation scene | Railway line |
| Laid-Back Camp | Color scheme and sign design | Camp area |
| Anohana | Music and emotional scene | Secret base area |
| JoJo's Bizarre Adventure | Photo studio switches to JoJo art style; iconic poses | Photo studio |

## Sign and Advertisement References

Shop signs, restaurant names, and billboards throughout Hetro City hide text memes:

- **Totoro / Ghibli**: "Confused Tea Restaurant" and other Ghibli references
- **Daily Lives of High School Boys**: Slice-of-life shop style
- **Fullmetal Alchemist**: Sign text quotes
- **Touhou Project**: Arcade-related areas
- **Dandadan**: Latest anime memes
- **Uma Musume**: Arena vicinity
- **Naruto**: Sharingan eye on signs/ads
- **NEEDY GIRL OVERDOSE**: Internet-related shops
- **Spice and Wolf**: Trading house names
- **Gintama**: Yorozuya-style shop
- **Aria the Animation**: Water city district
- **After the Rain**: Cafe scene
- **Persona 5**: Official collab shop
- **Food Wars**: Restaurant-related
- **Miss Kobayashi's Dragon Maid**: Apartment-related

## Music and Audio Homages

### Vehicle Radio
NTE's vehicle system includes a radio that plays collaboration BGM:

- **Persona 5 Royal**: Rain-exclusive tracks like "Beneath the Mask -rain-"
- **P5X (Persona 5: The Phantom X)**: OST available on radio
- **Tower of Fantasy**: Classic battle and exploration soundtrack
- **MyGO!!!!!**: In-game character Akane performs "Meiseihishou" live with dynamic camera and stage lighting

### Voice Actor Crossover
VA Ikumi Hasegawa connects Bocchi the Rock!, MyGO!!!!!, and NTE across three IPs.

## Other Notable Easter Eggs

- **Headless Iron Rider (Ghost Rider motorcycle)**: Homage to classic character
- **Little Snowman NPC**: Brings midsummer snow to the entire city
- **Rusted Rail Flower Sea**: Weather-dependent hidden area with combat encounters
- **Hidden photo spots**: Each recreation has a corresponding photo quest

## How to Find More

1. Progress the main story to unlock more districts
2. Read every shop sign and advertisement carefully
3. Drive around with the radio on (discover hidden tracks)
4. Visit the photo studio to trigger JoJo art style easter egg
5. Revisit known spots at different weather/times (conditional triggers)
6. Follow Bilibili creator "苍白回响" for compilation videos

*Based on v1.0 launch content. Continuously updated. Found something new? Let us know!*`;

fs.writeFileSync(blogPath, JSON.stringify(blog, null, 2));
console.log('Updated anime blog with detailed research data');
