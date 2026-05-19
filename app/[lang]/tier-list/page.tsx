import { t, isZhLocale, Locale, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
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
  const characters = getAllCharacters();
  const isZh = isZhLocale(locale);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "tierList.title") },
        ]}
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
        <p className="text-gray-400 mb-8">
          {isZh
            ? `全 ${characters.length} 位角色按综合强度排名，基于技能倍率、队伍适配度和泛用性评估。`
            : `All ${characters.length} characters ranked by overall strength, based on skill multipliers, team synergy, and versatility.`}
        </p>

        <TierListView characters={characters} locale={locale} lang={lang} />

        <p className="text-xs text-gray-600 mt-8">
          {isZh
            ? "评级基于游戏测试版本数据，正式上线后可能调整。评级综合考虑角色在主流队伍中的表现、技能倍率和泛用性。"
            : "Ratings are based on beta test data and may change after official launch. Tier rankings consider overall performance in meta teams, skill multipliers, and versatility."}
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
