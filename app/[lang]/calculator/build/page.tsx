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
import { getAttributeColor, getAttributeLabel, ATTRIBUTE_LABELS } from "../../../../lib/attributes";
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

const RANK_ORDER = ["S", "A", "B"];
const RANK_COLORS: Record<string, string> = {
  S: "border-yellow-500/40 bg-yellow-500/10 hover:border-yellow-400/60",
  A: "border-blue-500/40 bg-blue-500/10 hover:border-blue-400/60",
  B: "border-gray-600 bg-gray-800/50 hover:border-gray-500",
};

export default function BuildCalculatorPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const characters = getAllCharacters();
  const weapons = getAllWeapons();
  const builds = buildsData as CharacterBuild[];

  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [activeBuildIdx, setActiveBuildIdx] = useState(0);
  const [filterAttribute, setFilterAttribute] = useState("");
  const [filterRank, setFilterRank] = useState("");

  const selectedBuilds = useMemo(() => {
    if (!selectedCharacter) return null;
    return builds.find((b) => b.characterId === selectedCharacter)?.builds || null;
  }, [selectedCharacter]);

  const selectedChar = useMemo(() => {
    if (!selectedCharacter) return null;
    return characters.find((c) => c.id === selectedCharacter) || null;
  }, [selectedCharacter]);

  const activeBuild = useMemo(() => {
    if (!selectedBuilds) return null;
    return selectedBuilds[Math.min(activeBuildIdx, selectedBuilds.length - 1)];
  }, [selectedBuilds, activeBuildIdx]);

  const levelingMaterials = useMemo(() => {
    if (!selectedCharacter) return null;
    return calculateMaterials(selectedCharacter, 1, 60);
  }, [selectedCharacter]);

  const skillMaterials = useMemo(() => {
    if (!selectedCharacter) return null;
    return getCharacterMaterials(selectedCharacter)?.skillMaterials || null;
  }, [selectedCharacter]);

  const charactersWithBuilds = useMemo(() => {
    const buildCharIds = new Set(builds.map((b) => b.characterId));
    return characters.filter((c) => buildCharIds.has(c.id));
  }, [characters, builds]);

  const filteredCharacters = useMemo(() => {
    let list = charactersWithBuilds;
    if (filterAttribute) list = list.filter((c) => c.attribute === filterAttribute);
    if (filterRank) list = list.filter((c) => c.rank === filterRank);
    return list;
  }, [charactersWithBuilds, filterAttribute, filterRank]);

  const attributes = Object.keys(ATTRIBUTE_LABELS);

  const handleSelectCharacter = (charId: string) => {
    setSelectedCharacter(charId);
    setActiveBuildIdx(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(lang, "buildCalculator.title")}</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterAttribute("")}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            !filterAttribute ? "bg-primary-500/20 text-primary-400 border-primary-500/30" : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
          }`}
        >
          {t(lang, "buildCalculator.allAttributes")}
        </button>
        {attributes.map((attr) => (
          <button
            key={attr}
            onClick={() => setFilterAttribute(filterAttribute === attr ? "" : attr)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${getAttributeColor(attr)} ${
              filterAttribute === attr ? "ring-1 ring-white/20" : ""
            }`}
          >
            {getAttributeLabel(attr, lang)}
          </button>
        ))}
        <span className="text-gray-600 mx-1">|</span>
        {RANK_ORDER.map((rank) => (
          <button
            key={rank}
            onClick={() => setFilterRank(filterRank === rank ? "" : rank)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              filterRank === rank
                ? rank === "S"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
            }`}
          >
            {rank}
          </button>
        ))}
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-8">
        {filteredCharacters.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCharacter(c.id)}
            className={`relative rounded-lg border p-1 transition-all ${RANK_COLORS[c.rank] || RANK_COLORS.B} ${
              selectedCharacter === c.id ? "ring-2 ring-primary-400 scale-105" : ""
            }`}
          >
            <div className="aspect-square rounded overflow-hidden bg-gray-900">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">{c.name[0]}</span>
              </div>
            </div>
            <p className="text-[10px] truncate mt-1">{c.name}</p>
            {c.rank === "S" && (
              <span className="absolute top-0.5 right-0.5 text-[8px] text-yellow-400 font-bold">S</span>
            )}
          </button>
        ))}
      </div>

      {/* Build Display */}
      {selectedBuilds && selectedBuilds.length > 0 && activeBuild ? (
        <div className="space-y-6">
          {/* Build Tabs */}
          {selectedBuilds.length > 1 && (
            <div className="flex gap-2">
              {selectedBuilds.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBuildIdx(i)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    i === activeBuildIdx
                      ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                      : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {lang === "zh" ? b.name : b.nameEn}
                </button>
              ))}
            </div>
          )}

          {/* Character Info Bar */}
          {selectedChar && (
            <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center text-2xl">
                {selectedChar.name[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold">{selectedChar.name} <span className="text-gray-500 text-sm">{selectedChar.nameEn}</span></h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(selectedChar.attribute)}`}>
                    {getAttributeLabel(selectedChar.attribute, lang)}
                  </span>
                  <span className={`text-xs font-bold ${selectedChar.rank === "S" ? "text-yellow-400" : "text-blue-400"}`}>
                    {selectedChar.rank}-Rank
                  </span>
                  <span className="text-xs text-gray-500">
                    {lang === "zh" ? selectedChar.role : selectedChar.roleEn}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Build Details */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-xl font-bold mb-2">
              {lang === "zh" ? activeBuild.name : activeBuild.nameEn}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {lang === "zh" ? activeBuild.description : activeBuild.descriptionEn}
            </p>

            {/* Stats Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Main Stat */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">{t(lang, "buildCalculator.mainStat")}</h4>
                <div className="rounded-lg bg-primary-500/10 border border-primary-500/20 px-4 py-3">
                  <p className="text-primary-400 font-bold text-lg">{lang === "zh" ? activeBuild.mainStat : activeBuild.mainStatEn}</p>
                </div>
              </div>

              {/* Sub Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">{t(lang, "buildCalculator.subStats")}</h4>
                <div className="space-y-1.5">
                  {(lang === "zh" ? activeBuild.subStats : activeBuild.subStatsEn).map((stat, i) => {
                    const colors = [
                      "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                      "bg-blue-500/10 border-blue-500/20 text-blue-400",
                      "bg-gray-700/30 border-gray-600/20 text-gray-400",
                      "bg-gray-700/30 border-gray-600/20 text-gray-500",
                    ];
                    const labels = [t(lang, "buildCalculator.priority1"), t(lang, "buildCalculator.priority2"), t(lang, "buildCalculator.priority3"), t(lang, "buildCalculator.priority4")];
                    return (
                      <div key={stat} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${colors[i] || colors[3]}`}>
                        <span className="text-sm">{stat}</span>
                        <span className="text-xs opacity-60">{labels[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Weapons */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">{t(lang, "buildCalculator.recommendedWeapons")}</h4>
                <div className="space-y-2">
                  {activeBuild.recommendedWeapons.map((wId) => {
                    const weapon = weapons.find((w) => w.id === wId);
                    return weapon ? (
                      <Link
                        key={wId}
                        href={`/${lang}/weapons/${wId}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 hover:border-primary-500/50 hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-lg">{weapon.name[0]}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{lang === "zh" ? weapon.name : weapon.nameEn}</p>
                          <p className="text-xs text-gray-500">{lang === "zh" ? weapon.type : weapon.typeEn}</p>
                        </div>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Team Comp */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">{t(lang, "buildCalculator.teamComp")}</h4>
                <div className="space-y-2">
                  {activeBuild.teamComp.map((cId) => {
                    const char = characters.find((c) => c.id === cId);
                    return char ? (
                      <Link
                        key={cId}
                        href={`/${lang}/characters/${cId}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2.5 hover:border-primary-500/50 hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-lg">{char.name[0]}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{char.name} <span className="text-gray-500">{char.nameEn}</span></p>
                          <span className={`text-xs px-1.5 py-0.5 rounded border ${getAttributeColor(char.attribute)}`}>
                            {getAttributeLabel(char.attribute, lang)}
                          </span>
                        </div>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                {lang === "zh" ? activeBuild.notes : activeBuild.notesEn}
              </p>
            </div>
          </div>

          {/* Material Summary */}
          {(levelingMaterials || skillMaterials) && (
            <div>
              <h2 className="text-xl font-bold mb-4">{t(lang, "buildCalculator.materialSummary")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {levelingMaterials && levelingMaterials.length > 0 && (
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-800 bg-gray-900">
                      <h3 className="text-sm font-medium text-gray-300">{t(lang, "calculator.levelingNote")}</h3>
                    </div>
                    <div className="divide-y divide-gray-800/50">
                      {levelingMaterials.map((r) => {
                        const material = getMaterialById(r.materialId);
                        if (!material) return null;
                        return (
                          <div key={r.materialId} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30">
                            <Link href={`/${lang}/materials/${r.materialId}`} className="text-sm hover:text-primary-400 transition-colors">
                              {lang === "zh" ? material.name : material.nameEn}
                            </Link>
                            <span className="font-mono text-primary-400 text-sm">x{r.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {skillMaterials && skillMaterials.length > 0 && (
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-800 bg-gray-900">
                      <h3 className="text-sm font-medium text-gray-300">{t(lang, "calculator.skillMaterialsNote")}</h3>
                    </div>
                    <div className="divide-y divide-gray-800/50">
                      {skillMaterials.map((m) => {
                        const material = getMaterialById(m.id);
                        if (!material) return null;
                        return (
                          <div key={m.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30">
                            <Link href={`/${lang}/materials/${m.id}`} className="text-sm hover:text-primary-400 transition-colors">
                              {lang === "zh" ? material.name : material.nameEn}
                            </Link>
                            <span className="font-mono text-primary-400 text-sm">x{m.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href={`/${lang}/calculator/leveling`}
                className="inline-block mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                {t(lang, "buildCalculator.openLevelingCalc")}
              </Link>
            </div>
          )}
        </div>
      ) : selectedCharacter ? (
        <p className="text-gray-500 text-center py-8">{t(lang, "buildCalculator.noBuild")}</p>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">{t(lang, "buildCalculator.selectHint")}</p>
          <p className="text-sm">{t(lang, "buildCalculator.filterHint")}</p>
        </div>
      )}
    </div>
  );
}
