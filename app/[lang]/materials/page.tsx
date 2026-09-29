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
  const title = localizedText(locale, "异环历史材料索引：来源字段与角色关联", "NTE Historical Materials: Source Fields & Character Associations");
  const description = localizedText(
    locale,
    "异环历史材料索引，记录猎手指南、突破素材、Boss掉落、弧盘经验与货币等字段；当前来源、掉落、成本和角色用途请以目标区服客户端为准。",
    "Historical NTE material index with recorded hunter-guide, ascension, boss-drop, Arc EXP, and currency fields. Verify current sources, drops, costs, and character uses in the target server's client."
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
            {localizedText(locale, "历史材料索引说明", "Historical Material Index Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              "这里汇总站内记录的角色、技能、弧盘与货币历史材料字段。可按类型与稀有度查找，但来源、用途、关联角色和计算器结果均不验证当前版本。",
              "This page collects site-recorded historical material fields for characters, skills, Arcs, and currencies. You can search by type and rarity, but sources, uses, character associations, and calculator results do not verify the current version."
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
              "用本页查找历史字段后，请在客户端确认目标角色、材料来源、掉落、活动、库存和等级上限。它不能用于决定当前刷取、囤货或消费。",
              "After finding historical fields here, confirm target characters, material sources, drops, events, inventory, and level caps in the client. It cannot determine current farming, stockpiling, or spending."
            )}
          </p>
        </section>
        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "刷材料前先看什么", "What should you check before farming materials?")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "客户端中目标材料是否仍存在、可获得，以及当前来源与开放条件。", "Whether the target material still exists and is obtainable in the client, including its current source and unlock condition.")}</li>
              <li>{localizedText(locale, "目标角色当前是否使用该材料，以及等级、技能和装备的真实需求。", "Whether the target character currently uses it, and the actual level, skill, and equipment requirements.")}</li>
              <li>{localizedText(locale, "当前库存、活动、商店、体力成本与掉落限制。", "Current inventory, events, shops, stamina costs, and drop restrictions.")}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {localizedText(locale, "常见误区", "Common mistakes")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{localizedText(locale, "把历史来源或角色关联字段当作当前刷取结论。", "Treating historical source or character-association fields as current farming conclusions.")}</li>
              <li>{localizedText(locale, "把本地计算器估算当作游戏内真实库存或成本。", "Treating local calculator estimates as real in-game inventory or costs.")}</li>
              <li>{localizedText(locale, "未核对客户端和官方公告就刷取、囤货或消费。", "Farming, stockpiling, or spending without checking the client and official notices.")}</li>
            </ul>
          </div>
        </section>
        <MaterialFilter materials={materials} locale={locale} lang={lang} />
      </div>
    </>
  );
}
