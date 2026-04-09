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
        ? "Build 计算器 | 角色配装推荐"
        : "Build Calculator | Character Build Guide",
    description:
      lang === "zh"
        ? "异环角色 Build 推荐，查看主词条、副词条优先级、推荐武器和队友搭配。"
        : "YiHuan character build recommendations. View main stats, sub stat priorities, recommended weapons and team comps.",
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
