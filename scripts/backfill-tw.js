#!/usr/bin/env node
/**
 * Backfill missing Traditional Chinese (tw) fields in data/*.json
 * by converting from the Simplified Chinese (zh) counterpart using OpenCC (s2twp).
 *
 * Strategy: existing manual tw values are preserved (manual > auto).
 * Only EMPTY/MISSING tw fields are auto-filled.
 *
 * Run: node scripts/backfill-tw.js [--dry-run]
 */
const fs = require("fs");
const path = require("path");
const OpenCC = require("opencc-js");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");
const DRY_RUN = process.argv.includes("--dry-run");

// s2twp: Simplified → Traditional Taiwanese (with phrase replacement for IT vocabulary)
const converter = OpenCC.Converter({ from: "cn", to: "twp" });

function convert(text) {
  if (typeof text !== "string" || !text) return text;
  return converter(text);
}

/**
 * Field mapping: for each data file, map { twField: sourceZhField }
 * Only these field pairs are processed. Existing tw values are kept.
 */
const FIELD_MAPS = {
  "faqs.json": {
    // faqs.json has no tw fields at all — add them
    questionTw: "question",
    answerTw: "answer",
    categoryTw: "categoryZh",
    seoTitleTw: "seoTitleZh",
  },
  "guides.json": {
    titleTw: "title",
    summaryTw: "summary",
    contentTw: "content",
  },
  // blog.json already 99/99 — skip
  // characters.json nameTw 44/44 — skip
  // disk-sets.json nameTw 12/12 — skip
  // weapons.json nameTw/effectTw 42/42 — skip
};

function backfillFile(filename, fieldMap) {
  const filepath = path.join(DATA, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`  SKIP ${filename}: not found`);
    return 0;
  }
  const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));
  if (!Array.isArray(data)) {
    console.log(`  SKIP ${filename}: not an array`);
    return 0;
  }

  let filled = 0;
  let skipped = 0;
  for (const item of data) {
    if (typeof item !== "object" || item === null) continue;
    for (const [twField, zhField] of Object.entries(fieldMap)) {
      const sourceValue = item[zhField];
      const existingTw = item[twField];
      // Only fill if source exists and tw is missing/empty
      if (typeof sourceValue === "string" && sourceValue.trim() && !existingTw) {
        item[twField] = convert(sourceValue);
        filled++;
      } else if (existingTw) {
        skipped++;
      }
    }
  }

  if (!DRY_RUN) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  }
  console.log(`  ${filename}: filled ${filled} fields, kept ${skipped} existing tw values`);
  return filled;
}

console.log(DRY_RUN ? "=== DRY RUN ===" : "=== BACKFILL tw FIELDS ===\n");
let total = 0;
for (const [filename, fieldMap] of Object.entries(FIELD_MAPS)) {
  total += backfillFile(filename, fieldMap);
}
console.log(`\nTotal fields ${DRY_RUN ? "to fill" : "filled"}: ${total}`);
