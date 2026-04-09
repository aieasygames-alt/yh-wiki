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
        ? "抽卡模拟器 | 异环祈愿模拟"
        : "Gacha Simulator | YiHuan Wish Simulator",
    description:
      lang === "zh"
        ? "异环抽卡模拟器，模拟限定祈愿、常驻祈愿和武器祈愿，测试你的运气！"
        : "YiHuan gacha simulator. Simulate limited, standard, and weapon wishes to test your luck!",
    alternates: hreflangAlternates("gacha"),
  };
}

export default function GachaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
