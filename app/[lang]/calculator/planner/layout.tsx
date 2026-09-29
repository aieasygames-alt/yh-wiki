import { hreflangAlternates, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环本地材料规划器｜固定清单估算", "NTE Local Material Planner | Fixed-Table Estimate");
  const description = localizedText(
    locale,
    "用站内固定材料表汇总多角色等级与技能需求；当前材料、等级上限、掉落与活动状态请以客户端为准。",
    "Aggregate multi-character level and skill needs from fixed site-held material tables; verify current materials, caps, drops, and event state in the client."
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
        ? "這個規劃器把多個角色的輸入套用到站內固定材料表，再顯示本地加總與自填持有量的差額。它不讀取遊戲背包，也不驗證目前版本材料、等級上限、掉落或活動；行動前請以客戶端為準。"
        : "这个规划器把多个角色的输入套用到站内固定材料表，再显示本地加总与自填持有量的差额。它不读取游戏背包，也不验证当前版本材料、等级上限、掉落或活动；行动前请以客户端为准。")
    : "This planner applies multiple character inputs to fixed site-held material tables and shows local totals against the inventory you enter. It does not read your game inventory or verify live materials, level caps, drops, or events; use the client before acting.";
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
          ? "先依目前副本目標和帳號缺口排列角色，再決定等級、突破與技能的投入順序。"
          : "先依当前副本目标和账号缺口排列角色，再决定等级、突破与技能的投入顺序。",
      ]
    : [
        "Start with the characters you are actually building soon instead of dumping every future target into one plan.",
        "Enter the materials you already own so the result becomes a real shortfall, not just a raw total.",
        "Order level, ascension, and skill spending from your current content goal and roster gap, not from an assumed patch priority.",
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
