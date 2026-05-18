import { ComparePageContent } from "../ComparePageContent";
import { LOCALES, isZhLocale, Locale, hreflangAlternates } from "../../../../lib/i18n";
import { getCompare } from "../../../../lib/queries";
import { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  const article = getCompare("nte-vs-honkai-star-rail");
  if (!article) return {};
  const locale = lang as Locale;
  const baseTitle = isZhLocale(locale) ? article.title : article.titleEn;
  const description = isZhLocale(locale) ? article.summary : article.summaryEn;
  // For non-zh/en locales, append locale name to avoid duplicate titles
  const rawTitle = (!isZhLocale(locale) && locale !== "en")
    ? `${baseTitle} (${locale.toUpperCase()})`
    : baseTitle;
  const title = `${rawTitle} (2026)`;
  return {
    title,
    description,
    alternates: hreflangAlternates("compare/nte-vs-honkai-star-rail", lang),
    openGraph: { title: `${title} | NTE Guide`, description, type: "article" },
  };
}

export default async function CompareNteVsHsrPage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "nte-vs-honkai-star-rail" }} />;
}
