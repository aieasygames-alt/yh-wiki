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
        ? "异环升级材料计算器 | 快速计算养成成本"
        : "NTE Damage Calculator & Build Planner - Neverness to Everness",
    description:
      lang === "zh"
        ? "异环升级材料计算器，输入等级快速计算所需材料数量，支持所有角色。"
        : "Calculate Neverness to Everness character leveling materials. Enter current and target levels to plan your farming route.",
    alternates: hreflangAlternates("calculator/leveling", lang),
  };
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
