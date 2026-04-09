import zh from "../messages/zh.json";
import en from "../messages/en.json";

export type Locale = "zh" | "en";

const messages: Record<Locale, Record<string, any>> = { zh, en };

export function getMessages(locale: Locale) {
  return messages[locale] || messages.zh;
}

export function t(locale: Locale, path: string): string {
  const keys = path.split(".");
  let result: any = messages[locale] || messages.zh;
  for (const key of keys) {
    result = result?.[key];
  }
  return typeof result === "string" ? result : path;
}

const BASE_URL = "https://nteguide.com";

/** Generate hreflang alternates for a given path (without leading /) */
export function hreflangAlternates(pathWithoutLang: string) {
  return {
    canonical: `${BASE_URL}/zh/${pathWithoutLang}`,
    languages: {
      "zh": `${BASE_URL}/zh/${pathWithoutLang}`,
      "en": `${BASE_URL}/en/${pathWithoutLang}`,
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
    },
  };
}
