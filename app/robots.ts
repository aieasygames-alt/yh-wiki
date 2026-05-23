import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // AI crawlers — explicit allow for GEO discoverability
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: "https://nteguide.com/sitemap.xml",
  };
}
