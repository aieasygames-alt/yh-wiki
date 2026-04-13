import { hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title:
      lang === "zh"
        ? "异环抽卡模拟器 | 祈愿模拟"
        : "NTE Gacha Simulator - Neverness to Everness Wish Sim",
    description:
      lang === "zh"
        ? "异环抽卡模拟器，模拟限定祈愿、常驻祈愿和武器祈愿，测试你的运气！"
        : "Simulate Neverness to Everness gacha pulls. Test your luck with our wish simulator before pulling in-game.",
    alternates: hreflangAlternates("gacha", lang),
  };
}

export default function GachaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
