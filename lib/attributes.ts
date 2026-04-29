import type { Locale } from "./i18n";

export const ATTRIBUTE_COLORS: Record<string, string> = {
  cosmos: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  anima: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  incantation: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  chaos: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  psyche: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  lakshana: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export const ATTRIBUTE_LABELS: Record<string, Record<Locale, string>> = {
  cosmos: { zh: "宇宙", tw: "宇宙", en: "Cosmos" },
  anima: { zh: "生命", tw: "生命", en: "Anima" },
  incantation: { zh: "咒术", tw: "咒術", en: "Incantation" },
  chaos: { zh: "混沌", tw: "混沌", en: "Chaos" },
  psyche: { zh: "灵魂", tw: "靈魂", en: "Psyche" },
  lakshana: { zh: "相", tw: "相", en: "Lakshana" },
};

export function getAttributeColor(attr: string): string {
  return ATTRIBUTE_COLORS[attr] || "";
}

export function getAttributeLabel(attr: string, lang: Locale): string {
  return ATTRIBUTE_LABELS[attr]?.[lang] || attr;
}

export function getRankDisplay(rank: string): string {
  return rank;
}

export const ARC_TYPE_LABELS: Record<string, Record<Locale, string>> = {
  gas: { zh: "气体", tw: "氣體", en: "Gas" },
  liquid: { zh: "液体", tw: "液體", en: "Liquid" },
  plasma: { zh: "等离子", tw: "電漿", en: "Plasma" },
  solid: { zh: "固体", tw: "固體", en: "Solid" },
  synthesis: { zh: "合成", tw: "合成", en: "Synthesis" },
};

export const ARC_RANK_LABELS: Record<string, Record<Locale, string>> = {
  S: { zh: "S级", tw: "S級", en: "S-Rank" },
  A: { zh: "A级", tw: "A級", en: "A-Rank" },
  B: { zh: "B级", tw: "B級", en: "B-Rank" },
};

export const SUBSTAT_LABELS: Record<string, Record<Locale, string>> = {
  critRate: { zh: "暴击率", tw: "暴擊率", en: "CRIT Rate" },
  critDmg: { zh: "暴击伤害", tw: "暴擊傷害", en: "CRIT DMG" },
  atkPct: { zh: "攻击力", tw: "攻擊力", en: "ATK" },
  chargeEff: { zh: "充能效率", tw: "充能效率", en: "Charge Efficiency" },
  hpPct: { zh: "生命值", tw: "生命值", en: "HP" },
  defPct: { zh: "防御力", tw: "防禦力", en: "DEF" },
  breakPower: { zh: "破韧强度", tw: "破韌強度", en: "Break Intensity" },
};

export const OBTAIN_METHOD_LABELS: Record<string, Record<Locale, string>> = {
  "free-anomaly": { zh: "异象委托", tw: "異象委託", en: "Anomaly Commission" },
  "free-boss": { zh: "世界Boss", tw: "世界Boss", en: "World Boss" },
  "free-hidden": { zh: "隐藏任务", tw: "隱藏任務", en: "Hidden Quest" },
  "free-shop": { zh: "弧盘商店", tw: "弧盤商店", en: "Arc Shop" },
  "free-story": { zh: "主线奖励", tw: "主線獎勵", en: "Story Reward" },
  "free-event": { zh: "活动奖励", tw: "活動獎勵", en: "Event Reward" },
  "gacha-standard": { zh: "常驻祈愿", tw: "常駐祈願", en: "Standard Gacha" },
  "gacha-limited": { zh: "限定祈愿", tw: "限定祈願", en: "Limited Gacha" },
  "battle-pass": { zh: "大月卡", tw: "大月卡", en: "Battle Pass" },
  "starter": { zh: "初始赠送", tw: "初始贈送", en: "Starter" },
};
