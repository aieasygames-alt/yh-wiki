#!/usr/bin/env node
/**
 * Generate Cloudflare Pages _redirects file.
 *
 * Copies manual redirect rules from public/_redirects.manual and adds trailing
 * slash variants only for those manual legacy/consolidation rules.
 *
 * Full-site trailing slash normalization is NOT generated — Cloudflare Pages
 * natively serves both /path and /path/ from /path/index.html, and the HTML
 * <link rel="canonical"> tells Google which version to use.
 *
 * Previously this script generated 9,232 trailing-slash redirect rules,
 * which exceeded Cloudflare's 2,000-rule limit and caused 9,484 pages
 * to be flagged as "Page with redirect" in Google Search Console.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const PUBLIC_REDIRECTS = path.join(ROOT, "public", "_redirects");
const MANUAL_REDIRECTS = path.join(ROOT, "public", "_redirects.manual");

// --- Main ---

console.log("Generating _redirects from manual rules...");

let rules = "";
if (fs.existsSync(MANUAL_REDIRECTS)) {
  rules = fs.readFileSync(MANUAL_REDIRECTS, "utf-8").trim();
} else {
  // Minimal fallback
  rules = ["# Root redirect", "/ /zh/ 301"].join("\n");
}

function shouldAddTrailingSlashVariant(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return false;

  const [source, target, status] = trimmed.split(/\s+/);
  if (!source || !target || !status) return false;
  if (status !== "301") return false;
  if (source === "/" || source.endsWith("/") || source.includes("*")) return false;
  if (!target.endsWith("/")) return false;

  const lastSegment = source.split("/").pop() || "";
  return !/\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);
}

function expandManualRules(input) {
  const outputLines = [];
  const seen = new Set();

  for (const line of input.split("\n")) {
    outputLines.push(line);

    if (!shouldAddTrailingSlashVariant(line)) continue;

    const [source, target, status] = line.trim().split(/\s+/);
    const variant = `${source}/ ${target} ${status}`;
    if (!seen.has(variant) && !input.includes(`\n${variant}`)) {
      outputLines.push(variant);
      seen.add(variant);
    }
  }

  return outputLines.join("\n");
}

const output = expandManualRules(rules) + "\n";

// Write to out/_redirects (build output)
const outRedirects = path.join(OUT, "_redirects");
fs.writeFileSync(outRedirects, output, "utf-8");

const ruleCount = output.split("\n").filter((l) => l.trim() && !l.startsWith("#")).length;
console.log(`  Written ${ruleCount} redirect rules to out/_redirects`);

// Also update public/_redirects for consistency
fs.writeFileSync(PUBLIC_REDIRECTS, output, "utf-8");
console.log("  Updated public/_redirects");
console.log("Done.");
