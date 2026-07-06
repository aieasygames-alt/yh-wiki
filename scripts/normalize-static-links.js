#!/usr/bin/env node
/**
 * Normalize internal links in exported HTML to the canonical trailing-slash URL.
 *
 * Next's static export can render <Link href="/en/foo"> as /en/foo even when
 * trailingSlash is enabled. Cloudflare then redirects those URLs to /en/foo/,
 * which creates avoidable "Page with redirect" discoveries in GSC.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");

function isFileLike(pathname) {
  const last = pathname.split("/").pop() || "";
  return /\.[a-zA-Z0-9]{2,8}$/.test(last);
}

function shouldNormalize(href) {
  if (!href.startsWith("/")) return false;
  if (href.startsWith("//")) return false;
  if (href.startsWith("/_next/")) return false;
  if (href.startsWith("/api/")) return false;
  if (href === "/") return false;

  const match = href.match(/^([^?#]*)([?#].*)?$/);
  if (!match) return false;

  const pathname = match[1];
  if (!pathname || pathname === "/" || pathname.endsWith("/")) return false;
  if (isFileLike(pathname)) return false;

  return true;
}

function normalizeHref(href) {
  if (!shouldNormalize(href)) return href;
  const [, pathname, suffix = ""] = href.match(/^([^?#]*)([?#].*)?$/);
  return `${pathname}/${suffix}`;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function normalizeFile(file) {
  const before = fs.readFileSync(file, "utf-8");
  let changed = 0;
  const after = before.replace(/\bhref=(["'])(\/[^"']*)\1/g, (full, quote, href) => {
    const normalized = normalizeHref(href);
    if (normalized !== href) changed += 1;
    return `href=${quote}${normalized}${quote}`;
  });

  if (after !== before) {
    fs.writeFileSync(file, after, "utf-8");
  }

  return changed;
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error("out/ directory not found. Run the build first.");
    process.exit(1);
  }

  let filesChanged = 0;
  let linksChanged = 0;

  for (const file of walk(OUT)) {
    const changed = normalizeFile(file);
    if (changed > 0) {
      filesChanged += 1;
      linksChanged += changed;
    }
  }

  console.log(`Normalized ${linksChanged} internal href(s) in ${filesChanged} HTML file(s).`);
}

if (require.main === module) {
  main();
}

module.exports = { normalizeHref, shouldNormalize };
