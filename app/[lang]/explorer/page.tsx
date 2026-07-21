"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import type { Locale } from "../../../lib/i18n";
import { t, isZhLocale } from "../../../lib/i18n";
import {
  loadProgress, saveProgress, toggleMarker, countCollected, progressPercent,
  loadSweepFilters, saveSweepFilters, loadPlayerInfo, savePlayerInfo,
} from "../../../lib/map-progress";
import type { MapMarker } from "../../../lib/map-utils";
import {
  optimizeRoute, estimateCompletionTime, calculateRouteDistance,
  filterUncollected, filterByRegionAndType, getDailyWeeklyMarkers, resetDailyProgress,
} from "../../../lib/explorer-utils";
import ExplorerDashboard from "../../../components/ExplorerDashboard";
import ExplorerShareCard from "../../../components/ExplorerShareCard";
import { useMapData, useRegionMarkers } from "../../../lib/use-map-data";

const ExplorerSweepMap = dynamic(
  () => import("../../../components/ExplorerSweepMap"),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[300px] bg-gray-900 rounded-lg animate-pulse" /> }
);

type TabKey = "dashboard" | "sweep" | "daily";

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  return `${m}m ${sec}s`;
}

export default function ExplorerPage() {
  const params = useParams();
  const lang = (params.lang || "en") as Locale;
  const isZh = isZhLocale(lang);

  // Lazy-loaded data
  const { maps, markerTypes, regions, loading: coreLoading } = useMapData();
  const allRegionIds = useMemo(() => Object.keys(regions), [regions]);
  const { markers: allMarkers, loading: markersLoading } = useRegionMarkers(null, allRegionIds);
  const mapInfo = maps[0];
  const dataLoading = coreLoading || markersLoading;

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  // Sweep state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [isSweeping, setIsSweeping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sweepStartTime, setSweepStartTime] = useState<number | null>(null);
  const [initialPercent, setInitialPercent] = useState(0);
  const [sweepComplete, setSweepComplete] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(true);

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [playerId, setPlayerId] = useState("");

  // Ref for the sweep route snapshot when sweep starts
  const sweepSnapshot = useRef<MapMarker[]>([]);

  useEffect(() => {
    setMounted(true);
    setProgress(loadProgress());
    // Restore sweep filters
    const filters = loadSweepFilters();
    if (filters) {
      setSelectedRegion(filters.region);
      setSelectedTypes(new Set(filters.types));
    }
    // Restore player info
    const info = loadPlayerInfo();
    if (info) {
      setNickname(info.nickname);
      setPlayerId(info.playerId);
    }
  }, []);

  // Persist sweep filters
  useEffect(() => {
    if (mounted) saveSweepFilters(selectedRegion, Array.from(selectedTypes));
  }, [selectedRegion, selectedTypes, mounted]);

  // Toggle a marker and save
  const handleToggle = useCallback(
    (markerId: string) => {
      setProgress((prev) => {
        const next = toggleMarker(prev, markerId);
        saveProgress(next);
        return next;
      });
    },
    []
  );

  // Sweep route: filter + optimize (skip until data loaded)
  const sweepRoute = useMemo(() => {
    if (dataLoading) return [];
    if (!isSweeping || sweepComplete) return sweepSnapshot.current;
    const filtered = filterByRegionAndType(allMarkers, selectedRegion, selectedTypes);
    const uncollected = filterUncollected(filtered, progress);
    if (uncollected.length === 0) return [];
    if (uncollected.length > 500) return optimizeRoute(uncollected.slice(0, 500));
    return optimizeRoute(uncollected);
  }, [isSweeping, selectedRegion, selectedTypes, progress, sweepComplete, allMarkers, dataLoading]);

  const sweepCollected = useMemo(
    () => new Set(sweepRoute.filter((m) => progress[m.id]).map((m) => m.id)),
    [sweepRoute, progress]
  );

  const estTime = useMemo(
    () => estimateCompletionTime(sweepRoute, progress),
    [sweepRoute, progress]
  );

  const routeDistance = useMemo(
    () => calculateRouteDistance(sweepRoute),
    [sweepRoute]
  );

  // Detect sweep completion
  useEffect(() => {
    if (!isSweeping || sweepComplete || sweepRoute.length === 0) return;
    const collected = countCollected(progress, sweepRoute.map((m) => m.id));
    if (collected === sweepRoute.length) {
      setSweepComplete(true);
    }
  }, [progress, sweepRoute, isSweeping, sweepComplete]);

  // Start sweep
  const startSweep = () => {
    if (dataLoading) return;
    if (!selectedRegion && selectedTypes.size === 0) return;
    const filtered = filterByRegionAndType(allMarkers, selectedRegion, selectedTypes);
    const uncollected = filterUncollected(filtered, progress);
    if (uncollected.length === 0) return;
    const route = uncollected.length > 500 ? optimizeRoute(uncollected.slice(0, 500)) : optimizeRoute(uncollected);
    sweepSnapshot.current = route;
    setIsSweeping(true);
    setActiveIndex(0);
    setSweepStartTime(Date.now());
    setInitialPercent(progressPercent(progress, allMarkers.map((m) => m.id)));
    setSweepComplete(false);
    setUndoStack([]);
    setShowMap(true);
    setActiveTab("sweep");
  };

  const stopSweep = () => {
    setIsSweeping(false);
    setActiveIndex(0);
    setSweepComplete(false);
    setUndoStack([]);
    sweepSnapshot.current = [];
  };

  // Undo
  const handleUndo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const lastId = prev[prev.length - 1];
      handleToggle(lastId);
      return prev.slice(0, -1);
    });
  }, [handleToggle]);

  // Handle marker click on map
  const handleMarkerClick = useCallback(
    (marker: MapMarker, idx: number) => {
      if (!progress[marker.id]) {
        handleToggle(marker.id);
        setUndoStack((prev) => [...prev.slice(-19), marker.id]);
        for (let i = idx + 1; i < sweepRoute.length; i++) {
          if (!progress[sweepRoute[i].id]) {
            setActiveIndex(i);
            return;
          }
        }
      }
    },
    [handleToggle, progress, sweepRoute]
  );

  // Checklist click
  const handleChecklistToggle = useCallback((idx: number) => {
    const marker = sweepSnapshot.current[idx];
    if (!marker) return;
    if (progress[marker.id]) return;
    handleToggle(marker.id);
    setUndoStack((prev) => [...prev.slice(-19), marker.id]);
    for (let i = idx + 1; i < sweepSnapshot.current.length; i++) {
      if (!progress[sweepSnapshot.current[i].id]) {
        setActiveIndex(i);
        return;
      }
    }
  }, [handleToggle, progress]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isSweeping || sweepComplete || sweepRoute.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, sweepRoute.length - 1));
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          if (!progress[sweepRoute[activeIndex]?.id]) {
            handleChecklistToggle(activeIndex);
          }
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleUndo();
          }
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSweeping, sweepComplete, sweepRoute, activeIndex, progress, handleChecklistToggle, handleUndo]);

  // Daily/Weekly
  const { daily, weekly } = useMemo(() => dataLoading ? { daily: [], weekly: [] } : getDailyWeeklyMarkers(allMarkers), [allMarkers, dataLoading]);

  const handleResetDaily = () => {
    const next = resetDailyProgress(progress, allMarkers);
    setProgress(next);
    saveProgress(next);
  };

  // Type toggle
  const toggleType = (typeId: string) => {
    const next = new Set(selectedTypes);
    if (next.has(typeId)) next.delete(typeId);
    else next.add(typeId);
    setSelectedTypes(next);
  };

  // Share helpers
  const currentRegionName = useMemo(() => {
    if (!selectedRegion) return isZh ? "全部区域" : "All Regions";
    const info = regions[selectedRegion];
    return info ? (isZh ? info.zh : info.en) : "";
  }, [selectedRegion, isZh, regions]);

  const handleNicknameChange = (v: string) => {
    setNickname(v);
    savePlayerInfo(v, playerId);
  };

  const handlePlayerIdChange = (v: string) => {
    setPlayerId(v);
    savePlayerInfo(nickname, v);
  };

  if (!mounted || dataLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {t(lang, "explorer.title")}
          </h1>
          <p className="text-sm leading-6 text-gray-400">
            {isZh
              ? "异环探索伴侣用于规划区域清扫、每日补漏和收集进度追踪。你可以按区域与标点类型筛选路线，记录已收集内容，并把长期探索目标拆成更容易完成的每日路线。"
              : "The NTE explorer companion helps plan regional sweeps, daily cleanup, and collection progress. Filter by region and marker type, record collected items, and turn long exploration goals into easier daily routes."}
          </p>
        </div>
        <div className="animate-pulse h-96 bg-gray-900 rounded-xl" />
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "dashboard", label: t(lang, "explorer.tabDashboard") },
    { key: "sweep", label: t(lang, "explorer.tabSweep") },
    { key: "daily", label: t(lang, "explorer.tabDaily") },
  ];

  const sweepCollectedCount = countCollected(progress, sweepRoute.map((m) => m.id));
  const sweepPercent = progressPercent(progress, sweepRoute.map((m) => m.id));
  const totalPercent = progressPercent(progress, allMarkers.map((m) => m.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          {t(lang, "explorer.title")}
        </h1>
        <p className="text-sm text-gray-500">
          {t(lang, "explorer.description")}
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
        <h2 className="text-base font-semibold text-white">
          {isZh ? "探索伴侣最适合什么时候开？" : "When is the explorer companion most useful?"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-300">
          {isZh
            ? "当你已经知道大概想刷哪一类资源，但不想在大地图里自己手动拼路线时，这个页面最有价值。它适合做区域清扫、每日补漏和阶段性全收集，尤其适合版本中后期回头补齐遗漏资源。"
            : "This page is most valuable when you already know what kind of resources you want, but do not want to hand-build the route inside the map. It works best for regional sweeps, daily cleanup, and late-patch collection catch-up when you are filling the gaps left behind earlier."}
        </p>
      </section>

      {/* Tab navigation */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard tab */}
      {activeTab === "dashboard" && (
        <ExplorerDashboard
          markers={allMarkers}
          progress={progress}
          markerTypes={markerTypes}
          regions={regions}
          lang={lang}
          onShare={() => setShareOpen(true)}
        />
      )}

      {/* Sweep tab */}
      {activeTab === "sweep" && (
        <div className="space-y-4">
          {/* Region + type selectors */}
          {!isSweeping && (
            <>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  {t(lang, "explorer.selectRegion")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      selectedRegion === null
                        ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                        : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {t(lang, "explorer.allRegions")}
                  </button>
                  {Object.entries(regions).map(([id, info]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedRegion(id)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                        selectedRegion === id
                          ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                          : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                      {isZh ? info.zh : info.en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  {t(lang, "explorer.selectTypes")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(markerTypes).map(([id, info]) => (
                    <button
                      key={id}
                      onClick={() => toggleType(id)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                        selectedTypes.has(id)
                          ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                          : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                      {isZh ? info.label : info.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startSweep}
                disabled={!selectedRegion && selectedTypes.size === 0}
                className="w-full py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t(lang, "explorer.startSweep")}
              </button>
            </>
          )}

          {/* Completion celebration */}
          {isSweeping && sweepComplete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-gray-900 border border-primary-500/30 rounded-2xl w-full max-w-sm p-6 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {t(lang, "explorer.sweepSummaryTitle")}
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs">{t(lang, "explorer.markersCollected")}</div>
                    <div className="text-white font-bold mt-1">{sweepCollectedCount}/{sweepRoute.length}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs">{t(lang, "explorer.timeSpent")}</div>
                    <div className="text-white font-bold mt-1">
                      {sweepStartTime ? formatDuration(Date.now() - sweepStartTime) : "—"}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs">{t(lang, "explorer.beforeProgress")}</div>
                    <div className="text-gray-400 font-bold mt-1">{initialPercent}%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs">{t(lang, "explorer.afterProgress")}</div>
                    <div className="text-primary-400 font-bold mt-1">{totalPercent}%</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShareOpen(true); }}
                    className="flex-1 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    {t(lang, "explorer.shareProgress")}
                  </button>
                  <button
                    onClick={stopSweep}
                    className="flex-1 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    {t(lang, "explorer.stopSweep")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active sweep */}
          {isSweeping && !sweepComplete && (
            <>
              {/* Sweep header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-300">
                    {t(lang, "explorer.sweepRoute")}
                  </span>
                  <span className="text-xs text-primary-400">
                    {t(lang, "explorer.waypoints", String(sweepRoute.length))}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t(lang, "explorer.routeDistance", String(routeDistance))}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t(lang, "explorer.estimatedTime", estTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile map toggle */}
                  <button
                    onClick={() => setShowMap((v) => !v)}
                    className="lg:hidden px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    {t(lang, "explorer.toggleMap")}
                  </button>
                  <button
                    onClick={stopSweep}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-red-400 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    {t(lang, "explorer.stopSweep")}
                  </button>
                </div>
              </div>

              {sweepRoute.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
                  <p className="text-primary-400 text-lg font-medium">
                    {t(lang, "explorer.noUncollected")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Map — hideable on mobile */}
                  {showMap && (
                    <div className={`lg:w-3/5 rounded-xl border border-gray-800 overflow-hidden ${showMap ? "h-[200px] lg:h-[400px]" : ""}`}>
                      <ExplorerSweepMap
                        map={mapInfo}
                        markers={sweepRoute}
                        collectedIds={sweepCollected}
                        activeIndex={activeIndex}
                        onMarkerClick={handleMarkerClick}
                      />
                    </div>
                  )}

                  {/* Checklist */}
                  <div className={`rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col ${showMap ? "lg:w-2/5 max-h-[400px]" : "w-full max-h-[60vh]"}`}>
                    <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-300">
                        {t(lang, "explorer.checklist")}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {sweepCollectedCount}/{sweepRoute.length}
                      </span>
                    </div>
                    <div className="overflow-y-auto flex-1 scrollbar-hide">
                      {sweepRoute.map((marker, idx) => {
                        const isCollected = !!progress[marker.id];
                        const isActive = idx === activeIndex;
                        const typeInfo = markerTypes[marker.type];
                        return (
                          <div
                            key={marker.id}
                            onClick={() => {
                              setActiveIndex(idx);
                              if (!isCollected) handleChecklistToggle(idx);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 lg:py-2 min-h-[44px] lg:min-h-0 cursor-pointer transition-colors border-l-2 ${
                              isActive
                                ? "bg-primary-500/10 border-l-primary-400"
                                : "border-l-transparent hover:bg-gray-800/30"
                            } ${isCollected ? "opacity-50" : ""}`}
                          >
                            <span className="text-[10px] text-gray-600 w-5 text-center shrink-0">
                              {idx + 1}
                            </span>
                            <div
                              className={`w-5 h-5 lg:w-4 lg:h-4 rounded border flex items-center justify-center shrink-0 ${
                                isCollected
                                  ? "bg-green-500/30 border-green-500"
                                  : "border-gray-600"
                              }`}
                            >
                              {isCollected && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: typeInfo?.color || "#888" }}
                            />
                            <span className={`text-xs lg:text-xs truncate ${isCollected ? "line-through text-gray-600" : "text-gray-300"}`}>
                              {isZh ? marker.name : marker.nameEn}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Progress bar + undo */}
                    <div className="px-3 py-2 border-t border-gray-800 flex items-center gap-2">
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden flex-1">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-300"
                          style={{ width: `${sweepPercent}%` }}
                        />
                      </div>
                      {undoStack.length > 0 && (
                        <button
                          onClick={handleUndo}
                          className="text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors shrink-0"
                        >
                          {t(lang, "explorer.undoCollect")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Daily/Weekly tab */}
      {activeTab === "daily" && (
        <div className="space-y-4">
          {daily.length === 0 && weekly.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
              <p className="text-gray-500 text-sm">
                {t(lang, "explorer.noDailyMarkers")}
              </p>
            </div>
          ) : (
            <>
              {daily.length > 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-300">
                      {t(lang, "explorer.dailyMarkers")}
                    </h3>
                    <button
                      onClick={handleResetDaily}
                      className="text-xs px-3 py-1 rounded bg-gray-800 text-red-400 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      {t(lang, "explorer.resetDaily")}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {daily.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 py-1">
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center cursor-pointer ${
                            progress[m.id]
                              ? "bg-green-500/30 border-green-500"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          onClick={() => handleToggle(m.id)}
                        >
                          {progress[m.id] && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-300">
                          {isZh ? m.name : m.nameEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {weekly.length > 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">
                    {t(lang, "explorer.weeklyMarkers")}
                  </h3>
                  <div className="space-y-1">
                    {weekly.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 py-1">
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center cursor-pointer ${
                            progress[m.id]
                              ? "bg-green-500/30 border-green-500"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          onClick={() => handleToggle(m.id)}
                        >
                          {progress[m.id] && (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-300">
                          {isZh ? m.name : m.nameEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Share card modal */}
      <ExplorerShareCard
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        nickname={nickname}
        onNicknameChange={handleNicknameChange}
        playerId={playerId}
        onPlayerIdChange={handlePlayerIdChange}
        collectedCount={sweepRoute.length > 0 ? sweepCollectedCount : countCollected(progress, allMarkers.map((m) => m.id))}
        totalCount={sweepRoute.length > 0 ? sweepRoute.length : allMarkers.length}
        percent={sweepRoute.length > 0 ? sweepPercent : totalPercent}
        regionName={currentRegionName}
        lang={lang}
      />

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-base font-semibold text-white">
            {isZh ? "扫图前先确认" : "Check this before a sweep"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{isZh ? "先限定区域或类型，不然路线会又长又杂。" : "Limit the region or marker type first, or the route becomes too long and noisy."}</li>
            <li>{isZh ? "确认你的进度记录是新的，这会直接影响路径质量。" : "Make sure your progress data is current, because route quality depends on it."}</li>
            <li>{isZh ? "把每日、每周与一次性收集拆开处理，效率更稳定。" : "Treat daily, weekly, and one-time pickups separately for steadier efficiency."}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
          <h2 className="text-base font-semibold text-white">
            {isZh ? "这页特别适合解决的事" : "What this page solves especially well"}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
            <li>{isZh ? "帮你把零散补漏变成一条能执行的路线。" : "Turning scattered cleanup into an executable route."}</li>
            <li>{isZh ? "帮助多人账号或多设备玩家保持统一进度认知。" : "Helping multi-device or shared-account players keep progress aligned."}</li>
            <li>{isZh ? "减少因为漏点、回头路和重复检查带来的时间浪费。" : "Reducing wasted time from missed markers, backtracking, and duplicate checks."}</li>
          </ul>
        </div>
      </section>

      {/* SEO text block */}
      <div className="mt-8 text-xs text-gray-600 max-w-3xl space-y-2">
        <p>
          {isZh
            ? "异环探索伴侣提供智能扫图路线规划、收集进度追踪、每日/每周刷新提醒等功能。按区域和类型筛选标点，优化收集路径，记录探索进度，帮助玩家高效完成异环世界全收集。"
            : "The NTE Exploration Companion provides intelligent sweep route planning, collection progress tracking, and daily/weekly respawn tracking. Filter markers by region and type, optimize collection routes, and track exploration progress to help players efficiently complete collection in the Neverness to Everness world."}
        </p>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: isZh
              ? "异环探索伴侣 - 扫图模式 | NTE Guide"
              : "NTE Exploration Companion - Sweep Mode | Neverness to Everness",
            description: isZh
              ? "异环探索伴侣：优化收集路线、追踪收集进度"
              : "Optimized collection routes and exploration progress tracker for Neverness to Everness",
            url: `https://nteguide.com/${lang}/explorer`,
            applicationCategory: "GameApplication",
            operatingSystem: "Web Browser",
            offers: { "@type": "Offer", price: "0" },
            ...(isZh
              ? {}
              : {
                  subjectOf: {
                    "@type": "VideoGame",
                    name: "Neverness to Everness",
                    gamePlatform: "PC, Mobile",
                  },
                }),
          }),
        }}
      />
    </div>
  );
}
