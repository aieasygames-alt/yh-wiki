"use client";

import { useState, useMemo } from "react";
import type { MapMarker, MarkerTypeInfo, ProgressMap } from "../lib/map-utils";
import { countCollected } from "../lib/map-progress";
import { isZhLocale, Locale } from "../lib/i18n";

interface MapSidebarProps {
  markers: MapMarker[];
  markerTypes: Record<string, MarkerTypeInfo>;
  selectedMarker: MapMarker | null;
  activeFilters: Set<string>;
  onToggleFilter: (type: string) => void;
  onSelectMarker: (marker: MapMarker | null) => void;
  progress: ProgressMap;
  lang: Locale;
}

export default function MapSidebar({
  markers,
  markerTypes,
  selectedMarker,
  activeFilters,
  onToggleFilter,
  onSelectMarker,
  progress,
  lang,
}: MapSidebarProps) {
  const [collapsedTypes, setCollapsedTypes] = useState<Set<string>>(new Set());

  // Group markers by type
  const markersByType = useMemo(() => {
    const map: Record<string, MapMarker[]> = {};
    for (const m of markers) {
      if (!map[m.type]) map[m.type] = [];
      map[m.type].push(m);
    }
    return map;
  }, [markers]);

  const toggleCollapse = (type: string) => {
    setCollapsedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const allActive = Object.keys(markerTypes).every((t) => activeFilters.has(t));

  return (
    <div className="flex flex-col h-full">
      {/* Category tree */}
      <div className="flex-1 overflow-y-auto">
        {/* Select all / none */}
        <div className="flex gap-2 px-3 py-2 border-b border-gray-800">
          <button
            onClick={() => {
              if (allActive) {
                // Deselect all
                Object.keys(markerTypes).forEach((t) => {
                  if (activeFilters.has(t)) onToggleFilter(t);
                });
              } else {
                // Select all
                Object.keys(markerTypes).forEach((t) => {
                  if (!activeFilters.has(t)) onToggleFilter(t);
                });
              }
            }}
            className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          >
            {allActive
              ? isZhLocale(lang)
                ? "全不选"
                : "Deselect All"
              : isZhLocale(lang)
              ? "全选"
              : "Select All"}
          </button>
        </div>

        {/* Type groups */}
        {Object.entries(markerTypes).map(([type, info]) => {
          const typeMarkers = markersByType[type] || [];
          const collected = countCollected(
            progress,
            typeMarkers.map((m) => m.id)
          );
          const active = activeFilters.has(type);
          const collapsed = collapsedTypes.has(type);

          return (
            <div key={type} className="border-b border-gray-800/50">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  onClick={() => toggleCollapse(type)}
                  className="text-gray-600 hover:text-gray-400 transition-colors w-3"
                >
                  {collapsed ? "▸" : "▾"}
                </button>
                <button
                  onClick={() => onToggleFilter(type)}
                  className="flex items-center gap-1.5 flex-1 min-w-0"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: active ? info.color : "#4b5563",
                    }}
                  />
                  <span
                    className={`text-xs truncate ${
                      active ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {isZhLocale(lang) ? info.label : info.labelEn}
                  </span>
                  <span className="text-xs text-gray-600 ml-auto flex-shrink-0">
                    {collected}/{typeMarkers.length}
                  </span>
                </button>
              </div>

              {/* Sub-markers list (when expanded) */}
              {!collapsed && active && typeMarkers.length > 0 && (
                <div className="pb-1">
                  {typeMarkers
                    .sort((a, b) => {
                      const aCollected = !!progress[a.id];
                      const bCollected = !!progress[b.id];
                      if (aCollected !== bCollected) return aCollected ? 1 : -1;
                      return 0;
                    })
                    .map((marker) => {
                      const isSelected = selectedMarker?.id === marker.id;
                      const isCollected = !!progress[marker.id];
                      return (
                        <button
                          key={marker.id}
                          onClick={() =>
                            onSelectMarker(
                              isSelected ? null : marker
                            )
                          }
                          className={`w-full text-left px-3 py-1.5 pl-8 hover:bg-gray-800/30 transition-colors flex items-center gap-2 ${
                            isSelected ? "bg-gray-800/50" : ""
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              isCollected
                                ? "bg-green-500"
                                : ""
                            }`}
                            style={
                              !isCollected
                                ? { backgroundColor: info.color }
                                : undefined
                            }
                          />
                          <span
                            className={`text-xs truncate ${
                              isCollected
                                ? "text-gray-600 line-through"
                                : "text-gray-300"
                            }`}
                          >
                            {isZhLocale(lang) ? marker.name : marker.nameEn}
                          </span>
                          {marker.respawn && (
                            <span className="text-[10px] px-1 rounded bg-gray-800 text-gray-500 ml-auto flex-shrink-0">
                              {marker.respawn === "daily"
                                ? isZhLocale(lang)
                                  ? "每日"
                                  : "Daily"
                                : marker.respawn === "weekly"
                                ? isZhLocale(lang)
                                  ? "每周"
                                  : "Weekly"
                                : isZhLocale(lang)
                                ? "一次"
                                : "Once"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
