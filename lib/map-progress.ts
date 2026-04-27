"use client";

const STORAGE_KEY = "nte-map-progress";

export type ProgressMap = Record<string, boolean>;

/** Load progress from localStorage */
export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Save progress to localStorage */
export function saveProgress(progress: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

/** Toggle a single marker's collected state */
export function toggleMarker(
  progress: ProgressMap,
  markerId: string
): ProgressMap {
  const next = { ...progress };
  if (next[markerId]) {
    delete next[markerId];
  } else {
    next[markerId] = true;
  }
  return next;
}

/** Count collected markers from a list */
export function countCollected(
  progress: ProgressMap,
  markerIds: string[]
): number {
  return markerIds.filter((id) => progress[id]).length;
}

/** Calculate percentage */
export function progressPercent(
  progress: ProgressMap,
  markerIds: string[]
): number {
  if (markerIds.length === 0) return 0;
  return Math.round((countCollected(progress, markerIds) / markerIds.length) * 100);
}

/** Clear all progress */
export function clearProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return {};
}
