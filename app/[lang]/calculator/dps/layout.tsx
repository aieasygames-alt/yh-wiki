import { hreflangAlternates, Locale, isZhLocale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环DPS假设比较器｜本地公式估算", "NTE DPS Assumption Comparator | Local Formula Estimate");
  const description = localizedText(
    locale,
    "异环DPS本地公式估算工具：在自定义角色、武器、敌人和循环假设下比较结果；不验证当前版本实际伤害。",
    "Local-formula NTE DPS estimate for comparing custom character, weapon, enemy, and rotation assumptions; it does not verify live damage."
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
        ? "把角色、武器、敌人和循环前提固定后，这个工具可比较不同假设下的相对变化。它不能读取客户端数据、还原完整机制或预测抽卡收益，因此不要把结果当作实际伤害或消费依据。"
        : "把角色、武器、敌人和循环前提固定后，这个工具可比较不同假设下的相对变化。它不能读取客户端数据、还原完整机制或预测抽卡收益，因此不要把结果当作实际伤害或消费依据。")
    : "With character, weapon, enemy, and rotation assumptions fixed, this tool compares relative changes between local scenarios. It cannot read client data, reproduce every mechanic, or predict banner value, so do not treat its output as live damage or spending advice.";
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
          ? "本頁角色、武器與倍率資料也可能過時；每次比較前請先以目標區服客戶端核對。"
          : "本页角色、武器与倍率资料也可能过时；每次比较前请先以目标区服客户端核对。",
      ]
    : [
        "Lock enemy, defense, and bonus-damage assumptions first, or your comparisons will drift between tests.",
        "Rotation output depends heavily on assumptions, so comfort, energy pressure, and real timeline length still matter.",
        "Character, weapon, and multiplier data here can also be stale; verify each assumption in the target server's client before comparing.",
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
