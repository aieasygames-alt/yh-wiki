import { hreflangAlternates } from "../../../lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return {
    title:
      lang === "zh"
        ? "异环地图标点 | 全地图资源点"
        : "NTE Interactive Map - Neverness to Everness Resource Locations",
    description:
      lang === "zh"
        ? "异环交互式地图，查看副本、BOSS、采集点和传送点的位置。"
        : "Neverness to Everness interactive map. Find all domains, bosses, collectibles and waypoints.",
    alternates: hreflangAlternates("map"),
  };
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
