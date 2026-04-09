/**
 * Download character portraits from NTE Fandom Wiki CDN.
 * Usage: npx tsx scripts/download-images.ts [--dry-run]
 *
 * Image URLs are sourced from the Fandom MediaWiki API (action=query&prop=pageimages).
 * The CDN serves WebP regardless of the URL extension, so all files are saved as .webp.
 * Source: https://neverness-to-everness.fandom.com (CC-BY-SA)
 */

import * as fs from "fs";
import * as path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "public/images/characters");

// Character ID → full-resolution CDN URL
// Derived from MediaWiki API: action=query&prop=pageimages&pithumbsize=512
// Thumbnail URLs stripped of /scale-to-width-down/XXX for original resolution
const CHARACTER_IMAGES: Record<string, string> = {
  adler:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/3/33/Adler_Card.png/revision/latest?cb=20260309120100",
  alphard:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/6/64/Alphard_CBT.png/revision/latest?cb=20260223170037",
  baicang:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/5/5c/Baicang_Card.png/revision/latest?cb=20260309130211",
  chiz:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/2/21/Chiz_Card.png/revision/latest?cb=20260309140844",
  daffodil:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/a/af/Daffodill_Card.png/revision/latest?cb=20260309135850",
  edgar:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/1/1d/Edgar_Card.png/revision/latest?cb=20260309140118",
  fadia:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/6/68/Fadia_Card.png/revision/latest?cb=20260309130722",
  haniel:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/b/b9/Haniel_Card.png/revision/latest?cb=20260309131027",
  hathor:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/3/30/Hathor_Card.png/revision/latest?cb=20260309131648",
  hotori:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/4/41/Hotori_in_game_Model.png/revision/latest?cb=20260223173459",
  jiuyuan:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/5/57/Jiuyuan_Card.png/revision/latest?cb=20260309140453",
  lacrimosa:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/3/37/Lacrimosa_-_Character_Showcase.jpg/revision/latest?cb=20241229191213",
  mint:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/2/20/Mint_Card.png/revision/latest?cb=20260307142424",
  nanally:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/4/44/Nanally_-_Character_Showcase.jpg/revision/latest?cb=20241229191211",
  sakiri:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/3/32/Sakiri_Card.png/revision/latest?cb=20260309141104",
  skia:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/0/01/Skia_by_nte_1.jpg/revision/latest?cb=20260212004246",
  taygedo:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/3/3f/Taygedo_-_Character_Showcase.jpg/revision/latest?cb=20241229200217",
  zero:
    "https://static.wikia.nocookie.net/neverness-to-everness/images/c/c2/Esper_Zero_Male_Card.png/revision/latest?cb=20260315121329",
};

// Characters without images (no Fandom page or no image on page)
const NO_IMAGE = new Set(["nelly", "merula", "lilina"]);

async function downloadImage(
  url: string,
  filePath: string
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return false;

    const buffer = Buffer.from(await res.arrayBuffer());
    // Skip tiny or broken images (< 1KB)
    if (buffer.length < 1024) return false;

    fs.writeFileSync(filePath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let success = 0;
  let skipped = 0;
  let failed = 0;

  const allIds = [
    ...Object.keys(CHARACTER_IMAGES),
    ...NO_IMAGE,
  ];

  for (const id of allIds) {
    if (NO_IMAGE.has(id)) {
      console.log(`⊘ ${id}: no image available`);
      skipped++;
      continue;
    }

    const url = CHARACTER_IMAGES[id];
    if (!url) {
      console.log(`⊘ ${id}: not configured`);
      skipped++;
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${id}.webp`);

    if (dryRun) {
      console.log(`→ ${id}: ${url.substring(0, 70)}...`);
      success++;
      continue;
    }

    const ok = await downloadImage(url, outputPath);
    if (ok) {
      const size = fs.statSync(outputPath).size;
      console.log(`✓ ${id}.webp (${(size / 1024).toFixed(0)}KB)`);
      success++;
    } else {
      console.log(`✗ ${id}: download failed`);
      failed++;
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(
    `\n=== ${success} downloaded, ${skipped} skipped, ${failed} failed ===`
  );
}

main();
