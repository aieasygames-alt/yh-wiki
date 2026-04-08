import { MetadataRoute } from "next";
import { getAllCharacters, getAllMaterials } from "../lib/queries";

const BASE_URL = "https://yihuan.wiki";

export default function sitemap(): MetadataRoute.Sitemap {
  const characters = getAllCharacters();
  const materials = getAllMaterials();
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

  // Calculator
  langs.forEach((lang) => {
    routes.push({
      url: `${BASE_URL}/${lang}/calculator/leveling`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  return routes;
}
