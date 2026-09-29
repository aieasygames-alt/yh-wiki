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
import { completeMetaDescription, localizedText } from "../../../../lib/seo-copy";
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
      eyebrow: isZh ? "历史限定卡池" : "Historical Limited Banner",
      title: isZh ? "安魂曲UP（历史）：2026.06.03 - 2026.06.24" : "Lacrimosa Rate-Up (Historical): 2026-06-03 to 2026-06-24",
      description: isZh
        ? "这是1.1阶段的历史卡池记录，用于回顾角色定位与配队。当前是否可获取请以游戏内卡池倒计时和官方公告为准。"
        : "This is a Version 1.1 historical banner record for roster and team context. Verify the in-game countdown and official notices for current availability.",
      primary: isZh ? "核对当前卡池" : "Verify Current Banners",
      secondary: isZh ? "看抽卡机制" : "Open Gacha Guide",
    };
  }
  if (slug === "chaos") {
    return {
      eyebrow: isZh ? "历史限定卡池" : "Historical Limited Banner",
      title: isZh ? "卡厄斯历史排期：2026.06.24 - 2026.07.08" : "Chaos Historical Schedule: 2026-06-24 to 2026-07-08",
      description: isZh
        ? "这是1.1下半的历史排期，仅用于角色和版本回顾。不要用它规划当前抽数；请先核对游戏内卡池倒计时。"
        : "This is a Version 1.1 Phase 2 historical schedule for roster context. Do not use it for current pull planning; verify the in-game banner countdown first.",
      primary: isZh ? "核对当前卡池" : "Verify Current Banners",
      secondary: isZh ? "打开配队工具" : "Open Team Builder",
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

const EN_CHARACTER_SEARCH_ALIASES: Record<string, string[]> = {
  "black-bird": ["blackbird nte", "nte blackbird", "black bird nte"],
  akane: ["nte akane", "akane nte", "akane neverness to everness"],
  nitsa: ["nitsa nte", "nte nitsa"],
  lingko: ["nte lingko", "lingko nte"],
  renee: ["renee nte", "nte renee"],
  nelly: ["nelly nte", "nte nelly"],
};

const ZH_CHARACTER_SEO: Record<string, { title: string; description: string; titleTw: string; descriptionTw: string }> = {
  canhong: {
    title: "残虹攻略：材料、技能、配队与上线前培养规划 | 异环 NTE",
    description: "异环残虹角色攻略，整理残虹材料、技能机制、属性定位、配队思路、上线前养成规划和抽取注意事项，适合提前准备资源。",
    titleTw: "殘虹攻略：材料、技能、配隊與上線前培養規劃 | 異環 NTE",
    descriptionTw: "異環殘虹角色攻略，整理殘虹材料、技能機制、屬性定位、配隊思路、上線前養成規劃和抽取注意事項，適合提前準備資源。",
  },
  zhenhong: {
    title: "真红攻略：材料、Build、配队与强度评级 | 异环 NTE",
    description: "异环真红角色攻略，包含真红材料、最佳 Build、武器弧盘、配队推荐、技能循环、强度评级和养成优先级。",
    titleTw: "真紅攻略：材料、Build、配隊與強度評級 | 異環 NTE",
    descriptionTw: "異環真紅角色攻略，包含真紅材料、最佳 Build、武器弧盤、配隊推薦、技能循環、強度評級和養成優先級。",
  },
  illica: {
    title: "伊洛伊攻略：材料、Build、配队与辅助强度 | 异环 NTE",
    description: "异环伊洛伊角色攻略，整理伊洛伊材料、辅助 Build、武器弧盘、治疗增益机制、最佳配队和抽取培养建议。",
    titleTw: "伊洛伊攻略：材料、Build、配隊與輔助強度 | 異環 NTE",
    descriptionTw: "異環伊洛伊角色攻略，整理伊洛伊材料、輔助 Build、武器弧盤、治療增益機制、最佳配隊和抽取培養建議。",
  },
};

export function generateStaticParams() {
  const characters = getAllCharacters();
  const slugs = [...characters.map((c: { id: string }) => c.id), "zankou", "linko"];
  return slugs.flatMap((slug) => LOCALES.map((lang) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = await params;
  const isAliasPage = slug === "zankou" || slug === "linko";
  const canonicalSlug = slug === "zankou" || slug === "linko" ? "canhong" : slug;
  const character = getCharacter(canonicalSlug);
  if (!character) return {};
  const name = slug === "zankou" ? (lang === "en" ? "Zankou" : lang === "tw" ? "赞空" : "赞空") : slug === "linko" ? (lang === "en" ? "Linko" : lang === "tw" ? "链子" : "链子") : charName(character, lang);
  const isZh = isZhLocale(lang);

  const tierStr = character.tierRank ? ` [Historical ${character.tierRank} Tier]` : "";
  const roleStr = character.roleEn ? ` ${character.roleEn}` : "";
  const attrLabel = getAttributeLabel(character.attribute, lang as Locale);
  const roleLabel = isZh ? localizedText(lang as Locale, character.role || "", character.roleEn || "") : character.roleEn;
  const zhSeo = isZh ? ZH_CHARACTER_SEO[slug] : undefined;
  const bannerSeo =
    slug === "lacrimosa"
      ? {
          titleZh: `${name}攻略：配队、材料、专武与1.1历史卡池参考 | NTE`,
          titleEn: "Lacrimosa Build, Team, Materials & 1.1 Banner History | NTE",
          descZh: `${lang === "tw" ? "異環" : "异环"}安魂曲攻略：1.1历史卡池时间、最佳配队、专武最后一朵玫瑰、材料与技能机制。当前可获取状态以游戏内倒计时为准。`,
          descEn: "NTE Lacrimosa guide with Version 1.1 banner history, best build, teams, materials, The Last Rose Arc, and kit notes. Verify current availability in-game.",
        }
      : slug === "chaos"
        ? {
            titleZh: `${name}攻略：技能、配队、CV与1.1下半历史卡池 | NTE`,
            titleEn: "Chaos Guide — Kit, Teams, Voice Actor & 1.1 Banner History | NTE",
            descZh: `${lang === "tw" ? "異環" : "异环"}卡厄斯攻略：1.1下半历史卡池时间、技能要点、相属性配队与CV。当前卡池请以游戏内倒计时为准。`,
            descEn: "NTE Chaos guide with Version 1.1 Phase 2 banner history, kit notes, Lakshana teams, and voice actor details. Verify current banners in-game.",
          }
        : null;
  const enSeo = !isZh ? EN_CHARACTER_SEO[slug] : undefined;
  const title = enSeo
    ? enSeo.title
    : zhSeo
    ? (lang === "tw" ? zhSeo.titleTw : zhSeo.title)
    : bannerSeo
    ? (isZh ? localizedText(lang as Locale, bannerSeo.titleZh, bannerSeo.titleEn) : bannerSeo.titleEn)
    : isZh
    ? localizedText(lang as Locale, `${name}${character.tierRank ? ` (${character.tierRank}级)` : ""} - ${attrLabel}${roleLabel || ""}攻略：配装/技能/配队 | NTE`, "", `${name}${character.tierRank ? ` (${character.tierRank}級)` : ""} - ${attrLabel}${roleLabel || ""}攻略：配裝/技能/配隊 | NTE`)
    : `${character.nameEn} Historical Build Reference${tierStr} — ${character.attribute.charAt(0).toUpperCase() + character.attribute.slice(1)} ${character.roleEn || "Character"}`;
  const description = completeMetaDescription(lang as Locale, enSeo
    ? enSeo.description
    : zhSeo
    ? (lang === "tw" ? zhSeo.descriptionTw : zhSeo.description)
    : bannerSeo
    ? (isZh ? localizedText(lang as Locale, bannerSeo.descZh, bannerSeo.descEn) : bannerSeo.descEn)
    : isZh
    ? `${lang === "tw" ? "異環(NTE)" : "异环(NTE)"} ${name} ${character.tierRank ? `強度評級${character.tierRank}，` : ""}${lang === "tw" ? "完整角色攻略：最佳配裝推薦、技能解析、配隊方案、升級材料一覽。" : "完整角色攻略：最佳配装推荐、技能解析、配队方案、升级材料一览。"}`
    : `Historical NTE reference for ${character.nameEn}${roleStr}${tierStr}. Recorded weapons, disk sets, team examples, skill fields, and materials require current in-client verification.`);
  return {
    title,
    description,
    alternates: hreflangAlternates(`characters/${slug}`, lang),
    ...(isAliasPage
      ? {
          robots: { index: false, follow: true },
          alternates: {
            canonical: `https://nteguide.com/${lang}/characters/${canonicalSlug}/`,
          },
        }
      : {}),
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
  const canonicalSlug = slug === "zankou" || slug === "linko" ? "canhong" : slug;
  const character = getCharacter(canonicalSlug);
  if (!character) notFound();
  const displayName = slug === "zankou" ? (locale === "en" ? "Zankou" : "赞空") : slug === "linko" ? (locale === "en" ? "Linko" : "链子") : charName(character, locale);

  const cm = getCharacterMaterials(canonicalSlug);
  const banner = bannerCta(slug, locale);
  const enSeo = locale === "en" ? EN_CHARACTER_SEO[slug] : undefined;
  const searchAliases = locale === "en" ? EN_CHARACTER_SEARCH_ALIASES[slug] : undefined;

  const relatedChars = (character.relatedCharacters || [])
    .map(id => getCharacter(id))
    .filter(Boolean);

  return (
    <>
      <CharacterJsonLd character={{ ...character, name: displayName, nameEn: slug === "zankou" ? "Zankou" : slug === "linko" ? "Linko" : character.nameEn }} locale={locale} />
      {character.faq && character.faq.length > 0 && (
        <FaqPageJsonLd faqs={character.faq} lang={locale} />
      )}
      <DataStatusBanner locale={locale} status={slug === "zankou" || slug === "linko" ? "available" : character.status} />
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "site.nav.characters"), href: `/${lang}/characters` },
          { label: displayName },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Character Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
          <div className="flex gap-6">
            <GameImage type="character" id={character.id} name={displayName} src={character.image} className="w-24 h-24 rounded-lg shrink-0" priority />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{locale === "en" ? (enSeo?.h1 || `${displayName} NTE Historical Character Reference`) : displayName}</h1>
              <p className="text-gray-500">{locale === "en" ? (slug === "zankou" ? "赞空" : slug === "linko" ? "链子" : character.name) : (slug === "zankou" ? "Zankou" : slug === "linko" ? "Linko" : character.nameEn)}</p>
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
                <p className="mt-3 text-sm text-gray-400">{slug === "zankou" || slug === "linko"
                  ? (isZhLocale(locale) ? `${displayName} 的历史页面记录了基础定位；当前是否上线、技能与材料细节必须以目标区服客户端和官方公告核对。` : `${displayName}'s historical page records baseline role fields; verify current availability, kit details, and materials in the target server's client and official notices.`)
                  : (isZhLocale(locale) ? character.description : character.descriptionEn || character.description)}</p>
              )}
              {searchAliases && searchAliases.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Also searched as: {searchAliases.join(", ")}.
                </p>
              )}
            </div>
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
          {localizedText(
            locale,
            "历史角色资料复核：2026-09-29。本页的角色状态、技能、数值、材料、强度、构筑、循环、队伍和卡池信息均不验证当前版本。抽取、升级、刷取或消费前，请以目标区服客户端和官方公告逐项核对。",
            "Historical character reference reviewed September 29, 2026. This page does not verify current availability, skills, values, materials, tier, build, rotation, team, or banner information. Before pulling, upgrading, farming, or spending, confirm each item in the target server's client and official notices.",
            "歷史角色資料復核：2026-09-29。本頁的角色狀態、技能、數值、材料、強度、構築、循環、隊伍和卡池資訊均不驗證目前版本。抽取、升級、刷取或消費前，請以目標區服客戶端和官方公告逐項核對。"
          )}
        </section>

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
              label: isZhLocale(locale) ? "历史定位字段：" : "Historical role field:",
              value: isZhLocale(locale) ? `${charName(character, locale)} — 记录为 ${character.rank}级${character.attribute}属性${isZhLocale(locale) ? character.role : character.roleEn}；当前角色状态和定位请在客户端核对。` : `${character.nameEn} — recorded as ${character.rank}-rank ${character.attribute} ${character.roleEn}; verify current availability and role in the client.`,
            },
            ...(character.tierRank ? [{
              label: isZhLocale(locale) ? "历史评级字段：" : "Historical tier field:",
              value: isZhLocale(locale)
                ? `${character.tierRank} — ${character.tierReasonZh || character.tierReason || ""}；不代表当前抽取或养成结论。`
                : `${character.tierRank} — ${character.tierReason || ""}; not a current pull or investment verdict.`,
            }] : []),
            ...(character.recommendedBuild?.bestWeapon ? [{
              label: isZhLocale(locale) ? "历史武器关联：" : "Historical weapon association:",
              value: `${isZhLocale(locale) ? character.recommendedBuild.bestWeapon : (character.recommendedBuild.bestWeaponEn || character.recommendedBuild.bestWeapon)}${isZhLocale(locale) ? "；当前适配和可用性请在客户端核对。" : "; verify current fit and availability in the client."}`,
            }] : []),
            ...(character.recommendedBuild?.bestDiskSet ? [{
              label: isZhLocale(locale) ? "历史卡带关联：" : "Historical cassette association:",
              value: `${isZhLocale(locale) ? character.recommendedBuild.bestDiskSet : (character.recommendedBuild.bestDiskSetEn || character.recommendedBuild.bestDiskSet)}${isZhLocale(locale) ? "；当前效果和触发条件请在客户端核对。" : "; verify current effects and triggers in the client."}`,
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

        <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZhLocale(locale)
              ? (locale === "tw" ? `${charName(character, locale)}相關工具` : `${charName(character, locale)}相关工具`)
              : `${character.nameEn} Planning Links`}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                href: `/${lang}/calculator/leveling`,
                label: isZhLocale(locale) ? (locale === "tw" ? "材料計算器" : "材料计算器") : "Material Calculator",
                desc: isZhLocale(locale) ? (locale === "tw" ? "估算升級與突破材料" : "估算升级与突破材料") : "Estimate upgrade costs",
              },
              {
                href: `/${lang}/teams`,
                label: isZhLocale(locale) ? "历史配队资料" : "Historical Team References",
                desc: isZhLocale(locale) ? (locale === "tw" ? "核對目前角色與觸發條件" : "核对当前角色与触发条件") : "Verify current units and triggers",
              },
              {
                href: `/${lang}/tier-list`,
                label: isZhLocale(locale) ? (locale === "tw" ? "歷史場景對比" : "历史场景对比") : "Historical Scene Comparison",
                desc: isZhLocale(locale) ? (locale === "tw" ? "不代表目前評級或投入建議" : "不代表当前评级或投入建议") : "Not a current rating or investment verdict",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-gray-800 bg-gray-950/40 p-4 hover:border-primary-500/40 transition-colors"
              >
                <p className="text-sm font-medium text-primary-300">{item.label}</p>
                <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Kardz Promo */}
        <div className="mb-8">
          <KardzPromoCard locale={locale} variant="compact" />
        </div>

        {/* Materials placeholder for upcoming characters */}
        {character.status !== "available" && slug !== "zankou" && slug !== "linko" && (
          <section className="mb-8 rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
            <h2 className="text-xl font-bold mb-2">{t(locale, "characters.levelingMaterials")}</h2>
            <p className="text-sm text-gray-500">{t(locale, "characters.materialsUpcoming")}</p>
          </section>
        )}

        {/* Leveling Materials - only for available characters */}
        {cm && (character.status === "available" || slug === "zankou" || slug === "linko") && (
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
        {cm && (character.status === "available" || slug === "zankou" || slug === "linko") && (
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
