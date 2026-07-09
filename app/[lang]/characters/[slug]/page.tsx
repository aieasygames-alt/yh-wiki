import Link from "next/link";
import { notFound } from "next/navigation";
import { t, isZhLocale, Locale, hreflangAlternates, LOCALES } from "../../../../lib/i18n";
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
import { RotationGuide } from "../../../../components/RotationGuide";
import { TierBadge } from "../../../../components/TierBadge";
import { QuickAnswerCard } from "../../../../components/QuickAnswerCard";
import { KardzPromoCard } from "../../../../components/KardzPromoCard";
import { localizedText } from "../../../../lib/seo-copy";
import dynamic from "next/dynamic";

const GiscusComments = dynamic(() => import("../../../../components/GiscusComments").then((m) => ({ default: m.GiscusComments })), { ssr: false });

/** Get character display name for a given locale */
function charName(c: { name: string; nameTw?: string; nameEn: string }, locale: string): string {
  if (locale === "zh") return c.name;
  if (locale === "tw") return localizedText("tw", c.name, c.nameEn, c.nameTw);
  return c.nameEn;
}

function bannerCta(slug: string, locale: Locale) {
  const isZh = isZhLocale(locale);
  if (slug === "lacrimosa") {
    return {
      eyebrow: isZh ? "当前限定卡池" : "Current Limited Banner",
      title: isZh ? "安魂曲UP：2026.06.03 - 2026.06.24" : "Lacrimosa Rate-Up: 2026-06-03 to 2026-06-24",
      description: isZh
        ? "适合缺混沌范围输出、想组安魂曲配队或需要1.1主C的玩家。抽前建议先确认专武和队伍资源。"
        : "Best for players who need Chaos AoE DPS, a Lacrimosa team core, or a version 1.1 main DPS. Check weapon and team resources before pulling.",
      primary: isZh ? "查看卡池时间表" : "View Banner Schedule",
      secondary: isZh ? "抽卡机制" : "Gacha System",
    };
  }
  if (slug === "chaos") {
    return {
      eyebrow: isZh ? "下期限定卡池" : "Next Limited Banner",
      title: isZh ? "卡厄斯预热：2026.06.24 - 2026.07.08" : "Chaos Preview: 2026-06-24 to 2026-07-08",
      description: isZh
        ? "卡厄斯是1.1下半限定角色。技能、专属弧盘和陪跑阵容以上线后实测为准，当前适合先规划抽数与相属性配队。"
        : "Chaos is the version 1.1 Phase 2 limited character. His kit, signature Arc, and A-rank lineup should be verified at launch; use this page to plan pulls and Lakshana teams now.",
      primary: isZh ? "查看卡池时间表" : "View Banner Schedule",
      secondary: isZh ? "配队工具" : "Team Builder",
    };
  }
  return null;
}

