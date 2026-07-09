import { ComparePageContent, generateCompareMetadataForSlug } from "../ComparePageContent";
import { LOCALES } from "../../../../lib/i18n";
import { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = await params;
  return generateCompareMetadataForSlug(lang, "games-like-nte");
}

export default async function CompareGamesLikeNtePage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "games-like-nte" }} />;
}
