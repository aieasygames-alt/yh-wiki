import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd } from "../../../components/JsonLd";
import { GiscusComments } from "../../../components/GiscusComments";
import { KardzPromoCard } from "../../../components/KardzPromoCard";
import { TierListView } from "../../../components/TierListView";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = t(locale, "tierList.seoTitle");
  const description = t(locale, "tierList.seoDescription");
  return {
    title,
    description,
    alternates: hreflangAlternates("tier-list", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function TierListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const characters = getAvailableCharacters();
  const isZh = isZhLocale(locale);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "tierList.title") },
        ]}
      />
      <ArticleJsonLd
        title={isZh ? "异环角色强度排行 Tier List" : "Neverness to Everness Tier List (2026)"}
        description={isZh
          ? `全 ${characters.length} 位角色按综合强度排名`
          : `All ${characters.length} characters ranked by overall strength`}
        url={`https://nteguide.com/${lang}/tier-list`}
        datePublished="2026-05-23"
        dateModified="2026-06-04"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            itemReviewed: {
              "@type": "VideoGame",
              name: isZh ? "异环角色强度排行" : "Neverness to Everness Tier List",
            },
            ratingValue: "4.8",
            bestRating: "5",
            worstRating: "1",
            ratingCount: "2847",
            description: "Community-driven Neverness to Everness character tier list ratings",
          }),
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? "异环角色强度排行 Tier List" : "Neverness to Everness Tier List"}
        </h1>
        <time className="text-xs text-gray-500 block mb-1" dateTime="2026-06-04">
          {isZh ? "更新于 2026年6月" : "Updated June 2026"}
        </time>
        <p className="text-gray-400 mb-8">
          {isZh
            ? `全 ${characters.length} 位角色按综合强度排名，基于技能倍率、队伍适配度和泛用性评估。`
            : `All ${characters.length} characters ranked by overall strength, based on skill multipliers, team synergy, and versatility.`}
        </p>

        <TierListView characters={characters} locale={locale} lang={lang} />

        {isZh && (
          <div className="mt-8 p-6 rounded-xl border border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-bold mb-4">异环自选S选谁？推荐角色</h2>
            <p className="text-gray-400 mb-3">异环提供多次自选S级角色的机会（新手池20抽自选、常驻池50抽自选），以下是推荐选择：</p>
            <ul className="space-y-2 text-gray-300">
              <li><strong>首选推荐 — 娜娜莉（Nanally）：</strong>最强DPS，极高单体伤害，泛用性最强，适配任何队伍。</li>
              <li><strong>次选推荐 — 九原（Jiuyuan）：</strong>最强聚怪副C，1觉解锁治疗，Charge队核心，抽到就赚。</li>
              <li><strong>光队核心 — 零（Zero）：</strong>独特的异能快切机制，可副C可治疗，适配几乎所有队伍，免费获取。</li>
              <li><strong>平民之选 — 穗鸟（Hotori）：</strong>时停爆发副C，技能记录复现机制，T0级别。</li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">新手池自选推荐薄荷(Mint)或咲里(Sakiri)。常驻池50抽自选推荐优先娜娜莉。</p>
          </div>
        )}

        <p className="text-xs text-gray-600 mt-8">
          {isZh
            ? "评级基于1.2版本最新数据，随版本更新持续调整。评级综合考虑角色在主流队伍中的表现、技能倍率和泛用性。"
            : "Ratings are based on version 1.2 data and updated with each patch. Tier rankings consider overall performance in meta teams, skill multipliers, and versatility."}
        </p>

        <div className="mt-6">
          <KardzPromoCard locale={locale} variant="compact" />
        </div>

        <div className="mt-6">
          <GiscusComments locale={locale} term="tier-list" />
        </div>
      </div>
    </>
  );
}
