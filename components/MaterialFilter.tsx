"use client";

import { useState, useMemo } from "react";
import { MaterialCard } from "./MaterialCard";
import type { Material } from "../lib/queries";
import type { Locale } from "../lib/i18n";
import { isZhLocale } from "../lib/i18n";

const TYPES = ["guide", "ascension", "boss", "esper", "arc", "arc-exp", "module-exp", "currency"];

const TYPE_LABELS: Record<Locale, Record<string, string>> = {
  zh: {
    guide: "猎手指南",
    ascension: "角色突破",
    boss: "Boss掉落",
    esper: "异能材料",
    arc: "弧光突破",
    "arc-exp": "弧光经验",
    "module-exp": "模组经验",
    currency: "货币",
  },
  tw: {
    guide: "獵手指南",
    ascension: "角色突破",
    boss: "Boss掉落",
    esper: "異能材料",
    arc: "弧光突破",
    "arc-exp": "弧光經驗",
    "module-exp": "模組經驗",
    currency: "貨幣",
  },
  en: {
    guide: "Guide",
    ascension: "Ascension",
    boss: "Boss Drop",
    esper: "Esper",
    arc: "Arc Ascension",
    "arc-exp": "Arc EXP",
    "module-exp": "Module EXP",
    currency: "Currency",
  },
};

const RARITIES = [1, 2, 3, 4, 5];

interface MaterialFilterProps {
  materials: Material[];
  locale: Locale;
  lang: string;
}

export function MaterialFilter({ materials, locale }: MaterialFilterProps) {
  const [type, setType] = useState<string>("");
  const [rarity, setRarity] = useState<string>("");

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (type && m.type !== type) return false;
      if (rarity && m.rarity !== Number(rarity)) return false;
      return true;
    });
  }, [materials, type, rarity]);

  const hasFilters = type || rarity;

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Type Filter */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">{isZhLocale(locale) ? "全部类型" : "All Types"}</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[locale][t] || t}</option>
          ))}
        </select>

        {/* Rarity Filter */}
        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">{isZhLocale(locale) ? "全部稀有度" : "All Rarities"}</option>
          {RARITIES.map((r) => (
            <option key={r} value={r}>{"★".repeat(r)}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setType(""); setRarity(""); }}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isZhLocale(locale) ? "清除" : "Clear"}
          </button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} {isZhLocale(locale) ? "个材料" : "materials"}
      </p>

      {/* Material Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((m) => (
          <MaterialCard
            key={m.id}
            id={m.id}
            name={m.name}
            nameEn={m.nameEn}
            rarity={m.rarity}
            type={m.type}
            locale={locale}
            showType
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {isZhLocale(locale) ? "没有匹配的材料" : "No matching materials"}
        </div>
      )}
    </>
  );
}
