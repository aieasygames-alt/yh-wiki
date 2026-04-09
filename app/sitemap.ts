import { MetadataRoute } from "next";
import { getAllCharacters, getAllMaterials, getAllFaqs, getAllWeapons } from "../lib/queries";

const BASE_URL = "https://nteguide.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const characters = getAllCharacters();
  const materials = getAllMaterials();
  const weapons = getAllWeapons();
  const faqs = getAllFaqs();
  const langs = ["zh", "en"];

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

  return routes;
}
