import { ComparePageContent, generateCompareMetadata } from "../ComparePageContent";
import { LOCALES } from "../../../../lib/i18n";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const generateMetadata = generateCompareMetadata;

export default async function CompareNteVsGenshinPage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "nte-vs-genshin" }} />;
}
