import { describe, it, expect } from "vitest";
import {
  LOCALES,
  isLocale,
  asLocale,
  isZhLocale,
  toHtmlLang,
  t,
  getMessages,
  LOCALE_NATIVE_NAME,
  hreflangAlternates,
  hreflangAlternatesIndex,
} from "../i18n";

describe("LOCALES", () => {
  it("contains exactly 3 locales", () => {
    expect(LOCALES).toHaveLength(3);
  });

  it("includes all required locales", () => {
    for (const loc of ["zh", "tw", "en"]) {
      expect(LOCALES).toContain(loc);
    }
  });
});

describe("isLocale", () => {
  it("returns true for all valid locales", () => {
    for (const loc of LOCALES) {
      expect(isLocale(loc)).toBe(true);
    }
  });

  it("returns false for invalid strings", () => {
    expect(isLocale("xx")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale("JA")).toBe(false);
    expect(isLocale("zh-CN")).toBe(false);
  });

  it("returns false for removed locales", () => {
    expect(isLocale("de")).toBe(false);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("es")).toBe(false);
    expect(isLocale("ru")).toBe(false);
    expect(isLocale("pt-br")).toBe(false);
    expect(isLocale("ja")).toBe(false);
    expect(isLocale("ko")).toBe(false);
    expect(isLocale("th")).toBe(false);
    expect(isLocale("vi")).toBe(false);
    expect(isLocale("id")).toBe(false);
  });
});

describe("asLocale", () => {
  it("returns the locale for valid input", () => {
    expect(asLocale("en")).toBe("en");
    expect(asLocale("zh")).toBe("zh");
    expect(asLocale("tw")).toBe("tw");
  });

  it("falls back to en for invalid input", () => {
    expect(asLocale("invalid")).toBe("en");
    expect(asLocale("")).toBe("en");
  });

  it("falls back to en for removed locales", () => {
    expect(asLocale("de")).toBe("en");
    expect(asLocale("fr")).toBe("en");
    expect(asLocale("pt-br")).toBe("en");
    expect(asLocale("ja")).toBe("en");
    expect(asLocale("ko")).toBe("en");
  });
});

describe("isZhLocale", () => {
  it("returns true for zh", () => {
    expect(isZhLocale("zh")).toBe(true);
  });

  it("returns true for tw", () => {
    expect(isZhLocale("tw")).toBe(true);
  });

  it("returns false for en", () => {
    expect(isZhLocale("en")).toBe(false);
  });

  it("returns false for removed locales", () => {
    expect(isZhLocale("ja")).toBe(false);
    expect(isZhLocale("ko")).toBe(false);
  });
});

describe("toHtmlLang", () => {
  it("maps tw to zh-Hant", () => {
    expect(toHtmlLang("tw")).toBe("zh-Hant");
  });

  it("maps zh to zh", () => {
    expect(toHtmlLang("zh")).toBe("zh");
  });

  it("maps en to en", () => {
    expect(toHtmlLang("en")).toBe("en");
  });

  it("passes through unknown locales as-is", () => {
    expect(toHtmlLang("ja")).toBe("ja");
    expect(toHtmlLang("ko")).toBe("ko");
  });
});

describe("LOCALE_NATIVE_NAME", () => {
  it("has a native name for every locale", () => {
    for (const loc of LOCALES) {
      expect(LOCALE_NATIVE_NAME[loc]).toBeTruthy();
    }
  });

  it("has correct native names", () => {
    expect(LOCALE_NATIVE_NAME.zh).toBe("中文");
    expect(LOCALE_NATIVE_NAME.tw).toBe("繁體中文");
    expect(LOCALE_NATIVE_NAME.en).toBe("English");
  });
});

describe("t() translation function", () => {
  it("returns translated string for valid path", () => {
    const result = t("zh", "site.title");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns path as fallback for invalid path", () => {
    expect(t("zh", "nonexistent.path")).toBe("nonexistent.path");
  });

  it("returns path as fallback for deeply invalid path", () => {
    expect(t("zh", "a.b.c.d")).toBe("a.b.c.d");
  });

  it("returns en translation for en locale", () => {
    const result = t("en", "site.title");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns translations for all locales", () => {
    for (const loc of LOCALES) {
      const result = t(loc, "site.nav.home");
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it("returns compare.nteVsAnanta for all locales", () => {
    for (const loc of LOCALES) {
      const result = t(loc, "compare.nteVsAnanta");
      expect(result).toBeTruthy();
      expect(result).not.toBe("compare.nteVsAnanta");
    }
  });
});

describe("hreflangAlternates", () => {
  it("generates correct canonical URL", () => {
    const result = hreflangAlternates("characters/test", "zh");
    expect(result.canonical).toBe("https://nteguide.com/zh/characters/test/");
  });

  it("generates 3 language alternates plus x-default", () => {
    const result = hreflangAlternates("characters/test", "zh");
    const langKeys = Object.keys(result.languages).filter((k) => k !== "x-default");
    expect(langKeys).toHaveLength(3);
  });

  it("includes all active locales in languages map", () => {
    const result = hreflangAlternates("guides", "en");
    expect(result.languages.zh).toBe("https://nteguide.com/zh/guides/");
    expect(result.languages["zh-Hant"]).toBe("https://nteguide.com/tw/guides/");
    expect(result.languages.en).toBe("https://nteguide.com/en/guides/");
  });

  it("generates correct zh URL", () => {
    const result = hreflangAlternates("weapons/sword", "en");
    expect(result.languages.zh).toBe("https://nteguide.com/zh/weapons/sword/");
  });

  it("generates correct tw URL with zh-Hant", () => {
    const result = hreflangAlternates("faq", "zh");
    expect(result.languages["zh-Hant"]).toBe("https://nteguide.com/tw/faq/");
  });

  it("generates correct en URL", () => {
    const result = hreflangAlternates("guides", "zh");
    expect(result.languages.en).toBe("https://nteguide.com/en/guides/");
  });

  it("x-default points to en", () => {
    const result = hreflangAlternates("test", "en");
    expect(result.languages["x-default"]).toBe("https://nteguide.com/en/test/");
  });
});

describe("hreflangAlternatesIndex", () => {
  it("generates correct canonical for index page", () => {
    const result = hreflangAlternatesIndex("zh");
    expect(result.canonical).toBe("https://nteguide.com/zh/");
  });

  it("generates all language alternates for index", () => {
    const result = hreflangAlternatesIndex("en");
    expect(result.languages.zh).toBe("https://nteguide.com/zh/");
    expect(result.languages["zh-Hant"]).toBe("https://nteguide.com/tw/");
    expect(result.languages.en).toBe("https://nteguide.com/en/");
  });
});

describe("getMessages", () => {
  it("returns messages for zh locale", () => {
    const msgs = getMessages("zh");
    expect(msgs).toBeDefined();
    expect(typeof msgs).toBe("object");
  });

  it("returns messages for en locale", () => {
    const msgs = getMessages("en");
    expect(msgs).toBeDefined();
  });

  it("returns messages for all locales", () => {
    for (const loc of LOCALES) {
      const msgs = getMessages(loc);
      expect(msgs).toBeDefined();
      expect(msgs.site).toBeTruthy();
    }
  });

  it("falls back to en for unknown locale", () => {
    const msgs = getMessages("xyz" as "en");
    expect(msgs).toBeDefined();
  });
});
