import type { Locale } from "./i18n";

// Helper to create locale records that fall back to English for new locales
function locales(zh: string, tw: string, en: string): Record<Locale, string> {
  return { zh, tw, en, th: en, vi: en, id: en } as Record<Locale, string>;
}

export const ATTRIBUTE_COLORS: Record<string, string> = {
  cosmos: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  anima: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  incantation: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  chaos: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  psyche: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  lakshana: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export const ATTRIBUTE_LABELS: Record<string, Record<Locale, string>> = {
  cosmos: locales("宇宙", "宇宙", "Cosmos"),
  anima: locales("生命", "生命", "Anima"),
  incantation: locales("咒术", "咒術", "Incantation"),
  chaos: locales("混沌", "混沌", "Chaos"),
  psyche: locales("灵魂", "靈魂", "Psyche"),
  lakshana: locales("相", "相", "Lakshana"),
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
  gas: locales("气体", "氣體", "Gas"),
  liquid: locales("液体", "液體", "Liquid"),
  plasma: locales("等离子", "電漿", "Plasma"),
  solid: locales("固体", "固體", "Solid"),
  synthesis: locales("合成", "合成", "Synthesis"),
};

export const ARC_RANK_LABELS: Record<string, Record<Locale, string>> = {
  S: locales("S级", "S級", "S-Rank"),
  A: locales("A级", "A級", "A-Rank"),
  B: locales("B级", "B級", "B-Rank"),
};

export const SUBSTAT_LABELS: Record<string, Record<Locale, string>> = {
  critRate: locales("暴击率", "暴擊率", "CRIT Rate"),
  critDmg: locales("暴击伤害", "暴擊傷害", "CRIT DMG"),
  atkPct: locales("攻击力", "攻擊力", "ATK"),
  chargeEff: locales("充能效率", "充能效率", "Charge Efficiency"),
  hpPct: locales("生命值", "生命值", "HP"),
  defPct: locales("防御力", "防禦力", "DEF"),
  breakPower: locales("破韧强度", "破韌強度", "Break Intensity"),
};

export const OBTAIN_METHOD_LABELS: Record<string, Record<Locale, string>> = {
  "free-anomaly": locales("异象委托", "異象委託", "Anomaly Commission"),
  "free-boss": locales("世界Boss", "世界Boss", "World Boss"),
  "free-hidden": locales("隐藏任务", "隱藏任務", "Hidden Quest"),
  "free-shop": locales("弧盘商店", "弧盤商店", "Arc Shop"),
  "free-story": locales("主线奖励", "主線獎勵", "Story Reward"),
  "free-event": locales("活动奖励", "活動獎勵", "Event Reward"),
  "gacha-standard": locales("常驻祈愿", "常駐祈願", "Standard Gacha"),
  "gacha-limited": locales("限定祈愿", "限定祈願", "Limited Gacha"),
  "battle-pass": locales("大月卡", "大月卡", "Battle Pass"),
  "starter": locales("初始赠送", "初始贈送", "Starter"),
};
