#!/usr/bin/env node
/**
 * Compress blog cover images to webp at 1920x1080 cover, quality 82.
 * Run on macOS / any env where sharp's native binary works.
 *
 *   node scripts/compress-blog-images.mjs
 *
 * After running, the script updates data/blog.json to reference the new
 * .webp paths and deletes the oversized source files.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "public/images/blog");
const BLOG_JSON = path.join(ROOT, "data/blog.json");

const TARGETS = [
  "nte-ai-controversy.png",
  "nte-1-2-preview.png",
  "nte-lacrimosa-analysis.jpg",
  "nte-gacha-analysis.jpg",
  "zhenhong-1-2.png",
  "nte-developer.jpg",
  "nte-review-2026.jpg",
];

const blogs = JSON.parse(fs.readFileSync(BLOG_JSON, "utf-8"));

async function compressOne(filename) {
  const srcPath = path.join(BLOG_DIR, filename);
  const destName = filename.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  const destPath = path.join(BLOG_DIR, destName);
  if (!fs.existsSync(srcPath)) {
    console.warn(`  SKIP ${filename}: source missing`);
    return null;
  }
  const before = fs.statSync(srcPath).size;
  await sharp(srcPath)
    .resize(1920, 1080, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toFile(destPath);
  const after = fs.statSync(destPath).size;
  const pct = ((1 - after / before) * 100).toFixed(0);
  console.log(`  ✓ ${filename} → ${destName}  ${(before / 1024).toFixed(0)} → ${(after / 1024).toFixed(0)} KB  (-${pct}%)`);

  // Update blog.json
  const oldPath = `/images/blog/${filename}`;
  const newPath = `/images/blog/${destName}`;
  let touched = 0;
  for (const b of blogs) {
    if (b.image === oldPath) {
      b.image = newPath;
      touched++;
    }
  }
  if (touched === 0) console.warn(`    warning: no blog entry referenced ${oldPath}`);

  // Remove the original
  fs.unlinkSync(srcPath);
  return { filename, destName, touched };
}

console.log("=== Compressing blog images to webp 1920x1080 q82 ===");
let totalSaved = 0;
for (const f of TARGETS) {
  const srcPath = path.join(BLOG_DIR, f);
  if (fs.existsSync(srcPath)) totalSaved += fs.statSync(srcPath).size;
}

const results = [];
for (const f of TARGETS) {
  const r = await compressOne(f);
  if (r) results.push(r);
}

fs.writeFileSync(BLOG_JSON, JSON.stringify(blogs, null, 2) + "\n", "utf-8");
console.log(`\nUpdated data/blog.json (${results.reduce((s, r) => s + r.touched, 0)} entries)`);
console.log(`Removed ${results.length} source files`);
