import { hreflangAlternates, isZhLocale, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale) ? "异环DPS计算器 — 完整循环伤害模拟" : "NTE DPS Calculator — Full Rotation Damage Simulation";
  const description = isZhLocale(locale)
    ? "异环DPS计算器：完整技能循环伤害计算，含角色/武器选择、Build预设、敌人设置和伤害倍率可视化。"
    : "NTE DPS calculator: full rotation damage simulation with character/weapon selection, build presets, and multiplier visualization.";
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/dps", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function DPSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
