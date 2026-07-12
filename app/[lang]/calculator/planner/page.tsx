import { getAvailableCharacters, getAllMaterials, getCharacterMaterials } from "../../../../lib/queries";
import {
  MaterialPlannerClient,
} from "./MaterialPlannerClient";

export default function MaterialPlannerPage() {
  const availableCharacters = getAvailableCharacters();
  const characters = availableCharacters.map((character) => ({
    id: character.id,
    name: character.name,
    nameEn: character.nameEn,
    attribute: character.attribute,
  }));
  const materialsById = Object.fromEntries(
    getAllMaterials().map((material) => [
      material.id,
      {
        id: material.id,
        name: material.name,
        nameEn: material.nameEn,
        rarity: material.rarity,
      },
    ])
  );
  const characterMaterialsById = Object.fromEntries(
    availableCharacters
      .map((character) => {
        const materials = getCharacterMaterials(character.id);
        return materials ? [character.id, materials] : null;
      })
      .filter(Boolean) as Array<[string, NonNullable<ReturnType<typeof getCharacterMaterials>>]>
  );

  return (
    <MaterialPlannerClient
      characters={characters}
      materialsById={materialsById}
      characterMaterialsById={characterMaterialsById}
    />
  );
}
