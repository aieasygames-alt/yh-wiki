import { Locale } from "../../../../lib/i18n";
import {
  getAllCharacters,
  getAllWeapons,
  getAllMaterials,
  getCharacterMaterials,
} from "../../../../lib/queries";
import buildsData from "../../../../data/builds.json";
import { BuildCalculatorClient } from "./BuildCalculatorClient";

interface Build {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  mainStat: string;
  mainStatEn: string;
  subStats: string[];
  subStatsEn: string[];
  recommendedWeapons: string[];
  teamComp: string[];
  notes: string;
  notesEn: string;
}

interface CharacterBuild {
  characterId: string;
  builds: Build[];
}

export default async function BuildCalculatorPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;

  const characters = getAllCharacters().map((character) => ({
    id: character.id,
    name: character.name,
    nameEn: character.nameEn,
    attribute: character.attribute,
    rank: character.rank,
    status: character.status,
    role: character.role,
    roleEn: character.roleEn,
  }));

  const weapons = getAllWeapons().map((weapon) => ({
    id: weapon.id,
    name: weapon.name,
    nameEn: weapon.nameEn,
    type: weapon.type,
  }));

  const materialsById = Object.fromEntries(
    getAllMaterials().map((material) => [
      material.id,
      { id: material.id, name: material.name, nameEn: material.nameEn },
    ])
  );

  const characterMaterialsById = Object.fromEntries(
    getAllCharacters()
      .map((character) => getCharacterMaterials(character.id))
      .filter(Boolean)
      .map((entry) => [entry!.characterId, entry!])
  );

  return (
    <BuildCalculatorClient
      lang={lang as Locale}
      characters={characters}
      weapons={weapons}
      builds={buildsData as CharacterBuild[]}
      materialsById={materialsById}
      characterMaterialsById={characterMaterialsById}
    />
  );
}
