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
import diskSetsData from "../data/disk-sets.json";
import anomaliesData from "../data/anomalies.json";
import questsData from "../data/quests.json";
import { isZhLocale, Locale } from "./i18n";
import { validateData, CharactersArraySchema, WeaponsArraySchema, MaterialsArraySchema, CharacterMaterialsArraySchema, FaqsArraySchema } from "./schemas";

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
  qte?: Skill;
  resonance?: Skill;
  awakening?: Skill[];
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
  nameTw?: string;
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
  status?: string;
  image?: string;
  cvZh?: string;
  cvJp?: string;
  cvJpEn?: string;
  cvEn?: string;
  faq?: FaqItem[];
  relatedCharacters?: string[];
  tierRank?: string;
  tierReason?: string;
  tierReasonZh?: string;
  skills?: Skills;
  recommendedBuild?: RecommendedBuild;
  teamComps?: TeamComp[];
  rotation?: {
    steps: Array<{ character: string; action: string; actionEn: string; trigger?: string; triggerEn?: string }>;
    tips?: string;
    tipsEn?: string;
  };
  arcType?: string;
  trait?: string;
  signatureArc?: string;
  acquisitionMethod?: string;
  availableAtLaunch?: boolean;
  awakenReq?: string;
  rarity?: string;
  title?: string;
  baseStats?: {
    baseHp: number;
    baseAtk: number;
    baseDef: number;
    level: number;
  };
  tierByScene?: {
    abyss: string;
    anomaly: string;
    general: string;
  };
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

const validatedCharacters = validateData("characters", charactersData, CharactersArraySchema);
const validatedWeapons = validateData("weapons", weaponsData, WeaponsArraySchema);
const validatedMaterials = validateData("materials", materialsData, MaterialsArraySchema);
const validatedCharacterMaterials = validateData("character-materials", characterMaterialsData, CharacterMaterialsArraySchema);

export function getAllCharacters(): Character[] {
  return validatedCharacters as unknown as Character[];
}

export function getAvailableCharacters(): Character[] {
  return getAllCharacters().filter(
    (c) => c.status !== "upcoming" && c.status !== "rumored" && c.availableAtLaunch !== false
  );
}

export function getCharacter(slug: string): Character | undefined {
  return getAllCharacters().find((c) => c.id === slug);
}

export function getAllMaterials(): Material[] {
  return validatedMaterials as Material[];
}

export function getMaterial(slug: string): Material | undefined {
  return getAllMaterials().find((m) => m.id === slug);
}

export function getCharacterMaterials(characterId: string): CharacterMaterial | undefined {
  return validatedCharacterMaterials.find(
    (cm) => cm.characterId === characterId
  );
}

export function getMaterialById(id: string): Material | undefined {
  return getAllMaterials().find((m) => m.id === id);
}

export function getCharactersUsingMaterial(materialId: string): Character[] {
  const ids = validatedCharacterMaterials
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
  questionTw?: string;
  answer: string;
  answerEn: string;
  answerTw?: string;
  seoTitleZh?: string;
  seoTitleEn?: string;
  seoTitleTw?: string;
  seoDescriptionZh?: string;
  seoDescriptionEn?: string;
  seoDescriptionTw?: string;
  quickAnswer?: string;
  quickAnswerEn?: string;
  extraFaqSchema?: { question: string; questionEn: string; answer: string; answerEn: string }[];
  tags: string[];
  category: string;
  categoryZh: string;
  categoryEn: string;
  categoryTw?: string;
  relatedCharacters: string[];
  relatedMaterials: string[];
}

const validatedFaqs = validateData("faqs", faqsData, FaqsArraySchema);

export function getAllFaqs(): Faq[] {
  return validatedFaqs as Faq[];
}

export function getFaq(slug: string): Faq | undefined {
  return getAllFaqs().find((f) => f.id === slug);
}

export function getFaqCategories(locale: Locale): { slug: string; name: string }[] {
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
      name: isZhLocale(locale) ? f.categoryZh : f.categoryEn,
    }));
}

// Weapon types and queries

export interface Weapon {
  id: string;
  name: string;
  nameTw: string;
  nameEn: string;
  rank: string;
  type: string;
  baseAtk: number;
  substat: string;
  substatValue: string;
  effectName: string;
  effectNameTw: string;
  effectNameEn: string;
  effectDescription: string;
  effectDescriptionTw: string;
  effectDescriptionEn: string;
  howToObtain: string;
  howToObtainTw?: string;
  howToObtainZh: string;
  howToObtainEn: string;
  signatureCharacter: string;
  status: string;
  image?: string;
}

export function getAllWeapons(): Weapon[] {
  return validatedWeapons as Weapon[];
}

export function getWeapon(slug: string): Weapon | undefined {
  return getAllWeapons().find((w) => w.id === slug);
}

