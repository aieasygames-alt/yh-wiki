const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, '..', 'data', 'blog.json');
const blogs = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

const newBlogs = [
  {
    "id": "nte-v10-launch-events",
    "title": "异环1.0公测首发活动全汇总 — 限时福利不容错过",
    "titleEn": "NTE v1.0 Launch Events Complete Guide — Don't Miss These Limited-Time Rewards",
    "category": "上线资讯",
    "categoryZh": "上线资讯",
    "categoryEn": "Launch News",
    "date": "2026-04-25",
    "tags": ["公测","首发活动","福利","兑换码","launch","events"],
    "summary": "异环1.0公测已正式上线，首发期间海量福利活动同步开启。从预注册奖励、签到活动到限时副本，一文汇总所有公测首发活动及奖励内容。",
    "summaryEn": "NTE v1.0 has officially launched with massive launch events. This guide covers all limited-time events, login bonuses, free pulls, and collaboration rewards.",
    "internalLinks": [
      {"href": "/redeem-codes", "label": "兑换码大全", "labelEn": "Redeem Codes"},
      {"href": "/guides/beginner-guide", "label": "新手攻略", "labelEn": "Beginner Guide"},
      {"href": "/gacha", "label": "抽卡模拟器", "labelEn": "Gacha Simulator"},
      {"href": "/guides/tier-list", "label": "强度排行", "labelEn": "Tier List"}
    ],
    "content": "异环（Neverness to Everness）已于2026年4月23日正式公测上线！首发期间，官方准备了海量福利活动，帮助玩家快速起步。本文为你汇总所有公测首发活动，确保不漏掉任何一份奖励。\n\n预注册奖励\n\n所有在公测前完成预注册的玩家，登录游戏后即可领取预注册里程碑奖励。根据预注册人数达标情况，奖励包括方斯（抽卡货币）、经验材料、突破材料和限定头像框等。这些奖励会通过游戏内邮件发放，请记得及时领取。\n\n七日登录签到活动\n\n公测首发期间开放七日登录签到活动，连续登录即可获得丰厚奖励：\n\n第一天：方斯x100\n第二天：初级猎人指南x5\n第三天：方斯x100\n第四天：甲硬币x5000\n第五天：方斯x100\n第六天：中级猎人指南x3\n第七天：限定SR磁盘套装自选箱x1\n\n七日签到累计可获得至少300方斯和多种实用材料，建议每天都登录领取。\n\n新手限定祈愿池\n\n公测期间开放新手专属祈愿池，20抽内必出S级角色，且可以从指定的S级角色中自选一位。这是全游戏性价比最高的抽卡机会，强烈建议所有新玩家优先抽取。自选池中的角色均为强力S级，无论选择哪位都能为你的队伍带来质的提升。\n\n常驻池50抽送S级自选\n\n常驻祈愿池累计抽取50次后，系统会赠送一张S级角色自选券，玩家可以从常驻池S级角色中任选一位。加上新手池的S级角色，零氪玩家开局即可拥有两位S级角色，起步条件非常优越。\n\n城市经营送免费S级角色\n\n异环独创的城市经营（City Tycoon）玩法中，玩家可以通过经营自己的店铺和区域，在达到一定进度后免费获得S级角色「小吱」。这是游戏内第三个免费S级角色来源，零氪玩家的福音。\n\n首发限时活动：异象围剿\n\n公测期间开放限时活动「异象围剿」，玩家需要组队挑战强力异象Boss。活动分为多个难度层级，通关越高难度获得的奖励越丰厚。奖励包括限定称号、大量方斯和稀有强化材料。活动结束后将无法再次参与，建议尽早完成。\n\nP5R x 幻塔音乐联动活动\n\n异环与女神异闻录5皇家版（P5R）和幻塔的音乐联动活动同步开启。参与联动活动可以获得限定音乐播放列表、联动主题头像框和联动家具等独特奖励。\n\n兑换码汇总\n\n公测首发期间官方发布了多个兑换码，包括前瞻直播兑换码和社区活动兑换码。所有有效兑换码已整理在我们的兑换码页面，建议尽快使用以免过期。\n\n总计约418抽免费资源\n\n综合以上所有福利来源，零氪玩家在公测初期大约可以获得约418抽的免费抽卡资源。这意味着你可以在不花一分钱的情况下，保底获得4-5个S级角色（90抽保底一个）。加上新手池和常驻池自选，异环的开服福利在同类游戏中属于顶级水平。\n\n活动参与建议\n\n优先级排序：1）领取所有兑换码和邮件奖励；2）完成新手池20抽；3）参与七日签到活动；4）推进主线解锁城市经营；5）参与限时异象围剿活动；6）常驻池攒够50抽获取自选券。\n\n以上活动均有时间限制，建议在公测首周内尽量完成。更多详细攻略和角色推荐，请访问我们的攻略页面和角色排行榜。",
    "contentEn": "Neverness to Everness (NTE) has officially launched on April 23, 2026! The developers have prepared a massive array of launch events and free rewards. This guide covers every launch event so you don't miss out.\n\nPre-Registration Rewards\n\nAll players who pre-registered will receive milestone rewards upon logging in, including Fangs (gacha currency), experience materials, ascension materials, and exclusive avatar frames via in-game mail.\n\n7-Day Login Bonus\n\nA 7-day login event runs during launch:\n\nDay 1: Fangs x100 | Day 2: Novice Hunter Guide x5 | Day 3: Fangs x100\nDay 4: Coins x5,000 | Day 5: Fangs x100 | Day 6: Intermediate Hunter Guide x3\nDay 7: SR Disk Set Selector x1\n\nCumulative rewards include at least 300 Fangs and various materials.\n\nBeginner Exclusive Banner\n\n20 pulls guarantees an S-rank character with a selector. This is the best value pull in the game — prioritize this banner.\n\nStandard Banner S-Rank Selector\n\nAfter 50 pulls on the standard banner, receive an S-rank selector ticket. Combined with the beginner selector, F2P players start with two guaranteed S-rank characters.\n\nFree S-Rank from City Tycoon\n\nProgress in City Tycoon mode to earn a free S-rank character (Xiaozhi) — the third free S-rank source.\n\nLimited Event: Anomaly Siege\n\nTeam up against powerful Anomaly Bosses across difficulty tiers. Earn exclusive titles, Fangs, and rare materials. Time-limited, so complete it early.\n\nP5R x Tower of Fantasy Music Collab\n\nEarn exclusive music playlists, themed avatar frames, and collaboration furniture.\n\nRedeem Codes\n\nMultiple codes released during launch. Check our Redeem Codes page and use them before they expire.\n\nApproximately 418 Free Pulls\n\nF2P players can accumulate ~418 free pulls, guaranteeing 4-5 S-rank characters (90 pulls each). Combined with selectors, NTE's launch generosity is top-tier.\n\nPriority: 1) Claim codes and mail rewards; 2) Beginner banner 20 pulls; 3) 7-day login; 4) Main story for City Tycoon; 5) Anomaly Siege; 6) 50 standard pulls for selector.\n\nAll events are time-limited. Complete them within the first week for maximum rewards."
  },
  {
    "id": "nte-p5r-tof-music-collab",
    "title": "异环 x P5R x 幻塔音乐联动详解 — 发售预告片Play On!发布",
    "titleEn": "NTE x P5R x Tower of Fantasy Music Collaboration — Launch Trailer Play On! Released",
    "category": "上线资讯",
    "categoryZh": "上线资讯",
    "categoryEn": "Launch News",
    "date": "2026-04-25",
    "tags": ["联动","女神异闻录","幻塔","音乐","P5R","collaboration"],
    "summary": "异环在发售前夕公布了与P5R、P5X和幻塔的音乐联动合作，同时发布发售预告片Play On!。本文详解联动内容和参与方式。",
    "summaryEn": "NTE announced music collaborations with P5R, P5X, and Tower of Fantasy alongside the launch trailer Play On!. Full collaboration details inside.",
    "internalLinks": [
      {"href": "/blog", "label": "全部资讯", "labelEn": "All News"},
      {"href": "/guides/beginner-guide", "label": "新手攻略", "labelEn": "Beginner Guide"},
      {"href": "/characters", "label": "全部角色", "labelEn": "All Characters"}
    ],
    "content": "2026年4月18日，异环官方正式发布发售预告片「Play On!」，同时公布了令人惊喜的音乐联动合作计划。联动对象包括女神异闻录5皇家版（Persona 5 Royal）、女神异闻录5幻影X（P5X）和幻塔（Tower of Fantasy）。这次联动不仅展示了异环在音乐领域的野心，也为游戏增添了独特的文化魅力。\n\n联动背景与意义\n\n异环由Hotta Studio开发，完美世界发行。Hotta Studio正是幻塔的开发团队，因此与幻塔的联动有着天然联系。而与P5R的联动则体现了都市题材上的共鸣——P5R以东京都市为舞台的青春冒险与异环的海瑟劳城有着异曲同工之妙。\n\n联动内容详解\n\n限定音乐播放列表：游戏中将可以播放来自P5R、P5X和幻塔的经典音乐曲目。想象一下在海瑟劳的街头驾驶时，耳边响起P5R标志性的爵士摇滚旋律，这种跨次元的体验令人期待。\n\n联动主题装饰：参与联动活动可以获得限定头像框、聊天框主题和家具装饰，融合了P5R的红黑风格和幻塔的科幻元素。\n\n限定活动副本：联动期间开放特别活动副本，通关可以获得联动专属奖励。\n\n发售预告片Play On!\n\n预告片展示了异环的核心卖点：超自然都市开放世界、流畅的战斗动作、驾驶载具穿梭城市、以及独特的异象收集玩法。背景音乐融合了电子、摇滚和都市风格的旋律，与P5R联动消息形成巧妙呼应。\n\n对玩家的实际影响\n\n联动音乐增加游戏沉浸感，在城市探索时能听到熟悉旋律；联动装饰让角色和房屋更具个性；联动活动通常伴随免费奖励，是零氪获取限定道具的好机会。\n\nHotta Studio的音乐传承\n\nHotta Studio在幻塔中已积累丰富音乐制作经验。与P5R联动说明团队在音乐品质上有更高追求。P5R原声由目黑将司作曲，多次获游戏音乐大奖，能与其联动本身就是一种认可。\n\n联动时间与参与方式\n\n联动活动在公测首发期间同步开启。玩家登录游戏并完成指定联动任务即可获得所有奖励。联动内容预计持续到首个版本周期结束，具体截止日期请关注游戏内公告。\n\n异环与P5R、幻塔的音乐联动，体现了异环在都市文化和二次元领域的独特定位。如果你是P5R粉丝，这次联动将带来熟悉又新鲜的体验。",
    "contentEn": "On April 18, 2026, NTE released its launch trailer 'Play On!' alongside an exciting music collaboration with Persona 5 Royal (P5R), P5X, and Tower of Fantasy (ToF). This partnership showcases NTE's musical ambition and adds unique cultural appeal.\n\nBackground\n\nNTE is developed by Hotta Studio (also the Tower of Fantasy developer), making the ToF collaboration a natural fit. The P5R collaboration reflects shared urban themes — P5R's Tokyo adventure and NTE's Hethereau share metropolitan energy.\n\nCollaboration Content\n\nExclusive Music Playlist: Classic tracks from P5R, P5X, and ToF will be playable in-game. Imagine driving through Hethereau with P5R's iconic jazz-rock melodies.\n\nThemed Decorations: Exclusive avatar frames, chat themes, and furniture blending P5R's red-black aesthetic with ToF's sci-fi elements.\n\nLimited Event Dungeons: Special collaboration dungeons with exclusive rewards.\n\nLaunch Trailer 'Play On!'\n\nThe trailer showcases NTE's core features: supernatural urban open world, fluid combat, vehicle driving, and anomaly collection. The soundtrack blends electronic, rock, and urban melodies.\n\nPlayer Benefits\n\nCollaboration music enhances immersion; themed decorations add personality; collaboration events provide free exclusive rewards for F2P players.\n\nHotta Studio's Music Heritage\n\nHotta Studio built music production experience through Tower of Fantasy. Collaborating with P5R (composed by Shoji Meguro, multiple game music award winner) signals higher ambitions for audio quality.\n\nParticipation\n\nLog in and complete designated collaboration tasks to earn all rewards. The collaboration runs through the first version cycle. Check in-game announcements for end dates.\n\nNTE's music collaboration reflects its unique positioning in urban culture and anime aesthetics. P5R fans will find a familiar yet fresh experience."
  },
  {
    "id": "nte-global-launch-guide",
    "title": "异环全球服4月29日上线指南 — 下载、注册与首日攻略",
    "titleEn": "NTE Global Server Launch Guide April 29 — Download, Registration, Day-One Tips",
    "category": "上线资讯",
    "categoryZh": "上线资讯",
    "categoryEn": "Launch News",
    "date": "2026-04-25",
    "tags": ["全球服","国际服","下载","注册","global","download"],
    "summary": "异环全球服将于2026年4月29日上线。本文为国际服玩家提供完整的下载指南、账号注册教程、跨服须知和首日攻略建议。",
    "summaryEn": "NTE global server launches April 29, 2026. Complete guide for international players covering downloading, registration, cross-server info, and day-one tips.",
    "internalLinks": [
      {"href": "/guides/download-install-guide", "label": "下载安装指南", "labelEn": "Download Guide"},
      {"href": "/guides/beginner-guide", "label": "新手攻略", "labelEn": "Beginner Guide"},
      {"href": "/system-requirements", "label": "配置要求", "labelEn": "System Requirements"}
    ],
    "content": "异环全球服将于2026年4月29日正式上线，比国服晚6天。对于国际服玩家来说，提前做好准备可以在开服第一时间进入游戏。本文为国际服玩家整理了完整的上线指南。\n\n各平台下载方式\n\nPC端：通过异环官方网站下载Global版本客户端，安装包约40-50GB，建议使用SSD安装。\n\nPS5：在PlayStation Store搜索「Neverness to Everness」下载，支持4K 60帧。\n\niOS：App Store搜索「Neverness to Everness」，需要iOS 15.0以上，iPhone 12以上推荐。\n\nAndroid：Google Play商店或官网下载APK，需要Android 10以上，骁龙888或同等处理器推荐。\n\n账号注册\n\n全球服使用独立账号系统，与国服数据不互通。支持邮箱注册和第三方登录（Google、Apple ID等）。建议4月29日前完成注册。\n\n跨服数据说明\n\n国服和全球服完全独立，数据不互通。已有国服进度的玩家无法迁移到全球服。两个服务器版本更新节奏可能略有不同，核心内容一致。全球服支持英语、日语、韩语等多语言。\n\n配置要求\n\nPC最低：i5-8400 / R5 2600，8GB内存，GTX 1060 6GB，50GB存储。\n\nPC推荐：i7-10700 / R7 3700X，16GB内存，RTX 3060或以上，50GB SSD。\n\n首日攻略建议\n\n开服第一天建议按以下顺序：\n\n1. 领取所有兑换码和预注册奖励。\n2. 完成新手教程后立即新手池20抽。\n3. 跟随主线推进解锁全部功能。\n4. 参与七日签到活动。\n5. 尝试限时活动「异象围剿」。\n6. 推进城市经营朝免费S级角色努力。\n\n时区注意\n\n全球服开服时间按UTC计算。亚洲玩家可能在当地时间4月29日晚或4月30日凌晨进入游戏。具体时间请关注官方公告。\n\n社区与交流\n\n加入官方Discord和Reddit（r/NevernessToEverness）获取最新资讯和攻略。我们也在持续更新内容，帮助全球玩家更好体验异环。\n\n异环全球服的上线意味着这款超自然都市RPG正式面向全球玩家开放。祝你在海瑟劳的冒险愉快！",
    "contentEn": "NTE's global server launches April 29, 2026, six days after CN. This guide helps international players prepare for day one.\n\nDownloading\n\nPC: Download Global client from official website (~40-50GB, SSD recommended).\nPS5: Search 'Neverness to Everness' on PlayStation Store (4K 60fps supported).\niOS: App Store, requires iOS 15.0+, iPhone 12+ recommended.\nAndroid: Google Play or official APK, requires Android 10+, Snapdragon 888+ recommended.\n\nAccount Registration\n\nGlobal server uses separate accounts from CN. Supports email and third-party login (Google, Apple ID). Register before April 29.\n\nCross-Server Info\n\nCN and global servers are independent with no data transfer. Content is identical but updates may differ slightly. Supports English, Japanese, Korean.\n\nSystem Requirements\n\nMinimum: i5-8400/R5 2600, 8GB RAM, GTX 1060 6GB, 50GB storage.\nRecommended: i7-10700/R7 3700X, 16GB RAM, RTX 3060+, 50GB SSD.\n\nDay-One Tips\n\n1. Claim all codes and pre-registration rewards.\n2. Beginner banner 20 pulls (guaranteed S-rank selector).\n3. Follow main story to unlock features.\n4. 7-day login event.\n5. Limited Anomaly Siege event.\n6. Progress City Tycoon for free S-rank.\n\nTimezone\n\nLaunch time is UTC-based. Asian players may access on evening April 29 or early April 30. Check official announcements.\n\nCommunity\n\nJoin official Discord and Reddit (r/NevernessToEverness). We continuously update guides for global players.\n\nNTE's global launch means this supernatural urban RPG is now available worldwide. Enjoy your adventure in Hethereau!"
  }
];

blogs.push(...newBlogs);

fs.writeFileSync(blogPath, JSON.stringify(blogs, null, 2), 'utf8');
console.log(`Added ${newBlogs.length} blog posts. Total: ${blogs.length}`);
