"use client";

const STORAGE_KEY = "nte-gacha-analyzer";

export interface PullRecord {
  id: string;
  timestamp: number;
  banner: string; // "limited" | "beginner" | "standard" | "weapons"
  characterId: string;
  rank: "S" | "A" | "B";
  pullNumber: number; // cumulative pity count for this pull
}

export interface BannerState {
  pityCount: number;
  totalPulls: number;
}

export interface GachaAnalyzerData {
  version: 1;
  pulls: PullRecord[];
  banners: Record<string, BannerState>;
}

function defaultBannerState(): BannerState {
  return { pityCount: 0, totalPulls: 0 };
}

function defaultData(): GachaAnalyzerData {
  return {
    version: 1,
    pulls: [],
    banners: {
      limited: defaultBannerState(),
      beginner: defaultBannerState(),
      standard: defaultBannerState(),
      weapons: defaultBannerState(),
    },
  };
}

export function loadData(): GachaAnalyzerData {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as GachaAnalyzerData;
    if (!parsed.pulls || !parsed.banners) return defaultData();
    return parsed;
  } catch {
    return defaultData();
  }
}

export function saveData(data: GachaAnalyzerData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function addPull(pull: Omit<PullRecord, "id" | "timestamp">): GachaAnalyzerData {
  const data = loadData();
  const record: PullRecord = {
    ...pull,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    timestamp: Date.now(),
  };
  data.pulls.unshift(record);
  // Update banner state
  if (!data.banners[pull.banner]) {
    data.banners[pull.banner] = defaultBannerState();
  }
  data.banners[pull.banner].totalPulls += 1;
  if (pull.rank === "S") {
    data.banners[pull.banner].pityCount = 0;
  } else {
    data.banners[pull.banner].pityCount += 1;
  }
  saveData(data);
  return data;
}

export function removePull(pullId: string): GachaAnalyzerData {
  const data = loadData();
  const idx = data.pulls.findIndex((p) => p.id === pullId);
  if (idx !== -1) {
    const removed = data.pulls[idx];
    data.pulls.splice(idx, 1);
    // Recalculate banner state from remaining pulls (reverse chronological)
    recalcBannerState(data, removed.banner);
    saveData(data);
  }
  return data;
}

function recalcBannerState(data: GachaAnalyzerData, banner: string): void {
  const bannerPulls = data.pulls
    .filter((p) => p.banner === banner)
    .sort((a, b) => a.timestamp - b.timestamp);
  let pity = 0;
  let total = 0;
  for (const p of bannerPulls) {
    total++;
    if (p.rank === "S") {
      pity = 0;
    } else {
      pity++;
    }
  }
  data.banners[banner] = { pityCount: pity, totalPulls: total };
}

export function clearData(): GachaAnalyzerData {
  if (typeof window === "undefined") return defaultData();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return defaultData();
}

export function exportJSON(data: GachaAnalyzerData): string {
  return JSON.stringify(data, null, 2);
}

export function importJSON(json: string): { data: GachaAnalyzerData; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.pulls || !Array.isArray(parsed.pulls)) {
      return { data: loadData(), error: "Invalid format: missing pulls array" };
    }
    if (!parsed.banners || typeof parsed.banners !== "object") {
      return { data: loadData(), error: "Invalid format: missing banners object" };
    }
    const data: GachaAnalyzerData = {
      version: parsed.version || 1,
      pulls: parsed.pulls,
      banners: parsed.banners,
    };
    saveData(data);
    return { data };
  } catch {
    return { data: loadData(), error: "Invalid JSON" };
  }
}
