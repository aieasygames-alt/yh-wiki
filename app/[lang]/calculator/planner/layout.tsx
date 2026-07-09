import { hreflangAlternates, Locale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环养成规划 — 角色升级材料计算器", "NTE Material Planner — Character Leveling Calculator");
  const description = localizedText(
    locale,
    "异环角色养成规划工具：添加多个角色和当前/目标等级，自动汇总升级材料、突破素材、技能消耗并追踪收集进度。",
    "NTE material planning tool: add multiple characters with current and target levels, aggregate upgrade materials, ascension items, skill costs, and track collection progress."
  );
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
