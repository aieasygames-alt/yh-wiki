#!/usr/bin/env node
/**
 * Verification script for V4 release
 * Checks all requirements are met before deployment
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const IMAGES_DIR = path.join(ROOT, "public/images");
const PUBLIC_DIR = path.join(ROOT, "public");

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function check(name, condition, message) {
  if (condition) {
    results.passed.push({ name, message });
    console.log(`✅ ${name}: ${message}`);
  } else {
    results.failed.push({ name, message });
    console.log(`❌ ${name}: ${message}`);
  }
}

function warn(name, message) {
  results.warnings.push({ name, message });
  console.log(`⚠️  ${name}: ${message}`);
}

console.log("🔍 V4 Release Verification\n");
console.log("=".repeat(50));

// 1. Data Files
console.log("\n📊 Data Files Check:");

const characters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "characters.json"), "utf-8"));
const weapons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "weapons.json"), "utf-8"));
const vehicles = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "vehicles.json"), "utf-8"));

check("Characters Data", characters.length === 38, `${characters.length} characters`);
check("Weapons Data", weapons.length === 42, `${weapons.length} weapons`);
check("Vehicles Data", vehicles.length >= 15, `${vehicles.length} vehicles`);

// 2. Image Fields
console.log("\n🖼️  Image Fields Check:");

const charsWithImage = characters.filter((c) => c.image).length;
const weaponsWithImage = weapons.filter((w) => w.image).length;
const vehiclesWithImage = vehicles.filter((v) => v.image).length;

check("Characters with Image", charsWithImage === 38, `${charsWithImage}/38 have image field`);
check("Weapons with Image", weaponsWithImage === 42, `${weaponsWithImage}/42 have image field`);
check("Vehicles with Image", vehiclesWithImage === vehicles.length, `${vehiclesWithImage}/${vehicles.length} have image field`);

// 3. Image Files
console.log("\n📁 Image Files Check:");

const charImages = fs.existsSync(path.join(IMAGES_DIR, "characters"))
  ? fs.readdirSync(path.join(IMAGES_DIR, "characters")).filter((f) => f.endsWith(".webp")).length
  : 0;
const weaponImages = fs.existsSync(path.join(IMAGES_DIR, "weapons"))
  ? fs.readdirSync(path.join(IMAGES_DIR, "weapons")).filter((f) => f.endsWith(".webp")).length
  : 0;
const vehicleImages = fs.existsSync(path.join(IMAGES_DIR, "vehicles"))
  ? fs.readdirSync(path.join(IMAGES_DIR, "vehicles")).filter((f) => f.endsWith(".webp")).length
  : 0;

check("Character Images", charImages === 38, `${charImages}/38 .webp files`);
check("Weapon Images", weaponImages === 42, `${weaponImages}/42 .webp files`);
check("Vehicle Images", vehicleImages >= 15, `${vehicleImages}/15+ .webp files`);

// 4. Sitemap Files
console.log("\n🗺️  Sitemap Check:");

const sitemaps = [
  "sitemap.xml",
  "sitemap-pages.xml",
  "sitemap-characters.xml",
  "sitemap-weapons.xml",
  "sitemap-vehicles.xml",
  "sitemap-guides.xml",
  "sitemap-other.xml",
];

sitemaps.forEach((sitemap) => {
  const exists = fs.existsSync(path.join(PUBLIC_DIR, sitemap));
  check(sitemap, exists, exists ? "File exists" : "File missing");
});

if (fs.existsSync(path.join(PUBLIC_DIR, "sitemap-vehicles.xml"))) {
  const content = fs.readFileSync(path.join(PUBLIC_DIR, "sitemap-vehicles.xml"), "utf-8");
  const urlCount = (content.match(/<url>/g) || []).length;
  check("Vehicles Sitemap URLs", urlCount >= 30, `${urlCount} URLs (expected 32)`);
}

// 5. Component Files
console.log("\n🧩 Component Files Check:");

const components = [
  "components/VehicleCard.tsx",
  "components/GameImage.tsx",
  "components/WeaponCard.tsx",
  "app/[lang]/vehicles/page.tsx",
  "app/[lang]/vehicles/[slug]/page.tsx",
];

components.forEach((component) => {
  const exists = fs.existsSync(path.join(ROOT, component));
  check(component, exists, exists ? "File exists" : "File missing");
});

// 6. i18n
console.log("\n🌐 i18n Check:");

const zh = JSON.parse(fs.readFileSync(path.join(ROOT, "messages/zh.json"), "utf-8"));
const en = JSON.parse(fs.readFileSync(path.join(ROOT, "messages/en.json"), "utf-8"));

check("zh.json - vehicles", zh.site.nav.vehicles === "载具", "Translation exists");
check("en.json - vehicles", en.site.nav.vehicles === "Vehicles", "Translation exists");

// 7. Scripts
console.log("\n📜 Scripts Check:");

const scripts = [
  "scripts/import-images.js",
  "scripts/generate-placeholders.js",
  "scripts/convert-to-webp.js",
];

scripts.forEach((script) => {
  const exists = fs.existsSync(path.join(ROOT, script));
  check(script, exists, exists ? "File exists" : "File missing");
});

// 8. Warnings
console.log("\n⚠️  Warnings:");

const hasPlaceholderImages = charImages > 0 && charImages === charsWithImage;
if (hasPlaceholderImages) {
  warn("Image Quality", "Currently using placeholder images. Replace with real game assets before production.");
}

const imageSourcesConfigured = fs.existsSync(path.join(DATA_DIR, "image-sources.json"));
if (!imageSourcesConfigured) {
  warn("Image Sources", "image-sources.json not configured. Run: node scripts/import-images.js --template");
}

// Summary
console.log("\n" + "=".repeat(50));
console.log("📊 Summary:");
console.log(`  ✅ Passed: ${results.passed.length}`);
console.log(`  ❌ Failed: ${results.failed.length}`);
console.log(`  ⚠️  Warnings: ${results.warnings.length}`);

if (results.failed.length > 0) {
  console.log("\n❌ Verification FAILED. Please fix the issues above.");
  process.exit(1);
} else if (results.warnings.length > 0) {
  console.log("\n⚠️  Verification passed with warnings. Review before deploying.");
} else {
  console.log("\n✅ All checks passed! Ready for deployment.");
}
