import { ComparePageContent, generateCompareMetadata } from "../ComparePageContent";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "tw" }, { lang: "en" }];
}

export const generateMetadata = generateCompareMetadata;

export default async function CompareGamesLikeNtePage({
  params,
}: {
  params: { lang: string };
}) {
  const resolvedParams = await params;
  return <ComparePageContent params={{ lang: resolvedParams.lang, slug: "games-like-nte" }} />;
}
