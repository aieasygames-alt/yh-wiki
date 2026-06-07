import Link from "next/link";
import dynamic from "next/dynamic";
import { t, hreflangAlternatesIndex, isZhLocale, asLocale, type Locale } from "../../lib/i18n";
import { getAvailableCharacters, getAllGuides, getAllWeapons, getLatestBlogPosts } from "../../lib/queries";
import { WebSiteJsonLd, OrganizationJsonLd, VideoGameJsonLd } from "../../components/JsonLd";
import { CharacterCard } from "../../components/CharacterCard";
import { KardzPromoCard } from "../../components/KardzPromoCard";

const SearchDialog = dynamic(() => import("../../components/SearchDialog").then((m) => ({ default: m.SearchDialog })), { ssr: false });
const GiscusComments = dynamic(() => import("../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = asLocale(lang);

  // Locale-specific SEO titles and descriptions for better CTR
  const metaData: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
    zh: {
      title: "异环攻略_Wiki_下载_兑换码_角色排行_地图",
      description: "异环(Neverness to Everness)攻略Wiki：角色强度排行(Tier List)、交互地图(含收集品)、配装计算器、最新兑换码、下载安装指南、全角色Build攻略。非官方最全攻略站。",
      ogTitle: "异环攻略Wiki — 角色排行 · 互动地图 · 配装计算器 · 兑换码",
      ogDescription: "异环(NTE)最全攻略Wiki：角色排行、互动地图、配装计算器、最新兑换码。",
    },
    tw: {
      title: "異環攻略_Wiki_下載_兌換碼_角色排行_地圖",
      description: "異環(Neverness to Everness)攻略Wiki：角色強度排行(Tier List)、互動地圖(含收集品)、配裝計算器、最新兌換碼、下載安裝指南、全角色Build攻略。非官方最全攻略站。",
      ogTitle: "異環攻略Wiki — 角色排行 · 互動地圖 · 配裝計算器 · 兌換碼",
      ogDescription: "異環(NTE)最全攻略Wiki：角色排行、互動地圖、配裝計算器、最新兌換碼。",
    },
    th: {
      title: "NTE Guide - Neverness to Everness Wiki ไทย | บิลด์ตัวละคร เทียร์ลิสต์ รหัสแลก",
      description: "Wiki & เครื่องมือ Neverness to Everness ภาษาไทย บิลด์ตัวละคร, Tier List, เครื่องคำนวณ, คู่มือและรหัสแลก อัปเดตล่าสุด",
      ogTitle: "NTE Guide - Neverness to Everness Wiki ไทย",
      ogDescription: "บิลด์ตัวละคร, Tier List, เครื่องคำนวณ, คู่มือและรหัสแลก NTE ภาษาไทย",
    },
    vi: {
      title: "NTE Guide - Neverness to Everness Wiki Tiếng Việt | Build, Tier List, Mã Đổi",
      description: "Wiki & công cụ Neverness to Everness Tiếng Việt. Build nhân vật, Bảng Xếp Hạng, công cụ tính toán, hướng dẫn và mã đổi quà.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki Tiếng Việt",
      ogDescription: "Build nhân vật, Bảng Xếp Hạng, công cụ tính toán, hướng dẫn NTE Tiếng Việt.",
    },
    id: {
      title: "NTE Guide - Neverness to Everness Wiki Indonesia | Build, Tier List, Kode",
      description: "Wiki & tools Neverness to Everness Bahasa Indonesia. Build karakter, tier list, kalkulator, panduan, dan kode redeem terbaru.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki Indonesia",
      ogDescription: "Build karakter, tier list, kalkulator, panduan NTE Bahasa Indonesia.",
    },
    ja: {
      title: "NTE Guide - Neverness to Everness Wiki 日本語 | ビルド, ティアリスト, コード",
      description: "Neverness to Everness Wiki & ツール日本語版。キャラクタービルド、ティアリスト、計算機、ガイド、交換コード最新情報。",
      ogTitle: "NTE Guide - Neverness to Everness Wiki 日本語",
      ogDescription: "キャラクタービルド、ティアリスト、計算機、ガイド NTE 日本語。",
    },
    ko: {
      title: "NTE Guide - Neverness to Everness Wiki 한국어 | 빌드, 티어 리스트, 코드",
      description: "Neverness to Everness Wiki & 도구 한국어. 캐릭터 빌드, 티어 리스트, 계산기, 가이드, 교환 코드 최신 정보.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki 한국어",
      ogDescription: "캐릭터 빌드, 티어 리스트, 계산기, 가이드 NTE 한국어.",
    },
    en: {
      title: "NTE Wiki — Tier List, Builds, Map, Codes & Guides | Neverness to Everness",
      description: "Neverness to Everness (NTE) wiki: tier list, character builds, interactive map, redeem codes (June 2026), download guide, and DPS calculator. Updated daily.",
      ogTitle: "NTE Wiki — Tier List, Builds, Map, Codes & Guides",
      ogDescription: "Neverness to Everness wiki with tier list, builds, interactive map, redeem codes, and guides.",
    },
  };

  const meta = metaData[locale] || metaData.en;

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
  const guides = getAllGuides();
  const weapons = getAllWeapons();
  const blogPosts = getLatestBlogPosts(3);

  const sRankChars = characters.filter((c) => c.rank === "S" && c.status === "available");

  return (
    <>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <VideoGameJsonLd />
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-purple-900/20" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              {locale === "tw" ? "異環攻略 Wiki" : isZhLocale(locale) ? "异环攻略 Wiki" : "Neverness to Everness Wiki"}
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              {locale === "tw"
                ? "異環(NTE)最全攻略百科：角色排行、配裝、互動地圖、兌換碼、下載安裝"
                : isZhLocale(locale)
                  ? "异环(NTE)最全攻略百科：角色排行、配装、交互地图、兑换码、下载安装"
                  : "Tier list, builds, interactive map, codes, guides & calculators"}
            </p>
            <p className="mt-3 text-sm text-gray-500 max-w-2xl mx-auto">
              {locale === "tw"
                ? "異環(NTE)百科攻略站，收錄全角色圖鑑與Build推薦、強度排行、互動地圖(含收集品標記)、最新兌換碼、下載安裝教程、DPS計算器等工具。每日更新。"
                : isZhLocale(locale)
                  ? "异环(NTE)百科攻略站，收录全角色图鉴与Build推荐、强度排行、交互地图(含收集品标记)、最新兑换码、下载安装教程、DPS计算器等工具。每日更新。"
                  : "The complete Neverness to Everness wiki: character builds, tier list, interactive map with collectibles, redeem codes (June 2026), download guide, DPS calculator. Updated daily."}
            </p>
            <div className="mt-6 flex justify-center">
              <SearchDialog lang={lang} />
            </div>
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
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </Link>
            ))}
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
              { title: t(locale, "explorer.title"), desc: isZhLocale(locale) ? "智能扫图路线规划" : "Smart sweep route planner", href: `/${lang}/explorer`, icon: "🗺️" },
              { title: t(locale, "cityTycoon.title"), desc: isZhLocale(locale) ? "免费S级角色攻略" : "Free S-rank character guide", href: `/${lang}/city-tycoon`, icon: "🏙️" },
              { title: t(locale, "statsCalc.title"), desc: isZhLocale(locale) ? "伤害计算与属性分析" : "Damage & stats analysis", href: `/${lang}/calculator/stats`, icon: "💥" },
              { title: "DPS " + (isZhLocale(locale) ? "计算器" : "Calculator"), desc: isZhLocale(locale) ? "计算循环DPS输出" : "Calculate rotation DPS", href: `/${lang}/calculator/dps`, icon: "🔥" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors group">
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="text-base font-bold mt-3 group-hover:text-primary-400 transition-colors">{tool.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
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
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {isZhLocale(locale) ? g.summary : g.summaryEn}
                </p>
              </Link>
            ))}
          </div>
        </section>

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
                  <time className="text-xs text-gray-500" dateTime={post.date}>{post.date}</time>
                </div>
                <h3 className="text-base font-medium line-clamp-2">
                  {isZhLocale(locale) ? post.title : post.titleEn}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {isZhLocale(locale) ? post.summary : post.summaryEn}
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
              <CharacterCard key={c.id} id={c.id} name={c.name} nameEn={c.nameEn} attribute={c.attribute} rank={c.rank} locale={locale} />
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">{t(locale, "quickLinks.title")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: isZhLocale(locale) ? "异环强度排行" : "NTE Tier List", href: `/${lang}/tier-list`, desc: isZhLocale(locale) ? "全角色评级排名" : "Character rankings" },
              { label: isZhLocale(locale) ? "异环配队推荐" : "Best Teams", href: `/${lang}/teams`, desc: isZhLocale(locale) ? "最佳队伍搭配" : "Best team builds" },
              { label: isZhLocale(locale) ? "异环交互地图" : "Interactive Map", href: `/${lang}/map`, desc: isZhLocale(locale) ? "全地图收集品标记" : "All collectibles marked" },
              { label: isZhLocale(locale) ? "异环兑换码" : "Redeem Codes", href: `/${lang}/redeem-codes`, desc: isZhLocale(locale) ? "最新兑换码实时更新" : "Latest active codes" },
              { label: isZhLocale(locale) ? "异环下载安装" : "Download NTE", href: `/${lang}/guides/download-install-guide`, desc: isZhLocale(locale) ? "PC/手机/PS5下载" : "PC, mobile & PS5" },
              { label: isZhLocale(locale) ? "异环配置要求" : "System Req.", href: `/${lang}/system-requirements`, desc: isZhLocale(locale) ? "PC/手机最低配置" : "PC & mobile specs" },
              { label: isZhLocale(locale) ? "异环武器图鉴" : "Weapons", href: `/${lang}/weapons`, desc: isZhLocale(locale) ? "全弧盘武器数据库" : "Weapon database" },
              { label: isZhLocale(locale) ? "异环Boss攻略" : "Boss Guides", href: `/${lang}/bosses`, desc: isZhLocale(locale) ? "全Boss打法详解" : "All boss strategies" },
              { label: isZhLocale(locale) ? "异环世界观" : "Lore", href: `/${lang}/lore`, desc: isZhLocale(locale) ? "剧情设定百科" : "Story & lore" },
              { label: isZhLocale(locale) ? "DPS计算器" : "DPS Calculator", href: `/${lang}/calculator/dps`, desc: isZhLocale(locale) ? "循环输出计算" : "Rotation DPS calc" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-gray-800 bg-gray-900/30 px-4 py-3 hover:border-primary-500/30 hover:bg-gray-900/50 transition-colors">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
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
