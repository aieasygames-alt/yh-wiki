import { hreflangAlternates, isZhLocale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title: isZhLocale(lang)
      ? "异环探索伴侣 - 扫图模式 | NTE Guide"
      : "NTE Exploration Companion - Sweep Mode | Neverness to Everness",
    description: isZhLocale(lang)
      ? "异环探索伴侣：优化收集路线、追踪收集进度、每日/每周刷新追踪。"
      : "NTE Exploration Companion: optimized collection routes, progress tracking, and daily/weekly respawn tracker.",
    alternates: hreflangAlternates("explorer", lang),
    openGraph: {
      title: isZhLocale(lang)
        ? "异环探索伴侣 - 扫图模式"
        : "NTE Exploration Companion - Sweep Mode",
      description: isZhLocale(lang)
        ? "优化收集路线，追踪探索进度"
        : "Optimized collection routes and exploration progress tracker",
      type: "website",
    },
  };
}

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
