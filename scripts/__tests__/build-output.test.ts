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

  it("generates permissive robots.txt so crawlers can see removal signals", () => {
    const content = [
      fs.readFileSync(path.join(OUT_DIR, "robots.txt"), "utf-8"),
      fs.readFileSync(path.resolve(__dirname, "../../public/robots.txt"), "utf-8"),
    ].join("\n");
    for (const prefix of ["/ja/", "/de/", "/fr/", "/es/", "/ru/", "/th/", "/vi/", "/id/", "/ko/", "/pt-br/"]) {
      expect(content).not.toContain(`Disallow: ${prefix}`);
    }
    expect(content).not.toContain("Disallow: /api/");
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

  it("marks public API JSON endpoints as noindex headers", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "_headers"), "utf-8");
    expect(content).toContain("/api/*");
    expect(content).toContain("X-Robots-Tag: noindex, follow");
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

  it("does not export duplicated NTE Guide title suffixes", () => {
    function scanHtmlFiles(dir: string, failures: string[] = []): string[] {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanHtmlFiles(full, failures);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
          const content = fs.readFileSync(full, "utf-8");
          const title = content.match(/<title>(.*?)<\/title>/s)?.[1] || "";
          if ((title.match(/NTE Guide/g) || []).length > 1) {
            failures.push(`${path.relative(OUT_DIR, full)} -> ${title}`);
          }
        }
      }
      return failures;
    }

    expect(scanHtmlFiles(OUT_DIR)).toEqual([]);
  });

  it("exports indexable localized pages with useful meta descriptions", () => {
    function scanHtmlFiles(dir: string, failures: string[] = []): string[] {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanHtmlFiles(full, failures);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
          const rel = path.relative(OUT_DIR, full);
          if (!/^(zh|tw|en)\//.test(rel)) continue;

          const content = fs.readFileSync(full, "utf-8");
          const robots = content.match(/<meta name="robots" content="([^"]*)"/)?.[1] || "";
          if (robots.includes("noindex")) continue;

          const description = content.match(/<meta name="description" content="([^"]*)"/)?.[1] || "";
          if (description.length < 80) {
            failures.push(`${rel} -> ${description}`);
          }
        }
      }
      return failures;
    }

    expect(scanHtmlFiles(OUT_DIR)).toEqual([]);
  });

  it("sitemap.xml is valid XML", () => {
    const content = fs.readFileSync(path.join(OUT_DIR, "sitemap.xml"), "utf-8");
    expect(content).toContain("<?xml");
    const hasUrlset = content.includes("<urlset");
    const hasSitemapIndex = content.includes("<sitemapindex");
    expect(hasUrlset || hasSitemapIndex).toBe(true);
  });

  it("does not generate duplicate sitemap URLs", () => {
    const sitemapFiles = fs
      .readdirSync(OUT_DIR)
      .filter((file) => /^sitemap.*\.xml$/.test(file));
    const urls: string[] = [];

    for (const file of sitemapFiles) {
      const content = fs.readFileSync(path.join(OUT_DIR, file), "utf-8");
      for (const match of content.matchAll(/<loc>(.*?)<\/loc>/g)) {
        const url = match[1];
        if (url.endsWith(".xml")) continue;
        urls.push(url);
      }
    }

    const seen = new Set<string>();
    const duplicates = urls.filter((url) => {
      if (seen.has(url)) return true;
      seen.add(url);
      return false;
    });

    expect(duplicates).toEqual([]);
  });

  it("does not list redirected URLs in sitemaps", () => {
    const redirects = fs
      .readFileSync(path.join(OUT_DIR, "_redirects"), "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split(/\s+/))
      .filter((parts) => parts[2] === "301" && parts[0] !== "/")
      .map(([from]) => `https://nteguide.com${from}`);
    const redirectedUrls = new Set(redirects);
    const sitemapHits: string[] = [];

    for (const file of fs.readdirSync(OUT_DIR).filter((name) => /^sitemap.*\.xml$/.test(name))) {
      const content = fs.readFileSync(path.join(OUT_DIR, file), "utf-8");
      for (const match of content.matchAll(/<loc>(.*?)<\/loc>/g)) {
        if (redirectedUrls.has(match[1])) {
          sitemapHits.push(`${file}: ${match[1]}`);
        }
      }
    }

    expect(sitemapHits).toEqual([]);
  });

  it("does not link to non-root redirected URLs from exported content", () => {
    const redirects = fs
      .readFileSync(path.join(OUT_DIR, "_redirects"), "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split(/\s+/))
      .filter((parts) => parts[2] === "301" && parts[0] !== "/")
      .map(([from]) => from);
    const hits: string[] = [];

    function scan(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(full);
        } else if (entry.isFile() && /\.(html|json|txt|xml)$/.test(entry.name)) {
          if (entry.name === "_redirects") continue;
          const content = fs.readFileSync(full, "utf-8");
          const linkedPaths = new Set<string>();
          for (const match of content.matchAll(/href=["']([^"']+)["']/g)) {
            linkedPaths.add(match[1]);
          }
          for (const match of content.matchAll(/https:\/\/nteguide\.com([^"<]+)(?=["<])/g)) {
            linkedPaths.add(match[1]);
          }
          for (const from of redirects) {
            if (linkedPaths.has(from)) hits.push(`${path.relative(OUT_DIR, full)}: ${from}`);
          }
        }
      }
    }

    scan(OUT_DIR);

    expect(hits).toEqual([]);
  }, 20_000);

  it("exports every sitemap HTML URL", () => {
    const sitemapFiles = fs
      .readdirSync(OUT_DIR)
      .filter((file) => /^sitemap.*\.xml$/.test(file));
    const missing: string[] = [];

    for (const file of sitemapFiles) {
      const content = fs.readFileSync(path.join(OUT_DIR, file), "utf-8");
      for (const match of content.matchAll(/<loc>https:\/\/nteguide\.com([^<]+)<\/loc>/g)) {
        const pathname = match[1];
        if (pathname.endsWith(".xml")) continue;
        const localPath = pathname.endsWith("/")
          ? path.join(OUT_DIR, pathname.slice(1), "index.html")
          : path.join(OUT_DIR, pathname.slice(1));

        if (!fs.existsSync(localPath)) {
          missing.push(`${file}: ${pathname}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it("lists every indexable exported HTML page in sitemaps", () => {
    const sitemapFiles = fs
      .readdirSync(OUT_DIR)
      .filter((file) => /^sitemap.*\.xml$/.test(file));
    const sitemapUrls = new Set<string>();

    for (const file of sitemapFiles) {
      const content = fs.readFileSync(path.join(OUT_DIR, file), "utf-8");
      for (const match of content.matchAll(/<loc>(https:\/\/nteguide\.com\/[^<]*)<\/loc>/g)) {
        if (!match[1].endsWith(".xml")) sitemapUrls.add(match[1]);
      }
    }

    function htmlUrl(full: string) {
      let rel = path.relative(OUT_DIR, full).replace(/\\/g, "/");
      if (rel === "index.html") return "https://nteguide.com/";
      if (rel.endsWith("/index.html")) rel = rel.slice(0, -"index.html".length);
      else rel = rel.replace(/\.html$/, "/");
      return `https://nteguide.com/${rel}`;
    }

    function scanHtmlFiles(dir: string, failures: string[] = []): string[] {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanHtmlFiles(full, failures);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
          if (path.relative(OUT_DIR, full) === "404.html") continue;
          const content = fs.readFileSync(full, "utf-8");
          const robots = content.match(/<meta name="robots" content="([^"]*)"/)?.[1] || "";
          if (robots.includes("noindex")) continue;

          const url = htmlUrl(full);
          if (!sitemapUrls.has(url)) failures.push(url);
        }
      }
      return failures;
    }

    expect(scanHtmlFiles(OUT_DIR)).toEqual([]);
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