const EN_CHARACTER_SEO: Record<string, { title: string; description: string; h1: string }> = {
  "black-bird": {
    title: "Black Bird NTE Guide - Build, Skills, Tier & Teams | Neverness to Everness",
    description: "Black Bird NTE character guide for Neverness to Everness: Chaos S-rank role, best build, weapons, disk sets, team comps, skills, tier ranking, and material links.",
    h1: "Black Bird NTE Guide: Build, Skills & Tier Ranking",
  },
  akane: {
    title: "Akane NTE Guide - Build, Skills, Tier & Teams | Neverness to Everness",
    description: "Akane NTE character guide for Neverness to Everness: best build, weapons, disk sets, team comps, skill priority, tier ranking, and leveling material links.",
    h1: "Akane NTE Guide: Build, Skills & Tier Ranking",
  },
  shinku: {
    title: "Shinku NTE Guide - Build, Element, Skills & Teams | Neverness to Everness",
    description: "Shinku NTE guide for Neverness to Everness: Anima attacker overview, best build, weapon and disk set picks, team comps, skill notes, tier ranking, and release status.",
    h1: "Shinku NTE Guide: Build, Element & Skills",
  },
  lingko: {
    title: "Lingko NTE Guide - Build, Skills, Tier & Teams | Neverness to Everness",
    description: "Lingko NTE character guide for Neverness to Everness: Incantation attacker build, weapon and disk set picks, teams, skills, tier ranking, and release status.",
    h1: "Lingko NTE Guide: Build, Skills & Tier Ranking",
  },
  illica: {
    title: "Illica NTE Guide - Build, Banner, Skills & Teams | Neverness to Everness",
    description: "Illica NTE guide for Neverness to Everness: S-rank limited support build, banner notes, healing and buff role, best teams, weapons, disk sets, and tier ranking.",
    h1: "Illica NTE Guide: Build, Banner & Teams",
  },
  renee: {
    title: "Renee NTE Guide - Build, Skills, Tier & Teams | Neverness to Everness",
    description: "Renee NTE character guide for Neverness to Everness: Psyche support build, best weapons, disk sets, team comps, skills, tier ranking, and release status.",
    h1: "Renee NTE Guide: Build, Skills & Tier Ranking",
  },
  nitsa: {
    title: "Nitsa NTE Guide - Build, Skills, Tier & Teams | Neverness to Everness",
    description: "Nitsa NTE character guide for Neverness to Everness: Psyche support overview, best build, weapons, disk sets, team comps, skills, tier ranking, and release status.",
    h1: "Nitsa NTE Guide: Build, Skills & Tier Ranking",
  },
};

