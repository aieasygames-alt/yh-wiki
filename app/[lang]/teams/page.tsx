import Link from "next/link";
import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { getGuide, getCharacter, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd, ItemListJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";
import { ArticleContent } from "../../../components/ArticleContent";
import { TierBadge } from "../../../components/TierBadge";
import { GameImage } from "../../../components/GameImage";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

function charName(c: { name: string; nameTw?: string; nameEn: string }, locale: string): string {
  if (locale === "en") return c.nameEn;
  if (locale === "tw") return c.nameTw || c.name;
  return c.name;
}

// Tier-based gradient styles for character cards
const TIER_CARD_STYLES: Record<string, string> = {
  SS: "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 via-gray-900/40 to-gray-900/30 shadow-lg shadow-yellow-500/5",
  "S+": "border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-gray-900/40 to-gray-900/30 shadow-lg shadow-purple-500/5",
  S: "border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-gray-900/40 to-gray-900/30 shadow-lg shadow-blue-500/5",
  "A+": "border-green-500/30 bg-gradient-to-br from-green-500/5 via-gray-900/40 to-gray-900/30",
  A: "border-gray-700/50 bg-gradient-to-br from-gray-800/30 via-gray-900/40 to-gray-900/30",
  "B+": "border-gray-700/30 bg-gray-900/30",
  B: "border-gray-800/30 bg-gray-900/30",
};

function getTierCardStyle(tier?: string): string {
  if (!tier) return TIER_CARD_STYLES.B;
  for (const key of [tier, tier.replace("+", "")]) {
    if (TIER_CARD_STYLES[key]) return TIER_CARD_STYLES[key];
  }
  return TIER_CARD_STYLES.B;
}

// Team comp type badge colors
const COMP_TYPE_COLORS: Record<string, string> = {
  meta: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  recommended: "bg-primary-500/20 text-primary-400 border-primary-500/30",
  f2p: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  alternative: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const FEATURED_TEAMS = [
  {
    id: "lacrimosa-chaos-dot",
    rank: "SS",
    scenario: "Meta DPS",
    scenarioZh: "版本主C",
    name: "Lacrimosa Chaos DoT Core",
    nameZh: "安魂曲混沌持续输出队",
    members: ["lacrimosa", "daffodil", "baicang", "haniel"],
    note: "Best for players who pulled Lacrimosa and want a Chaos-focused carry team with defensive coverage and support buffs.",
    noteZh: "适合已抽安魂曲、想围绕混沌持续输出组队的玩家，兼顾防护、增益和持续伤害。",
  },
  {
    id: "chaos-lakshana-burst",
    rank: "S+",
    scenario: "Next Banner Prep",
    scenarioZh: "下期卡池预备",
    name: "Chaos Lakshana Burst Team",
    nameZh: "卡厄斯相属性爆发队",
    members: ["chaos", "hathor", "jiuyuan", "haniel"],
    note: "A pull-plan team for Chaos, pairing Lakshana support with grouping and team-wide buffs.",
    noteZh: "围绕卡厄斯的预备配队，用相属性支援、聚怪和全队增益提高爆发窗口质量。",
  },
  {
    id: "nanally-general-meta",
    rank: "SS",
    scenario: "General Meta",
    scenarioZh: "泛用强队",
    name: "Nanally General Carry",
    nameZh: "娜娜莉泛用主C队",
    members: ["nanally", "jiuyuan", "hotori", "zero-male"],
    note: "A stable all-purpose lineup with damage, grouping, buffs, and the protagonist's Ring Fusion utility.",
    noteZh: "兼具输出、聚怪、增益和主角环合功能，适合多数主线、日常和探索战斗。",
  },
  {
    id: "xiaozhi-f2p-core",
    rank: "S+",
    scenario: "F2P",
    scenarioZh: "零氪平民",
    name: "Xiaozhi F2P Core",
    nameZh: "小吱零氪核心队",
    members: ["xiaozhi", "sakiri", "mint", "zero-male"],
    note: "Best low-spend route: Xiaozhi carries while Sakiri, Mint, and Zero cover buffs, healing, and reactions.",
    noteZh: "低氪/零氪优先路线，小吱站场输出，咲里、薄荷、零补足增益、治疗与反应。",
  },
  {
    id: "xun-cosmos-blossom",
    rank: "S",
    scenario: "Control",
    scenarioZh: "控场清场",
    name: "Xun Cosmos Blossom",
    nameZh: "浔光耀坼绽队",
    members: ["xun", "zero-male", "mint", "nanally"],
    note: "Control-heavy team built around Xun utility, Zero damage, and repeated crowd-control windows.",
    noteZh: "围绕浔的治疗、控制和技能复刻展开，适合需要稳定控场和清杂的内容。",
  },
  {
    id: "illica-lakshana-safe",
    rank: "S",
    scenario: "Safe Clear",
    scenarioZh: "稳健通关",
    name: "Illica Lakshana Sustain",
    nameZh: "伊洛伊相属性稳健队",
    members: ["illica", "hathor", "jiuyuan", "adler"],
    note: "A safer Lakshana setup for players who value sustain, grouping, and defensive room over pure burst.",
    noteZh: "偏稳健的相属性组合，牺牲少量爆发换取聚怪、防护和容错。",
  },
  {
    id: "daffodil-boss-break",
    rank: "S",
    scenario: "Boss",
    scenarioZh: "Boss战",
    name: "Daffodil Boss Break",
    nameZh: "达芙迪尔Boss特化队",
    members: ["daffodil", "lacrimosa", "baicang", "hotori"],
    note: "Boss-focused composition for Chaos damage windows, defensive utility, and burst setup.",
    noteZh: "面向Boss战的混沌窗口队，兼顾爆发准备、防护和持续压制。",
  },
  {
    id: "hotori-exploration-speed",
    rank: "S",
    scenario: "Exploration",
    scenarioZh: "探索跑图",
    name: "Hotori Exploration Utility",
    nameZh: "穗鸟探索功能队",
    members: ["hotori", "jiuyuan", "zero-male", "mint"],
    note: "Exploration-friendly team with utility, grouping, sustain, and easy reaction setup.",
    noteZh: "适合跑图、清杂和日常探索，功能覆盖广，操作负担低。",
  },
  {
    id: "haniel-hypercarry-shell",
    rank: "S",
    scenario: "Flexible",
    scenarioZh: "万能外挂",
    name: "Haniel Hypercarry Shell",
    nameZh: "哈尼尔主C外挂壳",
    members: ["haniel", "lacrimosa", "chaos", "jiuyuan"],
    note: "Flexible support shell: swap the carry slot between Lacrimosa, Chaos, Nanally, or Xiaozhi as your roster changes.",
    noteZh: "通用辅助壳，主C位可按BOX换成安魂曲、卡厄斯、娜娜莉或小吱。",
  },
  {
    id: "starter-selector-team",
    rank: "A+",
    scenario: "Beginner",
    scenarioZh: "新手开荒",
    name: "Beginner Selector Team",
    nameZh: "新手自选开荒队",
    members: ["jiuyuan", "mint", "zero-male", "adler"],
    note: "Beginner-friendly route that keeps healing, grouping, and defensive utility covered before limited banners.",
    noteZh: "适合限定角色不齐的新手，用治疗、聚怪和防护先把开荒体验稳定住。",
  },
];

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
    title,
    description,
    alternates: hreflangAlternates("teams", lang),
    openGraph: {
      title,
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
      return (tierOrder[a.tierRank ?? ""] ?? 99) - (tierOrder[b.tierRank ?? ""] ?? 99);
    });

  // Count totals for the hero stats
  const totalTeams = charactersWithTeams.reduce(
    (sum, c) => sum + (c.teamComps?.length ?? 0), 0
  );

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
      <ItemListJsonLd
        items={FEATURED_TEAMS.map((team) => ({
          name: zh ? team.nameZh : team.name,
          url: `https://nteguide.com/${lang}/teams#${team.id}`,
        }))}
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
        {/* Hero section */}
        <div className="relative mb-10 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-900/20 via-gray-900/30 to-purple-900/10 p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl">{summary}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-2xl font-bold text-primary-400">{charactersWithTeams.length}</span>
                <span className="text-sm text-gray-400">{zh ? "个角色" : "Characters"}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/30">
                <span className="text-2xl font-bold text-purple-400">{totalTeams}</span>
                <span className="text-sm text-gray-400">{zh ? "支队伍" : "Teams"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ranked teams by scenario */}
        <section className="mb-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                {zh ? "按场景排名的最佳队伍" : "Best Teams Ranked by Scenario"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {zh
                  ? "优先覆盖版本主C、零氪开荒、Boss战、探索清场和通用辅助壳。"
                  : "Covers meta carries, F2P progression, boss fights, exploration, and flexible support shells."}
              </p>
            </div>
            <Link
              href={`/${lang}/team-builder`}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              {zh ? "打开配队模拟器" : "Open Team Builder"}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {FEATURED_TEAMS.map((team, index) => {
              const members = team.members
                .map((id) => getCharacter(id))
                .filter(Boolean);

              return (
                <article
                  id={team.id}
                  key={team.id}
                  className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 hover:border-primary-500/30 transition-colors scroll-mt-20"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-500">
                          #{index + 1}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300">
                          {zh ? team.scenarioZh : team.scenario}
                        </span>
                        <TierBadge rank={team.rank} locale={locale} />
                      </div>
                      <h3 className="text-lg font-bold">
                        {zh ? team.nameZh : team.name}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {members.map((member) => (
                      <Link
                        key={member!.id}
                        href={`/${lang}/characters/${member!.id}`}
                        className="rounded-lg border border-gray-800 bg-gray-950/40 p-2 hover:border-primary-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {member!.image && (
                            <GameImage
                              type="character"
                              id={member!.id}
                              name={charName(member!, locale)}
                              src={member!.image}
                              alt={charName(member!, locale)}
                              width={30}
                              height={30}
                              className="rounded-md shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">
                              {charName(member!, locale)}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {getAttributeLabel(member!.attribute, locale)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {zh ? team.noteZh : team.note}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mb-5">
          <h2 className="text-2xl font-bold">
            {zh ? "按角色查看配队" : "Teams by Character"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {zh
              ? "继续向下可查看每个角色的最佳、推荐和平民替代队伍。"
              : "Scroll on for each character's best, alternative, and F2P team options."}
          </p>
        </div>

        {/* Team Comps by Character */}
        <div className="space-y-6">
          {charactersWithTeams.map((char) => (
            <div
              key={char.id}
              className={`rounded-xl border p-5 transition-all hover:border-primary-500/30 ${getTierCardStyle(char.tierRank)}`}
            >
              {/* Character Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  {char.image && (
                    <GameImage
                      type="character"
                      id={char.id}
                      name={charName(char, locale)}
                      src={char.image}
                      alt={charName(char, locale)}
                      width={56}
                      height={56}
                      className="rounded-xl"
                    />
                  )}
                  {/* Attribute color ring */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-900 ${getAttributeColor(char.attribute).split(" ")[0]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/${lang}/characters/${char.id}`}
                      className="font-bold text-lg hover:text-primary-400 transition-colors"
                    >
                      {charName(char, locale)}
                    </Link>
                    {char.tierRank && <TierBadge rank={char.tierRank} locale={locale} />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getAttributeColor(char.attribute)}`}>
                      {getAttributeLabel(char.attribute, locale)}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                      {char.rank}
                    </span>
                    <span className="text-xs text-gray-500">
                      {zh ? char.role : char.roleEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Comps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {char.teamComps!.map((comp, idx) => {
                  const members = comp.members
                    .map((id) => getCharacter(id))
                    .filter(Boolean);

                  // Determine comp type for badge
                  const compType = idx === 0 ? "meta" : idx === 1 ? "recommended" : idx === 2 ? "f2p" : "alternative";
                  const compBadgeColor = COMP_TYPE_COLORS[compType] || COMP_TYPE_COLORS.alternative;
                  const compLabel = idx === 0
                    ? (zh ? "最佳" : "Best")
                    : idx === 1
                    ? (zh ? "推荐" : "Alt")
                    : idx === 2
                    ? (zh ? "平民" : "F2P")
                    : (zh ? `方案${idx + 1}` : `Option ${idx + 1}`);

                  return (
                    <div
                      key={idx}
                      className="rounded-lg bg-gray-800/30 border border-gray-700/30 p-3 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${compBadgeColor}`}>
                          {compLabel}
                        </span>
                        <span className="text-xs font-medium text-gray-300">
                          {zh ? comp.name : comp.nameEn}
                        </span>
                      </div>

                      {/* Member avatars */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {members.map((m) => (
                          <Link
                            key={m!.id}
                            href={`/${lang}/characters/${m!.id}`}
                            className="flex items-center gap-1.5 rounded-lg bg-gray-900/60 border border-gray-700/20 px-2.5 py-1.5 hover:border-primary-500/40 hover:bg-gray-800/60 transition-all"
                          >
                            {m!.image && (
                              <GameImage
                                type="character"
                                id={m!.id}
                                name={charName(m!, locale)}
                                src={m!.image}
                                alt={charName(m!, locale)}
                                width={28}
                                height={28}
                                className="rounded-md"
                              />
                            )}
                            <span className="text-xs font-medium">
                              {charName(m!, locale)}
                            </span>
                            <span className={`text-[10px] px-1 py-0.5 rounded ${getAttributeColor(m!.attribute).split(" ")[0]} ${getAttributeColor(m!.attribute).split(" ")[1]}`}>
                              {getAttributeLabel(m!.attribute, locale)}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 leading-relaxed">
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
                lang={lang}
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
