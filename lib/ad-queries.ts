/**
 * Anime Destiny data access layer.
 * Separate from queries.ts to keep the two game sections decoupled.
 */
import unitsData from "../data/anime-destiny/units.json";
import codesData from "../data/anime-destiny/codes.json";
import traitsData from "../data/anime-destiny/traits.json";
import guidesData from "../data/anime-destiny/guides.json";
import gameInfoData from "../data/anime-destiny/game-info.json";
import artifactsData from "../data/anime-destiny/artifacts.json";

export interface ADUnitStats {
  damage: string;
  range: string;
  attackSpeed: string;
  aoe: string;
  attackType: string;
  placementCost: string;
}

export interface ADUnitUpgrade {
  level: string;
  cost: string;
  damage: string;
  notes?: string;
}

export interface ADUnit {
  id: string;
  name: string;
  variant: string | null;
  rarity: string;
  tier: string;
  roles: string[];
  description: string;
  synergy: string | null;
  stats?: ADUnitStats;
  upgrades?: ADUnitUpgrade[];
  evolution?: {
    from: string | null;
    materials: string[];
    notes: string;
  };
}

export interface ADCode {
  code: string;
  status: string;
  rewards: string;
  description: string;
}

export interface ADExpiredCode {
  code: string;
  note: string;
}

export interface ADRewardType {
  name: string;
  description: string;
}

export interface ADCodesData {
  active: ADCode[];
  expired: ADExpiredCode[];
  rewardTypes: ADRewardType[];
  howToRedeem: string[];
}

export interface ADTrait {
  id: string;
  name: string;
  type: string;
  bestFor: string;
  advice: string;
}

export interface ADArtifact {
  id: string;
  name: string;
  tier: string;
  rarity: string;
  effect: string;
  description: string;
  bestFor: string;
  source: string;
  slots: number;
}

export interface ADGuideStep {
  title: string;
  content: string;
  tip: string;
}

export interface ADMaterial {
  name: string;
  usedFor: string;
  whereToCheck: string;
  priority: string;
  bestUse: string;
}

export interface ADGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  steps?: ADGuideStep[];
  tips?: string[];
  materials?: ADMaterial[];
}

export interface ADFaq {
  question: string;
  answer: string;
}

export interface ADOfficialLink {
  name: string;
  label: string;
  description: string;
  bestFor: string;
  url: string;
}

export interface ADUpdate {
  type: string;
  name: string;
  description: string;
}

export interface ADGameInfo {
  name: string;
  platform: string;
  genre: string;
  description: string;
  stats: {
    totalVisits: string;
    playersOnline: string;
    userRating: string;
    discordMembers: string;
  };
  officialLinks: ADOfficialLink[];
  updates: ADUpdate[];
  updateChecklist: string[];
  faq: ADFaq[];
}

const units = unitsData as ADUnit[];
const codes = codesData as ADCodesData;
const traits = traitsData as ADTrait[];
const guides = guidesData as ADGuide[];
const gameInfo = gameInfoData as ADGameInfo;
const artifacts = artifactsData as ADArtifact[];

export function getAllADUnits(): ADUnit[] {
  return units;
}

export function getADUnit(slug: string): ADUnit | undefined {
  return units.find((u) => u.id === slug);
}

export function getADCodes(): ADCodesData {
  return codes;
}

export function getADTraits(): ADTrait[] {
  return traits;
}

export function getAllADArtifacts(): ADArtifact[] {
  return artifacts;
}

export function getAllADGuides(): ADGuide[] {
  return guides;
}

export function getADGuide(slug: string): ADGuide | undefined {
  return guides.find((g) => g.id === slug);
}

export function getADGameInfo(): ADGameInfo {
  return gameInfo;
}

export function getADFaq(): ADFaq[] {
  return gameInfo.faq;
}
