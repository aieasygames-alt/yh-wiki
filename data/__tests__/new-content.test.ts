import { describe, it, expect } from "vitest";
import comparesData from "../../data/compares.json";
import guidesData from "../../data/guides.json";
import blogData from "../../data/blog.json";
import faqsData from "../../data/faqs.json";
import mapData from "../../data/map-markers.json";

describe("compares.json — nte-vs-ananta", () => {
  const ananta = comparesData.find((c) => c.id === "nte-vs-ananta");

  it("exists in compares data", () => {
    expect(ananta).toBeDefined();
  });

  it("has required fields", () => {
    expect(ananta!.id).toBe("nte-vs-ananta");
    expect(ananta!.title).toBeTruthy();
    expect(ananta!.titleEn).toBeTruthy();
    expect(ananta!.summary).toBeTruthy();
    expect(ananta!.summaryEn).toBeTruthy();
    expect(ananta!.content).toBeTruthy();
    expect(ananta!.contentEn).toBeTruthy();
    expect(ananta!.category).toBe("comparison");
    expect(ananta!.categoryZh).toBe("对比");
    expect(ananta!.categoryEn).toBe("Comparison");
    expect(ananta!.date).toBe("2026-06-19");
    expect(ananta!.tags).toContain("comparison");
    expect(ananta!.tags).toContain("ananta");
  });

  it("has bilingual content with sufficient length", () => {
    expect(ananta!.content.length).toBeGreaterThan(500);
    expect(ananta!.contentEn.length).toBeGreaterThan(500);
  });

  it("has internal links", () => {
    expect(ananta!.internalLinks.length).toBeGreaterThan(0);
    for (const link of ananta!.internalLinks) {
      expect(link.href).toBeTruthy();
      expect(link.label).toBeTruthy();
      expect(link.labelEn).toBeTruthy();
    }
  });

  it("has no duplicate compare ids", () => {
    const ids = comparesData.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("late Version 1.3 player-decision content", () => {
  const linkoPullGuide = guidesData.find((guide) => guide.id === "nte-1-3-linko-pull-planning");
  const cleanupGuide = guidesData.find((guide) => guide.id === "nte-1-3-fogden-duskmoor-cleanup-route");
  const nextVersionFaq = faqsData.find((faq) => faq.id === "nte-next-version-tracker");

  it("provides bilingual Linko pull-planning content without treating rumors as facts", () => {
    expect(linkoPullGuide).toBeDefined();
    expect(linkoPullGuide!.content).toContain("未确认");
    expect(linkoPullGuide!.contentEn).toContain("unconfirmed");
    expect(linkoPullGuide!.tags).toContain("linko");
  });

  it("provides a bilingual Fogden and Duskmoor cleanup route", () => {
    expect(cleanupGuide).toBeDefined();
    expect(cleanupGuide!.content).toContain("传送点");
    expect(cleanupGuide!.contentEn).toContain("travel points");
    expect(cleanupGuide!.tags).toContain("duskmoor");
  });

  it("keeps next-version FAQ claims explicitly verified", () => {
    expect(nextVersionFaq).toBeDefined();
    expect(nextVersionFaq!.answer).toContain("未经官方前瞻");
    expect(nextVersionFaq!.answerEn).toContain("unverified");
    expect(nextVersionFaq!.tags).toContain("待确认");
  });

  it("keeps all live 1.3 map regions available to sitemap generation", () => {
    expect(Object.keys(mapData.regions)).toEqual(expect.arrayContaining(["fogden", "duskmoor"]));
  });
});

describe("guides.json — city-tycoon-guide", () => {
  const tycoon = guidesData.find((g) => g.id === "city-tycoon-guide");

  it("exists in guides data", () => {
    expect(tycoon).toBeDefined();
  });

  it("has required fields", () => {
    expect(tycoon!.title).toBeTruthy();
    expect(tycoon!.titleEn).toBeTruthy();
    expect(tycoon!.summary).toBeTruthy();
    expect(tycoon!.summaryEn).toBeTruthy();
    expect(tycoon!.content).toBeTruthy();
    expect(tycoon!.contentEn).toBeTruthy();
    expect(tycoon!.category).toBe("guide");
  });

  it("has bilingual content with sufficient length", () => {
    expect(tycoon!.content.length).toBeGreaterThan(500);
    expect(tycoon!.contentEn.length).toBeGreaterThan(500);
  });

  it("has relevant tags", () => {
    expect(tycoon!.tags).toContain("city-tycoon");
    expect(tycoon!.tags).toContain("guide");
  });

  it("has FAQ items", () => {
    expect(tycoon!.faq).toBeDefined();
    expect(tycoon!.faq!.length).toBeGreaterThanOrEqual(3);
    for (const faq of tycoon!.faq!) {
      expect(faq.question).toBeTruthy();
      expect(faq.answer).toBeTruthy();
    }
  });

  it("has no duplicate guide ids", () => {
    const ids = guidesData.map((g) => g.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("blog.json — nte-porsche-collaboration", () => {
  const porsche = blogData.find((b) => b.id === "nte-porsche-collaboration");

  it("exists in blog data", () => {
    expect(porsche).toBeDefined();
  });

  it("has required fields", () => {
    expect(porsche!.title).toBeTruthy();
    expect(porsche!.titleEn).toBeTruthy();
    expect(porsche!.summary).toBeTruthy();
    expect(porsche!.summaryEn).toBeTruthy();
    expect(porsche!.content).toBeTruthy();
    expect(porsche!.contentEn).toBeTruthy();
    expect(porsche!.category).toBe("news");
    expect(porsche!.categoryZh).toBe("新闻");
    expect(porsche!.categoryEn).toBe("News");
  });

  it("has bilingual content with sufficient length", () => {
    expect(porsche!.content.length).toBeGreaterThan(500);
    expect(porsche!.contentEn.length).toBeGreaterThan(500);
  });

  it("has relevant tags", () => {
    expect(porsche!.tags).toContain("porsche");
    expect(porsche!.tags).toContain("collaboration");
    expect(porsche!.tags).toContain("vehicle");
  });

  it("has internal links", () => {
    expect(porsche!.internalLinks.length).toBeGreaterThan(0);
  });

  it("has no duplicate blog ids", () => {
    const ids = blogData.map((b) => b.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
