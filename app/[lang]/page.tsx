import Link from "next/link";
import { t, hreflangAlternatesIndex } from "../../lib/i18n";
import { getAllCharacters, getAllMaterials } from "../../lib/queries";
import { WebSiteJsonLd } from "../../components/JsonLd";
import { CharacterCard } from "../../components/CharacterCard";
import { MaterialCard } from "../../components/MaterialCard";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: `${t(locale, "home.heroTitle")} - ${t(locale, "home.heroSubtitle")}`,
    description:
      lang === "zh"
        ? "异环游戏数据库和工具站，提供角色升级材料查询、养成计算器等实用工具。"
        : "YiHuan game database and tools - character leveling materials, farming calculator, and more.",
    alternates: hreflangAlternatesIndex(lang),
    openGraph: {
      title: `${t(locale, "home.heroTitle")} - ${t(locale, "home.heroSubtitle")}`,
      description:
        lang === "zh"
          ? "异环游戏数据库和工具站，提供角色升级材料查询、养成计算器等实用工具。"
          : "YiHuan game database and tools",
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
  const locale = lang as "zh" | "en";
  const characters = getAllCharacters();
  const materials = getAllMaterials();

  return (
    <>
      <WebSiteJsonLd />
      <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-purple-900/20" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
            {t(locale, "home.heroTitle")}
          </h1>
          <p className="mt-4 text-lg text-gray-400">{t(locale, "home.heroSubtitle")}</p>
          <p className="mt-2 text-sm text-gray-500">{t(locale, "home.heroDescription")}</p>
          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block mt-8 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
          >
            {t(locale, "home.ctaCalculator")}
          </Link>
        </div>
      </section>

      {/* Characters Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t(locale, "home.charactersSection")}</h2>
          <Link
            href={`/${lang}/characters`}
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            {t(locale, "home.viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((c) => (
            <CharacterCard
              key={c.id}
              id={c.id}
              name={c.name}
              nameEn={c.nameEn}
              attribute={c.attribute}
              rank={c.rank}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* Materials Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t(locale, "home.materialsSection")}</h2>
          <Link
            href={`/${lang}/materials`}
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            {t(locale, "home.viewAll")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {materials.slice(0, 15).map((m) => (
            <MaterialCard
              key={m.id}
              id={m.id}
              name={m.name}
              nameEn={m.nameEn}
              rarity={m.rarity}
              type={m.type}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
