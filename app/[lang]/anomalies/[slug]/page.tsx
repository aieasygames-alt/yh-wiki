import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
import { getAnomaly, getAllAnomalies } from "../../../../lib/queries";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../../components/JsonLd";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { anomalySeoCopy, localizedName, localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  const anomalies = getAllAnomalies();
  return anomalies.flatMap((a) => LOCALES.map((lang) => ({ lang, slug: a.id })));
}

export async function generateMetadata({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = await params;
  const anomaly = getAnomaly(slug);
  if (!anomaly) return {};
  const locale = lang as Locale;
  const typeLabel = anomaly.type === "boss"
    ? "Boss"
    : anomaly.type === "elite"
    ? localizedText(locale, "精英", "Elite")
    : localizedText(locale, "普通", "Normal");
  const copy = anomalySeoCopy({
    locale,
    name: anomaly.name,
    nameEn: anomaly.nameEn,
    typeLabel,
    location: anomaly.location,
    locationEn: anomaly.locationEn,
    weakness: anomaly.weakness,
    weaknessEn: anomaly.weaknessEn,
    drops: anomaly.drops,
    dropsEn: anomaly.dropsEn,
  });

  return {
    title: copy.title,
    description: copy.description,
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

  const anomalyName = localizedName(locale, anomaly.name, anomaly.nameEn);
  const typeLabel = anomaly.type === "boss" ? "Boss" : anomaly.type === "elite" ? localizedText(locale, "精英", "Elite") : localizedText(locale, "普通", "Normal");
  const category = localizedText(locale, anomaly.categoryZh || anomaly.category || "", anomaly.category || "");
  const attribute = localizedText(locale, anomaly.attribute || "", anomaly.attributeEn || anomaly.attribute || "");
  const location = localizedText(locale, anomaly.location || "", anomaly.locationEn || anomaly.location || "");
  const weakness = localizedText(locale, anomaly.weakness || "", anomaly.weaknessEn || anomaly.weakness || "");
  const mechanics = localizedText(locale, anomaly.mechanics || "", anomaly.mechanicsEn || anomaly.mechanics || "");
  const strategy = localizedText(locale, anomaly.strategy || "", anomaly.strategyEn || anomaly.strategy || "");
  const drops = locale === "en" ? anomaly.dropsEn || anomaly.drops : anomaly.drops?.map((drop) => localizedText(locale, drop, drop));

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: t(locale, "anomalies.title"), href: `/${lang}/anomalies` },
          { label: anomalyName },
        ]}
      />
      <ArticleJsonLd
        title={anomalyName}
        description={isZhLocale(locale)
          ? `${anomalyName}（${typeLabel}）— 出现位置、机制与应对策略`
          : `${anomaly.nameEn} (${typeLabel}) — spawn locations, mechanics, and counter strategies`}
        url={`https://nteguide.com/${lang}/anomalies/${slug}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {anomalyName}
              </h1>
              <p className="text-gray-500">{locale === "en" ? anomaly.name : anomaly.nameEn}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full border ${typeColors[anomaly.type] || ""}`}>
              {typeLabel}
            </span>
          </div>
          {anomaly.appearance && (
            <p className="mt-3 text-sm text-gray-400">{anomaly.appearance}</p>
          )}
        </div>

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-xl font-bold mb-3">
            {localizedText(locale, "攻略概览", "Guide Overview")}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {localizedText(
              locale,
              `「${anomalyName}」属于${typeLabel}级异象。本页汇总它的出现位置、属性信息、弱点提示、战斗机制、掉落物和应对思路，适合在挑战前快速确认规避点与输出窗口。若页面中的位置或掉落仍显示为预发布资料，请以正式服更新后的数据状态提示为准。`,
              `${anomalyName} is a ${typeLabel} anomaly. This guide summarizes its spawn location, attribute information, weakness cues, combat mechanics, drops, and counter strategy so you can review dodge timing and damage windows before the fight. If any field is marked as pre-release data, treat the live game update as the final source.`
            )}
          </p>
        </section>

        {/* Quick Stats */}
        <aside className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-8">
          <h2 className="text-lg font-bold mb-3">{t(locale, "anomalies.quickStats")}</h2>
          <table className="w-full text-sm">
            <tbody>
              <InfoRow label={t(locale, "common.type")} value={typeLabel} />
              <InfoRow label={t(locale, "anomalies.category")} value={category} />
              <InfoRow label={t(locale, "common.element")} value={attribute} />
              {anomaly.hp && <InfoRow label="HP" value={anomaly.hp} />}
              <InfoRow label={t(locale, "anomalies.location")} value={location} />
            </tbody>
          </table>
        </aside>

        {/* Weakness */}
        {anomaly.weakness && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.weakness")}</h2>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-5">
              <p className="text-gray-300">{weakness}</p>
            </div>
          </section>
        )}

        {/* Mechanics */}
        {anomaly.mechanics && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.mechanics")}</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
              <p className="text-gray-300">{mechanics}</p>
            </div>
          </section>
        )}

        {/* Strategy */}
        {anomaly.strategy && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.strategy")}</h2>
            <div className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-5">
              <p className="text-gray-300">{strategy}</p>
            </div>
          </section>
        )}

        {/* Drops */}
        {drops && drops.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">{t(locale, "anomalies.drops")}</h2>
            <div className="flex flex-wrap gap-2">
              {drops.map((drop, i) => (
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
