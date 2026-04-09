"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, type Locale } from "../../../../lib/i18n";
import {
  getAllCharacters,
  getCharacterMaterials,
  getMaterialById,
  calculateMaterials,
  getAllWeapons,
} from "../../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import buildsData from "../../../../data/builds.json";

interface Build {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  mainStat: string;
  mainStatEn: string;
  subStats: string[];
  subStatsEn: string[];
  recommendedWeapons: string[];
  teamComp: string[];
  notes: string;
  notesEn: string;
}

interface CharacterBuild {
  characterId: string;
  builds: Build[];
}

export default function BuildCalculatorPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const characters = getAllCharacters();
  const weapons = getAllWeapons();
  const builds = buildsData as CharacterBuild[];
  const [selectedCharacter, setSelectedCharacter] = useState("");

  const selectedBuilds = useMemo(() => {
    if (!selectedCharacter) return null;
    return builds.find((b) => b.characterId === selectedCharacter)?.builds || null;
  }, [selectedCharacter]);

  const selectedChar = useMemo(() => {
    if (!selectedCharacter) return null;
    return characters.find((c) => c.id === selectedCharacter) || null;
  }, [selectedCharacter]);

  const levelingMaterials = useMemo(() => {
    if (!selectedCharacter) return null;
    return calculateMaterials(selectedCharacter, 1, 60);
  }, [selectedCharacter]);

  const skillMaterials = useMemo(() => {
    if (!selectedCharacter) return null;
    return getCharacterMaterials(selectedCharacter)?.skillMaterials || null;
  }, [selectedCharacter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(lang, "buildCalculator.title")}</h1>

      {/* Character Select */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-sm text-gray-400 mb-2">
              {t(lang, "buildCalculator.selectCharacter")}
            </label>
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">{t(lang, "buildCalculator.selectCharacter")}</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nameEn}) - {lang === "zh" ? c.role : c.roleEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedChar && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800 mt-4">
            <span
              className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(selectedChar.attribute)}`}
            >
              {getAttributeLabel(selectedChar.attribute, lang)}
            </span>
            <span className={`text-xs font-bold ${selectedChar.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
              {selectedChar.rank}-rank
            </span>
            <span className="text-xs text-gray-500">
              {lang === "zh" ? selectedChar.role : selectedChar.roleEn}
            </span>
          </div>
        )}
      </div>

      {/* Build Recommendations */}
      {selectedBuilds && selectedBuilds.length > 0 ? (
        <div className="space-y-6">
          {selectedBuilds.map((build) => (
            <div
              key={build.id}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
            >
              <h2 className="text-xl font-bold mb-2">
                {lang === "zh" ? build.name : build.nameEn}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {lang === "zh" ? build.description : build.descriptionEn}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Main Stat */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    {t(lang, "buildCalculator.mainStat")}
                  </h3>
                  <p className="text-primary-400 font-medium">
                    {lang === "zh" ? build.mainStat : build.mainStatEn}
                  </p>
                </div>

                {/* Sub Stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    {t(lang, "buildCalculator.subStats")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "zh" ? build.subStats : build.subStatsEn).map((stat, i) => (
                      <span
                        key={stat}
                        className={`text-xs px-2 py-1 rounded ${
                          i === 0
                            ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                            : i === 1
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                        }`}
                      >
                        {i + 1}. {stat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Weapons */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    {t(lang, "buildCalculator.recommendedWeapons")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {build.recommendedWeapons.map((wId) => {
                      const weapon = weapons.find((w) => w.id === wId);
                      return weapon ? (
                        <Link
                          key={wId}
                          href={`/${lang}/weapons/${wId}`}
                          className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:border-primary-500/50 hover:text-primary-400 transition-colors"
                        >
                          {lang === "zh" ? weapon.name : weapon.nameEn}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Team Comp */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    {t(lang, "buildCalculator.teamComp")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {build.teamComp.map((cId) => {
                      const char = characters.find((c) => c.id === cId);
                      return char ? (
                        <Link
                          key={cId}
                          href={`/${lang}/characters/${cId}`}
                          className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:border-primary-500/50 hover:text-primary-400 transition-colors"
                        >
                          {char.name} ({char.nameEn})
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  {lang === "zh" ? build.notes : build.notesEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : selectedCharacter ? (
        <p className="text-gray-500 text-center py-8">
          {t(lang, "buildCalculator.noBuild")}
        </p>
      ) : null}

      {/* Material Summary */}
      {selectedCharacter && (levelingMaterials || skillMaterials) && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">{t(lang, "buildCalculator.materialSummary")}</h2>

          {levelingMaterials && levelingMaterials.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                {t(lang, "calculator.levelingNote")}
              </h3>
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
                    {levelingMaterials.map((r) => {
                      const material = getMaterialById(r.materialId);
                      if (!material) return null;
                      return (
                        <tr key={r.materialId} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3">
                            <Link href={`/${lang}/materials/${r.materialId}`} className="text-sm hover:text-primary-400 transition-colors">
                              {lang === "zh" ? material.name : material.nameEn}
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
          )}

          {skillMaterials && skillMaterials.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">
                {t(lang, "calculator.skillMaterialsNote")}
              </h3>
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
                        <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3">
                            <Link href={`/${lang}/materials/${m.id}`} className="text-sm hover:text-primary-400 transition-colors">
                              {lang === "zh" ? material.name : material.nameEn}
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

          <Link
            href={`/${lang}/calculator/leveling`}
            className="inline-block text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            {t(lang, "buildCalculator.openLevelingCalc")}
          </Link>
        </div>
      )}

      {!selectedCharacter && (
        <div className="text-center py-16 text-gray-500">
          <p>{t(lang, "buildCalculator.selectHint")}</p>
        </div>
      )}
    </div>
  );
}
