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
