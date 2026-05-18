import { notFound } from "next/navigation";
import Link from "next/link";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getGuide, getAllAnomalies } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";
import { ArticleContent } from "../../../components/ArticleContent";

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
        <div className="mb-2">
          <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-400">
            {isZh ? guide.categoryZh : guide.categoryEn}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <ArticleContent content={content} />

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
                <BossCard key={boss.id} id={boss.id} name={isZh ? boss.name : boss.nameEn} type={boss.type} attribute={isZh ? boss.attribute : boss.attributeEn} hp={boss.hp} weakness={isZh ? boss.weakness : boss.weaknessEn} location={isZh ? boss.location : boss.locationEn} strategy={isZh ? boss.strategy : boss.strategyEn} drops={isZh ? boss.drops : boss.dropsEn} mechanics={isZh ? boss.mechanics : boss.mechanicsEn} lang={lang} />
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
                <BossCard key={elite.id} id={elite.id} name={isZh ? elite.name : elite.nameEn} type={elite.type} attribute={isZh ? elite.attribute : elite.attributeEn} hp={elite.hp} weakness={isZh ? elite.weakness : elite.weaknessEn} location={isZh ? elite.location : elite.locationEn} strategy={isZh ? elite.strategy : elite.strategyEn} drops={isZh ? elite.drops : elite.dropsEn} mechanics={isZh ? elite.mechanics : elite.mechanicsEn} lang={lang} />
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
                <BossCard key={normal.id} id={normal.id} name={isZh ? normal.name : normal.nameEn} type={normal.type} attribute={isZh ? normal.attribute : normal.attributeEn} hp={normal.hp} weakness={isZh ? normal.weakness : normal.weaknessEn} location={isZh ? normal.location : normal.locationEn} strategy={isZh ? normal.strategy : normal.strategyEn} drops={isZh ? normal.drops : normal.dropsEn} mechanics={isZh ? normal.mechanics : normal.mechanicsEn} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function BossCard({
  id,
  name,
  type,
  attribute,
  hp,
  weakness,
  location,
  strategy,
  drops,
  mechanics,
  lang,
}: {
  id: string;
  name: string;
  type: string;
  attribute?: string;
  hp?: string;
  weakness?: string;
  location?: string;
  strategy?: string;
  drops?: string[];
  mechanics?: string;
  lang: string;
}) {
  return (
    <Link
      href={`/${lang}/anomalies/${id}`}
      className="block rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-primary-500/30 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <h4 className="font-semibold text-sm flex-1">{name}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded border ${TYPE_COLORS[type] || ""}`}>
          {type === "boss" ? "Boss" : type === "elite" ? "Elite" : "Normal"}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {attribute && (
          <div className="flex gap-2">
            <span className="text-gray-500 w-12 shrink-0">{type === "boss" ? "Attr" : "Attr"}</span>
            <span className="text-gray-300">{attribute}</span>
          </div>
        )}
        {hp && (
          <div className="flex gap-2">
            <span className="text-gray-500 w-12 shrink-0">HP</span>
            <span className="text-gray-300">{hp}</span>
          </div>
        )}
        {location && (
          <div className="flex gap-2">
            <span className="text-gray-500 w-12 shrink-0">Loc</span>
            <span className="text-gray-300">{location}</span>
          </div>
        )}
        {weakness && (
          <div className="flex gap-2">
            <span className="text-gray-500 w-12 shrink-0">Weak</span>
            <span className="text-yellow-400 line-clamp-1">{weakness}</span>
          </div>
        )}
        {strategy && (
          <div className="mt-2 pt-2 border-t border-gray-800/50">
            <p className="text-gray-400 line-clamp-2">{strategy}</p>
          </div>
        )}
        {drops && drops.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {drops.map((d, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
