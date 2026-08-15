"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { isZhLocale, Locale } from "../../../lib/i18n";
import type { MapMarker } from "../../../lib/map-utils";
import {
  loadProgress,
  toggleMarker,
  saveProgress,
  clearProgress,
  loadFilters,
  saveFilters,
  progressPercent,
} from "../../../lib/map-progress";
import { useMapData, useRegionMarkers } from "../../../lib/use-map-data";

const InteractiveMap = dynamic(
  () => import("../../../components/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-xl bg-gray-800 animate-pulse"
        style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}
      />
    ),
  }
);

const MapSearch = dynamic(
  () => import("../../../components/MapSearch"),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 rounded-lg border border-gray-800 bg-gray-900/50 animate-pulse" />
    ),
  }
);

const MapRoutePlanner = dynamic(
  () => import("../../../components/MapRoutePlanner"),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 rounded-xl border border-gray-800 bg-gray-900/50 animate-pulse" />
    ),
  }
);

const MapMarkerDetail = dynamic(
  () => import("../../../components/MapMarkerDetail"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 rounded-xl border border-gray-800 bg-gray-900/50 animate-pulse" />
    ),
  }
);

import MapSidebar from "../../../components/MapSidebar";
import MapProgressBar from "../../../components/MapProgressBar";

/** Find markers within radius of a given marker */
function findNearby(
  marker: MapMarker,
  allMarkers: MapMarker[],
  radius: number = 15,
  limit: number = 6
): MapMarker[] {
  return allMarkers
    .filter((m) => m.id !== marker.id)
    .map((m) => ({
      marker: m,
      dist: Math.sqrt((m.x - marker.x) ** 2 + (m.y - marker.y) ** 2),
    }))
    .filter(({ dist }) => dist <= radius)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(({ marker }) => marker);
}

