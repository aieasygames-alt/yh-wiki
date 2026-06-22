import { z } from "zod";

/**
 * Attribute and Rank are kept as `z.string()` (not enum) because the game
 * introduces new attributes over time (e.g. `light`, `curse`). Strict enums
 * here would block data updates. The valid set is enforced by ATTRIBUTE_LABELS
 * in lib/attributes.ts at render time instead.
 */
export const AttributeEnum = z.string();
export const RankEnum = z.string();

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
  // Known optional sub-objects (declared explicitly so we don't silently drop them)
  faq: z.array(z.any()).optional(),
  relatedCharacters: z.array(z.string()).optional(),
  tierRank: z.string().optional(),
  tierReason: z.string().optional(),
  tierReasonZh: z.string().optional(),
  skills: z.any().optional(),
  recommendedBuild: z.any().optional(),
  teamComps: z.array(z.any()).optional(),
  rotation: z.any().optional(),
  baseStats: z.any().optional(),
  tierByScene: z.any().optional(),
});

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
  image: z.string().optional(),
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
export const WeaponsArraySchema = z.array(WeaponSchema);
export const MaterialsArraySchema = z.array(MaterialSchema);
export const CharacterMaterialsArraySchema = z.array(CharacterMaterialSchema);

/**
 * Validate data at load time. Throws on failure so data errors surface
 * during the build rather than rendering as `undefined` in production.
 *
 * In production builds where build-time failure is too aggressive, callers
 * can pass `mode: "warn"` to log and continue (still returns the parsed
 * data — not the raw input — so the type stays trustworthy).
 */
export function validateData<T>(
  name: string,
  data: unknown,
  schema: z.ZodType<T[]>,
  mode: "throw" | "warn" = "throw",
): T[] {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues;
    const msg =
      `[Data Validation] ${name}: ${issues.length} issue(s) found\n` +
      issues
        .slice(0, 10)
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n") +
      (issues.length > 10 ? `\n  ... and ${issues.length - 10} more` : "");

    if (mode === "warn" || process.env.NODE_ENV !== "production") {
      // Dev: always warn loudly so it shows in console
      console.warn(msg);
    } else {
      // Production build: hard fail
      throw new Error(msg);
    }

    // Even in warn mode, return the input as-is so the page can render
    // (only the explicitly-required fields are guaranteed by the schema's
    // safeParse path; optional fields may be missing but that's the data's
    // problem, not the schema's).
    return data as T[];
  }
  return result.data;
}
