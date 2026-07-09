import { hreflangAlternates, Locale } from "../../../lib/i18n";
import { localizedText } from "../../../lib/seo-copy";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环角色对比 — 属性技能Build横向比较", "NTE Character Compare — Side-by-Side Stats & Builds");
  const description = localizedText(locale, "横向对比异环角色属性、技能、推荐Build和队伍搭配，最多同时对比3个角色。", "Compare NTE characters side by side: stats, skills, builds, and team comps. Up to 3 characters at once.");
  return {
    title,
    description,
    alternates: hreflangAlternates("compare-characters", lang),
    openGraph: { title, description, type: "website" },
  };
}

export default function CompareCharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
