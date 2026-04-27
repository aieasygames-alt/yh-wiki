"use client";

import type { MapMarker, ProgressMap } from "../lib/map-utils";
import { countCollected } from "../lib/map-progress";
import { isZhLocale, Locale } from "../lib/i18n";

interface MapProgressBarProps {
  markers: MapMarker[];
  progress: ProgressMap;
  lang: Locale;
}

export default function MapProgressBar({
  markers,
  progress,
  lang,
}: MapProgressBarProps) {
  const total = markers.length;
  const collected = countCollected(
    progress,
    markers.map((m) => m.id)
  );
  const percent = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="px-3 py-2 border-b border-gray-800">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-400">
          {isZhLocale(lang) ? "收集进度" : "Collection Progress"}
        </span>
        <span className="text-xs text-gray-500">
          {collected}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
