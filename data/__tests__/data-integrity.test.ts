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

  it("all characters have valid ranks (A or S)", () => {
    for (const c of charactersData) {
      expect(["A", "S"]).toContain(c.rank);
    }
  });

  it("has 18 characters", () => {
    expect(charactersData).toHaveLength(18);
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

  it("every characterId exists in characters.json", () => {
    const charIds = new Set(charactersData.map((c) => c.id));
    for (const cm of characterMaterialsData) {
      expect(charIds.has(cm.characterId)).toBe(true);
    }
  });

  it("every materialId in levelingMaterials exists in materials.json", () => {
    const materialIds = new Set(materialsData.map((m) => m.id));
    for (const cm of characterMaterialsData) {
      for (const lr of cm.levelingMaterials) {
        for (const m of lr.materials) {
          expect(materialIds.has(m.id)).toBe(true);
        }
      }
    }
  });

  it("every materialId in skillMaterials exists in materials.json", () => {
    const materialIds = new Set(materialsData.map((m) => m.id));
    for (const cm of characterMaterialsData) {
      for (const m of cm.skillMaterials) {
        expect(materialIds.has(m.id)).toBe(true);
      }
    }
  });

  it("has entries for 18 characters", () => {
    expect(characterMaterialsData).toHaveLength(18);
  });

  it("no duplicate characterIds", () => {
    const ids = characterMaterialsData.map((cm) => cm.characterId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
