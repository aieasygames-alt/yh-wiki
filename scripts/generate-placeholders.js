#!/usr/bin/env node
/**
 * Generate placeholder images for characters, weapons, and vehicles.
 * Creates SVG-based WebP images with text labels.
 * These can be replaced with actual game images later.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// Color schemes for different attributes/types
const COLORS = {
  // Character attributes
  anima: "#4ade80", // green
  incantation: "#f87171", // red
  psyche: "#60a5fa", // blue
  chaos: "#a78bfa", // purple
  lakshana: "#fbbf24", // yellow
  cosmos: "#14b8a6", // teal
  default: "#6b7280", // gray

  // Weapon types
  melee: "#ef4444",
  ranged: "#3b82f6",
  companion: "#8b5cf6",
  default: "#6b7280",
};

/**
 * Create an SVG placeholder
 */
function createSvgPlaceholder(text, width, height, bgColor) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 5}"
        fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${text}
      </text>
    </svg>
  `;
  return Buffer.from(svg.trim());
}

/**
 * Generate placeholder image
 */
async function generatePlaceholder(type, id, name, width, height, colorKey) {
  const outputDir = path.join(IMAGES_DIR, type);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${id}.webp`);
  const bgColor = COLORS[colorKey] || COLORS.default;

  // Create SVG placeholder
  const svg = createSvgPlaceholder(name, width, height, bgColor);

  // Convert SVG buffer to WebP
  // Sharp can handle SVG buffers directly
  await sharp(Buffer.from(svg))
    .webp({ quality: 85 })
    .toFile(outputPath);

  console.log(`  Generated: ${type}/${id}.webp`);
  return `/images/${type}/${id}.webp`;
}

/**
 * Main function
 */
async function generatePlaceholders() {
  console.log("🎨 Generating placeholder images...\n");

  // Load data
  const characters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "characters.json"), "utf-8"));
  const weapons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "weapons.json"), "utf-8"));

  // Character placeholders (400x500)
  console.log("👤 Characters:");
  for (const char of characters) {
    const name = char.nameEn || char.name || char.id;
    const colorKey = char.attribute || "default";
    await generatePlaceholder("characters", char.id, name.substring(0, 15), 400, 500, colorKey);
  }

  // Weapon placeholders (600x200)
  console.log("\n⚔️  Weapons:");
  for (const weapon of weapons) {
    const name = weapon.nameEn || weapon.name || weapon.id;
    const colorKey = weapon.type || "default";
    await generatePlaceholder("weapons", weapon.id, name.substring(0, 20), 600, 200, colorKey);
  }

  console.log("\n✅ Done! Placeholders generated.");
}

generatePlaceholders().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
