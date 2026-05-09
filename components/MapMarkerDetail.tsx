"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { MapMarker, MarkerTypeInfo, ProgressMap } from "../lib/map-utils";
import { t, isZhLocale, Locale } from "../lib/i18n";
import { getMaterialById } from "../lib/queries";

interface MapMarkerDetailProps {
  marker: MapMarker;
  typeInfo: MarkerTypeInfo | undefined;
  progress: ProgressMap;
  nearbyMarkers: MapMarker[];
  onToggleCollect: (markerId: string) => void;
  onClose: () => void;
  onSelectMarker: (marker: MapMarker) => void;
  onAddToRoute?: (markerId: string) => void;
  isInRoute?: boolean;
  lang: Locale;
}

const RESPAWN_I18N_KEYS: Record<string, string> = {
  once: "map.once",
  daily: "map.daily",
  weekly: "map.weekly",
};

const RARITY_I18N_KEYS: Record<number, string> = {
  1: "map.common",
  2: "map.exquisite",
  3: "map.precious",
  4: "map.luxurious",
};

export default function MapMarkerDetail({
  marker,
  typeInfo,
  progress,
  nearbyMarkers,
  onToggleCollect,
  onClose,
  onSelectMarker,
  onAddToRoute,
  isInRoute = false,
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
        {marker.rarity && RARITY_I18N_KEYS[marker.rarity] && (
          <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            {t(lang, RARITY_I18N_KEYS[marker.rarity])}
          </span>
        )}
        {marker.respawn && RESPAWN_I18N_KEYS[marker.respawn] && (
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {t(lang, RESPAWN_I18N_KEYS[marker.respawn])}
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
            ? t(lang, "common.copied")
            : t(lang, "common.copy")}
        </button>
      </div>

      {/* Related materials */}
      {marker.relatedMaterials && marker.relatedMaterials.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5">
            {t(lang, "map.relatedMaterials")}
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
            {t(lang, "map.viewGuide")}
          </Link>
        </div>
      )}

      {/* Nearby markers */}
      {nearbyMarkers.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5">
            {t(lang, "map.nearbyMarkers", `${nearbyMarkers.length}`)}
          </p>
          <div className="space-y-1">
            {nearbyMarkers.slice(0, 5).map((nm) => {
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
            ? `${t(lang, "map.collected")} ✓`
            : t(lang, "map.markCollected")}
        </button>
        {onAddToRoute && !isInRoute && (
          <button
            onClick={() => onAddToRoute(marker.id)}
            className="text-xs px-3 py-2 rounded-lg bg-gray-800 text-gray-400 border border-gray-700 hover:border-primary-500/50 hover:text-primary-400 transition-colors"
          >
            {t(lang, "map.addToRoute")}
          </button>
        )}
        {isInRoute && (
          <span className="text-xs px-3 py-2 text-primary-400/60">✓ {isZhLocale(lang) ? "已在路线中" : "In route"}</span>
        )}
        <button
          onClick={onClose}
          className="text-xs px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {t(lang, "map.close")}
        </button>
      </div>
    </div>
  );
}
