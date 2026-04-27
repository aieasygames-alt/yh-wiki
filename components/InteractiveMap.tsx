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
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

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
      iconCreateFunction: new Function("cluster", "return (" + CLUSTER_ICON_CREATE + ")(cluster)") as any,
    });

    clusterGroup.addTo(leafletMap);
    clusterRef.current = clusterGroup;
    mapRef.current = leafletMap;

    return () => {
      leafletMap.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, [map.id]); // Re-init only when map changes

  // Update markers when filtered list or progress changes
  useEffect(() => {
    if (!clusterRef.current) return;

    clusterRef.current.clearLayers();

    markers.forEach((marker) => {
      const typeInfo = markerTypes[marker.type];
      if (!typeInfo) return;

      const isSelected = selectedMarker?.id === marker.id;
      const isCollected = !!progress[marker.id];
      const icon = createMarkerIcon(typeInfo.color, isSelected, isCollected);

      const leafletMarker = L.marker(markerToLatLng(marker), { icon })
        .bindTooltip(
          lang === "en" ? marker.nameEn : marker.name,
          {
            direction: "top",
            offset: [0, -12],
            className: "map-tooltip",
          }
        )
        .on("click", () => {
          onSelectMarker(isSelected ? null : marker);
        });

      clusterRef.current!.addLayer(leafletMarker);
    });
  }, [markers, selectedMarker, markerTypes, progress, lang, onSelectMarker]);

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
