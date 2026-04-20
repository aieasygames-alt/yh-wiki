#!/usr/bin/env node
/**
 * Generate split sitemaps for nteguide.com
 * Outputs to public/ directory so build-static.sh copies them to out/
 *
 * Produces:
 *   public/sitemap.xml          — sitemap index
 *   public/sitemap-pages.xml    — homepage, category list pages, tool pages
 *   public/sitemap-characters.xml — character detail pages
 *   public/sitemap-weapons.xml  — weapon detail pages
 *   public/sitemap-vehicles.xml — vehicle detail pages
 *   public/sitemap-guides.xml   — guide detail pages
 *   public/sitemap-other.xml    — materials, faq, lore, locations, blog, compares, tags
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, "data");
const BASE_URL = "https://nteguide.com";
const langs = ["zh", "en"];

// Load data (safe-load: returns [] if file missing)
function loadJson(name) {
  const p = path.join(DATA, name);
  if (!fs.existsSync(p)) {
    console.warn(`  Warning: ${name} not found, skipping`);
    return [];
  }
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const characters = loadJson("characters.json");
const materials = loadJson("materials.json");
const weapons = loadJson("weapons.json");
const vehicles = loadJson("vehicles.json");
const faqs = loadJson("faqs.json");
const guides = loadJson("guides.json");
const loreItems = loadJson("lore.json");
const locations = loadJson("locations.json");
const blogPosts = loadJson("blog.json");
const compares = loadJson("compares.json");
const changelogs = loadJson("changelog.json");

const commonTags = [
  "s-class", "a-class", "cosmos", "anima", "incantation", "chaos", "psyche", "lakshana",
  "dps", "support", "beginner", "combat", "exploration", "advanced",
];

const toolPages = ["calculator/leveling", "calculator/build", "gacha", "redeem-codes", "map", "system-requirements"];
const categoryPages = ["characters", "weapons", "vehicles", "materials", "guides", "faq", "lore", "locations", "blog", "changelog"];

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildUrlEntries(urls) {
  return urls.map(({ url, priority, changeFreq }) => {
    const now = new Date().toISOString();
    return [
      "  <url>",
      `    <loc>${escapeXml(url)}</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `    <changefreq>${changeFreq || "weekly"}</changefreq>`,
      `    <priority>${priority || 0.5}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");
}

function writeSitemap(filename, urls) {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    buildUrlEntries(urls),
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(PUBLIC, filename), xml, "utf-8");
  console.log(`  ${filename}: ${urls.length} URLs`);
}

// --- Build URL collections ---

// 1. Pages: homepage, category list pages, tool pages
const pageUrls = [];
langs.forEach((lang) => {
  pageUrls.push({ url: `${BASE_URL}/${lang}/`, priority: 1, changeFreq: "daily" });
});
categoryPages.forEach((p) => {
  langs.forEach((lang) => {
    pageUrls.push({ url: `${BASE_URL}/${lang}/${p}/`, priority: 0.8, changeFreq: "weekly" });
  });
});
toolPages.forEach((p) => {
  langs.forEach((lang) => {
    pageUrls.push({ url: `${BASE_URL}/${lang}/${p}/`, priority: 0.9, changeFreq: "weekly" });
  });
});

// 2. Characters
const characterUrls = [];
characters.forEach((c) => {
  langs.forEach((lang) => {
    characterUrls.push({ url: `${BASE_URL}/${lang}/characters/${c.id}/`, priority: 0.8, changeFreq: "weekly" });
  });
});

// 3. Weapons
const weaponUrls = [];
weapons.forEach((w) => {
  langs.forEach((lang) => {
    weaponUrls.push({ url: `${BASE_URL}/${lang}/weapons/${w.id}/`, priority: 0.7, changeFreq: "weekly" });
  });
});

// 4. Vehicles
const vehicleUrls = [];
vehicles.forEach((v) => {
  langs.forEach((lang) => {
    vehicleUrls.push({ url: `${BASE_URL}/${lang}/vehicles/${v.id}/`, priority: 0.7, changeFreq: "weekly" });
  });
});

// 5. Guides
const guideUrls = [];
guides.forEach((g) => {
  langs.forEach((lang) => {
    guideUrls.push({ url: `${BASE_URL}/${lang}/guides/${g.id}/`, priority: 0.8, changeFreq: "weekly" });
  });
});

// 6. Other: materials, faq, lore, locations, blog, compares, tags
const otherUrls = [];
materials.forEach((m) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/materials/${m.id}/`, priority: 0.6, changeFreq: "monthly" });
  });
});
faqs.forEach((f) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/faq/${f.id}/`, priority: 0.6, changeFreq: "monthly" });
  });
});
loreItems.forEach((l) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/lore/${l.id}/`, priority: 0.7, changeFreq: "monthly" });
  });
});
locations.forEach((l) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/locations/${l.id}/`, priority: 0.7, changeFreq: "monthly" });
  });
});
blogPosts.forEach((p) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/blog/${p.id}/`, priority: 0.8, changeFreq: "weekly" });
  });
});
compares.forEach((c) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/compare/${c.id}/`, priority: 0.8, changeFreq: "monthly" });
  });
});
commonTags.forEach((tag) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/tags/${tag}/`, priority: 0.5, changeFreq: "weekly" });
  });
});
// Changelog list + detail pages
langs.forEach((lang) => {
  otherUrls.push({ url: `${BASE_URL}/${lang}/changelog/`, priority: 0.7, changeFreq: "weekly" });
});
changelogs.forEach((cl) => {
  langs.forEach((lang) => {
    otherUrls.push({ url: `${BASE_URL}/${lang}/changelog/${cl.version}/`, priority: 0.7, changeFreq: "monthly" });
  });
});

// --- Write sitemaps ---
console.log("Generating split sitemaps...");

writeSitemap("sitemap-pages.xml", pageUrls);
writeSitemap("sitemap-characters.xml", characterUrls);
writeSitemap("sitemap-weapons.xml", weaponUrls);
writeSitemap("sitemap-vehicles.xml", vehicleUrls);
writeSitemap("sitemap-guides.xml", guideUrls);
writeSitemap("sitemap-other.xml", otherUrls);

// --- Write sitemap index ---
const subSitemaps = [
  "sitemap-pages.xml",
  "sitemap-characters.xml",
  "sitemap-weapons.xml",
  "sitemap-vehicles.xml",
  "sitemap-guides.xml",
  "sitemap-other.xml",
];

const now = new Date().toISOString();
const indexEntries = subSitemaps.map((s) => [
  "  <sitemap>",
  `    <loc>${BASE_URL}/${s}</loc>`,
  `    <lastmod>${now}</lastmod>`,
  "  </sitemap>",
].join("\n")).join("\n");

const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  indexEntries,
  "</sitemapindex>",
  "",
].join("\n");

fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), sitemapIndex, "utf-8");
console.log(`  sitemap.xml: sitemap index (${subSitemaps.length} sub-sitemaps)`);
console.log(`  Total URLs: ${pageUrls.length + characterUrls.length + weaponUrls.length + vehicleUrls.length + guideUrls.length + otherUrls.length}`);
console.log("Done.");
