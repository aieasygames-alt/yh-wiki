import { hreflangAlternates, Locale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环DPS计算器 — 完整循环伤害模拟", "NTE DPS Calculator — Full Rotation Damage Simulation");
  const description = localizedText(
    locale,
    "异环DPS计算器：完整技能循环伤害计算，包含角色、武器、Build预设、敌人防御设置、暴击期望和伤害倍率可视化。",
    "NTE DPS calculator for full rotation damage simulation with character and weapon selection, build presets, enemy defense settings, crit expectations, and multiplier visualization."
  );
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
