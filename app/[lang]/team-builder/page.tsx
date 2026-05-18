"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAllCharacters } from "../../../lib/queries";
import buildsData from "../../../data/builds.json";
import type { Character } from "../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import { t, isZhLocale, Locale } from "../../../lib/i18n";
import { GameImage } from "../../../components/GameImage";
import { Breadcrumb } from "../../../components/Breadcrumb";

interface BuildEntry {
  characterId: string;
  builds: {
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
  }[];
}

const builds = buildsData as BuildEntry[];

const TEAM_SIZE = 3;

type SynergyTag = {
  key: string;
  label: string;
  labelEn: string;
  type: "positive" | "neutral" | "negative";
};

function analyzeSynergy(team: Character[], isZh: boolean): SynergyTag[] {
  if (team.length < 2) return [];
  const tags: SynergyTag[] = [];
  const attrs = team.map((c) => c.attribute);
  const roles = team.map((c) => (isZh ? c.role : c.roleEn));
  const uniqueAttrs = new Set(attrs);

  // Same attribute resonance
  const attrCounts = new Map<string, number>();
  attrs.forEach((a) => attrCounts.set(a, (attrCounts.get(a) || 0) + 1));
  attrCounts.forEach((count, attr) => {
    if (count >= 2) {
      tags.push({
        key: `resonance-${attr}`,
        label: `${attr}属性共鸣 x${count}`,
        labelEn: `${attr} Resonance x${count}`,
        type: "positive",
      });
    }
  });

  // Role coverage
  const hasDPS = roles.some((r) => r?.includes("进攻") || r?.includes("Attack") || r?.includes("DPS"));
  const hasSupport = roles.some((r) => r?.includes("支援") || r?.includes("Support"));
  const hasDefense = roles.some((r) => r?.includes("防护") || r?.includes("Defense") || r?.includes("Survival"));

  if (hasDPS && hasSupport) {
    tags.push({
      key: "dps-support",
      label: "输出+支援组合",
      labelEn: "DPS + Support Combo",
      type: "positive",
    });
  }
  if (hasDPS && hasDefense) {
    tags.push({
      key: "dps-defense",
      label: "输出+防护组合",
      labelEn: "DPS + Survival Combo",
      type: "positive",
    });
  }

  // All same attribute
  if (uniqueAttrs.size === 1 && team.length === TEAM_SIZE) {
    tags.push({
      key: "mono",
      label: "纯色队",
      labelEn: "Mono-element Team",
      type: "neutral",
    });
  }

  // All DPS (no support/defense)
  if (hasDPS && !hasSupport && !hasDefense && team.length === TEAM_SIZE) {
    tags.push({
      key: "no-survival",
      label: "缺乏生存位",
      labelEn: "No Survival Slot",
      type: "negative",
    });
  }

  return tags;
}

function getRecommendedBuilds(teamIds: string[]): {
  characterId: string;
  buildName: string;
  buildNameEn: string;
  teamComp: string[];
  notes: string;
  notesEn: string;
}[] {
  return teamIds.flatMap((id) => {
    const entry = builds.find((b) => b.characterId === id);
    if (!entry) return [];
    return entry.builds.map((b) => ({
      characterId: id,
      buildName: b.name,
      buildNameEn: b.nameEn,
      teamComp: b.teamComp,
      notes: b.notes,
      notesEn: b.notesEn,
    }));
  });
}

export default function TeamBuilderPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8"><div className="animate-pulse h-8 bg-gray-800 rounded w-48 mb-4" /><div className="animate-pulse h-64 bg-gray-800/50 rounded" /></div>}>
      <TeamBuilderInner lang={lang} />
    </Suspense>
  );
}