export default function MapPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Lazy-loaded data
  const { maps, markerTypes, regions, loading: coreLoading } = useMapData();
  const allRegionIds = useMemo(() => Object.keys(regions), [regions]);
  const { markers: allMarkers, loading: markersLoading } = useRegionMarkers(null, allRegionIds);

  const [activeMap, setActiveMap] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideCollected, setHideCollected] = useState(false);
  const [routeMarkerIds, setRouteMarkerIds] = useState<string[]>([]);

  // Init filters once markerTypes loaded
  useEffect(() => {
    if (Object.keys(markerTypes).length && !activeFilters.size) {
      const saved = loadFilters();
      setActiveFilters(saved ? new Set(saved) : new Set(Object.keys(markerTypes)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerTypes]);

  // Load progress, route, and marker deep link on mount
  useEffect(() => {
    setProgress(loadProgress());
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get("route");
    if (routeParam) setRouteMarkerIds(routeParam.split(","));
  }, []);

  // Deep link: resolve marker after data loads
  useEffect(() => {
    if (coreLoading || markersLoading || !allMarkers.length) return;
    const params = new URLSearchParams(window.location.search);
    const markerParam = params.get("marker");
    if (markerParam) {
      const marker = allMarkers.find((m) => m.id === markerParam);
      if (marker) setSelectedMarker(marker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when data ready
  }, [coreLoading, markersLoading, allMarkers]);

  const map = maps[activeMap];
  const dataLoading = coreLoading || markersLoading;

  const filteredMarkers = useMemo(() => {
    if (dataLoading) return [];
    return allMarkers.filter(
      (m) =>
        activeFilters.has(m.type) &&
        (!hideCollected || !progress[m.id]) &&
        (!activeRegion || m.region === activeRegion)
    );
  }, [allMarkers, activeFilters, hideCollected, progress, activeRegion, dataLoading]);

  const nearbyMarkers = useMemo(() => {
    if (!selectedMarker || dataLoading) return [];
    return findNearby(selectedMarker, allMarkers);
  }, [selectedMarker, allMarkers, dataLoading]);

  const toggleFilter = useCallback((type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      saveFilters(next);
      return next;
    });
    setSelectedMarker(null);
  }, []);

  const handleSelectMarker = useCallback((marker: MapMarker | null) => {
    setSelectedMarker(marker);
  }, []);

  // Sync selected marker to URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (selectedMarker) {
      params.set("marker", selectedMarker.id);
    } else {
      params.delete("marker");
    }
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [selectedMarker]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMarker(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleToggleCollect = useCallback(
    (markerId: string) => {
      const next = toggleMarker(progress, markerId);
      setProgress(next);
      saveProgress(next);
    },
    [progress]
  );

  const handleClearProgress = useCallback(() => {
    const empty = clearProgress();
    setProgress(empty);
  }, []);

  // Fullscreen toggle
  const handleFullscreen = useCallback(() => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (dataLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            {isZhLocale(lang) ? "异环互动地图" : "NTE Interactive Map"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
            {isZhLocale(lang)
              ? "异环互动地图用于查看区域、标点、收集物和路线规划。建议先按区域和标点类型缩小范围，再结合隐藏已收集与路线规划功能处理每日探索、材料路线和版本补漏。"
              : "The NTE interactive map helps you review regions, markers, collectibles, and route plans. Start by narrowing the map by region and marker type, then use hide-collected and route planning for daily exploration, material routes, and patch cleanup."}
          </p>
        </div>
        <div className="w-full rounded-xl bg-gray-800 animate-pulse" style={{ height: "calc(100vh - 200px)", minHeight: "400px" }} />
      </div>
    );
  }

  if (!map) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">
          {isZhLocale(lang) ? "异环地图标点" : "NTE Interactive Map"}
        </h1>
        <p className="text-gray-400">
          {isZhLocale(lang) ? "暂无标记" : "No markers available"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={`max-w-[1600px] mx-auto px-2 sm:px-4 py-4 sm:py-6 ${
        isFullscreen ? "bg-gray-950 p-2" : ""
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 ${isFullscreen ? "hidden" : ""}`}>
        <h1 className="text-xl sm:text-2xl font-bold">
          {isZhLocale(lang) ? "异环互动地图" : "NTE Interactive Map"}
        </h1>
        <div className="flex items-center gap-2">
          {/* Sidebar toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 border border-gray-700"
          >
            {sidebarOpen
              ? isZhLocale(lang)
                ? "隐藏面板"
                : "Hide Panel"
              : isZhLocale(lang)
              ? "显示面板"
              : "Show Panel"}
          </button>
          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:text-gray-300 transition-colors"
            title={isZhLocale(lang) ? "全屏" : "Fullscreen"}
          >
            {isFullscreen ? "✕" : "⛶"}
          </button>
          {/* Hide collected */}
          <button
            onClick={() => setHideCollected(!hideCollected)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              hideCollected
                ? "bg-primary-500/20 text-primary-400 border-primary-500/30"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-300"
            }`}
          >
            {isZhLocale(lang) ? "隐藏已收集" : "Hide Collected"}
          </button>
          {/* Clear progress */}
          <button
            onClick={handleClearProgress}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-500 border border-gray-700 hover:text-gray-300 transition-colors"
          >
            {isZhLocale(lang) ? "重置进度" : "Reset Progress"}
          </button>
        </div>
      </div>

      {!isFullscreen && (
        <section className="mb-4 rounded-2xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-base font-semibold text-white">
            {isZhLocale(lang) ? "这张地图最适合怎么用？" : "What is the best way to use this map?"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            {isZhLocale(lang)
              ? "最有效的方式不是一次把所有标点都打开，而是先按区域和材料类型缩小范围，再配合隐藏已收集功能把当前版本最急需的路线刷完。这个页面更适合做实战探索和补漏，而不是只当作静态坐标表浏览。"
              : "The best workflow is not turning on every marker at once. Narrow the map by region and marker type first, then use Hide Collected to finish the routes that matter most for your current patch goals. This page is meant for active exploration and cleanup, not just passive coordinate browsing."}
          </p>
        </section>
      )}

      {/* Map selector — flat scrolling buttons */}
      {maps.length > 1 && (
        <div className={`mb-4 ${isFullscreen ? "hidden" : ""}`}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {maps.map((m, i) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMap(i);
                  setSelectedMarker(null);
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeMap === i
                    ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {isZhLocale(lang) ? m.name : m.nameEn}
                {allMarkers.length > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    {progressPercent(progress, allMarkers.map((mk) => mk.id))}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Region filter */}
      {regions && Object.keys(regions).length > 0 && (
        <div className={`mb-4 ${isFullscreen ? "hidden" : ""}`}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveRegion(null)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                activeRegion === null
                  ? "bg-gray-600/30 text-gray-200 border border-gray-500/40"
                  : "bg-gray-800 text-gray-500 border border-gray-700 hover:text-gray-300"
              }`}
            >
              {isZhLocale(lang) ? "全部区域" : "All Regions"}
            </button>
            {Object.entries(regions).map(([rid, info]) => {
              const count = allMarkers.filter((m) => m.region === rid).length;
              return (
                <button
                  key={rid}
                  onClick={() => setActiveRegion(activeRegion === rid ? null : rid)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap flex-shrink-0 border ${
                    activeRegion === rid
                      ? "text-white"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:text-gray-300"
                  }`}
                  style={
                    activeRegion === rid
                      ? { backgroundColor: info.color + "30", borderColor: info.color + "60" }
                      : undefined
                  }
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: info.color }}
                  />
                  {isZhLocale(lang) ? info.zh : info.en}
                  <span className="text-gray-500 ml-1">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {Object.entries(regions).map(([rid, info]) => (
              <a
                key={rid}
                href={`/${lang}/map/region/${rid}/`}
                className="flex-shrink-0 rounded-lg border border-gray-800 bg-gray-900/40 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-primary-500/40 hover:text-primary-400"
              >
                {isZhLocale(lang) ? `${info.zh}攻略` : `${info.en} Guide`}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main layout: sidebar + map */}
      <div className="flex gap-4 relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block w-72 flex-shrink-0`}
        >
          <div className="sticky top-20 space-y-3">
            {/* Search */}
            <MapSearch
              markers={allMarkers}
              onSelectMarker={handleSelectMarker}
              lang={lang}
            />

            {/* Progress bar */}
            <MapProgressBar
              markers={filteredMarkers}
              progress={progress}
              lang={lang}
            />

            {/* Route planner */}
            <MapRoutePlanner
              markers={filteredMarkers}
              markerTypes={markerTypes}
              routeMarkerIds={routeMarkerIds}
              onRouteChange={setRouteMarkerIds}
              lang={lang}
            />

            {/* Category tree + marker list */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
              <div className="h-[calc(100vh-420px)] min-h-[300px]">
                <MapSidebar
                  markers={filteredMarkers}
                  markerTypes={markerTypes}
                  selectedMarker={selectedMarker}
                  activeFilters={activeFilters}
                  onToggleFilter={toggleFilter}
                  onSelectMarker={handleSelectMarker}
                  progress={progress}
                  lang={lang}
                />
              </div>
            </div>

            {/* Selected marker detail */}
            {selectedMarker && (
              <MapMarkerDetail
                marker={selectedMarker}
                typeInfo={markerTypes[selectedMarker.type]}
                progress={progress}
                nearbyMarkers={nearbyMarkers}
                onToggleCollect={handleToggleCollect}
                onClose={() => setSelectedMarker(null)}
                onSelectMarker={handleSelectMarker}
                onAddToRoute={(id) => setRouteMarkerIds(prev => prev.includes(id) ? prev : [...prev, id])}
                isInRoute={routeMarkerIds.includes(selectedMarker.id)}
                lang={lang}
              />
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <InteractiveMap
              map={map}
              markers={filteredMarkers}
              markerTypes={markerTypes}
              selectedMarker={selectedMarker}
              onSelectMarker={handleSelectMarker}
              progress={progress}
              lang={lang}
              routeMarkerIds={routeMarkerIds}
            />
          </div>

          {/* Mobile bottom sheet */}
          {selectedMarker && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
                onClick={() => setSelectedMarker(null)}
              />
              <div className="mt-3 lg:hidden fixed inset-x-0 bottom-0 z-[60]">
                <div
                className="bg-gray-900 border-t border-gray-700 rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto"
                onTouchStart={(e) => {
                  const startY = (e.touches[0].clientY);
                  const el = e.currentTarget;
                  const onClose = () => setSelectedMarker(null);
                  function onMove(ev: TouchEvent) {
                    const dy = startY - ev.touches[0].clientY;
                    if (dy < -60) {
                      cleanup();
                      onClose();
                    }
                  }
                  function cleanup() {
                    el.removeEventListener("touchmove", onMove);
                    el.removeEventListener("touchend", cleanup);
                  }
                  el.addEventListener("touchmove", onMove);
                  el.addEventListener("touchend", cleanup);
                }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-8 h-1 rounded-full bg-gray-700" />
                </div>
                <MapMarkerDetail
                  marker={selectedMarker}
                  typeInfo={markerTypes[selectedMarker.type]}
                  progress={progress}
                  nearbyMarkers={nearbyMarkers}
                  onToggleCollect={handleToggleCollect}
                  onClose={() => setSelectedMarker(null)}
                  onSelectMarker={handleSelectMarker}
                  lang={lang}
                />
              </div>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Cross-link to Explorer */}
      {!isFullscreen && (
        <div className="mt-6">
          <a
            href={`/${lang}/explorer`}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-primary-500/30 hover:bg-gray-900/70 transition-colors group"
          >
            <span className="text-2xl">🗺️</span>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-300 group-hover:text-primary-400 transition-colors">
                {isZhLocale(lang) ? "探索伴侣 - 扫图模式" : "Exploration Companion - Sweep Mode"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isZhLocale(lang) ? "智能路线规划，追踪收集进度" : "Smart route planning & collection progress tracking"}
              </p>
            </div>
            <span className="text-gray-600 group-hover:text-primary-400 transition-colors">→</span>
          </a>
        </div>
      )}

      {/* SEO text block — hidden in fullscreen */}
      {!isFullscreen && (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(lang) ? "高效跑图建议" : "Efficient route habits"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(lang) ? "先按材料或任务目标筛一遍，再决定是否切换区域。" : "Filter by material or objective first, then decide whether a region switch is worth it."}</li>
              <li>{isZhLocale(lang) ? "把高价值标点和顺路收集分开看，路线会更清楚。" : "Separate high-value pickups from optional detours so the route stays clean."}</li>
              <li>{isZhLocale(lang) ? "补漏时优先隐藏已收集点，避免重复来回。" : "Hide collected markers during cleanup to avoid redundant backtracking."}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5">
            <h2 className="text-base font-semibold text-white">
              {isZhLocale(lang) ? "常见误区" : "Common mistakes"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-300">
              <li>{isZhLocale(lang) ? "一次加载过多标记，结果反而看不出真正要跑的路线。" : "Showing too many marker types at once until the useful route disappears."}</li>
              <li>{isZhLocale(lang) ? "只记坐标，不记区域层级和附近传送点。" : "Remembering coordinates but forgetting region layers or nearby teleports."}</li>
              <li>{isZhLocale(lang) ? "不记录进度，导致每次回图都像重新开始。" : "Skipping progress tracking so every revisit feels like starting over."}</li>
            </ul>
          </div>
        </section>
      )}

      {!isFullscreen && (
        <div className="mt-8 text-xs text-gray-600 max-w-3xl space-y-2">
          <p>
            {isZhLocale(lang)
              ? "异环互动地图提供全地图资源标记，包括副本入口、世界BOSS位置、材料采集点、传送锚点、宝箱位置、解谜挑战、NPC商店和观景点。支持分类筛选和收集进度追踪，帮助玩家高效探索异环世界。"
              : "The NTE Interactive Map provides full resource markers including domain entrances, world boss locations, material collection points, teleport waypoints, chest locations, puzzle challenges, NPC shops, and viewpoints. Filter by category and track your collection progress."}
          </p>
        </div>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: isZhLocale(lang)
              ? "异环互动地图 - NTE Guide"
              : "NTE Interactive Map - Neverness to Everness Guide",
            description: isZhLocale(lang)
              ? "异环(NTE)全资源互动地图，包含宝箱、采集点、BOSS位置等标记"
              : "Complete NTE interactive map with all chests, resources, and boss locations",
            applicationCategory: "GameApplication",
            operatingSystem: "Web Browser",
            offers: { "@type": "Offer", price: "0" },
            ...(isZhLocale(lang)
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
