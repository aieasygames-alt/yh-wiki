import { hreflangAlternates, Locale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = locale === "en"
    ? "NTE Gacha Simulator | Local Example-Parameter Experiment"
    : locale === "tw"
      ? "異環抽卡模擬器｜本地示例參數實驗"
      : "异环抽卡模拟器｜本地示例参数实验";
  const description = locale === "en"
    ? "A local NTE pull simulator using example parameters to explore random variation. It does not represent current banners, rates, pity, carry-over, or spending advice; verify the target server in-game."
    : locale === "tw"
      ? "使用示例參數體驗異環抽卡隨機波動的本地模擬器。不代表目前卡池、機率、保底、繼承或消費建議；請以目標區服遊戲內詳情為準。"
      : "使用示例参数体验异环抽卡随机波动的本地模拟器。不代表当前卡池、概率、保底、继承或消费建议；请以目标区服游戏内详情为准。";
  return {
    title,
    description,
    alternates: hreflangAlternates("gacha", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function GachaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
