"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, type Locale } from "../../../lib/i18n";
import { getMaterialById } from "../../../lib/queries";
import type { MapMarker, MapInfo, MarkerTypeInfo } from "../../../lib/map-utils";
import mapData from "../../../data/map-markers.json";

const InteractiveMap = dynamic(
  () => import("../../../components/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl bg-gray-800 animate-pulse" style={{ height: "calc(100vh - 280px)", minHeight: "400px" }} />
    ),
  }
);

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

  const map = data.maps[activeMap];
  const markerTypes = data.markerTypes;

  const filteredMarkers = useMemo(() => {
    if (!map) return [];
    return map.markers.filter((m) => activeFilters.has(m.type));
  }, [map, activeFilters]);

  const toggleFilter = useCallback((type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
    setSelectedMarker(null);
  }, []);

  const handleSelectMarker = useCallback((marker: MapMarker | null) => {
    setSelectedMarker(marker);
  }, []);

  if (!map) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t(lang, "map.title")}</h1>
        <p className="text-gray-400">{t(lang, "map.noMarker")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t(lang, "map.title")}</h1>

      {/* Map Select */}
      {data.maps.length > 1 && (
        <div className="flex gap-2 mb-4">
          {data.maps.map((m, i) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMap(i);
                setSelectedMarker(null);
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeMap === i
                  ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                  : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              {lang === "zh" ? m.name : m.nameEn}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(markerTypes).map(([type, info]) => {
          const active = activeFilters.has(type);
          return (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                active
                  ? "border"
                  : "bg-gray-800 text-gray-600 border border-gray-700"
              }`}
              style={
                active
                  ? {
                      backgroundColor: `${info.color}20`,
                      borderColor: `${info.color}50`,
                      color: info.color,
                    }
                  : undefined
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: active ? info.color : "#4b5563" }}
              />
              {lang === "zh" ? info.label : info.labelEn}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <InteractiveMap
              map={map}
              markers={filteredMarkers}
              markerTypes={markerTypes}
              selectedMarker={selectedMarker}
              onSelectMarker={handleSelectMarker}
              lang={lang}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Selected Marker Detail */}
          {selectedMarker && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: markerTypes[selectedMarker.type]?.color }}
                />
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${markerTypes[selectedMarker.type]?.color}20`,
                    color: markerTypes[selectedMarker.type]?.color,
                  }}
                >
                  {lang === "zh"
                    ? markerTypes[selectedMarker.type]?.label
                    : markerTypes[selectedMarker.type]?.labelEn}
                </span>
              </div>
              <h3 className="font-bold mb-1">
                {lang === "zh" ? selectedMarker.name : selectedMarker.nameEn}
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                {lang === "zh" ? selectedMarker.description : selectedMarker.descriptionEn}
              </p>

              {selectedMarker.relatedMaterials.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">
                    {t(lang, "map.relatedMaterials")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMarker.relatedMaterials.map((mId) => {
                      const material = getMaterialById(mId);
                      return material ? (
                        <Link
                          key={mId}
                          href={`/${lang}/materials/${mId}`}
                          className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 hover:text-primary-400 hover:border-primary-500/50 border border-gray-700 transition-colors"
                        >
                          {lang === "zh" ? material.name : material.nameEn}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedMarker(null)}
                className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {t(lang, "map.closeDetail")}
              </button>
            </div>
          )}

          {/* Marker List */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="p-3 border-b border-gray-800">
              <p className="text-sm font-medium text-gray-300">
                {t(lang, "map.markerList")} ({filteredMarkers.length})
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredMarkers
                .sort((a, b) => {
                  const order = { boss: 0, domain: 1, collectible: 2, waypoint: 3, chest: 4, puzzle: 5, npc: 6, viewpoint: 7 };
                  return (order[a.type as keyof typeof order] ?? 8) - (order[b.type as keyof typeof order] ?? 8);
                })
                .map((marker) => {
                  const typeInfo = markerTypes[marker.type];
                  const isSelected = selectedMarker?.id === marker.id;
                  return (
                    <button
                      key={marker.id}
                      onClick={() => setSelectedMarker(marker)}
                      className={`w-full text-left px-3 py-2.5 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                        isSelected ? "bg-gray-800/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: typeInfo?.color }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">
                            {lang === "zh" ? marker.name : marker.nameEn}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {lang === "zh" ? typeInfo?.label : typeInfo?.labelEn}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
