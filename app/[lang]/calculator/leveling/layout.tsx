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
        ? "升级材料计算器 | 快速计算养成成本"
        : "Leveling Calculator | Quick Farming Cost Calculator",
    description:
      lang === "zh"
        ? "异环升级材料计算器，输入等级快速计算所需材料数量，支持所有角色。"
        : "YiHuan leveling material calculator. Enter levels to quickly calculate required materials for all characters.",
    alternates: hreflangAlternates("calculator/leveling"),
  };
}

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
