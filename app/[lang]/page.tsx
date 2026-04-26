import Link from "next/link";
import { t, hreflangAlternatesIndex, type Locale, isZhLocale } from "../../lib/i18n";
import { getAllCharacters, getAllMaterials, getAllGuides, getAllWeapons, getLatestBlogPosts } from "../../lib/queries";
import { WebSiteJsonLd, OrganizationJsonLd, VideoGameJsonLd } from "../../components/JsonLd";
import { CharacterCard } from "../../components/CharacterCard";
import { SearchDialog } from "../../components/SearchDialog";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  return {
    title:
      isZhLocale(lang)
        ? (lang === "tw"
          ? "異環 Wiki 官網 - 攻略 · 配裝 · 工具 | NTE Guide"
          : "异环 Wiki 官网 - 攻略 · 配装 · 工具 | NTE Guide")
        : "Neverness to Everness Wiki & Calculator - Characters, Guides, Tools",
    description:
      isZhLocale(lang)
        ? (lang === "tw"
          ? "異環(Neverness to Everness)Wiki官方攻略站，提供角色配裝、升級計算器、攻略指南和兌換碼。"
          : "异环(Neverness to Everness)Wiki官网，提供角色配装、升级计算器、攻略指南、兑换码和交互地图。")
        : "Find the best builds, tier lists, and guides for Neverness to Everness. Complete character database, leveling calculator, and redeem codes.",
    alternates: hreflangAlternatesIndex(lang),
    openGraph: {
      title:
        isZhLocale(lang)
          ? (lang === "tw"
            ? "異環 Wiki 官網 - 攻略 · 配裝 · 工具"
            : "异环 Wiki 官网 - 攻略 · 配装 · 工具")
          : "Neverness to Everness Wiki & Calculator",
      description:
        isZhLocale(lang)
          ? (lang === "tw"
            ? "異環(NTE)Wiki官方攻略站，提供角色配裝、計算器、攻略和兌換碼。"
            : "异环(NTE)Wiki官网，提供角色配装、计算器、攻略、兑换码和地图。")
          : "Find the best builds, tier lists, and guides for Neverness to Everness.",
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
  const materials = getAllMaterials();
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
              {isZhLocale(locale) ? "异环 Wiki" : "Neverness to Everness Wiki"}
            </h1>
            <p className="mt-4 text-lg text-gray-400">{t(locale, "home.heroSubtitle")}</p>
            <div className="mt-6 flex justify-center">
              <SearchDialog lang={lang} />
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="max-w-6xl mx-auto px-4 -mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: isZhLocale(locale) ? "角色" : "Characters", value: characters.filter((c: any) => c.status === "available").length, color: "text-yellow-400", href: `/${lang}/characters` },
              { label: isZhLocale(locale) ? "武器" : "Weapons", value: weapons.length, color: "text-blue-400", href: `/${lang}/weapons` },
              { label: isZhLocale(locale) ? "攻略" : "Guides", value: guides.length, color: "text-purple-400", href: `/${lang}/guides` },
              { label: isZhLocale(locale) ? "工具" : "Tools", value: 4, color: "text-green-400", href: `/${lang}/calculator/build` },
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
          <h2 className="text-2xl font-bold mb-6">{isZhLocale(locale) ? "实用工具" : "Tools"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: isZhLocale(locale) ? "升级计算器" : "Leveling Calc", desc: isZhLocale(locale) ? "计算角色升级所需材料" : "Calculate leveling materials", href: `/${lang}/calculator/leveling`, icon: "📊" },
              { title: isZhLocale(locale) ? "Build 计算器" : "Build Calc", desc: isZhLocale(locale) ? "查看角色推荐搭配" : "View recommended builds", href: `/${lang}/calculator/build`, icon: "⚙️" },
              { title: isZhLocale(locale) ? "抽卡模拟器" : "Gacha Sim", desc: isZhLocale(locale) ? "模拟祈愿测试运气" : "Simulate wishes", href: `/${lang}/gacha`, icon: "🎰" },
              { title: isZhLocale(locale) ? "兑换码" : "Codes", desc: isZhLocale(locale) ? "最新可用兑换码" : "Latest redeem codes", href: `/${lang}/redeem-codes`, icon: "🎁" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors group">
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="text-base font-bold mt-3 group-hover:text-primary-400 transition-colors">{tool.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Hot Guides */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{isZhLocale(locale) ? "热门攻略" : "Popular Guides"}</h2>
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
            <h2 className="text-2xl font-bold">{isZhLocale(locale) ? "最新博客" : "Latest Blog"}</h2>
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
            <h2 className="text-2xl font-bold">{isZhLocale(locale) ? "S 级角色" : "S-Rank Characters"}</h2>
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
          <h2 className="text-2xl font-bold mb-6">{isZhLocale(locale) ? "快速导航" : "Quick Links"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: isZhLocale(locale) ? "强度排行" : "Tier List", href: `/${lang}/tier-list`, desc: isZhLocale(locale) ? "角色评级排名" : "Character rankings" },
              { label: isZhLocale(locale) ? "交互地图" : "Map", href: `/${lang}/map`, desc: isZhLocale(locale) ? "全地图标记" : "Interactive map" },
              { label: isZhLocale(locale) ? "配置要求" : "System Req.", href: `/${lang}/system-requirements`, desc: isZhLocale(locale) ? "PC/手机配置" : "PC & mobile specs" },
              { label: isZhLocale(locale) ? "兑换码" : "Redeem Codes", href: `/${lang}/redeem-codes`, desc: isZhLocale(locale) ? "最新兑换码" : "Latest codes" },
              { label: isZhLocale(locale) ? "世界观" : "Lore", href: `/${lang}/lore`, desc: isZhLocale(locale) ? "游戏设定" : "Story & lore" },
              { label: isZhLocale(locale) ? "材料" : "Materials", href: `/${lang}/materials`, desc: isZhLocale(locale) ? "材料图鉴" : "Item database" },
              { label: isZhLocale(locale) ? "武器" : "Weapons", href: `/${lang}/weapons`, desc: isZhLocale(locale) ? "武器图鉴" : "Weapon database" },
              { label: isZhLocale(locale) ? "地点" : "Locations", href: `/${lang}/locations`, desc: isZhLocale(locale) ? "全地点一览" : "All locations" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-gray-800 bg-gray-900/30 px-4 py-3 hover:border-primary-500/30 hover:bg-gray-900/50 transition-colors">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
