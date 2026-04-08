import Link from "next/link";
import { t } from "../../lib/i18n";
import { getAllCharacters, getAllMaterials } from "../../lib/queries";
import { WebSiteJsonLd } from "../../components/JsonLd";

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

  const elementColors: Record<string, string> = {
    electric: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    fire: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    ice: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    physical: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    ether: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

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
            <Link
              key={c.id}
              href={`/${lang}/characters/${c.id}`}
              className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
            >
              <div className="w-full aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                <span className="text-2xl text-gray-600">
                  {c.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-medium text-sm truncate">{c.name}</h3>
              <p className="text-xs text-gray-500 truncate">{c.nameEn}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${
                    elementColors[c.element] || ""
                  }`}
                >
                  {c.element}
                </span>
                <span className="text-xs text-yellow-500">
                  {"★".repeat(c.rarity)}
                </span>
              </div>
            </Link>
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
            <Link
              key={m.id}
              href={`/${lang}/materials/${m.id}`}
              className="group block rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-primary-500/50 transition-all hover:-translate-y-0.5"
            >
              <div className="w-full aspect-square rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                <span className="text-lg text-gray-600">
                  {m.name.substring(0, 2)}
                </span>
              </div>
              <h3 className="font-medium text-sm truncate">{m.name}</h3>
              <p className="text-xs text-gray-500 truncate">{m.nameEn}</p>
              <p className="text-xs text-yellow-500 mt-1">
                {"★".repeat(m.rarity)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
