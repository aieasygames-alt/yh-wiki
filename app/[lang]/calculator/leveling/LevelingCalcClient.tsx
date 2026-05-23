"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, isZhLocale, Locale } from "../../../../lib/i18n";
import {
  getAvailableCharacters,
  getCharacterMaterials,
  getMaterialById,
  calculateMaterials,
} from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { GameImage } from "../../../../components/GameImage";
import { KardzPromoCard } from "../../../../components/KardzPromoCard";

export function LevelingCalcClient() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;
  const zh = isZhLocale(lang);

  const characters = getAvailableCharacters();
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(60);
  const [filterRank, setFilterRank] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const result = useMemo(() => {
    if (!selectedCharacter) return null;
    return calculateMaterials(selectedCharacter, currentLevel, targetLevel);
  }, [selectedCharacter, currentLevel, targetLevel]);

  const skillMaterials = useMemo(() => {
    if (!selectedCharacter) return null;
    return getCharacterMaterials(selectedCharacter)?.skillMaterials || null;
  }, [selectedCharacter]);

  const selectedChar = useMemo(() => {
    if (!selectedCharacter) return null;
    return getAvailableCharacters().find((c) => c.id === selectedCharacter) || null;
  }, [selectedCharacter]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      if (filterRank && c.rank !== filterRank) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q);
      }
      return true;
    });
  }, [characters, filterRank, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(lang, "calculator.title")}</h1>

      {/* Character Selection */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 mb-6">
        {/* Rank filter + search */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            onClick={() => setFilterRank("")}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              !filterRank ? "bg-primary-500/20 text-primary-400 border-primary-500/30" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {t(lang, "common.all")}
          </button>
          {(["S", "A"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRank(filterRank === r ? "" : r)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filterRank === r
                  ? r === "S" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              {r}
            </button>
          ))}
          <div className="flex-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(lang, "calculator.selectCharacter")}
            className="w-40 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Character grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredCharacters.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCharacter(c.id)}
              className={`relative flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                selectedCharacter === c.id
                  ? c.rank === "S"
                    ? "bg-yellow-500/15 border-yellow-500/40 ring-1 ring-yellow-400/30"
                    : "bg-purple-500/15 border-purple-500/40 ring-1 ring-purple-400/30"
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-600"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg overflow-hidden ${c.rank === "S" ? "ring-1 ring-yellow-400/30" : ""}`}>
                <GameImage type="character" id={c.id} name={c.name} src={c.image} />
              </div>
              <span className="text-[9px] text-gray-400 truncate w-full text-center leading-tight">
                {zh ? c.name : c.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Level inputs + selected character info */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Current Level */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {t(lang, "calculator.currentLevel")}
            </label>
            <input
              type="number"
              min={1}
              max={59}
              value={currentLevel}
              onChange={(e) =>
                setCurrentLevel(Math.min(59, Math.max(1, Number(e.target.value))))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Target Level */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {t(lang, "calculator.targetLevel")}
            </label>
            <input
              type="number"
              min={2}
              max={60}
              value={targetLevel}
              onChange={(e) =>
                setTargetLevel(Math.min(60, Math.max(2, Number(e.target.value))))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Selected character info */}
        {selectedChar && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <span
              className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(selectedChar.attribute)}`}
            >
              {getAttributeLabel(selectedChar.attribute, lang)}
            </span>
            <span className={`text-xs font-bold ${selectedChar.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
              {selectedChar.rank}-rank
            </span>
            {selectedChar.weaponEn !== "TBD" && (
              <span className="text-xs text-gray-500">
                {isZhLocale(lang) ? selectedChar.weapon : selectedChar.weaponEn}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {selectedCharacter && result && (
        <div>
          {/* Leveling Materials */}
          {result.length > 0 ? (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">{t(lang, "calculator.levelingNote")}</h2>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900">
                      <th className="text-left text-sm text-gray-400 px-4 py-3">
                        {t(lang, "calculator.material")}
                      </th>
                      <th className="text-right text-sm text-gray-400 px-4 py-3">
                        {t(lang, "calculator.quantity")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((r) => {
                      const material = getMaterialById(r.materialId);
                      if (!material) return null;
                      return (
                        <tr
                          key={r.materialId}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/${lang}/materials/${r.materialId}`}
                              className="text-sm hover:text-primary-400 transition-colors"
                            >
                              {isZhLocale(lang) ? material.name : material.nameEn}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-primary-400">
                            x{r.quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <p className="text-gray-500 text-center py-8">{t(lang, "calculator.noResult")}</p>
          )}

          {/* Skill Materials */}
          {skillMaterials && skillMaterials.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">{t(lang, "calculator.skillMaterialsNote")}</h2>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900">
                      <th className="text-left text-sm text-gray-400 px-4 py-3">
                        {t(lang, "calculator.material")}
                      </th>
                      <th className="text-right text-sm text-gray-400 px-4 py-3">
                        {t(lang, "calculator.quantity")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillMaterials.map((m) => {
                      const material = getMaterialById(m.id);
                      if (!material) return null;
                      return (
                        <tr
                          key={m.id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="px-4 py-3">
                            <Link
                              href={`/${lang}/materials/${m.id}`}
                              className="text-sm hover:text-primary-400 transition-colors"
                            >
                              {isZhLocale(lang) ? material.name : material.nameEn}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-primary-400">
                            x{m.quantity}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      {!selectedCharacter && (
        <div className="text-center py-16 text-gray-500">
          <p>{t(lang, "calculator.noResult")}</p>
        </div>
      )}

      <div className="mt-8">
        <KardzPromoCard locale={lang} variant="banner" />
      </div>
    </div>
  );
}
