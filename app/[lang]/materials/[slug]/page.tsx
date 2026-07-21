import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getMaterial, getCharactersUsingMaterial, getAllMaterials } from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { GameImage } from "../../../../components/GameImage";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { completeMetaDescription, localizedName, localizedText, materialSeoCopy } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  const materials = getAllMaterials();
  return materials.flatMap((m: { id: string }) => LOCALES.map((lang) => ({ lang, slug: m.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const material = getMaterial(slug);
  if (!material) return {};
  const locale = lang as Locale;
  const typeLabels: Record<string, string> = {
    guide: localizedText(locale, "猎手指南", "Hunter guide"),
    ascension: localizedText(locale, "突破素材", "Ascension material"),
    boss: localizedText(locale, "Boss 掉落", "Boss drop"),
    esper: localizedText(locale, "灵能素材", "Esper material"),
    arc: localizedText(locale, "弧盘突破素材", "Arc ascension material"),
    "arc-exp": localizedText(locale, "弧盘经验素材", "Arc EXP material"),
    "module-exp": localizedText(locale, "模组经验素材", "Module EXP material"),
    currency: localizedText(locale, "货币", "Currency"),
  };
  const usedByCount = getCharactersUsingMaterial(slug).length;
  const copy = materialSeoCopy({
    locale,
    name: material.name,
    nameEn: material.nameEn,
    typeLabel: typeLabels[material.type] || material.type,
    rarity: material.rarity,
    source: material.source,
    usedByCount,
  });
  return {
    title: copy.title,
    description: completeMetaDescription(locale, copy.description),
    alternates: hreflangAlternates(`materials/${slug}`, lang),
    openGraph: {
      title: copy.title,
      description: copy.ogDescription,
      type: "article",
    },
  };
}

export default async function MaterialDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const material = getMaterial(slug);
  if (!material) notFound();

  const usedByCharacters = getCharactersUsingMaterial(slug);
  const materialName = localizedName(locale, material.name, material.nameEn);
  const materialSource = localizedText(locale, material.source, material.source);

  const typeLabels: Record<string, string> = {
    guide: t(locale, "materialsDetail.hunterGuide"),
    ascension: t(locale, "materialsDetail.ascension"),
    boss: t(locale, "materialsDetail.bossDrop"),
    esper: t(locale, "materialsDetail.esper"),
    arc: t(locale, "materialsDetail.arcAscension"),
    "arc-exp": t(locale, "materialsDetail.arcExp"),
    "module-exp": t(locale, "materialsDetail.moduleExp"),
    currency: t(locale, "materialsDetail.currency"),
  };

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.materials"), href: `/${lang}/materials` },
          { label: materialName },
        ]}
      />
      <ArticleJsonLd
        title={materialName}
        description={isZhLocale(locale)
          ? `${materialName} — ${typeLabels[material.type] || material.type}素材的获取位置、用途与所需角色`
          : `${material.nameEn || material.name} — ${typeLabels[material.type] || material.type} material: locations, uses, and characters that need it`}
        url={`https://nteguide.com/${lang}/materials/${slug}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Material Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage type="material" id={material.id} name={materialName} className="w-20 h-20 rounded-lg shrink-0" />
            <div>
              <h1 className="text-2xl font-bold">{materialName}</h1>
              <p className="text-gray-500">{material.nameEn}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                  {typeLabels[material.type] || material.type}
                </span>
                <span className="text-yellow-500 text-sm">
                  {"★".repeat(material.rarity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-3">
            {localizedText(locale, "材料概览", "Material Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${materialName}」是异环中的${typeLabels[material.type] || material.type}素材，稀有度为${material.rarity}星。页面整理了该素材的主要来源、刷取入口、用途和关联角色，适合在角色升级、技能培养或弧盘养成前确认所需资源。当前数据库显示共有${usedByCharacters.length}名角色会直接使用该素材。`,
              `${material.nameEn} is a ${material.rarity}-star ${typeLabels[material.type] || material.type} material in Neverness to Everness. This page summarizes where to get it, how it is used, and which characters require it for upgrades, skill progression, or Arc-related progression. The current database links it to ${usedByCharacters.length} character${usedByCharacters.length === 1 ? "" : "s"}.`
            )}
          </p>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            {localizedText(
              locale,
              `如果你正在规划多个角色的养成，建议先记录该素材的来源，再结合升级计算器汇总总需求量。对于尚未实装或资料仍在校对的素材，页面会保留当前已知来源，后续可随版本数据更新继续修正，并同步到站点地图与搜索索引。`,
              `When planning several characters at once, record this material source first and then use the leveling calculator to aggregate total demand. For unreleased or still-verifying materials, the page keeps the best known source and can be updated as new version data lands, then reflected in the sitemap and search index.`
            )}
          </p>
        </section>

        {/* Source */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{t(locale, "materials.source")}</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <p className="text-gray-300">{materialSource}</p>
          </div>
        </section>

        {/* Used By */}
        {usedByCharacters.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "materials.usedBy")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {usedByCharacters.map((c) => (
                <Link
                  key={c.id}
                  href={`/${lang}/characters/${c.id}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <GameImage type="character" id={c.id} name={c.name} src={c.image} className="w-10 h-10 rounded shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${getAttributeColor(c.attribute)}`}
                      >
                        {getAttributeLabel(c.attribute, locale)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "刷取建议", "Farming notes", "刷取建議")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                `如果「${materialName}」同时被多个角色使用，建议优先把它纳入周常或体力固定清单，而不是临时缺什么补什么。这样更容易把单次刷本转化成长期养成进度。`,
                `If ${materialName} is used by multiple characters, put it on a weekly or stamina checklist instead of farming it only when you run short. That turns each farming session into longer-term progression.`,
                `如果「${materialName}」同時被多個角色使用，建議優先把它納入週常或體力固定清單，而不是臨時缺什麼補什麼。這樣更容易把單次刷本轉化成長期養成進度。`
              )}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {localizedText(
                locale,
                "对于来源较分散的素材，先确认掉落点、商店兑换、活动奖励和周常限制，再决定是否值得提前囤货。",
                "For materials with scattered sources, confirm drop locations, shop exchanges, event rewards, and weekly limits before deciding whether to stockpile early.",
                "對於來源較分散的素材，先確認掉落點、商店兌換、活動獎勵和週常限制，再決定是否值得提前囤貨。"
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-lg font-bold mb-3">
              {localizedText(locale, "后续规划", "Next step planning", "後續規劃")}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`/${lang}/calculator/leveling/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "养成计算器", "Leveling calculator", "養成計算器")}
              </Link>
              <Link href={`/${lang}/characters/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "角色列表", "Character list", "角色列表")}
              </Link>
              <Link href={`/${lang}/team-builder/`} className="text-primary-300 hover:text-primary-200">
                {localizedText(locale, "配队模拟器", "Team builder", "配隊模擬器")}
              </Link>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {localizedText(
                locale,
                "素材页的作用不只是告诉你哪里掉，还要告诉你掉下来后该怎么分配。把用途和需求角色一起看，会比单独看素材名更接近真实养成决策。",
                "A material page should do more than tell you where it drops. It should also help you decide how to allocate it after it lands. Reading the uses and target characters together leads to better progression choices than looking at the item name alone.",
                "素材頁的作用不只是告訴你哪裡掉，還要告訴你掉下來後該怎麼分配。把用途和需求角色一起看，會比單獨看素材名更接近真實養成決策。"
              )}
            </p>
          </div>
        </section>

        {/* Calculator CTA */}
        <div className="text-center py-8">
          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
          >
            {t(locale, "materialsDetail.calculateCost")}
          </Link>
        </div>
      </div>
    </>
  );
}
