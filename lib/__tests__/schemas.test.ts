import { describe, it, expect } from "vitest";
import {
  AttributeEnum,
  RankEnum,
  CharacterSchema,
  CharactersArraySchema,
  MaterialSchema,
  MaterialEntrySchema,
  MaterialsArraySchema,
  LevelRangeSchema,
  CharacterMaterialSchema,
  CharacterMaterialsArraySchema,
} from "../schemas";

describe("AttributeEnum", () => {
  it("accepts all 6 valid attributes", () => {
    const attrs = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];
    for (const attr of attrs) {
      expect(AttributeEnum.parse(attr)).toBe(attr);
    }
  });

  it("rejects invalid attributes", () => {
    expect(() => AttributeEnum.parse("electric")).toThrow();
    expect(() => AttributeEnum.parse("fire")).toThrow();
    expect(() => AttributeEnum.parse("")).toThrow();
  });
});

describe("RankEnum", () => {
  it("accepts A and S", () => {
    expect(RankEnum.parse("A")).toBe("A");
    expect(RankEnum.parse("S")).toBe("S");
  });

  it("rejects invalid ranks", () => {
    expect(() => RankEnum.parse("B")).toThrow();
    expect(() => RankEnum.parse("SSR")).toThrow();
    expect(() => RankEnum.parse("")).toThrow();
  });
});

describe("CharacterSchema", () => {
  const validCharacter = {
    id: "adler",
    name: "阿德勒",
    nameEn: "Adler",
    attribute: "incantation",
    rank: "A",
    weapon: "杖剑",
    weaponEn: "Cane Sword",
    role: "进攻",
    roleEn: "Attack",
    faction: "Eibon Antique Shop",
    description: "Eibon 古董店的管家",
  };

  it("validates a correct character", () => {
    expect(CharacterSchema.parse(validCharacter)).toEqual(validCharacter);
  });

  it("allows optional fields to be omitted", () => {
    const { faction, description, ...minimal } = validCharacter;
    expect(CharacterSchema.parse(minimal)).toEqual(minimal);
  });

  it("rejects invalid attribute", () => {
    expect(() => CharacterSchema.parse({ ...validCharacter, attribute: "fire" })).toThrow();
  });

  it("rejects invalid rank", () => {
    expect(() => CharacterSchema.parse({ ...validCharacter, rank: "SSR" })).toThrow();
  });
});

describe("MaterialSchema", () => {
  const validMaterial = {
    id: "basic-resonance-chip",
    name: "基础共鸣芯片",
    nameEn: "Basic Resonance Chip",
    type: "resonance",
    rarity: 1,
    source: "日常副本",
  };

  it("validates a correct material", () => {
    expect(MaterialSchema.parse(validMaterial)).toEqual(validMaterial);
  });

  it("rejects rarity below 1", () => {
    expect(() => MaterialSchema.parse({ ...validMaterial, rarity: 0 })).toThrow();
  });

  it("rejects rarity above 5", () => {
    expect(() => MaterialSchema.parse({ ...validMaterial, rarity: 6 })).toThrow();
  });
});

describe("MaterialEntrySchema", () => {
  it("accepts positive quantity", () => {
    expect(MaterialEntrySchema.parse({ id: "test", quantity: 5 })).toEqual({ id: "test", quantity: 5 });
  });

  it("rejects zero quantity", () => {
    expect(() => MaterialEntrySchema.parse({ id: "test", quantity: 0 })).toThrow();
  });

  it("rejects negative quantity", () => {
    expect(() => MaterialEntrySchema.parse({ id: "test", quantity: -1 })).toThrow();
  });
});

describe("LevelRangeSchema", () => {
  it("validates a correct level range", () => {
    const data = { levelRange: "1-10", materials: [{ id: "chip", quantity: 3 }] };
    expect(LevelRangeSchema.parse(data)).toEqual(data);
  });
});

describe("CharacterMaterialSchema", () => {
  it("validates a correct character material entry", () => {
    const data = {
      characterId: "adler",
      levelingMaterials: [{ levelRange: "1-10", materials: [{ id: "chip", quantity: 3 }] }],
      skillMaterials: [{ id: "manual", quantity: 12 }],
    };
    expect(CharacterMaterialSchema.parse(data)).toEqual(data);
  });
});

describe("Array schemas", () => {
  it("CharactersArraySchema validates an array of characters", () => {
    const arr = [
      { id: "adler", name: "阿德勒", nameEn: "Adler", attribute: "incantation", rank: "A", weapon: "杖剑", weaponEn: "Cane Sword", role: "进攻", roleEn: "Attack" },
    ];
    expect(CharactersArraySchema.parse(arr)).toHaveLength(1);
  });

  it("MaterialsArraySchema validates an array of materials", () => {
    const arr = [
      { id: "chip", name: "芯片", nameEn: "Chip", type: "resonance", rarity: 2, source: "test" },
    ];
    expect(MaterialsArraySchema.parse(arr)).toHaveLength(1);
  });

  it("CharacterMaterialsArraySchema validates an array of character materials", () => {
    const arr = [
      { characterId: "adler", levelingMaterials: [], skillMaterials: [] },
    ];
    expect(CharacterMaterialsArraySchema.parse(arr)).toHaveLength(1);
  });
});
