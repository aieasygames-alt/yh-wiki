const fs = require('fs');
const path = require('path');

const guidesPath = path.join(__dirname, '..', 'data', 'guides.json');
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

// Add download guide
const downloadGuide = {
  id: "download-install-guide",
  title: "异环下载安装指南 — 全平台下载地址与安装教程",
  titleEn: "NTE Download & Install Guide — All Platforms",
  category: "beginner",
  categoryZh: "新手指南",
  categoryEn: "Beginner",
  summary: "异环公测全平台下载安装指南，包括PC、Android、iOS、Mac、PS5、鸿蒙各平台的下载地址、安装方法和注意事项。",
  summaryEn: "Complete download and install guide for Neverness to Everness on all platforms: PC, Android, iOS, Mac, PS5, and HarmonyOS.",
  content: "异环已于2026年4月23日上午10:00正式全平台公测，覆盖PC、Android、iOS、Mac、鸿蒙、PS5六大平台。本文提供各平台的下载方式和安装指南。\n\n## PC客户端\n\n下载地址：异环官网 nte.perfectworld.com\n\n1. 访问官网，点击「下载客户端」\n2. 下载安装包（约40-60GB，建议预留80GB空间）\n3. 运行安装程序，选择安装路径\n4. 安装完成后启动游戏，登录完美世界账号\n\n配置要求：推荐 GTX 1060 以上显卡，16GB内存，SSD硬盘\n\n## Android\n\n下载渠道：\n\n- TapTap：搜索「异环」下载\n- 华为应用市场\n- B站游戏中心\n- 官网直接下载APK\n\n安装步骤：\n1. 从以上渠道下载安装包\n2. 允许安装未知来源应用（如从官网下载）\n3. 安装完成后打开游戏\n4. 下载游戏资源包（约20GB）\n\n配置要求：骁龙855/天玑1000+以上芯片，8GB内存\n\n## iOS\n\n下载方式：App Store 搜索「异环」\n\n1. 打开App Store\n2. 搜索「异环」或「Neverness to Everness」\n3. 点击下载（约20GB）\n4. 安装完成后打开游戏\n\n配置要求：iPhone XS及以上，iPad Air 3及以上，iOS 15.0+\n\n## Mac\n\n异环支持Apple Silicon（M1/M2/M3/M4）Mac，三端数据互通。\n\n下载方式：\n1. 访问异环官网\n2. 选择Mac版本下载\n3. 安装后即可游玩\n\n支持与iPhone/iPad数据互通，随时随地切换设备。\n\n## PlayStation 5\n\n下载方式：PlayStation Store\n\n1. 打开PS5主界面，进入PlayStation Store\n2. 搜索「Neverness to Everness」或「异环」\n3. 免费下载（无需PS+会员）\n4. 下载完成后即可游玩\n\n特性：支持PS5 Pro强化、DualSense手柄震动与扳机效果、4人在线联机\n\n线下体验：4月23日至5月14日，全国索尼直营店和授权体验店可现场体验。\n\n## 鸿蒙 HarmonyOS\n\n下载方式：华为应用市场搜索「异环」\n\n1. 打开华为应用市场\n2. 搜索「异环」下载安装\n3. 安装完成后打开游戏\n\n## 云游戏\n\n如果设备配置不足，可以通过网易云游戏等云游戏平台免下载直接体验。\n\n## 跨平台数据互通\n\n异环支持所有平台数据互通（同一账号），角色等级、装备、任务进度实时同步。PC和移动端可随时切换。\n\n## 注意事项\n\n1. 预下载已于4月21日开放，现在仍可下载\n2. 首次进入游戏需要下载资源包，建议使用WiFi\n3. 确保设备存储空间充足（建议预留80GB以上）\n4. 公测首日服务器可能拥挤，请耐心排队",
  contentEn: "Neverness to Everness officially launched on April 23, 2026 at 10:00 (CST), available on PC, Android, iOS, Mac, HarmonyOS, and PS5.\n\n## PC Client\n\nDownload from official site: nte.perfectworld.com\n\n1. Visit the official site and click Download\n2. Download the installer (~40-60GB, recommend 80GB free space)\n3. Run the installer and select install path\n4. Launch the game and log in with your Perfect World account\n\nRecommended specs: GTX 1060+, 16GB RAM, SSD\n\n## Android\n\nDownload channels: TapTap, Huawei AppGallery, Bilibili Game Center, or official site APK\n\nRecommended specs: Snapdragon 855 / Dimensity 1000+, 8GB RAM\n\n## iOS\n\nDownload from the App Store: Search for Neverness to Everness\n\nSupported: iPhone XS and later, iPad Air 3 and later, iOS 15.0+\n\n## Mac\n\nSupports Apple Silicon (M1/M2/M3/M4) with full cross-platform data sync with iPhone/iPad.\n\nDownload from the official site, select Mac version.\n\n## PlayStation 5\n\nDownload from PlayStation Store (free, no PS+ subscription required).\n\nFeatures: PS5 Pro Enhanced, DualSense haptic feedback, 4-player online co-op.\n\nOffline events: April 23 to May 14 at Sony stores nationwide.\n\n## HarmonyOS\n\nDownload from Huawei AppGallery: Search for NTE.\n\n## Cross-Platform Sync\n\nAll platforms share the same account data — character level, equipment, and quest progress sync in real-time.\n\n## Tips\n\n1. Pre-download is still available\n2. First launch requires downloading resource packs (use WiFi)\n3. Ensure sufficient storage (80GB+ recommended)\n4. Launch day may have queue times due to high player volume",
  tags: ["下载", "安装", "新手", "平台", "Download", "Install"],
  relatedCharacters: [],
  relatedLocations: [],
  relatedLore: [],
  faq: [
    {
      question: "What platforms is Neverness to Everness available on?",
      questionZh: "异环支持哪些平台？",
      answer: "NTE is available on PC, Android, iOS, Mac, HarmonyOS, and PlayStation 5. All platforms support cross-save with the same account.",
      answerZh: "异环支持PC、Android、iOS、Mac、鸿蒙和PlayStation 5六大平台，同一账号所有平台数据互通。"
    },
    {
      question: "Does NTE require PS+ on PlayStation 5?",
      questionZh: "PS5版需要PS+会员吗？",
      answer: "No, NTE on PS5 is free to download and play without a PS+ subscription.",
      answerZh: "不需要，PS5版异环免费下载游玩，无需PS+会员。"
    }
  ]
};

// Check if already exists
if (!guides.find(g => g.id === 'download-install-guide')) {
  guides.unshift(downloadGuide);
  fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2));
  console.log('Added download-install-guide');
} else {
  console.log('Guide already exists');
}
