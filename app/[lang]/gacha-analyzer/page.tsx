import { Locale } from "../../../lib/i18n";
import { getAvailableCharacters, getAllWeapons } from "../../../lib/queries";
import { GachaAnalyzerClient } from "./GachaAnalyzerClient";

export default async function GachaAnalyzerPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return (
    <GachaAnalyzerClient
      lang={lang as Locale}
      characters={getAvailableCharacters()}
      weapons={getAllWeapons()}
    />
  );
}
