"use client";

import { useEffect } from "react";
import type { Locale } from "../lib/i18n";

const BASE_URL = "https://nteguide.com";
const LANGUAGES: Locale[] = ["zh", "en"];

export function HreflangInjector({ lang }: { lang: string }) {
  useEffect(() => {
    const pathname = window.location.pathname;
    // Extract path without lang prefix: /zh/characters/nanally -> /characters/nanally
    const pathWithoutLang = pathname.replace(/^\/(zh|en)/, "") || "/";

    LANGUAGES.forEach((l) => {
      const href = `${BASE_URL}/${l}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
      const existing = document.querySelector(`link[hreflang="${l}"]`);
      if (existing) {
        existing.setAttribute("href", href);
      } else {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = l;
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Add x-default pointing to Chinese version
    const xDefaultHref = `${BASE_URL}/zh${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
    const existingXDefault = document.querySelector('link[hreflang="x-default"]');
    if (existingXDefault) {
      existingXDefault.setAttribute("href", xDefaultHref);
    } else {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = "x-default";
      link.href = xDefaultHref;
      document.head.appendChild(link);
    }
  }, [lang]);

  return null;
}
