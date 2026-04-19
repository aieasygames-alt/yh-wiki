import Link from "next/link";
import { t, hreflangAlternates } from "../../../lib/i18n";
import { getAllCharacters } from "../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import { Breadcrumb } from "../../../components/Breadcrumb";
import { GameImage } from "../../../components/GameImage";
import { TierBadge } from "../../../components/TierBadge";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  const title =
    locale === "zh"
      ? "异环角色强度排行 - 全角色 Tier List 排名"
      : "NTE Tier List - All Character Rankings";
  const description =
    locale === "zh"
      ? "异环(Neverness to Everness)全角色强度排行，按S级/A级分类，包含角色评级理由和推荐配装。"
      : "Complete Neverness to Everness tier list ranking all characters from best to worst, with tier reasons and recommended builds.";
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

const TIERS = [
  { key: "SS", labelZh: "SS 级（最强）", labelEn: "SS Tier (Best)" },
  { key: "S+", labelZh: "S+ 级（极强）", labelEn: "S+ Tier (Excellent)" },
  { key: "S", labelZh: "S 级（优秀）", labelEn: "S Tier (Great)" },
  { key: "A+", labelZh: "A+ 级（良好）", labelEn: "A+ Tier (Good)" },
  { key: "A", labelZh: "A 级（可用）", labelEn: "A Tier (Viable)" },
  { key: "B", labelZh: "B 级（一般）", labelEn: "B Tier (Average)" },
];

const TIER_COLORS: Record<string, string> = {
  SS: "border-yellow-500/50 bg-yellow-500/5",
  "S+": "border-red-500/50 bg-red-500/5",
  S: "border-orange-500/50 bg-orange-500/5",
  "A+": "border-purple-500/50 bg-purple-500/5",
  A: "border-blue-500/50 bg-blue-500/5",
  B: "border-gray-500/50 bg-gray-500/5",
};

const TIER_BADGE_COLORS: Record<string, string> = {
  SS: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "S+": "bg-red-500/20 text-red-400 border-red-500/30",
  S: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "A+": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  A: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  B: "bg-gray-700/30 text-gray-400 border-gray-600/30",
};

export default async function TierListPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as "zh" | "en";
  const characters = getAllCharacters();

  const tieredChars = TIERS.map((tier) => ({
    ...tier,
    characters: characters.filter(
      (c) => c.tierRank === tier.key
    ),
  }));

  const unrankedChars = characters.filter((c) => !c.tierRank);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          {
            label:
              locale === "zh" ? "角色强度排行" : "Tier List",
          },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">
          {locale === "zh"
            ? "异环角色强度排行 Tier List"
            : "Neverness to Everness Tier List"}
        </h1>
        <p className="text-gray-400 mb-8">
          {locale === "zh"
            ? `全 ${characters.length} 位角色按综合强度排名，基于技能倍率、队伍适配度和泛用性评估。`
            : `All ${characters.length} characters ranked by overall strength, based on skill multipliers, team synergy, and versatility.`}
        </p>

        {tieredChars.map((tier) => {
          if (tier.characters.length === 0) return null;
          return (
            <section key={tier.key} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-lg font-bold px-3 py-1 rounded border ${
                    TIER_BADGE_COLORS[tier.key] || ""
                  }`}
                >
                  {tier.key}
                </span>
                <span className="text-sm text-gray-500">
                  {locale === "zh" ? tier.labelZh : tier.labelEn}
                </span>
                <span className="text-xs text-gray-600">
                  ({tier.characters.length})
                </span>
              </div>
              <div
                className={`rounded-xl border p-4 ${
                  TIER_COLORS[tier.key] || ""
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tier.characters.map((c) => (
                    <Link
                      key={c.id}
                      href={`/${lang}/characters/${c.id}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 hover:border-primary-500/50 transition-colors"
                    >
                      <GameImage
                        type="character"
                        id={c.id}
                        name={c.name}
                        className="w-12 h-12 rounded-lg shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {locale === "zh" ? c.name : c.nameEn}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(
                              c.attribute
                            )}`}
                          >
                            {getAttributeLabel(c.attribute, locale)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {locale === "zh" ? c.role : c.roleEn}
                          </span>
                        </div>
                        {c.tierReason && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {locale === "zh"
                              ? c.tierReasonZh || c.tierReason
                              : c.tierReason}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {unrankedChars.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-500">
              {locale === "zh"
                ? `待评级 (${unrankedChars.length})`
                : `Unranked (${unrankedChars.length})`}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {unrankedChars.map((c) => (
                <Link
                  key={c.id}
                  href={`/${lang}/characters/${c.id}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3 hover:border-primary-500/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {locale === "zh" ? c.name : c.nameEn}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getAttributeLabel(c.attribute, locale)} · {c.rank}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-gray-600 mt-8">
          {locale === "zh"
            ? "评级基于游戏测试版本数据，正式上线后可能调整。评级综合考虑角色在主流队伍中的表现、技能倍率和泛用性。"
            : "Ratings are based on beta test data and may change after official launch. Tier rankings consider overall performance in meta teams, skill multipliers, and versatility."}
        </p>
      </div>
    </>
  );
}
