import zh from "../messages/zh.json";
import en from "../messages/en.json";
import tw from "../messages/tw.json";

export type Locale = "zh" | "tw" | "en";

const messages: Record<Locale, Record<string, any>> = { zh, tw, en };

export function getMessages(locale: Locale) {
  return messages[locale] || messages.zh;
}

/** Check if locale is a Chinese variant (zh or tw) */
export function isZhLocale(locale: Locale): boolean {
  return locale === "zh" || locale === "tw";
}

export function t(locale: Locale, path: string, ...args: string[]): string {
  const keys = path.split(".");
  let result: any = messages[locale] || messages.zh;
  for (const key of keys) {
    result = result?.[key];
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
