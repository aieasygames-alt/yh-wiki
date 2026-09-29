import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../lib/i18n";
import { getGuide, getAllAnomalies, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";
import { ArticleContent } from "../../../components/ArticleContent";
import { BossCardClient } from "../../../components/BossCardClient";
import { localizedText } from "../../../lib/seo-copy";
import buildsData from "../../../data/builds.json";

const BOSS_GUIDE_ID = "boss-guide-comprehensive";

const TYPE_COLORS: Record<string, string> = {
  boss: "bg-red-500/20 text-red-400 border-red-500/30",
  elite: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

interface BuildEntry {
  characterId: string;
  builds: {
    teamComp: string[];
  }[];
}

const builds = buildsData as BuildEntry[];

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

  const locale = lang as Locale;
  const title = localizedText(locale, guide.title, guide.titleEn, guide.titleTw);
  const description = localizedText(
    locale,
    "异环历史 Boss 与异象索引：查阅记录中的类型、弱点、掉落、机制和策略字段；当前遭遇、奖励和可挑战状态请以客户端为准。",
    "Historical NTE boss and anomaly index with recorded type, weakness, drop, mechanic, and strategy fields. Verify current encounters, rewards, and availability in the client.",
    "異環歷史 Boss 與異象索引：查閱記錄中的類型、弱點、掉落、機制和策略欄位；目前遭遇、獎勵和可挑戰狀態請以客戶端為準。"
  );
  const suffix = localizedText(locale, "异环攻略", "Neverness to Everness Guide");
  return {
    title: `${title} - ${suffix}`,
    description,
    alternates: hreflangAlternates("bosses", lang),
    openGraph: {
      title: `${title} - ${suffix}`,
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

  const title = localizedText(locale, guide.title, guide.titleEn, guide.titleTw);
  const content = isZh ? guide.content : guide.contentEn;
  const summary = localizedText(locale, guide.summary, guide.summaryEn, guide.summaryTw);

  const anomalies = getAllAnomalies();
  const bosses = anomalies.filter((a) => a.type === "boss");
  const elites = anomalies.filter((a) => a.type === "elite");
  const normals = anomalies.filter((a) => a.type === "normal");
  const characters = getAvailableCharacters();
  const characterMap = new Map(
    characters.map((character) => [
      character.id,
      {
        id: character.id,
        name: character.name,
        nameEn: character.nameEn,
      },
    ])
  );
  const recommendedTeams = builds
    .filter((entry) => entry.builds.length > 0 && entry.builds[0].teamComp.length > 0)
    .slice(0, 3)
    .map((entry) => ({
      characterId: entry.characterId,
      team: [entry.characterId, ...entry.builds[0].teamComp]
        .slice(0, 3)
        .map((id) => characterMap.get(id))
        .filter((character): character is NonNullable<typeof character> => Boolean(character)),
    }))
    .filter((entry) => entry.team.length > 0);

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
        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          {isZh
            ? "历史 Boss 与异象资料复核：2026-09-29。本页的目标数量、属性、HP、位置、弱点、机制、策略、掉落、难度和队伍示例均不验证当前版本；请以目标区服客户端和官方公告为准。"
            : "Historical boss and anomaly reference reviewed September 29, 2026. Target counts, attributes, HP, locations, weaknesses, mechanics, strategies, drops, difficulty, and team examples on this page do not verify the current version; use the target server's client and official notices as the source of truth."}
        </section>
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
                <span className="text-xs text-gray-400">{isZh ? "历史 Boss 字段" : "Historical boss fields"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-lg font-bold text-yellow-400">{elites.length}</span>
                <span className="text-xs text-gray-400">{isZh ? "历史精英字段" : "Historical elite fields"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-lg font-bold text-blue-400">{normals.length}</span>
                <span className="text-xs text-gray-400">{isZh ? "历史普通字段" : "Historical normal fields"}</span>
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
          {isZh ? "历史 Boss 与异象字段" : "Historical Boss and Anomaly Fields"}
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
                <BossCardClient key={boss.id} id={boss.id} name={isZh ? boss.name : boss.nameEn} type={boss.type} attribute={isZh ? boss.attribute : boss.attributeEn} hp={boss.hp} weakness={isZh ? boss.weakness : boss.weaknessEn} location={isZh ? boss.location : boss.locationEn} strategy={isZh ? boss.strategy : boss.strategyEn} drops={isZh ? boss.drops : boss.dropsEn} mechanics={isZh ? boss.mechanics : boss.mechanicsEn} lang={lang} isZh={isZh} recommendedTeams={recommendedTeams} />
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
                <BossCardClient key={elite.id} id={elite.id} name={isZh ? elite.name : elite.nameEn} type={elite.type} attribute={isZh ? elite.attribute : elite.attributeEn} hp={elite.hp} weakness={isZh ? elite.weakness : elite.weaknessEn} location={isZh ? elite.location : elite.locationEn} strategy={isZh ? elite.strategy : elite.strategyEn} drops={isZh ? elite.drops : elite.dropsEn} mechanics={isZh ? elite.mechanics : elite.mechanicsEn} lang={lang} isZh={isZh} recommendedTeams={recommendedTeams} />
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
                <BossCardClient key={normal.id} id={normal.id} name={isZh ? normal.name : normal.nameEn} type={normal.type} attribute={isZh ? normal.attribute : normal.attributeEn} hp={normal.hp} weakness={isZh ? normal.weakness : normal.weaknessEn} location={isZh ? normal.location : normal.locationEn} strategy={isZh ? normal.strategy : normal.strategyEn} drops={isZh ? normal.drops : normal.dropsEn} mechanics={isZh ? normal.mechanics : normal.mechanicsEn} lang={lang} isZh={isZh} recommendedTeams={recommendedTeams} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
