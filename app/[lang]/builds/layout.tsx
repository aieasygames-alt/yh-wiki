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
    "异环全角色最佳Build推荐 — 武器卡带词条汇总",
    "NTE Best Builds for All Characters — Weapons, Disks & Stats"
  );
  const description = localizedText(
    locale,
    "异环全角色Build推荐：最佳武器（弧盘）、卡带套装、主词条与副词条优先级，一页查看所有角色装备方案。",
    "Complete build guide for all NTE characters: best Arcs (weapons), Cartridge sets, main stats, and sub-stat priorities in one page."
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
