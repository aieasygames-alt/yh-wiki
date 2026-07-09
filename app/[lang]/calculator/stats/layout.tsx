import { hreflangAlternates, t, Locale } from "../../../../lib/i18n";
import { localizedText } from "../../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, t(locale, "statsCalc.seoTitle"), t(locale, "statsCalc.seoTitle"));
  const description = localizedText(
    locale,
    "计算异环角色伤害输出。根据不同武器、属性、技能倍率、暴击期望和增伤词条估算DPS，适合配装测试和Build对比。",
    "Calculate NTE character damage output with weapons, attributes, skill multipliers, crit expectations, and damage bonus stats for build testing and comparison."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/stats", lang),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function StatsCalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
