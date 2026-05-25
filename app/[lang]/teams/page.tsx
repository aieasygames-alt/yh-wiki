import Link from "next/link";
import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { getGuide, getCharacter, getLocation, getLoreItem, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";
import { ArticleContent } from "../../../components/ArticleContent";
import { TierBadge } from "../../../components/TierBadge";
import { GameImage } from "../../../components/GameImage";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

function charName(c: { name: string; nameTw?: string; nameEn: string }, locale: string): string {
  if (locale === "en") return c.nameEn;
  if (locale === "tw") return c.nameTw || c.name;
  return c.name;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale)
    ? "异环最佳配队推荐 — 全角色队伍组合与Esper Cycle反应链"
    : "NTE Best Team Compositions — All Character Teams & Esper Cycle Reactions";
  const description = isZhLocale(locale)
    ? "异环全角色配队推荐：每角色的最佳队伍组合、Esper Cycle反应链、平民替代方案，按强度排序。"
    : "Best team compositions for all NTE characters: optimal teams, Esper Cycle reaction chains, F2P alternatives, ranked by tier.";
  return {
    title: `${title} | NTE Guide`,
    description,
    alternates: hreflangAlternates("teams", lang),
    openGraph: {
      title: `${title} | NTE Guide`,
      description,
      type: "article",
    },
  };
}

export default async function TeamsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const zh = isZhLocale(locale);

  const guide = getGuide("team-composition-guide");
  const allCharacters = getAvailableCharacters();

  // Get characters that have team comps, sorted by tier
  const charactersWithTeams = allCharacters
    .filter((c) => c.teamComps && c.teamComps.length > 0)
    .sort((a, b) => {
      const tierOrder: Record<string, number> = { SS: 0, "S+": 1, S: 2, "A+": 3, A: 4, "B+": 5, B: 6 };
      return (tierOrder[a.tierRank] ?? 99) - (tierOrder[b.tierRank] ?? 99);
    });

  const title = zh
    ? "异环最佳配队推荐"
    : "Best Team Compositions";
  const summary = zh
    ? "所有异环角色的推荐配队组合，包含 Esper Cycle 反应链和输出循环说明。"
    : "Recommended team compositions for all NTE characters, including Esper Cycle reaction chains and rotation tips.";

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={summary}
        url={`https://nteguide.com/${lang}/teams`}
      />
      {guide && guide.faq && guide.faq.length > 0 && (
        <FaqPageJsonLd faqs={guide.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: zh ? "最佳配队" : "Best Teams" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-gray-400 mb-8">{summary}</p>

        {/* Team Comps by Character */}
        <div className="space-y-6">
          {charactersWithTeams.map((char) => (
            <div
              key={char.id}
              className="rounded-lg border border-gray-800 bg-gray-900/30 p-5"
            >
              {/* Character Header */}
              <div className="flex items-center gap-3 mb-4">
                {char.image && (
                  <GameImage
                    src={char.image}
                    alt={charName(char, locale)}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                )}
                <Link
                  href={`/${lang}/characters/${char.id}`}
                  className="font-bold text-lg hover:text-primary-400 transition-colors"
                >
                  {charName(char, locale)}
                </Link>
                {char.tierRank && <TierBadge rank={char.tierRank} />}
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                  {char.rank}
                </span>
                <span className="text-xs text-gray-500">
                  {zh ? char.role : char.roleEn}
                </span>
              </div>

              {/* Team Comps */}
              <div className="space-y-3">
                {char.teamComps.map((comp, idx) => {
                  const members = comp.members
                    .map((id) => getCharacter(id))
                    .filter(Boolean);

                  return (
                    <div
                      key={idx}
                      className="rounded-md bg-gray-800/40 p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-primary-400">
                          {zh ? comp.name : comp.nameEn}
                        </span>
                      </div>

                      {/* Member avatars */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {members.map((m) => (
                          <Link
                            key={m!.id}
                            href={`/${lang}/characters/${m!.id}`}
                            className="flex items-center gap-1.5 rounded bg-gray-900/60 px-2 py-1 hover:bg-gray-800 transition-colors"
                          >
                            {m!.image && (
                              <GameImage
                                src={m!.image}
                                alt={charName(m!, locale)}
                                width={24}
                                height={24}
                                className="rounded"
                              />
                            )}
                            <span className="text-xs">
                              {charName(m!, locale)}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {m!.attribute}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-400">
                        {zh ? comp.description : comp.descriptionEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Original guide article */}
        {guide && (
          <>
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold mb-6">
                {zh ? "配队系统详解" : "Team Building In-Depth"}
              </h2>
              <ArticleContent
                content={zh ? guide.content : guide.contentEn}
              />
            </div>

            {/* FAQ Section */}
            {guide.faq && guide.faq.length > 0 && (
              <FaqSection faqs={guide.faq} locale={locale} />
            )}
          </>
        )}
      </div>
    </>
  );
}
