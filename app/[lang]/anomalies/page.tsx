import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllAnomalies } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { DataStatusBanner } from "../../../components/DataStatusBanner";

const typeLabelKeys: Record<string, string> = {
  boss: "anomalies.boss",
  elite: "anomalies.elite",
  normal: "anomalies.normal",
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
  const locale = lang as Locale;
  const anomalies = getAllAnomalies();
  const description = locale === "tw"
    ? `異環歷史異象索引收錄 ${anomalies.length} 筆目標資料，包含 Boss、精英與普通異象的記錄欄位；目前弱點、機制、掉落與可挑戰狀態請以客戶端為準。`
    : locale === "zh"
    ? `异环历史异象索引收录 ${anomalies.length} 条目标资料，包含 Boss、精英与普通异象的记录字段；当前弱点、机制、掉落与可挑战状态请以客户端为准。`
    : `Historical NTE anomaly index with ${anomalies.length} recorded entries across bosses, elites, and normal anomalies. Verify current weaknesses, mechanics, drops, and encounter availability in the client.`;

  return {
    title: t(locale, "anomalies.seoTitle"),
    description,
    alternates: hreflangAlternates("anomalies", lang),
    openGraph: {
      title: t(locale, "anomalies.seoTitle"),
      description,
      type: "website",
    },
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
          { label: t(locale, "common.home"), href: `/${lang}` },
          { label: t(locale, "anomalies.title") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            {isZhLocale(locale) ? "异象图鉴" : "Anomaly Guide"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {isZhLocale(locale)
              ? "异环历史异象资料索引，包含 Boss、精英与普通目标的记录弱点、机制和掉落字段。当前遭遇、数值、位置与奖励请以目标区服客户端为准。"
              : "Historical NTE anomaly reference index with recorded weakness, mechanic, and drop fields for bosses, elites, and normal targets. Verify current encounters, values, locations, and rewards in the target server's client."}
          </p>
        </div>
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          {isZhLocale(locale)
            ? (locale === "tw" ? "歷史異象資料復核：2026-09-29。本頁的類型、屬性、HP、位置、弱點、機制、策略與掉落均不驗證目前版本；請以目標區服客戶端和官方公告確認。" : "历史异象资料复核：2026-09-29。本页的类型、属性、HP、位置、弱点、机制、策略与掉落均不验证当前版本；请以目标区服客户端和官方公告确认。")
            : "Historical anomaly reference reviewed September 29, 2026. Type, attribute, HP, location, weakness, mechanics, strategy, and drops on this page do not verify the current version; confirm them in the target server's client and official notices."}
        </div>

        {(["boss", "elite", "normal"] as const).map((type) => {
          const items = grouped[type];
          if (items.length === 0) return null;
          const label = typeLabelKeys[type];

          return (
            <section key={type} className="mb-12">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className={`w-1 h-6 rounded ${type === "boss" ? "bg-red-500" : type === "elite" ? "bg-yellow-500" : "bg-blue-500"}`}></span>
                {t(locale, label)}
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
                      {locale === "en" ? anomaly.name : anomaly.nameEn}
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
