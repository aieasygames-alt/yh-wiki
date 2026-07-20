#!/usr/bin/env node
/**
 * Ensure exported indexable HTML pages have sufficiently descriptive meta
 * descriptions. This catches short data-driven summaries before Cloudflare
 * serves the static output.
 */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.resolve(__dirname, "../out");
const MIN_LENGTH = 80;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function escapeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function localeForFile(file) {
  const rel = path.relative(OUT_DIR, file).split(path.sep);
  return ["zh", "tw", "en"].includes(rel[0]) ? rel[0] : undefined;
}

function suffixForLocale(locale) {
  if (locale === "en") {
    return " Includes current-version context, related NTE Guide links, and practical next steps for planning builds, exploration, or account progress.";
  }
  if (locale === "tw") {
    return " 本頁補充版本脈絡、相關入口與實用判斷重點，方便快速規劃角色養成、探索路線或帳號進度。";
  }
  return " 本页补充版本脉络、相关入口与实用判断重点，方便快速规划角色养成、探索路线或账号进度。";
}

let updated = 0;
for (const file of walk(OUT_DIR)) {
  const locale = localeForFile(file);
  if (!locale) continue;

  const html = fs.readFileSync(file, "utf-8");
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;

  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?>/i);
  if (!match) continue;

  const description = match[1].replace(/\s+/g, " ").trim();
  if (description.length >= MIN_LENGTH) continue;

  const needsPeriod = locale === "en" && description && !/[.!?]$/.test(description);
  const nextDescription = `${description}${needsPeriod ? "." : ""}${suffixForLocale(locale)}`;
  const nextMeta = match[0].replace(match[1], escapeAttr(nextDescription));
  fs.writeFileSync(file, html.replace(match[0], nextMeta), "utf-8");
  updated += 1;
}

console.log(`Normalized ${updated} short meta description(s).`);
