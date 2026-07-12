import { ComparePageContent } from "../ComparePageContent";
import { LOCALES, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { Metadata } from "next";
import { localizedText } from "../../../../lib/seo-copy";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const title = localizedText(locale, "异环 vs 原神：抽卡、开放世界、战斗系统完整对比 (2026)", "NTE vs Genshin Impact: Gacha, Combat & Open World Differences (2026)");
  const description = localizedText(locale, "异环和原神完整对比：无50/50抽卡机制、现代都市开放世界、动作战斗、角色养成、平台与新手福利差异。", "NTE vs Genshin Impact comparison covering no-50/50 gacha, modern urban open world, action combat, character progression, platforms, and beginner rewards.");
  return {
    title,
    description,
    alternates: hreflangAlternates("compare/nte-vs-genshin", lang),
    openGraph: { title, description, type: "article" },
  };
}

export default async function CompareNteVsGenshinPage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "nte-vs-genshin" }} />;
}
