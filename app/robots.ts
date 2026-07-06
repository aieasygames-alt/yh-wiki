import { MetadataRoute } from "next";

const UNSUPPORTED_LANGUAGE_PREFIXES = [
  "/es/",
  "/de/",
  "/fr/",
  "/ko/",
  "/ja/",
  "/ru/",
  "/th/",
  "/vi/",
  "/id/",
  "/pt-br/",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", ...UNSUPPORTED_LANGUAGE_PREFIXES];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // AI crawlers — explicit allow for GEO discoverability
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow,
      },
    ],
    sitemap: "https://nteguide.com/sitemap.xml",
  };
}
