"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, isZhLocale, Locale } from "../../../../lib/i18n";
import {
  getAllCharacters,
  getCharacterMaterials,
  getMaterialById,
  calculateMaterials,
} from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";

export default function CalculatorPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const characters = getAllCharacters();
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(60);

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
    return getAllCharacters().find((c) => c.id === selectedCharacter) || null;
  }, [selectedCharacter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(lang, "calculator.title")}</h1>

      {/* Input Area */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Character Select */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {t(lang, "calculator.selectCharacter")}
            </label>
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">{t(lang, "calculator.selectCharacter")}</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>

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
    </div>
  );
}
