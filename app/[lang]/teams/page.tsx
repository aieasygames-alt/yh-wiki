import Link from "next/link";
import { t, isZhLocale, Locale, LOCALES, hreflangAlternates } from "../../../lib/i18n";
import { getGuide, getCharacter, getAvailableCharacters } from "../../../lib/queries";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { ArticleJsonLd, FaqPageJsonLd, ItemListJsonLd } from "../../../components/JsonLd";
import { DataStatusBanner } from "../../../components/DataStatusBanner";
import { FaqSection } from "../../../components/FaqSection";
import { ArticleContent } from "../../../components/ArticleContent";
import { GameImage } from "../../../components/GameImage";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import { localizedText } from "../../../lib/seo-copy";

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

// Team comp type badge colors for historical examples and replacement paths.
const COMP_TYPE_COLORS: Record<string, string> = {
  meta: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  recommended: "bg-primary-500/20 text-primary-400 border-primary-500/30",
  f2p: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  alternative: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const FEATURED_TEAMS = [
  {
    id: "lacrimosa-chaos-dot",
    scenario: "Chaos DoT Example",
    scenarioZh: "混沌持续输出示例",
    name: "Lacrimosa Chaos DoT Core",
    nameZh: "安魂曲混沌持续输出队",
    members: ["lacrimosa", "daffodil", "baicang", "haniel"],
    note: "Historical example built around a Chaos-focused carry, defensive coverage, and support buffs. Verify current roles and available replacements in-game.",
    noteZh: "历史示例：围绕混沌持续输出、保护和增益搭建。请在游戏内核对当前角色功能和可替代位置。",
  },
  {
    id: "chaos-lakshana-burst",
    scenario: "Burst Setup Example",
    scenarioZh: "爆发准备示例",
    name: "Chaos Lakshana Burst Team",
    nameZh: "卡厄斯相属性爆发队",
    members: ["chaos", "hathor", "jiuyuan", "haniel"],
    note: "Historical burst setup using support, grouping, and team-wide buffs. Do not treat it as a future-banner or pull-plan recommendation.",
    noteZh: "历史爆发思路：用支援、聚怪和全队增益提高窗口质量；不要将它视为未来卡池或抽取建议。",
  },
  {
    id: "nanally-general-meta",
    scenario: "General Utility Example",
    scenarioZh: "泛用功能示例",
    name: "Nanally General Carry",
    nameZh: "娜娜莉泛用主C队",
    members: ["nanally", "jiuyuan", "hotori", "zero-male"],
    note: "A stable all-purpose lineup with damage, grouping, buffs, and the protagonist's Ring Fusion utility.",
    noteZh: "兼具输出、聚怪、增益和主角环合功能，适合多数主线、日常和探索战斗。",
  },
  {
    id: "xiaozhi-f2p-core",
    scenario: "Lower-Investment Example",
    scenarioZh: "低投入示例",
    name: "Xiaozhi F2P Core",
    nameZh: "小吱零氪核心队",
    members: ["xiaozhi", "sakiri", "mint", "zero-male"],
    note: "Historical lower-investment example with a carry, buffs, healing, and reactions. Use comparable roles from your roster if these members are unavailable.",
    noteZh: "历史低投入示例：主输出配合增益、治疗与反应；成员不可用时，优先用账号中同功能角色替换。",
  },
  {
    id: "xun-cosmos-blossom",
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
    scenario: "Starter Roles Example",
    scenarioZh: "新手功能位示例",
    name: "Beginner Selector Team",
    nameZh: "新手自选开荒队",
    members: ["jiuyuan", "mint", "zero-male", "adler"],
    note: "Historical starter template covering healing, grouping, and defensive utility. Confirm current starter rewards and availability before planning around it.",
    noteZh: "历史新手模板：覆盖治疗、聚怪和防护。请先核对当前新手奖励与可获取状态，再据此规划。",
  },
];

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(
    locale,
    "异环队伍功能模板｜历史阵容与替代思路",
    "NTE Team Role Templates | Historical Comps & Replacement Logic"
  );
  const description = t(locale, "teamPage.description");
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
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  // Count totals for the hero stats
  const totalTeams = charactersWithTeams.reduce(
    (sum, c) => sum + (c.teamComps?.length ?? 0), 0
  );

  const title = t(locale, "teamPage.title");
  const summary = zh
    ? "异环角色的历史队伍功能模板与替代思路；角色、技能和可获取状态请以目标区服客户端为准。"
    : "Historical NTE team-role templates and replacement logic. Verify character roles, skills, and availability in the target server's client.";

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
          { label: zh ? "队伍功能模板" : "Team Role Templates" },
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

        <section className="mb-10 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {zh ? "这页阵容模板最适合怎么用？" : "How should you use these team templates?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {zh
              ? "先按副本目标和账号缺口判断你需要输出、聚怪、治疗、防护还是反应支援；再把下方旧阵容当作功能组合样例，优先用已有角色做同功能替换。"
              : "Start from your content goal and roster gap: damage, grouping, sustain, defense, or reaction support. Then use the older lineups below as functional examples and replace missing members with comparable roles you already own."}
          </p>
        </section>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {zh ? "配队前先判断什么" : "What should you judge before building a team?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{zh ? "先看副本目标，是打 Boss、清杂、探索还是 999 Nights，不同场景对站场时间和生存位需求完全不同。" : "Start from the content target: bosses, mob clears, exploration, or 999 Nights all value different uptime and sustain patterns."}</li>
              <li>{zh ? "确定你要围绕谁当主C，再补齐增益、破韧、聚怪或治疗，而不是先把三个高强度角色硬塞进同一队。" : "Decide your main carry first, then fill buffs, break, grouping, or sustain instead of forcing three strong units into the same shell."}</li>
              <li>{zh ? "如果资源有限，先做一支稳定通关队，再考虑第二支功能特化队。" : "If resources are tight, finish one reliable all-purpose team before building niche specialists."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {zh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{zh ? "只看强度榜名次，不看角色之间有没有真正的循环和触发关系。" : "Copying tier-list names without checking whether the rotation and trigger logic actually works together."}</li>
              <li>{zh ? "过度追求纯色队，结果牺牲了治疗、功能位或更顺手的轮转。" : "Overcommitting to mono-element teams and losing sustain, utility, or smoother rotations."}</li>
              <li>{zh ? "把高配毕业阵容直接照搬到开荒期，导致资源分散、谁都没成型。" : "Copying late-game optimized teams too early and spreading resources too thin."}</li>
            </ul>
          </div>
        </section>

        {/* Historical examples by team function */}
        <section className="mb-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                {zh ? "按功能查看历史阵容示例" : "Historical Team Examples by Function"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {zh
                  ? "这些旧阵容用于理解持续输出、爆发、治疗、防护、聚怪与探索功能的组合方式，不代表实时排名或抽取优先级。"
                  : "These older lineups illustrate combinations of sustained damage, burst, sustain, defense, grouping, and exploration utility. They are not live rankings or pull priorities."}
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
                        <span className="text-xs font-mono text-gray-500">#{index + 1}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300">
                          {zh ? team.scenarioZh : team.scenario}
                        </span>
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
              ? "继续向下可查看每个角色的历史组合与替代方向；先验证当前角色状态，再按功能补位。"
              : "Scroll for each character's historical combinations and replacement directions. Verify current character status first, then fill roles by function."}
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

                  // Label old combinations by their replacement role, not a live ranking.
                  const compType = idx === 0 ? "meta" : idx === 1 ? "recommended" : idx === 2 ? "f2p" : "alternative";
                  const compBadgeColor = COMP_TYPE_COLORS[compType] || COMP_TYPE_COLORS.alternative;
                  const compLabel = idx === 0
                    ? (zh ? "历史示例" : "Historical Example")
                    : idx === 1
                    ? (zh ? "替代思路" : "Replacement Path")
                    : idx === 2
                    ? (zh ? "低投入参考" : "Lower-Investment")
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
