#!/usr/bin/env node
/**
 * Image Import Script for nteguide.com
 *
 * Downloads character, weapon, and vehicle images from external sources,
 * converts them to WebP format, optimizes compression, and updates JSON data.
 *
 * Usage:
 *   node scripts/import-images.js              # Import all
 *   node scripts/import-images.js characters    # Import characters only
 *   node scripts/import-images.js weapons      # Import weapons only
 *   node scripts/import-images.js vehicles     # Import vehicles only
 *
 * Image URL Mapping:
 *   Create data/image-sources.json to map IDs to source URLs.
 *   Format:
 *   {
 *     "characters": {
 *       "nanally": "https://example.com/nanally.png"
 *     },
 *     "weapons": {
 *       "voltage-sigma": "https://example.com/voltage-sigma.png"
 *     }
 *   }
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// Image specifications from PRD
const SPECS = {
  characters: {
    width: 400,
    height: 500,
    quality: 85,
    maxWidth: 100,
  },
  weapons: {
    width: 600,
    height: 200,
    quality: 85,
    maxWidth: 80,
  },
  vehicles: {
    width: 600,
    height: 400,
    quality: 85,
    maxWidth: 100,
  },
};

// Default image sources (to be populated by user)
const DEFAULT_SOURCES = {
  characters: {},
  weapons: {},
  vehicles: {},
};

/**
 * Download an image from URL to buffer
 */
async function downloadImage(url, options = {}) {
  const { timeout = 30000, headers = {} } = options;

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const reqOptions = {
      ...new URL(url),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...headers,
      },
      timeout,
    };

    protocol
      .get(reqOptions, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject)
      .on("timeout", () => reject(new Error(`Timeout downloading ${url}`)));
  });
}

/**
 * Convert and optimize image to WebP
 */
async function convertToWebP(buffer, spec, outputPath) {
  let pipeline = sharp(buffer);

  // Resize if needed (maintain aspect ratio, fit within dimensions)
  if (spec.width && spec.height) {
    pipeline = pipeline.resize(spec.width, spec.height, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Convert to WebP with optimization
  pipeline = pipeline.webp({
    quality: spec.quality,
    effort: 6, // High compression effort
  });

  const output = await pipeline.toBuffer();

  // Check file size and reduce quality if needed
  if (output.length > spec.maxWidth * 1024) {
    const adjustedQuality = Math.floor((spec.maxWidth * 1024 * spec.quality) / output.length);
    const reprocessed = await sharp(buffer)
      .resize(spec.width, spec.height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: Math.max(50, adjustedQuality), effort: 6 })
      .toBuffer();
    return reprocessed;
  }

  return output;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Load image sources mapping
 */
function loadImageSources() {
  const sourcesPath = path.join(DATA_DIR, "image-sources.json");
  if (fs.existsSync(sourcesPath)) {
    return JSON.parse(fs.readFileSync(sourcesPath, "utf-8"));
  }
  return DEFAULT_SOURCES;
}

/**
 * Process a single image
 */
async function processImage(type, id, sourceUrl) {
  const spec = SPECS[type];
  const outputDir = path.join(IMAGES_DIR, type);
  ensureDir(outputDir);

  const outputPath = path.join(outputDir, `${id}.webp`);

  console.log(`  Processing ${type}/${id}...`);

  try {
    // Download
    const buffer = await downloadImage(sourceUrl);
    console.log(`    Downloaded: ${(buffer.length / 1024).toFixed(1)} KB`);

    // Convert to WebP
    const webpBuffer = await convertToWebP(buffer, spec, outputPath);
    console.log(`    Converted: ${(webpBuffer.length / 1024).toFixed(1)} KB`);

    // Save
    fs.writeFileSync(outputPath, webpBuffer);
    console.log(`    Saved: ${outputPath}`);

    return `/images/${type}/${id}.webp`;
  } catch (error) {
    console.error(`    Error: ${error.message}`);
    return null;
  }
}

/**
 * Update JSON data file with image URLs
 */
function updateDataFile(type, id, imagePath) {
  const filePath = path.join(DATA_DIR, `${type}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const item = data.find((item) => item.id === id);
  if (item) {
    item.image = imagePath;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    console.log(`    Updated ${type}.json`);
  }
}

/**
 * Main import function
 */
async function importImages(types = ["characters", "weapons", "vehicles"]) {
  console.log("🖼️  Image Import Script\n");

  const sources = loadImageSources();
  const results = {
    success: [],
    failed: [],
  };

  for (const type of types) {
    console.log(`\n📁 Processing ${type}...`);

    if (!sources[type] || Object.keys(sources[type]).length === 0) {
      console.log(`  ⚠️  No image sources found for ${type}`);
      console.log(`     Create data/image-sources.json with ${type} URLs`);
      continue;
    }

    const entries = Object.entries(sources[type]);
    console.log(`  Found ${entries.length} items\n`);

    for (const [id, url] of entries) {
      const imagePath = await processImage(type, id, url);

      if (imagePath) {
        updateDataFile(type, id, imagePath);
        results.success.push({ type, id, url });
      } else {
        results.failed.push({ type, id, url });
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Import Summary");
  console.log("=".repeat(50));
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log("\nFailed items:");
    results.failed.forEach(({ type, id }) => {
      console.log(`  - ${type}/${id}`);
    });
  }
}

/**
 * Generate template image-sources.json
 */
function generateTemplate() {
  // Load characters and weapons to get IDs
  const characters = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "characters.json"), "utf-8"));
  const weapons = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "weapons.json"), "utf-8"));

  const template = {
    _comment: "Add image URLs for each ID. Run: node scripts/import-images.js",
    characters: {},
    weapons: {},
    vehicles: {},
  };

  characters.forEach((char) => {
    template.characters[char.id] = "";
  });

  weapons.forEach((weapon) => {
    template.weapons[weapon.id] = "";
  });

  const outputPath = path.join(DATA_DIR, "image-sources.json");
  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2) + "\n");
  console.log(`📝 Template created: ${outputPath}`);
  console.log(`   Edit this file with image URLs, then run the import script.`);
}

// CLI
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage:
  node scripts/import-images.js              # Import all
  node scripts/import-images.js characters    # Import characters only
  node scripts/import-images.js weapons      # Import weapons only
  node scripts/import-images.js vehicles     # Import vehicles only
  node scripts/import-images.js --template   # Generate image-sources.json template
`);
  process.exit(0);
}

if (args.includes("--template")) {
  generateTemplate();
  process.exit(0);
}

const types = args.length > 0 ? args.filter((arg) => !arg.startsWith("--")) : ["characters", "weapons", "vehicles"];

importImages(types).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
