import { hreflangAlternates } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title:
      lang === "zh"
        ? "异环 Build 计算器 | 角色配装推荐"
        : "NTE Build Calculator - Neverness to Everness",
    description:
      lang === "zh"
        ? "异环角色 Build 推荐，查看主词条、副词条优先级、推荐武器和队友搭配。"
        : "Find the best builds for Neverness to Everness characters. Main stats, sub stats, weapons, and team comp recommendations.",
    alternates: hreflangAlternates("calculator/build"),
  };
}

export default function BuildCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
