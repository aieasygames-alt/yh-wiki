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

  return (
    <>
      {/* Filter Bar — pill buttons */}
      <div className="space-y-3 mb-6">
        {/* Type filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setType("")}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              !type ? "bg-primary-500/20 text-primary-400 border-primary-500/30" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {isZhLocale(locale) ? "全部" : "All"}
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(type === t ? "" : t)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                type === t
                  ? "bg-primary-500/20 text-primary-400 border-primary-500/30"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              {TYPE_LABELS[locale][t] || t}
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setRarity("")}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              !rarity ? "bg-primary-500/20 text-primary-400 border-primary-500/30" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {isZhLocale(locale) ? "全部稀有度" : "All Rarities"}
          </button>
          {RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => setRarity(rarity === String(r) ? "" : String(r))}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                rarity === String(r)
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              {"★".repeat(r)}
            </button>
          ))}
        </div>
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
