"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  type MapMarker,
  type MarkerTypeInfo,
  type MapInfo,
  MAP_BOUNDS,
  markerToLatLng,
  createMarkerIcon,
} from "../lib/map-utils";

interface InteractiveMapProps {
  map: MapInfo;
  markers: MapMarker[];
  markerTypes: Record<string, MarkerTypeInfo>;
  selectedMarker: MapMarker | null;
  onSelectMarker: (marker: MapMarker | null) => void;
  lang: "zh" | "en";
}

export default function InteractiveMap({
  map,
  markers,
  markerTypes,
  selectedMarker,
  onSelectMarker,
  lang,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const leafletMap = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: 1,
      maxZoom: 4,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      attributionControl: false,
      zoomControl: true,
    });

    leafletMap.fitBounds(MAP_BOUNDS);

    // Add image overlay
    L.imageOverlay(map.image, MAP_BOUNDS, {
      interactive: false,
    }).addTo(leafletMap);

    // Create markers layer group
    markersLayerRef.current = L.layerGroup().addTo(leafletMap);

    mapRef.current = leafletMap;

    return () => {
      leafletMap.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [map.image]);

  // Update markers when filtered list changes
  useEffect(() => {
    if (!markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const typeInfo = markerTypes[marker.type];
      if (!typeInfo) return;

      const isSelected = selectedMarker?.id === marker.id;
      const icon = createMarkerIcon(typeInfo.color, isSelected);

      const leafletMarker = L.marker(markerToLatLng(marker), { icon })
        .bindTooltip(
          lang === "zh" ? marker.name : marker.nameEn,
          {
            direction: "top",
            offset: [0, -12],
            className: "map-tooltip",
          }
        )
        .on("click", () => {
          onSelectMarker(isSelected ? null : marker);
        });

      markersLayerRef.current!.addLayer(leafletMarker);
    });
  }, [markers, selectedMarker, markerTypes, lang, onSelectMarker]);

  // Pan to selected marker
  useEffect(() => {
    if (!mapRef.current || !selectedMarker) return;
    const latlng = markerToLatLng(selectedMarker);
    mapRef.current.panTo(latlng, { animate: true, duration: 0.3 });
  }, [selectedMarker]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: "calc(100vh - 280px)", minHeight: "400px" }}
    />
  );
}
