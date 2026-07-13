"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Character, Skill } from "../../../lib/queries";
import { getAttributeColor, getAttributeLabel } from "../../../lib/attributes";
import { t, isZhLocale, type Locale } from "../../../lib/i18n";
import { GameImage } from "../../../components/GameImage";
import { Breadcrumb } from "../../../components/Breadcrumb";

const MAX_COMPARE = 3;

type StatRow = {
  label: string;
  getValue: (c: Character, isZh: boolean, lang: Locale) => string;
};

const STAT_ROWS: StatRow[] = [
  { label: "Rank", getValue: (c) => c.rank },
  { label: "Role", getValue: (c, isZh) => isZh ? c.role : c.roleEn },
  { label: "Attribute", getValue: (c, _, lang) => getAttributeLabel(c.attribute, lang) },
  { label: "Tier", getValue: (c) => c.tierRank || "—" },
  { label: "Weapon Type", getValue: (c, isZh) => isZh ? c.weapon : c.weaponEn },
  { label: "Signature Arc", getValue: (c) => {
    return c.signatureArc || "—";
  }},
  { label: "Skill", getValue: (c, isZh) => {
    const s = c.skills?.skill;
    return s ? (isZh ? s.name : s.nameEn) : "—";
  }},
  { label: "Ultimate", getValue: (c, isZh) => {
    const s = c.skills?.ultimate;
    return s ? (isZh ? s.name : s.nameEn) : "—";
  }},
  { label: "Skill CD", getValue: (c) => c.skills?.skill?.cooldown || "—" },
  { label: "Skill Cost", getValue: (c) => c.skills?.skill?.cost || "—" },
  { label: "Best Weapon", getValue: (c, isZh) => {
    const b = c.recommendedBuild;
    return b ? (isZh ? b.bestWeapon : b.bestWeaponEn) : "—";
  }},
  { label: "Best Disk Set", getValue: (c, isZh) => {
    const b = c.recommendedBuild;
    return b ? (isZh ? b.bestDiskSet : b.bestDiskSetEn) : "—";
  }},
  { label: "Sub Stat Priority", getValue: (c, isZh) => {
    const b = c.recommendedBuild;
    return b ? (isZh ? b.subStatPriority : b.subStatPriorityEn).join(" > ") : "—";
  }},
  { label: "Acquisition", getValue: (c, isZh) => {
    if (!c.acquisitionMethod) return "—";
    return isZh ? c.acquisitionMethod : c.acquisitionMethod;
  }},
];

interface CompareCharactersClientProps {
  lang: Locale;
  characters: Character[];
}

