#!/usr/bin/env node
/**
 * Merge IMapp markers into our map-markers.json
 * Usage: node scripts/merge-competitor-markers.js
 * Output: tmp/merge-report.json + updates data/map-markers.json if --apply flag
 */
const fs = require("fs");
const path = require("path");

const SCALE = 40.96;
// Mapping: IMapp → our coords. Y axis is inverted.
// ourX = 0.024413 * imX + 0.0023
// ourY = -0.024532 * imY + 100.21
const INV_SX = 0.024413;
const INV_OX = 0.0023;
const INV_SY = -0.024532;
const INV_OY = 100.2126;

// IMapp category → our marker type mapping
const CATEGORY_MAP = {
  // Fast Travel group
  "Fast Travel Point": { type: "waypoint", subtype: "fast-travel" },
  "ReroRero Phone Booth": { type: "phone-booth", subtype: "reroRero" },
  "Taxi Stop": { type: "waypoint", subtype: "taxi" },
  "Wertheimer Tower": { type: "tower", subtype: "wertheimer" },
  // Collectibles group
  "Chameleon Package (DT)": { type: "collectible", subtype: "chameleon-dt" },
  "Abandoned Furniture": { type: "collectible", subtype: "furniture" },
  "Kokoro Rider Figurine Box": { type: "collectible", subtype: "figurine" },
  "Oracle Stone": { type: "oracle-stone" },
  "Treasure Box (DT)": { type: "chest", subtype: "treasure-dt" },
  "YaHaHa": { type: "collectible", subtype: "yahaha" },
  // Quests
  "Story": { type: "quest", subtype: "story" },
  "Side": { type: "quest", subtype: "side" },
  "Secret": { type: "quest", subtype: "secret" },
  "Daily": { type: "quest", subtype: "daily" },
  "Guidance": { type: "quest", subtype: "guidance" },
  "Affinity": { type: "quest", subtype: "affinity" },
  "Favorability": { type: "quest", subtype: "favorability" },
  "Side Quest": { type: "quest", subtype: "side-quest" },
  "Trial": { type: "quest", subtype: "trial" },
  "Quest Trigger": { type: "quest", subtype: "trigger" },
  // World Bosses
  "Let's Go See a Movie": { type: "boss", subtype: "world" },
  "Black Tome (Boss)": { type: "boss", subtype: "world" },
  "Headless Rider (Boss)": { type: "boss", subtype: "world" },
  "Rhythm Master": { type: "boss", subtype: "world" },
  "Deep Blue Sorrow": { type: "boss", subtype: "world" },
  "Call of the Lost": { type: "boss", subtype: "world" },
  // Currencies & Loot
  "Gift from \"21\"": { type: "gift-21" },
  "Hunter Guide": { type: "currency", subtype: "hunter-guide" },
  "Magician's Gift": { type: "currency", subtype: "magician-gift" },
  "Mystery Box - Tier A": { type: "mystery-box", subtype: "A" },
  "Mystery Box - Tier B": { type: "mystery-box", subtype: "B" },
  "Mystery Box - Tier C": { type: "mystery-box", subtype: "C" },
  "Mystery Box - Tier D": { type: "mystery-box", subtype: "D" },
  "Stealable Goods": { type: "currency", subtype: "stealable" },
  "Prison Daily Pick": { type: "currency", subtype: "prison-daily" },
  "Lost Wallet - Tier A": { type: "currency", subtype: "wallet-A" },
  "Lost Wallet - Tier B": { type: "currency", subtype: "wallet-B" },
  "Lost Wallet - Tier C": { type: "currency", subtype: "wallet-C" },
  "Lost Wallet - Tier D": { type: "currency", subtype: "wallet-D" },
  // Activities
  "Illegal Activity": { type: "activity", subtype: "illegal" },
  "Racing Fleet": { type: "activity", subtype: "racing" },
  // Fishing
  "Raindrop Court Fishing Spot": { type: "viewpoint", subtype: "poi" },
  "Nautili Tunnel West Fishing Spot": { type: "viewpoint", subtype: "poi" },
  "Azure Vista Fishing Spot": { type: "viewpoint", subtype: "poi" },
  "Imaginist Fishing Spot": { type: "viewpoint", subtype: "poi" },
  "Stellar Marina Fishing Spot": { type: "viewpoint", subtype: "poi" },
  "Nautili Tunnel East Fishing Spot": { type: "viewpoint", subtype: "poi" },
  // Other Locations
  "Sightseeing Spot": { type: "viewpoint", subtype: "sightseeing" },
  "POI (DT)": { type: "viewpoint", subtype: "poi" },
  "Region": { type: "region" },
};

function imappToOurs(imX, imY) {
  return {
    x: Math.round(INV_SCALE * imX + OUR_OFFSET_X * 100) / 100,
    y: Math.round(INV_SCALE * imY + OUR_OFFSET_Y * 100) / 100,
  };
}

