#!/usr/bin/env node
/**
 * Copy selected images from ../img into public/images/blog/ and update
 * data/blog.json `image` fields. Keeps original format — the site already
 * uses raw <img> tags (no next/image optimization), so jpg/png work fine.
 *
 * Idempotent: re-running only updates images that differ.
 *
 * Run from project root: node scripts/fill-blog-images.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC_DIR = path.resolve(ROOT, "../img");
const DEST_DIR = path.join(ROOT, "public/images/blog");
const BLOG_JSON = path.join(ROOT, "data/blog.json");

if (!fs.existsSync(SRC_DIR)) {
  console.error("Source directory not found:", SRC_DIR);
  console.error("Expected at /Users/robert/Documents/Website/异环/img");
  process.exit(1);
}
fs.mkdirSync(DEST_DIR, { recursive: true });

// blog id → { src, destName }
const MAPPING = [
  { id: "nte-ai-art-controversy-timeline",          src: "9AF6066192338E8F3B4A464569917E5E.png", dest: "nte-ai-controversy.png" },
  { id: "nte-version-1-2-preview-shinku-illica",    src: "43CB20AF91A2689BB94DE64BC85BE59C.png", dest: "nte-1-2-preview.png" },
  { id: "nte-lacrimosa-strength-analysis",          src: "06F0BDF0B78DA9352202ACF9B29CC7EB.jpg", dest: "nte-lacrimosa-analysis.jpg" },
  { id: "nte-gacha-system-analysis",                src: "36360D8A1FB6D56127F43FB4DFB64AEF.jpg", dest: "nte-gacha-analysis.jpg" },
  { id: "nte-zhenhong-build-guide-1-2",             src: "7E540129C2A4D2B6F1E1B6372A7DA1B8.png", dest: "zhenhong-1-2.png" },
  { id: "nte-not-hoyoverse-developer-clarification", src: "{1380E32D-5050-F5B8-0664-582EFA520895}.jpg", dest: "nte-developer.jpg" },
  { id: "is-nte-worth-playing-2026-review",         src: "{B87B7C7E-334C-AEE3-4BBA-86CA3B70D9BF}.jpg", dest: "nte-review-2026.jpg" },
];

function copyOne({ id, src, dest }) {
  const srcPath = path.join(SRC_DIR, src);
  const destPath = path.join(DEST_DIR, dest);
  if (!fs.existsSync(srcPath)) {
    console.warn(`  SKIP ${id}: source missing ${src}`);
    return null;
  }
  fs.copyFileSync(srcPath, destPath);
  const stat = fs.statSync(destPath);
  console.log(`  ✓ ${id.padEnd(45)} → /images/blog/${dest}  (${(stat.size / 1024).toFixed(0)} KB)`);
  return { id, image: `/images/blog/${dest}` };
}

console.log("=== Filling blog images ===");
const results = [];
for (const m of MAPPING) {
  const r = copyOne(m);
  if (r) results.push(r);
}

// Update blog.json
const blogs = JSON.parse(fs.readFileSync(BLOG_JSON, "utf-8"));
let updated = 0;
for (const r of results) {
  const blog = blogs.find((b) => b.id === r.id);
  if (blog) {
    blog.image = r.image;
    updated++;
  }
}
fs.writeFileSync(BLOG_JSON, JSON.stringify(blogs, null, 2) + "\n", "utf-8");
console.log(`\nUpdated ${updated} entries in data/blog.json`);
