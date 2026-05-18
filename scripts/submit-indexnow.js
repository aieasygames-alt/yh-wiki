#!/usr/bin/env node
/**
 * Submit URLs to search engines via IndexNow protocol.
 * Supported by: Bing, Yandex, Naver, Seznam
 *
 * Usage:
 *   node scripts/submit-indexnow.js              # Submit changed URLs (git diff)
 *   node scripts/submit-indexnow.js --all        # Submit all URLs from sitemaps
 *   node scripts/submit-indexnow.js --urls url1 url2  # Submit specific URLs
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_URL = "https://nteguide.com";
const KEY = "113be43db95093ec0475d10e2f342d8c";
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

// IndexNow endpoints
const ENDPOINTS = [
  "www.bing.com",        // Bing-specific endpoint
  "api.indexnow.org",    // Shared endpoint (submits to all engines)
];

function postToEndpoint(hostname, urls) {
  // IndexNow allows max 10,000 URLs per request
  const batches = [];
  for (let i = 0; i < urls.length; i += 10000) {
    batches.push(urls.slice(i, i + 10000));
  }

  const body = JSON.stringify({
    host: "nteguide.com",
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batches[0],
  });

  const options = {
    hostname: hostname,
    port: 443,
    path: "/indexnow",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
    timeout: 30000,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const status = res.statusCode;
        if (status === 200) {
          console.log(`  OK: All URLs submitted successfully.`);
        } else if (status === 202) {
          console.log(`  Accepted: URLs received and will be processed.`);
        } else if (status === 400) {
          console.error(`  Error 400: Bad request format.`);
        } else if (status === 403) {
          console.error(`  Error 403: Key verification failed. Check key file.`);
        } else if (status === 422) {
          console.error(`  Error 422: Invalid URLs in request.`);
        } else if (status === 429) {
          console.error(`  Error 429: Too many requests. Try again later.`);
        } else {
          console.log(`  Status ${status}: ${data}`);
        }
        resolve(status);
      });
    });

    req.on("error", (e) => {
      console.error(`  Request failed: ${e.message}`);
      reject(e);
    });

    req.on("timeout", () => {
      req.destroy();
      console.error("  Request timed out.");
      reject(new Error("timeout"));
    });

    req.write(body);
    req.end();
  });
}

async function postIndexNow(urls) {
  if (urls.length === 0) {
    console.log("No URLs to submit.");
    return;
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);

  for (const endpoint of ENDPOINTS) {
    console.log(`\nEndpoint: ${endpoint}`);
    try {
      await postToEndpoint(endpoint, urls);
    } catch (e) {
      console.error(`  Failed to submit to ${endpoint}: ${e.message}`);
    }
  }
}

// Extract URLs from sitemap XML files
function getUrlsFromSitemaps() {
  const publicDir = path.join(__dirname, "..", "public");
  const urls = [];

  const sitemapFiles = [
    "sitemap-pages.xml",
    "sitemap-characters.xml",
    "sitemap-weapons.xml",
    "sitemap-vehicles.xml",
    "sitemap-guides.xml",
    "sitemap-other.xml",
  ];

  for (const file of sitemapFiles) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) continue;
    const xml = fs.readFileSync(filePath, "utf-8");
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    for (const m of matches) {
      urls.push(m[1]);
    }
  }

  return urls;
}

// Get changed URLs from git diff
function getChangedUrls() {
  const { execSync } = require("child_process");
  const ROOT = path.resolve(__dirname, "..");

  // Get list of changed files in last commit
  let diffOutput;
  try {
    diffOutput = execSync(
      `git -C "${ROOT}" diff --name-only HEAD~1 HEAD -- "app/" "data/" "scripts/generate-sitemaps.js"`,
      { encoding: "utf-8" }
    ).trim();
  } catch {
    console.log("  Cannot get git diff, falling back to --all");
    return getUrlsFromSitemaps();
  }

  if (!diffOutput) {
    console.log("  No relevant changes detected.");
    return [];
  }

  const files = diffOutput.split("\n").filter(Boolean);
  const urls = new Set();

  for (const file of files) {
    // Data file changes -> submit related page URLs
    if (file.startsWith("data/")) {
      const name = path.basename(file, ".json");
      if (["characters", "weapons", "vehicles", "materials", "guides", "blog", "faqs", "lore", "locations", "anomalies", "disk-sets"].includes(name)) {
        // Submit all URLs for this content type (can't easily detect individual changes)
        const sitemap = `sitemap-${name === "faqs" ? "other" : name}.xml`;
        const sitemapPath = path.join(ROOT, "public", sitemap);
        if (fs.existsSync(sitemapPath)) {
          const xml = fs.readFileSync(sitemapPath, "utf-8");
          const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
          for (const m of matches) urls.add(m[1]);
        }
      } else if (name === "redeem-codes") {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/redeem-codes/`));
      } else if (name === "system-requirements") {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/system-requirements/`));
      } else if (name === "map-markers") {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/map/`));
      } else if (name === "compares") {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/compare/nte-vs-genshin/`));
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/compare/nte-vs-wuthering-waves/`));
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/compare/nte-vs-zzz/`));
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/compare/games-like-nte/`));
      } else if (name === "changelog") {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/changelog/`));
      }
    }

    // App page changes -> submit those pages
    if (file.startsWith("app/[lang]/")) {
      const routeMatch = file.match(/app\/\[lang\]\/(.+?)\/(?:page|layout)\.tsx/);
      if (routeMatch) {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/${routeMatch[1]}/`));
      }
      // If it's the home page
      if (file === "app/[lang]/page.tsx") {
        ["zh", "tw", "en"].forEach(l => urls.add(`${BASE_URL}/${l}/`));
      }
    }

    // Sitemap changes -> submit all URLs
    if (file.includes("generate-sitemaps") || file.includes("sitemap")) {
      return getUrlsFromSitemaps();
    }
  }

  return Array.from(urls);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  let urls;

  if (args.includes("--all")) {
    urls = getUrlsFromSitemaps();
    console.log(`Found ${urls.length} URLs from sitemaps.`);
  } else if (args.includes("--urls")) {
    const idx = args.indexOf("--urls");
    urls = args.slice(idx + 1);
  } else {
    console.log("Detecting changed URLs from last commit...");
    urls = getChangedUrls();
    console.log(`Detected ${urls.length} changed URL(s).`);
  }

  if (urls.length === 0) {
    console.log("Nothing to submit.");
    return;
  }

  // Limit to first 10000
  if (urls.length > 10000) {
    console.log(`Limiting to first 10,000 URLs (total: ${urls.length}).`);
    urls = urls.slice(0, 10000);
  }

  await postIndexNow(urls);
}

main().catch(console.error);