export function CompareCharactersClient({ lang, characters }: CompareCharactersClientProps) {
  const isZh = isZhLocale(lang);

  const allCharacters = useMemo(() => characters, [characters]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedChars = useMemo(
    () => selectedIds.map((id) => allCharacters.find((c) => c.id === id)!).filter(Boolean),
    [selectedIds, allCharacters]
  );

  const toggleCharacter = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const availableChars = useMemo(() => {
    const selected = new Set(selectedIds);
    return allCharacters.filter((c) => {
      if (selected.has(c.id)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allCharacters, selectedIds, searchQuery]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(lang, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "角色对比" : "Character Compare" },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? "角色对比" : "Character Compare"}
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          {isZh
            ? `选择最多 ${MAX_COMPARE} 个角色并排对比属性、技能和配装。`
            : `Compare up to ${MAX_COMPARE} characters side by side — stats, skills, and builds.`}
        </p>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh ? "什么时候最该用角色对比？" : "When should you use character compare?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZh
              ? "这个页面最适合在抽卡前后做决定：比如你刚抽到一个新角色，想知道他到底能不能替掉当前主队里的位置，或者你手上有两个同定位角色，不确定该先养谁。把角色放到同一张表里看，通常比来回切多个详情页更容易发现差异。"
              : "This page is most useful before and after pulls: when you need to know whether a new unit can replace an existing slot, or when two characters fill similar roles and you have to choose who deserves investment first. Seeing them on one table makes trade-offs much easier to spot."}
          </p>
        </section>

        {/* Character selector */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold">{isZh ? "选择角色" : "Select Characters"}</span>
            <span className="text-xs text-gray-500">({selectedIds.length}/{MAX_COMPARE})</span>
            <div className="flex-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isZh ? "搜索角色..." : "Search..."}
              className="w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary-500/50"
            />
          </div>

          {/* Selected characters */}
          {selectedChars.length > 0 && (
            <div className="flex gap-3 mb-3">
              {selectedChars.map((c) => (
                <div key={c.id} className="flex items-center gap-2 rounded-lg border border-primary-500/30 bg-primary-500/5 px-3 py-2">
                  <GameImage type="character" id={c.id} name={c.name} className="w-8 h-8 rounded" />
                  <span className="text-xs font-medium">{isZh ? c.name : c.nameEn}</span>
                  <button
                    onClick={() => toggleCharacter(c.id)}
                    className="text-gray-400 hover:text-red-400 ml-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: MAX_COMPARE - selectedChars.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-700 px-3 py-2 min-w-[80px]">
                  <span className="text-xs text-gray-600">{isZh ? `角色 ${selectedChars.length + i + 1}` : `Char ${selectedChars.length + i + 1}`}</span>
                </div>
              ))}
            </div>
          )}

          {/* Character grid */}
          {selectedIds.length < MAX_COMPARE && (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {availableChars.slice(0, 24).map((c) => (
                <button
                  key={c.id}
                  onClick={() => { toggleCharacter(c.id); setSearchQuery(""); }}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-primary-500/30 transition-colors"
                >
                  <GameImage type="character" id={c.id} name={c.name} className="w-8 h-8 rounded" />
                  <span className="text-[9px] text-gray-400 truncate w-full text-center">
                    {isZh ? c.name : c.nameEn}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison table */}
        {selectedChars.length >= 2 && (
          <>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            {/* Header row */}
            <div className="grid border-b border-gray-800 bg-gray-900" style={{ gridTemplateColumns: `160px repeat(${selectedChars.length}, 1fr)` }}>
              <div className="px-4 py-3 text-xs text-gray-500 font-medium">
                {isZh ? "属性" : "Stat"}
              </div>
              {selectedChars.map((c) => (
                <div key={c.id} className="px-3 py-3 text-center">
                  <Link href={`/${lang}/characters/${c.id}`} className="hover:text-primary-400 transition-colors">
                    <GameImage type="character" id={c.id} name={c.name} className="w-12 h-12 rounded-lg mx-auto mb-1" />
                    <p className="text-xs font-medium truncate">{isZh ? c.name : c.nameEn}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getAttributeColor(c.attribute)}`}>
                      {getAttributeLabel(c.attribute, lang)}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Stat rows */}
            {STAT_ROWS.map((row, idx) => (
              <div
                key={row.label}
                className={`grid border-b border-gray-800/50 ${idx % 2 === 0 ? "bg-gray-900/30" : ""}`}
                style={{ gridTemplateColumns: `160px repeat(${selectedChars.length}, 1fr)` }}
              >
                <div className="px-4 py-2.5 text-xs text-gray-500 shrink-0">
                  {row.label}
                </div>
                {selectedChars.map((c) => (
                  <div key={c.id} className="px-3 py-2.5 text-xs text-gray-300 text-center">
                    {row.getValue(c, isZh, lang)}
                  </div>
                ))}
              </div>
            ))}

            {/* Skill descriptions */}
            {(["skill", "ultimate"] as const).map((skillKey) => (
              <div key={skillKey}>
                <div className="grid border-b border-gray-800/50 bg-gray-900/50" style={{ gridTemplateColumns: `160px repeat(${selectedChars.length}, 1fr)` }}>
                  <div className="px-4 py-2.5 text-xs text-primary-400 font-medium">
                    {skillKey === "skill" ? (isZh ? "技能描述" : "Skill Desc") : (isZh ? "终结技描述" : "Ultimate Desc")}
                  </div>
                  {selectedChars.map((c) => {
                    const s = c.skills?.[skillKey] as Skill | undefined;
                    return (
                      <div key={c.id} className="px-3 py-2.5 text-[11px] text-gray-400 leading-relaxed">
                        {s ? (isZh ? s.description : s.descriptionEn) : "—"}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Team comps */}
            <div className="grid border-b border-gray-800/50" style={{ gridTemplateColumns: `160px repeat(${selectedChars.length}, 1fr)` }}>
              <div className="px-4 py-2.5 text-xs text-gray-500">
                {isZh ? "推荐队伍" : "Teams"}
              </div>
              {selectedChars.map((c) => (
                <div key={c.id} className="px-3 py-2.5 text-[11px] text-gray-400">
                  {c.teamComps && c.teamComps.length > 0
                    ? c.teamComps.slice(0, 2).map((tc) => (
                      <div key={tc.name} className="mb-1">
                        <span className="text-gray-300">{isZh ? tc.name : tc.nameEn}</span>
                        <span className="text-gray-500 ml-1">({tc.members.join(", ")})</span>
                      </div>
                    ))
                    : "—"}
                </div>
              ))}
            </div>
          </div>

          <section className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
              <h2 className="text-base font-semibold text-white">
                {isZh ? "对比时先看这三项" : "Start with these three checks"}
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                <li>{isZh ? "先确认他们是否真的在争同一个位置，而不是一个主 C 一个副 C 硬比。" : "Make sure they are actually competing for the same slot before comparing them."}</li>
                <li>{isZh ? "再看武器和套装门槛，养成成本往往比纸面强度更影响实战。" : "Then compare weapon and set requirements, because build cost often changes practical value."}</li>
                <li>{isZh ? "最后看推荐队友，很多差距其实来自协同门槛而不是单卡面板。" : "Finish with team requirements, since many gaps come from synergy demands rather than raw stats."}</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
              <h2 className="text-base font-semibold text-white">
                {isZh ? "常见误判" : "Common misreads"}
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
                <li>{isZh ? "当前版本热度高，不等于一定更适合你的账号。" : "Current meta popularity does not always equal account-specific value."}</li>
                <li>{isZh ? "只看一个技能描述很容易偏差，循环和覆盖率也要一起看。" : "Comparing one skill in isolation misses rotation and coverage context."}</li>
                <li>{isZh ? "零氪和微氪账号更该看成型成本，而不只是理论上限。" : "F2P and light-spend accounts should care about setup cost, not just ceiling."}</li>
              </ul>
            </div>
          </section>
          </>
        )}

        {selectedChars.length < 2 && (
          <div className="text-center py-16 text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="18" rx="1" />
              <rect x="14" y="3" width="7" height="18" rx="1" />
            </svg>
            <p className="text-sm">{isZh ? "选择至少 2 个角色开始对比" : "Select at least 2 characters to compare"}</p>
          </div>
        )}
      </div>
    </>
  );
}
