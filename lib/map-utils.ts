import L from "leaflet";

export interface MapMarker {
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

export interface MarkerTypeInfo {
  color: string;
  label: string;
  labelEn: string;
}

export interface MapInfo {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  description: string;
  descriptionEn: string;
  markers: MapMarker[];
}

// Pure coordinate type — avoids Leaflet dependency in test files
export type LatLngTuple = [number, number];

export const MAP_BOUNDS: L.LatLngBoundsExpression = [
  [100, 0],
  [0, 100],
];

export function markerToLatLng(marker: MapMarker): LatLngTuple {
  return [100 - marker.y, marker.x];
}

export function createMarkerIcon(
  color: string,
  isSelected: boolean
): L.DivIcon {
  const size = isSelected ? 32 : 24;
  const ring = isSelected
    ? `<span style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};opacity:0.5"></span>`
    : "";
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${ring}
        <div style="width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color};background:${color}40;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.15s">
          <div style="width:8px;height:8px;border-radius:50%;background:${color}"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
