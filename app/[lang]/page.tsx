import Link from "next/link";
import dynamic from "next/dynamic";
import { t, hreflangAlternatesIndex, isZhLocale, asLocale, type Locale } from "../../lib/i18n";
import { getAllCharacters, getAvailableCharacters, getAllGuides, getAllWeapons, getLatestBlogPosts, getLatestLiveChangelog, getRecentContentUpdates } from "../../lib/queries";
import { WebSiteJsonLd, OrganizationJsonLd, VideoGameJsonLd, FaqPageJsonLd } from "../../components/JsonLd";
import { CharacterCard } from "../../components/CharacterCard";
import { KardzPromoCard } from "../../components/KardzPromoCard";

const SearchDialog = dynamic(() => import("../../components/SearchDialog").then((m) => ({ default: m.SearchDialog })), { ssr: false });
const GiscusComments = dynamic(() => import("../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

// Locale-specific SEO titles and descriptions for better CTR.
// Keep this in sync with LOCALES in lib/i18n.ts (currently zh / tw / en).
const HOME_META: Record<Locale, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  zh: {
    title: "异环官网入口在哪？异环 Wiki / 下载 / 地图 / 角色攻略站",
    description: "异环(NTE / Neverness to Everness)非官方 Wiki：整理异环官网入口、PC/手机下载安装、Steam/国际服选择、交互地图、角色图鉴、配队、配置要求与最新兑换码。",
    ogTitle: "异环 Wiki / 下载 / 地图 / 角色图鉴攻略站",
    ogDescription: "查异环官网入口、下载安装、国际服、地图、角色图鉴、配队和配置要求。",
  },
  tw: {
    title: "異環官網入口在哪？異環 Wiki / 下載 / 地圖 / 角色攻略站",
    description: "異環(NTE / Neverness to Everness)非官方 Wiki：整理異環官網入口、PC/手機下載安裝、Steam/國際服選擇、互動地圖、角色圖鑑、配隊、配置要求與最新兌換碼。",
    ogTitle: "異環 Wiki / 下載 / 地圖 / 角色圖鑑攻略站",
    ogDescription: "查異環官網入口、下載安裝、國際服、地圖、角色圖鑑、配隊和配置要求。",
  },
  en: {
    title: "NTE Wiki, Download, Map & Character Guides | Neverness to Everness",
    description: "Neverness to Everness (NTE) wiki with official-site entry help, PC/mobile download guide, Steam vs global server tips, interactive map, character builds, tier list, system requirements, and redeem codes.",
    ogTitle: "NTE Wiki, Download, Map & Character Guides",
    ogDescription: "Find the NTE download path, Steam/global tips, map, character guides, builds, and system requirements.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = asLocale(lang);
  const meta = HOME_META[locale] ?? HOME_META.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: hreflangAlternatesIndex(lang),
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: "website",
      images: [{ url: "https://nteguide.com/images/blog/nte-promotional-welcome-key-art.webp", width: 1920, height: 1080, alt: "Neverness to Everness" }],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const allCharacters = getAllCharacters();
  const guides = getAllGuides();
  const weapons = getAllWeapons();
  const blogPosts = getLatestBlogPosts(3);
  const recentUpdates = getRecentContentUpdates(6);
  const liveVersion = getLatestLiveChangelog();
  const homeFaqs = isZhLocale(locale)
    ? [
        {
          question: "异环官网入口在哪里？",
          questionZh: "异环官网入口在哪里？",
          answer: "如果你要找异环官网入口，建议先从首页进入下载指南，再按 PC 官网启动器、Steam/Epic、手机、PS5 或云异环选择对应入口。不要优先使用第三方网盘包。",
          answerZh: "如果你要找异环官网入口，建议先从首页进入下载指南，再按 PC 官网启动器、Steam/Epic、手机、PS5 或云异环选择对应入口。不要优先使用第三方网盘包。",
        },
        {
          question: "异环新手最该先看哪些页面？",
          questionZh: "异环新手最该先看哪些页面？",
          answer: "优先看下载安装、配置要求、兑换码、角色图鉴、配队推荐和互动地图。这样能先解决能不能玩、从哪里下载、领什么奖励、养谁和怎么探索。",
          answerZh: "优先看下载安装、配置要求、兑换码、角色图鉴、配队推荐和互动地图。这样能先解决能不能玩、从哪里下载、领什么奖励、养谁和怎么探索。",
        },
      ]
    : [
        {
          question: "Where should I start on NTE Guide?",
          questionZh: "Where should I start on NTE Guide?",
          answer: "Start with the download guide, system requirements, redeem codes, character index, best teams, tier list, and interactive map. Those pages cover whether you can play, where to download, what rewards to claim, and which units to build.",
          answerZh: "Start with the download guide, system requirements, redeem codes, character index, best teams, tier list, and interactive map. Those pages cover whether you can play, where to download, what rewards to claim, and which units to build.",
        },
      ];

  const sRankChars = characters.filter((c) => c.rank === "S" && c.status === "available");
  const priorityCharacterIds = ["shinku", "black-bird", "akane", "lingko", "illica", "renee", "nitsa"];
  const priorityCharacters = priorityCharacterIds
    .map((id) => allCharacters.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <VideoGameJsonLd />
      <FaqPageJsonLd faqs={homeFaqs} lang={locale} />
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-purple-900/20" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              {locale === "tw" ? "異環 Wiki / 下載 / 攻略站" : isZhLocale(locale) ? "异环 Wiki / 下载 / 攻略站" : "NTE Wiki, Download & Guide Hub"}
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              {locale === "tw"
                ? "異環官網入口、下載安裝、Steam / 國際服、角色排行、互動地圖"
                : isZhLocale(locale)
                  ? "异环官网入口、下载安装、Steam / 国际服、角色排行、交互地图"
                  : "Official-site entry help, download, Steam/global tips, map, builds & calculators"}
            </p>
            <p className="mt-3 text-sm text-gray-400 max-w-2xl mx-auto">
              {locale === "tw"
                ? "先找異環官網、Steam、PC 啟動器、國際服或角色攻略，都可以從這裡進。站內整理下載安裝路徑、角色圖鑑、配隊、配置要求、互動地圖與最新兌換碼。"
                : isZhLocale(locale)
                  ? "先找异环官网、Steam、PC 启动器、国际服或角色攻略，都可以从这里进。站内整理下载安装路径、角色图鉴、配队、配置要求、交互地图与最新兑换码。"
                  : "Start here if you need the official-site path, Steam, PC launcher, global-server guidance, character guides, map, or redeem codes."}
            </p>
            <div className="mt-6 flex justify-center">
              <SearchDialog lang={lang} />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                href: `/${lang}/guides/download-install-guide`,
                title: isZhLocale(locale) ? (locale === "tw" ? "異環官網 / 下載安裝" : "异环官网 / 下载安装") : "Official Site & Download Guide",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "PC 啟動器、Android、iOS、PS5 下載入口與安裝步驟" : "PC 启动器、Android、iOS、PS5 下载入口与安装步骤")
                  : "Official launcher, Android, iOS, and PS5 entry points with install steps.",
                accent: "border-primary-500/30 bg-primary-500/10 text-primary-300",
              },
              {
                href: `/${lang}/cn-vs-global`,
                title: isZhLocale(locale) ? (locale === "tw" ? "異環國服 vs 國際服" : "异环国服 vs 国际服") : "CN vs Global Server",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "看懂國服、國際服、賬號不互通與平台入口差異" : "看懂国服、国际服、账号不互通与平台入口差异")
                  : "Choose between CN and global, including account separation and platform flow.",
                accent: "border-sky-500/30 bg-sky-500/10 text-sky-300",
              },
              {
                href: `/${lang}/steam`,
                title: isZhLocale(locale) ? (locale === "tw" ? "異環 Steam / PC 指南" : "异环 Steam / PC 指南") : "Steam / PC Guide",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "Steam、Epic、官網啟動器、雲異環 PC 該怎麼選" : "Steam、Epic、官网启动器、云异环 PC 该怎么选")
                  : "Pick between Steam, Epic, the official launcher, and Cloud PC.",
                accent: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
              },
              {
                href: `/${lang}/blog/cloud-yihuan-pc-guide`,
                title: isZhLocale(locale) ? (locale === "tw" ? "雲異環 PC 入口" : "云异环 PC 入口") : "Cloud Yihuan PC",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "免費時長、排隊、收費和普通客戶端差異" : "免费时长、排队、收费和普通客户端区别")
                  : "Free time, queues, pricing, and launcher differences.",
                accent: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
              },
              {
                href: `/${lang}/redeem-codes`,
                title: isZhLocale(locale) ? (locale === "tw" ? "1.3 前瞻兌換碼" : "1.3 前瞻兑换码") : "1.3 Redeem Codes",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "最新禮包碼、直播碼、國服/國際服兌換入口" : "最新礼包码、直播码、国服/国际服兑换入口")
                  : "Latest codes, livestream drops, and redeem steps.",
                accent: "border-amber-500/30 bg-amber-500/10 text-amber-300",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors"
              >
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.accent}`}>
                  {isZhLocale(locale) ? (locale === "tw" ? "高需求入口" : "高需求入口") : "High-Intent Entry"}
                </span>
                <h2 className="mt-3 text-lg font-bold group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Cards */}
        <section className="max-w-6xl mx-auto px-4 -mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t(locale, "site.nav.characters"), value: characters.filter((c) => c.status === "available").length, color: "text-yellow-400", href: `/${lang}/characters` },
              { label: t(locale, "site.nav.weapons"), value: weapons.length, color: "text-blue-400", href: `/${lang}/weapons` },
              { label: t(locale, "site.nav.guides"), value: guides.length, color: "text-purple-400", href: `/${lang}/guides` },
              { label: "DPS " + (isZhLocale(locale) ? "计算器" : "Calculator"), value: "NEW", color: "text-primary-400", href: `/${lang}/calculator/dps` },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center hover:border-primary-500/30 transition-colors">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Version center CTA */}
        <section className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${lang}/version-center`}
            className="block rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 p-4 hover:border-sky-500/50 hover:from-sky-500/15 hover:to-cyan-500/15 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? `版本中心：${liveVersion?.version ?? "1.x"} 現行重點` : `版本中心：${liveVersion?.version ?? "1.x"} 当前重点`)
                    : `Version Center: v${liveVersion?.version ?? "1.x"} Live Patch`}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "把現行版本更新、熱門攻略、角色抽取與下一版本觀察點集中到一頁查看" : "把当前版本更新、热门攻略、角色抽取与下一版本观察点集中到一页查看")
                    : "See the live patch, hot guides, banner decisions, and next-version watchpoints in one place."}
                </p>
              </div>
              <span className="text-sky-400/60 group-hover:text-sky-400 text-2xl">→</span>
            </div>
          </Link>
        </section>

        {/* Recent updates */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {isZhLocale(locale) ? (locale === "tw" ? "最近更新" : "最近更新") : "Recent Updates"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {isZhLocale(locale)
                  ? (locale === "tw" ? "按日期聚合版本日誌、攻略與文章，回站時先看這裡最快。" : "按日期聚合版本日志、攻略与文章，回站时先看这里最快。")
                  : "A chronological mix of patch notes, guides, and posts for fast re-entry."}
              </p>
            </div>
            <Link href={`/${lang}/version-center`} className="text-sm text-primary-400 hover:text-primary-300">
              {isZhLocale(locale) ? (locale === "tw" ? "打開版本中心" : "打开版本中心") : "Open Version Center"} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentUpdates.map((item) => {
              const kindLabel = isZhLocale(locale)
                ? item.kind === "changelog"
                  ? (locale === "tw" ? "更新日誌" : "更新日志")
                  : item.kind === "guide"
                    ? "攻略"
                    : "文章"
                : item.kind === "changelog"
                  ? "Patch Notes"
                  : item.kind === "guide"
                    ? "Guide"
                    : "Post";

              return (
                <Link
                  key={`${item.kind}-${item.id}`}
                  href={`/${lang}${item.href}`}
                  className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary-500/15 px-2.5 py-1 text-xs text-primary-300">
                      {kindLabel}
                    </span>
                    <time className="text-xs text-gray-500" dateTime={item.date}>{item.date}</time>
                  </div>
                  <h3 className="mt-3 text-base font-semibold line-clamp-2">
                    {locale === "tw" ? (item.titleTw || item.title) : isZhLocale(locale) ? item.title : item.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                    {locale === "tw" ? (item.summaryTw || item.summary) : isZhLocale(locale) ? item.summary : item.summaryEn}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Redeem Codes CTA — boost internal linking for ranking */}
        <section className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${lang}/redeem-codes`}
            className="block rounded-xl border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-purple-500/10 p-4 hover:border-primary-500/50 hover:from-primary-500/15 hover:to-purple-500/15 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary-400 group-hover:text-primary-300 transition-colors">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "🎮 最新異環兌換碼" : "🎮 最新异环兑换码")
                    : "🎮 Active NTE Redeem Codes (2026)"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "全服可用兌換碼即時更新，免費領取獎勵" : "全服可用兑换码实时更新，免费领取奖励")
                    : "All working Neverness to Everness codes — updated daily. Free rewards!"}
                </p>
              </div>
              <span className="text-primary-400/60 group-hover:text-primary-400 text-2xl">→</span>
            </div>
          </Link>
        </section>

        {/* F2P Guide CTA — high search volume topic */}
        <section className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/${lang}/blog/nte-f2p-complete-resource-guide`}
            className="block rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 hover:border-emerald-500/50 hover:from-emerald-500/15 hover:to-teal-500/15 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "💡 零氪完全資源規劃指南" : "💡 零氪完全资源规划指南")
                    : "💡 How F2P Friendly is NTE? (2026)"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "免費抽数、體力分配、角色獲取路線全解析" : "免费抽数、体力分配、角色获取路线全解析")
                    : "Free pulls, stamina planning, and character priority — the complete F2P breakdown."}
                </p>
              </div>
              <span className="text-emerald-400/60 group-hover:text-emerald-400 text-2xl">→</span>
            </div>
          </Link>
        </section>

        {/* Hot Topic Shortcuts */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: `/${lang}/guides/nine-hundred-ninety-nine-nights-mode`,
                title: isZhLocale(locale) ? (locale === "tw" ? "999夜怎麼玩？" : "999夜怎么玩？") : "How Does 999 Nights Work?",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "模式解鎖、周回收益、沃倫大陸核心機制快速看懂" : "模式解锁、周回收益、沃伦大陆核心机制快速看懂")
                  : "Unlock steps, repeat farming value, and the Warren Continent core loop.",
                accent: "border-amber-500/30 bg-amber-500/10 text-amber-300",
              },
              {
                href: `/${lang}/guides/zhenhong-build-guide`,
                title: isZhLocale(locale) ? (locale === "tw" ? "真紅值不值得抽？" : "真红值不值得抽？") : "Is Zhenhong Worth Pulling?",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "下半卡池熱詞：抽取建議、配隊、材料與養成優先級" : "下半卡池热词：抽取建议、配队、材料与养成优先级")
                  : "Phase 2 banner advice, teams, mats, and build priorities.",
                accent: "border-rose-500/30 bg-rose-500/10 text-rose-300",
              },
              {
                href: `/${lang}/blog/cloud-yihuan-pc-guide`,
                title: isZhLocale(locale) ? (locale === "tw" ? "雲異環 PC 能玩嗎？" : "云异环 PC 能玩吗？") : "Can You Play NTE on PC Now?",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "官網、Epic、雲異環 PC、Steam 入口差異一次講清" : "官网、Epic、云异环 PC、Steam 入口差异一次讲清")
                  : "Official client, Epic, Cloud PC, and Steam availability compared.",
                accent: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors"
              >
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.accent}`}>
                  {isZhLocale(locale) ? (locale === "tw" ? "近期熱門" : "近期热门") : "Trending Now"}
                </span>
                <h2 className="mt-3 text-lg font-bold group-hover:text-primary-400 transition-colors">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">{t(locale, "site.nav.guidesAndTools")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
            {[
              { title: t(locale, "calculator.leveling"), desc: isZhLocale(locale) ? "计算角色升级所需材料" : "Calculate leveling materials", href: `/${lang}/calculator/leveling`, icon: "📊" },
              { title: t(locale, "calculator.build"), desc: isZhLocale(locale) ? "查看角色推荐搭配" : "View recommended builds", href: `/${lang}/calculator/build`, icon: "⚙️" },
              { title: t(locale, "teamBuilder.title"), desc: isZhLocale(locale) ? "构建最佳阵容" : "Build best teams", href: `/${lang}/team-builder`, icon: "👥" },
              { title: t(locale, "gacha.title"), desc: isZhLocale(locale) ? "模拟祈愿测试运气" : "Simulate wishes", href: `/${lang}/gacha`, icon: "🎰" },
              { title: t(locale, "site.nav.redeemCodes"), desc: isZhLocale(locale) ? "最新可用兑换码" : "Latest redeem codes", href: `/${lang}/redeem-codes`, icon: "🎁" },
              { title: isZhLocale(locale) ? (locale === "tw" ? "999夜規劃器" : "999夜规划器") : "999 Nights Planner", desc: isZhLocale(locale) ? (locale === "tw" ? "神秘鈕扣缺口與每日目標" : "神秘纽扣缺口与每日目标") : "Plan Mystery Button targets", href: `/${lang}/999-nights-planner`, icon: "🧮" },
              { title: t(locale, "explorer.title"), desc: isZhLocale(locale) ? "智能扫图路线规划" : "Smart sweep route planner", href: `/${lang}/explorer`, icon: "🗺️" },
              { title: t(locale, "cityTycoon.title"), desc: isZhLocale(locale) ? "免费S级角色攻略" : "Free S-rank character guide", href: `/${lang}/city-tycoon`, icon: "🏙️" },
              { title: t(locale, "statsCalc.title"), desc: isZhLocale(locale) ? "伤害计算与属性分析" : "Damage & stats analysis", href: `/${lang}/calculator/stats`, icon: "💥" },
              { title: "DPS " + (isZhLocale(locale) ? "计算器" : "Calculator"), desc: isZhLocale(locale) ? "计算循环DPS输出" : "Calculate rotation DPS", href: `/${lang}/calculator/dps`, icon: "🔥" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors group">
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="text-base font-bold mt-3 group-hover:text-primary-400 transition-colors">{tool.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{tool.desc}</p>
              </Link>
            ))}
            <KardzPromoCard locale={locale} variant="card" />
          </div>
        </section>

        {/* Hot Guides */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t(locale, "guides.title")}</h2>
            <Link href={`/${lang}/guides`} className="text-sm text-primary-400 hover:text-primary-300">
              {t(locale, "home.viewAll")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.slice(0, 6).map((g) => (
              <Link key={g.id} href={`/${lang}/guides/${g.id}`} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors">
                <span className="text-xs px-2 py-0.5 rounded bg-primary-500/20 text-primary-400">
                  {isZhLocale(locale) ? g.categoryZh : g.categoryEn}
                </span>
                <h3 className="text-base font-medium mt-2">
                  {isZhLocale(locale) ? g.title : g.titleEn}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {isZhLocale(locale) ? g.summary : g.summaryEn}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Characters */}
        {priorityCharacters.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {isZhLocale(locale) ? (locale === "tw" ? "熱門角色攻略" : "热门角色攻略") : "Trending NTE Character Guides"}
              </h2>
              <Link href={`/${lang}/characters`} className="text-sm text-primary-400 hover:text-primary-300">
                {t(locale, "home.viewAll")} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {priorityCharacters.map((character) => (
                <Link
                  key={character!.id}
                  href={`/${lang}/characters/${character!.id}`}
                  className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/40 hover:bg-gray-900/70 transition-colors"
                >
                  <p className="text-sm font-semibold">
                    {locale === "tw" ? (character!.nameTw || character!.name) : isZhLocale(locale) ? character!.name : `${character!.nameEn} NTE`}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {isZhLocale(locale)
                      ? `${character!.rank}级${character!.role}`
                      : `${character!.rank}-rank ${character!.roleEn} guide`}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Blog */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t(locale, "blog.title")}</h2>
            <Link href={`/${lang}/blog`} className="text-sm text-primary-400 hover:text-primary-300">
              {t(locale, "home.viewAll")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/${lang}/blog/${post.id}`} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary-500/20 text-primary-400">
                    {isZhLocale(locale) ? post.categoryZh : post.categoryEn}
                  </span>
                  <time className="text-xs text-gray-400" dateTime={post.date}>{post.date}</time>
                </div>
                <h3 className="text-base font-medium line-clamp-2">
                  {locale === "tw" ? (post.titleTw || post.title) : isZhLocale(locale) ? post.title : post.titleEn}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {locale === "tw" ? (post.summaryTw || post.summary) : isZhLocale(locale) ? post.summary : post.summaryEn}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* S-Rank Characters */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t(locale, "home.sRankCharacters")}</h2>
            <Link href={`/${lang}/characters`} className="text-sm text-primary-400 hover:text-primary-300">
              {t(locale, "home.viewAll")} →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sRankChars.map((c) => (
              <CharacterCard key={c.id} id={c.id} name={c.name} nameTw={c.nameTw} nameEn={c.nameEn} attribute={c.attribute} rank={c.rank} locale={locale} />
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">{t(locale, "quickLinks.title")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環強度排行" : "异环强度排行") : "NTE Tier List", href: `/${lang}/tier-list`, desc: isZhLocale(locale) ? (locale === "tw" ? "全角色評級排名" : "全角色评级排名") : "Character rankings" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環配隊推薦" : "异环配队推荐") : "Best Teams", href: `/${lang}/teams`, desc: isZhLocale(locale) ? (locale === "tw" ? "最佳隊伍搭配" : "最佳队伍搭配") : "Best team builds" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環互動地圖" : "异环交互地图") : "Interactive Map", href: `/${lang}/map`, desc: isZhLocale(locale) ? (locale === "tw" ? "全地圖收集品標記" : "全地图收集品标记") : "All collectibles marked" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環兌換碼" : "异环兑换码") : "Redeem Codes", href: `/${lang}/redeem-codes`, desc: isZhLocale(locale) ? (locale === "tw" ? "最新兌換碼即時更新" : "最新兑换码实时更新") : "Latest active codes" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環下載安裝" : "异环下载安装") : "Download NTE", href: `/${lang}/guides/download-install-guide`, desc: isZhLocale(locale) ? (locale === "tw" ? "PC/手機/PS5下載" : "PC/手机/PS5下载") : "PC, mobile & PS5" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環配置要求" : "异环配置要求") : "System Req.", href: `/${lang}/system-requirements`, desc: isZhLocale(locale) ? (locale === "tw" ? "PC/手機最低配置" : "PC/手机最低配置") : "PC & mobile specs" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環武器圖鑑" : "异环武器图鉴") : "Weapons", href: `/${lang}/weapons`, desc: isZhLocale(locale) ? (locale === "tw" ? "全弧盤武器資料庫" : "全弧盘武器数据库") : "Weapon database" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環Boss攻略" : "异环Boss攻略") : "Boss Guides", href: `/${lang}/bosses`, desc: isZhLocale(locale) ? (locale === "tw" ? "全Boss打法詳解" : "全Boss打法详解") : "All boss strategies" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環世界觀" : "异环世界观") : "Lore", href: `/${lang}/lore`, desc: isZhLocale(locale) ? (locale === "tw" ? "劇情設定百科" : "剧情设定百科") : "Story & lore" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "DPS計算器" : "DPS计算器") : "DPS Calculator", href: `/${lang}/calculator/dps`, desc: isZhLocale(locale) ? (locale === "tw" ? "循環輸出計算" : "循环输出计算") : "Rotation DPS calc" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "版本中心" : "版本中心") : "Version Center", href: `/${lang}/version-center`, desc: isZhLocale(locale) ? (locale === "tw" ? "現行版本與近期更新入口" : "现行版本与近期更新入口") : "Live patch and recent updates" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-gray-800 bg-gray-900/30 px-4 py-3 hover:border-primary-500/30 hover:bg-gray-900/50 transition-colors">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Player Discussion */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <GiscusComments locale={locale} term="general" />
        </section>
      </div>
    </>
  );
}
