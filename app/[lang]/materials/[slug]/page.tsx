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
          ? `${materialName} — ${typeLabels[material.type] || material.type}的历史来源与角色关联字段`
          : `${material.nameEn || material.name} — historical ${typeLabels[material.type] || material.type} source and character-association fields`}
        url={`https://nteguide.com/${lang}/materials/${slug}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          {localizedText(
            locale,
            "历史材料资料复核：2026-09-29。本页的稀有度、来源、掉落、商店、活动、成本、用途与角色关联均不验证当前版本；刷取、囤货、升级或消费前，请以目标区服客户端和官方公告逐项核对。",
            "Historical material reference reviewed September 29, 2026. Rarity, sources, drops, shops, events, costs, uses, and character associations on this page do not verify the current version. Before farming, stockpiling, upgrading, or spending, confirm each item in the target server's client and official notices.",
            "歷史素材資料復核：2026-09-29。本頁的稀有度、來源、掉落、商家、活動、成本、用途與角色關聯均不驗證目前版本；刷取、囤貨、升級或消費前，請以目標區服客戶端和官方公告逐項核對。"
          )}
        </section>
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
            {localizedText(locale, "历史材料字段", "Historical Material Fields")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${materialName}」的站内历史字段记录为${material.rarity}星${typeLabels[material.type] || material.type}，并关联${usedByCharacters.length}名角色。当前来源、掉落、用途和角色需求必须在客户端核对。`,
              `Site historical fields record ${material.nameEn} as a ${material.rarity}-star ${typeLabels[material.type] || material.type} with ${usedByCharacters.length} character association${usedByCharacters.length === 1 ? "" : "s"}. Confirm current sources, drops, uses, and character requirements in the client.`
            )}
          </p>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            {localizedText(
              locale,
              "本页与升级计算器只适合作为本地历史对照；不读取背包，也不验证当前材料数量、等级上限、掉落、活动或商店状态。",
              "This page and the leveling calculator are local historical comparisons only; they do not read your inventory or verify current quantities, level caps, drops, events, or shop status."
            )}
          </p>
        </section>

        {/* Source */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">{localizedText(locale, "记录中的来源", "Recorded Source Field", "記錄中的來源")}</h2>
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
              {localizedText(locale, "客户端核对步骤", "Client Verification Steps", "客戶端核對步驟")}
            </h2>
            <p className="text-sm leading-6 text-gray-300">
              {localizedText(
                locale,
                "先在客户端确认目标角色当前是否使用该材料，以及等级、技能和装备的实际数量。",
                "First verify in the client whether the target character currently uses this material and the actual level, skill, and equipment quantities.",
                "先在客戶端確認目標角色目前是否使用該素材，以及等級、技能和裝備的實際數量。"
              )}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              {localizedText(
                locale,
                "再核对当前掉落点、商店兑换、活动奖励、体力成本和日周限制；历史来源字段不能证明当前可获得。",
                "Then verify current drop locations, shop exchanges, event rewards, stamina costs, and daily or weekly limits; a historical source field does not establish current availability.",
                "再核對目前掉落點、商家兌換、活動獎勵、體力成本和日週限制；歷史來源欄位不能證明目前可獲得。"
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
                "角色、配队与计算器链接均是历史参考；当前养成决策请以客户端数据为准。",
                "Character, team, and calculator links are historical references too; use client data for current progression decisions.",
                "角色、配隊與計算器連結均是歷史參考；目前養成決策請以客戶端資料為準。"
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
