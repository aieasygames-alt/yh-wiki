"use client";

import type { MapMarker, MarkerTypeInfo, RegionInfo } from "../lib/map-utils";
import type { ProgressMap } from "../lib/map-progress";
import { countCollected, progressPercent } from "../lib/map-progress";
import {
  getRegionStats,
  getTypeStats,
} from "../lib/explorer-utils";
import { t, isZhLocale, Locale } from "../lib/i18n";

interface ExplorerDashboardProps {
  markers: MapMarker[];
  progress: ProgressMap;
  markerTypes: Record<string, MarkerTypeInfo>;
  regions: Record<string, RegionInfo>;
  lang: Locale;
  onShare?: () => void;
}

export default function ExplorerDashboard({
  markers,
  progress,
  markerTypes,
  regions,
  lang,
  onShare,
}: ExplorerDashboardProps) {
  const isZh = isZhLocale(lang);
  const totalIds = markers.map((m) => m.id);
  const totalCollected = countCollected(progress, totalIds);
  const totalPercent = progressPercent(progress, totalIds);
  const regionStats = getRegionStats(markers, progress, regions, isZh);
  const typeStats = getTypeStats(markers, progress, markerTypes, isZh);

  // SVG ring chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (totalPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Overall progress card */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
        <div className="flex items-center gap-8">
          {/* Ring chart */}
          <div className="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#1f2937"
                strokeWidth="8"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#818cf8"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{totalPercent}%</span>
              <span className="text-[10px] text-gray-500">
                {t(lang, "explorer.overallProgress")}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{markers.length}</div>
                <div className="text-xs text-gray-500">{t(lang, "explorer.totalMarkers", String(markers.length)).replace(`{0}`, String(markers.length)).split(String(markers.length))[0] || "Total"}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{totalCollected}</div>
                <div className="text-xs text-gray-500">{t(lang, "explorer.collected")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">
                  {markers.length - totalCollected}
                </div>
                <div className="text-xs text-gray-500">{t(lang, "explorer.remaining")}</div>
              </div>
            </div>
            {onShare && (
              <button
                onClick={onShare}
                className="w-full py-2 rounded-lg bg-gray-800 text-primary-400 border border-gray-700 hover:border-primary-500/30 text-sm transition-colors"
              >
                {t(lang, "explorer.shareProgress")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Region stats */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">
          {t(lang, "explorer.progressByRegion")}
        </h3>
        <div className="space-y-3">
          {regionStats.map((r) => (
            <div key={r.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="text-sm text-gray-300">{r.label}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {r.collected}/{r.total} ({r.percent}%)
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${r.percent}%`,
                    backgroundColor: r.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type stats */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4">
          {t(lang, "explorer.progressByType")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {typeStats
            .filter((t) => t.total > 0)
            .sort((a, b) => b.total - a.total)
            .map((tp) => (
              <div key={tp.id} className="flex items-center gap-2 py-1">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: tp.color }}
                />
                <span className="text-xs text-gray-400 truncate flex-1">
                  {tp.label}
                </span>
                <span className="text-[10px] text-gray-600 tabular-nums">
                  {tp.collected}/{tp.total}
                </span>
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${tp.percent}%`,
                      backgroundColor: tp.color,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
