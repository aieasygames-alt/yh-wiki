import Link from "next/link";
import { notFound } from "next/navigation";
import { t, hreflangAlternates } from "../../../../lib/i18n";
import {
  getCharacter,
  getCharacterMaterials,
  getMaterialById,
  getAllCharacters,
} from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { CharacterJsonLd, FaqPageJsonLd } from "../../../../components/JsonLd";
import { GameImage } from "../../../../components/GameImage";
import { DataStatusBanner } from "../../../../components/DataStatusBanner";
import { FaqSection } from "../../../../components/FaqSection";
import { CharacterSummary } from "../../../../components/CharacterSummary";
import { SkillDetail } from "../../../../components/SkillDetail";
import { BuildRecommendation } from "../../../../components/BuildRecommendation";
import { TeamCompCard } from "../../../../components/TeamCompCard";
import { TierBadge } from "../../../../components/TierBadge";

export function generateStaticParams() {
  const characters = getAllCharacters();
  return characters.flatMap((c: { id: string }) => [
    { lang: "zh", slug: c.id },
    { lang: "en", slug: c.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const character = getCharacter(slug);
  if (!character) return {};
  return {
    title:
      lang === "zh"
        ? `${character.name} 配装推荐 & 升级材料 | 异环 Wiki`
        : `${character.nameEn} (${character.name}) Build, Skills & Tier - NTE Guide`,
    description:
      lang === "zh"
        ? `异环 ${character.name} 完整配装推荐、技能解析、升级材料列表及获取方式。`
        : `Find the best build for ${character.nameEn} in Neverness to Everness. Complete skill breakdown, tier ranking, recommended weapons, and team comps.`,
    alternates: hreflangAlternates(`characters/${slug}`, lang),
    openGraph: {
      title:
        lang === "zh"
          ? `${character.name} 配装推荐 & 升级材料 | 异环 Wiki`
          : `${character.nameEn} Build & Tier | NTE Guide`,
      description:
        lang === "zh"
          ? `异环 ${character.name} 完整配装推荐、技能解析、升级材料列表及获取方式。`
          : `Find the best build for ${character.nameEn} in Neverness to Everness.`,
      type: "article",
    },
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as "zh" | "en";
  const character = getCharacter(slug);
  if (!character) notFound();

  const cm = getCharacterMaterials(slug);

  const relatedChars = (character.relatedCharacters || [])
    .map(id => getCharacter(id))
    .filter(Boolean);

  return (
    <>
      <CharacterJsonLd character={character} locale={locale} />
      {character.faq && character.faq.length > 0 && (
        <FaqPageJsonLd faqs={character.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.characters"), href: `/${lang}/characters` },
          { label: locale === "zh" ? character.name : character.nameEn },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Character Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage type="character" id={character.id} name={character.name} className="w-24 h-24 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{locale === "zh" ? character.name : `${character.nameEn} Build Guide & Tier Ranking`}</h1>
              <p className="text-gray-500">{character.nameEn}</p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs border ${getAttributeColor(character.attribute)}`}
                >
                  {getAttributeLabel(character.attribute, locale)}
                </span>
                <TierBadge
                  rank={character.rank}
                  tierRank={character.tierRank}
                  tierReason={character.tierReason}
                  tierReasonZh={character.tierReasonZh}
                  locale={locale}
                />
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                {character.weaponEn !== "TBD" && (
                  <span>{locale === "zh" ? character.weapon : character.weaponEn}</span>
                )}
                {character.roleEn !== "TBD" && (
                  <span>{locale === "zh" ? character.role : character.roleEn}</span>
                )}
                {character.faction && (
                  <span>{character.faction}</span>
                )}
              </div>
              {character.description && (
                <p className="mt-3 text-sm text-gray-400">{locale === "zh" ? character.description : character.descriptionEn || character.description}</p>
              )}
            </div>
          </div>
        </div>

        <CharacterSummary
          name={character.name} nameEn={character.nameEn}
          role={character.role} roleEn={character.roleEn}
          attribute={character.attribute} rank={character.rank}
          weapon={character.weapon} weaponEn={character.weaponEn}
          faction={character.faction}
          description={character.description}
          descriptionEn={character.descriptionEn}
          locale={locale}
        />

        {/* Skills Section */}
        {character.skills && (
          <SkillDetail skills={character.skills} locale={locale} />
        )}

        {/* Recommended Build */}
        {character.recommendedBuild && (
          <BuildRecommendation build={character.recommendedBuild} locale={locale} />
        )}

        {/* Team Compositions */}
        {character.teamComps && character.teamComps.length > 0 && (
          <TeamCompCard teams={character.teamComps} locale={locale} />
        )}

        {/* Leveling Materials */}
        {cm && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "characters.levelingMaterials")}</h2>
            <div className="space-y-4">
              {cm.levelingMaterials.map((lr) => {
                return (
                  <div
                    key={lr.levelRange}
                    className="rounded-lg border border-gray-800 bg-gray-900/30 p-4"
                  >
                    <h3 className="text-sm font-medium text-primary-400 mb-3">
                      {lang === "zh" ? `等级 ${lr.levelRange}` : `Level ${lr.levelRange}`}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lr.materials.map((m) => {
                        const material = getMaterialById(m.id);
                        if (!material) return null;
                        return (
                          <Link
                            key={m.id}
                            href={`/${lang}/materials/${m.id}`}
                            className="flex items-center justify-between px-3 py-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
                          >
                            <span className="text-sm truncate">
                              {lang === "zh" ? material.name : material.nameEn}
                            </span>
                            <span className="text-sm font-mono text-primary-400 ml-2">
                              x{m.quantity}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Skill Materials */}
        {cm && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(locale, "characters.skillMaterials")}</h2>
            <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cm.skillMaterials.map((m) => {
                  const material = getMaterialById(m.id);
                  if (!material) return null;
                  return (
                    <Link
                      key={m.id}
                      href={`/${lang}/materials/${m.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-sm truncate">
                        {lang === "zh" ? material.name : material.nameEn}
                      </span>
                      <span className="text-sm font-mono text-primary-400 ml-2">
                        x{m.quantity}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {character.faq && character.faq.length > 0 && (
          <FaqSection faqs={character.faq} locale={locale} />
        )}

        {/* Calculator CTA */}
        <div className="text-center py-8">
          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
          >
            {t(locale, "characters.calculatorCta")}
          </Link>
        </div>

        {/* Related Characters */}
        {relatedChars.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {t(locale, "characters.relatedCharacters")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedChars.map(c => (
                <Link key={c!.id} href={`/${lang}/characters/${c!.id}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{locale === "zh" ? c!.name : c!.nameEn}</p>
                    <p className="text-xs text-gray-500">{locale === "zh" ? c!.nameEn : c!.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tier List Link */}
        {character.tierRank && (
          <div className="mb-8">
            <Link href={`/${lang}/tier-list`} className="text-sm text-primary-400 hover:text-primary-300 inline-block">
              {t(locale, "characters.viewTierList")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