export function generateStaticParams() {
  const characters = getAllCharacters();
  return characters.flatMap((c: { id: string }) => LOCALES.map((lang) => ({ lang, slug: c.id })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const character = getCharacter(slug);
  if (!character) return {};
  const name = charName(character, lang);
  const isZh = isZhLocale(lang);

  // Build title with tier rank and role for better CTR
  const tierStr = character.tierRank ? ` [${character.tierRank} Tier]` : "";
  const roleStr = character.roleEn ? ` ${character.roleEn}` : "";
  const attrLabel = getAttributeLabel(character.attribute, lang as Locale);
  const roleLabel = isZh ? localizedText(lang as Locale, character.role || "", character.roleEn || "") : character.roleEn;
  const bannerSeo =
    slug === "lacrimosa"
      ? {
          titleZh: `${name}攻略：配队/材料/专武与1.1卡池抽取建议 | NTE`,
          titleEn: "Lacrimosa Build, Team, Materials & 1.1 Banner Guide | NTE",
          descZh: `${lang === "tw" ? "異環" : "异环"}安魂曲攻略：1.1当前卡池时间、最佳配队、专武最后一朵玫瑰、材料、技能机制与是否值得抽。`,
          descEn: "NTE Lacrimosa guide for version 1.1: current banner dates, best build, teams, materials, The Last Rose Arc, kit notes, and pull advice.",
        }
      : slug === "chaos"
        ? {
            titleZh: `${name}预热攻略：技能/配队/CV与1.1下半卡池 | NTE`,
            titleEn: "Chaos Preview Guide — Kit, Teams, Voice Actor & 1.1 Banner | NTE",
            descZh: `${lang === "tw" ? "異環" : "异环"}卡厄斯预热攻略：1.1下半卡池时间、技能要点、相属性配队、CV与抽取规划。`,
            descEn: "NTE Chaos preview guide: version 1.1 Phase 2 banner dates, kit notes, Lakshana teams, voice actor queries, and pull planning.",
          }
        : null;
  const enSeo = !isZh ? EN_CHARACTER_SEO[slug] : undefined;
  const title = enSeo
    ? enSeo.title
    : bannerSeo
    ? (isZh ? localizedText(lang as Locale, bannerSeo.titleZh, bannerSeo.titleEn) : bannerSeo.titleEn)
    : isZh
    ? localizedText(lang as Locale, `${name}${character.tierRank ? ` (${character.tierRank}级)` : ""} - ${attrLabel}${roleLabel || ""}攻略：配装/技能/配队 | NTE`, "", `${name}${character.tierRank ? ` (${character.tierRank}級)` : ""} - ${attrLabel}${roleLabel || ""}攻略：配裝/技能/配隊 | NTE`)
    : `Best ${character.nameEn} Build${tierStr} — ${character.attribute.charAt(0).toUpperCase() + character.attribute.slice(1)} ${character.roleEn || "Character"} Guide`;
  const description = enSeo
    ? enSeo.description
    : bannerSeo
    ? (isZh ? localizedText(lang as Locale, bannerSeo.descZh, bannerSeo.descEn) : bannerSeo.descEn)
    : isZh
    ? `${lang === "tw" ? "異環(NTE)" : "异环(NTE)"} ${name} ${character.tierRank ? `強度評級${character.tierRank}，` : ""}${lang === "tw" ? "完整角色攻略：最佳配裝推薦、技能解析、配隊方案、升級材料一覽。" : "完整角色攻略：最佳配装推荐、技能解析、配队方案、升级材料一览。"}`
    : `${character.nameEn}${roleStr} build guide for NTE${tierStr}. Best weapons, disk sets, team comps, skill priority & leveling materials — updated for 2026.`;
  return {
    title,
    description,
    alternates: hreflangAlternates(`characters/${slug}`, lang),
    openGraph: {
      title,
      description,
      type: "article",
      images: character.image ? [`https://nteguide.com${character.image}`] : undefined,
    },
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const character = getCharacter(slug);
  if (!character) notFound();

  const cm = getCharacterMaterials(slug);
  const banner = bannerCta(slug, locale);
  const enSeo = locale === "en" ? EN_CHARACTER_SEO[slug] : undefined;

  const relatedChars = (character.relatedCharacters || [])
    .map(id => getCharacter(id))
    .filter(Boolean);

  return (
    <>
      <CharacterJsonLd character={character} locale={locale} />
      {character.faq && character.faq.length > 0 && (
        <FaqPageJsonLd faqs={character.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} status={character.status} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.characters"), href: `/${lang}/characters` },
          { label: charName(character, locale) },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Character Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage type="character" id={character.id} name={character.name} src={character.image} className="w-24 h-24 rounded-lg shrink-0" priority />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{locale === "en" ? (enSeo?.h1 || `${character.nameEn} NTE Build Guide & Tier Ranking`) : charName(character, locale)}</h1>
              <p className="text-gray-500">{locale === "en" ? character.name : character.nameEn}</p>
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
                  <span>{isZhLocale(locale) ? character.weapon : character.weaponEn}</span>
                )}
                {character.roleEn !== "TBD" && (
                  <span>{isZhLocale(locale) ? character.role : character.roleEn}</span>
                )}
                {character.faction && (
                  <span>{character.faction}</span>
                )}
              </div>
              {character.description && (
                <p className="mt-3 text-sm text-gray-400">{isZhLocale(locale) ? character.description : character.descriptionEn || character.description}</p>
              )}
            </div>
          </div>
        </div>

        <CharacterSummary
          name={character.name} nameTw={character.nameTw} nameEn={character.nameEn}
          role={character.role} roleEn={character.roleEn}
          attribute={character.attribute} rank={character.rank}
          weapon={character.weapon} weaponEn={character.weaponEn}
          faction={character.faction}
          description={character.description}
          descriptionEn={character.descriptionEn}
          cvZh={character.cvZh} cvJp={character.cvJp} cvJpEn={character.cvJpEn}
          locale={locale}
        />

        {/* Quick Answer — GEO optimized */}
        <QuickAnswerCard
          locale={locale}
          items={[
            {
              label: isZhLocale(locale) ? "角色定位：" : "Role:",
              value: isZhLocale(locale) ? `${charName(character, locale)} — ${character.rank}级${character.attribute}属性${isZhLocale(locale) ? character.role : character.roleEn}。` : `${character.nameEn} — ${character.rank}-rank ${character.attribute} ${character.roleEn}.`,
            },
            ...(character.tierRank ? [{
              label: isZhLocale(locale) ? "强度评级：" : "Tier Rank:",
              value: `${character.tierRank} — ${isZhLocale(locale) ? (character.tierReasonZh || character.tierReason || "") : (character.tierReason || "")}`,
            }] : []),
            ...(character.recommendedBuild?.bestWeapon ? [{
              label: isZhLocale(locale) ? "最佳武器：" : "Best Weapon:",
              value: isZhLocale(locale) ? character.recommendedBuild.bestWeapon : (character.recommendedBuild.bestWeaponEn || character.recommendedBuild.bestWeapon),
            }] : []),
            ...(character.recommendedBuild?.bestDiskSet ? [{
              label: isZhLocale(locale) ? "最佳弧盘：" : "Best Disk Set:",
              value: isZhLocale(locale) ? character.recommendedBuild.bestDiskSet : (character.recommendedBuild.bestDiskSetEn || character.recommendedBuild.bestDiskSet),
            }] : []),
          ]}
        />

        {banner && (
          <section className="mb-8 rounded-xl border border-sky-500/30 bg-sky-500/10 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-sky-300 mb-2">{banner.eyebrow}</p>
            <h2 className="text-xl font-bold mb-2">{banner.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{banner.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${lang}/banners`}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
              >
                {banner.primary}
              </Link>
              <Link
                href={slug === "chaos" ? `/${lang}/team-builder` : `/${lang}/guides/gacha-system`}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:border-sky-500/50 text-sm text-gray-300 hover:text-sky-200 transition-colors"
              >
                {banner.secondary}
              </Link>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {character.skills && (
          <SkillDetail skills={character.skills} locale={locale} />
        )}

        {/* Recommended Build */}
        {character.recommendedBuild && (
          <BuildRecommendation build={character.recommendedBuild} locale={locale} />
        )}

        {/* Rotation Guide */}
        {character.rotation && (
          <RotationGuide
            steps={character.rotation.steps}
            tips={character.rotation.tips}
            tipsEn={character.rotation.tipsEn}
            locale={locale}
            lang={lang}
          />
        )}

        {/* Team Compositions */}
        {character.teamComps && character.teamComps.length > 0 && (
          <TeamCompCard teams={character.teamComps} locale={locale} />
        )}

        {/* Kardz Promo */}
        <div className="mb-8">
          <KardzPromoCard locale={locale} variant="compact" />
        </div>

        {/* Materials placeholder for upcoming characters */}
        {character.status !== "available" && (
          <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">{t(locale, "characters.levelingMaterials")}</h2>
            <p className="text-sm text-gray-500">{t(locale, "characters.materialsUpcoming")}</p>
          </section>
        )}

        {/* Leveling Materials - only for available characters */}
        {cm && character.status === "available" && (
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
                      {isZhLocale(lang) ? `等级 ${lr.levelRange}` : `Level ${lr.levelRange}`}
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
                              {isZhLocale(lang) ? material.name : material.nameEn}
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

        {/* Skill Materials - only for available characters */}
        {cm && character.status === "available" && (
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
                        {isZhLocale(lang) ? material.name : material.nameEn}
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

        {/* Calculator CTA - only for available characters */}
        {character.status === "available" && (
        <div className="text-center py-8">
          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
          >
            {t(locale, "characters.calculatorCta")}
          </Link>
        </div>
        )}

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
                    <p className="text-sm font-medium truncate">{charName(c!, locale)}</p>
                    <p className="text-xs text-gray-500">{locale === "en" ? c!.name : c!.nameEn}</p>
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

        {/* Player Discussion */}
        <GiscusComments locale={locale} term={`character-${slug}`} />
      </div>
    </>
  );
}
