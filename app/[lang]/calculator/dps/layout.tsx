import { hreflangAlternates, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环DPS计算器 — 完整循环伤害模拟", "NTE DPS Calculator — Full Rotation Damage Simulation");
  const description = localizedText(
    locale,
    "异环DPS计算器：完整技能循环伤害计算，包含角色、武器、Build预设、敌人防御设置、暴击期望和伤害倍率可视化。",
    "NTE DPS calculator for full rotation damage simulation with character and weapon selection, build presets, enemy defense settings, crit expectations, and multiplier visualization."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/dps", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function DPSLayout({
  params,
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  const locale = params.lang as Locale;
  const isZh = isZhLocale(locale);
  const introTitle = isZh
    ? (locale === "tw" ? "DPS 計算器比較適合什麼時候用？" : "DPS 计算器比较适合什么时候用？")
    : "What should you use the DPS calculator for?";
  const introBody = isZh
    ? (locale === "tw"
        ? "如果你已經不只是想看面板，而是要比較完整技能循環、暴擊期望和敵方設定對輸出的影響，DPS 計算器會比單純屬性頁更有參考價值。它適合用在角色 Build 微調、武器替換，以及抽卡前後的實戰收益預估。"
        : "如果你已经不只是想看面板，而是要比较完整技能循环、暴击期望和敌方设置对输出的影响，DPS计算器会比单纯属性页更有参考价值。它适合用在角色Build微调、武器替换，以及抽卡前后的实战收益预估。")
    : "If you are past simple stat comparison and need to compare full rotation damage, crit expectation, and enemy settings, the DPS calculator is more useful than a basic stats page. It fits build tuning, weapon swaps, and estimating real output before or after a banner decision.";
  const notesTitle = isZh
    ? (locale === "tw" ? "看 DPS 結果時別漏掉" : "看DPS结果时别漏掉")
    : "Do not skip these checks";
  const notes = isZh
    ? [
        locale === "tw"
          ? "先確認敵人、防禦和增傷設定，不然不同測試之間很容易失去可比性。"
          : "先确认敌人、防御和增伤设置，不然不同测试之间很容易失去可比性。",
        locale === "tw"
          ? "循環模擬很吃前提，角色實戰手感、充能壓力和軸長也要一起考慮。"
          : "循环模拟很吃前提，角色实战手感、充能压力和轴长也要一起考虑。",
        locale === "tw"
          ? "如果只是看單件裝備值不值得換，先用盤條評分器或屬性計算器通常更快。"
          : "如果只是看单件装备值不值得换，先用盘条评分器或属性计算器通常更快。",
      ]
    : [
        "Lock enemy, defense, and bonus-damage assumptions first, or your comparisons will drift between tests.",
        "Rotation output depends heavily on assumptions, so comfort, energy pressure, and real timeline length still matter.",
        "If you only need to judge one gear piece, the disk score or stats calculator is usually the faster first stop.",
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
