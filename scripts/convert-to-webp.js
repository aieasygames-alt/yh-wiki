#!/usr/bin/env node
/**
 * Convert PNG/JPG images to WebP format
 * Usage: node scripts/convert-to-webp.js
 *
 * This script converts all PNG and JPG images in the images directory
 * to WebP format for better performance and smaller file sizes.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public/images");

const IMAGE_SPECS = {
  characters: { width: 400, height: 500, quality: 85 },
  weapons: { width: 600, height: 200, quality: 85 },
  vehicles: { width: 600, height: 400, quality: 85 },
};

async function convertImage(inputPath, outputPath, spec) {
  try {
    let pipeline = sharp(inputPath);

    // Resize if needed (maintain aspect ratio)
    if (spec && spec.width && spec.height) {
      pipeline = pipeline.resize(spec.width, spec.height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert to WebP
    const webpBuffer = await pipeline.webp({ quality: spec?.quality || 85 }).toBuffer();

    // Check file size
    const maxSizeKB = 100;
    if (webpBuffer.length > maxSizeKB * 1024) {
      console.log(`  ⚠️  File size ${(webpBuffer.length / 1024).toFixed(1)}KB exceeds ${maxSizeKB}KB, recompressing...`);
      const adjustedQuality = Math.floor((maxSizeKB * 1024 * 85) / webpBuffer.length);
      const recompressed = await sharp(inputPath)
        .resize(spec?.width, spec?.height, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: Math.max(50, adjustedQuality) })
        .toBuffer();
      fs.writeFileSync(outputPath, recompressed);
      console.log(`  ✓ Converted (recompressed): ${(recompressed.length / 1024).toFixed(1)}KB`);
    } else {
      fs.writeFileSync(outputPath, webpBuffer);
      console.log(`  ✓ Converted: ${(webpBuffer.length / 1024).toFixed(1)}KB`);
    }

    // Delete original file
    fs.unlinkSync(inputPath);
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
  }
}

async function convertDirectory(type) {
  const dirPath = path.join(IMAGES_DIR, type);
  if (!fs.existsSync(dirPath)) {
    console.log(`  Directory ${type} not found, skipping...`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  const imagesToConvert = files.filter(
    (f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg")
  );

  if (imagesToConvert.length === 0) {
    console.log(`  No PNG/JPG files found in ${type}/`);
    return;
  }

  console.log(`\n📁 Converting ${type}/ (${imagesToConvert.length} files)`);

  const spec = IMAGE_SPECS[type];
  for (const file of imagesToConvert) {
    const inputPath = path.join(dirPath, file);
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
    const name = path.basename(file, path.extname(file));

    process.stdout.write(`  ${name} `);
    await convertImage(inputPath, outputPath, spec);
  }
}

async function main() {
  console.log("🖼️  Converting images to WebP format...\n");

  const types = ["characters", "weapons", "vehicles"];
  let totalConverted = 0;

  for (const type of types) {
    const dirPath = path.join(IMAGES_DIR, type);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      const imagesToConvert = files.filter(
        (f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg")
      );
      totalConverted += imagesToConvert.length;
      await convertDirectory(type);
    }
  }

  console.log(`\n✅ Done! Converted ${totalConverted} images to WebP format.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
