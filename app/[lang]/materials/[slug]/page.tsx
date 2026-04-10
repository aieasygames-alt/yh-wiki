import Link from "next/link";
import { notFound } from "next/navigation";
import { t, hreflangAlternates } from "../../../../lib/i18n";
import { getMaterial, getCharactersUsingMaterial, getAllMaterials } from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { GameImage } from "../../../../components/GameImage";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const materials = getAllMaterials();
  return materials.flatMap((m: { id: string }) => [
    { lang: "zh", slug: m.id },
    { lang: "en", slug: m.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const material = getMaterial(slug);
  if (!material) return {};
  return {
    title:
      lang === "zh"
        ? `${material.name} 获取方式 & 用途 | 异环 Wiki`
        : `${material.nameEn} (${material.name}) Source & Usage - NTE Guide`,
    description:
      lang === "zh"
        ? `异环 ${material.name} 获取方法、掉落地点和使用该材料的全部角色列表。`
        : `Find how to get ${material.nameEn} in Neverness to Everness. Drop locations, farming routes, and all characters that need this material.`,
    alternates: hreflangAlternates(`materials/${slug}`),
    openGraph: {
      title:
        lang === "zh"
          ? `${material.name} 获取方式 & 用途 | 异环 Wiki`
          : `${material.nameEn} Source & Usage | NTE Guide`,
      description:
        lang === "zh"
          ? `异环 ${material.name} 获取方法、掉落地点和使用该材料的全部角色列表。`
          : `Find how to get ${material.nameEn} in Neverness to Everness.`,
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
  const locale = lang as "zh" | "en";
  const material = getMaterial(slug);
  if (!material) notFound();

  const usedByCharacters = getCharactersUsingMaterial(slug);

  const typeLabels: Record<string, string> = {
    resonance: lang === "zh" ? "共鸣材料" : "Resonance",
    nucleus: lang === "zh" ? "核心材料" : "Nucleus",
    permit: lang === "zh" ? "许可证明" : "Permit",
    drop: lang === "zh" ? "掉落物" : "Drop",
    currency: lang === "zh" ? "货币" : "Currency",
    domain: lang === "zh" ? "领域材料" : "Domain",
    manual: lang === "zh" ? "教材" : "Manual",
  };

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.materials"), href: `/${lang}/materials` },
          { label: material.name },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Material Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage type="material" id={material.id} name={material.name} className="w-20 h-20 rounded-lg shrink-0" />
            <div>
              <h1 className="text-2xl font-bold">{material.name}</h1>
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
            <p className="text-gray-300">{material.source}</p>
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
                  <GameImage type="character" id={c.id} name={c.name} className="w-10 h-10 rounded shrink-0" />
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
            {lang === "zh" ? "计算养成成本" : "Calculate Farming Cost"}
          </Link>
        </div>
      </div>
    </>
  );
}
