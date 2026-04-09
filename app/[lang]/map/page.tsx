"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, type Locale } from "../../../lib/i18n";
import { getMaterialById } from "../../../lib/queries";
import mapData from "../../../data/map-markers.json";

interface Marker {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  x: number;
  y: number;
  description: string;
  descriptionEn: string;
  relatedMaterials: string[];
}

interface MapInfo {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  description: string;
  descriptionEn: string;
  markers: Marker[];
}

const data = mapData as {
  maps: MapInfo[];
  markerTypes: Record<string, { color: string; label: string; labelEn: string }>;
};

const MARKER_TYPES = ["domain", "boss", "collectible", "waypoint"] as const;

export default function MapPage() {
  const { lang: langParam } = useParams();
  const lang = (langParam || "zh") as Locale;

  const [activeMap, setActiveMap] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>(MARKER_TYPES);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [zoom, setZoom] = useState(1);

  const map = data.maps[activeMap];
  const markerTypes = data.markerTypes;

  const filteredMarkers = useMemo(() => {
    if (!map) return [];
    return map.markers.filter((m) => activeFilters.includes(m.type));
  }, [map, activeFilters]);

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]
    );
    setSelectedMarker(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t(lang, "map.title")}</h1>

      {/* Map Select */}
      {data.maps.length > 1 && (
        <div className="flex gap-2 mb-6">
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
      <div className="flex flex-wrap gap-2 mb-6">
        {MARKER_TYPES.map((type) => {
          const info = markerTypes[type];
          const active = activeFilters.includes(type);
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <p className="text-sm text-gray-400">
                {lang === "zh" ? map.name : map.nameEn}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="w-7 h-7 rounded bg-gray-800 text-gray-400 hover:text-white text-sm flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xs text-gray-500 w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
                  className="w-7 h-7 rounded bg-gray-800 text-gray-400 hover:text-white text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Map Area */}
            <div className="relative overflow-hidden bg-gray-800" style={{ aspectRatio: "16/9" }}>
              <div
                className="absolute inset-0 transition-transform duration-200"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              >
                {/* Map Background Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2 opacity-30">Map</div>
                    <p className="text-sm text-gray-600">
                      {lang === "zh" ? map.description : map.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Markers */}
                {filteredMarkers.map((marker) => {
                  const typeInfo = markerTypes[marker.type];
                  const isSelected = selectedMarker?.id === marker.id;
                  return (
                    <button
                      key={marker.id}
                      onClick={() =>
                        setSelectedMarker(isSelected ? null : marker)
                      }
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      title={lang === "zh" ? marker.name : marker.nameEn}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "scale-125 ring-2 ring-offset-1 ring-offset-gray-800" : "hover:scale-110"
                        }`}
                        style={{
                          backgroundColor: `${typeInfo.color}40`,
                          borderColor: typeInfo.color,
                          ringColor: typeInfo.color,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: typeInfo.color }}
                        />
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap shadow-lg">
                          {lang === "zh" ? marker.name : marker.nameEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Marker List & Details */}
        <div className="lg:col-span-1">
          {/* Selected Marker Detail */}
          {selectedMarker ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: markerTypes[selectedMarker.type].color }}
                />
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${markerTypes[selectedMarker.type].color}20`,
                    color: markerTypes[selectedMarker.type].color,
                  }}
                >
                  {lang === "zh"
                    ? markerTypes[selectedMarker.type].label
                    : markerTypes[selectedMarker.type].labelEn}
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
          ) : null}

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
                  const order = { boss: 0, domain: 1, collectible: 2, waypoint: 3 };
                  return (order[a.type] ?? 4) - (order[b.type] ?? 4);
                })
                .map((marker) => {
                  const typeInfo = markerTypes[marker.type];
                  return (
                    <button
                      key={marker.id}
                      onClick={() => setSelectedMarker(marker)}
                      className={`w-full text-left px-3 py-2.5 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                        selectedMarker?.id === marker.id ? "bg-gray-800/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: typeInfo.color }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">
                            {lang === "zh" ? marker.name : marker.nameEn}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {lang === "zh" ? typeInfo.label : typeInfo.labelEn}
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
