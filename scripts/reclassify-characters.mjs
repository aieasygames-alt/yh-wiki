#!/usr/bin/env node
/**
 * Reclassify character status based on actual game release state as of 2026-06-23.
 *
 * Categories:
 * - A: 1.0 launch characters wrongly marked upcoming → available + availableAtLaunch:true
 * - B: 1.2 phase 2 limited (Zhenhong, banner starts 2026-06-24/25) → available + availableAtLaunch:false
 * - C: 1.3 not yet launched (Canhong) → keep upcoming
 * - D: Not in any changelog/blog/official source → rumored (data-mining disclaimer)
 *
 * Idempotent — safe to re-run.
 *
 * Run: node scripts/reclassify-characters.mjs
 */
import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "data/characters.json");

const RECLASSIFY = {
  // Category A — 1.0 launch, were always available
  nelly:      { status: "available", availableAtLaunch: true },
  merula:     { status: "available", availableAtLaunch: true },
  alphard:    { status: "available", availableAtLaunch: true },
  taygedo:    { status: "available", availableAtLaunch: true },
  lilina:     { status: "available", availableAtLaunch: true },
  xiaozhen:   { status: "available", availableAtLaunch: true },
  xiaozhi:    { status: "available", availableAtLaunch: true },

  // Category B — 1.2 phase 2 limited, launching 2026-06-24
  zhenhong:   { status: "available", availableAtLaunch: false },

  // Category D — not in any official changelog/blog, treat as data-mining
  shinku:     { status: "rumored", availableAtLaunch: false },
  mismo:      { status: "rumored", availableAtLaunch: false },
  lingko:     { status: "rumored", availableAtLaunch: false },
  nitsa:      { status: "rumored", availableAtLaunch: false },
  jenson:     { status: "rumored", availableAtLaunch: false },
  fuuka:      { status: "rumored", availableAtLaunch: false },
  crow:       { status: "rumored", availableAtLaunch: false },
  renee:      { status: "rumored", availableAtLaunch: false },
  goro:       { status: "rumored", availableAtLaunch: false },
  marina:     { status: "rumored", availableAtLaunch: false },
  kaito:      { status: "rumored", availableAtLaunch: false },
  sylphy:     { status: "rumored", availableAtLaunch: false },
  akane:      { status: "rumored", availableAtLaunch: false },
  "black-bird": { status: "rumored", availableAtLaunch: false },

  // Category C — canhong stays upcoming (1.3 phase 1, not yet launched)
  // No change needed; left here for documentation.
  // canhong: { status: "upcoming", availableAtLaunch: false },
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

let changed = 0;
const summary = { available: 0, upcoming: 0, rumored: 0, other: 0 };

for (const char of data) {
  const patch = RECLASSIFY[char.id];
  if (!patch) {
    summary[char.status === "available" ? "available" : char.status === "upcoming" ? "upcoming" : char.status === "rumored" ? "rumored" : "other"]++;
    continue;
  }
  let touched = false;
  if (char.status !== patch.status) { char.status = patch.status; touched = true; }
  if (char.availableAtLaunch !== patch.availableAtLaunch) { char.availableAtLaunch = patch.availableAtLaunch; touched = true; }
  if (touched) {
    changed++;
    summary[char.status === "available" ? "available" : char.status === "upcoming" ? "upcoming" : char.status === "rumored" ? "rumored" : "other"]++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");

console.log(`Updated ${changed} of ${data.length} characters`);
console.log("Final status distribution:");
console.log(`  available: ${summary.available}`);
console.log(`  upcoming:  ${summary.upcoming}`);
console.log(`  rumored:   ${summary.rumored}`);
if (summary.other) console.log(`  other:     ${summary.other}`);
