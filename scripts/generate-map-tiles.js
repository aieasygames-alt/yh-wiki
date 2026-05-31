#!/usr/bin/env node
/**
 * Generate Leaflet tile pyramid from a map image.
 *
 * Usage:
 *   node scripts/generate-map-tiles.js                    # use default hethereau-full.webp
 *   node scripts/generate-map-tiles.js path/to/map.webp   # custom source
 *
 * Output: public/images/maps/tiles/{z}/{x}/{y}.webp
 *
 * Tile scheme (CRS.Simple, square bounds [[100,0],[0,100]]):
 *   z=1: 2x2   (4 tiles,   512px each → 1024px total)
 *   z=2: 4x4   (16 tiles)
 *   z=3: 8x8   (64 tiles)
 *   z=4: 16x16 (256 tiles)
 *   z=5: 32x32 (1024 tiles)
 *   Total: ~1364 tiles
 *
 * Each tile is 256x256 webp. At z=5, the full 8192px image is used.
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const TILE_SIZE = 256;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

const sourceArg = process.argv[2] || "public/images/maps/hethereau-full.webp";
const sourcePath = path.resolve(sourceArg);
const outputDir = path.resolve("public/images/maps/tiles");

async function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source image not found: ${sourcePath}`);
    process.exit(1);
  }

  const metadata = await sharp(sourcePath).metadata();
  const srcWidth = metadata.width;
  const srcHeight = metadata.height;
  console.log(`Source: ${sourcePath} (${srcWidth}x${srcHeight})`);

  if (srcWidth !== srcHeight) {
    console.warn(`Warning: source is not square (${srcWidth}x${srcHeight}). Tiles may be distorted.`);
  }

  // Create output directories
  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    const zDir = path.join(outputDir, String(z));
    fs.mkdirSync(zDir, { recursive: true });
  }

  let totalTiles = 0;

  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    const gridSize = Math.pow(2, z); // 2^z tiles per side
    const totalPx = gridSize * TILE_SIZE; // total pixels at this zoom level
    const scale = srcWidth / totalPx; // scale factor from source to this zoom

    // Resize source to exact size for this zoom level
    const resized = sharp(sourcePath).resize(totalPx, totalPx, { fit: "fill" });
    const resizedBuffer = await resized.raw().toBuffer({ resolveWithObject: true });
    const { data, info } = resizedBuffer;
    const channels = info.channels;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Extract tile region from resized image
        const tileX = x * TILE_SIZE;
        const tileY = y * TILE_SIZE;
        const tileW = Math.min(TILE_SIZE, totalPx - tileX);
        const tileH = Math.min(TILE_SIZE, totalPx - tileY);

        if (tileW <= 0 || tileH <= 0) continue;

        // Extract raw pixels for this tile
        const tilePixels = Buffer.alloc(tileW * tileH * channels);
        for (let row = 0; row < tileH; row++) {
          const srcOffset = ((tileY + row) * totalPx + tileX) * channels;
          const dstOffset = row * tileW * channels;
          data.copy(tilePixels, dstOffset, srcOffset, srcOffset + tileW * channels);
        }

        // Encode as webp
        const tileBuffer = await sharp(tilePixels, {
          raw: { width: tileW, height: tileH, channels },
        })
          .webp({ quality: 80 })
          .toBuffer();

        const outPath = path.join(outputDir, String(z), String(x), `${y}.webp`);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, tileBuffer);
        totalTiles++;
      }
    }

    console.log(`z=${z}: ${gridSize}x${gridSize} = ${gridSize * gridSize} tiles (${totalPx}px total)`);
  }

  console.log(`\nDone! ${totalTiles} tiles written to ${outputDir}`);

  // Verify: check a sample tile exists
  const sampleZ = MAX_ZOOM;
  const samplePath = path.join(outputDir, String(sampleZ), "0", "0.webp");
  if (fs.existsSync(samplePath)) {
    const sampleMeta = await sharp(samplePath).metadata();
    console.log(`Sample tile z=${sampleZ}/0/0.webp: ${sampleMeta.width}x${sampleMeta.height}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
