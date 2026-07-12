import { hreflangAlternates, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环养成规划 — 角色升级材料计算器", "NTE Material Planner — Character Leveling Calculator");
  const description = localizedText(
    locale,
    "异环角色养成规划工具：添加多个角色和当前/目标等级，自动汇总升级材料、突破素材、技能消耗并追踪收集进度。",
    "NTE material planning tool: add multiple characters with current and target levels, aggregate upgrade materials, ascension items, skill costs, and track collection progress."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/planner", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function PlannerLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "材料規劃器適合拿來做什麼？" : "材料规划器适合拿来做什么？")
    : "What is the material planner best for?";
  const introBody = isZh
    ? (locale === "tw"
        ? "這個異環材料規劃器的核心價值，不只是把升級材料加總，而是幫你同時看多個角色的養成缺口、突破素材壓力，以及目前背包已持有數量離目標還差多少。對想規劃 1.2 版本主隊和後備角色的人來說，比手動抄表更省事。"
        : "这个异环材料规划器的核心价值，不只是把升级材料加总，而是帮你同时看多个角色的养成缺口、突破素材压力，以及当前背包已持有数量离目标还差多少。对想规划 1.2 版本主队和后备角色的人来说，比手动抄表更省事。")
    : "The material planner is useful for more than summing one character's upgrade costs. It helps you see multi-character progression gaps, ascension pressure, and how far your current inventory still is from a real target. If you are planning a main team plus backups for Version 1.2, it is much easier than tracking everything by hand.";
  const notesTitle = isZh
    ? (locale === "tw" ? "規劃時建議這樣用" : "规划时建议这样用")
    : "Use it this way";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先只放近期真的要養的角色，不要一開始就把所有想抽的角色都塞進去。"
          : "先只放近期真的要养的角色，不要一开始就把所有想抽的角色都塞进去。",
        locale === "tw"
          ? "把目前已持有材料補進去，結果才會從總需求變成真正的缺口。"
          : "把当前已持有材料填进去，结果才会从总需求变成真正的缺口。",
        locale === "tw"
          ? "如果你卡的是版本主 C，先確保等級、突破和核心技能，再考慮補次要角色。"
          : "如果你卡的是版本主 C，先确保等级、突破和核心技能，再考虑补次要角色。",
      ]
    : [
        "Start with the characters you are actually building soon instead of dumping every future target into one plan.",
        "Enter the materials you already own so the result becomes a real shortfall, not just a raw total.",
        "If your blocker is a patch carry, secure level, ascension, and core skills first before spreading resources to side units.",
      ];

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pt-6 pb-3 text-sm text-gray-300">
        <h2 className="text-xl font-semibold text-white">{introTitle}</h2>
        <p className="mt-3 leading-7">{introBody}</p>
      </section>
      {children}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">{notesTitle}</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
