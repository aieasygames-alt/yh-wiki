"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, isZhLocale, type Locale } from "../../../../lib/i18n";
import { getAttributeColor, getAttributeLabel } from "../../../../lib/attributes";
import { GameImage } from "../../../../components/GameImage";
import { Breadcrumb } from "../../../../components/Breadcrumb";

const STORAGE_KEY = "nte-material-planner";

type PlannerCharacter = {
  id: string;
  name: string;
  nameEn: string;
  attribute: string;
};

type PlannerMaterial = {
  id: string;
  name: string;
  nameEn: string;
  rarity: number;
};

type MaterialEntry = {
  id: string;
  quantity: number;
};

type LevelRange = {
  levelRange: string;
  materials: MaterialEntry[];
};

type CharacterMaterials = {
  levelingMaterials: LevelRange[];
  skillMaterials: MaterialEntry[];
};

interface MaterialPlannerClientProps {
  characters: PlannerCharacter[];
  materialsById: Record<string, PlannerMaterial>;
  characterMaterialsById: Record<string, CharacterMaterials>;
}

type PlanEntry = {
  characterId: string;
  currentLevel: number;
  targetLevel: number;
  includeSkills: boolean;
};

function calculateMaterialsForRange(
  characterMaterials: CharacterMaterials | undefined,
  materialsById: Record<string, PlannerMaterial>,
  currentLevel: number,
  targetLevel: number
) {
  if (!characterMaterials) return [];

  const aggregated: Record<string, number> = {};

  characterMaterials.levelingMaterials.forEach((levelRange) => {
    const [start, end] = levelRange.levelRange.split("-").map(Number);
    if (end <= currentLevel || start > targetLevel) return;

    const overlapStart = Math.max(start, currentLevel + 1);
    const overlapEnd = Math.min(end, targetLevel);
    if (overlapStart > overlapEnd) return;

    levelRange.materials.forEach((material) => {
      aggregated[material.id] = (aggregated[material.id] || 0) + material.quantity;
    });
  });

  return Object.entries(aggregated)
    .map(([materialId, quantity]) => ({ materialId, quantity }))
    .sort((a, b) => {
      const materialA = materialsById[a.materialId];
      const materialB = materialsById[b.materialId];
      return (materialB?.rarity || 0) - (materialA?.rarity || 0);
    });
}

