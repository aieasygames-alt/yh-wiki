import * as OpenCC from "opencc-js";

import type { Locale } from "./i18n";

const toTw = OpenCC.Converter({ from: "cn", to: "tw" });

export function toTraditionalChinese(text: string): string {
  return toTw(text);
}

export function pickLocalizedText(
  locale: Locale,
  zh: string,
  en: string,
  tw?: string
): string {
  if (locale === "en") return en;
  if (locale === "tw") return toTraditionalChinese(tw || zh);
  return zh;
}

const englishKeywords = [
  "Neverness to Everness",
  "NTE",
  "NTE guide",
  "NTE wiki",
  "NTE characters",
  "NTE tier list",
  "NTE calculator",
  "NTE redeem codes",
  "NTE builds",
  "NTE download",
];

const simplifiedKeywords = [
  "异环",
  "异环游戏",
  "异环攻略",
  "异环角色",
  "异环强度榜",
  "异环兑换码",
  "异环抽卡",
  "异环配队",
  "异环Wiki",
  "异环官网",
  "异环下载",
  "异环新手攻略",
];

export function localizedSeoKeywords(locale: Locale): string[] {
  if (locale === "en") return englishKeywords;
  if (locale === "tw") return simplifiedKeywords.map(toTraditionalChinese);
  return simplifiedKeywords;
}
