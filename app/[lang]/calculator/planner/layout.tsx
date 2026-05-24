import { hreflangAlternates, isZhLocale, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale) ? "异环养成规划 — 角色升级材料计算器" : "NTE Material Planner — Character Leveling Calculator";
  const description = isZhLocale(locale)
    ? "异环角色养成规划工具：添加多个角色和当前/目标等级，自动汇总所需升级材料，追踪收集进度。"
    : "NTE material planning tool: add characters with current/target levels, auto-aggregate materials, and track collection progress.";
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/planner", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
