import { hreflangAlternates, Locale } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(
    locale,
    "异环角色构筑档案｜历史装备与词条方向",
    "NTE Character Build Archive | Historical Gear & Stat Directions"
  );
  const description = localizedText(
    locale,
    "异环角色构筑历史资料：记录弧盘、卡带、主词条与副词条方向。当前装备效果、可用性与投入价值请以目标区服客户端为准。",
    "Historical NTE build references for recorded Arcs, disks, main stats, and substats. Verify current gear effects, availability, and investment value in your target client."
  );
  return {
    title,
    description,
    alternates: hreflangAlternates("builds", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function BuildsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
