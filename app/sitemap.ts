import { MetadataRoute } from "next";
import { getAllCharacters, getAllMaterials, getAllFaqs, getAllWeapons, getAllGuides, getAllLore, getAllLocations, getAllBlogPosts, getAllCompares } from "../lib/queries";

const BASE_URL = "https://nteguide.com";
const langs = ["zh", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const characters = getAllCharacters();
  const materials = getAllMaterials();
  const weapons = getAllWeapons();
  const faqs = getAllFaqs();
  const guides = getAllGuides();
  const loreItems = getAllLore();
  const locationItems = getAllLocations();
  const blogPosts = getAllBlogPosts();
  const compares = getAllCompares();

  const commonTags = [
    "s-class", "a-class", "cosmos", "anima", "incantation", "chaos", "psyche", "lakshana",
    "dps", "support", "beginner", "combat", "exploration", "advanced",
  ];

  const toolPages = ["calculator/leveling", "calculator/build", "gacha", "redeem-codes", "map"];
  const categoryPages = ["characters", "weapons", "materials", "guides", "faq", "lore", "locations", "blog"];

  const routes: MetadataRoute.Sitemap = [];

  // Homepage
  langs.forEach((lang) => {
    routes.push({ url: `${BASE_URL}/${lang}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 });
  });

  // Category list pages
  categoryPages.forEach((p) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/${p}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
    });
  });

  // Tool pages
  toolPages.forEach((p) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/${p}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 });
    });
  });

  // Detail pages
  characters.forEach((c) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/characters/${c.id}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 });
    });
  });

  weapons.forEach((w) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/weapons/${w.id}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 });
    });
  });

  materials.forEach((m) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/materials/${m.id}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 });
    });
  });

  faqs.forEach((f) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/faq/${f.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 });
    });
  });

  guides.forEach((g) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/guides/${g.id}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
    });
  });

  loreItems.forEach((l) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/lore/${l.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    });
  });

  locationItems.forEach((l) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/locations/${l.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    });
  });

  blogPosts.forEach((p) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/blog/${p.id}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
    });
  });

  compares.forEach((c) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/compare/${c.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 });
    });
  });

  commonTags.forEach((tag) => {
    langs.forEach((lang) => {
      routes.push({ url: `${BASE_URL}/${lang}/tags/${tag}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 });
    });
  });

  return routes;
}
