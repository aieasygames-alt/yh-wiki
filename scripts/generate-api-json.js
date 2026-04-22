/**
 * Generate public API JSON files for the Discord Bot to consume.
 * Reads from data/characters.json and data/redeem-codes.json,
 * outputs simplified versions to public/api/.
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function readJSON(filepath) {
  return JSON.parse(readFileSync(resolve(root, filepath), "utf-8"));
}

function writeJSON(filepath, data) {
  const full = resolve(root, filepath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  → ${filepath} (${data.length} items)`);
}

// --- Characters API ---
const characters = readJSON("data/characters.json");
const charactersApi = characters.map((c) => ({
  id: c.id,
  name: c.nameEn || c.name,
  nameCn: c.name,
  slug: c.id,
  element: c.attribute || null,
  weapon: c.weaponEn || c.weapon || null,
  rarity: c.rank === "S" ? 5 : c.rank === "A" ? 4 : 3,
  role: c.roleEn || c.role || null,
  image: c.image || null,
}));
writeJSON("public/api/characters.json", charactersApi);

// --- Redeem Codes API ---
const codes = readJSON("data/redeem-codes.json");
const codesApi = codes.map((c) => ({
  code: c.code,
  reward: c.rewardEn || c.reward,
  rewardCn: c.reward,
  expired: c.status === "expired",
  expiresAt: c.expiresAt || null,
  region: c.region || "global",
}));
writeJSON("public/api/redeem-codes.json", codesApi);

console.log("✅ API JSON files generated.");
