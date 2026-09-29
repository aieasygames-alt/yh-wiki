import { hreflangAlternates, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环盘条权重比较器｜本地副词条估算", "NTE Disk Weight Comparator | Local Substat Estimate");
  const description = localizedText(
    locale,
    "异环盘条本地权重比较工具：用预设权重估算副词条相对效率；不验证当前版本词条、上限或装备价值。",
    "Local NTE disk-weight comparison tool that estimates relative substat efficiency with presets; it does not verify live stats, caps, or gear value."
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
        ? "本工具用站内固定上限和预设权重，把副词条数值换成便于横向比较的本地分数。它不读取当前客户端装备数据，不能判断一件装备是否必留、必强化或适合具体角色。"
        : "本工具用站内固定上限和预设权重，把副词条数值换成便于横向比较的本地分数。它不读取当前客户端装备数据，不能判断一件装备是否必留、必强化或适合具体角色。")
    : "This tool uses fixed site-held caps and preset weights to turn substats into a comparable local score. It does not read live client gear data and cannot decide whether a piece must be kept, upgraded, or fits a specific character.";
  const notesTitle = isZh
    ? (locale === "tw" ? "評分前建議先確認" : "评分前建议先确认")
    : "Before you score a piece";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先依角色定位選權重，主 C、輔助和均衡配置看的重點本來就不同。"
          : "先按角色定位选权重，主C、辅助和均衡配置看的重点本来就不同。",
        locale === "tw"
          ? "預設權重和理論上限均可能隨版本變化；先在客戶端核對目前詞條與套裝效果。"
          : "预设权重和理论上限均可能随版本变化；先在客户端核对当前词条与套装效果。",
        locale === "tw"
          ? "如果你在比兩件接近的裝備，最好搭配屬性或 DPS 計算器一起看實際收益。"
          : "如果你在比两件接近的装备，最好搭配属性或DPS计算器一起看实际收益。",
      ]
    : [
        "Pick weights based on the role first, because a carry, support, and balanced setup should not judge substats the same way.",
        "Preset weights and theoretical caps can change by version; verify current substats and set effects in the client first.",
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