function TeamBuilderInner({ lang }: { lang: string }) {
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const searchParams = useSearchParams();

  const allCharacters = useMemo(() => getAllCharacters(), []);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterRank, setFilterRank] = useState<string>("all");
  const [filterAttr, setFilterAttr] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Read ?team= from URL on mount
  useEffect(() => {
    const teamParam = searchParams.get("team");
    if (teamParam) {
      const ids = teamParam.split(",").filter((id) =>
        allCharacters.some((c) => c.id === id)
      );
      if (ids.length > 0) setSelectedIds(ids.slice(0, TEAM_SIZE));
    }
  }, [searchParams, allCharacters]);

  const filteredCharacters = useMemo(() => {
    return allCharacters.filter((c) => {
      if (filterRank !== "all" && c.rank !== filterRank) return false;
      if (filterAttr !== "all" && c.attribute !== filterAttr) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allCharacters, filterRank, filterAttr, searchQuery]);

  const teamCharacters = useMemo(
    () => selectedIds.map((id) => allCharacters.find((c) => c.id === id)!).filter(Boolean),
    [selectedIds, allCharacters]
  );

  const synergies = useMemo(() => analyzeSynergy(teamCharacters, isZh), [teamCharacters, isZh]);

  // Team viability grade
  const teamGrade = useMemo(() => {
    if (selectedIds.length < 2) return null;
    let score = 0;
    synergies.forEach((s) => {
      if (s.type === "positive") score += 2;
      else if (s.type === "negative") score -= 1;
      else score += 0;
    });
    // Full team bonus
    if (selectedIds.length === TEAM_SIZE) score += 1;
    // Balanced roles bonus
    const roles = teamCharacters.map((c) => (isZh ? c.role : c.roleEn));
    const hasDPS = roles.some((r) => r?.includes("进攻") || r?.includes("Attack") || r?.includes("DPS"));
    const hasSupport = roles.some((r) => r?.includes("支援") || r?.includes("Support"));
    const hasDefense = roles.some((r) => r?.includes("防护") || r?.includes("Defense") || r?.includes("Survival"));
    if (hasDPS && hasSupport && hasDefense) score += 1;
    if (score >= 5) return { grade: "S", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" };
    if (score >= 3) return { grade: "A", color: "text-purple-400 border-purple-400/30 bg-purple-400/10" };
    if (score >= 1) return { grade: "B", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" };
    return { grade: "C", color: "text-gray-400 border-gray-400/30 bg-gray-400/10" };
  }, [selectedIds, synergies, teamCharacters, isZh]);

  const recommendedBuilds = useMemo(
    () => (selectedIds.length > 0 ? getRecommendedBuilds(selectedIds) : []),
    [selectedIds]
  );

  const handleToggleCharacter = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= TEAM_SIZE) return prev;
      return [...prev, id];
    });
  };

  const handleRemoveFromTeam = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleClearTeam = () => setSelectedIds([]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/${lang}/team-builder?team=${selectedIds.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [lang, selectedIds]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(locale, "site.nav.home"), href: `/${lang}` },
          { label: t(locale, "teamBuilder.title") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {t(locale, "teamBuilder.title")}
        </h1>
        <p className="text-gray-400 mb-8">
          {t(locale, "teamBuilder.subtitle")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Slots */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">
              {t(locale, "teamBuilder.yourTeam")}
            </h2>
            <div className="space-y-3">
              {Array.from({ length: TEAM_SIZE }).map((_, i) => {
                const char = teamCharacters[i];
                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
                      char
                        ? "border-primary-500/50 bg-primary-500/5"
                        : "border-gray-800 bg-gray-900/30"
                    }`}
                  >
                    {char ? (
                      <div className="flex items-center gap-3">
                        <GameImage
                          type="character"
                          id={char.id}
                          name={char.name}
                          className="w-14 h-14 rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {isZh ? char.name : char.nameEn}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(
                                char.attribute
                              )}`}
                            >
                              {getAttributeLabel(char.attribute, locale)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {isZh ? char.role : char.roleEn}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromTeam(char.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          title={t(locale, "teamBuilder.remove")}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-600 py-4">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        <p className="text-xs">
                          {t(locale, "teamBuilder.slot")} {i + 1}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Synergy Analysis */}
            {synergies.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <h3 className="text-sm font-semibold mb-3">
                  {t(locale, "teamBuilder.synergy")}
                </h3>
                {teamGrade && (
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-3xl font-black px-4 py-2 rounded-xl border-2 ${teamGrade.color}`}>
                      {teamGrade.grade}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isZh ? "团队评级" : "Team Grade"}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {synergies.map((s) => (
                    <span
                      key={s.key}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        s.type === "positive"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : s.type === "negative"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {isZh ? s.label : s.labelEn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedIds.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {copied
                    ? (isZh ? "已复制!" : "Copied!")
                    : t(locale, "teamBuilder.shareTeam")}
                </button>
                <button
                  onClick={handleClearTeam}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-red-400/70 hover:text-red-400 text-sm transition-colors"
                >
                  {t(locale, "teamBuilder.clear")}
                </button>
              </div>
            )}

            {/* Recommended Builds */}
            {recommendedBuilds.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <h3 className="text-sm font-semibold mb-3">
                  {t(locale, "teamBuilder.recommendedBuilds")}
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recommendedBuilds.map((b, i) => {
                    const char = allCharacters.find(
                      (c) => c.id === b.characterId
                    );
                    return (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-800/50 bg-gray-800/30 p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-primary-400">
                            {char
                              ? isZh
                                ? char.name
                                : char.nameEn
                              : b.characterId}
                          </span>
                          <span className="text-xs text-gray-500">·</span>
                          <span className="text-xs font-medium">
                            {isZh ? b.buildName : b.buildNameEn}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {isZh ? b.notes : b.notesEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Character Selection */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {/* Rank Filter */}
              <div className="flex gap-1">
                {["all", "S", "A", "B"].map((rank) => (
                  <button
                    key={rank}
                    onClick={() => setFilterRank(rank)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      filterRank === rank
                        ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                        : "bg-gray-800 text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {rank === "all"
                      ? t(locale, "common.all")
                      : `${rank}${isZh ? "级" : "-Rank"}`}
                  </button>
                ))}
              </div>

              {/* Attribute Filter */}
              <div className="flex gap-1 flex-wrap">
                {["all", "cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"].map(
                  (attr) => (
                    <button
                      key={attr}
                      onClick={() => setFilterAttr(attr)}
                      className={`text-xs px-2 py-1.5 rounded-lg transition-colors ${
                        filterAttr === attr
                          ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                          : "bg-gray-800 text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {attr === "all"
                        ? t(locale, "common.all")
                        : getAttributeLabel(attr, locale)}
                    </button>
                  )
                )}
              </div>

              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(locale, "teamBuilder.searchPlaceholder")}
                className="flex-1 min-w-[120px] bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50"
              />
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredCharacters.map((c) => {
                const isSelected = selectedIds.includes(c.id);
                const isFull = selectedIds.length >= TEAM_SIZE && !isSelected;
                return (
                  <button
                    key={c.id}
                    onClick={() => !isFull && handleToggleCharacter(c.id)}
                    disabled={isFull}
                    className={`group relative rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30"
                        : isFull
                        ? "border-gray-800/50 bg-gray-900/20 opacity-40 cursor-not-allowed"
                        : "border-gray-800 bg-gray-900/50 hover:border-primary-500/50 hover:-translate-y-0.5"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {selectedIds.indexOf(c.id) + 1}
                      </span>
                    )}
                    <GameImage
                      type="character"
                      id={c.id}
                      name={c.name}
                      className="w-full aspect-square rounded-lg mb-2"
                    />
                    <p className="text-xs font-medium truncate">
                      {isZh ? c.name : c.nameEn}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${getAttributeColor(
                          c.attribute
                        )}`}
                      >
                        {getAttributeLabel(c.attribute, locale)}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          c.rank === "S" ? "text-yellow-400" : "text-blue-400"
                        }`}
                      >
                        {c.rank}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredCharacters.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                {t(locale, "common.noResults")}
              </div>
            )}
          </div>
        </div>

        {/* Preset Teams from builds.json */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">
            {t(locale, "teamBuilder.presetTeams")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {builds
              .filter((b) => b.builds.length > 0)
              .slice(0, 18)
              .map((entry) => {
                const build = entry.builds[0];
                const mainChar = allCharacters.find(
                  (c) => c.id === entry.characterId
                );
                if (!mainChar || !build) return null;
                const fullTeamIds = [
                  entry.characterId,
                  ...build.teamComp,
                ].slice(0, TEAM_SIZE);

                return (
                  <button
                    key={entry.characterId}
                    onClick={() => setSelectedIds(fullTeamIds)}
                    className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-left hover:border-primary-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getAttributeColor(
                          mainChar.attribute
                        )}`}
                      >
                        {getAttributeLabel(mainChar.attribute, locale)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {isZh ? build.name : build.nameEn}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {fullTeamIds.map((id) => {
                        const char = allCharacters.find((c) => c.id === id);
                        if (!char) return null;
                        return (
                          <Link
                            key={id}
                            href={`/${lang}/characters/${id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center gap-1"
                          >
                            <GameImage
                              type="character"
                              id={char.id}
                              name={char.name}
                              className="w-12 h-12 rounded-lg"
                            />
                            <span className="text-[10px] text-gray-400 truncate max-w-[60px]">
                              {isZh ? char.name : char.nameEn}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                      {isZh ? build.notes : build.notesEn}
                    </p>
                  </button>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}
