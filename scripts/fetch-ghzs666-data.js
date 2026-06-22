#!/usr/bin/env node
/**
 * Fetch ghzs666 NTE map data (markers + areas)
 * Usage: node scripts/fetch-ghzs666-data.js
 * Output: tmp/ghzs666-markers.json, tmp/ghzs666-areas.json
 */

const fs = require("fs");
const path = require("path");

const BASE = "https://api-wiki-game.ghzs.com/v1d0/web/wanmei-yh/map";
const OUT = path.resolve(__dirname, "../tmp");

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  console.log("Fetching markers...");
  const markers = await fetchJSON(BASE);
  const markerSize = JSON.stringify(markers).length;
  fs.writeFileSync(path.join(OUT, "ghzs666-markers.json"), JSON.stringify(markers, null, 2));
  console.log(`  → ${(markerSize / 1024).toFixed(0)} KB saved to tmp/ghzs666-markers.json`);

  // Analyze structure
  if (Array.isArray(markers)) {
    console.log(`  Groups: ${markers.length}`);
    let totalPoints = 0;
    markers.forEach(g => {
      const resources = g.resources || [];
      let pts = 0;
      resources.forEach(r => { pts += (r.points || []).length; });
      totalPoints += pts;
      console.log(`    ${g.group_name || g.group_name_en}: ${resources.length} resources, ${pts} points`);
    });
    console.log(`  Total points: ${totalPoints}`);
  }

  console.log("\nFetching areas...");
  const areas = await fetchJSON(`${BASE}/areas`);
  fs.writeFileSync(path.join(OUT, "ghzs666-areas.json"), JSON.stringify(areas, null, 2));
  console.log(`  → ${(JSON.stringify(areas).length / 1024).toFixed(0)} KB saved to tmp/ghzs666-areas.json`);
  if (Array.isArray(areas)) {
    areas.forEach(a => console.log(`    ${a.name || a.name_en} (${a.area_id || a._id || "?"})`));
  }

  console.log("\nDone!");
}

main().catch(err => { console.error(err); process.exit(1); });
