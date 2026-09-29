import Link from "next/link";
import dynamic from "next/dynamic";
import { t, hreflangAlternatesIndex, isZhLocale, asLocale, type Locale } from "../../lib/i18n";
import { getAllCharacters, getAvailableCharacters, getAllGuides, getAllWeapons, getLatestBlogPosts, getRecentContentUpdates } from "../../lib/queries";
import { WebSiteJsonLd, OrganizationJsonLd, VideoGameJsonLd, FaqPageJsonLd } from "../../components/JsonLd";
import { CharacterCard } from "../../components/CharacterCard";
import { KardzPromoCard } from "../../components/KardzPromoCard";

const SearchDialog = dynamic(() => import("../../components/SearchDialog").then((m) => ({ default: m.SearchDialog })), { ssr: false });
const GiscusComments = dynamic(() => import("../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

// Locale-specific SEO titles and descriptions for better CTR.
// Keep this in sync with LOCALES in lib/i18n.ts (currently zh / tw / en).
const HOME_META: Record<Locale, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  zh: {
    title: "异环官网入口与历史资料导航 - 下载 / 配置 / Wiki",
    description: "异环(NTE / Neverness to Everness)非官方导航站：提供官网与客户端下载核对路径，并收录角色、地图、队伍、机制与版本历史资料。当前状态请以目标区服客户端和官方公告为准。",
    ogTitle: "异环官网入口与历史资料导航",
    ogDescription: "核对异环官网、客户端下载、区服与配置；查阅角色、地图、队伍和版本历史资料。",
  },
  tw: {
    title: "異環官網入口與歷史資料導航 - 下載 / 配置 / Wiki",
    description: "異環(NTE / Neverness to Everness)非官方導航站：提供官網與客戶端下載核對路徑，並收錄角色、地圖、隊伍、機制與版本歷史資料。當前狀態請以目標區服客戶端和官方公告為準。",
    ogTitle: "異環官網入口與歷史資料導航",
    ogDescription: "核對異環官網、客戶端下載、區服與配置；查閱角色、地圖、隊伍和版本歷史資料。",
  },
  en: {
    title: "NTE Official Entry & Historical Reference Hub | Neverness to Everness",
    description: "An unofficial NTE navigation hub for verifying official entry, client downloads, servers, and requirements, with historical character, map, team, mechanics, and version references. Check current status in your client and official notices.",
    ogTitle: "NTE Official Entry & Historical References",
    ogDescription: "Verify NTE official entry, downloads, server and requirements; browse historical character, map, team, and version references.",
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
          answer: "先看官网与下载入口、区服说明和配置要求，并在目标区服客户端核对可用状态。角色、配队、地图和版本页用于查阅历史资料；兑换码也应以游戏内领取结果和官方公告为准。",
          answerZh: "先看官网与下载入口、区服说明和配置要求，并在目标区服客户端核对可用状态。角色、配队、地图和版本页用于查阅历史资料；兑换码也应以游戏内领取结果和官方公告为准。",
        },
      ]
    : [
        {
          question: "Where should I start on NTE Guide?",
          questionZh: "Where should I start on NTE Guide?",
          answer: "Start with official entry, download, server, and system requirement guidance, then verify availability in your target client. Character, team, map, and version pages are historical references; confirm redeem codes through the in-game result and official notices.",
          answerZh: "Start with official entry, download, server, and system requirement guidance, then verify availability in your target client. Character, team, map, and version pages are historical references; confirm redeem codes through the in-game result and official notices.",
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
              {locale === "tw" ? "異環官方入口與歷史資料" : isZhLocale(locale) ? "异环官方入口与历史资料" : "NTE Official Entry & Historical References"}
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              {locale === "tw"
                ? "核對官網、下載、區服與配置；查閱角色、地圖、隊伍與版本歷史資料"
                : isZhLocale(locale)
                  ? "核对官网、下载、区服与配置；查阅角色、地图、队伍与版本历史资料"
                  : "Verify official entry, downloads, servers, and requirements; browse historical character, map, team, and version references"}
            </p>
            <p className="mt-3 text-sm text-gray-400 max-w-2xl mx-auto">
              {locale === "tw"
                ? "下載、區服與配置請按目標區服的客戶端和官方公告核對。角色、配隊、地圖、卡池與版本頁保存的是歷史資料，兌換碼也請以遊戲內領取結果為準。"
                : isZhLocale(locale)
                  ? "下载、区服与配置请按目标区服的客户端和官方公告核对。角色、配队、地图、卡池与版本页保存的是历史资料，兑换码也请以游戏内领取结果为准。"
                  : "Verify downloads, servers, and requirements in your target client and official notices. Character, team, map, banner, and version pages preserve historical references; redeem codes also require in-game confirmation."}
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
                href: `/${lang}/version-center`,
                title: isZhLocale(locale) ? (locale === "tw" ? "版本歷史資料" : "版本历史资料") : "Version History Archive",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "按版本查閱已收錄的更新、角色與活動記錄；當前狀態請以官方公告為準" : "按版本查阅已收录的更新、角色与活动记录；当前状态请以官方公告为准")
                  : "Browse recorded updates, characters, and events by version; verify current status in official notices.",
                accent: "border-violet-500/30 bg-violet-500/10 text-violet-300",
              },
              {
                href: `/${lang}/official-site`,
                title: isZhLocale(locale) ? (locale === "tw" ? "異環官網入口導航" : "异环官网入口导航") : "Official Site & Download Guide",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "先分清國服、國際服、Steam、手機、PS5 與雲異環入口" : "先分清国服、国际服、Steam、手机、PS5 与云异环入口")
                  : "Choose between CN/global, PC launcher, Steam, mobile, PS5, and Cloud PC.",
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
                title: isZhLocale(locale) ? (locale === "tw" ? "兌換碼狀態與入口" : "兑换码状态与入口") : "Redeem Code Status & Entry",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "按複核狀態、來源與國服/國際服查看兌換資訊" : "按复核状态、来源与国服/国际服查看兑换信息")
                  : "Check code status, sources, and CN/global redemption details.",
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
                    ? (locale === "tw" ? "版本中心：歷史資料庫" : "版本中心：历史资料库")
                    : "Version Center: Historical Archive"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "按版本集中查看已收錄的更新、角色、活動與攻略記錄；現行內容請以官方公告和客戶端為準" : "按版本集中查看已收录的更新、角色、活动与攻略记录；现行内容请以官方公告和客户端为准")
                    : "Browse recorded updates, characters, events, and guides by version. Confirm live content through official notices and your client."}
                </p>
              </div>
              <span className="text-sky-400/60 group-hover:text-sky-400 text-2xl">→</span>
            </div>
          </Link>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h2 className="text-base font-semibold text-white">
                {isZhLocale(locale) ? "热门对比" : "Popular Comparisons"}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { href: `/${lang}/compare/nte-gacha-vs-competitors`, label: isZhLocale(locale) ? "抽卡系统对比" : "Gacha Comparison" },
                  { href: `/${lang}/compare/nte-vs-genshin`, label: "NTE vs Genshin" },
                  { href: `/${lang}/compare/nte-vs-wuthering-waves`, label: "NTE vs WuWa" },
                  { href: `/${lang}/compare/nte-vs-zzz`, label: "NTE vs ZZZ" },
                  { href: `/${lang}/compare/nte-vs-ananta`, label: "NTE vs Ananta" },
                  { href: `/${lang}/compare/nte-vs-honkai-star-rail`, label: "NTE vs Star Rail" },
                  { href: `/${lang}/compare/games-like-nte`, label: isZhLocale(locale) ? "类似异环的游戏" : "Games Like NTE" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h2 className="text-base font-semibold text-white">
                {isZhLocale(locale) ? "地图区域历史资料" : "Historical Map Regions"}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { id: "new-herland", zh: "新赫兰德", tw: "新赫蘭德", en: "New Herland" },
                  { id: "bridge-crossings", zh: "桥间地", tw: "橋間地", en: "Bridge Crossings" },
                  { id: "unheard-shores", zh: "未闻浦", tw: "未聞浦", en: "Unheard Shores" },
                  { id: "miguel-district", zh: "米格尔区", tw: "米格爾區", en: "Miguel District" },
                  { id: "illusion-town", zh: "绘空町", tw: "繪空町", en: "Illusion Town" },
                ].map((region) => (
                  <Link key={region.id} href={`/${lang}/map/region/${region.id}`} className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors">
                    {locale === "tw" ? region.tw : isZhLocale(locale) ? region.zh : region.en}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
              <h2 className="text-base font-semibold text-white">
                {isZhLocale(locale) ? "快速索引" : "Quick Index"}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { href: `/${lang}/builds`, label: isZhLocale(locale) ? "角色搭配历史资料" : "Historical Build References" },
                  { href: `/${lang}/sitemap`, label: isZhLocale(locale) ? "网站地图" : "Sitemap Page" },
                  { href: `/${lang}/api`, label: "API" },
                  { href: `/${lang}/voice-actors`, label: isZhLocale(locale) ? "声优一览" : "Voice Actors" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-gray-300 hover:border-primary-500/50 hover:text-primary-300 transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
                  ? (locale === "tw" ? "按日期聚合已收錄的版本日誌、攻略與文章；請勿將日期視為現行內容狀態。" : "按日期聚合已收录的版本日志、攻略与文章；请勿将日期视为现行内容状态。")
                  : "A dated index of recorded patch notes, guides, and posts, not a statement of live availability."}
              </p>
            </div>
            <Link href={`/${lang}/version-center`} className="text-sm text-primary-400 hover:text-primary-300">
              {isZhLocale(locale) ? (locale === "tw" ? "開啟版本歷史資料" : "打开版本历史资料") : "Open Version History"} →
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
                    ? (locale === "tw" ? "🎮 異環兌換碼狀態" : "🎮 异环兑换码状态")
                    : "🎮 NTE Redeem Code Status"}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isZhLocale(locale)
                    ? (locale === "tw" ? "按複核狀態、來源與區服查看；請以遊戲內領取結果為準" : "按复核状态、来源与区服查看；请以游戏内领取结果为准")
                    : "Check reviewed status, source, and server; verify the in-game result before planning resources."}
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
                title: isZhLocale(locale) ? (locale === "tw" ? "真紅角色攻略與歷史卡池" : "真红角色攻略与历史卡池") : "Zhenhong Guide & Banner History",
                desc: isZhLocale(locale)
                  ? (locale === "tw" ? "角色定位、配隊、材料與歷史卡池參考；目前可獲取狀態請以客戶端為準" : "角色定位、配队、材料与历史卡池参考；当前可获取状态请以客户端为准")
                  : "Role, teams, materials, and banner history. Verify current availability in-game.",
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
              { title: t(locale, "calculator.build"), desc: isZhLocale(locale) ? "按本地资料查看搭配假设" : "Review local build assumptions", href: `/${lang}/calculator/build`, icon: "⚙️" },
              { title: t(locale, "teamBuilder.title"), desc: isZhLocale(locale) ? "按本地资料模拟队伍" : "Simulate teams from local data", href: `/${lang}/team-builder`, icon: "👥" },
              { title: t(locale, "gacha.title"), desc: isZhLocale(locale) ? "模拟祈愿测试运气" : "Simulate wishes", href: `/${lang}/gacha`, icon: "🎰" },
              { title: t(locale, "site.nav.redeemCodes"), desc: isZhLocale(locale) ? (locale === "tw" ? "按狀態與區服核對兌換碼" : "按状态与区服核对兑换码") : "Check code status by server", href: `/${lang}/redeem-codes`, icon: "🎁" },
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
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環角色評級歷史資料" : "异环角色评级历史资料") : "Historical Tier List", href: `/${lang}/tier-list`, desc: isZhLocale(locale) ? (locale === "tw" ? "已收錄角色評級記錄" : "已收录角色评级记录") : "Recorded character ratings" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環配隊歷史資料" : "异环配队历史资料") : "Historical Teams", href: `/${lang}/teams`, desc: isZhLocale(locale) ? (locale === "tw" ? "已收錄隊伍搭配記錄" : "已收录队伍搭配记录") : "Recorded team references" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環互動地圖歷史資料" : "异环交互地图历史资料") : "Historical Interactive Map", href: `/${lang}/map`, desc: isZhLocale(locale) ? (locale === "tw" ? "已收錄地圖與收集品標記" : "已收录地图与收集品标记") : "Recorded map and collectible markers" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環兌換碼" : "异环兑换码") : "Redeem Codes", href: `/${lang}/redeem-codes`, desc: isZhLocale(locale) ? (locale === "tw" ? "按狀態、來源與區服核對" : "按状态、来源与区服核对") : "Verify status, source & server" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環下載安裝核對" : "异环下载安装核对") : "Verify NTE Download", href: `/${lang}/guides/download-install-guide`, desc: isZhLocale(locale) ? (locale === "tw" ? "按區服核對 PC/手機/PS5 入口" : "按区服核对 PC/手机/PS5 入口") : "Verify PC, mobile, and PS5 entry by server" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環配置要求核對" : "异环配置要求核对") : "Verify System Requirements", href: `/${lang}/system-requirements`, desc: isZhLocale(locale) ? (locale === "tw" ? "以目標客戶端要求為準" : "以目标客户端要求为准") : "Confirm against your target client" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環武器歷史圖鑑" : "异环武器历史图鉴") : "Historical Weapons", href: `/${lang}/weapons`, desc: isZhLocale(locale) ? (locale === "tw" ? "已收錄弧盤武器資料" : "已收录弧盘武器资料") : "Recorded weapon references" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環Boss攻略" : "异环Boss攻略") : "Boss Guides", href: `/${lang}/bosses`, desc: isZhLocale(locale) ? (locale === "tw" ? "全Boss打法詳解" : "全Boss打法详解") : "All boss strategies" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "異環世界觀" : "异环世界观") : "Lore", href: `/${lang}/lore`, desc: isZhLocale(locale) ? (locale === "tw" ? "劇情設定百科" : "剧情设定百科") : "Story & lore" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "DPS計算器" : "DPS计算器") : "DPS Calculator", href: `/${lang}/calculator/dps`, desc: isZhLocale(locale) ? (locale === "tw" ? "循環輸出計算" : "循环输出计算") : "Rotation DPS calc" },
              { label: isZhLocale(locale) ? (locale === "tw" ? "版本歷史資料" : "版本历史资料") : "Version History", href: `/${lang}/version-center`, desc: isZhLocale(locale) ? (locale === "tw" ? "已收錄版本與近期更新記錄" : "已收录版本与近期更新记录") : "Recorded version and update references" },
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
