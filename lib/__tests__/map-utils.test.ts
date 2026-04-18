import { describe, it, expect } from "vitest";
import mapData from "../../data/map-markers.json";

// Pure functions extracted for testing (no Leaflet dependency)
function markerToLatLng(marker: { x: number; y: number }): [number, number] {
  return [100 - marker.y, marker.x];
}

function getMarkerIconSize(isSelected: boolean): number {
  return isSelected ? 32 : 24;
}

function buildMarkerIconHtml(color: string, isSelected: boolean): string {
  const size = getMarkerIconSize(isSelected);
  const ring = isSelected
    ? `<span style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};opacity:0.5"></span>`
    : "";
  return `<div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${ring}
        <div style="width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color};background:${color}40;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.15s">
          <div style="width:8px;height:8px;border-radius:50%;background:${color}"></div>
        </div>
      </div>`;
}

describe("markerToLatLng", () => {
  it("converts percentage coordinates by inverting y", () => {
    expect(markerToLatLng({ x: 50, y: 30 })).toEqual([70, 50]);
  });

  it("converts top-left corner (0,0) to (100,0)", () => {
    expect(markerToLatLng({ x: 0, y: 0 })).toEqual([100, 0]);
  });

  it("converts bottom-right corner (100,100) to (0,100)", () => {
    expect(markerToLatLng({ x: 100, y: 100 })).toEqual([0, 100]);
  });

  it("converts center (50,50) to (50,50)", () => {
    expect(markerToLatLng({ x: 50, y: 50 })).toEqual([50, 50]);
  });
});

describe("getMarkerIconSize", () => {
  it("returns 24 for unselected markers", () => {
    expect(getMarkerIconSize(false)).toBe(24);
  });

  it("returns 32 for selected markers", () => {
    expect(getMarkerIconSize(true)).toBe(32);
  });
});

describe("buildMarkerIconHtml", () => {
  it("includes the color in the HTML", () => {
    const html = buildMarkerIconHtml("#22c55e", false);
    expect(html).toContain("#22c55e");
  });

  it("includes ring when selected", () => {
    const html = buildMarkerIconHtml("#3b82f6", true);
    expect(html).toContain("position:absolute;inset:-4px");
    expect(html).toContain("border:2px solid #3b82f6");
  });

  it("does not include ring when not selected", () => {
    const html = buildMarkerIconHtml("#3b82f6", false);
    expect(html).not.toContain("position:absolute;inset:-4px");
  });

  it("uses size 24 when not selected", () => {
    const html = buildMarkerIconHtml("#ef4444", false);
    expect(html).toContain("width:24px");
  });

  it("uses size 32 when selected", () => {
    const html = buildMarkerIconHtml("#ef4444", true);
    expect(html).toContain("width:32px");
  });
});

describe("map-markers.json data integrity", () => {
  const data = mapData as typeof mapData;

  it("has at least one map", () => {
    expect(data.maps.length).toBeGreaterThanOrEqual(1);
  });

  it("each map has required fields", () => {
    for (const map of data.maps) {
      expect(map.id).toBeTruthy();
      expect(map.name).toBeTruthy();
      expect(map.nameEn).toBeTruthy();
      expect(map.image).toBeTruthy();
      expect(map.description).toBeTruthy();
      expect(map.descriptionEn).toBeTruthy();
      expect(Array.isArray(map.markers)).toBe(true);
    }
  });

  it("each marker has valid coordinates (0-100)", () => {
    for (const map of data.maps) {
      for (const marker of map.markers) {
        expect(marker.x).toBeGreaterThanOrEqual(0);
        expect(marker.x).toBeLessThanOrEqual(100);
        expect(marker.y).toBeGreaterThanOrEqual(0);
        expect(marker.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("each marker references a valid marker type", () => {
    const types = Object.keys(data.markerTypes);
    for (const map of data.maps) {
      for (const marker of map.markers) {
        expect(types).toContain(marker.type);
      }
    }
  });

  it("has no duplicate marker ids within a map", () => {
    for (const map of data.maps) {
      const ids = map.markers.map((m) => m.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    }
  });

  it("each marker has bilingual name and description", () => {
    for (const map of data.maps) {
      for (const marker of map.markers) {
        expect(marker.name).toBeTruthy();
        expect(marker.nameEn).toBeTruthy();
        expect(marker.description).toBeTruthy();
        expect(marker.descriptionEn).toBeTruthy();
      }
    }
  });

  it("markerTypes has the original 4 types", () => {
    const required = ["domain", "boss", "collectible", "waypoint"];
    for (const type of required) {
      expect(data.markerTypes[type]).toBeDefined();
      expect(data.markerTypes[type].color).toBeTruthy();
      expect(data.markerTypes[type].label).toBeTruthy();
      expect(data.markerTypes[type].labelEn).toBeTruthy();
    }
  });

  it("markerTypes has extended types (chest, puzzle, npc, viewpoint)", () => {
    const extended = ["chest", "puzzle", "npc", "viewpoint"];
    for (const type of extended) {
      expect(data.markerTypes[type]).toBeDefined();
      expect(data.markerTypes[type].color).toBeTruthy();
      expect(data.markerTypes[type].label).toBeTruthy();
      expect(data.markerTypes[type].labelEn).toBeTruthy();
    }
  });

  it("new-elydon map has 18 markers", () => {
    const elydon = data.maps.find((m) => m.id === "new-elydon");
    expect(elydon).toBeDefined();
    expect(elydon!.markers).toHaveLength(18);
  });

  it("all marker type colors are valid hex colors", () => {
    for (const [type, info] of Object.entries(data.markerTypes)) {
      expect(info.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
