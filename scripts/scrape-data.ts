/**
 * Scrape character data from thegameswiki.com
 * Usage: npx tsx scripts/scrape-data.ts
 *
 * Note: This script is a one-time utility. The scraped data is curated
 * and stored in data/characters.json manually after review.
 */

import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://thegameswiki.com/neverness-to-everness/wiki";

const VALID_ATTRIBUTES = [
  "cosmos",
  "anima",
  "incantation",
  "chaos",
  "psyche",
  "lakshana",
] as const;

const VALID_RANKS = ["A", "S"] as const;

interface ScrapedCharacter {
  id: string;
  name: string;
  nameEn: string;
  attribute: string;
  rank: string;
  weapon: string;
  weaponEn: string;
  role: string;
  roleEn: string;
  faction?: string;
  description?: string;
  source: string;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function parseAttribute(text: string): string | null {
  const lower = text.toLowerCase();
  for (const attr of VALID_ATTRIBUTES) {
    if (lower.includes(attr)) return attr;
  }
  // Check Chinese attribute names
  const zhMap: Record<string, string> = {
    宇宙: "cosmos",
    生命: "anima",
    咒术: "incantation",
    混沌: "chaos",
    灵魂: "psyche",
    相: "lakshana",
  };
  for (const [zh, en] of Object.entries(zhMap)) {
    if (text.includes(zh)) return en;
  }
  return null;
}

function parseRank(text: string): string | null {
  if (/\bA-rank\b/i.test(text) || /\bA级\b/.test(text)) return "A";
  if (/\bS-rank\b/i.test(text) || /\bS级\b/.test(text)) return "S";
  return null;
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function getCharacterSlugs(): Promise<string[]> {
  const html = await fetchPage(`${BASE_URL}?category=characters`);
  const $ = cheerio.load(html);

  const slugs: string[] = [];
  // Look for links to character pages
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const match = href.match(/\/neverness-to-everness\/wiki\/([a-z][a-z0-9-]+)$/i);
    if (match) {
      const slug = match[1].toLowerCase();
      // Exclude non-character pages
      const excludeSlugs = [
        "characters",
        "combat-system",
        "gameplay-overview",
        "anomaly-dungeons",
        "scarborough-fair",
        "characters-espers-guide",
      ];
      if (!excludeSlugs.includes(slug) && !slugs.includes(slug)) {
        slugs.push(slug);
      }
    }
  });

  return slugs;
}

async function scrapeCharacter(slug: string): Promise<Partial<ScrapedCharacter>> {
  const url = `${BASE_URL}/${slug}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const result: Partial<ScrapedCharacter> = {
    id: slug,
    nameEn: slug.charAt(0).toUpperCase() + slug.slice(1),
    source: url,
  };

  // Extract name from h1
  const h1 = $("h1").first().text().trim();
  if (h1) result.nameEn = h1;

  // Extract description from meta
  const metaDesc = $('meta[name="description"]').attr("content");
  if (metaDesc) result.description = metaDesc;

  // Parse full text for attribute and rank
  const fullText = $("article").text() || $.text();

  const attr = parseAttribute(fullText);
  if (attr) result.attribute = attr;

  const rank = parseRank(fullText);
  if (rank) result.rank = rank;

  return result;
}

async function main() {
  console.log("Fetching character list...");
  const slugs = await getCharacterSlugs();
  console.log(`Found ${slugs.length} character slugs:`, slugs);

  const results: Partial<ScrapedCharacter>[] = [];

  for (const slug of slugs) {
    try {
      console.log(`Scraping ${slug}...`);
      const data = await scrapeCharacter(slug);
      results.push(data);
      // Be respectful — small delay between requests
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`Failed to scrape ${slug}:`, err);
      results.push({ id: slug, nameEn: slug, source: `${BASE_URL}/${slug}` });
    }
  }

  const outPath = path.join(__dirname, "..", "data", "scraped-characters.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nScraped data saved to ${outPath}`);

  // Summary
  const withAttr = results.filter((r) => r.attribute).length;
  const withRank = results.filter((r) => r.rank).length;
  console.log(`With attribute: ${withAttr}/${results.length}`);
  console.log(`With rank: ${withRank}/${results.length}`);
}

main().catch(console.error);
