import charactersData from "../data/characters.json";
import materialsData from "../data/materials.json";
import characterMaterialsData from "../data/character-materials.json";
import faqsData from "../data/faqs.json";
import weaponsData from "../data/weapons.json";
import guidesData from "../data/guides.json";
import loreData from "../data/lore.json";
import locationsData from "../data/locations.json";
import blogData from "../data/blog.json";
import comparesData from "../data/compares.json";
import changelogsData from "../data/changelog.json";
import vehiclesData from "../data/vehicles.json";

export interface FaqItem {
  question: string;
  questionZh: string;
  answer: string;
  answerZh: string;
}

export interface Skill {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  scaling?: string;
  scalingEn?: string;
  cooldown?: string;
  cost?: string;
}

export interface Skills {
  normalAttack: Skill;
  skill: Skill;
  ultimate: Skill;
  passives: Skill[];
}

export interface RecommendedBuild {
  bestWeapon: string;
  bestWeaponEn: string;
  alternativeWeapons: { id: string; name: string; nameEn: string }[];
  bestDiskSet: string;
  bestDiskSetEn: string;
  mainStats: Record<string, string>;
  mainStatsEn: Record<string, string>;
  subStatPriority: string[];
  subStatPriorityEn: string[];
}

export interface TeamComp {
  name: string;
  nameEn: string;
  members: string[];
  description: string;
  descriptionEn: string;
}

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
  descriptionEn?: string;
  faq?: FaqItem[];
  relatedCharacters?: string[];
  tierRank?: string;
  tierReason?: string;
  tierReasonZh?: string;
  skills?: Skills;
  recommendedBuild?: RecommendedBuild;
  teamComps?: TeamComp[];
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
  category: string;
  categoryZh: string;
  categoryEn: string;
  relatedCharacters: string[];
  relatedMaterials: string[];
}

export function getAllFaqs(): Faq[] {
  return faqsData as Faq[];
}

export function getFaq(slug: string): Faq | undefined {
  return getAllFaqs().find((f) => f.id === slug);
}

export function getFaqCategories(locale: "zh" | "en"): { slug: string; name: string }[] {
  const faqs = getAllFaqs();
  const seen = new Set<string>();
  return faqs
    .filter((f) => {
      if (seen.has(f.category)) return false;
      seen.add(f.category);
      return true;
    })
    .map((f) => ({
      slug: f.category,
      name: locale === "zh" ? f.categoryZh : f.categoryEn,
    }));
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
  faq?: FaqItem[];
  bestFor?: string;
  bestForZh?: string;
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
  faq?: FaqItem[];
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

// Blog types and queries

export interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  date: string;
  tags: string[];
  internalLinks: { label: string; labelEn: string; href: string }[];
}

export function getAllBlogPosts(): BlogPost[] {
  return blogData as BlogPost[];
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.id === slug);
}

export function getLatestBlogPosts(count: number): BlogPost[] {
  return getAllBlogPosts().slice(0, count);
}

// Compare types and queries

export interface CompareArticle {
  id: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  date: string;
  tags: string[];
  content: string;
  contentEn: string;
  internalLinks: { label: string; labelEn: string; href: string }[];
}

export function getAllCompares(): CompareArticle[] {
  return comparesData as CompareArticle[];
}

export function getCompare(slug: string): CompareArticle | undefined {
  return getAllCompares().find((c) => c.id === slug);
}

// Vehicle types and queries

export interface Vehicle {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  rarity: number;
  description: string;
  descriptionEn: string;
  speed: string;
  acceleration: string;
  handling: string;
  source: string;
  sourceEn: string;
  price: string;
  faq?: {
    question: string;
    questionZh: string;
    answer: string;
    answerZh: string;
  }[];
  image?: string;
}

export function getAllVehicles(): Vehicle[] {
  return vehiclesData as Vehicle[];
}

export function getVehicle(slug: string): Vehicle | undefined {
  return getAllVehicles().find((v) => v.id === slug);
}

// Changelog
interface ChangelogItem {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  type?: string;
  ref?: string;
  tags?: string[];
}

interface ChangelogSection {
  title: string;
  titleEn: string;
  items?: ChangelogItem[];
}

interface Changelog {
  id: string;
  version: string;
  versionName: string;
  versionNameEn: string;
  date: string;
  dateGlobal?: string;
  type: "major" | "minor" | "fix";
  highlights?: string[];
  highlightsEn?: string[];
  sections?: ChangelogSection[];
  compensation?: string;
  compensationEn?: string;
  internalLinks?: string[];
}

export function getAllChangelogs(): Changelog[] {
  return changelogsData;
}

export function getChangelogByVersion(version: string): Changelog | undefined {
  return changelogsData.find((cl) => cl.version === version);
}
