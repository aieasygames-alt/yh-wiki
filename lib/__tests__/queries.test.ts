import { describe, it, expect } from "vitest";
import {
  getAllCharacters,
  getCharacter,
  getAllMaterials,
  getMaterial,
  getCharacterMaterials,
  getMaterialById,
  getCharactersUsingMaterial,
  calculateMaterials,
} from "../queries";

describe("getAllCharacters", () => {
  it("returns a non-empty array", () => {
    const chars = getAllCharacters();
    expect(Array.isArray(chars)).toBe(true);
    expect(chars.length).toBeGreaterThan(0);
  });

  it("each character has required fields", () => {
    const chars = getAllCharacters();
    for (const c of chars) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.nameEn).toBeTruthy();
      expect(c.attribute).toBeTruthy();
      expect(c.rank).toMatch(/^[ABS]$/);
    }
  });
});

describe("getCharacter", () => {
  it("returns correct character by id", () => {
    const adler = getCharacter("adler");
    expect(adler).toBeDefined();
    expect(adler!.name).toBe("阿德勒");
    expect(adler!.nameEn).toBe("Adler");
    expect(adler!.attribute).toBe("incantation");
    expect(adler!.rank).toBe("A");
  });

  it("returns undefined for nonexistent character", () => {
    expect(getCharacter("nonexistent")).toBeUndefined();
  });
});

describe("getAllMaterials", () => {
  it("returns a non-empty array", () => {
    const mats = getAllMaterials();
    expect(Array.isArray(mats)).toBe(true);
    expect(mats.length).toBeGreaterThan(0);
  });
});

describe("getMaterial", () => {
  it("returns material by id", () => {
    const mat = getMaterial("basic-hunter-guide");
    expect(mat).toBeDefined();
    expect(mat!.name).toContain("猎手");
  });

  it("returns undefined for nonexistent material", () => {
    expect(getMaterial("nonexistent")).toBeUndefined();
  });
});

describe("getMaterialById", () => {
  it("finds material by id", () => {
    const mat = getMaterialById("credits");
    expect(mat).toBeDefined();
    expect(mat!.type).toBe("currency");
  });
});

describe("getCharacterMaterials", () => {
  it("returns materials for a known character", () => {
    const cm = getCharacterMaterials("adler");
    expect(cm).toBeDefined();
    expect(cm!.characterId).toBe("adler");
    expect(cm!.levelingMaterials.length).toBeGreaterThan(0);
    expect(cm!.skillMaterials.length).toBeGreaterThan(0);
  });

  it("returns undefined for unknown character", () => {
    expect(getCharacterMaterials("nonexistent")).toBeUndefined();
  });
});

describe("getCharactersUsingMaterial", () => {
  it("returns characters that use a given material", () => {
    const chars = getCharactersUsingMaterial("credits");
    expect(chars.length).toBeGreaterThan(0);
    expect(chars.every((c) => c.id)).toBe(true);
  });

  it("returns empty array for unused material", () => {
    const chars = getCharactersUsingMaterial("nonexistent-material");
    expect(chars).toHaveLength(0);
  });
});

describe("calculateMaterials", () => {
  it("calculates materials for a full level range", () => {
    const result = calculateMaterials("adler", 1, 60);
    expect(result.length).toBeGreaterThan(0);
    // Should include resonance chips and credits
    const hasCredits = result.some((r) => r.materialId === "credits");
    expect(hasCredits).toBe(true);
  });

  it("returns empty when currentLevel >= targetLevel", () => {
    const result = calculateMaterials("adler", 60, 10);
    expect(result).toHaveLength(0);
  });

  it("calculates partial level range correctly", () => {
    const full = calculateMaterials("adler", 1, 60);
    const partial = calculateMaterials("adler", 31, 60);
    // Partial should have fewer or equal entries than full
    expect(partial.length).toBeLessThanOrEqual(full.length);
  });

  it("returns empty for nonexistent character", () => {
    const result = calculateMaterials("nonexistent", 1, 60);
    expect(result).toHaveLength(0);
  });
});
