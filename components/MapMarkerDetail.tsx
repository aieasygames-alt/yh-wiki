"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { MapMarker, MarkerTypeInfo, ProgressMap } from "../lib/map-utils";
import { isZhLocale, Locale } from "../lib/i18n";
import { getMaterialById } from "../lib/queries";

interface MapMarkerDetailProps {
  marker: MapMarker;
  typeInfo: MarkerTypeInfo | undefined;
  progress: ProgressMap;
  nearbyMarkers: MapMarker[];
  onToggleCollect: (markerId: string) => void;
  onClose: () => void;
  onSelectMarker: (marker: MapMarker) => void;
  lang: Locale;
}

const RESPAWN_LABELS: Record<string, Record<string, string>> = {
  once: { zh: "一次性", tw: "一次性", en: "One-time" },
  daily: { zh: "每日刷新", tw: "每日刷新", en: "Daily Respawn" },
  weekly: { zh: "每周刷新", tw: "每週刷新", en: "Weekly Respawn" },
};

const RARITY_LABELS: Record<number, Record<string, string>> = {
  1: { zh: "普通", tw: "普通", en: "Common" },
  2: { zh: "精致", tw: "精緻", en: "Exquisite" },
  3: { zh: "珍贵", tw: "珍貴", en: "Precious" },
  4: { zh: "华丽", tw: "華麗", en: "Luxurious" },
};

export default function MapMarkerDetail({
  marker,
  typeInfo,
  progress,
  nearbyMarkers,
  onToggleCollect,
  onClose,
  onSelectMarker,
  lang,
}: MapMarkerDetailProps) {
  const isCollected = !!progress[marker.id];
  const color = typeInfo?.color || "#6b7280";
  const [copied, setCopied] = useState(false);

  const handleCopyCoords = useCallback(() => {
    const text = `X: ${marker.x.toFixed(1)}, Y: ${marker.y.toFixed(1)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [marker.x, marker.y]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      {/* Header with type badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {isZhLocale(lang) ? typeInfo?.label : typeInfo?.labelEn}
        </span>
        {marker.rarity && RARITY_LABELS[marker.rarity] && (
          <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            {RARITY_LABELS[marker.rarity]?.[lang] || RARITY_LABELS[marker.rarity]?.zh}
          </span>
        )}
        {marker.respawn && RESPAWN_LABELS[marker.respawn] && (
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {RESPAWN_LABELS[marker.respawn]?.[lang] || RESPAWN_LABELS[marker.respawn]?.zh}
          </span>
        )}
      </div>

      {/* Marker image */}
      {marker.image && (
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-800">
          <img
            src={marker.image}
            alt={isZhLocale(lang) ? marker.name : marker.nameEn}
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {/* Name and description */}
      <h3 className="font-bold mb-1 text-gray-100">
        {isZhLocale(lang) ? marker.name : marker.nameEn}
      </h3>
      <p className="text-sm text-gray-400 mb-3">
        {isZhLocale(lang) ? marker.description : marker.descriptionEn}
      </p>

      {/* Coordinates with copy */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-600">
          X: {marker.x.toFixed(1)}, Y: {marker.y.toFixed(1)}
        </span>
        <button
          onClick={handleCopyCoords}
          className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-500 border border-gray-700 hover:text-gray-300 hover:border-gray-600 transition-colors"
        >
          {copied
            ? isZhLocale(lang)
              ? "已复制"
              : "Copied"
            : isZhLocale(lang)
            ? "复制坐标"
            : "Copy"}
        </button>
      </div>

      {/* Related materials */}
      {marker.relatedMaterials.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5">
            {isZhLocale(lang) ? "掉落材料" : "Drop Materials"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {marker.relatedMaterials.map((mId) => {
              const material = getMaterialById(mId);
              return material ? (
                <Link
                  key={mId}
                  href={`/${lang}/materials/${mId}`}
                  className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 hover:text-primary-400 hover:border-primary-500/50 border border-gray-700 transition-colors"
                >
                  {isZhLocale(lang) ? material.name : material.nameEn}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Guide link */}
      {marker.guideUrl && (
        <div className="mb-3">
          <Link
            href={marker.guideUrl}
            className="text-xs text-primary-400 hover:text-primary-300 underline transition-colors"
          >
            {isZhLocale(lang) ? "查看攻略 →" : "View Guide →"}
          </Link>
        </div>
      )}

      {/* Nearby markers */}
      {nearbyMarkers.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5">
            {isZhLocale(lang)
              ? `附近标记 (${nearbyMarkers.length})`
              : `Nearby (${nearbyMarkers.length})`}
          </p>
          <div className="space-y-1">
            {nearbyMarkers.slice(0, 5).map((nm) => {
              const nmType = nm.type;
              return (
                <button
                  key={nm.id}
                  onClick={() => onSelectMarker(nm)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-800/30 transition-colors flex items-center gap-2"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-400 truncate">
                    {isZhLocale(lang) ? nm.name : nm.nameEn}
                  </span>
                  <span className="text-[10px] text-gray-600 ml-auto flex-shrink-0">
                    {Math.sqrt(
                      (nm.x - marker.x) ** 2 + (nm.y - marker.y) ** 2
                    ).toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleCollect(marker.id)}
          className={`flex-1 text-xs px-3 py-2 rounded-lg transition-colors ${
            isCollected
              ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
              : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
          }`}
        >
          {isCollected
            ? isZhLocale(lang)
              ? "已收集 ✓"
              : "Collected ✓"
            : isZhLocale(lang)
            ? "标记为已收集"
            : "Mark as Collected"}
        </button>
        <button
          onClick={onClose}
          className="text-xs px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {isZhLocale(lang) ? "关闭" : "Close"}
        </button>
      </div>
    </div>
  );
}
