import { getAvailableCharacters, getAllWeapons } from "../../../../lib/queries";
import { DPSCalculatorClient } from "./DPSCalculatorClient";

export default function DPSCalculatorPage() {
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
    baseStats: character.baseStats ? { baseAtk: character.baseStats.baseAtk } : undefined,
  }));

  const weapons = getAllWeapons().map((weapon) => ({
    id: weapon.id,
    name: weapon.name,
    nameEn: weapon.nameEn,
    rank: weapon.rank,
    type: weapon.type,
    baseAtk: weapon.baseAtk,
  }));

  return <DPSCalculatorClient characters={characters} weapons={weapons} />;
}
