"use client";

import { useState, useEffect } from "react";
import type { MapInfo, MarkerTypeInfo, RegionInfo, MapMarker } from "./map-utils";

// Module-level cache: survives remounts (React strict mode, navigation)
type CoreData = {
  maps: MapInfo[];
  markerTypes: Record<string, MarkerTypeInfo>;
  regions: Record<string, RegionInfo>;
};

let cachedCore: CoreData | null = null;
let corePromise: Promise<CoreData | null> | null = null;

interface MapCoreData extends CoreData {
  loading: boolean;
  error: Error | null;
}

export function useMapData(): MapCoreData {
  const [data, setData] = useState<MapCoreData>({
    maps: cachedCore?.maps ?? [],
    markerTypes: cachedCore?.markerTypes ?? {},
    regions: cachedCore?.regions ?? {},
    loading: !cachedCore,
    error: null,
  });

  useEffect(() => {
    if (cachedCore) {
      setData({ ...cachedCore, loading: false, error: null });
      return;
    }

    if (!corePromise) {
      corePromise = fetch("/data/map-core.json")
        .then((r) => r.json())
        .then((raw: CoreData) => {
          cachedCore = raw;
          return cachedCore;
        });
    }

    corePromise
      .then((core) => {
        if (core) setData({ ...core, loading: false, error: null });
      })
      .catch((err) => {
        setData((prev) => ({ ...prev, loading: false, error: err }));
      });
  }, []);

  return data;
}

// ─── Region marker loading ──────────────────────────────────────

const markerCache = new Map<string, MapMarker[]>();
const markerPromises = new Map<string, Promise<MapMarker[]>>();

async function fetchRegionMarkers(regionId: string): Promise<MapMarker[]> {
  if (markerCache.has(regionId)) return markerCache.get(regionId)!;
  if (markerPromises.has(regionId)) return markerPromises.get(regionId)!;

  const promise = fetch(`/data/map-markers-${regionId}.json`)
    .then((r) => r.json())
    .then((markers: MapMarker[]) => {
      markerCache.set(regionId, markers);
      return markers;
    });
  markerPromises.set(regionId, promise);
  return promise;
}

interface RegionMarkersData {
  markers: MapMarker[];
  loading: boolean;
}

/**
 * Load markers for active region, or all regions if regionId is null.
 * All-region mode fetches all 5 files in parallel.
 */
export function useRegionMarkers(
  regionId: string | null,
  allRegionIds: string[]
): RegionMarkersData {
  const [markers, setMarkers] = useState<MapMarker[]>(() => {
    if (!allRegionIds.length) return [];
    // Check cache immediately
    if (regionId) {
      return markerCache.get(regionId) ?? [];
    }
    return allRegionIds.flatMap((id) => markerCache.get(id) ?? []);
  });
  const [loading, setLoading] = useState(() => {
    if (!allRegionIds.length) return true;
    if (regionId) return !markerCache.has(regionId);
    return allRegionIds.some((id) => !markerCache.has(id));
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (regionId) {
        // Single region
        if (markerCache.has(regionId)) {
          if (!cancelled) {
            setMarkers(markerCache.get(regionId)!);
            setLoading(false);
          }
          return;
        }
        setLoading(true);
        const m = await fetchRegionMarkers(regionId);
        if (!cancelled) {
          setMarkers(m);
          setLoading(false);
        }
      } else {
        // All regions
        const cached = allRegionIds.map((id) => markerCache.get(id));
        if (cached.every(Boolean)) {
          if (!cancelled) {
            setMarkers(cached.flat() as MapMarker[]);
            setLoading(false);
          }
          return;
        }
        setLoading(true);
        const all = await Promise.all(allRegionIds.map(fetchRegionMarkers));
        if (!cancelled) {
          setMarkers(all.flat());
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId, allRegionIds.length]);

  return { markers, loading };
}
