import { Metadata } from "next";
import { ComparePageContent, generateCompareMetadataForSlug } from "../ComparePageContent";
import { LOCALES } from "../../../../lib/i18n";
import { getAllCompares } from "../../../../lib/queries";

export function generateStaticParams() {
  return getAllCompares().flatMap((compare) =>
    LOCALES.map((lang) => ({
      lang,
      slug: compare.id,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const { lang, slug } = await params;
  return generateCompareMetadataForSlug(lang, slug);
}

export default async function ComparePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={resolvedParams} />;
}
