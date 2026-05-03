import zh from "../messages/zh.json";
import en from "../messages/en.json";
import tw from "../messages/tw.json";

export type Locale = "zh" | "tw" | "en";

export const LOCALES: readonly Locale[] = ["zh", "tw", "en"];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function asLocale(value: string): Locale {
  return isLocale(value) ? value : "zh";
}

const messages: Record<Locale, Record<string, unknown>> = { zh, tw, en };

export function getMessages(locale: string) {
  const loc = asLocale(locale);
  return messages[loc] || messages.zh;
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

/** Generate hreflang alternates for a given path (without leading /) */
export function hreflangAlternates(pathWithoutLang: string, lang: string) {
  const urlWithSlash = `${pathWithoutLang}/`;
  return {
    canonical: `${BASE_URL}/${lang}/${urlWithSlash}`,
    languages: {
      "zh": `${BASE_URL}/zh/${urlWithSlash}`,
      "zh-Hant": `${BASE_URL}/tw/${urlWithSlash}`,
      "en": `${BASE_URL}/en/${urlWithSlash}`,
      "x-default": `${BASE_URL}/zh/${urlWithSlash}`,
    },
  };
}

/** Generate hreflang alternates for index page (no sub-path) */
export function hreflangAlternatesIndex(lang: string) {
  return {
    canonical: `${BASE_URL}/${lang}/`,
    languages: {
      "zh": `${BASE_URL}/zh/`,
      "zh-Hant": `${BASE_URL}/tw/`,
      "en": `${BASE_URL}/en/`,
      "x-default": `${BASE_URL}/zh/`,
    },
  };
}
