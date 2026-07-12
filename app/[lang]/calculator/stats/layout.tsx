import { hreflangAlternates, t, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, t(locale, "statsCalc.seoTitle"), t(locale, "statsCalc.seoTitle"));
  const description = localizedText(
    locale,
    "计算异环角色伤害输出。根据不同武器、属性、技能倍率、暴击期望和增伤词条估算DPS，适合配装测试和Build对比。",
    "Calculate NTE character damage output with weapons, attributes, skill multipliers, crit expectations, and damage bonus stats for build testing and comparison."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/stats", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function StatsCalcLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "屬性計算器更適合哪些場景？" : "属性计算器更适合哪些场景？")
    : "When is the stats calculator most useful?";
  const introBody = isZh
    ? (locale === "tw"
        ? "異環屬性計算器更適合用來判斷配裝方向，而不是追求單次理論極限。當你在猶豫暴擊、攻擊、屬傷或武器替換哪個收益更高時，這類工具能先幫你把不同配置拉到同一個標準下看。"
        : "异环属性计算器更适合用来判断配装方向，而不是追求单次理论极限。当你在犹豫暴击、攻击、属性伤害或武器替换哪个收益更高时，这类工具能先帮你把不同配置拉到同一个标准下看。")
    : "The stats calculator is most useful for comparing build direction instead of chasing a single theoretical screenshot. When you are deciding between crit, attack, elemental damage, or a weapon swap, it helps normalize those choices into one view before you commit resources.";
  const notesTitle = isZh
    ? (locale === "tw" ? "用屬性頁時先注意" : "用属性页时先注意")
    : "Keep these in mind";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先選角色和武器，再調整副詞條，這樣結果才更接近你的實際帳號。"
          : "先选角色和武器，再调整副词条，这样结果才更接近你的实际账号。",
        locale === "tw"
          ? "估算值適合看趨勢，不適合拿來替代實戰手感、循環容錯和隊伍需求。"
          : "估算值适合看趋势，不适合拿来替代实战手感、循环容错和队伍需求。",
        locale === "tw"
          ? "如果你同時在比較完整出傷流程，接著用 DPS 計算器會更準。"
          : "如果你同时在比较完整出伤流程，接着用DPS计算器会更准。",
      ]
    : [
        "Choose the character and weapon first, then adjust substats, so the estimate stays closer to your real account.",
        "Use the result for direction and trend, not as a replacement for actual comfort, rotation tolerance, or team needs.",
        "If you also need full rotation output, move from here into the DPS calculator for a tighter comparison.",
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
