import Link from "next/link";
import { t } from "../../../lib/i18n";
import { getAllMaterials } from "../../../lib/queries";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  return {
    title: t(locale, "materials.title"),
    description: t(locale, "materials.description"),
  };
}

export default async function MaterialsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  const materials = getAllMaterials();

  const typeLabels: Record<string, string> = {
    chip: lang === "zh" ? "芯片" : "Chip",
    core: lang === "zh" ? "内核" : "Core",
    cert: lang === "zh" ? "认证" : "Certificate",
    drop: lang === "zh" ? "掉落物" : "Drop",
    currency: lang === "zh" ? "货币" : "Currency",
    boss: lang === "zh" ? "Boss材料" : "Boss Material",
    skill: lang === "zh" ? "教材" : "Manual",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(locale, "materials.title")}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {materials.map((m) => (
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
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                {typeLabels[m.type] || m.type}
              </span>
              <span className="text-xs text-yellow-500">
                {"★".repeat(m.rarity)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
