#!/usr/bin/env node
/**
 * Single pre-build script: merges search-index, sitemaps, and api-json generation.
 * Replaces running 3 separate Node processes to eliminate cold-start overhead.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");
const AD_DATA = path.join(DATA, "anime-destiny");
const PUBLIC = path.join(ROOT, "public");
const BASE_URL = "https://nteguide.com";

// ── Config ──────────────────────────────────────────────
// All locales the app supports via generateStaticParams (see lib/i18n.ts LOCALES)
const LOCALES = ["zh", "tw", "en"];

// ── Shared data loader (reads each JSON file once) ─────
const cache = {};
function load(name) {
  if (!cache[name]) {
    const p = path.join(DATA, name);
    cache[name] = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [];
  }
  return cache[name];
}
function loadAD(name) {
  if (!cache["ad:" + name]) {
    const p = path.join(AD_DATA, name);
    cache["ad:" + name] = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [];
  }
  return cache["ad:" + name];
}

// ── 1. Search Index ────────────────────────────────────
function generateSearchIndex() {
  const outFile = path.join(PUBLIC, "search-index.json");
  const index = [];

  function addEntry(id, nameZh, nameEn, type, urlPath, tags) {
    index.push({ id, name: nameZh, nameEn, type, url: `/zh${urlPath}`, tags });
    index.push({ id, name: nameEn, nameEn, type, url: `/en${urlPath}`, tags });
  }

  for (const c of load("characters.json")) {
    addEntry(c.id, c.name, c.nameEn, "character", `/characters/${c.id}`, [c.attribute, c.rank?.toLowerCase(), c.roleEn?.toLowerCase()]);
  }
  for (const w of load("weapons.json")) {
    addEntry(w.id, w.name, w.nameEn, "weapon", `/weapons/${w.id}`, [w.type?.toLowerCase()]);
  }
  for (const m of load("materials.json")) {
    addEntry(m.id, m.name, m.nameEn, "material", `/materials/${m.id}`, [m.type?.toLowerCase()]);
  }
  for (const f of load("faqs.json")) {
    addEntry(f.id, f.question, f.questionEn, "faq", `/faq/${f.id}`, f.tags || []);
  }
  for (const g of load("guides.json")) {
    addEntry(g.id, g.title, g.titleEn, "guide", `/guides/${g.id}`, g.tags || []);
  }
  for (const l of load("lore.json")) {
    addEntry(l.id, l.name, l.nameEn, "lore", `/lore/${l.id}`, [l.category?.toLowerCase()]);
  }
  for (const loc of load("locations.json")) {
    addEntry(loc.id, loc.name, loc.nameEn, "location", `/locations/${loc.id}`, [loc.category?.toLowerCase()]);
  }

  // Static standalone pages
  index.push({ id: "voice-actors", name: "声优一览", nameEn: "Voice Actors", type: "page", url: "/zh/voice-actors", tags: ["characters", "voice"] });
  index.push({ id: "voice-actors", name: "Voice Actors", nameEn: "Voice Actors", type: "page", url: "/en/voice-actors", tags: ["characters", "voice"] });
  index.push({ id: "multiplayer", name: "多人联机", nameEn: "Multiplayer & Co-op", type: "page", url: "/zh/multiplayer", tags: ["multiplayer", "co-op", "crossplay"] });
  index.push({ id: "multiplayer", name: "Multiplayer & Co-op", nameEn: "Multiplayer & Co-op", type: "page", url: "/en/multiplayer", tags: ["multiplayer", "co-op", "crossplay"] });
  index.push({ id: "gameplay", name: "游戏概览", nameEn: "Gameplay Overview", type: "page", url: "/zh/gameplay", tags: ["gameplay", "review", "overview"] });
  index.push({ id: "gameplay", name: "Gameplay Overview", nameEn: "Gameplay Overview", type: "page", url: "/en/gameplay", tags: ["gameplay", "review", "overview"] });
  index.push({ id: "porsche-collab", name: "保时捷联动", nameEn: "Porsche Collab", type: "page", url: "/zh/porsche-collab", tags: ["porsche", "collab", "vehicle", "918"] });
  index.push({ id: "porsche-collab", name: "Porsche Collab", nameEn: "Porsche Collab", type: "page", url: "/en/porsche-collab", tags: ["porsche", "collab", "vehicle", "918"] });

  fs.writeFileSync(outFile, JSON.stringify(index), "utf-8");
  console.log(`[search-index] ${index.length} entries`);
}

// ── 2. Sitemaps ────────────────────────────────────────
function generateSitemaps() {
  function escapeXml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Safely convert a date string/field to ISO format; returns undefined if invalid.
  // Used for per-URL sitemap lastmod so timestamps reflect real content changes.
  function safeDate(value) {
    if (!value) return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  }

  function existingLastmods(filename) {
    const file = path.join(PUBLIC, filename);
    if (!fs.existsSync(file)) return new Map();

    const xml = fs.readFileSync(file, "utf-8");
    const lastmods = new Map();
    const entryRe = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
    let match;
    while ((match = entryRe.exec(xml))) {
      lastmods.set(match[1], match[2]);
    }
    return lastmods;
  }

  function buildUrlEntries(urls, previousLastmods) {
    const now = new Date().toISOString();
    return urls.map(({ url, priority, changeFreq, lastmod }) => {
      // Priority: explicit per-URL lastmod (from data item's date field)
      //           > previous build's lastmod (preserve across builds)
      //           > now (new URL, no other signal available)
      const lm = lastmod || previousLastmods.get(url) || now;
      return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lm}</lastmod>\n    <changefreq>${changeFreq || "weekly"}</changefreq>\n    <priority>${priority || 0.5}</priority>\n  </url>`;
    }).join("\n");
  }

  function writeSitemap(filename, urls) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${buildUrlEntries(urls, existingLastmods(filename))}\n</urlset>\n`;
    fs.writeFileSync(path.join(PUBLIC, filename), xml, "utf-8");
    console.log(`[sitemap] ${filename}: ${urls.length} URLs`);
  }

  const categoryPages = ["characters", "weapons", "vehicles", "materials", "guides", "faq", "lore", "locations", "blog", "changelog", "tier-list", "bosses", "teams", "anomalies", "disk-sets"];
  const toolPages = ["calculator/leveling", "calculator/build", "calculator/stats", "calculator/dps", "calculator/planner", "calculator/disk-score", "gacha", "banners", "redeem-codes", "map", "system-requirements", "explorer", "team-builder", "city-tycoon", "effects", "compare-characters", "events", "voice-actors", "multiplayer", "gameplay", "porsche-collab"];
  const guideSubPages = ["guides/gacha-system"];
  const staticInfoPages = ["about", "contact", "terms", "privacy-policy"];
  const commonTags = ["s-class", "a-class", "cosmos", "anima", "incantation", "chaos", "psyche", "lakshana", "dps", "support", "beginner", "combat", "exploration", "advanced"];

  function locUrls(paths, priority, changeFreq) {
    return paths.flatMap(p => {
      const segment = p ? `${p}/` : "";
      return LOCALES.map(lang => ({ url: `${BASE_URL}/${lang}/${segment}`, priority, changeFreq }));
    });
  }

  function dataUrls(data, pathFn) {
    return data.flatMap(d => LOCALES.map(lang => pathFn(d, lang)));
  }

  // Pages sitemap
  const pageUrls = [
    ...locUrls([""], 1, "daily"),
    ...locUrls(categoryPages, 0.8, "weekly"),
    ...locUrls(toolPages, 0.9, "weekly"),
    ...locUrls(guideSubPages, 0.9, "weekly"),
    ...locUrls(staticInfoPages, 0.5, "monthly"),
  ];

  // Character sitemap
  const characterUrls = dataUrls(load("characters.json"), (c, lang) => ({ url: `${BASE_URL}/${lang}/characters/${c.id}/`, priority: 0.8, changeFreq: "weekly" }));

  // Weapon sitemap
  const weaponUrls = dataUrls(load("weapons.json"), (w, lang) => ({ url: `${BASE_URL}/${lang}/weapons/${w.id}/`, priority: 0.7, changeFreq: "weekly" }));

  // Vehicle sitemap
  const vehicleUrls = dataUrls(load("vehicles.json"), (v, lang) => ({ url: `${BASE_URL}/${lang}/vehicles/${v.id}/`, priority: 0.7, changeFreq: "weekly" }));

  // Guide sitemap
  const guideUrls = dataUrls(load("guides.json"), (g, lang) => ({ url: `${BASE_URL}/${lang}/guides/${g.id}/`, priority: 0.8, changeFreq: "weekly", lastmod: safeDate(g.date) }));

  // Collect tags dynamically from all tagged data sources, mirroring
  // app/[lang]/tags/[tag]/page.tsx generateStaticParams. Only include tags
  // with >= 4 matching items (others are noindex on the page itself, so
  // listing them in sitemap would create a sitemap-vs-robots contradiction).
  function collectIndexableTags() {
    const sources = [
      ...load("characters.json").map((c) => [c.attribute, c.rank?.toLowerCase(), c.role?.toLowerCase()]),
      ...load("weapons.json").map((w) => [w.type?.toLowerCase()]),
      ...load("materials.json").map((m) => [m.type?.toLowerCase()]),
      ...load("faqs.json").map((f) => f.tags || []),
      ...load("guides.json").map((g) => g.tags || []),
      ...load("lore.json").map((l) => [l.category?.toLowerCase()]),
      ...load("locations.json").map((l) => [l.category?.toLowerCase()]),
    ];
    const counts = new Map();
    for (const tagArr of sources) {
      for (const tag of tagArr) {
        if (!tag) continue;
        const t = String(tag).toLowerCase();
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    // Only indexable tags: >= 4 items (matches tag page's noindex threshold)
    const indexable = [];
    for (const [tag, count] of counts) {
      if (count >= 4) indexable.push(tag);
    }
    console.log(`[sitemap] tags: ${counts.size} total, ${indexable.length} indexable (>=4 items)`);
    return indexable;
  }

  // Other sitemap
  const otherUrls = [
    ...dataUrls(load("materials.json"), (m, lang) => ({ url: `${BASE_URL}/${lang}/materials/${m.id}/`, priority: 0.6, changeFreq: "monthly" })),
    ...dataUrls(load("faqs.json"), (f, lang) => ({ url: `${BASE_URL}/${lang}/faq/${f.id}/`, priority: 0.6, changeFreq: "monthly" })),
    ...dataUrls(load("lore.json"), (l, lang) => ({ url: `${BASE_URL}/${lang}/lore/${l.id}/`, priority: 0.7, changeFreq: "monthly" })),
    ...dataUrls(load("locations.json"), (l, lang) => ({ url: `${BASE_URL}/${lang}/locations/${l.id}/`, priority: 0.7, changeFreq: "monthly" })),
    ...dataUrls(load("blog.json"), (p, lang) => ({ url: `${BASE_URL}/${lang}/blog/${p.id}/`, priority: 0.8, changeFreq: "weekly", lastmod: safeDate(p.date) })),
    ...dataUrls(load("compares.json"), (c, lang) => ({ url: `${BASE_URL}/${lang}/compare/${c.id}/`, priority: 0.8, changeFreq: "monthly", lastmod: safeDate(c.updatedAt) || safeDate(c.date) })),
    ...dataUrls(load("quests.json"), (q, lang) => ({ url: `${BASE_URL}/${lang}/quests/${q.id}/`, priority: 0.7, changeFreq: "monthly", lastmod: safeDate(q.date) })),
    ...locUrls(["changelog"], 0.7, "weekly"),
    ...dataUrls(load("changelog.json"), (cl, lang) => ({ url: `${BASE_URL}/${lang}/changelog/${cl.version}/`, priority: 0.7, changeFreq: "monthly", lastmod: safeDate(cl.date) })),
    ...dataUrls(load("anomalies.json"), (a, lang) => ({ url: `${BASE_URL}/${lang}/anomalies/${a.id}/`, priority: 0.7, changeFreq: "monthly" })),
    ...dataUrls(load("disk-sets.json"), (d, lang) => ({ url: `${BASE_URL}/${lang}/disk-sets/${d.id}/`, priority: 0.7, changeFreq: "monthly" })),
    ...collectIndexableTags().flatMap(tag => LOCALES.map(lang => ({ url: `${BASE_URL}/${lang}/tags/${encodeURIComponent(tag)}/`, priority: 0.5, changeFreq: "weekly" }))),
  ];

  // Anime Destiny sitemap (English only)
  const adBase = `${BASE_URL}/en/anime-destiny`;
  const adUrls = [
    { url: `${adBase}/`, priority: 0.9, changeFreq: "daily" },
    { url: `${adBase}/codes/`, priority: 0.9, changeFreq: "daily" },
    { url: `${adBase}/tier-list/`, priority: 0.8, changeFreq: "weekly" },
    { url: `${adBase}/units/`, priority: 0.8, changeFreq: "weekly" },
    { url: `${adBase}/traits/`, priority: 0.7, changeFreq: "weekly" },
    { url: `${adBase}/artifacts/`, priority: 0.7, changeFreq: "weekly" },
    { url: `${adBase}/guides/`, priority: 0.8, changeFreq: "weekly" },
    ...loadAD("units.json").map(u => ({ url: `${adBase}/units/${u.id}/`, priority: 0.7, changeFreq: "weekly" })),
    ...loadAD("guides.json").map(g => ({ url: `${adBase}/guides/${g.id}/`, priority: 0.8, changeFreq: "weekly" })),
  ];

  writeSitemap("sitemap-pages.xml", pageUrls);
  writeSitemap("sitemap-characters.xml", characterUrls);
  writeSitemap("sitemap-weapons.xml", weaponUrls);
  writeSitemap("sitemap-vehicles.xml", vehicleUrls);
  writeSitemap("sitemap-guides.xml", guideUrls);
  writeSitemap("sitemap-other.xml", otherUrls);
  writeSitemap("sitemap-anime-destiny.xml", adUrls);

  // Sitemap index
  const subSitemaps = ["sitemap-pages.xml", "sitemap-characters.xml", "sitemap-weapons.xml", "sitemap-vehicles.xml", "sitemap-guides.xml", "sitemap-other.xml", "sitemap-anime-destiny.xml"];
  const now = new Date().toISOString();
  const existingIndexLastmods = (() => {
    const file = path.join(PUBLIC, "sitemap.xml");
    if (!fs.existsSync(file)) return new Map();

    const xml = fs.readFileSync(file, "utf-8");
    const lastmods = new Map();
    const entryRe = /<sitemap>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
    let match;
    while ((match = entryRe.exec(xml))) {
      lastmods.set(match[1], match[2]);
    }
    return lastmods;
  })();
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${subSitemaps.map(s => {
    const loc = `${BASE_URL}/${s}`;
    return `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${existingIndexLastmods.get(loc) || now}</lastmod>\n  </sitemap>`;
  }).join("\n")}\n</sitemapindex>\n`;
  fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), indexXml, "utf-8");

  const total = pageUrls.length + characterUrls.length + weaponUrls.length + vehicleUrls.length + guideUrls.length + otherUrls.length + adUrls.length;
  console.log(`[sitemap] sitemap.xml: index (${subSitemaps.length} sub-sitemaps, ${total} total URLs)`);
}

// ── 3. API JSON ────────────────────────────────────────
function generateApiJson() {
  const apiDir = path.join(PUBLIC, "api");
  fs.mkdirSync(apiDir, { recursive: true });

  const characters = load("characters.json").map(c => ({
    id: c.id, name: c.nameEn || c.name, nameCn: c.name, slug: c.id,
    element: c.attribute || null, weapon: c.weaponEn || c.weapon || null,
    rarity: c.rank === "S" ? 5 : c.rank === "A" ? 4 : 3,
    role: c.roleEn || c.role || null, image: c.image || null,
  }));
  fs.writeFileSync(path.join(apiDir, "characters.json"), JSON.stringify(characters), "utf-8");
  console.log(`[api] characters.json: ${characters.length} items`);

  const codes = load("redeem-codes.json").map(c => ({
    code: c.code, reward: c.rewardEn || c.reward, rewardCn: c.reward,
    expired: c.status === "expired", expiresAt: c.expiresAt || null, region: c.region || "global",
  }));
  fs.writeFileSync(path.join(apiDir, "redeem-codes.json"), JSON.stringify(codes), "utf-8");
  console.log(`[api] redeem-codes.json: ${codes.length} items`);
}

// ── 4. llms-full.txt ────────────────────────────────────
function generateLlmsFull() {
  const lines = [];
  lines.push("# nteguide.com — Full Content Index");
  lines.push("");
  lines.push("> Machine-readable content index for AI crawlers.");
  lines.push(`> Generated: ${new Date().toISOString().split("T")[0]}`);
  lines.push("");

  // Characters
  const characters = load("characters.json");
  lines.push("## Characters (" + characters.length + ")");
  for (const c of characters) {
    lines.push(`- [${c.name} / ${c.nameEn}](/en/characters/${c.id}/) — ${c.rank}-rank ${c.attribute || ""} ${c.roleEn || c.role || ""}`);
  }
  lines.push("");

  // Weapons
  const weapons = load("weapons.json");
  lines.push("## Weapons (" + weapons.length + ")");
  for (const w of weapons) {
    lines.push(`- [${w.name} / ${w.nameEn}](/en/weapons/${w.id}/) — ${w.rank}-rank ${w.type} ATK ${w.baseAtk}`);
  }
  lines.push("");

  // Guides
  const guides = load("guides.json");
  lines.push("## Guides (" + guides.length + ")");
  for (const g of guides) {
    lines.push(`- [${g.title}](/en/guides/${g.id}/) — ${g.categoryEn || ""} (updated ${g.date || "N/A"})`);
  }
  lines.push("");

  // FAQ
  const faqs = load("faqs.json");
  lines.push("## FAQ (" + faqs.length + ")");
  for (const f of faqs) {
    lines.push(`- ${f.questionEn || f.question}`);
  }
  lines.push("");

  // Redeem codes
  const codes = load("redeem-codes.json").filter(c => c.status !== "expired");
  lines.push("## Active Redeem Codes (" + codes.length + ")");
  for (const c of codes) {
    lines.push(`- ${c.code}: ${c.rewardEn || c.reward}`);
  }

  const outPath = path.join(PUBLIC, "llms-full.txt");
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
  console.log("[llms-full] " + lines.length + " lines written");
}

// ── Run all ────────────────────────────────────────────
console.log("=== Pre-build (merged) ===");
generateSearchIndex();
generateSitemaps();
generateApiJson();
generateLlmsFull();
console.log("=== Pre-build done ===");
