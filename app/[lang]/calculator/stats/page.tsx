import { getAvailableCharacters, getAllWeapons } from "../../../../lib/queries";
import { Locale } from "../../../../lib/i18n";
import { StatsCalculatorClient } from "./StatsCalculatorClient";

export default function StatsCalculatorPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  const characters = getAvailableCharacters().map((character) => ({
    id: character.id,
    name: character.name,
    nameEn: character.nameEn,
    rank: character.rank,
    attribute: character.attribute,
    role: character.role,
    roleEn: character.roleEn,
    arcType: character.arcType,
    signatureArc: character.signatureArc,
  }));
  const weapons = getAllWeapons().map((weapon) => ({
    id: weapon.id,
    name: weapon.name,
    nameEn: weapon.nameEn,
    rank: weapon.rank,
    type: weapon.type,
    baseAtk: weapon.baseAtk,
    effectName: weapon.effectName,
    effectNameEn: weapon.effectNameEn,
    effectDescription: weapon.effectDescription,
    effectDescriptionEn: weapon.effectDescriptionEn,
  }));

  return (
    <StatsCalculatorClient
      lang={lang as Locale}
      characters={characters}
      weapons={weapons}
    />
  );
}
