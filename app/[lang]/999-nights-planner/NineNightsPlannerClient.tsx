"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import goalsData from "../../../data/999-nights-goals.json";
import { isZhLocale, type Locale } from "../../../lib/i18n";
import { trackEvent } from "../../../lib/analytics";
import {
  calculateTotalButtons,
  ceilDiv,
  mergeGoalSelections,
  plannerStateFromSearchParams,
  plannerStateToSearchParams,
  PLANNER_STORAGE_KEY,
  removeGoalSelections,
  toggleGoalSelection,
  type NineNightsGoal,
} from "../../../lib/nine-nights-planner";

const goals = goalsData as NineNightsGoal[];
const DAY_PRESETS = [1, 3, 7, 14];
const FARMING_PROFILES = [
  { key: "afk", buttonsPerMinute: 1000, label: "AFK", labelZh: "挂机", labelTw: "掛機" },
  { key: "steady", buttonsPerMinute: 2000, label: "Steady", labelZh: "稳定刷", labelTw: "穩定刷" },
  { key: "optimized", buttonsPerMinute: 4000, label: "Optimized", labelZh: "极限速刷", labelTw: "極限速刷" },
] as const;

function localizedGoalName(goal: NineNightsGoal, locale: Locale): string {
  if (locale === "tw") return goal.nameTw || goal.name;
  return isZhLocale(locale) ? goal.name : goal.nameEn;
}

function localizedGoalNote(goal: NineNightsGoal, locale: Locale): string {
  if (locale === "tw") return goal.noteTw || goal.note || "";
  return isZhLocale(locale) ? goal.note || "" : goal.noteEn || "";
}

