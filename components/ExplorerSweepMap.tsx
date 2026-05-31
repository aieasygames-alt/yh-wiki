"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { MapMarker, MapInfo } from "../lib/map-utils";
import { markerToLatLng, getMapBounds } from "../lib/map-utils";

interface ExplorerSweepMapProps {
  map: MapInfo;
  markers: MapMarker[];
  collectedIds: Set<string>;
  activeIndex: number;
  onMarkerClick: (marker: MapMarker, index: number) => void;
}

export default function ExplorerSweepMap({
  map,
  markers,
  collectedIds,
  activeIndex,
  onMarkerClick,
}: ExplorerSweepMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const m = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: map.minZoom || 1,
      maxZoom: map.maxZoom || 5,
      zoomControl: true,
      attributionControl: false,
    });

    const bounds = getMapBounds(map);
    if (map.image.includes("{z}")) {
      L.tileLayer(map.image, {
        minZoom: map.minZoom || 1,
        maxZoom: map.maxZoom || 5,
        bounds: bounds as L.LatLngBoundsExpression,
        noWrap: true,
      }).addTo(m);
    } else {
      L.imageOverlay(map.image, bounds as L.LatLngBoundsExpression).addTo(m);
    }
    m.fitBounds(bounds as L.LatLngBoundsExpression);

    markersLayerRef.current = L.layerGroup().addTo(m);
    mapRef.current = m;

    return () => {
      m.remove();
      mapRef.current = null;
    };
  }, [map]);

  // Render markers and route
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (markers.length === 0) return;

    // Draw polyline
    if (markers.length >= 2) {
      const latlngs = markers.map((m) => markerToLatLng(m));
      const polyline = L.polyline(latlngs, {
        color: "#818cf8",
        weight: 2,
        opacity: 0.6,
        dashArray: "6 4",
      });
      polyline.addTo(mapRef.current!);
      polylineRef.current = polyline;
    }

    // Draw numbered markers
    markers.forEach((marker, idx) => {
      const isCollected = collectedIds.has(marker.id);
      const isActive = idx === activeIndex;
      const latlng = markerToLatLng(marker);

      const size = isActive ? 28 : 22;
      const bgColor = isCollected ? "#22c55e" : "#6366f1";
      const opacity = isCollected && !isActive ? 0.5 : 1;

      const icon = L.divIcon({
        className: "sweep-marker",
        html: `
          <div style="
            position:relative;width:${size}px;height:${size}px;
            display:flex;align-items:center;justify-content:center;
            opacity:${opacity};transition:opacity 0.2s;
          ">
            ${isActive ? `<div style="position:absolute;inset:-3px;border-radius:50%;border:2px solid #fbbf24;animation:pulse 1.5s infinite"></div>` : ""}
            <div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:${bgColor};display:flex;align-items:center;justify-content:center;
              font-size:${size < 24 ? 9 : 11}px;font-weight:700;color:white;
              box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;
            ">
              ${isCollected ? "✓" : idx + 1}
            </div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const lMarker = L.marker(latlng, { icon });
      lMarker.on("click", () => onMarkerClick(marker, idx));
      lMarker.addTo(markersLayerRef.current!);
    });

    // Fit bounds to markers
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => markerToLatLng(m)));
      mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 3 });
    }
  }, [markers, collectedIds, activeIndex, onMarkerClick]);

  // Pan to active marker
  useEffect(() => {
    if (!mapRef.current || activeIndex < 0 || activeIndex >= markers.length) return;
    const latlng = markerToLatLng(markers[activeIndex]);
    mapRef.current.flyTo(latlng, 3, { duration: 0.3 });
  }, [activeIndex, markers]);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        .sweep-marker { background: none !important; border: none !important; }
      `}</style>
      <div ref={containerRef} className="w-full h-full min-h-[300px] rounded-lg overflow-hidden" />
    </>
  );
}
