import { Locale } from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { CompareCharactersClient } from "./CompareCharactersClient";

export default async function CompareCharactersPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  return <CompareCharactersClient lang={lang as Locale} characters={getAvailableCharacters()} />;
}
