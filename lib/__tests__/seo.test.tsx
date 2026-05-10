import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  WebSiteJsonLd,
  CharacterJsonLd,
  ItemListJsonLd,
  BreadcrumbJsonLd,
  ArticleJsonLd,
  FaqPageJsonLd,
  OrganizationJsonLd,
  VideoGameJsonLd,
  ProductJsonLd,
  WebApplicationJsonLd,
} from "../../components/JsonLd";
import { hreflangAlternates, hreflangAlternatesIndex } from "../i18n";

// --- JSON-LD Schema Validation ---

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractJsonLd(container: HTMLElement): Record<string, any> {
  const script = container.querySelector('script[type="application/ld+json"]');
  if (!script || !script.textContent) return null as unknown as Record<string, any>;
  return JSON.parse(script.textContent);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

describe("WebSiteJsonLd", () => {
  it("generates valid WebSite schema", () => {
    const { container } = render(<WebSiteJsonLd />);
    const data = extractJsonLd(container);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("WebSite");
    expect(data.name).toBe("NTE Guide");
    expect(data.url).toBe("https://nteguide.com");
  });

  it("includes SearchAction", () => {
    const { container } = render(<WebSiteJsonLd />);
    const data = extractJsonLd(container);
    expect(data.potentialAction["@type"]).toBe("SearchAction");
    expect(data.potentialAction["query-input"]).toContain("search_term_string");
  });
});

describe("CharacterJsonLd", () => {
  const character = {
    name: "测试角色",
    nameEn: "Test Char",
    attribute: "cosmos",
    rank: "S",
    description: "这是一个角色",
    descriptionEn: "This is a character",
  };

  it("generates zh character schema", () => {
    const { container } = render(<CharacterJsonLd character={character} locale="zh" />);
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("ItemPage");
    expect(data.name).toBe("测试角色");
    expect(data.alternateName).toBe("Test Char");
    expect(data.mainEntity["@type"]).toBe("VideoGame");
    expect(data.mainEntity.name).toBe("Neverness to Everness");
  });

  it("generates en character schema", () => {
    const { container } = render(<CharacterJsonLd character={character} locale="en" />);
    const data = extractJsonLd(container);
    expect(data.name).toBe("Test Char");
    expect(data.description).toBe("This is a character");
  });
});

describe("FaqPageJsonLd", () => {
  const faqs = [
    { question: "What?", questionZh: "什么？", answer: "This.", answerZh: "这个。" },
    { question: "How?", questionZh: "怎么？", answer: "Like this.", answerZh: "这样。" },
  ];

  it("generates FAQPage schema with multiple questions", () => {
    const { container } = render(<FaqPageJsonLd faqs={faqs} lang="en" />);
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(2);
    expect(data.mainEntity[0]["@type"]).toBe("Question");
    expect(data.mainEntity[0].name).toBe("What?");
  });

  it("uses zh questions for zh locale", () => {
    const { container } = render(<FaqPageJsonLd faqs={faqs} lang="zh" />);
    const data = extractJsonLd(container);
    expect(data.mainEntity[0].name).toBe("什么？");
    expect(data.mainEntity[0].acceptedAnswer.text).toBe("这个。");
  });
});

describe("BreadcrumbJsonLd", () => {
  it("generates BreadcrumbList schema", () => {
    const { container } = render(
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://nteguide.com/zh/" },
        { name: "Characters", url: "https://nteguide.com/zh/characters" },
      ]} />
    );
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toHaveLength(2);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[0].name).toBe("Home");
  });
});

describe("ArticleJsonLd", () => {
  it("generates Article schema with publisher", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="Test description"
        url="https://nteguide.com/zh/blog/test"
        datePublished="2026-04-01"
      />
    );
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("Article");
    expect(data.headline).toBe("Test Article");
    expect(data.datePublished).toBe("2026-04-01");
    expect(data.publisher["@type"]).toBe("Organization");
  });
});

describe("OrganizationJsonLd", () => {
  it("generates Organization schema", () => {
    const { container } = render(<OrganizationJsonLd />);
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("Organization");
    expect(data.name).toBe("NTE Guide");
    expect(data.url).toBe("https://nteguide.com");
  });
});

describe("VideoGameJsonLd", () => {
  it("generates VideoGame schema", () => {
    const { container } = render(<VideoGameJsonLd />);
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("VideoGame");
    expect(data.name).toBe("Neverness to Everness");
    expect(data.gamePlatform).toBe("PC");
  });
});

describe("ProductJsonLd", () => {
  it("generates Product schema with offers", () => {
    const { container } = render(
      <ProductJsonLd name="NTE" description="Game" url="https://nteguide.com" />
    );
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("ItemPage");
    expect(data.name).toBe("NTE");
    expect(data.mainEntity["@type"]).toBe("Product");
    expect(data.mainEntity.name).toBe("NTE");
  });
});

describe("WebApplicationJsonLd", () => {
  it("generates WebApplication schema", () => {
    const { container } = render(
      <WebApplicationJsonLd name="Calculator" description="Leveling calc" />
    );
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("WebApplication");
    expect(data.name).toBe("Calculator");
    expect(data.operatingSystem).toBe("Web");
  });
});

describe("ItemListJsonLd", () => {
  it("generates ItemList schema with positions", () => {
    const items = [
      { name: "Item 1", url: "https://nteguide.com/1" },
      { name: "Item 2", url: "https://nteguide.com/2" },
    ];
    const { container } = render(<ItemListJsonLd items={items} />);
    const data = extractJsonLd(container);
    expect(data["@type"]).toBe("ItemList");
    expect(data.numberOfItems).toBe(2);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[1].position).toBe(2);
  });
});

// --- Hreflang Validation ---

describe("Hreflang URL validation", () => {
  it("all URLs use HTTPS", () => {
    const result = hreflangAlternates("characters/test", "zh");
    expect(result.canonical).toMatch(/^https:\/\//);
    Object.values(result.languages).forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });

  it("all URLs end with trailing slash", () => {
    const result = hreflangAlternates("characters/test", "zh");
    expect(result.canonical).toMatch(/\/$/);
    Object.values(result.languages).forEach((url) => {
      expect(url).toMatch(/\/$/);
    });
  });

  it("canonical matches the specified lang", () => {
    const zhResult = hreflangAlternates("test", "zh");
    expect(zhResult.canonical).toContain("/zh/");
    const enResult = hreflangAlternates("test", "en");
    expect(enResult.canonical).toContain("/en/");
  });

  it("index alternates have no double slashes", () => {
    const result = hreflangAlternatesIndex("zh");
    Object.values(result.languages).forEach((url) => {
      // Should not have double slashes after protocol
      const afterProtocol = url.replace("https://", "");
      expect(afterProtocol).not.toMatch(/\/\//);
    });
  });
});
