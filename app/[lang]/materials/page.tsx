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
        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {localizedText(locale, "这页材料表最适合怎么用？", "How should you use this material hub?")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {localizedText(
              locale,
              "先按材料类型和稀有度筛掉无关项，再进入详情页确认来源、用途和关联角色。这个总表适合做养成规划和刷取排期，不适合只看名字就判断材料是否该囤。",
              "Filter by material type and rarity first, then open the detail page for source, usage, and character linkage. This hub is best for planning upgrades and farming routes, not deciding what to stockpile from names alone."
            )}
          </p>
        </section>
        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "刷材料前先看什么", "What should you check before farming materials?")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "先确认你要养的是角色等级、技能、弧盘还是货币链路，不同目标的材料优先级完全不同。", "Decide whether you are farming for levels, skills, Arcs, or currencies because each goal changes material priority.")}</li>
              <li>{localizedText(locale, "尽量优先刷能被多个角色共用的材料，再补单角色专属缺口。", "Prioritize shared materials that support several characters before chasing one unit's niche bottleneck.")}</li>
              <li>{localizedText(locale, "如果准备配合计算器使用，先确认当前库存与目标阶段，避免重复刷取。", "If you are pairing this page with a calculator, confirm your current inventory and target breakpoint first to avoid overfarming.")}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "常见误区", "Common mistakes")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "只看材料稀有度，不看真实消耗量和角色覆盖范围。", "Judging materials only by rarity instead of actual demand and roster coverage.")}</li>
              <li>{localizedText(locale, "把短期突破需求和长期毕业需求混在一起，导致刷取节奏失衡。", "Mixing short-term ascension needs with long-term endgame goals and breaking your farming rhythm.")}</li>
              <li>{localizedText(locale, "不结合角色 Build、配队和升级计算器，结果材料分配效率偏低。", "Skipping build, team, and calculator context and ending up with weaker material allocation decisions.")}</li>
            </ul>
          </div>
        </section>
        <MaterialFilter materials={materials} locale={locale} lang={lang} />
      </div>
    </>
  );
}
