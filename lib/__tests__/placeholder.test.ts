import { describe, it, expect } from "vitest";
import { getPlaceholderImage } from "../placeholder";

describe("getPlaceholderImage", () => {
  it("returns a data URI SVG", () => {
    const result = getPlaceholderImage("character", "Test");
    expect(result).toMatch(/^data:image\/svg\+xml,/);
  });

  it("includes the name in the SVG (short names)", () => {
    const result = getPlaceholderImage("character", "Test");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("Test");
  });

  it("truncates names longer than 4 characters", () => {
    const result = getPlaceholderImage("character", "VeryLongName");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("Very");
    expect(svg).not.toContain("VeryL");
  });

  it("does not truncate names of 4 characters or less", () => {
    const result = getPlaceholderImage("character", "角色");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("角色");
  });

  it("uses correct colors for character type", () => {
    const result = getPlaceholderImage("character", "A");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("#1e293b"); // character bg
    expect(svg).toContain("#94a3b8"); // character text
  });

  it("uses correct colors for material type", () => {
    const result = getPlaceholderImage("material", "A");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("#1a1a2e"); // material bg
  });

  it("uses correct colors for weapon type", () => {
    const result = getPlaceholderImage("weapon", "A");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("#2d1b1b"); // weapon bg
  });

  it("uses correct colors for vehicle type", () => {
    const result = getPlaceholderImage("vehicle", "A");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("#1b2d1b"); // vehicle bg
  });

  it("generates valid SVG with proper dimensions", () => {
    const result = getPlaceholderImage("character", "Test");
    const svg = decodeURIComponent(result.replace("data:image/svg+xml,", ""));
    expect(svg).toContain('width="128"');
    expect(svg).toContain('height="128"');
  });
});