export function getCharactersUsingWeapon(weaponId: string): Character[] {
  const weapon = getWeapon(weaponId);
  if (!weapon) return [];
  const chars = getAllCharacters();
  const result: Character[] = [];

  // Add signature character first
  if (weapon.signatureCharacter) {
    const sig = chars.find(c => c.id === weapon.signatureCharacter);
    if (sig) result.push(sig);
  }

  // Add other characters with matching arc type
  chars.forEach(c => {
    if (c.arcType === weapon.type && c.id !== weapon.signatureCharacter) {
      result.push(c);
    }
  });

  return result;
}

export function getWeaponsByType(type: string): Weapon[] {
  return getAllWeapons().filter(w => w.type === type);
}

export function getWeaponsByRank(rank: string): Weapon[] {
  return getAllWeapons().filter(w => w.rank === rank);
}

export function getWeaponsForCharacter(characterId: string): Weapon[] {
  const char = getCharacter(characterId);
  if (!char || !char.arcType) return [];
  return getAllWeapons().filter(w => w.type === char.arcType);
}

// Guide types and queries

export interface Guide {
  id: string;
  title: string;
  titleEn: string;
  titleTw?: string;
  seoTitleZh?: string;
  seoTitleEn?: string;
  seoTitleTw?: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  categoryTw?: string;
  summary: string;
  summaryEn: string;
  summaryTw?: string;
  seoDescriptionZh?: string;
  seoDescriptionEn?: string;
  seoDescriptionTw?: string;
  content: string;
  contentEn: string;
  contentTw?: string;
  tags: string[];
  relatedCharacters: string[];
  relatedLocations: string[];
  relatedLore: string[];
  date?: string;
  faq?: FaqItem[];
  internalLinks?: { label: string; labelEn: string; href: string }[];
}

export function getAllGuides(): Guide[] {
  return guidesData as Guide[];
}

export function getGuide(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.id === slug);
}

