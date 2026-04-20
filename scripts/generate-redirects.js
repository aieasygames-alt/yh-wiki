#!/usr/bin/env node
/**
 * Generate Cloudflare Pages _redirects file for trailing slash normalization.
 *
 * After `trailingSlash: true` + `next build`, all pages are directories:
 *   out/en/redeem-codes/index.html
 *
 * This script scans out/ and generates redirect rules so that:
 *   /en/redeem-codes  →  /en/redeem-codes/  (301)
 *
 * Preserves existing manual redirect rules from public/_redirects.manual
 * (or falls back to hardcoded defaults).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const PUBLIC_REDIRECTS = path.join(ROOT, "public", "_redirects");

/**
 * Walk out/ and find all routes that have an index.html
 * (these are the trailing-slash URLs Next.js generated).
 */
function collectRoutes(outDir) {
  const routes = [];

  function walk(dir, prefix) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      // Skip _next, static assets, and dot files
      if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
      if (entry.name.endsWith(".xml") || entry.name.endsWith(".txt") || entry.name.endsWith(".json")) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Check if this directory has index.html — it's a route
        const indexPath = path.join(fullPath, "index.html");
        if (fs.existsSync(indexPath)) {
          routes.push(prefix + "/" + entry.name);
        }
        // Recurse into subdirectories
        walk(fullPath, prefix + "/" + entry.name);
      }
    }
  }

  if (fs.existsSync(outDir)) {
    walk(outDir, "");
  }
  return routes;
}

/**
 * Read existing manual redirect rules from public/_redirects.
 * These are preserved and prepended to the generated rules.
 */
function readManualRules() {
  if (fs.existsSync(PUBLIC_REDIRECTS)) {
    return fs.readFileSync(PUBLIC_REDIRECTS, "utf-8").trim();
  }
  // Default manual rules
  return [
    "# Root redirect - permanent",
    "/ /zh/ 301",
    "",
    "# Language roots - ensure trailing slash",
    "/zh /zh/ 301",
    "/en /en/ 301",
  ].join("\n");
}

// --- Main ---

console.log("Generating _redirects for trailing slash normalization...");

const manualRules = readManualRules();
const routes = collectRoutes(OUT);

console.log(`  Found ${routes.length} routes with trailing slash`);

const generatedRules = routes
  .map((route) => `${route} ${route}/ 301`)
  .join("\n");

const output = [
  manualRules,
  "",
  "# Auto-generated trailing slash redirects (do not edit manually)",
  generatedRules,
  "",
].join("\n");

// Write to out/_redirects (build output, not public/)
const outRedirects = path.join(OUT, "_redirects");
fs.writeFileSync(outRedirects, output, "utf-8");
console.log(`  Written ${routes.length} redirect rules to out/_redirects`);

// Also update public/_redirects for consistency (for next build cycle)
fs.writeFileSync(PUBLIC_REDIRECTS, output, "utf-8");
console.log("  Updated public/_redirects");
console.log("Done.");
