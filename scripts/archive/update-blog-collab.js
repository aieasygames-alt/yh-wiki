const fs = require('fs');
const path = require('path');

const blogPath = path.join('/Users', 'robert', 'Documents', 'Website', '异环', 'yh-wiki', 'data', 'blog.json');
const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

const collabPost = {
  id: 'nte-launch-collaborations',
  title: '异环公测联动大全 — 保时捷/P5/MyGO/孤独摇滚全汇总',
  titleEn: 'NTE Launch Collaborations — Porsche, P5, MyGO, Bocchi and More',
  category: '上线资讯',
  categoryZh: '上线资讯',
  categoryEn: 'Launch News',
  date: '2026-04-23',
  tags: ['联动', '资讯', 'launch'],
  summary: '异环公测版本全联动合作伙伴汇总：保时捷正版授权车辆、P5音乐联动、MyGO翻唱联动、孤独摇滚场景彩蛋，以及雷蛇/苹果/罗森等品牌合作。',
  summaryEn: 'Complete guide to all NTE launch collaborations: Porsche licensed vehicles, Persona 5 music, MyGO cover songs, Bocchi the Rock easter eggs, and brand partnerships.',
  internalLinks: [
    { label: '全载具图鉴', labelEn: 'All Vehicles', href: '/vehicles' },
    { label: '系统配置要求', labelEn: 'System Requirements', href: '/system-requirements' },
    { label: '下载安装指南', labelEn: 'Download Guide', href: '/guides/download-install-guide' }
  ],
  content: '异环公测前瞻特别节目中宣布了多项重磅联动合作，涵盖汽车品牌、游戏IP、动漫IP和外设品牌。以下是完整联动清单。\n\n## 保时捷（Porsche）— 正版授权载具\n\n这是本次联动中最受关注的合作。异环获得了保时捷官方正版授权，玩家可以在游戏内：\n\n- 驾驶保时捷918等经典超跑\n- 在游戏内保时捷品牌展厅参观\n- 通过租赁或购买（新越车行）获得保时捷车辆\n- 体验从游戏内试驾到现实消费的创新联动模式\n\n与一般游戏仅使用化名不同，异环中的保时捷是完整正版授权，外观高度还原，行业罕见。\n\n## P5R/P5X — 音乐电台联动\n\n与《女神异闻录5 皇家版》及《女神异闻录：夜幕魅影》联动：\n\n- P5R经典BGM可在游戏内电台收听\n- P5X音乐同步上线车载音响\n- 通过随身听功能在探索时播放\n\n## MyGO!!!!! — 翻唱联动\n\n二测期间就已展开的王炸联动：\n\n- 长谷川育美翻唱《迷星叫（异环Cover Ver.）》\n- 融入角色支线剧情和特别动画\n- 歌曲可放入车载音响和留声机播放\n\n## 孤独摇滚！— 场景彩蛋\n\n游戏中按《孤独摇滚！》原作1:1还原了多个经典场景，精巧复刻日式风格，散布在开放世界各处。\n\n## 幻塔 — 音乐联动\n\n同为完美世界旗下作品，幻塔经典BGM可在车载音响中收听。\n\n## 品牌联动\n\n| 品牌 | 联动内容 |\n|------|----------|\n| 苹果 | 2900+授权店线下推广、Mac平台首发 |\n| 雷蛇 | 外设硬件联动 |\n| 北通 | 手柄外设联动 |\n| 支付宝 | 平台合作 |\n| 罗森 | 线上线下合作（2026秋季上线） |',
  contentEn: 'The NTE pre-launch special announced multiple major collaborations.\n\n## Porsche — Licensed Vehicles\n\nNTE secured official Porsche licensing. Drive the Porsche 918, visit the in-game showroom, rent or purchase vehicles. Full authentic brand integration rare in gaming.\n\n## Persona 5 (P5R/P5X) — Music\n\nP5R and P5X classic BGM available on in-game radio and car stereo via Walkman feature.\n\n## MyGO!!!!! — Cover Song\n\nIkumi Hasegawa covers "Meisei" integrated into character side stories with special animations. Playable in car stereo and phonograph.\n\n## Bocchi the Rock! — Easter Eggs\n\nMultiple scenes faithfully recreated 1:1 from the anime, scattered throughout the open world.\n\n## Tower of Fantasy — Music\n\nClassic BGM from fellow Perfect World title available in car stereo.\n\n## Brand Partnerships\n\nApple (2900+ stores, Mac launch), Razer (peripherals), Beon (controllers), Alipay (platform), Lawson (coming autumn 2026).'
};

if (!posts.find(p => p.id === 'nte-launch-collaborations')) {
  posts.unshift(collabPost);
  fs.writeFileSync(blogPath, JSON.stringify(posts, null, 2));
  console.log('Added blog, total:', posts.length);
} else {
  console.log('Blog exists');
}