export function getGuideCategories(locale: Locale): { slug: string; name: string }[] {
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
      name: isZhLocale(locale) ? g.categoryZh : g.categoryEn,
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
  titleTw?: string;
  summary: string;
  summaryEn: string;
  summaryTw?: string;
  content: string;
  contentEn: string;
  contentTw?: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  date: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  internalLinks: { label: string; labelEn: string; href: string }[];
  faq?: FaqItem[];
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

export interface RecentContentUpdate {
  id: string;
  kind: "changelog" | "guide" | "blog";
  href: string;
  title: string;
  titleEn: string;
  titleTw?: string;
  summary: string;
  summaryEn: string;
  summaryTw?: string;
  date: string;
  tags: string[];
}

// Compare types and queries

export interface CompareArticle {
  id: string;
  title: string;
  titleEn: string;
  titleTw?: string;
  summary: string;
  summaryEn: string;
  summaryTw?: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  date: string;
  tags: string[];
  content: string;
  contentEn: string;
  contentTw?: string;
  internalLinks: { label: string; labelEn: string; href: string }[];
}

export function getAllCompares(): CompareArticle[] {
  return comparesData as CompareArticle[];
}

export function getCompare(slug: string): CompareArticle | undefined {
  return getAllCompares().find((c) => c.id === slug);
}

export interface InternalLink {
  label: string;
  labelEn: string;
  href: string;
}

// Vehicle types and queries

export interface VehicleStats {
  acceleration: number | null;
  shift: number | null;
  brake: number | null;
  drift: number | null;
}

export interface Vehicle {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  brand: string;
  brandEn: string;
  description: string;
  descriptionEn: string;
  topSpeed: number;
  stats: VehicleStats;
  source: string;
  sourceEn: string;
  price: number | null;
  currency: string;
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

export interface Changelog {
  id: string;
  version: string;
  versionName: string;
  versionNameEn: string;
  date: string;
  dateGlobal?: string;
  type: "major" | "minor" | "fix" | "hotfix";
  highlights?: string[];
  highlightsEn?: string[];
  sections?: ChangelogSection[];
  compensation?: string;
  compensationEn?: string;
  internalLinks?: Array<string | InternalLink>;
}

export function getAllChangelogs(): Changelog[] {
  return changelogsData as unknown as Changelog[];
}

export function getChangelogByVersion(version: string): Changelog | undefined {
  return (changelogsData as unknown as Changelog[]).find((cl) => cl.version === version);
}

function parseStableDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getLatestLiveChangelog(): Changelog | undefined {
  const now = new Date();
  return getAllChangelogs()
    .filter((cl) => {
      const parsed = parseStableDate(cl.date);
      return parsed && parsed <= now;
    })
    .sort((a, b) => parseStableDate(b.date)!.getTime() - parseStableDate(a.date)!.getTime())[0];
}

export function getUpcomingChangelogs(): Changelog[] {
  const now = new Date();
  return getAllChangelogs()
    .filter((cl) => {
      const parsed = parseStableDate(cl.date);
      return !parsed || parsed > now;
    });
}

export function getRecentContentUpdates(count: number): RecentContentUpdate[] {
  const changelogUpdates = getAllChangelogs()
    .filter((cl) => parseStableDate(cl.date))
    .map((cl) => ({
      id: cl.id,
      kind: "changelog" as const,
      href: `/changelog/${cl.version}`,
      title: `异环 ${cl.version} 更新日志`,
      titleEn: `NTE ${cl.version} Patch Notes`,
      titleTw: `異環 ${cl.version} 更新日誌`,
      summary: cl.highlights?.slice(0, 2).join(" / ") || cl.versionName,
      summaryEn: cl.highlightsEn?.slice(0, 2).join(" / ") || cl.versionNameEn,
      summaryTw: cl.highlights?.slice(0, 2).join(" / ") || cl.versionName,
      date: cl.date,
      tags: [cl.version, "patch-notes", cl.type],
    }));

  const guideUpdates = getAllGuides()
    .filter((guide) => parseStableDate(guide.date))
    .map((guide) => ({
      id: guide.id,
      kind: "guide" as const,
      href: `/guides/${guide.id}`,
      title: guide.title,
      titleEn: guide.titleEn,
      titleTw: guide.titleTw,
      summary: guide.summary,
      summaryEn: guide.summaryEn,
      summaryTw: guide.summaryTw,
      date: guide.date!,
      tags: guide.tags || [],
    }));

  const blogUpdates = getAllBlogPosts()
    .filter((post) => parseStableDate(post.date))
    .map((post) => ({
      id: post.id,
      kind: "blog" as const,
      href: `/blog/${post.id}`,
      title: post.title,
      titleEn: post.titleEn,
      titleTw: post.titleTw,
      summary: post.summary,
      summaryEn: post.summaryEn,
      summaryTw: post.summaryTw,
      date: post.date,
      tags: post.tags || [],
    }));

  return [...changelogUpdates, ...guideUpdates, ...blogUpdates]
    .sort((a, b) => parseStableDate(b.date)!.getTime() - parseStableDate(a.date)!.getTime())
    .slice(0, count);
}

export function getVersionSpotlightContent(version: string, count: number): RecentContentUpdate[] {
  return getRecentContentUpdates(100)
    .filter((item) => item.kind !== "changelog" && item.tags.some((tag) => tag === version))
    .slice(0, count);
}

// Disk Sets (Cartridges)
export interface DiskSet {
  id: string;
  name: string;
  nameTw: string;
  nameEn: string;
  category: "elemental" | "general";
  element: string | null;
  pieces: number;
  setDescription2pc: string;
  setDescription2pcEn: string;
  setDescription4pc: string;
  setDescription4pcEn: string;
  bestFor: string[];
  characters: string[];
  image?: string;
}

export function getAllDiskSets(): DiskSet[] {
  return diskSetsData as DiskSet[];
}

export function getDiskSet(slug: string): DiskSet | undefined {
  return getAllDiskSets().find((d) => d.id === slug);
}

// Anomalies
export interface Anomaly {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeZh: string;
  category?: string;
  categoryZh?: string;
  attribute?: string;
  attributeEn?: string;
  hp?: string;
  weakness?: string;
  weaknessEn?: string;
  mechanics?: string;
  mechanicsEn?: string;
  location?: string;
  locationEn?: string;
  appearance?: string;
  drops?: string[];
  dropsEn?: string[];
  strategy?: string;
  strategyEn?: string;
}

export function getAllAnomalies(): Anomaly[] {
  return anomaliesData as Anomaly[];
}

export function getAnomaly(slug: string): Anomaly | undefined {
  return getAllAnomalies().find((a) => a.id === slug);
}

export function getAnomaliesByType(type: string): Anomaly[] {
  return getAllAnomalies().filter((a) => a.type === type);
}

export interface Quest {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeZh: string;
  category?: string;
  categoryZh?: string;
  categoryEn?: string;
  region?: string;
  regionZh?: string;
  regionEn?: string;
  difficulty?: number;
  description?: string;
  descriptionEn?: string;
  rewards?: string[];
  rewardsEn?: string[];
  steps?: string[];
  stepsEn?: string[];
  relatedCharacters?: string[];
  tags?: string[];
}

export function getAllQuests(): Quest[] {
  return questsData as Quest[];
}

export function getQuest(slug: string): Quest | undefined {
  return getAllQuests().find((q) => q.id === slug);
}

export function getQuestsByType(type: string): Quest[] {
  return getAllQuests().filter((q) => q.type === type);
}

export function getQuestsByRegion(region: string): Quest[] {
  return getAllQuests().filter((q) => q.region === region);
}

export function getQuestTypes(locale: Locale): { slug: string; name: string }[] {
  const types = Array.from(new Set(getAllQuests().map((q) => q.type)));
  return types.map((type) => {
    const sample = getAllQuests().find((q) => q.type === type);
    return {
      slug: type,
      name: isZhLocale(locale) ? (sample?.typeZh || type) : type.replace(/-/g, " "),
    };
  });
}
