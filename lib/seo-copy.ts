import type { Locale } from "./i18n";
import { toTraditionalChinese } from "./traditional";

export function localizedName(locale: Locale, zh: string, en: string, tw?: string): string {
  if (locale === "en") return en;
  if (locale === "tw") return tw || toTraditionalChinese(zh);
  return zh;
}

export function localizedText(locale: Locale, zh: string, en: string, tw?: string): string {
  if (locale === "en") return en;
  if (locale === "tw") return toTraditionalChinese(tw || zh);
  return zh;
}

export function materialSeoCopy(args: {
  locale: Locale;
  name: string;
  nameEn: string;
  typeLabel: string;
  rarity: number;
  source: string;
  usedByCount: number;
}) {
  const name = localizedName(args.locale, args.name, args.nameEn);
  const source = localizedText(args.locale, args.source, args.source);

  if (args.locale === "en") {
    return {
      title: `${args.nameEn} Source, Farming Route & Character Uses | NTE Guide`,
      description: `${args.nameEn} material guide for Neverness to Everness: rarity ${args.rarity}, source locations, farming routes, and ${args.usedByCount} character use${args.usedByCount === 1 ? "" : "s"} that need it for upgrades.`,
      ogDescription: `How to get ${args.nameEn}, where it drops, and which NTE characters use this material.`,
    };
  }

  const variants = args.locale === "tw"
    ? {
        title: `${name} 獲取方式、刷取路線與角色用途 | 異環 Wiki`,
        description: `異環素材「${name}」完整指南：${args.rarity}星${args.typeLabel}，整理來源、掉落地點、刷取路線，以及${args.usedByCount}名角色養成所需用途。主要來源：${source}。`,
        ogDescription: `異環「${name}」獲取方式、掉落地點、刷取路線與角色養成用途。`,
      }
    : {
        title: `${name} 获取方式、刷取路线与角色用途 | 异环 Wiki`,
        description: `异环素材「${name}」完整指南：${args.rarity}星${args.typeLabel}，整理来源、掉落地点、刷取路线，以及${args.usedByCount}名角色养成所需用途。主要来源：${source}。`,
        ogDescription: `异环「${name}」获取方式、掉落地点、刷取路线与角色养成用途。`,
      };

  return variants;
}

export function diskSetSeoCopy(args: {
  locale: Locale;
  name: string;
  nameTw?: string;
  nameEn: string;
  categoryLabel: string;
  elementLabel?: string;
  pieces: number;
  bonus2pc: string;
  bonus4pc: string;
  characterCount: number;
}) {
  const name = localizedName(args.locale, args.name, args.nameEn, args.nameTw);
  const bonus2pc = localizedText(args.locale, args.bonus2pc, args.bonus2pc);
  const bonus4pc = localizedText(args.locale, args.bonus4pc, args.bonus4pc);

  if (args.locale === "en") {
    return {
      title: `${args.nameEn} Set Bonus, Best Characters & Builds | NTE Guide`,
      description: `${args.nameEn} cassette set guide for Neverness to Everness: ${args.pieces}-piece ${args.categoryLabel} bonuses, best characters, build uses, and rotation notes. 2-piece: ${args.bonus2pc}; 4-piece: ${args.bonus4pc}.`,
    };
  }

  if (args.locale === "tw") {
    return {
      title: `${name} 套裝效果、適用角色與配裝建議 | 異環 Wiki`,
      description: `異環卡帶「${name}」${args.pieces}件套指南：${args.categoryLabel}${args.elementLabel ? `、${args.elementLabel}` : ""}定位，整理2件套與4件套效果、${args.characterCount}名推薦角色、配裝思路與實戰用法。2件套：${bonus2pc}；4件套：${bonus4pc}。`,
    };
  }

  return {
    title: `${name} 套装效果、适用角色与配装建议 | 异环 Wiki`,
    description: `异环卡带「${name}」${args.pieces}件套指南：${args.categoryLabel}${args.elementLabel ? `、${args.elementLabel}` : ""}定位，整理2件套与4件套效果、${args.characterCount}名推荐角色、配装思路与实战用法。2件套：${bonus2pc}；4件套：${bonus4pc}。`,
  };
}

export function anomalySeoCopy(args: {
  locale: Locale;
  name: string;
  nameEn: string;
  typeLabel: string;
  location?: string;
  locationEn?: string;
  weakness?: string;
  weaknessEn?: string;
  drops?: string[];
  dropsEn?: string[];
}) {
  const name = localizedName(args.locale, args.name, args.nameEn);
  const location = localizedText(args.locale, args.location || "", args.locationEn || args.location || "");
  const weakness = localizedText(args.locale, args.weakness || "", args.weaknessEn || args.weakness || "");
  const drops = (args.locale === "en" ? args.dropsEn || args.drops : args.drops)
    ?.slice(0, 3)
    .map((drop) => localizedText(args.locale, drop, drop))
    .join(args.locale === "en" ? ", " : "、");

  if (args.locale === "en") {
    return {
      title: `${args.nameEn} Boss Guide, Weakness, Mechanics & Drops | NTE Wiki`,
      description: `Complete ${args.nameEn} guide for Neverness to Everness: ${args.typeLabel} location${args.locationEn ? ` at ${args.locationEn}` : ""}, weakness patterns, combat mechanics, drops${drops ? ` including ${drops}` : ""}, and recommended strategy.`,
    };
  }

  if (args.locale === "tw") {
    return {
      title: `${name} 打法攻略、弱點機制與掉落 | 異環 Wiki`,
      description: `異環異象「${name}」完整攻略：${args.typeLabel}定位${location ? `，出現位置為${location}` : ""}，整理弱點${weakness ? `（${weakness}）` : ""}、戰鬥機制、掉落${drops ? `（${drops}）` : ""}與推薦打法。`,
    };
  }

  return {
    title: `${name} 打法攻略、弱点机制与掉落 | 异环 Wiki`,
    description: `异环异象「${name}」完整攻略：${args.typeLabel}定位${location ? `，出现位置为${location}` : ""}，整理弱点${weakness ? `（${weakness}）` : ""}、战斗机制、掉落${drops ? `（${drops}）` : ""}与推荐打法。`,
  };
}
