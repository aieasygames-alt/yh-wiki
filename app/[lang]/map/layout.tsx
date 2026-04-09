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
        ? "地图标点 | 异环全地图资源点"
        : "Interactive Map | YiHuan All Map Resources",
    description:
      lang === "zh"
        ? "异环交互式地图，查看副本、BOSS、采集点和传送点的位置。"
        : "YiHuan interactive map. Find domain, boss, collectible, and waypoint locations.",
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
