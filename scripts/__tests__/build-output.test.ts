/**
 * Build output verification tests
 * These tests validate that the static export produces expected output.
 * Run with: npm run build && npm test
 *
 * Only runs when the `out/` directory exists (i.e., after a build).
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve(__dirname, "../../out");
const hasBuild = fs.existsSync(OUT_DIR);

const describeIfBuilt = hasBuild ? describe : describe.skip;

describeIfBuilt("Build output verification", () => {
  it("generates sitemap.xml", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "sitemap.xml"))).toBe(true);
  });

  it("generates _redirects file", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "_redirects"))).toBe(true);
  });

  it("generates _headers file", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "_headers"))).toBe(true);
  });

  it("generates robots.txt that blocks unsupported language prefixes", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "robots.txt"), "utf-8");
    for (const prefix of ["/ja/", "/de/", "/fr/", "/es/", "/ru/", "/th/", "/vi/", "/id/", "/ko/", "/pt-br/"]) {
      expect(content).toContain(`Disallow: ${prefix}`);
    }
  });

  it("generates a concrete not-found target for unsupported language redirects", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "_not-found/index.html"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "404.html"))).toBe(true);
  });

  it("does not mark unsupported language prefixes as noindex headers", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "_headers"), "utf-8");
    for (const prefix of ["/ja/*", "/de/*", "/fr/*", "/es/*", "/ru/*", "/th/*", "/vi/*", "/id/*", "/ko/*", "/pt-br/*"]) {
      expect(content).not.toContain(prefix);
    }
  });

  it("exports internal HTML links as canonical trailing-slash URLs", () => {
    function scanHtmlFiles(dir: string, failures: string[] = []): string[] {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanHtmlFiles(full, failures);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
          const content = fs.readFileSync(full, "utf-8");
          const matches = content.matchAll(/\bhref=["'](\/[^"']*)["']/g);
          for (const match of matches) {
            const href = match[1];
            const pathname = href.split(/[?#]/)[0];
            const lastSegment = pathname.split("/").pop() || "";
            const isFile = /\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);
            const ignored =
              href.startsWith("/_next/") ||
              href.startsWith("/api/") ||
              href === "/" ||
              pathname.endsWith("/") ||
              isFile;

            if (!ignored) {
              failures.push(`${path.relative(OUT_DIR, full)} -> ${href}`);
            }
          }
        }
      }
      return failures;
    }

    expect(scanHtmlFiles(OUT_DIR)).toEqual([]);
  });

  it("generates zh index page", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "zh/index.html"))).toBe(true);
  });

  it("generates en index page", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "en/index.html"))).toBe(true);
  });

  it("generates characters list pages for both locales", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "zh/characters/index.html"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "en/characters/index.html"))).toBe(true);
  });

  it("generates weapons list pages for both locales", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "zh/weapons/index.html"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "en/weapons/index.html"))).toBe(true);
  });

  it("generates calculator pages", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "zh/calculator/leveling/index.html"))).toBe(true);
    expect(fs.existsSync(path.join(OUT_DIR, "en/calculator/leveling/index.html"))).toBe(true);
  });

  it("generates gacha page", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "zh/gacha/index.html"))).toBe(true);
  });

  it("generates search index", () => {
    expect(fs.existsSync(path.join(OUT_DIR, "search-index.json"))).toBe(true);
  });

  it("search-index.json has valid JSON with items", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "search-index.json"), "utf-8");
    const data = JSON.parse(content);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(100);
  });

  it("search-index.json uses canonical trailing-slash page URLs", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "search-index.json"), "utf-8");
    const data = JSON.parse(content) as Array<{ url: string }>;
    const failures = data
      .map((item) => item.url)
      .filter((url) => {
        const pathname = url.split(/[?#]/)[0];
        const lastSegment = pathname.split("/").pop() || "";
        const isFile = /\.[a-zA-Z0-9]{2,8}$/.test(lastSegment);
        return url.startsWith("/") && !url.startsWith("/api/") && pathname !== "/" && !pathname.endsWith("/") && !isFile;
      });

    expect(failures).toEqual([]);
  });

  it("sitemap.xml is valid XML", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "sitemap.xml"), "utf-8");
    expect(content).toContain("<?xml");
    const hasUrlset = content.includes("<urlset");
    const hasSitemapIndex = content.includes("<sitemapindex");
    expect(hasUrlset || hasSitemapIndex).toBe(true);
  });

  it("_redirects contains root redirect", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "_redirects"), "utf-8");
    expect(content).toMatch(/\//); // has root redirect
  });

  it("_redirects returns unsupported language prefixes as 404", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "_redirects"), "utf-8");
    expect(content).toContain("/ja/* /_not-found/index.html 404");
    expect(content).toContain("/de/* /_not-found/index.html 404");
    expect(content).toContain("/pt-br/* /_not-found/index.html 404");
  });

  it("_redirects covers trailing-slash variants of manual legacy rules", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "_redirects"), "utf-8");
    expect(content).toContain("/tw/blog/nte-system-requirements-can-you-run-it/ /tw/system-requirements/ 301");
    expect(content).toContain("/en/weapons/whip-sword/ /en/weapons/clear-skies/ 301");
    expect(content).toContain("/en/weapons/blade-wings/ /en/weapons/raging-flames/ 301");
  });

  it("generates at least 500 HTML files", () => {
    function countHtmlFiles(dir: string): number {
      let count = 0;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          count += countHtmlFiles(full);
        } else if (entry.name.endsWith(".html")) {
          count++;
        }
      }
      return count;
    }
    const htmlCount = countHtmlFiles(OUT_DIR);
    expect(htmlCount).toBeGreaterThanOrEqual(500);
  });
});
