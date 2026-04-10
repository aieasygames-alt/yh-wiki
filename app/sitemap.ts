import { MetadataRoute } from "next";
import { getAllCharacters, getAllMaterials, getAllFaqs, getAllWeapons, getAllGuides, getAllLore, getAllLocations, getAllBlogPosts } from "../lib/queries";

const BASE_URL = "https://nteguide.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const characters = getAllCharacters();
  const materials = getAllMaterials();
  const weapons = getAllWeapons();
  const faqs = getAllFaqs();
  const guides = getAllGuides();
  const loreItems = getAllLore();
  const locationItems = getAllLocations();
  const langs = ["zh", "en"];
  const blogPosts = getAllBlogPosts();

  const routes: MetadataRoute.Sitemap = [];

  // Homepage
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  // Character list pages
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/characters`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Character detail pages
  characters.forEach((c) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/characters/${c.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  // Weapon list pages
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/weapons`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Weapon detail pages
  weapons.forEach((w) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/weapons/${w.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  // Material list pages
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/materials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Material detail pages
  materials.forEach((m) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/materials/${m.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  });

  // Calculators
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/calculator/leveling`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
    routes.push({
      url: `${BASE_URL}/${lang}/calculator/build`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  // Gacha simulator
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/gacha`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Redeem Codes
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/redeem-codes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });

  // Map
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // FAQ
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });
  faqs.forEach((f) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/faq/${f.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  // Guides
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });
  guides.forEach((g) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/guides/${g.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  // Lore
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/lore`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });
  loreItems.forEach((l) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/lore/${l.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  // Locations
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/locations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });
  locationItems.forEach((l) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/locations/${l.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  // Tags (common tags from all content)
  const commonTags = [
    "s-class", "a-class", "cosmos", "anima", "incantation", "chaos", "psyche", "lakshana",
    "dps", "support", "beginner", "combat", "exploration", "advanced",
  ];
  commonTags.forEach((tag) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/tags/${tag}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    });
  });

  // Blog
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  });
  blogPosts.forEach((p) => {
    langs.forEach((lang) => {
      routes.push({
        url: `${BASE_URL}/${lang}/blog/${p.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  return routes;
}
