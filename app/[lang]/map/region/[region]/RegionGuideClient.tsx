"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { isZhLocale, type Locale } from "../../../../../lib/i18n";
import type { MapMarker, MarkerTypeInfo } from "../../../../../lib/map-utils";
import mapData from "../../../../../data/map-markers.json";

const data = mapData as unknown as {
  maps: { markers: MapMarker[] }[];
  markerTypes: Record<string, MarkerTypeInfo>;
  regions: Record<string, { zh: string; en: string; color: string }>;
};

const IMG_VERSION = "v=1";

// ─── Region content data ────────────────────────────────────────

interface RegionContent {
  zh: string;
  tw: string;
  en: string;
}

interface RegionGuideData {
  intro: RegionContent;
  highlights: RegionContent[];
  tips: RegionContent[];
}

const REGION_GUIDES: Record<string, RegionGuideData> = {
  "new-herland": {
    intro: {
      zh: "新赫兰德是海瑟劳世界的起点区域，也是大部分玩家最熟悉的地方。这里城市建筑密集，街道错综复杂，第一次来的时候很容易迷路——不过迷路也没关系，转角处说不定就藏着什么好东西。新赫兰德的收集要素非常多，光是货币和战利品就有500多个散布在各处，逛着逛着就能捡到不少。如果你想先把主线推完再来慢慢收集，也完全没问题，传送点密度够高，随时可以回来。",
      tw: "新赫蘭德是海瑟勞世界的起點區域，也是大部分玩家最熟悉的地方。這裡城市建築密集，街道錯綜複雜，第一次來的時候很容易迷路——不過迷路也沒關係，轉角處說不定就藏著什麼好東西。新赫蘭德的收集要素非常多，光是貨幣和戰利品就有500多個散佈在各處，逛著逛著就能撿到不少。如果你想先把主線推完再來慢慢收集，也完全沒問題，傳送點密度夠高，隨時可以回來。",
      en: "New Herland is where your journey in Hethereau begins. It's the area most players know best — dense urban architecture and winding streets that are easy to get lost in at first. But getting lost here isn't a bad thing; you never know what's hiding around the next corner. There are tons of collectibles scattered around, with over 500 currency and loot spots alone. If you'd rather push the main story first and come back later, that works too — the waypoint network is dense enough that returning is never a hassle.",
    },
    highlights: [
      {
        zh: "谕石是新赫兰德最重要的探索目标之一，一共有49块散布在城区各处。建议先把快速旅行点都开一遍，这样跑谕石的时候能省不少时间。有些谕石藏在高处或者隐蔽的小巷里，记得多抬头看看。",
        tw: "諭石是新赫蘭德最重要的探索目標之一，一共有49塊散佈在城區各處。建議先把快速旅行點都開一遍，這樣跑諭石的時候能省不少時間。有些諭石藏在高處或者隱蔽的小巷裡，記得多抬頭看看。",
        en: "Oracle Stones are one of the key collectibles here, with 49 scattered across the city. It's best to unlock all fast travel points first to save time on your stone-hunting runs. Some stones are hidden up high or in narrow alleys — remember to look up.",
      },
      {
        zh: "世界BOSS一共有51个刷新点，难度从低到高都有。前期遇到打不过的可以先标记一下位置，等角色等级起来了再来拿奖励。掉落材料对装备强化帮助很大。",
        tw: "世界BOSS一共有51個刷新點，難度從低到高都有。前期遇到打不過的可以先標記一下位置，等角色等級起來了再來拿獎勵。掉落材料對裝備強化幫助很大。",
        en: "There are 51 world boss spawn points ranging from easy to challenging. If you can't beat one early on, just remember where it is and come back when you're stronger. The drop materials are very useful for equipment enhancement.",
      },
      {
        zh: "商家超过210家，种类非常齐全。从日常消耗品到稀有材料都能在新赫兰德买到，没事多逛逛商店，有些限购材料刷新了就赶紧拿下。",
        tw: "商家超過210家，種類非常齊全。從日常消耗品到稀有材料都能在新赫蘭德買到，沒事多逛逛商店，有些限購材料刷新了就趕緊拿下。",
        en: "With over 210 shops, you can find just about anything here. From daily supplies to rare materials, it's all in New Herland. Check in on shops regularly — some limited-stock materials refresh and you'll want to grab them fast.",
      },
    ],
    tips: [
      {
        zh: "建议先沿主干道把传送点全部解锁，然后再分区域清扫收集品。新赫兰德地形相对平坦，跑图效率很高。",
        tw: "建議先沿主幹道把傳送點全部解鎖，然後再分區域清掃收集品。新赫蘭德地形相對平坦，跑圖效率很高。",
        en: "Unlock all waypoints along the main roads first, then sweep through each district for collectibles. The terrain here is relatively flat, making exploration efficient.",
      },
      {
        zh: "收集品里有些需要完成特定条件才能获取（比如解谜或击败附近怪物），遇到拿不到的别硬蹲，先记下位置后面再来。",
        tw: "收集品裡有些需要完成特定條件才能獲取（比如解謎或擊敗附近怪物），遇到拿不到的別硬蹲，先記下位置後面再來。",
        en: "Some collectibles require completing specific conditions (solving puzzles, defeating nearby monsters, etc.). If you can't grab one right away, note the location and come back later.",
      },
    ],
  },
  "bridge-crossings": {
    intro: {
      zh: "桥间地如其名，是一个由多座桥梁连接的区域，地形高低错落，河流和桥梁构成了这里的标志景观。相比新赫兰德的城市密度，桥间地更偏向野外探险风格，收集品的分布也更加分散，需要多跑动。不过正因如此，探索起来有种「每转一个弯都有新发现」的感觉。这里任务的密度也相当高，主线和支线交替推进的话，探索体验会非常丝滑。",
      tw: "橋間地如其名，是一個由多座橋樑連接的區域，地形高低錯落，河流和橋樑構成了這裡的標誌景觀。相比新赫蘭德的城市密度，橋間地更偏向野外探險風格，收集品的分佈也更加分散，需要多跑動。不過正因如此，探索起來有種「每轉一個彎都有新發現」的感覺。這裡任務的密度也相當高，主線和支線交替推進的話，探索體驗會非常絲滑。",
      en: "Bridge Crossings lives up to its name — a region connected by multiple bridges with varied elevation. Rivers and bridges define the landscape here. Compared to the urban density of New Herland, Bridge Crossings has a more wilderness-exploration feel. Collectibles are more spread out, requiring more footwork. But that also means every corner turned feels like a new discovery. The quest density here is high too — alternating between main and side quests makes for a smooth exploration loop.",
    },
    highlights: [
      {
        zh: "收集品是桥间地的亮点之一，一共有138个。这里的收集品有不少藏在桥下或者河岸边，走的时候别忘了往水边看看。有些需要从特定角度才能发现，探索的时候多转转视角。",
        tw: "收集品是橋間地的亮點之一，一共有138個。這裡的收集品有不少藏在橋下或者河岸邊，走的時候別忘了往水邊看看。有些需要從特定角度才能發現，探索的時候多轉轉視角。",
        en: "Collectibles are a highlight here with 138 total. Many are hidden under bridges or along riverbanks — don't forget to check near the water. Some are only visible from specific angles, so rotate your camera often while exploring.",
      },
      {
        zh: "桥间地的任务线非常丰富，126个任务点覆盖了各种类型。建议优先做带蓝色标记的主线任务，会解锁更多区域和功能。支线任务奖励也不错，顺手就做了。",
        tw: "橋間地的任務線非常豐富，126個任務點覆蓋了各種類型。建議優先做帶藍色標記的主線任務，會解鎖更多區域和功能。支線任務獎勵也不錯，順手就做了。",
        en: "The quest network here is rich, with 126 quest points of various types. Prioritize main quests (blue markers) as they unlock more areas and features. Side quest rewards are solid too — worth doing as you pass by.",
      },
      {
        zh: "怪物种类繁多，92个刷新点涵盖从普通小怪到精英怪。打怪掉落的货币和材料是前期重要的收入来源，遇到就顺手清理掉。",
        tw: "怪物種類繁多，92個刷新點涵蓋從普通小怪到精英怪。打怪掉落的貨幣和材料是前期重要的收入來源，遇到就順手清理掉。",
        en: "A wide variety of monsters across 92 spawn points, from common mobs to elites. Combat drops are an important early-game income source — clear them as you encounter them.",
      },
    ],
    tips: [
      {
        zh: "桥间地地形复杂，高处和低处都可能藏着东西。善用攀爬和滑翔，能到达很多看起来去不了的地方。",
        tw: "橋間地地形複雜，高處和低處都可能藏著東西。善用攀爬和滑翔，能到達很多看起來去不了的地方。",
        en: "The terrain here is complex — both high and low ground can hide treasures. Use climbing and gliding to reach seemingly inaccessible spots.",
      },
      {
        zh: "这个区域景点有94个，如果追求全收集的话建议专门抽时间打卡。很多景点位置本身就在收集品附近，可以一起规划路线。",
        tw: "這個區域景點有94個，如果追求全收集的話建議專門抽時間打卡。很多景點位置本身就在收集品附近，可以一起規劃路線。",
        en: "There are 94 viewpoints in this region. If you're going for 100% completion, set aside time specifically for them. Many viewpoints are near collectibles, so plan your route to hit both.",
      },
    ],
  },
  "unheard-shores": {
    intro: {
      zh: "未闻浦是海瑟劳五个区域中规模最小的一个，只有193个标记点，但别被数量骗了——这里的密度和品质一点也不低。未闻浦有种「小而精」的感觉，地形以海岸和悬崖为主，风景非常漂亮，拍照打卡的时候随手一截都是桌面级别。如果你喜欢安静地探索、享受风景，未闻浦会是你的最爱。",
      tw: "未聞浦是海瑟勞五個區域中規模最小的一個，只有193個標記點，但別被數量騙了——這裡的密度和品質一點也不低。未聞浦有種「小而精」的感覺，地形以海岸和懸崖為主，風景非常漂亮，拍照打卡的時候隨手一截都是桌面級別。如果你喜歡安靜地探索、享受風景，未聞浦會是你的最愛。",
      en: "Unheard Shores is the smallest of the five regions with only 193 markers, but don't let the number fool you — the density and quality here are just as impressive. It has a compact but refined feel, with coastlines and cliffs dominating the landscape. The scenery is stunning — almost any screenshot could be a wallpaper. If you enjoy peaceful exploration and taking in the views, Unheard Shores will be your favorite.",
    },
    highlights: [
      {
        zh: "虽然标记点少，但BOSS密度却不低，17个世界BOSS刷新点让这个小区域战斗感十足。加上20块谕石和30个收集品，探索起来一点都不无聊。",
        tw: "雖然標記點少，但BOSS密度卻不低，17個世界BOSS刷新點讓這個小區域戰鬥感十足。加上20塊諭石和30個收集品，探索起來一點都不無聊。",
        en: "Despite fewer total markers, the boss density is surprisingly high — 17 world boss spawn points make this small region feel combat-rich. Add 20 Oracle Stones and 30 collectibles, and exploration here is never boring.",
      },
      {
        zh: "未闻浦的景点每一个都值得驻足，12个观景点分布在海岸线和悬崖上。特别是日出和日落时段，光线打在海面上的效果非常惊艳。",
        tw: "未聞浦的景點每一個都值得駐足，12個觀景點分佈在海岸線和懸崖上。特別是日出和日落時段，光線打在海面上的效果非常驚豔。",
        en: "Every viewpoint here is worth pausing for. The 12 viewpoints are scattered along coastlines and cliff edges. The lighting during sunrise and sunset hitting the ocean surface is truly breathtaking.",
      },
    ],
    tips: [
      {
        zh: "未闻浦的怪物等级相对较高，建议角色有一定基础后再来深度探索。不过传送点只有3个，规划路线的时候要注意移动距离。",
        tw: "未聞浦的怪物等級相對較高，建議角色有一定基礎後再來深度探索。不過傳送點只有3個，規劃路線的時候要注意移動距離。",
        en: "Monster levels here are relatively high — build up your character before deep exploration. Note that there are only 3 waypoints, so plan your routes carefully to minimize travel distance.",
      },
      {
        zh: "这个区域虽然小，但可以和旁边的桥间地或者幻镇一起规划探索路线，从桥间地南下经过未闻浦再到幻镇，顺路就能扫掉不少标记点。",
        tw: "這個區域雖然小，但可以和旁邊的橋間地或者幻鎮一起規劃探索路線，從橋間地南下經過未聞浦再到幻鎮，順路就能掃掉不少標記點。",
        en: "Though small, you can combine this region with neighboring Bridge Crossings or Illusion Town in your exploration route. Head south from Bridge Crossings through Unheard Shores to Illusion Town and clear many markers along the way.",
      },
    ],
  },
  "miguel-district": {
    intro: {
      zh: "米格尔区是海瑟劳的「宝藏猎人天堂」，1321个标记点让它成为标记数量第二多的区域。这里最大的特色就是收集品特别多——236个收集品点，加上481个货币与战利品，光是捡东西就能在这里泡上一整天。米格尔区的地形偏向开放式的城市外围，建筑不那么密集，跑起来很舒服，适合那种边跑边捡的佛系探索风格。",
      tw: "米格爾區是海瑟勞的「寶藏獵人天堂」，1321個標記點讓它成為標記數量第二多的區域。這裡最大的特色就是收集品特別多——236個收集品點，加上481個貨幣與戰利品，光是撿東西就能在這裡泡上一整天。米格爾區的地形偏向開放式的城市外圍，建築不那麼密集，跑起來很舒服，適合那種邊跑邊撿的佛系探索風格。",
      en: "Miguel District is a treasure hunter's paradise. With 1,321 markers, it's the second most marker-dense region. The standout feature is the sheer number of collectibles — 236 collectible points plus 481 currency and loot spots. You could spend a whole day here just picking things up. The terrain is more open and suburban compared to the dense city center, making for a relaxed run-and-grab exploration style.",
    },
    highlights: [
      {
        zh: "236个收集品是米格尔区最大的吸引力。这里的收集品分布比较均匀，不像某些区域集中在几个点。建议分几次来，每次清一片区域，不用一口气跑完，不然真的会累。",
        tw: "236個收集品是米格爾區最大的吸引力。這裡的收集品分佈比較均勻，不像某些區域集中在幾個點。建議分幾次來，每次清一片區域，不用一口氣跑完，不然真的會累。",
        en: "The 236 collectibles are Miguel District's biggest draw. They're distributed fairly evenly, unlike some regions where they cluster in specific spots. Break it into multiple sessions — clear one area at a time. Don't try to do it all at once or you'll burn out.",
      },
      {
        zh: "怪物刷新点高达127个，这意味着你在跑图的过程中几乎随时都在战斗。好处是打怪掉的材料可以顺便积累，坏处是跑起来会慢一些。如果有隐身或者快速移动技能，探索效率会高很多。",
        tw: "怪物刷新點高達127個，這意味著你在跑圖的過程中幾乎隨時都在戰鬥。好處是打怪掉的材料可以順便積累，壞處是跑起來會慢一些。如果有隱身或者快速移動技能，探索效率會高很多。",
        en: "With 127 monster spawn points, you're almost constantly in combat while exploring. The upside is accumulating materials from drops; the downside is slower exploration. Stealth or fast-travel abilities will significantly boost your efficiency here.",
      },
      {
        zh: "商家有149家，服务设施28个，可以说米格尔区是「什么都能买到」的地方。探索累了可以找家店逛逛，看看有没有需要的材料。",
        tw: "商家有149家，服務設施28個，可以說米格爾區是「什麼都能買到」的地方。探索累了可以找家店逛逛，看看有沒有需要的材料。",
        en: "149 shops and 28 service facilities — Miguel District is the place where you can buy just about anything. When you need a break from exploring, browse the shops for materials you might need.",
      },
    ],
    tips: [
      {
        zh: "米格尔区面积较大，传送点只有26个，建议优先解锁靠近收集品密集区的传送点，减少跑图时间。",
        tw: "米格爾區面積較大，傳送點只有26個，建議優先解鎖靠近收集品密集區的傳送點，減少跑圖時間。",
        en: "Miguel District is large with only 26 waypoints. Prioritize unlocking waypoints near collectible-dense areas to reduce travel time.",
      },
      {
        zh: "43块谕石散布在区域各处，有些在建筑顶部或者围墙内侧，跑图的时候多留意高处和角落。",
        tw: "43塊諭石散佈在區域各處，有些在建築頂部或者圍牆內側，跑圖的時候多留意高處和角落。",
        en: "43 Oracle Stones are spread throughout the region. Some are on rooftops or inside walls — keep an eye on elevated spots and corners while exploring.",
      },
    ],
  },
  "illusion-town": {
    intro: {
      zh: "绘空町（幻镇）是海瑟劳里最有「异世界」感的区域。建筑风格独特，充满了一种奇幻又带点诡异的氛围，晚上来逛的时候真的会有点心惊惊。1007个标记点让这里的探索内容非常充实，452个货币与战利品散布在街头巷尾，随便走走就能攒不少。如果你喜欢「每一条小巷都要钻一遍」的探索方式，绘空町会给你很满足的体验。",
      tw: "繪空町（幻鎮）是海瑟勞裡最有「異世界」感的區域。建築風格獨特，充滿了一種奇幻又帶點詭異的氛圍，晚上來逛的時候真的會有點心驚驚。1007個標記點讓這裡的探索內容非常充實，452個貨幣與戰利品散佈在街頭巷尾，隨便走走就能攢不少。如果你喜歡「每一條小巷都要鑽一遍」的探索方式，繪空町會給你很滿足的體驗。",
      en: "Illusion Town is the most otherworldly region in Hethereau. The unique architectural style creates a fantastical yet slightly eerie atmosphere — exploring at night can be genuinely unsettling. With 1,007 markers and 452 currency and loot spots scattered through every street and alley, even a casual walk nets you plenty. If you're the type who wants to explore every last alleyway, Illusion Town delivers a deeply satisfying experience.",
    },
    highlights: [
      {
        zh: "52块谕石是绘空町的重要收集目标，这里的谕石分布很有特点——很多藏在建筑的阴暗角落或者半封闭的空间里，需要仔细搜寻。建议带上提高视野或者感知能力的装备。",
        tw: "52塊諭石是繪空町的重要收集目標，這裡的諭石分佈很有特點——很多藏在建築的陰暗角落或者半封閉的空間裡，需要仔細搜尋。建議帶上提高視野或者感知能力的裝備。",
        en: "52 Oracle Stones are key collectibles here. Their placement is distinctive — many are hidden in dark building corners or semi-enclosed spaces requiring careful searching. Consider bringing gear that enhances perception or visibility.",
      },
      {
        zh: "29个世界BOSS刷新点和71个怪物点，战斗压力不小。不过绘空町的BOSS掉落物品种类比较稀有，值得专门来刷。有些BOSS只在特定时间段出现，注意看刷新条件。",
        tw: "29個世界BOSS刷新點和71個怪物點，戰鬥壓力不小。不過繪空町的BOSS掉落物品種類比較稀有，值得專門來刷。有些BOSS只在特定時間段出現，注意看刷新條件。",
        en: "With 29 world boss spawns and 71 monster points, there's significant combat pressure. However, boss drops here tend to be rarer item types, making them worth farming. Some bosses only appear during specific time windows — check spawn conditions.",
      },
      {
        zh: "商家有116家，服务设施22个，密度不算特别高但够用。绘空町的特色商品比较有独特性，有些是在其他区域买不到的，路过的时候记得看看。",
        tw: "商家有116家，服務設施22個，密度不算特別高但夠用。繪空町的特色商品比較有獨特性，有些是在其他區域買不到的，路過的時候記得看看。",
        en: "116 shops and 22 service facilities — not the highest density but sufficient. Illusion Town's specialty items are quite unique, some available nowhere else. Check them out when you pass by.",
      },
    ],
    tips: [
      {
        zh: "绘空町的小路和暗巷特别多，建议把地图上的传送点都开完后再深度探索。很多收集品在屋顶或者地下室，需要绕路才能到达。",
        tw: "繪空町的小路和暗巷特別多，建議把地圖上的傳送點都開完後再深度探索。很多收集品在屋頂或者地下室，需要繞路才能到達。",
        en: "Illusion Town has many narrow paths and dark alleys. Unlock all waypoints before deep exploration. Many collectibles are on rooftops or in basements requiring detours to reach.",
      },
      {
        zh: "83个景点让绘空町成为拍照打卡的热门区域。这里的建筑风格确实独特，建议在游戏内不同时段多来几次，光影效果变化很大。",
        tw: "83個景點讓繪空町成為拍照打卡的熱門區域。這裡的建築風格確實獨特，建議在遊戲內不同時段多來幾次，光影效果變化很大。",
        en: "With 83 viewpoints, Illusion Town is a popular spot for photography. The architecture is genuinely unique — visit at different in-game times of day for dramatically different lighting effects.",
      },
    ],
  },
};

