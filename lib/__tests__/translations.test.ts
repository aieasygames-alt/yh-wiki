import { describe, it, expect } from "vitest";
import en from "../../messages/en.json";
import ja from "../../messages/ja.json";
import ko from "../../messages/ko.json";
import de from "../../messages/de.json";
import fr from "../../messages/fr.json";
import es from "../../messages/es.json";
import ru from "../../messages/ru.json";
import zh from "../../messages/zh.json";
import tw from "../../messages/tw.json";
import th from "../../messages/th.json";
import vi from "../../messages/vi.json";
import id from "../../messages/id.json";
import ptBR from "../../messages/pt-br.json";

const allMessages: Record<string, Record<string, unknown>> = {
  en, ja, ko, de, fr, es, ru, zh, tw, th, vi, id, "pt-br": ptBR,
};

/** Recursively collect all dot-separated key paths from a nested object */
function collectPaths(obj: Record<string, unknown>, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...collectPaths(value as Record<string, unknown>, fullKey));
    } else {
      paths.push(fullKey);
    }
  }
  return paths;
}

describe("Translation file integrity", () => {
  const enPaths = new Set(collectPaths(en));

  for (const [locale, messages] of Object.entries(allMessages)) {
    if (locale === "en") continue;

    describe(`${locale}.json`, () => {
      it("has the same top-level keys as en.json", () => {
        const enTopKeys = Object.keys(en).sort();
        const localeTopKeys = Object.keys(messages).sort();
        expect(localeTopKeys).toEqual(enTopKeys);
      });

      it("has no missing translation paths compared to en.json", () => {
        const localePaths = new Set(collectPaths(messages));
        const missing: string[] = [];
        for (const path of enPaths) {
          if (!localePaths.has(path)) {
            missing.push(path);
          }
        }
        // Allow up to 5 missing keys for now (translations may not be 100% complete)
        expect(missing.length).toBeLessThanOrEqual(5);
      });

      it("preserves {0} placeholders in strings that use them", () => {
        const enStrings = collectPaths(en)
          .map((p) => {
            const keys = p.split(".");
            let result: unknown = en;
            for (const k of keys) {
              if (typeof result === "object" && result !== null) {
                result = (result as Record<string, unknown>)[k];
              } else {
                return null;
              }
            }
            return typeof result === "string" ? { path: p, value: result } : null;
          })
          .filter(Boolean) as { path: string; value: string }[];

        const placeholderPaths = enStrings.filter((s) => s.value.includes("{0}"));
        for (const { path, value } of placeholderPaths) {
          const keys = path.split(".");
          let result: unknown = messages;
          for (const k of keys) {
            if (typeof result === "object" && result !== null) {
              result = (result as Record<string, unknown>)[k];
            } else {
              break;
            }
          }
          if (typeof result === "string") {
            // Count placeholders - should match
            const enCount = (value.match(/\{[0-9]+\}/g) || []).length;
            const localeCount = (result.match(/\{[0-9]+\}/g) || []).length;
            expect(localeCount).toBe(enCount);
          }
        }
      });
    });
  }
});
