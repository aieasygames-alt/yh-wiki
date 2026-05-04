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

const NEW_LOCALES = ["ja", "ko", "de", "fr", "es", "ru"];

describe("LOCALES", () => {
  it("contains exactly 13 locales", () => {
    expect(LOCALES).toHaveLength(13);
  });

  it("includes all original 7 locales", () => {
    for (const loc of ["zh", "tw", "en", "th", "vi", "id", "pt-br"]) {
      expect(LOCALES).toContain(loc);
    }
  });

  it("includes all 6 new locales", () => {
    for (const loc of NEW_LOCALES) {
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
});

describe("asLocale", () => {
  it("returns the locale for valid input", () => {
    expect(asLocale("en")).toBe("en");
    expect(asLocale("ja")).toBe("ja");
    expect(asLocale("ko")).toBe("ko");
    expect(asLocale("pt-br")).toBe("pt-br");
  });

  it("falls back to en for invalid input", () => {
    expect(asLocale("invalid")).toBe("en");
    expect(asLocale("")).toBe("en");
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

  it("returns false for new locales", () => {
    for (const loc of NEW_LOCALES) {
      expect(isZhLocale(loc)).toBe(false);
    }
  });
});

describe("toHtmlLang", () => {
  it("maps tw to zh-Hant", () => {
    expect(toHtmlLang("tw")).toBe("zh-Hant");
  });

  it("maps pt-br to pt-BR", () => {
    expect(toHtmlLang("pt-br")).toBe("pt-BR");
  });

  it("maps new locales correctly", () => {
    expect(toHtmlLang("ja")).toBe("ja");
    expect(toHtmlLang("ko")).toBe("ko");
    expect(toHtmlLang("de")).toBe("de");
    expect(toHtmlLang("fr")).toBe("fr");
    expect(toHtmlLang("es")).toBe("es");
    expect(toHtmlLang("ru")).toBe("ru");
  });
});

describe("LOCALE_NATIVE_NAME", () => {
  it("has a native name for every locale", () => {
    for (const loc of LOCALES) {
      expect(LOCALE_NATIVE_NAME[loc]).toBeTruthy();
    }
  });

  it("has correct native names for new locales", () => {
    expect(LOCALE_NATIVE_NAME.ja).toBe("日本語");
    expect(LOCALE_NATIVE_NAME.ko).toBe("한국어");
    expect(LOCALE_NATIVE_NAME.de).toBe("Deutsch");
    expect(LOCALE_NATIVE_NAME.fr).toBe("Français");
    expect(LOCALE_NATIVE_NAME.es).toBe("Español");
    expect(LOCALE_NATIVE_NAME.ru).toBe("Русский");
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

  it("returns translations for all new locales", () => {
    for (const loc of NEW_LOCALES) {
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

  it("generates all 13 language alternates", () => {
    const result = hreflangAlternates("characters/test", "zh");
    const langKeys = Object.keys(result.languages).filter((k) => k !== "x-default");
    expect(langKeys).toHaveLength(13);
  });

  it("includes new locales in languages map", () => {
    const result = hreflangAlternates("guides", "en");
    expect(result.languages.ja).toBe("https://nteguide.com/ja/guides/");
    expect(result.languages.ko).toBe("https://nteguide.com/ko/guides/");
    expect(result.languages.de).toBe("https://nteguide.com/de/guides/");
    expect(result.languages.fr).toBe("https://nteguide.com/fr/guides/");
    expect(result.languages.es).toBe("https://nteguide.com/es/guides/");
    expect(result.languages.ru).toBe("https://nteguide.com/ru/guides/");
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
    expect(result.languages.ja).toBe("https://nteguide.com/ja/");
    expect(result.languages.ko).toBe("https://nteguide.com/ko/");
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

  it("returns messages for all new locales", () => {
    for (const loc of NEW_LOCALES) {
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
