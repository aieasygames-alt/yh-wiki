import { notFound } from "next/navigation";
import Link from "next/link";
import { isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getAnomaly, getAllAnomalies } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";

export function generateStaticParams() {
  const anomalies = getAllAnomalies();
  return anomalies.flatMap((a) => [
    { lang: "zh", slug: a.id },
    { lang: "tw", slug: a.id },
    { lang: "en", slug: a.id },
  ]);
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const anomaly = getAnomaly(slug);
  if (!anomaly) return {};

  return {
    title: isZhLocale(lang)
      ? `${anomaly.name}打法攻略 — 弱点机制掉落 | 异环游戏 Wiki`
      : `${anomaly.nameEn} Guide — Weakness, Mechanics & Drops | NTE Wiki`,
    description: isZhLocale(lang)
      ? `异环异象「${anomaly.name}」详细攻略，包含弱点分析、战斗机制、掉落物和推荐打法。`
      : `Complete guide for ${anomaly.nameEn} in Neverness to Everness. Weakness, mechanics, drops, and recommended strategies.`,
    alternates: hreflangAlternates(`anomalies/${slug}`, lang),
  };
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <tr className="border-b border-gray-800/50 last:border-0">
      <td className="py-2 pr-4 text-gray-500 whitespace-nowrap text-sm">{label}</td>
      <td className="py-2 text-gray-300 text-sm">{value}</td>
    </tr>
  );
}

const typeColors: Record<string, string> = {
  boss: "bg-red-500/10 border-red-500/30 text-red-400",
  elite: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  normal: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

export default async function AnomalyDetailPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const anomaly = getAnomaly(slug);
  if (!anomaly) notFound();

  const typeLabel = anomaly.type === "boss" ? "Boss" : anomaly.type === "elite" ? (isZhLocale(locale) ? "精英" : "Elite") : (isZhLocale(locale) ? "普通" : "Normal");

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? "首页" : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? "异象图鉴" : "Anomalies", href: `/${lang}/anomalies` },
          { label: isZhLocale(locale) ? anomaly.name : anomaly.nameEn },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {isZhLocale(locale) ? anomaly.name : anomaly.nameEn}
              </h1>
              <p className="text-gray-500">{isZhLocale(locale) ? anomaly.nameEn : anomaly.name}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full border ${typeColors[anomaly.type] || ""}`}>
              {typeLabel}
            </span>
          </div>
          {anomaly.appearance && (
            <p className="mt-3 text-sm text-gray-400">{anomaly.appearance}</p>
          )}
        </div>

        {/* Quick Stats */}
        <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8">
          <h2 className="text-lg font-bold mb-3">{isZhLocale(locale) ? "基本信息" : "Quick Stats"}</h2>
          <table className="w-full text-sm">
            <tbody>
              <InfoRow label={isZhLocale(locale) ? "类型" : "Type"} typeLabel />
              <InfoRow label={isZhLocale(locale) ? "分类" : "Category"} value={isZhLocale(locale) ? anomaly.categoryZh : anomaly.category} />
              <InfoRow label={isZhLocale(locale) ? "属性" : "Attribute"} value={isZhLocale(locale) ? anomaly.attribute : anomaly.attributeEn} />
              {anomaly.hp && <InfoRow label="HP" value={anomaly.hp} />}
              <InfoRow label={isZhLocale(locale) ? "位置" : "Location"} value={isZhLocale(locale) ? anomaly.location : anomaly.locationEn} />
            </tbody>
          </table>
        </aside>

        {/* Weakness */}
        {anomaly.weakness && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{isZhLocale(locale) ? "弱点分析" : "Weakness"}</h2>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-5">
              <p className="text-gray-300">{isZhLocale(locale) ? anomaly.weakness : anomaly.weaknessEn}</p>
            </div>
          </section>
        )}

        {/* Mechanics */}
        {anomaly.mechanics && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{isZhLocale(locale) ? "战斗机制" : "Mechanics"}</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <p className="text-gray-300">{isZhLocale(locale) ? anomaly.mechanics : anomaly.mechanicsEn}</p>
            </div>
          </section>
        )}

        {/* Strategy */}
        {anomaly.strategy && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{isZhLocale(locale) ? "推荐攻略" : "Strategy"}</h2>
            <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-5">
              <p className="text-gray-300">{isZhLocale(locale) ? anomaly.strategy : anomaly.strategyEn}</p>
            </div>
          </section>
        )}

        {/* Drops */}
        {anomaly.drops && anomaly.drops.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">{isZhLocale(locale) ? "掉落物" : "Drops"}</h2>
            <div className="flex flex-wrap gap-2">
              {(isZhLocale(locale) ? anomaly.drops : anomaly.dropsEn || anomaly.drops).map((drop, i) => (
                <span key={i} className="text-sm px-3 py-1 rounded-full border border-gray-700 bg-gray-800/50 text-gray-300">
                  {drop}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
