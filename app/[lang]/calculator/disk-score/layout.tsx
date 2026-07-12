import { hreflangAlternates, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环盘条评分计算器 — 副词条效率评级", "NTE Disk Score Calculator — Substat Roll Efficiency Rating");
  const description = localizedText(
    locale,
    "异环盘条（驱动盘）副词条评分工具：输入副词条数值，计算词条效率评分，支持DPS、辅助、均衡权重预设和配装筛选。",
    "NTE disk substat score calculator: input substats to calculate roll efficiency with DPS, Support, and Balanced weight presets for build comparison."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/disk-score", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function DiskScoreLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "盤條評分器主要適合什麼用法？" : "盘条评分器主要适合什么用法？")
    : "What is the disk score tool actually useful for?";
  const introBody = isZh
    ? (locale === "tw"
        ? "異環盤條評分器的核心用途，是把副詞條數值快速換成更容易比較的效率分數。它特別適合處理「這件能不能留」「這件是不是比現在的更好」這類配裝決策，而不是只看單一暴擊詞條就下判斷。"
        : "异环盘条评分器的核心用途，是把副词条数值快速换成更容易比较的效率分数。它特别适合处理“这件能不能留”“这件是不是比现在的更好”这类配装决策，而不是只看单一暴击词条就下判断。")
    : "The disk score calculator is best for turning raw substat values into an efficiency score you can compare quickly. It is most useful when you are deciding whether a piece is worth keeping or whether it really upgrades a current build, instead of overreacting to a single crit line.";
  const notesTitle = isZh
    ? (locale === "tw" ? "評分前建議先確認" : "评分前建议先确认")
    : "Before you score a piece";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先依角色定位選權重，主 C、輔助和均衡配置看的重點本來就不同。"
          : "先按角色定位选权重，主C、辅助和均衡配置看的重点本来就不同。",
        locale === "tw"
          ? "高分不一定等於必留，還要一起看主詞條、套裝需求和目前帳號缺口。"
          : "高分不一定等于必留，还要一起看主词条、套装需求和当前账号缺口。",
        locale === "tw"
          ? "如果你在比兩件接近的裝備，最好搭配屬性或 DPS 計算器一起看實際收益。"
          : "如果你在比两件接近的装备，最好搭配属性或DPS计算器一起看实际收益。",
      ]
    : [
        "Pick weights based on the role first, because a carry, support, and balanced setup should not judge substats the same way.",
        "A high score is not an automatic keep. You still need to check main stat, set requirement, and your current account gap.",
        "When two pieces are close, pair the result with the stats or DPS calculator to see the real in-build gain.",
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
