import { hreflangAlternates, isZhLocale, Locale } from "../../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = isZhLocale(locale) ? "异环盘条评分计算器 — 副词条效率评级" : "NTE Disk Score Calculator — Substat Roll Efficiency Rating";
  const description = isZhLocale(locale)
    ? "异环盘条（驱动盘）副词条评分工具：输入副词条数值，计算词条效率评分，支持DPS/辅助/均衡权重。"
    : "NTE disk substat score calculator: input substats to calculate roll efficiency with DPS/Support/Balanced weight presets.";
  return {
    title,
    description,
    alternates: hreflangAlternates("calculator/disk-score", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function DiskScoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
