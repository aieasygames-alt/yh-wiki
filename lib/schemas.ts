import { z } from "zod";

export const AttributeEnum = z.enum([
  "cosmos",
  "anima",
  "incantation",
  "chaos",
  "psyche",
  "lakshana",
]);

export const RankEnum = z.enum(["A", "S"]);

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  attribute: AttributeEnum,
  rank: RankEnum,
  weapon: z.string(),
  weaponEn: z.string(),
  role: z.string(),
  roleEn: z.string(),
  faction: z.string().optional(),
  description: z.string().optional(),
});

export const MaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  type: z.string(),
  rarity: z.number().min(1).max(5),
  source: z.string(),
});

export const MaterialEntrySchema = z.object({
  id: z.string(),
  quantity: z.number().positive(),
});

export const LevelRangeSchema = z.object({
  levelRange: z.string(),
  materials: z.array(MaterialEntrySchema),
});

export const CharacterMaterialSchema = z.object({
  characterId: z.string(),
  levelingMaterials: z.array(LevelRangeSchema),
  skillMaterials: z.array(MaterialEntrySchema),
});

export const CharactersArraySchema = z.array(CharacterSchema);
export const MaterialsArraySchema = z.array(MaterialSchema);
export const CharacterMaterialsArraySchema = z.array(CharacterMaterialSchema);
