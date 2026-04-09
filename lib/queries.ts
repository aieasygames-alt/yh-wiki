import charactersData from "../data/characters.json";
import materialsData from "../data/materials.json";
import characterMaterialsData from "../data/character-materials.json";
import faqsData from "../data/faqs.json";
import weaponsData from "../data/weapons.json";
import guidesData from "../data/guides.json";
import loreData from "../data/lore.json";
import locationsData from "../data/locations.json";

export interface Character {
  id: string;
  name: string;
  nameEn: string;
  attribute: string;
  rank: string;
  weapon: string;
  weaponEn: string;
  role: string;
  roleEn: string;
  faction?: string;
  description?: string;
}

export interface Material {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  rarity: number;
  source: string;
}

export interface MaterialEntry {
  id: string;
  quantity: number;
}

export interface LevelRange {
  levelRange: string;
  materials: MaterialEntry[];
}

export interface CharacterMaterial {
  characterId: string;
  levelingMaterials: LevelRange[];
  skillMaterials: MaterialEntry[];
}

export function getAllCharacters(): Character[] {
  return charactersData as Character[];
}

export function getCharacter(slug: string): Character | undefined {
  return getAllCharacters().find((c) => c.id === slug);
}

export function getAllMaterials(): Material[] {
  return materialsData as Material[];
}

export function getMaterial(slug: string): Material | undefined {
  return getAllMaterials().find((m) => m.id === slug);
}

export function getCharacterMaterials(characterId: string): CharacterMaterial | undefined {
  return (characterMaterialsData as CharacterMaterial[]).find(
    (cm) => cm.characterId === characterId
  );
}

export function getMaterialById(id: string): Material | undefined {
  return getAllMaterials().find((m) => m.id === id);
}

export function getCharactersUsingMaterial(materialId: string): Character[] {
  const ids = (characterMaterialsData as CharacterMaterial[])
    .filter(
      (cm) =>
        cm.levelingMaterials.some((lr) =>
          lr.materials.some((m) => m.id === materialId)
        ) || cm.skillMaterials.some((m) => m.id === materialId)
    )
    .map((cm) => cm.characterId);
  return getAllCharacters().filter((c) => ids.includes(c.id));
}

export function calculateMaterials(
  characterId: string,
  currentLevel: number,
  targetLevel: number
): { materialId: string; quantity: number }[] {
  const cm = getCharacterMaterials(characterId);
  if (!cm) return [];

  const aggregated: Record<string, number> = {};

  cm.levelingMaterials.forEach((lr) => {
    const [start, end] = lr.levelRange.split("-").map(Number);
    if (end <= currentLevel || start > targetLevel) return;
    const overlapStart = Math.max(start, currentLevel + 1);
    const overlapEnd = Math.min(end, targetLevel);
    if (overlapStart > overlapEnd) return;

    lr.materials.forEach((m) => {
      aggregated[m.id] = (aggregated[m.id] || 0) + m.quantity;
    });
  });

  return Object.entries(aggregated)
    .map(([materialId, quantity]) => ({ materialId, quantity }))
    .sort((a, b) => {
      const ma = getMaterialById(a.materialId);
      const mb = getMaterialById(b.materialId);
      return (ma?.rarity || 0) - (mb?.rarity || 0);
    });
}

// FAQ types and queries

export interface Faq {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  tags: string[];
  relatedCharacters: string[];
  relatedMaterials: string[];
}

export function getAllFaqs(): Faq[] {
  return faqsData as Faq[];
}

export function getFaq(slug: string): Faq | undefined {
  return getAllFaqs().find((f) => f.id === slug);
}

// Weapon types and queries

export interface Weapon {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  description: string;
  descriptionEn: string;
  relatedCharacters: string[];
}

export function getAllWeapons(): Weapon[] {
  return weaponsData as Weapon[];
}

export function getWeapon(slug: string): Weapon | undefined {
  return getAllWeapons().find((w) => w.id === slug);
}

export function getCharactersUsingWeapon(weaponId: string): Character[] {
  const weapon = getWeapon(weaponId);
  if (!weapon) return [];
  return getAllCharacters().filter((c) => weapon.relatedCharacters.includes(c.id));
}

// Guide types and queries

export interface Guide {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  tags: string[];
  relatedCharacters: string[];
  relatedLocations: string[];
  relatedLore: string[];
}

export function getAllGuides(): Guide[] {
  return guidesData as Guide[];
}

export function getGuide(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.id === slug);
}

export function getGuideCategories(locale: "zh" | "en"): { slug: string; name: string }[] {
  const guides = getAllGuides();
  const seen = new Set<string>();
  return guides
    .filter((g) => {
      if (seen.has(g.category)) return false;
      seen.add(g.category);
      return true;
    })
    .map((g) => ({
      slug: g.category,
      name: locale === "zh" ? g.categoryZh : g.categoryEn,
    }));
}

// Lore types and queries

export interface Lore {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  relatedCharacters: string[];
  relatedLocations: string[];
}

export function getAllLore(): Lore[] {
  return loreData as Lore[];
}

export function getLoreItem(slug: string): Lore | undefined {
  return getAllLore().find((l) => l.id === slug);
}

// Location types and queries

export interface Location {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  relatedCharacters: string[];
  relatedLore: string[];
}

export function getAllLocations(): Location[] {
  return locationsData as Location[];
}

export function getLocation(slug: string): Location | undefined {
  return getAllLocations().find((l) => l.id === slug);
}
