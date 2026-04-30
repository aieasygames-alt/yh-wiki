"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { isZhLocale, Locale } from "../../../lib/i18n";
import type { MapMarker, MapInfo, MarkerTypeInfo } from "../../../lib/map-utils";
import {
  loadProgress,
  toggleMarker,
  saveProgress,
  clearProgress,
  loadFilters,
  saveFilters,
  progressPercent,
} from "../../../lib/map-progress";
import mapData from "../../../data/map-markers.json";

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

import MapSidebar from "../../../components/MapSidebar";
import MapMarkerDetail from "../../../components/MapMarkerDetail";
import MapSearch from "../../../components/MapSearch";
import MapProgressBar from "../../../components/MapProgressBar";
import MapRoutePlanner from "../../../components/MapRoutePlanner";

const data = mapData as {
  maps: MapInfo[];
  markerTypes: Record<string, MarkerTypeInfo>;
};

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

  const [activeMap, setActiveMap] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(Object.keys(data.markerTypes))
  );
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideCollected, setHideCollected] = useState(false);
  const [routeMarkerIds, setRouteMarkerIds] = useState<string[]>([]);

  // Load progress, filters and route on mount
  useEffect(() => {
    setProgress(loadProgress());
    const saved = loadFilters();
    if (saved) setActiveFilters(new Set(saved));
    // Load route from URL
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get("route");
    if (routeParam) {
      setRouteMarkerIds(routeParam.split(","));
    }
  }, []);

  const map = data.maps[activeMap];
  const markerTypes = data.markerTypes;

  const filteredMarkers = useMemo(() => {
    if (!map) return [];
    return map.markers.filter(
      (m) => activeFilters.has(m.type) && (!hideCollected || !progress[m.id])
    );
  }, [map, activeFilters, hideCollected, progress]);

  const nearbyMarkers = useMemo(() => {
    if (!selectedMarker || !map) return [];
    return findNearby(selectedMarker, map.markers);
  }, [selectedMarker, map]);

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

      {/* Map selector — flat scrolling buttons */}
      {data.maps.length > 1 && (
        <div className={`mb-4 ${isFullscreen ? "hidden" : ""}`}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {data.maps.map((m, i) => (
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
                {m.markers.length > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    {progressPercent(progress, m.markers.map((mk) => mk.id))}%
                  </span>
                )}
              </button>
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
              markers={map.markers}
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
            <div className="mt-3 lg:hidden fixed inset-x-0 bottom-0 z-40">
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
          )}
        </div>
      </div>

      {/* SEO text block — hidden in fullscreen */}
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