function main() {
  const base = path.resolve(__dirname, "..");
  const ours = JSON.parse(fs.readFileSync(path.join(base, "data/map-markers.json"), "utf8"));
  const imapp = JSON.parse(fs.readFileSync(path.join(base, "tmp/imapp-markers.json"), "utf8"));
  const mapping = JSON.parse(fs.readFileSync(path.join(base, "tmp/imapp-coordinate-mapping.json"), "utf8"));

  const ourMarkers = ours.maps[0].markers;
  const ourTypes = Object.keys(ours.markerTypes);

  // Build spatial index for proximity-based dedup
  // Grid cell size ~1 unit (1% of map)
  const ourGrid = new Map();
  ourMarkers.forEach(m => {
    const gx = Math.floor(m.x);
    const gy = Math.floor(m.y);
    const key = `${m.type}:${gx}:${gy}`;
    if (!ourGrid.has(key)) ourGrid.set(key, []);
    ourGrid.get(key).push(m);
  });

  const DEDUP_RADIUS = 1.5; // ~1.5% of map = same marker

  // Convert IMapp markers to our format
  const converted = [];
  const skipped = [];
  let unmatchedCat = new Set();

  imapp.groups.forEach(g => (g.categories || []).forEach(c => {
    const catMapping = CATEGORY_MAP[c.name];
    if (!catMapping) {
      unmatchedCat.add(c.name);
      return;
    }

    (c.data || []).forEach(m => {
      const imX = m.coordinates?.[0];
      const imY = m.coordinates?.[1];
      if (imX == null || imY == null) return;

      const { x, y } = imappToOurs(imX, imY);

      // Skip if out of our bounds
      if (x < 0 || x > 100 || y < 0 || y > 100) {
        skipped.push({ reason: "out_of_bounds", cat: c.name, imX: imX.toFixed(1), imY: imY.toFixed(1) });
        return;
      }

      // Check if we already have a marker of same type within radius
      const gx = Math.floor(x);
      const gy = Math.floor(y);
      let isDuplicate = false;
      for (let dx = -1; dx <= 1 && !isDuplicate; dx++) {
        for (let dy = -1; dy <= 1 && !isDuplicate; dy++) {
          const nearby = ourGrid.get(`${catMapping.type}:${gx + dx}:${gy + dy}`);
          if (!nearby) continue;
          for (const existing of nearby) {
            const dist = Math.sqrt((existing.x - x) ** 2 + (existing.y - y) ** 2);
            if (dist < DEDUP_RADIUS) {
              isDuplicate = true;
              break;
            }
          }
        }
      }
      if (isDuplicate) {
        skipped.push({ reason: "duplicate", cat: c.name, x, y });
        return;
      }

      const title = (m.properties?.note_title || "").replace(/<[^>]+>/g, "").trim();
      const id = `imapp-${catMapping.type}-${m.properties?.id || converted.length}`;

      converted.push({
        id,
        name: c.name,
        nameEn: c.name,
        type: catMapping.type,
        subtype: catMapping.subtype,
        x,
        y,
        description: title,
        descriptionEn: title,
        verified: false,
      });
    });
  }));

  // Report
  console.log("=== Merge Report ===");
  console.log(`Our markers: ${ourMarkers.length}`);
  console.log(`IMapp markers processed: ${imapp.groups.reduce((s,g) => s + (g.categories||[]).reduce((s2,c) => s2 + (c.data||[]).length, 0), 0)}`);
  console.log(`New markers to add: ${converted.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log(`  Duplicates: ${skipped.filter(s => s.reason === "duplicate").length}`);
  console.log(`  Out of bounds: ${skipped.filter(s => s.reason === "out_of_bounds").length}`);
  console.log(`  Unmapped categories: ${unmatchedCat.size}`);
  if (unmatchedCat.size) console.log(`  → ${[...unmatchedCat].join(", ")}`);

  // By type breakdown
  const byType = {};
  converted.forEach(m => { byType[m.type] = (byType[m.type] || 0) + 1; });
  console.log("\nNew markers by type:");
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`  ${t}: ${n}`));

  // Save report
  const report = { converted, skipped, unmatchedCategories: [...unmatchedCat], byType };
  fs.writeFileSync(path.join(base, "tmp/merge-report.json"), JSON.stringify(report, null, 2));
  console.log("\nReport saved to tmp/merge-report.json");

  // Apply if --apply flag
  if (process.argv.includes("--apply")) {
    ours.maps[0].markers = [...ourMarkers, ...converted];
    fs.writeFileSync(path.join(base, "data/map-markers.json"), JSON.stringify(ours, null, 2));
    console.log(`\nApplied! Total markers: ${ours.maps[0].markers.length}`);
  } else {
    console.log("\nRun with --apply to update data/map-markers.json");
  }
}

main();
