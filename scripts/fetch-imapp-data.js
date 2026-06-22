#!/usr/bin/env node
/**
 * Fetch InteractiveMap.app NTE map data (complete markers)
 * Usage: node scripts/fetch-imapp-data.js
 * Output: tmp/imapp-maps.json, tmp/imapp-markers.json
 */

const fs = require("fs");
const path = require("path");

const BASE = "https://interactivemap.app/neverness-to-everness/maps/imapp";
const OUT = path.resolve(__dirname, "../tmp");

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  console.log("Fetching map config...");
  const maps = await fetchJSON(`${BASE}/api/getmaps`);
  fs.writeFileSync(path.join(OUT, "imapp-maps.json"), JSON.stringify(maps, null, 2));
  console.log(`  → saved to tmp/imapp-maps.json`);
  if (Array.isArray(maps)) {
    maps.forEach(m => {
      console.log(`    Map ${m.id}: ${m.name}, tiles: ${m.tiles_url}, zoom: ${m.min_tiles_zoom}-${m.max_tiles_zoom}`);
    });
  }

  console.log("\nFetching complete markers...");
  const markers = await fetchJSON(`${BASE}/api/1/options.json`);
  const markerSize = JSON.stringify(markers).length;
  fs.writeFileSync(path.join(OUT, "imapp-markers.json"), JSON.stringify(markers, null, 2));
  console.log(`  → ${(markerSize / 1024).toFixed(0)} KB saved to tmp/imapp-markers.json`);

  // Analyze structure
  if (markers.groups) {
    console.log(`  Groups: ${markers.groups.length}`);
    let totalMarkers = 0;
    markers.groups.forEach(g => {
      const cats = g.categories || [];
      let pts = 0;
      cats.forEach(c => { pts += (c.data || []).length; });
      totalMarkers += pts;
      console.log(`    ${g.name || g.title}: ${cats.length} categories, ${pts} markers`);
    });
    console.log(`  Total markers: ${totalMarkers}`);
  }

  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
