import zh from "../messages/zh.json";
import en from "../messages/en.json";
import tw from "../messages/tw.json";

export type Locale = "zh" | "tw" | "en";

export const LOCALES: readonly Locale[] = ["zh", "tw", "en"];

/** Map locale code to valid HTML lang attribute */
export function toHtmlLang(locale: string): string {
  const map: Record<string, string> = {
    zh: "zh",
    tw: "zh-Hant",
    en: "en",
  };
  return map[locale] || locale;
}

/** Map locale code to hreflang attribute */
function toHreflang(locale: string): string {
  const map: Record<string, string> = {
    zh: "zh",
    tw: "zh-Hant",
    en: "en",
  };
  return map[locale] || locale;
}

/** Human-readable language name in its own language (for language switcher) */
export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  zh: "中文",
  tw: "繁體中文",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function asLocale(value: string): Locale {
  return isLocale(value) ? value : "en";
}

const messages: Record<Locale, Record<string, unknown>> = { zh, tw, en };

export function getMessages(locale: string) {
  const loc = asLocale(locale);
  return messages[loc] || messages.en;
}

/** Check if locale is a Chinese variant (zh or tw) */
export function isZhLocale(locale: string): boolean {
  const loc = asLocale(locale);
  return loc === "zh" || loc === "tw";
}

export function t(locale: string, path: string, ...args: string[]): string {
  const loc = asLocale(locale);
  const keys = path.split(".");
  let result: Record<string, unknown> | string | undefined = messages[loc] || messages.zh;
  for (const key of keys) {
    if (typeof result === "string") return path;
    result = result?.[key] as Record<string, unknown> | string | undefined;
  }
  if (typeof result !== "string") return path;
  if (args.length > 0) {
    return args.reduce((str, arg, i) => str.replace(`{${i}}`, arg), result);
  }
  return result;
}

const BASE_URL = "https://nteguide.com";

/** Build hreflang languages map dynamically from all locales */
function buildHreflangMap(pathFn: (locale: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[toHreflang(locale)] = pathFn(locale);
  }
  languages["x-default"] = pathFn("en");
  return languages;
}

/** Generate hreflang alternates for a given path (without leading /) */
export function hreflangAlternates(pathWithoutLang: string, lang: string) {
  const cleanPath = pathWithoutLang.replace(/^\/+|\/+$/g, "");
  const urlWithSlash = cleanPath ? `${cleanPath}/` : "";
  const locale = asLocale(lang);
  return {
    canonical: `${BASE_URL}/${locale}/${urlWithSlash}`,
    languages: buildHreflangMap((l) => `${BASE_URL}/${l}/${urlWithSlash}`),
  };
}

/** Generate hreflang alternates for index page (no sub-path) */
export function hreflangAlternatesIndex(lang: string) {
  const locale = asLocale(lang);
  return {
    canonical: `${BASE_URL}/${locale}/`,
    languages: buildHreflangMap((l) => `${BASE_URL}/${l}/`),
  };
}
