#!/usr/bin/env node
/**
 * Add vehicle image fields and generate placeholder images
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// Color schemes for vehicle types
const COLORS = {
  "摩托车": "#ef4444",
  "越野车": "#22c55e",
  "轿车": "#3b82f6",
  "跑车": "#f59e0b",
  "SUV": "#8b5cf6",
  "Motorcycle": "#ef4444",
  "Off-road Vehicle": "#22c55e",
  "Sedan": "#3b82f6",
  "Sports Car": "#f59e0b",
  "SUV": "#8b5cf6",
  default: "#6b7280",
};

/**
 * Create an SVG placeholder
 */
function createSvgPlaceholder(text, width, height, bgColor) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}"
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
async function generateVehiclePlaceholder(id, name, type, width, height) {
  const outputDir = path.join(IMAGES_DIR, "vehicles");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${id}.webp`);
  const bgColor = COLORS[type] || COLORS.default;

  const svg = createSvgPlaceholder(name.substring(0, 15), width, height, bgColor);

  await sharp(Buffer.from(svg))
    .webp({ quality: 85 })
    .toFile(outputPath);

  console.log(`  Generated: vehicles/${id}.webp`);
  return `/images/vehicles/${id}.webp`;
}

async function main() {
  console.log("🚗 Processing vehicles...\n");

  const vehicles = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "vehicles.json"), "utf-8"));

  for (const vehicle of vehicles) {
    // Generate image
    const name = vehicle.nameEn || vehicle.name || vehicle.id;
    const type = vehicle.typeEn || vehicle.type;
    await generateVehiclePlaceholder(vehicle.id, name, type, 600, 400);

    // Add image field
    if (!vehicle.image) {
      vehicle.image = `/images/vehicles/${vehicle.id}.webp`;
    }
  }

  // Write updated data
  fs.writeFileSync(
    path.join(DATA_DIR, "vehicles.json"),
    JSON.stringify(vehicles, null, 2) + "\n"
  );

  console.log(`\n✅ Updated vehicles.json with image fields`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
