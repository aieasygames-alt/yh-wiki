import { ComparePageContent } from "../ComparePageContent";
import { LOCALES, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getCompare } from "../../../../lib/queries";
import { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const article = getCompare("games-like-nte");
  if (!article) return {};
  const locale = lang as Locale;
  const baseTitle = isZhLocale(locale) ? article.title : article.titleEn;
  const description = isZhLocale(locale) ? article.summary : article.summaryEn;
  const rawTitle = baseTitle;
  const title = `${rawTitle} (2026)`;
  return {
    title,
    description,
    alternates: hreflangAlternates("compare/games-like-nte", lang),
    openGraph: { title: `${title} | NTE Guide`, description, type: "article" },
  };
}

export default async function CompareGamesLikeNtePage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "games-like-nte" }} />;
}
