import Link from "next/link";
import dynamic from "next/dynamic";
import { t, hreflangAlternatesIndex, isZhLocale, asLocale, type Locale } from "../../lib/i18n";
import { getAllCharacters, getAllGuides, getAllWeapons, getLatestBlogPosts } from "../../lib/queries";
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
      title: "异环攻略站 - 角色排行 · 互动地图 · 配装工具",
      description: "异环(NTE)玩家攻略站：角色强度排行、互动地图、配装计算器、兑换码。内容最全的非官方Wiki。",
      ogTitle: "异环攻略站 - 角色排行 · 互动地图 · 配装工具",
      ogDescription: "异环(NTE)攻略站，角色排行、互动地图、配装计算器、兑换码。",
    },
    tw: {
      title: "異環攻略站 - 角色排行 · 互動地圖 · 配裝工具",
      description: "異環(NTE)玩家攻略站：角色強度排行、互動地圖、配裝計算器、兌換碼。內容最全的非官方Wiki。",
      ogTitle: "異環攻略站 - 角色排行 · 互動地圖 · 配裝工具",
      ogDescription: "異環(NTE)攻略站，角色排行、互動地圖、配裝計算器、兌換碼。",
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
    de: {
      title: "NTE Guide - Neverness to Everness Wiki Deutsch | Builds, Tier List, Codes",
      description: "Wiki & Tools für Neverness to Everness auf Deutsch. Charakter-Builds, Tier-Liste, Rechner, Leitfäden und Codes.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki Deutsch",
      ogDescription: "Charakter-Builds, Tier-Liste, Rechner, Leitfäden NTE Deutsch.",
    },
    fr: {
      title: "NTE Guide - Neverness to Everness Wiki Français | Builds, Tier List, Codes",
      description: "Wiki & outils Neverness to Everness en français. Builds de personnages, tier list, calculateur, guides et codes.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki Français",
      ogDescription: "Builds de personnages, tier list, calculateur, guides NTE en français.",
    },
    es: {
      title: "NTE Guide - Neverness to Everness Wiki Español | Builds, Tier List, Códigos",
      description: "Wiki y herramientas de Neverness to Everness en español. Builds de personajes, tier list, calculadora, guías y códigos.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki Español",
      ogDescription: "Builds de personajes, tier list, calculadora, guías NTE en español.",
    },
    ru: {
      title: "NTE Guide - Neverness to Everness Wiki на русском | Билды, Тир-лист, Коды",
      description: "Wiki и инструменты Neverness to Everness на русском. Билды персонажей, тир-лист, калькулятор, гайды и коды.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki на русском",
      ogDescription: "Билды персонажей, тир-лист, калькулятор, гайды NTE на русском.",
    },
    "pt-br": {
      title: "NTE Guide - Neverness to Everness Wiki Português | Builds, Tier List, Códigos",
      description: "Wiki e ferramentas Neverness to Everness em Português. Builds de personagens, tier list, calculadora, guias e códigos.",
      ogTitle: "NTE Guide - Neverness to Everness Wiki Português",
      ogDescription: "Builds de personagens, tier list, calculadora, guias NTE em Português.",
    },
    en: {
      title: "NTE Wiki: Tier List, Map, Guides & Calculator",
      description: "NTE (Neverness to Everness) wiki with tier list, interactive map, character builds, redeem codes, and guides. Everything you need in one place.",
      ogTitle: "NTE Wiki - Tier List, Map, Guides & Calculator",
      ogDescription: "Tier list, interactive map, character builds, redeem codes, and guides for NTE.",
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
  const characters = getAllCharacters();
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
              {locale === "tw" ? "異環 Wiki 官網" : isZhLocale(locale) ? "异环 Wiki 官网" : "Neverness to Everness Wiki"}
            </h1>
            <p className="mt-4 text-lg text-gray-400">{t(locale, "home.heroSubtitle")}</p>
            <p className="mt-3 text-sm text-gray-500 max-w-2xl mx-auto">
              {locale === "tw"
                ? "異環(NTE)百科攻略官網，收錄全角色圖鑑、配裝推薦、攻略指南、兌換碼、互動地圖與計算器工具。"
                : isZhLocale(locale)
                  ? "异环(NTE)百科攻略官网，收录全角色图鉴、配装推荐、攻略指南、兑换码、交互地图与计算器工具。"
                  : "The complete Neverness to Everness wiki with character builds, guides, tier lists, redeem codes, interactive map, and calculators."}
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
              { label: t(locale, "site.nav.guidesAndTools"), value: 4, color: "text-green-400", href: `/${lang}/calculator/build` },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center hover:border-primary-500/30 transition-colors">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">{t(locale, "site.nav.guidesAndTools")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { title: t(locale, "calculator.leveling"), desc: isZhLocale(locale) ? "计算角色升级所需材料" : "Calculate leveling materials", href: `/${lang}/calculator/leveling`, icon: "📊" },
              { title: t(locale, "calculator.build"), desc: isZhLocale(locale) ? "查看角色推荐搭配" : "View recommended builds", href: `/${lang}/calculator/build`, icon: "⚙️" },
              { title: t(locale, "gacha.title"), desc: isZhLocale(locale) ? "模拟祈愿测试运气" : "Simulate wishes", href: `/${lang}/gacha`, icon: "🎰" },
              { title: t(locale, "site.nav.redeemCodes"), desc: isZhLocale(locale) ? "最新可用兑换码" : "Latest redeem codes", href: `/${lang}/redeem-codes`, icon: "🎁" },
              { title: t(locale, "explorer.title"), desc: isZhLocale(locale) ? "智能扫图路线规划" : "Smart sweep route planner", href: `/${lang}/explorer`, icon: "🗺️" },
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
                  <time className="text-xs text-gray-500">{post.date}</time>
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
              { label: isZhLocale(locale) ? "强度排行" : "Tier List", href: `/${lang}/tier-list`, desc: isZhLocale(locale) ? "角色评级排名" : "Character rankings" },
              { label: isZhLocale(locale) ? "Build攻略" : "Build Guide", href: `/${lang}/blog/nte-nanally-build-guide`, desc: isZhLocale(locale) ? "角色配装推荐" : "Best character builds" },
              { label: isZhLocale(locale) ? "配队指南" : "Team Comps", href: `/${lang}/blog/nte-best-team-comps-1-0`, desc: isZhLocale(locale) ? "最佳队伍搭配" : "Best team builds" },
              { label: isZhLocale(locale) ? "零Build" : "Zero Build", href: `/${lang}/blog/nte-zero-build-guide`, desc: isZhLocale(locale) ? "零爆发配装" : "Zero burst guide" },
              { label: isZhLocale(locale) ? "九原Build" : "Jiuyuan Build", href: `/${lang}/blog/nte-jiuyuan-build-guide`, desc: isZhLocale(locale) ? "九原辅助配装" : "Jiuyuan support guide" },
              { label: isZhLocale(locale) ? "交互地图" : "Map", href: `/${lang}/map`, desc: isZhLocale(locale) ? "全地图标记" : "Interactive map" },
              { label: isZhLocale(locale) ? "配置要求" : "System Req.", href: `/${lang}/system-requirements`, desc: isZhLocale(locale) ? "PC/手机配置" : "PC & mobile specs" },
              { label: isZhLocale(locale) ? "兑换码" : "Redeem Codes", href: `/${lang}/redeem-codes`, desc: isZhLocale(locale) ? "最新兑换码" : "Latest codes" },
              { label: isZhLocale(locale) ? "武器" : "Weapons", href: `/${lang}/weapons`, desc: isZhLocale(locale) ? "武器图鉴" : "Weapon database" },
              { label: isZhLocale(locale) ? "世界观" : "Lore", href: `/${lang}/lore`, desc: isZhLocale(locale) ? "游戏设定" : "Story & lore" },
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
