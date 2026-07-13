import { Locale } from "../../../lib/i18n";
import { getAvailableCharacters } from "../../../lib/queries";
import { GachaClient } from "./GachaClient";

export default async function GachaPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const characters = getAvailableCharacters().map((character) => ({
    id: character.id,
    name: character.name,
    nameEn: character.nameEn,
    rank: character.rank,
    attribute: character.attribute,
    image: character.image,
  }));

  return <GachaClient lang={lang as Locale} characters={characters} />;
}
