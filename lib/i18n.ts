import zh from "../messages/zh.json";
import en from "../messages/en.json";

export type Locale = "zh" | "en";

const messages: Record<Locale, Record<string, any>> = { zh, en };

export function getMessages(locale: Locale) {
  return messages[locale] || messages.zh;
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
  return {
    canonical: `${BASE_URL}/${lang}/${pathWithoutLang}`,
    languages: {
      "zh": `${BASE_URL}/zh/${pathWithoutLang}`,
      "en": `${BASE_URL}/en/${pathWithoutLang}`,
      "x-default": `${BASE_URL}/zh/${pathWithoutLang}`,
    },
  };
}

/** Generate hreflang alternates for index page (no sub-path) */
export function hreflangAlternatesIndex(lang: string) {
  return {
    canonical: `${BASE_URL}/${lang}`,
    languages: {
      "zh": `${BASE_URL}/zh`,
      "en": `${BASE_URL}/en`,
      "x-default": `${BASE_URL}/zh`,
    },
  };
}
