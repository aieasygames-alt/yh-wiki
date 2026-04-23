const fs = require('fs');
const path = '/Users/robert/Documents/Website/异环/yh-wiki/data/faqs.json';
const faqs = JSON.parse(fs.readFileSync(path, 'utf8'));

const newFaqs = [
  {
    id: "mobile-controller-support",
    question: "异环手机版支持手柄吗？",
    questionEn: "Does NTE mobile support controllers?",
    answer: "异环手机版（Android/iOS）支持蓝牙手柄连接。北通、雷蛇等品牌手柄已确认兼容。连接方式：设置→蓝牙→配对手柄→进入游戏自动识别。PS5 DualSense手柄也可在PC和PS5版使用，但移动端目前不支持DualSense。",
    answerEn: "NTE mobile (Android/iOS) supports Bluetooth controllers. Beon, Razer, and other brands are confirmed compatible. Connect via Settings → Bluetooth → Pair controller → Auto-detected in-game. PS5 DualSense works on PC and PS5 but not mobile.",
    tags: ["mobile", "controller", "beginner"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "mobile-graphics-settings",
    question: "异环手机版画质怎么调？发烫发热怎么办？",
    questionEn: "How to optimize NTE mobile graphics? Overheating fix",
    answer: "异环手机版优化建议：1) 在设置→画面中降低「渲染精度」至中或低；2) 关闭「动态模糊」和「体积光」；3) 帧率设为30帧可大幅减少发热；4) 关闭后台应用释放内存；5) 避免边充电边游玩。如设备发热严重，建议使用散热背夹或切换到PC端。iPhone 12 Pro Max为iOS最低设备，推荐iPhone 14及以上获得流畅体验。",
    answerEn: "Mobile optimization tips: 1) Lower Render Resolution to Medium or Low in Settings → Graphics; 2) Disable Motion Blur and Volumetric Lighting; 3) Set framerate to 30 FPS to reduce heat; 4) Close background apps; 5) Avoid charging while playing. If overheating persists, use a cooling clip or switch to PC. iPhone 12 Pro Max is the iOS minimum; iPhone 14+ recommended for smooth gameplay.",
    tags: ["mobile", "graphics", "performance"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "android-minimum-specs",
    question: "异环安卓最低配置是什么？哪些手机能玩？",
    questionEn: "What are NTE Android minimum specs? Which phones are supported?",
    answer: "异环安卓最低配置：处理器骁龙855/麒麟990及以上，内存6GB及以上，存储空间预留约20GB。推荐配置：骁龙8 Gen1/天玑9000及以上，8GB+内存。可流畅运行的常见机型：小米12及以上、三星S22及以上、OPPO Find X5及以上、华为Mate 40及以上。低于最低配置的设备可能无法安装或运行卡顿。",
    answerEn: "NTE Android minimum specs: Snapdragon 855 / Kirin 990+, 6GB RAM, ~20GB storage. Recommended: Snapdragon 8 Gen 1 / Dimensity 9000+, 8GB+ RAM. Smooth on: Xiaomi 12+, Samsung S22+, OPPO Find X5+, Huawei Mate 40+. Devices below minimum specs may not install or run poorly.",
    tags: ["mobile", "android", "specs"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "ios-minimum-specs",
    question: "异环iOS最低支持哪些设备？",
    questionEn: "What iOS devices does NTE support?",
    answer: "异环iOS最低设备要求：iPhone 12 Pro Max及以上，iPad Air 3及以上，系统iOS 15.0+。推荐设备：iPhone 14及以上、iPad Pro M1及以上可获得高画质流畅体验。iPad mini 5和iPad第8代也可以运行但画质受限。注意：iPhone 12/12 mini/12 Pro（非Max）未列入官方支持列表。",
    answerEn: "NTE iOS minimum: iPhone 12 Pro Max and later, iPad Air 3+, iOS 15.0+. Recommended: iPhone 14+, iPad Pro M1+ for high-quality smooth gameplay. iPad mini 5 and iPad 8th gen work but with limited graphics. Note: iPhone 12/12 mini/12 Pro (non-Max) are not on the official support list.",
    tags: ["mobile", "ios", "specs"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "mobile-storage-management",
    question: "异环手机版占用空间太大怎么办？",
    questionEn: "NTE mobile takes too much storage, what to do?",
    answer: "异环手机版资源包约20GB，加上安装包总计可能超过25GB。节省空间方法：1) 在游戏设置→资源管理中卸载不需要的语音包；2) 只下载当前需要的地图区域资源（如支持分区下载）；3) 定期清理游戏缓存：设置→其他→清除缓存；4) 将游戏安装到SD卡（部分Android机型支持）；5) 使用云游戏版本免下载体验。",
    answerEn: "NTE mobile resource pack is ~20GB, total with installer may exceed 25GB. Save space by: 1) Remove unused voice packs in Settings → Resource Management; 2) Download only needed map region resources; 3) Clear cache periodically: Settings → Other → Clear Cache; 4) Install to SD card (some Android devices); 5) Use cloud gaming version for download-free play.",
    tags: ["mobile", "storage", "beginner"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "cross-platform-how-to",
    question: "异环怎么跨平台同步数据？PC和手机怎么互通？",
    questionEn: "How to sync NTE data across platforms? PC-mobile cross-save",
    answer: "异环全平台数据互通操作方法：1) 确保所有设备登录同一个完美世界账号；2) PC端在登录界面选择账号登录；3) 移动端在登录界面选择相同账号方式；4) PS5端在首次启动时绑定完美世界账号。绑定后角色等级、装备、任务进度、抽卡记录全部实时同步。注意：每个账号只能绑定一个PS5账号，绑定后不可更改。6平台互通包括PC、Android、iOS、Mac、鸿蒙、PS5。",
    answerEn: "Cross-platform sync setup: 1) Log in with the same Perfect World account on all devices; 2) PC: select account login; 3) Mobile: use the same login method; 4) PS5: bind your Perfect World account on first launch. After binding, character level, equipment, quest progress, and gacha history sync in real-time. Note: Each account can only bind one PSN account, non-changeable. All 6 platforms supported: PC, Android, iOS, Mac, HarmonyOS, PS5.",
    tags: ["mobile", "cross-platform", "beginner"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "harmonyos-details",
    question: "异环鸿蒙版怎么下载？支持哪些设备？",
    questionEn: "How to download NTE on HarmonyOS? Supported devices?",
    answer: "异环鸿蒙版下载方式：打开华为应用市场→搜索「异环」→下载安装。最低配置：麒麟990处理器及以上，6GB内存，预留约20GB空间。支持设备：华为Mate 40及以上、P40及以上、MatePad Pro系列。鸿蒙版与Android版共享同一客户端数据，通过华为账号或完美世界账号登录即可同步进度。",
    answerEn: "HarmonyOS download: Open Huawei AppGallery → Search 'NTE' → Install. Minimum specs: Kirin 990+, 6GB RAM, ~20GB storage. Supported: Huawei Mate 40+, P40+, MatePad Pro series. Shares same client data as Android; sync progress via Huawei ID or Perfect World account.",
    tags: ["mobile", "harmonyos", "download"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  },
  {
    id: "mobile-battery-drain",
    question: "异环手机玩一会儿就没电怎么办？",
    questionEn: "NTE drains my phone battery fast, how to fix?",
    answer: "异环是高画质开放世界游戏，对手机性能要求较高，耗电快是正常现象。省电建议：1) 开启手机省电模式（可能限制帧率）；2) 降低游戏内画质设置（关闭体积光、动态模糊，降低渲染精度）；3) 帧率锁定30帧可省电30%以上；4) 屏幕亮度调低；5) 使用充电宝边充边玩（注意发热）；6) 长时间游玩建议切换到PC或PS5端。",
    answerEn: "NTE is a high-end open world game that demands significant phone resources. Battery saving tips: 1) Enable phone power-saving mode (may limit framerate); 2) Lower in-game graphics (disable volumetric lighting, motion blur, reduce render resolution); 3) Lock to 30 FPS to save 30%+ battery; 4) Reduce screen brightness; 5) Use a power bank (watch for overheating); 6) For long sessions, switch to PC or PS5.",
    tags: ["mobile", "battery", "performance"],
    category: "platform",
    categoryZh: "平台相关",
    categoryEn: "Platform",
    relatedCharacters: [],
    relatedMaterials: []
  }
];

faqs.push(...newFaqs);
fs.writeFileSync(path, JSON.stringify(faqs, null, 2), 'utf8');
console.log(`Added ${newFaqs.length} mobile FAQs. Total: ${faqs.length}`);
