import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getGuide, getAllAnomalies } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";
import { ArticleContent } from "../../../components/ArticleContent";
import { BossCardClient } from "../../../components/BossCardClient";

const BOSS_GUIDE_ID = "boss-guide-comprehensive";

const TYPE_COLORS: Record<string, string> = {
  boss: "bg-red-500/20 text-red-400 border-red-500/30",
  elite: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const guide = getGuide(BOSS_GUIDE_ID);
  if (!guide) return {};

  const title = isZhLocale(lang) ? guide.title : guide.titleEn;
  const description = isZhLocale(lang) ? guide.summary : guide.summaryEn;
  return {
    title: `${title} - ${isZhLocale(lang) ? "异环攻略" : "Neverness to Everness Guide"} | NTE Guide`,
    description,
    alternates: hreflangAlternates("bosses", lang),
    openGraph: {
      title: `${title} - ${isZhLocale(lang) ? "异环攻略" : "Neverness to Everness Guide"} | NTE Guide`,
      description,
      type: "article",
    },
  };
}

export default async function BossGuidePage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const guide = getGuide(BOSS_GUIDE_ID);
  if (!guide) notFound();

  const title = isZh ? guide.title : guide.titleEn;
  const content = isZh ? guide.content : guide.contentEn;
  const summary = isZh ? guide.summary : guide.summaryEn;

  const anomalies = getAllAnomalies();
  const bosses = anomalies.filter((a) => a.type === "boss");
  const elites = anomalies.filter((a) => a.type === "elite");
  const normals = anomalies.filter((a) => a.type === "normal");

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={summary}
        url={`https://nteguide.com/${lang}/bosses`}
      />
      {guide.faq && guide.faq.length > 0 && (
        <FaqPageJsonLd faqs={guide.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "bossGuide.title") },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="relative mb-8 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-900/20 via-gray-900/30 to-orange-900/10 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <div className="mb-3">
              <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
                {isZh ? guide.categoryZh : guide.categoryEn}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
            <p className="text-gray-400 leading-relaxed">{summary}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-lg font-bold text-red-400">{bosses.length}</span>
                <span className="text-xs text-gray-400">{isZh ? "Boss" : "Bosses"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-lg font-bold text-yellow-400">{elites.length}</span>
                <span className="text-xs text-gray-400">{isZh ? "精英" : "Elite"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-lg font-bold text-blue-400">{normals.length}</span>
                <span className="text-xs text-gray-400">{isZh ? "普通" : "Normal"}</span>
              </div>
            </div>
          </div>
        </div>

        <ArticleContent content={content} lang={lang} />

        {guide.faq && guide.faq.length > 0 && (
          <FaqSection faqs={guide.faq} locale={locale} />
        )}
      </article>

      {/* Boss Directory */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-6">
          {t(locale, "bossDirectory.title")}
        </h2>

        {/* Boss Anomalies */}
        {bosses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${TYPE_COLORS.boss}`}>
                Boss
              </span>
              <span className="text-gray-500 text-sm">({bosses.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bosses.map((boss) => (
                <BossCardClient key={boss.id} id={boss.id} name={isZh ? boss.name : boss.nameEn} type={boss.type} attribute={isZh ? boss.attribute : boss.attributeEn} hp={boss.hp} weakness={isZh ? boss.weakness : boss.weaknessEn} location={isZh ? boss.location : boss.locationEn} strategy={isZh ? boss.strategy : boss.strategyEn} drops={isZh ? boss.drops : boss.dropsEn} mechanics={isZh ? boss.mechanics : boss.mechanicsEn} lang={lang} isZh={isZh} />
              ))}
            </div>
          </div>
        )}

        {/* Elite Anomalies */}
        {elites.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${TYPE_COLORS.elite}`}>
                Elite
              </span>
              <span className="text-gray-500 text-sm">({elites.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {elites.map((elite) => (
                <BossCardClient key={elite.id} id={elite.id} name={isZh ? elite.name : elite.nameEn} type={elite.type} attribute={isZh ? elite.attribute : elite.attributeEn} hp={elite.hp} weakness={isZh ? elite.weakness : elite.weaknessEn} location={isZh ? elite.location : elite.locationEn} strategy={isZh ? elite.strategy : elite.strategyEn} drops={isZh ? elite.drops : elite.dropsEn} mechanics={isZh ? elite.mechanics : elite.mechanicsEn} lang={lang} isZh={isZh} />
              ))}
            </div>
          </div>
        )}

        {/* Normal Anomalies */}
        {normals.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${TYPE_COLORS.normal}`}>
                Normal
              </span>
              <span className="text-gray-500 text-sm">({normals.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {normals.map((normal) => (
                <BossCardClient key={normal.id} id={normal.id} name={isZh ? normal.name : normal.nameEn} type={normal.type} attribute={isZh ? normal.attribute : normal.attributeEn} hp={normal.hp} weakness={isZh ? normal.weakness : normal.weaknessEn} location={isZh ? normal.location : normal.locationEn} strategy={isZh ? normal.strategy : normal.strategyEn} drops={isZh ? normal.drops : normal.dropsEn} mechanics={isZh ? normal.mechanics : normal.mechanicsEn} lang={lang} isZh={isZh} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
