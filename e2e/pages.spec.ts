import { test, expect } from "@playwright/test";

test.describe("Core page rendering", () => {
  test("zh homepage loads successfully", async ({ page }) => {
    const response = await page.goto("/zh/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("en homepage loads successfully", async ({ page }) => {
    const response = await page.goto("/en/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("zh characters list page loads", async ({ page }) => {
    const response = await page.goto("/zh/characters/");
    expect(response?.status()).toBe(200);
  });

  test("en characters list page loads", async ({ page }) => {
    const response = await page.goto("/en/characters/");
    expect(response?.status()).toBe(200);
  });

  test("zh weapons list page loads", async ({ page }) => {
    const response = await page.goto("/zh/weapons/");
    expect(response?.status()).toBe(200);
  });

  test("zh materials list page loads", async ({ page }) => {
    const response = await page.goto("/zh/materials/");
    expect(response?.status()).toBe(200);
  });

  test("zh calculator page loads", async ({ page }) => {
    const response = await page.goto("/zh/calculator/leveling/");
    expect(response?.status()).toBe(200);
  });

  test("zh gacha page loads", async ({ page }) => {
    const response = await page.goto("/zh/gacha/");
    expect(response?.status()).toBe(200);
  });

  test("zh guides list page loads", async ({ page }) => {
    const response = await page.goto("/zh/guides/");
    expect(response?.status()).toBe(200);
  });

  test("zh tier list page loads", async ({ page }) => {
    const response = await page.goto("/zh/tier-list/");
    expect(response?.status()).toBe(200);
  });
});

test.describe("SEO verification", () => {
  test("zh homepage has correct title", async ({ page }) => {
    await page.goto("/zh/");
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);
  });

  test("zh homepage has meta description", async ({ page }) => {
    await page.goto("/zh/");
    const metaDesc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeGreaterThan(10);
  });

  test("zh homepage has hreflang tags", async ({ page }) => {
    await page.goto("/zh/");
    const hreflang = await page.locator('link[rel="alternate"]').count();
    expect(hreflang).toBeGreaterThanOrEqual(3);
  });

  test("zh homepage has canonical URL", async ({ page }) => {
    await page.goto("/zh/");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBeTruthy();
    expect(canonical).toContain("nteguide.com");
  });

  test("zh homepage has Open Graph tags", async ({ page }) => {
    await page.goto("/zh/");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });

  test("zh homepage has JSON-LD structured data", async ({ page }) => {
    await page.goto("/zh/");
    const jsonLd = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLd).toBeGreaterThanOrEqual(1);
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("character detail page has structured data", async ({ page }) => {
    // Get first character page
    await page.goto("/zh/characters/");
    const firstCharLink = await page.locator('a[href*="/zh/characters/"]').first().getAttribute("href");
    if (firstCharLink) {
      await page.goto(firstCharLink);
      const jsonLd = await page.locator('script[type="application/ld+json"]').count();
      expect(jsonLd).toBeGreaterThanOrEqual(1);
    }
  });
});

test.describe("Navigation", () => {
  test("header is visible on zh homepage", async ({ page }) => {
    await page.goto("/zh/");
    const header = page.locator("header");
    await expect(header).toBeVisible();
  });

  test("footer is visible on zh homepage", async ({ page }) => {
    await page.goto("/zh/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("character cards are rendered on characters page", async ({ page }) => {
    await page.goto("/zh/characters/");
    // Wait for content to load
    await page.waitForTimeout(1000);
    const cards = await page.locator('a[href*="/zh/characters/"]').count();
    expect(cards).toBeGreaterThanOrEqual(5);
  });
});
