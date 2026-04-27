import { hreflangAlternates, isZhLocale } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title: isZhLocale(lang)
      ? "异环互动地图 - 全资源标记位置 | NTE Guide"
      : "NTE Interactive Map - All Resource Locations | Neverness to Everness",
    description: isZhLocale(lang)
      ? "查看异环(NTE)完整互动地图，包含所有宝箱、资源采集点、BOSS位置、传送锚点等标记，支持分类筛选和收集进度追踪。"
      : "Explore the complete Neverness to Everness interactive map with all chest locations, resource nodes, boss positions, waypoints, and more. Filter by category and track collection progress.",
    alternates: hreflangAlternates("map", lang),
    openGraph: {
      title: isZhLocale(lang)
        ? "异环互动地图 - 全资源标记位置"
        : "NTE Interactive Map - All Resource Locations",
      description: isZhLocale(lang)
        ? "异环完整互动地图，宝箱、采集点、BOSS位置全标记"
        : "Complete NTE interactive map with all chests, resources, and boss locations",
      type: "website",
    },
  };
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
