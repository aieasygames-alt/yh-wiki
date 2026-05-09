"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import {
  type MapMarker,
  type MarkerTypeInfo,
  type MapInfo,
  type ProgressMap,
  markerToLatLng,
  createMarkerIcon,
  getMapBounds,
} from "../lib/map-utils";

interface InteractiveMapProps {
  map: MapInfo;
  markers: MapMarker[];
  markerTypes: Record<string, MarkerTypeInfo>;
  selectedMarker: MapMarker | null;
  onSelectMarker: (marker: MapMarker | null) => void;
  progress: ProgressMap;
  lang: string;
  routeMarkerIds?: string[];
}

const CLUSTER_ICON_CREATE = `
(function(cluster) {
  var count = cluster.getChildCount();
  var size = count < 10 ? 36 : count < 50 ? 44 : 52;
  return L.divIcon({
    html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(99,102,241,0.8);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;border:2px solid rgba(99,102,241,0.4)">' + count + '</div>',
    className: 'custom-cluster',
    iconSize: [size, size]
  });
})
`;

export default function InteractiveMap({
  map,
  markers,
  markerTypes,
  selectedMarker,
  onSelectMarker,
  progress,
  lang,
  routeMarkerIds = [],
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  // Track rendered markers by id for incremental updates
  const renderedRef = useRef<Map<string, L.Marker>>(new Map());
  const prevMarkerIdsRef = useRef<Set<string>>(new Set());

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const bounds = getMapBounds(map);
    const leafletMap = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: map.minZoom ?? 1,
      maxZoom: map.maxZoom ?? 4,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      attributionControl: false,
      zoomControl: true,
      maxBounds: bounds,
      maxBoundsViscosity: 0.8,
    });

    leafletMap.fitBounds(bounds);

    // Use image overlay (tile upgrade can be swapped in later)
    L.imageOverlay(map.image, bounds, {
      interactive: false,
    }).addTo(leafletMap);

    // Create cluster group
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: new Function("cluster", "return (" + CLUSTER_ICON_CREATE + ")(cluster)") as (cluster: L.MarkerCluster) => L.Icon | L.DivIcon,
    });

    clusterGroup.addTo(leafletMap);
    clusterRef.current = clusterGroup;
    mapRef.current = leafletMap;

    return () => {
      leafletMap.remove();
      mapRef.current = null;
      clusterRef.current = null;
      renderedRef.current.clear();
      prevMarkerIdsRef.current.clear();
    };
  }, [map.id]); // Re-init only when map changes

  // Create or update a single Leaflet marker
  const createLeafletMarker = (marker: MapMarker, isSelected: boolean, isCollected: boolean) => {
    const typeInfo = markerTypes[marker.type];
    if (!typeInfo) return null;

    const icon = createMarkerIcon(typeInfo.color, isSelected, isCollected, marker.icon);
    return L.marker(markerToLatLng(marker), { icon })
      .bindTooltip(
        (() => {
          const name = lang === "zh" || lang === "tw" ? marker.name : marker.nameEn;
          const note = lang === "zh" || lang === "tw" ? marker.noteTitle : marker.noteTitleEn;
          return note ? `${name}<br/><span style="font-size:10px;opacity:0.6">${note}</span>` : name;
        })(),
        {
          direction: "top",
          offset: [0, -12],
          className: "map-tooltip",
        }
      )
      .on("click", () => {
        onSelectMarker(isSelected ? null : marker);
      });
  };

  // Update markers — incremental add/remove when only filter changes,
  // full rebuild when the marker set composition changes
  useEffect(() => {
    if (!clusterRef.current) return;

    const currentIds = new Set(markers.map(m => m.id));
    const prevIds = prevMarkerIdsRef.current;
    const rendered = renderedRef.current;

    // Check if we can do incremental update (same set of markers)
    const sameSet = currentIds.size === prevIds.size &&
      Array.from(currentIds).every(id => prevIds.has(id));

    if (sameSet) {
      // Only update styles (selection/collected state) — no add/remove
      markers.forEach((marker) => {
        const existing = rendered.get(marker.id);
        if (!existing) return;

        const typeInfo = markerTypes[marker.type];
        if (!typeInfo) return;

        const isSelected = selectedMarker?.id === marker.id;
        const isCollected = !!progress[marker.id];
        existing.setIcon(createMarkerIcon(typeInfo.color, isSelected, isCollected, marker.icon));
      });
    } else {
      // Marker set changed — full rebuild
      clusterRef.current.clearLayers();
      rendered.clear();

      markers.forEach((marker) => {
        const isSelected = selectedMarker?.id === marker.id;
        const isCollected = !!progress[marker.id];
        const leafletMarker = createLeafletMarker(marker, isSelected, isCollected);
        if (leafletMarker) {
          clusterRef.current!.addLayer(leafletMarker);
          rendered.set(marker.id, leafletMarker);
        }
      });

      prevMarkerIdsRef.current = currentIds;
    }
  }, [markers, selectedMarker, markerTypes, progress, lang, onSelectMarker]);

  // Draw route polyline
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (routeMarkerIds.length < 2) return;

    // Build ordered lat/lng points
    const points: L.LatLngExpression[] = [];
    for (const id of routeMarkerIds) {
      const m = markers.find((mk) => mk.id === id);
      if (m) points.push(markerToLatLng(m));
    }

    if (points.length < 2) return;

    routeLayerRef.current = L.polyline(points, {
      color: "#818cf8",
      weight: 3,
      opacity: 0.8,
      dashArray: "8 4",
    }).addTo(mapRef.current);
  }, [routeMarkerIds, markers]);

  // Pan to selected marker
  useEffect(() => {
    if (!mapRef.current || !selectedMarker) return;
    const latlng = markerToLatLng(selectedMarker);
    mapRef.current.flyTo(latlng, Math.max(mapRef.current.getZoom(), 2.5), {
      animate: true,
      duration: 0.4,
    });
  }, [selectedMarker]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: "calc(100vh - 200px)", minHeight: "400px" }}
    />
  );
}
