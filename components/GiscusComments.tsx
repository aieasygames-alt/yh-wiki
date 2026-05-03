"use client";

import Giscus from "@giscus/react";
import type { Locale } from "../lib/i18n";

const GISCUS_REPO = "aieasygames-alt/nteguide-comments" as const;
const GISCUS_REPO_ID = "R_kgDOSP6OgA" as const;
const GISCUS_CATEGORY = "Comments" as const;
const GISCUS_CATEGORY_ID = "DIC_kwDOSP6OgM4C792w" as const;

const LANG_MAP: Record<Locale, string> = {
  zh: "zh-CN",
  tw: "zh-TW",
  en: "en",
  th: "th",
  vi: "vi",
  id: "id",
  "pt-br": "pt-BR",
};

interface GiscusCommentsProps {
  locale: Locale;
  /**
   * Unique identifier for the discussion.
   * - Character pages: "character-{slug}"
   * - Guide pages: "guide-{slug}"
   * - Blog pages: "blog-{slug}"
   * - Tier list: "tier-list"
   * - Homepage: "general"
   */
  term: string;
}

export function GiscusComments({ locale, term }: GiscusCommentsProps) {
  return (
    <section className="mt-8 mb-4">
      <Giscus
        repo={GISCUS_REPO}
        repoId={GISCUS_REPO_ID}
        category={GISCUS_CATEGORY}
        categoryId={GISCUS_CATEGORY_ID}
        mapping="specific"
        term={term}
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark_dimmed"
        lang={LANG_MAP[locale]}
        loading="lazy"
      />
    </section>
  );
}