export function NineNightsPlannerClient({ lang }: { lang: string }) {
  const locale = lang as Locale;
  const isZh = isZhLocale(locale);
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<"all" | "completion" | "cosmetic">("all");
  const [activeSourceFilter, setActiveSourceFilter] = useState<"all" | "costed" | "official">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ownedButtons, setOwnedButtons] = useState(0);
  const [targetDays, setTargetDays] = useState(7);
  const [customDays, setCustomDays] = useState(7);
  const [customTarget, setCustomTarget] = useState(0);
  const [includeCustomTarget, setIncludeCustomTarget] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const validGoalIds = goals.map((goal) => goal.id);
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.toString()) {
        const parsed = plannerStateFromSearchParams(params, validGoalIds);
        setSelectedIds(parsed.selectedIds);
        setOwnedButtons(parsed.ownedButtons);
        setTargetDays(parsed.targetDays);
        setCustomDays(parsed.targetDays);
        setCustomTarget(parsed.customTarget);
        setIncludeCustomTarget(parsed.includeCustomTarget);
      } else {
        const saved = localStorage.getItem(PLANNER_STORAGE_KEY);
        if (saved) {
          const parsed = plannerStateFromSearchParams(
            plannerStateToSearchParams(JSON.parse(saved)),
            validGoalIds
          );
          setSelectedIds(parsed.selectedIds);
          setOwnedButtons(parsed.ownedButtons);
          setTargetDays(parsed.targetDays);
          setCustomDays(parsed.targetDays);
          setCustomTarget(parsed.customTarget);
          setIncludeCustomTarget(parsed.includeCustomTarget);
        }
      }
    } catch {
      // ignore malformed localStorage
    }
    setMounted(true);
    trackEvent({ event: "tool_999n_view", category: "999_nights_planner" });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        PLANNER_STORAGE_KEY,
        JSON.stringify({ selectedIds, ownedButtons, targetDays, customTarget, includeCustomTarget })
      );
    } catch {
      // ignore storage errors
    }
  }, [mounted, selectedIds, ownedButtons, targetDays, customTarget, includeCustomTarget]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const params = plannerStateToSearchParams({
      selectedIds,
      ownedButtons,
      targetDays,
      customTarget,
      includeCustomTarget,
    });
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    window.history.replaceState({}, "", next);
  }, [mounted, pathname, selectedIds, ownedButtons, targetDays, customTarget, includeCustomTarget]);

  const selectedGoals = useMemo(
    () => goals.filter((goal) => selectedIds.includes(goal.id)),
    [selectedIds]
  );

  const visibleGoals = useMemo(() => {
    const categoryGoals =
      activeCategory === "all" ? goals : goals.filter((goal) => goal.category === activeCategory);

    if (activeSourceFilter === "costed") {
      return categoryGoals.filter((goal) => goal.buttonCost > 0);
    }

    if (activeSourceFilter === "official") {
      return categoryGoals.filter((goal) => goal.sourceTier === "official");
    }

    return categoryGoals;
  }, [activeCategory, activeSourceFilter]);
  const visibleGoalIds = useMemo(() => visibleGoals.map((goal) => goal.id), [visibleGoals]);
  const visibleCostedGoalIds = useMemo(
    () => visibleGoals.filter((goal) => goal.buttonCost > 0).map((goal) => goal.id),
    [visibleGoals]
  );
  const visibleOfficialGoalIds = useMemo(
    () => visibleGoals.filter((goal) => goal.sourceTier === "official").map((goal) => goal.id),
    [visibleGoals]
  );
  const visibleSelectedCount = useMemo(
    () => visibleGoalIds.filter((id) => selectedIds.includes(id)).length,
    [visibleGoalIds, selectedIds]
  );
  const visibleButtonTotal = useMemo(
    () => visibleGoals.reduce((sum, goal) => sum + Math.max(0, goal.buttonCost), 0),
    [visibleGoals]
  );
  const emptyVisibleState = visibleGoals.length === 0;

  const fullShopSelected = selectedIds.includes("full-shop");

  const totalButtons = useMemo(
    () =>
      calculateTotalButtons(goals, {
        selectedIds,
        ownedButtons,
        targetDays,
        customTarget,
        includeCustomTarget,
      }),
    [selectedIds, ownedButtons, targetDays, customTarget, includeCustomTarget]
  );

  const deficit = Math.max(0, totalButtons - ownedButtons);
  const dailyTarget = ceilDiv(deficit, targetDays);
  const farmingEstimates = useMemo(
    () =>
      FARMING_PROFILES.map((profile) => ({
        ...profile,
        totalMinutes: ceilDiv(deficit, profile.buttonsPerMinute),
        dailyMinutes: ceilDiv(dailyTarget, profile.buttonsPerMinute),
      })),
    [deficit, dailyTarget]
  );

  const suggestion = useMemo(() => {
    if (totalButtons === 0) {
      return {
        title: isZh ? (locale === "tw" ? "先選一個目標" : "先选一个目标") : "Pick a target first",
        body: isZh
          ? (locale === "tw"
              ? "先選好你想換的外觀或是否要搬空商店，再輸入目前持有的神秘鈕扣，結果會更準。"
              : "先选好你想换的外观或是否要搬空商店，再输入目前持有的神秘纽扣，结果会更准。")
          : "Choose a cosmetic target or the full-shop preset first, then add your current Mystery Buttons for a more useful plan.",
      };
    }

    if (dailyTarget >= 8000) {
      return {
        title: isZh ? (locale === "tw" ? "你現在更像刷幣期" : "你现在更像刷币期") : "You're in a grind-heavy phase",
        body: isZh
          ? (locale === "tw"
              ? "你的日目標偏高，先把刷紐扣效率、配裝和速刷點位跑順，比急著換零碎獎勵更重要。"
              : "你的日目标偏高，先把刷纽扣效率、配装和速刷点位跑顺，比急着换零碎奖励更重要。")
          : "Your daily target is aggressive, so farming efficiency, gear setup, and route choice matter more than picking up small rewards early.",
      };
    }

    if (dailyTarget >= 2000) {
      return {
        title: isZh ? (locale === "tw" ? "你現在更像穩定周回期" : "你现在更像稳定周回期") : "You're in a steady farm phase",
        body: isZh
          ? (locale === "tw"
              ? "你的目標適合配合每日/每週節奏慢慢推進，建議把 999 夜、沃倫大陸收集和角色養成一起安排。"
              : "你的目标适合配合每日/每周节奏慢慢推进，建议把 999 夜、沃伦大陆收集和角色养成一起安排。")
          : "This target fits a repeatable weekly rhythm. Pair 999 Nights farming with Warren Continent collection and character progression.",
      };
    }

    return {
      title: isZh ? (locale === "tw" ? "你現在更像輕量補票期" : "你现在更像轻量补票期") : "You're in a cleanup phase",
      body: isZh
        ? (locale === "tw"
            ? "差距不大，可以把這個目標當成補票式規劃，順手刷掉即可，不必特地重壓整個遊玩節奏。"
            : "差距不大，可以把这个目标当成补票式规划，顺手刷掉即可，不必特地重压整个游玩节奏。")
        : "The gap is small enough to treat as a cleanup goal. You likely don't need to fully reshape your play schedule around it.",
    };
  }, [isZh, locale, totalButtons, dailyTarget]);

  const toggleGoal = (goalId: string) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal) return;

    setSelectedIds((prev) => {
      const next = toggleGoalSelection(prev, goal.id);
      trackEvent({ event: "tool_999n_select_reward", category: "999_nights_planner", label: goal.id });
      return next;
    });
  };

  const selectVisibleGoals = useCallback((goalIds: string[], label: string) => {
    setSelectedIds((prev) => mergeGoalSelections(prev, goalIds));
    trackEvent({ event: "tool_999n_select_reward", category: "999_nights_planner", label });
  }, []);

  const clearVisibleGoals = useCallback(() => {
    setSelectedIds((prev) => removeGoalSelections(prev, visibleGoalIds));
    trackEvent({ event: "tool_999n_select_reward", category: "999_nights_planner", label: "clear_visible" });
  }, [visibleGoalIds]);

  const resetPlanner = () => {
    setActiveCategory("all");
    setActiveSourceFilter("all");
    setSelectedIds([]);
    setOwnedButtons(0);
    setTargetDays(7);
    setCustomDays(7);
    setCustomTarget(0);
    setIncludeCustomTarget(false);
    setCopied(false);
    trackEvent({ event: "tool_999n_reset", category: "999_nights_planner" });
  };

  const copyShareLink = useCallback(async () => {
    const params = plannerStateToSearchParams({
      selectedIds,
      ownedButtons,
      targetDays,
      customTarget,
      includeCustomTarget,
    });
    const url = `${window.location.origin}${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      trackEvent({ event: "tool_999n_share", category: "999_nights_planner", label: "copy_link" });
    } catch {
      setCopied(false);
    }
  }, [selectedIds, ownedButtons, targetDays, customTarget, includeCustomTarget, pathname]);

  const activeRelatedLinks = useMemo(() => {
    const base = [
      { href: `/${lang}/guides/nine-hundred-ninety-nine-nights-mode`, titleZh: "999夜攻略", titleTw: "999夜攻略", titleEn: "999 Nights Guide" },
      { href: `/${lang}/guides/warren-continent-collectibles-guide`, titleZh: "沃伦大陆全收集", titleTw: "沃倫大陸全收集", titleEn: "Warren Collectibles" },
      { href: `/${lang}/changelog/1.2`, titleZh: "1.2 更新日志", titleTw: "1.2 更新日誌", titleEn: "Version 1.2 Notes" },
    ];

    if (fullShopSelected || dailyTarget >= 2000) {
      base.push(
        { href: `/${lang}/map`, titleZh: "互动地图", titleTw: "互動地圖", titleEn: "Interactive Map" },
        { href: `/${lang}/explorer`, titleZh: "扫图路线", titleTw: "掃圖路線", titleEn: "Explorer Routes" }
      );
    } else {
      base.push(
        { href: `/${lang}/guides/zhenhong-build-guide`, titleZh: "真红攻略", titleTw: "真紅攻略", titleEn: "Shinku / Zhenhong Guide" },
        { href: `/${lang}/banners`, titleZh: "当前卡池", titleTw: "目前卡池", titleEn: "Current Banners" }
      );
    }

    return base.slice(0, 5);
  }, [lang, fullShopSelected, dailyTarget]);

  const verifiedGoalsCount = goals.filter((goal) => goal.buttonCost > 0).length;
  const officialCount = goals.filter((goal) => goal.sourceTier === "official").length;

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 lg:pb-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">
          {isZh ? (locale === "tw" ? "999夜規劃器" : "999夜规划器") : "999 Nights Planner"}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {isZh
            ? (locale === "tw"
                ? "用公開可驗證的神秘鈕扣目標，快速估算你還差多少、每天要刷多少，以及下一步更適合看哪個攻略。"
                : "用公开可验证的神秘纽扣目标，快速估算你还差多少、每天要刷多少，以及下一步更适合看哪个攻略。")
            : "Estimate your Mystery Button gap, set a daily target, and jump to the most relevant follow-up guides for 999 Nights."}
        </p>
        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
          {isZh
            ? (locale === "tw"
                ? "目前首版只內建公開能驗證成本的目標；更完整的 999 夜商店明細可在後續版本擴充。"
                : "目前首版只内建公开能验证成本的目标；更完整的 999 夜商店明细可在后续版本扩充。")
            : "This first version only includes publicly verifiable button targets. A deeper itemized Button Shop model can be layered in later."}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {isZh ? (locale === "tw" ? "目標選擇" : "目标选择") : "Target Selection"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {isZh
                    ? (locale === "tw"
                        ? "你可以直接選搬空商店，或只選幾個已公開可核對成本的外觀目標。"
                        : "你可以直接选搬空商店，或只选几个已公开可核对成本的外观目标。")
                    : "Choose the full-shop preset or just a few publicly costed cosmetic targets."}
                </p>
              </div>
              <button
                onClick={resetPlanner}
                className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:border-gray-500 hover:text-white"
              >
                {isZh ? (locale === "tw" ? "重設" : "重置") : "Reset"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { key: "all" as const, zh: "全部目标", tw: "全部目標", en: "All targets" },
                { key: "completion" as const, zh: "总量规划", tw: "總量規劃", en: "Completion" },
                { key: "cosmetic" as const, zh: "外观目标", tw: "外觀目標", en: "Cosmetics" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveCategory(tab.key);
                    trackEvent({ event: "tool_999n_filter_category", category: "999_nights_planner", label: tab.key });
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    activeCategory === tab.key
                      ? "bg-primary-500/15 text-primary-300"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {locale === "tw" ? tab.tw : isZh ? tab.zh : tab.en}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { key: "all" as const, zh: "全部来源", tw: "全部來源", en: "All sources" },
                { key: "costed" as const, zh: "仅可计价", tw: "僅可計價", en: "Costed only" },
                { key: "official" as const, zh: "仅官方确认", tw: "僅官方確認", en: "Official only" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => {
                    setActiveSourceFilter(filter.key);
                    trackEvent({ event: "tool_999n_filter_source", category: "999_nights_planner", label: filter.key });
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    activeSourceFilter === filter.key
                      ? "bg-cyan-500/15 text-cyan-200"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {locale === "tw" ? filter.tw : isZh ? filter.zh : filter.en}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => selectVisibleGoals(visibleCostedGoalIds, "select_visible_costed")}
                className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {isZh ? (locale === "tw" ? "勾選本分類可計算目標" : "勾选本分类可计算目标") : "Select costed in view"}
              </button>
              <button
                type="button"
                onClick={() => selectVisibleGoals(visibleOfficialGoalIds, "select_visible_official")}
                className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {isZh ? (locale === "tw" ? "勾選本分類官方目標" : "勾选本分类官方目标") : "Select official in view"}
              </button>
              <button
                type="button"
                onClick={clearVisibleGoals}
                className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {isZh ? (locale === "tw" ? "清空本分類勾選" : "清空本分类勾选") : "Clear visible"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedIds(["full-shop"]);
                  setIncludeCustomTarget(false);
                  setCustomTarget(0);
                  trackEvent({ event: "tool_999n_select_reward", category: "999_nights_planner", label: "preset_full_shop" });
                }}
                className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {isZh ? (locale === "tw" ? "一鍵選搬空商店" : "一键选搬空商店") : "Select full shop"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedIds(goals.filter((goal) => goal.category === "cosmetic").map((goal) => goal.id));
                  trackEvent({ event: "tool_999n_select_reward", category: "999_nights_planner", label: "preset_cosmetics" });
                }}
                className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {isZh ? (locale === "tw" ? "只看外觀目標" : "只看外观目标") : "Cosmetic goals only"}
              </button>
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-full bg-primary-500/15 px-3 py-1.5 text-xs text-primary-300 hover:bg-primary-500/20"
              >
                {copied
                  ? (isZh ? (locale === "tw" ? "已複製連結" : "已复制链接") : "Link copied")
                  : (isZh ? (locale === "tw" ? "複製分享連結" : "复制分享链接") : "Copy share link")}
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3 text-xs text-gray-400">
              {isZh
                ? (locale === "tw"
                    ? `目前共有 ${goals.length} 個規劃目標，其中 ${verifiedGoalsCount} 個帶有可計算成本，${officialCount} 個直接來自官方已確認資訊。`
                    : `目前共有 ${goals.length} 个规划目标，其中 ${verifiedGoalsCount} 个带有可计算成本，${officialCount} 个直接来自官方已确认信息。`)
                : `There are currently ${goals.length} planning targets here, with ${verifiedGoalsCount} costed entries and ${officialCount} targets anchored directly in official-confirmed information.`}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-gray-500">
                  {isZh ? (locale === "tw" ? "目前分類" : "当前分类") : "Active view"}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {activeCategory === "all"
                    ? (isZh ? (locale === "tw" ? "全部目標" : "全部目标") : "All targets")
                    : activeCategory === "completion"
                      ? (isZh ? (locale === "tw" ? "總量規劃" : "总量规划") : "Completion")
                      : (isZh ? (locale === "tw" ? "外觀目標" : "外观目标") : "Cosmetics")}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {activeSourceFilter === "all"
                    ? (isZh ? (locale === "tw" ? "全部來源" : "全部来源") : "All sources")
                    : activeSourceFilter === "costed"
                      ? (isZh ? (locale === "tw" ? "僅可計價" : "仅可计价") : "Costed only")
                      : (isZh ? (locale === "tw" ? "僅官方確認" : "仅官方确认") : "Official only")}
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-gray-500">
                  {isZh ? (locale === "tw" ? "本分類已選" : "本分类已选") : "Selected in view"}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {visibleSelectedCount} / {visibleGoals.length}
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-gray-500">
                  {isZh ? (locale === "tw" ? "本分類總成本" : "本分类总成本") : "View button total"}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {visibleButtonTotal.toLocaleString()}
                </div>
              </div>
            </div>

            {emptyVisibleState ? (
              <div className="mt-4 rounded-2xl border border-dashed border-gray-700 bg-gray-950/30 p-5 text-sm text-gray-400">
                {isZh
                  ? (locale === "tw"
                      ? "這個篩選組合下暫時沒有目標。你可以切回全部來源，或切換到其他分類。"
                      : "这个筛选组合下暂时没有目标。你可以切回全部来源，或切换到其他分类。")
                  : "No targets match this filter combination yet. Try switching back to all sources or another category."}
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleGoals.map((goal) => {
                  const selected = selectedIds.includes(goal.id);
                  return (
                    <div
                      key={goal.id}
                      className={`rounded-2xl border p-4 transition-colors ${
                        selected
                          ? "border-primary-500/50 bg-primary-500/10"
                          : "border-gray-800 bg-gray-900/30 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button type="button" onClick={() => toggleGoal(goal.id)} className="min-w-0 flex-1 text-left">
                          <div className="text-sm font-semibold text-white">
                            {localizedGoalName(goal, locale)}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            {goal.buttonCost > 0
                              ? `${goal.buttonCost.toLocaleString()} ${isZh ? (locale === "tw" ? "神秘鈕扣" : "神秘纽扣") : "Mystery Buttons"}`
                              : (isZh ? (locale === "tw" ? "策略型目標（不直接加總成本）" : "策略型目标（不直接加总成本）") : "Strategy target (no direct button cost)")}
                          </div>
                        </button>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${goal.sourceTier === "official" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                          {goal.sourceTier === "official" ? "Official" : "Public source"}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-gray-400">
                        {localizedGoalNote(goal, locale)}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-[11px] text-gray-500">
                          {goal.sourceLabel}
                        </p>
                        {goal.sourceUrl && (
                          <a
                            href={goal.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-[11px] text-primary-300 hover:text-primary-200"
                          >
                            {isZh ? (locale === "tw" ? "來源" : "来源") : "Source"} ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedGoals.length > 0 && !fullShopSelected && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedGoals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className="rounded-full border border-primary-500/25 bg-primary-500/10 px-3 py-1.5 text-xs text-primary-200 hover:bg-primary-500/15"
                  >
                    {localizedGoalName(goal, locale)} ×
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
              <h2 className="text-lg font-semibold">
                {isZh ? (locale === "tw" ? "目前持有" : "当前持有") : "Current Buttons"}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {isZh
                  ? (locale === "tw" ? "輸入你現在已有多少神秘鈕扣。" : "输入你现在已有多少神秘纽扣。")
                  : "Enter how many Mystery Buttons you already have."}
              </p>
              <input
                type="number"
                min={0}
                value={ownedButtons}
                onChange={(e) => {
                  const next = Math.max(0, Number(e.target.value) || 0);
                  setOwnedButtons(next);
                  trackEvent({ event: "tool_999n_change_owned_buttons", category: "999_nights_planner", value: next });
                }}
                className="mt-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-lg text-white focus:border-primary-500/50 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {isZh ? (locale === "tw" ? "自訂缺口" : "自定义缺口") : "Custom Target"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {isZh
                      ? (locale === "tw" ? "如果你心裡已經有一個總紐扣目標，也可以直接手動補進來。" : "如果你心里已经有一个总纽扣目标，也可以直接手动补进来。")
                      : "If you already know your own total button goal, you can add it directly here."}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeCustomTarget}
                  onChange={(e) => setIncludeCustomTarget(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500"
                />
              </div>
              <input
                type="number"
                min={0}
                disabled={!includeCustomTarget || fullShopSelected}
                value={customTarget}
                onChange={(e) => setCustomTarget(Math.max(0, Number(e.target.value) || 0))}
                className="mt-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-lg text-white disabled:cursor-not-allowed disabled:opacity-40 focus:border-primary-500/50 focus:outline-none"
              />
              {fullShopSelected && (
                <p className="mt-2 text-xs text-amber-300">
                  {isZh
                    ? (locale === "tw" ? "已選擇搬空商店時，自訂缺口會暫時停用，避免重複計算。" : "已选择搬空商店时，自定义缺口会暂时停用，避免重复计算。")
                    : "Custom targets are disabled while the full-shop preset is active to avoid double counting."}
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="text-lg font-semibold">
              {isZh ? (locale === "tw" ? "完成節奏" : "完成节奏") : "Target Schedule"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isZh
                ? (locale === "tw" ? "選一個你打算完成目標的大致天數，規劃器會換算出每天需要刷多少。" : "选一个你打算完成目标的大致天数，规划器会换算出每天需要刷多少。")
                : "Pick a rough completion window and the planner will calculate your daily button goal."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {DAY_PRESETS.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setTargetDays(days);
                    setCustomDays(days);
                    trackEvent({ event: "tool_999n_change_days", category: "999_nights_planner", value: days });
                  }}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    targetDays === days
                      ? "bg-primary-500/15 text-primary-300"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {days} {isZh ? (locale === "tw" ? "天" : "天") : days === 1 ? "day" : "days"}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-400">{isZh ? (locale === "tw" ? "自訂" : "自定义") : "Custom"}</span>
              <input
                type="number"
                min={1}
                value={customDays}
                onChange={(e) => {
                  const next = Math.max(1, Number(e.target.value) || 1);
                  setCustomDays(next);
                  setTargetDays(next);
                  trackEvent({ event: "tool_999n_change_days", category: "999_nights_planner", value: next });
                }}
                className="w-24 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-primary-500/50 focus:outline-none"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-primary-500/20 bg-primary-500/10 p-5">
            <h2 className="text-lg font-semibold text-white">
              {isZh ? (locale === "tw" ? "規劃結果" : "规划结果") : "Planner Result"}
            </h2>
            {selectedGoals.length > 0 && !fullShopSelected && (
              <p className="mt-2 text-xs text-primary-100/80">
                {isZh
                  ? (locale === "tw"
                      ? `已選 ${selectedGoals.length} 個公開目標`
                      : `已选 ${selectedGoals.length} 个公开目标`)
                  : `${selectedGoals.length} public target${selectedGoals.length === 1 ? "" : "s"} selected`}
              </p>
            )}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{isZh ? (locale === "tw" ? "總目標" : "总目标") : "Total target"}</span>
                <strong>{totalButtons.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{isZh ? (locale === "tw" ? "目前持有" : "当前持有") : "Owned now"}</span>
                <strong>{ownedButtons.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">{isZh ? (locale === "tw" ? "還差" : "还差") : "Remaining"}</span>
                <strong>{deficit.toLocaleString()}</strong>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  {isZh ? (locale === "tw" ? "每日目標" : "每日目标") : "Daily target"}
                </div>
                <div className="mt-2 text-2xl font-bold text-primary-300">
                  {dailyTarget.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {isZh
                    ? (locale === "tw" ? `按 ${targetDays} 天節奏估算` : `按 ${targetDays} 天节奏估算`)
                    : `Estimated across ${targetDays} day${targetDays === 1 ? "" : "s"}`}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="text-lg font-semibold">
              {isZh ? (locale === "tw" ? "刷取時間粗估" : "刷取时间粗估") : "Rough Farming Time"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isZh
                ? (locale === "tw" ? "以下只是用公開社群常見速刷速率做的粗估，不代表固定官方收益。" : "以下只是用公开社群常见速刷速率做的粗估，不代表固定官方收益。")
                : "These are only rough estimates based on common community farming-rate discussions, not fixed official returns."}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              {farmingEstimates.map((profile) => (
                <div key={profile.key} className="rounded-lg bg-gray-800/60 px-3 py-3">
                  <div className="flex items-center justify-between">
                    <span>
                      {locale === "tw"
                        ? profile.labelTw
                        : isZh
                          ? profile.labelZh
                          : profile.label}{" "}
                      · {profile.buttonsPerMinute.toLocaleString()}/min
                    </span>
                    <strong>~{profile.totalMinutes} {isZh ? (locale === "tw" ? "分鐘" : "分钟") : "min"}</strong>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {isZh
                      ? (locale === "tw"
                          ? `若照 ${targetDays} 天節奏拆分，平均每天約 ${profile.dailyMinutes} 分鐘`
                          : `若照 ${targetDays} 天节奏拆分，平均每天约 ${profile.dailyMinutes} 分钟`)
                      : `At this pace across ${targetDays} day${targetDays === 1 ? "" : "s"}, about ${profile.dailyMinutes} min/day`}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
            <h2 className="text-lg font-semibold">
              {isZh ? (locale === "tw" ? "下一步建議" : "下一步建议") : "Next Best Step"}
            </h2>
            <h3 className="mt-4 text-base font-semibold text-primary-300">{suggestion.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">{suggestion.body}</p>
          </section>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
        <h2 className="text-lg font-semibold">
          {isZh ? (locale === "tw" ? "相關內容入口" : "相关内容入口") : "Related Guides"}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {activeRelatedLinks.map((item) => {
            const label = locale === "tw" ? item.titleTw : isZh ? item.titleZh : item.titleEn;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => trackEvent({ event: "tool_999n_click_related_link", category: "999_nights_planner", label: item.href })}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-4 text-sm text-gray-300 hover:border-primary-500/30 hover:text-white"
              >
                {label} →
              </Link>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
        <div className="rounded-2xl border border-primary-500/25 bg-gray-950/90 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                {isZh ? (locale === "tw" ? "總目標" : "总目标") : "Target"}
              </div>
              <div className="mt-1 text-sm font-semibold text-white">{totalButtons.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                {isZh ? (locale === "tw" ? "還差" : "还差") : "Remaining"}
              </div>
              <div className="mt-1 text-sm font-semibold text-white">{deficit.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500">
                {isZh ? (locale === "tw" ? "每日" : "每日") : "Daily"}
              </div>
              <div className="mt-1 text-sm font-semibold text-primary-300">{dailyTarget.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
