#!/usr/bin/env node
/**
 * Normalize FAQ `category` field to English slug keys.
 * One-off migration — safe to re-run (idempotent).
 *
 * Run: node scripts/normalize-faq-categories.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "data", "faqs.json");

// Map any non-canonical category value to a canonical slug.
// Keys are matched against the raw `category` string in the data file.
const CATEGORY_MAP = {
  // Chinese keys → English slugs
  "充值与账号": "account",
  "技术支持": "troubleshooting",
  "抽卡系统": "gacha",
  "新手指南": "beginner",
  "日常玩法": "gameplay",
  "游戏Bug": "troubleshooting",
  "角色培养": "leveling",
  // Near-duplicates in English
  "event": "events",
  "team": "team-building",
};

const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

let changed = 0;
for (const faq of data) {
  const remap = CATEGORY_MAP[faq.category];
  if (remap && faq.category !== remap) {
    faq.category = remap;
    changed++;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`[normalize-faq-categories] updated ${changed} of ${data.length} entries`);

// Verify
const cats = new Set();
for (const f of JSON.parse(fs.readFileSync(FILE, "utf-8"))) cats.add(f.category);
console.log(`[normalize-faq-categories] ${cats.size} distinct categories:`);
console.log("  " + [...cats].sort().join(", "));
