import { ComparePageContent, generateCompareMetadata } from "../ComparePageContent";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
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
