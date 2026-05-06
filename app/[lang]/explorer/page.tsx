"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import type { Locale } from "../../../lib/i18n";
import { t, isZhLocale } from "../../../lib/i18n";
import { loadProgress, saveProgress, toggleMarker, countCollected, progressPercent } from "../../../lib/map-progress";
import type { MapMarker } from "../../../lib/map-utils";
import {
  optimizeRoute,
  estimateCompletionTime,
  filterUncollected,
  filterByRegionAndType,
  getDailyWeeklyMarkers,
  resetDailyProgress,
} from "../../../lib/explorer-utils";
import ExplorerDashboard from "../../../components/ExplorerDashboard";
import mapData from "../../../data/map-markers.json";

const ExplorerSweepMap = dynamic(
  () => import("../../../components/ExplorerSweepMap"),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[300px] bg-gray-900 rounded-lg animate-pulse" /> }
);

type TabKey = "dashboard" | "sweep" | "daily";

const regions = (mapData as any).regions as Record<string, { zh: string; en: string; color: string }>;
const markerTypes = (mapData as any).markerTypes as Record<string, { color: string; label: string; labelEn: string }>;
const maps = (mapData as any).maps as Array<{ id: string; name: string; nameEn: string; image: string; description: string; descriptionEn: string; minZoom: number; maxZoom: number; bounds: [[number, number], [number, number]]; markers: MapMarker[] }>;
const allMarkers: MapMarker[] = maps.length > 0 ? maps[0].markers : [];
const mapInfo = maps[0];

export default function ExplorerPage() {
  const params = useParams();
  const lang = (params.lang || "en") as Locale;
  const isZh = isZhLocale(lang);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  // Sweep state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [isSweeping, setIsSweeping] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    setProgress(loadProgress());
  }, []);

  // Toggle a marker and save
  const handleToggle = useCallback(
    (markerId: string) => {
      const next = toggleMarker(progress, markerId);
      setProgress(next);
      saveProgress(next);
    },
    [progress]
  );

  // Sweep route: filter + optimize
  const sweepRoute = useMemo(() => {
    if (!isSweeping) return [];
    const filtered = filterByRegionAndType(allMarkers, selectedRegion, selectedTypes);
    const uncollected = filterUncollected(filtered, progress);
    if (uncollected.length === 0) return [];
    if (uncollected.length > 500) return optimizeRoute(uncollected.slice(0, 500));
    return optimizeRoute(uncollected);
  }, [isSweeping, selectedRegion, selectedTypes, progress]);

  const sweepCollected = useMemo(
    () => new Set(sweepRoute.filter((m) => progress[m.id]).map((m) => m.id)),
    [sweepRoute, progress]
  );

  const estTime = useMemo(
    () => estimateCompletionTime(sweepRoute, progress),
    [sweepRoute, progress]
  );

  // Start sweep
  const startSweep = () => {
    if (!selectedRegion && selectedTypes.size === 0) return;
    const filtered = filterByRegionAndType(allMarkers, selectedRegion, selectedTypes);
    const uncollected = filterUncollected(filtered, progress);
    if (uncollected.length === 0) return;
    setIsSweeping(true);
    setActiveIndex(0);
    setActiveTab("sweep");
  };

  const stopSweep = () => {
    setIsSweeping(false);
    setActiveIndex(0);
  };

  // Handle marker click on map
  const handleMarkerClick = useCallback(
    (marker: MapMarker, idx: number) => {
      if (!progress[marker.id]) {
        handleToggle(marker.id);
        // Move to next uncollected
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
  const handleChecklistToggle = (idx: number) => {
    const marker = sweepRoute[idx];
    if (!marker) return;
    handleToggle(marker.id);
    // Find next uncollected
    for (let i = idx + 1; i < sweepRoute.length; i++) {
      if (!progress[sweepRoute[i].id]) {
        setActiveIndex(i);
        return;
      }
    }
  };

  // Daily/Weekly
  const { daily, weekly } = useMemo(() => getDailyWeeklyMarkers(allMarkers), []);

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

  if (!mounted) {
    return <div className="max-w-6xl mx-auto px-4 py-12"><div className="animate-pulse h-96 bg-gray-900 rounded-xl" /></div>;
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "dashboard", label: t(lang, "explorer.tabDashboard") },
    { key: "sweep", label: t(lang, "explorer.tabSweep") },
    { key: "daily", label: t(lang, "explorer.tabDaily") },
  ];

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
        />
      )}

      {/* Sweep tab */}
      {activeTab === "sweep" && (
        <div className="space-y-4">
          {/* Region + type selectors */}
          {!isSweeping && (
            <>
              {/* Region selector */}
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
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                      {isZh ? info.zh : info.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type selector */}
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
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                      {isZh ? info.label : info.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start button */}
              <button
                onClick={startSweep}
                disabled={!selectedRegion && selectedTypes.size === 0}
                className="w-full py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t(lang, "explorer.startSweep")}
              </button>
            </>
          )}

          {/* Active sweep */}
          {isSweeping && (
            <>
              {/* Sweep header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">
                    {t(lang, "explorer.sweepRoute")}
                  </span>
                  <span className="text-xs text-primary-400">
                    {t(lang, "explorer.waypoints", String(sweepRoute.length))}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t(lang, "explorer.estimatedTime", estTime)}
                  </span>
                </div>
                <button
                  onClick={stopSweep}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-red-400 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  {t(lang, "explorer.stopSweep")}
                </button>
              </div>

              {sweepRoute.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
                  <p className="text-primary-400 text-lg font-medium">
                    {t(lang, "explorer.noUncollected")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Map */}
                  <div className="lg:w-3/5 h-[400px] rounded-xl border border-gray-800 overflow-hidden">
                    <ExplorerSweepMap
                      map={mapInfo}
                      markers={sweepRoute}
                      collectedIds={sweepCollected}
                      activeIndex={activeIndex}
                      onMarkerClick={handleMarkerClick}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="lg:w-2/5 rounded-xl border border-gray-800 bg-gray-900/50 flex flex-col max-h-[400px]">
                    <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-300">
                        {t(lang, "explorer.checklist")}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {countCollected(progress, sweepRoute.map((m) => m.id))}/{sweepRoute.length}
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
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors border-l-2 ${
                              isActive
                                ? "bg-primary-500/10 border-l-primary-400"
                                : "border-l-transparent hover:bg-gray-800/30"
                            } ${isCollected ? "opacity-50" : ""}`}
                          >
                            {/* Number */}
                            <span className="text-[10px] text-gray-600 w-5 text-center shrink-0">
                              {idx + 1}
                            </span>
                            {/* Checkbox */}
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
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
                            {/* Type dot */}
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: typeInfo?.color || "#888" }}
                            />
                            {/* Name */}
                            <span className={`text-xs truncate ${isCollected ? "line-through text-gray-600" : "text-gray-300"}`}>
                              {isZh ? marker.name : marker.nameEn}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Progress bar */}
                    <div className="px-3 py-2 border-t border-gray-800">
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPercent(progress, sweepRoute.map((m) => m.id))}%`,
                          }}
                        />
                      </div>
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t(lang, "explorer.title"),
            description: t(lang, "explorer.description"),
            url: `https://nteguide.com/${lang}/explorer`,
            isPartOf: {
              "@type": "WebSite",
              name: isZh ? "异环 Wiki" : "NTE Guide",
              url: "https://nteguide.com",
            },
          }),
        }}
      />
    </div>
  );
}
