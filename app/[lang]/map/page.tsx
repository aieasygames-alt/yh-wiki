"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { isZhLocale, Locale } from "../../../lib/i18n";
import type { MapMarker, MapInfo, MarkerTypeInfo } from "../../../lib/map-utils";
import {
  loadProgress,
  toggleMarker,
  saveProgress,
  clearProgress,
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

const data = mapData as {
  maps: MapInfo[];
  markerTypes: Record<string, MarkerTypeInfo>;
};

export default function MapPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const [activeMap, setActiveMap] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(Object.keys(data.markerTypes))
  );
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load progress on mount
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const map = data.maps[activeMap];
  const markerTypes = data.markerTypes;

  const filteredMarkers = useMemo(() => {
    if (!map) return [];
    return map.markers.filter((m) => activeFilters.has(m.type));
  }, [map, activeFilters]);

  const toggleFilter = useCallback((type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
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
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
          {/* Clear progress */}
          <button
            onClick={handleClearProgress}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-500 border border-gray-700 hover:text-gray-300 transition-colors"
          >
            {isZhLocale(lang) ? "重置进度" : "Reset Progress"}
          </button>
        </div>
      </div>

      {/* Map selector */}
      {data.maps.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {data.maps.map((m, i) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMap(i);
                setSelectedMarker(null);
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                activeMap === i
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              {isZhLocale(lang) ? m.name : m.nameEn}
            </button>
          ))}
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
                onToggleCollect={handleToggleCollect}
                onClose={() => setSelectedMarker(null)}
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
            />
          </div>

          {/* Mobile marker detail (below map) */}
          {selectedMarker && (
            <div className="mt-3 lg:hidden">
              <MapMarkerDetail
                marker={selectedMarker}
                typeInfo={markerTypes[selectedMarker.type]}
                progress={progress}
                onToggleCollect={handleToggleCollect}
                onClose={() => setSelectedMarker(null)}
                lang={lang}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
