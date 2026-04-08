import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "../../../../lib/i18n";
import { getMaterial, getCharactersUsingMaterial, getAllMaterials } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";

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
        ? `${material.name} 获取方式 & 用途`
        : `${material.nameEn} Source & Usage`,
    description:
      lang === "zh"
        ? `异环 ${material.name} 获取方法，包含掉落地点和使用该材料的角色列表。`
        : `How to get ${material.nameEn} in YiHuan, including drop locations and characters that use this material.`,
    openGraph: {
      title:
        lang === "zh"
          ? `${material.name} 获取方式 & 用途 | 异环 Wiki`
          : `${material.nameEn} Source & Usage | YiHuan Wiki`,
      description:
        lang === "zh"
          ? `异环 ${material.name} 获取方法`
          : `How to get ${material.nameEn}`,
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
    chip: lang === "zh" ? "芯片" : "Chip",
    core: lang === "zh" ? "内核" : "Core",
    cert: lang === "zh" ? "认证" : "Certificate",
    drop: lang === "zh" ? "掉落物" : "Drop",
    currency: lang === "zh" ? "货币" : "Currency",
    boss: lang === "zh" ? "Boss材料" : "Boss Material",
    skill: lang === "zh" ? "教材" : "Manual",
  };

  const elementColors: Record<string, string> = {
    electric: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    fire: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    ice: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    physical: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    ether: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

  return (
    <>
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
            <div className="w-20 h-20 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
              <span className="text-xl text-gray-600">
                {material.name.substring(0, 2)}
              </span>
            </div>
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
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center shrink-0">
                    <span className="text-sm text-gray-600">{c.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border ${
                          elementColors[c.element] || ""
                        }`}
                      >
                        {c.element}
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
