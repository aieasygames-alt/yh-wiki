import { ComparePageContent, generateCompareMetadataForSlug } from "../ComparePageContent";
import { LOCALES } from "../../../../lib/i18n";
import { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  return generateCompareMetadataForSlug(lang, "nte-vs-honkai-star-rail");
}

export default async function CompareNteVsHsrPage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "nte-vs-honkai-star-rail" }} />;
}