function MaterialRow({
  matId,
  totalQty,
  owned,
  onOwnedChange,
  locale,
  lang,
  materialsById,
}: {
  matId: string;
  totalQty: number;
  owned: number;
  onOwnedChange: (v: number) => void;
  locale: Locale;
  lang: string;
  materialsById: Record<string, PlannerMaterial>;
}) {
  const isZh = isZhLocale(locale);
  const material = materialsById[matId];
  if (!material) return null;

  const remaining = Math.max(0, totalQty - owned);
  const pct = Math.min(100, Math.round((owned / totalQty) * 100));
  const done = remaining === 0;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800/50 last:border-b-0 ${done ? "opacity-60" : ""}`}>
      <Link
        href={`/${lang}/materials/${matId}`}
        className="text-sm hover:text-primary-400 transition-colors min-w-0 flex-1 truncate"
      >
        {isZh ? material.name : material.nameEn}
      </Link>
      <span className="text-[10px] text-gray-600 shrink-0">
        {material.rarity}★
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${done ? "bg-emerald-500" : "bg-primary-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="number"
          min={0}
          max={totalQty}
          value={owned}
          onChange={(e) => onOwnedChange(Math.min(totalQty, Math.max(0, Number(e.target.value))))}
          className="w-14 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-primary-500/50"
        />
        <span className="text-xs text-gray-400 w-12 text-right font-mono">
          / {totalQty}
        </span>
      </div>
    </div>
  );
}

export function MaterialPlannerClient({
  characters,
  materialsById,
  characterMaterialsById,
}: MaterialPlannerClientProps) {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;
  const isZh = isZhLocale(lang);

  const [plan, setPlan] = useState<PlanEntry[]>([]);
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plan) setPlan(parsed.plan);
        if (parsed.owned) setOwned(parsed.owned);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const savePlan = useCallback((newPlan: PlanEntry[], newOwned: Record<string, number>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: newPlan, owned: newOwned }));
    } catch {
      // ignore storage errors
    }
  }, []);

  const addCharacter = (charId: string) => {
    if (plan.some((entry) => entry.characterId === charId)) return;
    const newPlan = [...plan, { characterId: charId, currentLevel: 1, targetLevel: 60, includeSkills: true }];
    setPlan(newPlan);
    savePlan(newPlan, owned);
  };

  const removeCharacter = (charId: string) => {
    const newPlan = plan.filter((entry) => entry.characterId !== charId);
    setPlan(newPlan);
    savePlan(newPlan, owned);
  };

  const updateEntry = (charId: string, updates: Partial<PlanEntry>) => {
    const newPlan = plan.map((entry) => (entry.characterId === charId ? { ...entry, ...updates } : entry));
    setPlan(newPlan);
    savePlan(newPlan, owned);
  };

  const setOwnedQty = (matId: string, qty: number) => {
    const newOwned = { ...owned, [matId]: qty };
    setOwned(newOwned);
    savePlan(plan, newOwned);
  };

  const aggregated = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const entry of plan) {
      const levelMaterials = calculateMaterialsForRange(
        characterMaterialsById[entry.characterId],
        materialsById,
        entry.currentLevel,
        entry.targetLevel
      );
      for (const material of levelMaterials) {
        totals[material.materialId] = (totals[material.materialId] || 0) + material.quantity;
      }

      if (entry.includeSkills) {
        const skillMaterials = characterMaterialsById[entry.characterId]?.skillMaterials || [];
        for (const material of skillMaterials) {
          totals[material.id] = (totals[material.id] || 0) + material.quantity;
        }
      }
    }

    return Object.entries(totals)
      .map(([materialId, quantity]) => ({ materialId, quantity }))
      .sort((a, b) => {
        const materialA = materialsById[a.materialId];
        const materialB = materialsById[b.materialId];
        return (materialB?.rarity || 0) - (materialA?.rarity || 0);
      });
  }, [plan, materialsById, characterMaterialsById]);

  const totalMats = aggregated.length;
  const completedMats = aggregated.filter((material) => (owned[material.materialId] || 0) >= material.quantity).length;
  const overallPct = totalMats > 0 ? Math.round((completedMats / totalMats) * 100) : 0;

  const availableChars = useMemo(() => {
    const plannedIds = new Set(plan.map((entry) => entry.characterId));
    return characters.filter((character) => {
      if (plannedIds.has(character.id)) return false;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return character.name.toLowerCase().includes(query) || character.nameEn.toLowerCase().includes(query);
    });
  }, [characters, plan, searchQuery]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: t(lang, "site.nav.home"), href: `/${lang}` },
          { label: isZh ? "材料规划器" : "Material Planner" },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {isZh ? "材料规划器" : "Material Planner"}
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          {isZh
            ? "添加多个角色，自动汇总所需材料，追踪收集进度。"
            : "Add multiple characters, auto-aggregate materials needed, track collection progress."}
        </p>

        <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">
            {isZh ? "这个规划器什么时候最有用？" : "When is this planner most useful?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZh
              ? "当你准备同时养两到三个角色，或者刚经历一个新版本抽卡后要重新分配体力时，这个页面会特别有用。它能把升级和技能材料合在一起看，避免你今天刷角色突破、明天又发现技能书完全不够。"
              : "This planner becomes especially useful when you are building multiple characters at once or redistributing stamina after a new patch or pull session. It combines leveling and skill materials so you do not farm ascension today and discover tomorrow that you are still missing the core skill books."}
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "开始规划前先看什么" : "What should you check before planning?"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先决定这周真正优先养哪一到两个角色，不要把所有想养的人一次全塞进来。" : "Choose the one or two characters that truly matter this week instead of throwing every future target into the planner at once."}</li>
              <li>{isZh ? "确认目标等级是否真的需要拉满，有些角色先卡在关键突破点就够用了。" : "Check whether the target level really needs to be maxed, because some characters are already fine at an important breakpoint."}</li>
              <li>{isZh ? "把技能材料和升级材料一起看，避免只看一半资源缺口。" : "Review skill materials and leveling materials together so you do not solve only half of the resource problem."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "一次规划太多角色，结果谁都养不成型。" : "Planning too many characters at once and ending up with none of them actually finished."}</li>
              <li>{isZh ? "只盯等级，不算技能书、金币或稀有材料的同步压力。" : "Tracking levels only while ignoring books, currency, and rarer shared bottlenecks."}</li>
              <li>{isZh ? "把计划写得太满，没有给新版本卡池或临时养成需求留空间。" : "Packing the plan so tightly that there is no room for a new patch banner or a sudden priority shift."}</li>
            </ul>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h2 className="text-sm font-semibold mb-3">
                {isZh ? "添加角色" : "Add Character"}
              </h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isZh ? "搜索角色..." : "Search characters..."}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 mb-3"
              />
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {availableChars.slice(0, 20).map((character) => (
                  <button
                    key={character.id}
                    onClick={() => { addCharacter(character.id); setSearchQuery(""); }}
                    className="flex flex-col items-center gap-1 p-1.5 rounded-lg border border-gray-800 bg-gray-900/30 hover:border-primary-500/30 transition-colors"
                  >
                    <GameImage type="character" id={character.id} name={character.name} className="w-8 h-8 rounded" />
                    <span className="text-[9px] text-gray-400 truncate w-full text-center">
                      {isZh ? character.name : character.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {plan.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 space-y-3">
                <h2 className="text-sm font-semibold">
                  {isZh ? "规划列表" : "Plan List"} ({plan.length})
                </h2>
                {plan.map((entry) => {
                  const character = characters.find((item) => item.id === entry.characterId);
                  if (!character) return null;

                  return (
                    <div key={entry.characterId} className="rounded-lg border border-gray-800 bg-gray-800/30 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <GameImage type="character" id={character.id} name={character.name} className="w-8 h-8 rounded shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{isZh ? character.name : character.nameEn}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getAttributeColor(character.attribute)}`}>
                            {getAttributeLabel(character.attribute, lang)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeCharacter(entry.characterId)}
                          className="text-gray-500 hover:text-red-400 text-xs p-1"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500">{isZh ? "当前等级" : "Current"}</label>
                          <input
                            type="number"
                            min={1}
                            max={entry.targetLevel - 1}
                            value={entry.currentLevel}
                            onChange={(e) => updateEntry(entry.characterId, { currentLevel: Math.min(entry.targetLevel - 1, Math.max(1, Number(e.target.value))) })}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-primary-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500">{isZh ? "目标等级" : "Target"}</label>
                          <input
                            type="number"
                            min={entry.currentLevel + 1}
                            max={60}
                            value={entry.targetLevel}
                            onChange={(e) => updateEntry(entry.characterId, { targetLevel: Math.min(60, Math.max(entry.currentLevel + 1, Number(e.target.value))) })}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-primary-500/50"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-1.5 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entry.includeSkills}
                          onChange={(e) => updateEntry(entry.characterId, { includeSkills: e.target.checked })}
                          className="accent-primary-500"
                        />
                        <span className="text-[10px] text-gray-400">{isZh ? "包含技能材料" : "Include skill materials"}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {aggregated.length === 0 ? (
              <div className="text-center py-16 text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm">{isZh ? "添加角色开始规划" : "Add characters to start planning"}</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{isZh ? "收集进度" : "Collection Progress"}</span>
                    <span className="text-xs text-gray-400">
                      {completedMats}/{totalMats} {isZh ? "种材料完成" : "materials done"} ({overallPct}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${overallPct === 100 ? "bg-emerald-500" : "bg-primary-500"}`}
                      style={{ width: `${overallPct}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
                  {aggregated.map((material) => (
                    <MaterialRow
                      key={material.materialId}
                      matId={material.materialId}
                      totalQty={material.quantity}
                      owned={owned[material.materialId] || 0}
                      onOwnedChange={(value) => setOwnedQty(material.materialId, value)}
                      locale={lang}
                      lang={lang}
                      materialsById={materialsById}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "规划顺序建议" : "A good planning order"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "先定主队优先级，再把资源分给副队和备用位。" : "Prioritize the main team first, then spend leftovers on side teams and backups."}</li>
              <li>{isZh ? "先补最卡进度的材料，而不是平均摊体力。" : "Fix the biggest material bottleneck first instead of spreading stamina evenly."}</li>
              <li>{isZh ? "确认是否真的需要把技能也一起拉满，很多角色前期并不用。" : "Check whether maxing skills immediately is necessary, because many units do not need it early."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZh ? "常见资源浪费" : "Common resource waste"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZh ? "同时开太多角色，结果谁都没法快速成型。" : "Opening too many projects at once so nobody reaches a usable state quickly."}</li>
              <li>{isZh ? "把过渡角色投入到和主力同级别的材料预算。" : "Spending main-carry level resources on short-term transitional characters."}</li>
              <li>{isZh ? "只看总数，不看哪类素材掉落最慢。" : "Watching totals without identifying which material type is actually the slowest to farm."}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
