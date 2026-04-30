"use client";

import { useState, useMemo } from "react";
import type { MapMarker, MarkerTypeInfo } from "../lib/map-utils";
import { isZhLocale, Locale } from "../lib/i18n";

interface MapRoutePlannerProps {
  markers: MapMarker[];
  markerTypes: Record<string, MarkerTypeInfo>;
  routeMarkerIds: string[];
  onRouteChange: (ids: string[]) => void;
  lang: Locale;
}

/** Nearest-neighbor TSP approximation starting from first point */
function optimizeOrder(markers: MapMarker[]): MapMarker[] {
  if (markers.length <= 2) return markers;
  const visited = new Set<string>();
  const result: MapMarker[] = [];
  let current = markers[0];
  visited.add(current.id);
  result.push(current);

  while (visited.size < markers.length) {
    let nearest: MapMarker | null = null;
    let nearestDist = Infinity;
    for (const m of markers) {
      if (visited.has(m.id)) continue;
      const dist = Math.sqrt((m.x - current.x) ** 2 + (m.y - current.y) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = m;
      }
    }
    if (nearest) {
      visited.add(nearest.id);
      result.push(nearest);
      current = nearest;
    }
  }
  return result;
}

export default function MapRoutePlanner({
  markers,
  markerTypes,
  routeMarkerIds,
  onRouteChange,
  lang,
}: MapRoutePlannerProps) {
  const [isAdding, setIsAdding] = useState(false);

  const routeMarkers = useMemo(
    () => routeMarkerIds.map((id) => markers.find((m) => m.id === id)!).filter(Boolean),
    [routeMarkerIds, markers]
  );

  const optimized = useMemo(() => optimizeOrder(routeMarkers), [routeMarkers]);

  const totalDistance = useMemo(() => {
    let d = 0;
    for (let i = 1; i < optimized.length; i++) {
      d += Math.sqrt(
        (optimized[i].x - optimized[i - 1].x) ** 2 +
        (optimized[i].y - optimized[i - 1].y) ** 2
      );
    }
    return Math.round(d * 10) / 10;
  }, [optimized]);

  const handleOptimize = () => {
    if (optimized.length <= 1) return;
    onRouteChange(optimizeOrder(routeMarkers).map((m) => m.id));
  };

  const handleShare = async () => {
    const ids = routeMarkerIds.join(",");
    const url = `${window.location.origin}${window.location.pathname}?route=${encodeURIComponent(ids)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback - do nothing
    }
  };

  const handleRemoveFromRoute = (id: string) => {
    onRouteChange(routeMarkerIds.filter((rid) => rid !== id));
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <span className="text-xs font-medium text-gray-300">
          {isZhLocale(lang) ? "路线规划" : "Route Planner"}
        </span>
        <div className="flex gap-1.5">
          {routeMarkerIds.length > 0 && (
            <>
              <button
                onClick={handleOptimize}
                className="text-[10px] px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                title={isZhLocale(lang) ? "优化顺序" : "Optimize order"}
              >
                {isZhLocale(lang) ? "优化" : "Optimize"}
              </button>
              <button
                onClick={handleShare}
                className="text-[10px] px-2 py-1 rounded bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
                title={isZhLocale(lang) ? "分享路线" : "Share route"}
              >
                {isZhLocale(lang) ? "分享" : "Share"}
              </button>
              <button
                onClick={() => onRouteChange([])}
                className="text-[10px] px-2 py-1 rounded bg-gray-800 text-red-400/70 hover:text-red-400 transition-colors"
              >
                {isZhLocale(lang) ? "清空" : "Clear"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Route list */}
      {routeMarkerIds.length === 0 ? (
        <div className="px-3 py-3 text-xs text-gray-600 text-center">
          {isZhLocale(lang)
            ? "点击标记添加到路线"
            : "Click markers to add to route"}
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {routeMarkers.map((m, i) => {
            const typeInfo = markerTypes[m.type];
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800/30 transition-colors"
              >
                <span className="text-[10px] text-gray-600 w-4 text-center flex-shrink-0">
                  {i + 1}
                </span>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: typeInfo?.color || "#888" }}
                />
                <span className="text-xs text-gray-300 truncate flex-1">
                  {isZhLocale(lang) ? m.name : m.nameEn}
                </span>
                <button
                  onClick={() => handleRemoveFromRoute(m.id)}
                  className="text-[10px] text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            );
          })}
          {totalDistance > 0 && (
            <div className="px-3 py-1.5 border-t border-gray-800/50 text-[10px] text-gray-500">
              {isZhLocale(lang) ? "总距离" : "Total distance"}: {totalDistance}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
