import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock placeholder helper — verify it is called on img error
vi.mock("../../lib/placeholder", () => ({
  getPlaceholderImage: vi.fn((type: string, name: string) => `/placeholder/${type}/${encodeURIComponent(name)}.svg`),
}));

import { GameImage } from "../GameImage";
import { getPlaceholderImage } from "../../lib/placeholder";

describe("GameImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("constructs the src from type and id", () => {
    const { container } = render(<GameImage type="character" id="nanally" name="Nanally" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("/images/characters/nanally.webp");
  });

  it("uses the explicit src prop when provided", () => {
    const { container } = render(
      <GameImage type="character" id="x" name="X" src="/custom/path.webp" />
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("/custom/path.webp");
  });

  it("appends a cache-buster query to the src", () => {
    const { container } = render(<GameImage type="weapon" id="w1" name="W1" />);
    const src = container.querySelector("img")?.getAttribute("src") || "";
    expect(src).toMatch(/\?v=\d+$/);
  });

  it("uses contain layout for materials, cover for characters", () => {
    const { container: charContainer } = render(<GameImage type="character" id="c1" name="C1" />);
    const charImg = charContainer.querySelector("img");
    expect(charImg?.className).toContain("object-cover");

    const { container: matContainer } = render(<GameImage type="material" id="m1" name="M1" />);
    const matImg = matContainer.querySelector("img");
    expect(matImg?.className).toContain("object-contain");
  });

  it("respects explicit contain override", () => {
    const { container } = render(<GameImage type="character" id="c1" name="C1" contain />);
    const img = container.querySelector("img");
    expect(img?.className).toContain("object-contain");
  });

  it("eager-loads when priority is set", () => {
    const { container } = render(<GameImage type="character" id="c1" name="C1" priority />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
    expect(img?.getAttribute("fetchpriority")).toBe("high");
  });

  it("lazy-loads by default", () => {
    const { container } = render(<GameImage type="character" id="c1" name="C1" />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("lazy");
    expect(img?.getAttribute("fetchpriority")).toBeNull();
  });

  it("falls back to placeholder on image error", () => {
    const { container } = render(<GameImage type="character" id="canhong" name="残虹" />);
    const img = container.querySelector("img")!;
    expect(getPlaceholderImage).not.toHaveBeenCalled();

    fireEvent.error(img);
    expect(getPlaceholderImage).toHaveBeenCalledTimes(1);
    expect(getPlaceholderImage).toHaveBeenCalledWith("character", "残虹");
    const newSrc = img.getAttribute("src") || "";
    expect(newSrc).toContain("/placeholder/character/");
  });

  it("builds a descriptive alt text by default", () => {
    const { container } = render(<GameImage type="weapon" id="w1" name="Eternal Waltz" />);
    const alt = container.querySelector("img")?.getAttribute("alt") || "";
    expect(alt).toContain("Eternal Waltz");
    expect(alt).toContain("weapon");
    expect(alt).toMatch(/Neverness to Everness/i);
  });

  it("uses the provided alt when given", () => {
    const { container } = render(
      <GameImage type="character" id="c1" name="C1" alt="Custom alt" />
    );
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("Custom alt");
  });

  it("supports the cassette type", () => {
    const { container } = render(<GameImage type="cassette" id="cs1" name="CS1" />);
    const src = container.querySelector("img")?.getAttribute("src") || "";
    expect(src).toContain("/images/cassettes/cs1.webp");
  });

  it("supports the vehicle type", () => {
    const { container } = render(<GameImage type="vehicle" id="v1" name="V1" />);
    const src = container.querySelector("img")?.getAttribute("src") || "";
    expect(src).toContain("/images/vehicles/v1.webp");
  });
});
