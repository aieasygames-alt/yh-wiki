import type { MapMarker, MarkerTypeInfo, RegionInfo } from "./map-utils";
import type { ProgressMap } from "./map-progress";
import { countCollected, progressPercent } from "./map-progress";

// ─── Route Optimization ─────────────────────────────────────────

/** Nearest-neighbor TSP starting from the marker closest to the centroid */
export function optimizeRoute(markers: MapMarker[]): MapMarker[] {
  if (markers.length <= 2) return markers;

  // Find centroid
  const cx = markers.reduce((s, m) => s + m.x, 0) / markers.length;
  const cy = markers.reduce((s, m) => s + m.y, 0) / markers.length;

  // Start from marker closest to centroid
  let startIdx = 0;
  let startDist = Infinity;
  for (let i = 0; i < markers.length; i++) {
    const d = (markers[i].x - cx) ** 2 + (markers[i].y - cy) ** 2;
    if (d < startDist) {
      startDist = d;
      startIdx = i;
    }
  }

  const visited = new Set<string>();
  const result: MapMarker[] = [];
  let current = markers[startIdx];
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

/** Sum of Euclidean distances between consecutive markers */
export function calculateRouteDistance(ordered: MapMarker[]): number {
  let d = 0;
  for (let i = 1; i < ordered.length; i++) {
    d += Math.sqrt(
      (ordered[i].x - ordered[i - 1].x) ** 2 +
        (ordered[i].y - ordered[i - 1].y) ** 2
    );
  }
  return Math.round(d * 10) / 10;
}

/** Estimate completion time based on uncollected count */
export function estimateCompletionTime(
  ordered: MapMarker[],
  progress: ProgressMap
): string {
  const uncollected = ordered.filter((m) => !progress[m.id]).length;
  if (uncollected === 0) return "0";
  // ~30s per marker + ~15s travel between markers
  const totalSeconds = uncollected * 30 + Math.max(0, uncollected - 1) * 15;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

// ─── Statistics ──────────────────────────────────────────────────

export interface RegionStat {
  id: string;
  label: string;
  color: string;
  total: number;
  collected: number;
  percent: number;
}

export interface TypeStat {
  id: string;
  label: string;
  color: string;
  total: number;
  collected: number;
  percent: number;
}

export function getRegionStats(
  markers: MapMarker[],
  progress: ProgressMap,
  regions: Record<string, RegionInfo>,
  isZh: boolean
): RegionStat[] {
  return Object.entries(regions).map(([id, info]) => {
    const ids = markers.filter((m) => m.region === id).map((m) => m.id);
    return {
      id,
      label: isZh ? info.zh : info.en,
      color: info.color,
      total: ids.length,
      collected: countCollected(progress, ids),
      percent: progressPercent(progress, ids),
    };
  });
}

export function getTypeStats(
  markers: MapMarker[],
  progress: ProgressMap,
  markerTypes: Record<string, MarkerTypeInfo>,
  isZh: boolean
): TypeStat[] {
  return Object.entries(markerTypes).map(([id, info]) => {
    const ids = markers.filter((m) => m.type === id).map((m) => m.id);
    return {
      id,
      label: isZh ? info.label : info.labelEn,
      color: info.color,
      total: ids.length,
      collected: countCollected(progress, ids),
      percent: progressPercent(progress, ids),
    };
  });
}

// ─── Filtering ──────────────────────────────────────────────────

export function filterUncollected(
  markers: MapMarker[],
  progress: ProgressMap
): MapMarker[] {
  return markers.filter((m) => !progress[m.id]);
}

export function filterByRegionAndType(
  markers: MapMarker[],
  region: string | null,
  types: Set<string>
): MapMarker[] {
  return markers.filter((m) => {
    if (region && m.region !== region) return false;
    if (types.size > 0 && !types.has(m.type)) return false;
    return true;
  });
}

// ─── Daily/Weekly ───────────────────────────────────────────────

export function getDailyWeeklyMarkers(markers: MapMarker[]): {
  daily: MapMarker[];
  weekly: MapMarker[];
} {
  return {
    daily: markers.filter((m) => m.respawn === "daily"),
    weekly: markers.filter((m) => m.respawn === "weekly"),
  };
}

export function resetDailyProgress(
  progress: ProgressMap,
  markers: MapMarker[]
): ProgressMap {
  const dailyIds = new Set(
    markers.filter((m) => m.respawn === "daily").map((m) => m.id)
  );
  const next: ProgressMap = {};
  for (const [id, val] of Object.entries(progress)) {
    if (!dailyIds.has(id)) next[id] = val;
  }
  return next;
}