// ─── Marker type display order ──────────────────────────────────

const MARKER_TYPE_ORDER = [
  "oracle-stone",
  "collectible",
  "viewpoint",
  "quest",
  "boss",
  "monster",
  "waypoint",
  "shop",
  "service",
  "currency",
  "activity",
  "arc-plate",
  "tower",
  "phone-booth",
  "region",
];

const TYPE_ICONS: Record<string, string> = {
  "oracle-stone": "💎",
  collectible: "🎁",
  viewpoint: "📷",
  quest: "📋",
  boss: "⚔️",
  monster: "👹",
  waypoint: "📍",
  shop: "🏪",
  service: "🔧",
  currency: "💰",
  activity: "🎪",
  "arc-plate": "🔮",
  tower: "🗼",
  "phone-booth": "📞",
  region: "🗺️",
};

export default function RegionGuideClient({
  lang,
  regionId,
}: {
  lang: Locale;
  regionId: string;
}) {
  const isZh = isZhLocale(lang);
  const regionInfo = data.regions[regionId];
  const guide = REGION_GUIDES[regionId];
  const markers = data.maps[0].markers.filter((m) => m.region === regionId);

  // Count by type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of markers) {
      counts[m.type] = (counts[m.type] || 0) + 1;
    }
    return counts;
  }, [markers]);

  // Ordered types for display (only show types that have markers)
  const displayTypes = MARKER_TYPE_ORDER.filter((t) => typeCounts[t]);

  // All regions for navigation
  const regionList = Object.entries(data.regions);

  if (!regionInfo || !guide) return null;

  const regionName = isZh ? regionInfo.zh : regionInfo.en;
  const introText = isZh ? guide.intro.zh : guide.intro.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link
          href={`/${lang}/map`}
          className="hover:text-gray-300 transition-colors"
        >
          {isZh ? "互动地图" : "Interactive Map"}
        </Link>
        <span>/</span>
        <span className="text-gray-400">{regionName}</span>
      </nav>

      {/* Region navigation tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        {regionList.map(([rid, info]) => (
          <Link
            key={rid}
            href={`/${lang}/map/region/${rid}`}
            className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0 border ${
              rid === regionId
                ? "text-white font-medium"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-300 hover:border-gray-600"
            }`}
            style={
              rid === regionId
                ? {
                    backgroundColor: info.color + "25",
                    borderColor: info.color + "50",
                  }
                : undefined
            }
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: info.color }}
            />
            {isZh ? info.zh : info.en}
          </Link>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        {isZh ? `${regionName}探索攻略` : `${regionName} Exploration Guide`}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {isZh
          ? `${markers.length} 个标记点 · ${displayTypes.length} 种类型`
          : `${markers.length} markers · ${displayTypes.length} types`}
      </p>

      {/* Static map image */}
      <div className="mb-8 rounded-xl overflow-hidden border border-gray-800">
        <Image
          src={`/images/maps/regions/${regionId}.webp?${IMG_VERSION}`}
          alt={`${regionName} ${isZh ? "标记地图" : "Marker Map"}`}
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Region overview */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {isZh ? "区域概览" : "Region Overview"}
        </h2>
        <p className="text-gray-300 leading-relaxed text-base">{introText}</p>
      </section>

      {/* Marker stats grid */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {isZh ? "标记统计" : "Marker Statistics"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayTypes.map((type) => {
            const typeInfo = data.markerTypes[type];
            if (!typeInfo) return null;
            return (
              <div
                key={type}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{TYPE_ICONS[type] || "📌"}</span>
                  <span className="text-sm font-medium">
                    {isZh ? typeInfo.label : typeInfo.labelEn}
                  </span>
                </div>
                <div className="text-2xl font-bold" style={{ color: typeInfo.color }}>
                  {typeCounts[type]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Highlights */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {isZh ? "探索要点" : "Exploration Highlights"}
        </h2>
        <div className="space-y-4">
          {guide.highlights.map((h, i) => {
            const text = isZh ? h.zh : h.en;
            return (
              <div
                key={i}
                className="bg-gray-800/30 rounded-lg p-4 border-l-4"
                style={{ borderColor: regionInfo.color }}
              >
                <p className="text-gray-300 leading-relaxed">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tips */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          {isZh ? "探索小贴士" : "Exploration Tips"}
        </h2>
        <div className="space-y-3">
          {guide.tips.map((tip, i) => {
            const text = isZh ? tip.zh : tip.en;
            return (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-primary-400 mt-0.5 flex-shrink-0">💡</span>
                <p className="text-gray-400 leading-relaxed text-sm">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Link to interactive map */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50 text-center">
        <p className="text-gray-400 mb-3 text-sm">
          {isZh
            ? "想要查看每个标记的精确位置？使用互动地图精确定位"
            : "Want to see exact locations of every marker? Use the interactive map"}
        </p>
        <Link
          href={`/${lang}/map?region=${regionId}`}
          className="inline-block px-6 py-2.5 rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30 transition-colors text-sm font-medium"
        >
          {isZh ? "打开互动地图" : "Open Interactive Map"} →
        </Link>
      </div>

      {/* SEO text */}
      <div className="mt-8 text-xs text-gray-600 space-y-2">
        <p>
          {isZh
            ? `${regionName}是异环(Neverness to Everness)游戏中的五大区域之一，位于海瑟劳世界的${regionName.includes("北") ? "北部" : regionName.includes("南") ? "南部" : ""}地区。本攻略提供${regionName}全区域资源标记地图，包含谕石、收集品、BOSS位置、传送锚点、商家、景点等${markers.length}个标记点的位置信息。`
            : `${regionName} is one of the five major regions in Neverness to Everness (NTE), located in the world of Hethereau. This guide provides a complete resource marker map for ${regionName}, covering ${markers.length} markers including Oracle Stones, collectibles, world boss locations, waypoints, shops, viewpoints, and more.`}
        </p>
      </div>
    </div>
  );
}
