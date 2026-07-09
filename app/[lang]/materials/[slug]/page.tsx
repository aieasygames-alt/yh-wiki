import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getMaterial, getCharactersUsingMaterial, getAllMaterials } from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { GameImage } from "../../../../components/GameImage";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { localizedName, localizedText, materialSeoCopy } from "../../../../lib/seo-copy";

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
    description: copy.description,
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
