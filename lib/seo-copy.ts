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

export function completeMetaDescription(locale: Locale, description: string): string {
  const cleaned = description.replace(/\s+/g, " ").trim();
  if (cleaned.length >= 85) return cleaned;

  const suffix =
    locale === "en"
      ? " Includes practical steps, related pages, current-version notes, and NTE Guide links for deeper planning."
      : locale === "tw"
        ? " 本頁補充實用步驟、相關入口、版本重點與延伸閱讀，方便快速判斷下一步養成、配隊或探索安排。"
        : " 本页补充实用步骤、相关入口、版本重点与延伸阅读，方便快速判断下一步养成、配队或探索安排。";

  if (!cleaned) return suffix.trim();
  const needsPeriod = locale === "en" && !/[.!?]$/.test(cleaned);
  return `${cleaned}${needsPeriod ? "." : ""}${suffix}`;
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

  if (args.locale === "en") {
    return {
      title: `${args.nameEn} Historical Material Reference | NTE Guide`,
      description: `Historical NTE material reference for ${args.nameEn}: recorded rarity ${args.rarity}, source fields, and ${args.usedByCount} character association${args.usedByCount === 1 ? "" : "s"}. Verify current sources, costs, and uses in the client.`,
      ogDescription: `Historical source and character-association fields for ${args.nameEn}; verify current availability in the client.`,
    };
  }

  const variants = args.locale === "tw"
    ? {
        title: `${name} 歷史素材欄位與角色關聯 | 異環 Wiki`,
        description: `異環素材「${name}」的歷史資料：${args.rarity}星${args.typeLabel}、記錄來源與${args.usedByCount}名角色關聯。現行來源、掉落、成本與用途請以客戶端為準。`,
        ogDescription: `異環「${name}」歷史來源與角色關聯欄位；目前狀態請以客戶端為準。`,
      }
    : {
        title: `${name} 历史素材字段与角色关联 | 异环 Wiki`,
        description: `异环素材「${name}」的历史资料：${args.rarity}星${args.typeLabel}、记录来源与${args.usedByCount}名角色关联。当前来源、掉落、成本与用途请以客户端为准。`,
        ogDescription: `异环「${name}」历史来源与角色关联字段；当前状态请以客户端为准。`,
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
  if (args.locale === "en") {
    return {
      title: `${args.nameEn} Historical Combat Reference | NTE Wiki`,
      description: `Historical NTE combat reference for ${args.nameEn}: recorded ${args.typeLabel} location, weakness, mechanics, drops, and strategy fields. Verify current encounter data in the target server's client.`,
    };
  }

  if (args.locale === "tw") {
    return {
      title: `${name} 歷史戰鬥欄位與掉落記錄 | 異環 Wiki`,
      description: `異環異象「${name}」的歷史資料：${args.typeLabel}定位、記錄位置、弱點、戰鬥機制、掉落與策略欄位；目前遭遇內容請以目標區服客戶端為準。`,
    };
  }

  return {
    title: `${name} 历史战斗字段与掉落记录 | 异环 Wiki`,
    description: `异环异象「${name}」的历史资料：${args.typeLabel}定位、记录位置、弱点、战斗机制、掉落与策略字段；当前遭遇内容请以目标区服客户端为准。`,
  };
}
