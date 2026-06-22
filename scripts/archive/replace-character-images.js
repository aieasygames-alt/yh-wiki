#!/usr/bin/env node
/**
 * Replace placeholder character images with real game images.
 *
 * Source: /Users/robert/Documents/Website/异环/characters/
 * Target: /Users/robert/Documents/Website/异环/yh-wiki/public/images/characters/
 *
 * Two sets of images:
 * 1. PNG files (立绘): YH_lihui_character_{pinyin}.png
 * 2. WebP files (头像): {id}.webp
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const TARGET_DIR = path.join(ROOT, "public/images/characters");
const SOURCE_DIR = "/Users/robert/Documents/Website/异环/characters";

// Manual mapping: source filename (without extension) → site character ID
const PNG_MAPPING = {
  // Confirmed matches (pinyin → id)
  "YH_lihui_character_nanali": "nanally",       // 娜娜莉
  "YH_lihui_character_fadiya": "fadia",         // 法蒂亚
  "YH_lihui_character_baizhang": "baicang",     // 百苍
  "YH_lihui_character_dafudier": "daffodil",    // 达芙迪尔
  "YH_lihui_character_jiuyuan": "jiuyuan",      // 九远
  "YH_lihui_character_bohe": "mint",            // 薄荷
  "YH_lihui_character_haniya": "haniel",        // 哈尼尔
  "YH_lihui_character_adele": "adler",          // 阿德勒
  "YH_lihui_character_aidejia": "edgar",        // 埃德加
  "YH_lihui_character_hahuosuoer": "hathor",    // 哈索尔

  // Unconfirmed - needs manual review
  // "YH_lihui_character_anhunqu": "?",         // 暗魂犬?
  // "YH_lihui_character_langren": "?",          // 狼人?
  // "YH_lihui_character_nanzhu": "?",           // 南烛?
  // "YH_lihui_character_xiaozhi": "?",          // 小知?
  // "YH_lihui_character_xun": "?",              // 迅?
  // "YH_lihui_character_zaowu": "?",            // 造物?
};

// WebP files: direct ID match
const WEBP_DIRECT_MATCH = [
  "akane",
  "alphard",
  "black-bird",
  "lingko",
  "nitsa",
  "shinku",
];

// WebP files: new characters NOT in current database
const WEBP_NEW_CHARACTERS = [
  "aurelia",
  "chaos",
  "elyms",
  "exe",
  "iroi",
];

async function convertPngToWebp(sourcePath, targetPath) {
  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  console.log(`    Source: ${metadata.width}x${metadata.height}, ${metadata.format}`);

  // Resize to 400x500 max (maintain aspect ratio)
  await image
    .resize(400, 500, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(targetPath);

  const stat = fs.statSync(targetPath);
  console.log(`    Output: ${(stat.size / 1024).toFixed(1)} KB`);
}

async function copyWebp(sourcePath, targetPath) {
  fs.copyFileSync(sourcePath, targetPath);
  const stat = fs.statSync(targetPath);
  console.log(`    Copied: ${(stat.size / 1024).toFixed(1)} KB`);
}

async function main() {
  console.log("=".repeat(60));
  console.log("🖼️  角色图片替换");
  console.log("=".repeat(60) + "\n");

  // Check source directory
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Ensure target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // Load current character data
  const characters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "characters.json"), "utf-8"));
  const existingIds = new Set(characters.map((c) => c.id));

  let replaced = 0;
  let skipped = 0;
  let newChars = 0;

  // Phase 1: Replace PNG files (立绘)
  console.log("📸 Phase 1: PNG 立绘替换\n");

  for (const [sourceName, charId] of Object.entries(PNG_MAPPING)) {
    if (!existingIds.has(charId)) {
      console.log(`  ⚠️  Character ID "${charId}" not found in database, skipping`);
      skipped++;
      continue;
    }

    const sourcePath = path.join(SOURCE_DIR, `${sourceName}.png`);
    const targetPath = path.join(TARGET_DIR, `${charId}.webp`);

    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⚠️  Source not found: ${sourceName}.png`);
      skipped++;
      continue;
    }

    console.log(`  ✅ ${charId} ← ${sourceName}.png`);
    await convertPngToWebp(sourcePath, targetPath);
    replaced++;
  }

  // Phase 2: Copy WebP files (头像)
  console.log("\n🎨 Phase 2: WebP 头像替换\n");

  for (const charId of WEBP_DIRECT_MATCH) {
    if (!existingIds.has(charId)) {
      console.log(`  ⚠️  Character ID "${charId}" not found in database, skipping`);
      skipped++;
      continue;
    }

    const sourcePath = path.join(SOURCE_DIR, `${charId}.webp`);
    const targetPath = path.join(TARGET_DIR, `${charId}.webp`);

    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⚠️  Source not found: ${charId}.webp`);
      skipped++;
      continue;
    }

    console.log(`  ✅ ${charId} ← ${charId}.webp`);
    await copyWebp(sourcePath, targetPath);
    replaced++;
  }

  // Phase 3: Report new characters
  console.log("\n🆕 Phase 3: 新角色（数据库中无匹配）\n");

  for (const charId of WEBP_NEW_CHARACTERS) {
    const sourcePath = path.join(SOURCE_DIR, `${charId}.webp`);
    if (fs.existsSync(sourcePath)) {
      console.log(`  🆕 ${charId}.webp - 新角色，需手动添加到数据库`);
      newChars++;
    }
  }

  // Phase 4: Report unconfirmed PNG files
  console.log("\n❓ Phase 4: 未确认的 PNG 文件\n");

  const allPngFiles = fs.readdirSync(SOURCE_DIR)
    .filter((f) => f.endsWith(".png"))
    .map((f) => f.replace(".png", ""));

  const matchedPngs = new Set(Object.keys(PNG_MAPPING));
  for (const pngName of allPngFiles) {
    if (!matchedPngs.has(pngName)) {
      console.log(`  ❓ ${pngName}.png - 文件名无法自动匹配，需手动确认`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 替换汇总");
  console.log("=".repeat(60));
  console.log(`  ✅ 已替换: ${replaced}`);
  console.log(`  ⚠️  跳过: ${skipped}`);
  console.log(`  🆕 新角色: ${newChars}`);
  console.log(`  📁 总角色数: ${existingIds.size}`);
  console.log(`  📷 已有真实图片: ${replaced}/${existingIds.size}`);
  console.log("");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
