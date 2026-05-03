import { z } from "zod";

export const AttributeEnum = z.enum([
  "cosmos",
  "anima",
  "incantation",
  "chaos",
  "psyche",
  "lakshana",
]);

export const RankEnum = z.enum(["A", "B", "S"]);

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameTw: z.string().optional(),
  nameEn: z.string(),
  attribute: z.string(),
  rank: z.string(),
  weapon: z.string(),
  weaponEn: z.string(),
  role: z.string(),
  roleEn: z.string(),
  faction: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  status: z.string().optional(),
  image: z.string().optional(),
  cvZh: z.string().optional(),
  cvJp: z.string().optional(),
  cvJpEn: z.string().optional(),
  cvEn: z.string().optional(),
  arcType: z.string().optional(),
  trait: z.string().optional(),
  signatureArc: z.string().optional(),
  rarity: z.string().optional(),
  title: z.string().optional(),
  acquisitionMethod: z.string().optional(),
  availableAtLaunch: z.boolean().optional(),
  awakenReq: z.string().optional(),
}).passthrough();

export const WeaponSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameTw: z.string(),
  nameEn: z.string(),
  rank: z.string(),
  type: z.string(),
  baseAtk: z.number(),
  substat: z.string(),
  substatValue: z.string(),
  effectName: z.string(),
  effectNameTw: z.string(),
  effectNameEn: z.string(),
  effectDescription: z.string(),
  effectDescriptionTw: z.string(),
  effectDescriptionEn: z.string(),
  howToObtain: z.string(),
  howToObtainZh: z.string(),
  howToObtainEn: z.string(),
  signatureCharacter: z.string(),
  status: z.string(),
}).passthrough();

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
export const WeaponsArraySchema = z.array(WeaponSchema);
export const MaterialsArraySchema = z.array(MaterialSchema);
export const CharacterMaterialsArraySchema = z.array(CharacterMaterialSchema);

/** Validate data at load time, logging warnings for invalid entries */
export function validateData<T>(
  name: string,
  data: unknown,
  schema: z.ZodType<T[]>,
): T[] {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues;
    console.warn(`[Data Validation] ${name}: ${issues.length} issues found`);
    issues.slice(5).forEach((issue) => {
      console.warn(`  - ${issue.path.join(".")}: ${issue.message}`);
    });
    if (issues.length > 5) {
      console.warn(`  ... and ${issues.length - 5} more`);
    }
  }
  return data as T[];
}
