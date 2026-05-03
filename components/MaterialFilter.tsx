"use client";

import { useState, useMemo } from "react";
import { MaterialCard } from "./MaterialCard";
import type { Material } from "../lib/queries";
import { t, type Locale } from "../lib/i18n";

const TYPES = ["guide", "ascension", "boss", "esper", "arc", "arc-exp", "module-exp", "currency"];

const TYPE_I18N_KEYS: Record<string, string> = {
  guide: "materialTypes.hunterGuide",
  ascension: "materialTypes.ascension",
  boss: "materialTypes.bossDrop",
  esper: "materialTypes.esper",
  arc: "materialTypes.arcAscension",
  "arc-exp": "materialTypes.arcExp",
  "module-exp": "materialTypes.moduleExp",
  currency: "materialTypes.currency",
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
            {t(locale, "common.all")}
          </button>
          {TYPES.map((typeKey) => (
            <button
              key={typeKey}
              onClick={() => setType(type === typeKey ? "" : typeKey)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                type === typeKey
                  ? "bg-primary-500/20 text-primary-400 border-primary-500/30"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              {TYPE_I18N_KEYS[typeKey] ? t(locale, TYPE_I18N_KEYS[typeKey]) : typeKey}
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
            {t(locale, "filter.allRarities")}
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
        {filtered.length} {t(locale, "filter.materialsCount")}
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
          {t(locale, "filter.noMatchingMaterials")}
        </div>
      )}
    </>
  );
}
