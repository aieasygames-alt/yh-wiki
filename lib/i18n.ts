import zh from "../messages/zh.json";
import en from "../messages/en.json";
import tw from "../messages/tw.json";
import th from "../messages/th.json";
import vi from "../messages/vi.json";
import id from "../messages/id.json";
import ptBR from "../messages/pt-br.json";
import ja from "../messages/ja.json";
import ko from "../messages/ko.json";
import de from "../messages/de.json";
import fr from "../messages/fr.json";
import es from "../messages/es.json";
import ru from "../messages/ru.json";

export type Locale = "zh" | "tw" | "en" | "th" | "vi" | "id" | "pt-br" | "ja" | "ko" | "de" | "fr" | "es" | "ru";

export const LOCALES: readonly Locale[] = ["zh", "tw", "en", "th", "vi", "id", "pt-br", "ja", "ko", "de", "fr", "es", "ru"];

/** Map locale code to valid HTML lang attribute */
export function toHtmlLang(locale: string): string {
  const map: Record<string, string> = {
    zh: "zh",
    tw: "zh-Hant",
    en: "en",
    th: "th",
    vi: "vi",
    id: "id",
    "pt-br": "pt-BR",
    ja: "ja",
    ko: "ko",
    de: "de",
    fr: "fr",
    es: "es",
    ru: "ru",
  };
  return map[locale] || locale;
}

/** Map locale code to hreflang attribute */
function toHreflang(locale: string): string {
  const map: Record<string, string> = {
    zh: "zh",
    tw: "zh-Hant",
    en: "en",
    th: "th",
    vi: "vi",
    id: "id",
    "pt-br": "pt-BR",
    ja: "ja",
    ko: "ko",
    de: "de",
    fr: "fr",
    es: "es",
    ru: "ru",
  };
  return map[locale] || locale;
}

/** Human-readable language name in its own language (for language switcher) */
export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  zh: "中文",
  tw: "繁體中文",
  en: "English",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
  id: "Bahasa Indonesia",
  "pt-br": "Português (BR)",
  ja: "日本語",
  ko: "한국어",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  ru: "Русский",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function asLocale(value: string): Locale {
  return isLocale(value) ? value : "en";
}

const messages: Record<Locale, Record<string, unknown>> = { zh, tw, en, th, vi, id, "pt-br": ptBR, ja, ko, de, fr, es, ru };

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
  const urlWithSlash = `${pathWithoutLang}/`;
  return {
    canonical: `${BASE_URL}/${lang}/${urlWithSlash}`,
    languages: buildHreflangMap((locale) => `${BASE_URL}/${locale}/${urlWithSlash}`),
  };
}

/** Generate hreflang alternates for index page (no sub-path) */
export function hreflangAlternatesIndex(lang: string) {
  return {
    canonical: `${BASE_URL}/${lang}/`,
    languages: buildHreflangMap((locale) => `${BASE_URL}/${locale}/`),
  };
}
