import Link from "next/link";
import { isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllAnomalies } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../components/DataStatusBanner";

const typeLabels: Record<string, { zh: string; en: string }> = {
  boss: { zh: "Boss级异象", en: "Boss Anomalies" },
  elite: { zh: "精英异象", en: "Elite Anomalies" },
  normal: { zh: "普通异象", en: "Normal Anomalies" },
};

const categoryColors: Record<string, string> = {
  boss: "border-red-500/50 text-red-400",
  elite: "border-yellow-500/50 text-yellow-400",
  normal: "border-blue-500/50 text-blue-400",
};

const categoryBadgeBg: Record<string, string> = {
  boss: "bg-red-500/10 border-red-500/30 text-red-400",
  elite: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  normal: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  return {
    title: isZhLocale(lang) ? "异象图鉴 — Boss/精英/普通异象攻略 | 异环游戏 Wiki" : "Anomaly Guide — Boss, Elite & Normal Enemies | NTE Wiki",
    description: isZhLocale(lang)
      ? "异环全异象图鉴，包含Boss级、精英级和普通异象的弱点、机制、掉落物和打法攻略。"
      : "Complete anomaly guide for Neverness to Everness. Boss, elite, and normal enemy weaknesses, mechanics, drops, and strategies.",
    alternates: hreflangAlternates("anomalies", lang),
  };
}

export default async function AnomaliesPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const anomalies = getAllAnomalies();

  const grouped = {
    boss: anomalies.filter(a => a.type === "boss"),
    elite: anomalies.filter(a => a.type === "elite"),
    normal: anomalies.filter(a => a.type === "normal"),
  };

  return (
    <>
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: isZhLocale(locale) ? "首页" : "Home", href: `/${lang}` },
          { label: isZhLocale(locale) ? "异象图鉴" : "Anomalies" },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {isZhLocale(locale) ? "异象图鉴" : "Anomaly Guide"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZhLocale(locale)
              ? "异环全异象图鉴，包含Boss级、精英级和普通异象的弱点分析、战斗机制和掉落物。"
              : "Complete anomaly database for Neverness to Everness. Boss, elite, and normal enemy weaknesses, mechanics, and drops."}
          </p>
        </div>

        {(["boss", "elite", "normal"] as const).map((type) => {
          const items = grouped[type];
          if (items.length === 0) return null;
          const label = typeLabels[type];

          return (
            <section key={type} className="mb-12">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className={`w-1 h-6 rounded ${type === "boss" ? "bg-red-500" : type === "elite" ? "bg-yellow-500" : "bg-blue-500"}`}></span>
                {isZhLocale(locale) ? label.zh : label.en}
                <span className="text-sm text-gray-500 font-normal">({items.length})</span>
              </h2>
              <div className={`grid gap-4 ${type === "boss" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}`}>
                {items.map((anomaly) => (
                  <Link
                    key={anomaly.id}
                    href={`/${lang}/anomalies/${anomaly.id}`}
                    className={`block rounded-xl border bg-gray-900/50 p-5 hover:border-primary-500/50 transition-colors ${categoryColors[anomaly.type] || "border-gray-800"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold">
                        {isZhLocale(locale) ? anomaly.name : anomaly.nameEn}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded border ${categoryBadgeBg[anomaly.type] || ""}`}>
                        {isZhLocale(locale) ? anomaly.categoryZh : anomaly.category || anomaly.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {isZhLocale(locale) ? anomaly.nameEn : anomaly.name}
                      {anomaly.attribute && ` · ${isZhLocale(locale) ? anomaly.attribute : anomaly.attributeEn}`}
                    </p>
                    {anomaly.weakness && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {isZhLocale(locale) ? anomaly.weakness : anomaly.weaknessEn}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
