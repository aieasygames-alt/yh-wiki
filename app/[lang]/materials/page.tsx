import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllMaterials } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ItemListJsonLd } from "../../../components/JsonLd";
import { MaterialFilter } from "../../../components/MaterialFilter";
import { localizedText } from "../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环材料列表：获取方式、用途和角色养成素材", "NTE Materials List: Sources, Uses & Character Upgrade Items");
  const description = localizedText(
    locale,
    "异环全材料数据库，整理猎手指南、突破素材、Boss掉落、弧盘经验、货币等材料的获取方式、稀有度和使用角色，适合配合养成计算器规划刷取路线。",
    "Complete Neverness to Everness material database covering hunter guides, ascension items, boss drops, Arc EXP, currencies, sources, rarity, and character usage for farming plans."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("materials", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function MaterialsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const materials = getAllMaterials();

  return (
    <>
      <ItemListJsonLd
        items={materials.map((m) => ({
          name: isZhLocale(locale) ? m.name : m.nameEn,
          url: `https://nteguide.com/${lang}/materials/${m.id}`,
        }))}
      />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.materials") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(locale, "materials.title")}</h1>
        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-lg font-bold mb-3">
            {localizedText(locale, "材料数据库说明", "Material Database Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              "这里汇总异环角色升级、技能培养、弧盘养成和货币兑换相关材料。你可以按材料类型与稀有度筛选，进入详情页查看来源、用途和关联角色，再结合升级计算器估算总需求量。",
              "This page collects materials used for character leveling, skill upgrades, Arc progression, and currencies in Neverness to Everness. Filter by type or rarity, open detail pages for sources and character usage, then combine them with the leveling calculator to estimate total demand."
            )}
          </p>
        </section>
        <MaterialFilter materials={materials} locale={locale} lang={lang} />
      </div>
    </>
  );
}
