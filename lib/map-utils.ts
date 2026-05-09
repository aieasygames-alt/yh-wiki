import L from "leaflet";

// Re-export ProgressMap from map-progress for convenience
export type { ProgressMap } from "./map-progress";

// ─── Marker Types ───────────────────────────────────────────────

export type RespawnType = "once" | "daily" | "weekly";
export type MarkerRarity = 1 | 2 | 3 | 4;

export interface MapMarker {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  subtype?: string;
  x: number;
  y: number;
  description?: string;
  descriptionEn?: string;
  relatedMaterials?: string[];
  image?: string;
  guideUrl?: string;
  respawn?: RespawnType;
  region?: string;
  floor?: number;
  rarity?: MarkerRarity;
  verified?: boolean;
  icon?: string;
  link?: string;
  noteTitle?: string;
  noteTitleEn?: string;
  primaryColor?: string;
}

export interface MarkerTypeInfo {
  color: string;
  label: string;
  labelEn: string;
  icon?: string;
  subtypes?: Record<string, { label: string; labelEn: string }>;
}

export interface RegionInfo {
  zh: string;
  en: string;
  color: string;
}

export interface MapInfo {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  description: string;
  descriptionEn: string;
  minZoom: number;
  maxZoom: number;
  bounds: [[number, number], [number, number]];
  markers: MapMarker[];
}

// ─── Coordinate Helpers ─────────────────────────────────────────

/** Pure coordinate type — avoids Leaflet dependency in test files */
export type LatLngTuple = [number, number];

/** Default bounds for maps that don't specify custom bounds */
export const DEFAULT_BOUNDS: L.LatLngBoundsExpression = [
  [100, 0],
  [0, 100],
];

/** Convert a marker's x/y to Leaflet lat/lng (y is inverted) */
export function markerToLatLng(marker: MapMarker): LatLngTuple {
  return [100 - marker.y, marker.x];
}

/** Get bounds for a map, falling back to DEFAULT_BOUNDS */
export function getMapBounds(map: MapInfo): L.LatLngBoundsExpression {
  return map.bounds || DEFAULT_BOUNDS;
}

// ─── Marker Icon Factory ────────────────────────────────────────

export function createMarkerIcon(
  color: string,
  isSelected: boolean,
  isCollected?: boolean,
  iconUrl?: string
): L.DivIcon {
  const size = isSelected ? 32 : 24;
  const opacity = isCollected ? 0.35 : 1;
  const ring = isSelected
    ? `<span style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};opacity:0.5"></span>`
    : "";
  const checkmark = isCollected
    ? `<svg style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.7" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : "";

  // Use actual icon image if available, otherwise fall back to colored dot
  const inner = iconUrl
    ? `<img src="${iconUrl}" style="width:${size - 6}px;height:${size - 6}px;object-fit:contain;pointer-events:none" alt="" />`
    : `<div style="width:8px;height:8px;border-radius:50%;background:${color}"></div>`;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;opacity:${opacity};transition:opacity 0.2s">
        ${ring}
        <div style="width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color};background:${color}40;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.15s">
          ${inner}
        </div>
        ${checkmark}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
