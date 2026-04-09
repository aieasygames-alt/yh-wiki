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
  cosmos: { zh: "宇宙", en: "Cosmos" },
  anima: { zh: "生命", en: "Anima" },
  incantation: { zh: "咒术", en: "Incantation" },
  chaos: { zh: "混沌", en: "Chaos" },
  psyche: { zh: "灵魂", en: "Psyche" },
  lakshana: { zh: "相", en: "Lakshana" },
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
