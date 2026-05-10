import { describe, it, expect } from "vitest";
import charactersData from "../../data/characters.json";
import materialsData from "../../data/materials.json";
import characterMaterialsData from "../../data/character-materials.json";
import { CharactersArraySchema, MaterialsArraySchema, CharacterMaterialsArraySchema } from "../../lib/schemas";

const VALID_ATTRIBUTES = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];

describe("characters.json data integrity", () => {
  it("passes Zod validation", () => {
    expect(() => CharactersArraySchema.parse(charactersData)).not.toThrow();
  });

  it("has no duplicate character ids", () => {
    const ids = charactersData.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all characters have valid attributes", () => {
    for (const c of charactersData) {
      expect(VALID_ATTRIBUTES).toContain(c.attribute);
    }
  });

  it("all characters have valid ranks (A, B, or S)", () => {
    for (const c of charactersData) {
      expect(["A", "B", "S"]).toContain(c.rank);
    }
  });

  it("has at least 39 characters", () => {
    expect(charactersData.length).toBeGreaterThanOrEqual(39);
  });
});

describe("materials.json data integrity", () => {
  it("passes Zod validation", () => {
    expect(() => MaterialsArraySchema.parse(materialsData)).not.toThrow();
  });

  it("has no duplicate material ids", () => {
    const ids = materialsData.map((m) => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all rarities are between 1 and 5", () => {
    for (const m of materialsData) {
      expect(m.rarity).toBeGreaterThanOrEqual(1);
      expect(m.rarity).toBeLessThanOrEqual(5);
    }
  });
});

describe("character-materials.json data integrity", () => {
  it("passes Zod validation", () => {
    expect(() => CharacterMaterialsArraySchema.parse(characterMaterialsData)).not.toThrow();
  });

  it("every characterId exists in characters.json (except known exceptions)", () => {
    const charIds = new Set(charactersData.map((c) => c.id));
    const knownMissing = new Set(["zero"]);
    const missing: string[] = [];
    for (const cm of characterMaterialsData) {
      if (!charIds.has(cm.characterId) && !knownMissing.has(cm.characterId)) {
        missing.push(cm.characterId);
      }
    }
    expect(missing).toEqual([] as string[]);
  });

  it("every materialId in levelingMaterials has a non-empty id and positive quantity", () => {
    for (const cm of characterMaterialsData) {
      for (const lr of cm.levelingMaterials) {
        for (const m of lr.materials) {
          expect(m.id).toBeTruthy();
          expect(m.quantity).toBeGreaterThan(0);
        }
      }
    }
  });

  it("every materialId in skillMaterials has a non-empty id and positive quantity", () => {
    for (const cm of characterMaterialsData) {
      for (const m of cm.skillMaterials) {
        expect(m.id).toBeTruthy();
        expect(m.quantity).toBeGreaterThan(0);
      }
    }
  });

  it("has entries for 21 characters", () => {
    expect(characterMaterialsData).toHaveLength(21);
  });

  it("no duplicate characterIds", () => {
    const ids = characterMaterialsData.map((cm) => cm.characterId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
