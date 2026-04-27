"use client";

import { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import type { MapMarker } from "../lib/map-utils";
import { isZhLocale, Locale } from "../lib/i18n";

interface MapSearchProps {
  markers: MapMarker[];
  onSelectMarker: (marker: MapMarker) => void;
  lang: Locale;
}

export default function MapSearch({
  markers,
  onSelectMarker,
  lang,
}: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(markers, {
        keys: [
          { name: "name", weight: 2 },
          { name: "nameEn", weight: 2 },
          { name: "description", weight: 1 },
          { name: "descriptionEn", weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [markers]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query.trim()).slice(0, 10);
  }, [fuse, query]);

  const handleSelect = useCallback(
    (marker: MapMarker) => {
      onSelectMarker(marker);
      setQuery("");
      setShowResults(false);
    },
    [onSelectMarker]
  );

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={
            isZhLocale(lang) ? "搜索标记..." : "Search markers..."
          }
          className="w-full pl-9 pr-3 py-2 text-xs bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary-500/50 transition-colors"
        />
      </div>

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          {results.map(({ item: marker }) => (
            <button
              key={marker.id}
              onMouseDown={() => handleSelect(marker)}
              className="w-full text-left px-3 py-2 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 last:border-0"
            >
              <p className="text-xs font-medium text-gray-200 truncate">
                {isZhLocale(lang) ? marker.name : marker.nameEn}
              </p>
              <p className="text-[10px] text-gray-600 truncate">
                {isZhLocale(lang) ? marker.description : marker.descriptionEn}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
