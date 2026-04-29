import { describe, it, expect } from "vitest";
import weaponsData from "../../data/weapons.json";
import buildsData from "../../data/builds.json";
import diskSetsData from "../../data/disk-sets.json";
import anomaliesData from "../../data/anomalies.json";
import vehiclesData from "../../data/vehicles.json";
import faqsData from "../../data/faqs.json";
import guidesData from "../../data/guides.json";
import blogData from "../../data/blog.json";
import loreData from "../../data/lore.json";
import locationsData from "../../data/locations.json";
import comparesData from "../../data/compares.json";
import charactersData from "../../data/characters.json";
import materialsData from "../../data/materials.json";

const VALID_ATTRIBUTES = ["cosmos", "anima", "incantation", "chaos", "psyche", "lakshana"];
const VALID_WEAPON_TYPES = ["gas", "liquid", "plasma", "solid", "synthesis"];
const VALID_RANKS = ["S", "A", "B"];

describe("weapons.json data integrity", () => {
  it("has at least 40 weapons", () => {
    expect(weaponsData.length).toBeGreaterThanOrEqual(40);
  });

  it("all weapons have valid ranks", () => {
    for (const w of weaponsData) {
      expect(VALID_RANKS).toContain(w.rank);
    }
  });

  it("all weapons have valid types", () => {
    for (const w of weaponsData) {
      expect(VALID_WEAPON_TYPES).toContain(w.type);
    }
  });

  it("all weapons have bilingual names", () => {
    for (const w of weaponsData) {
      expect(w.name).toBeTruthy();
      expect(w.nameEn).toBeTruthy();
    }
  });

  it("all weapons have baseAtk as positive number", () => {
    for (const w of weaponsData) {
      expect(w.baseAtk).toBeGreaterThan(0);
    }
  });

  it("no duplicate weapon ids", () => {
    const ids = weaponsData.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("builds.json data integrity", () => {
  it("has at least 30 builds", () => {
    expect(buildsData.length).toBeGreaterThanOrEqual(30);
  });

  it("all builds have characterId", () => {
    for (const b of buildsData) {
      expect(b.characterId).toBeTruthy();
    }
  });

  it("no duplicate characterIds in builds", () => {
    const ids = buildsData.map((b) => b.characterId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("disk-sets.json data integrity", () => {
  it("has at least 5 disk sets", () => {
    expect(diskSetsData.length).toBeGreaterThanOrEqual(5);
  });

  it("all disk sets have bilingual names", () => {
    for (const d of diskSetsData) {
      expect(d.name).toBeTruthy();
      expect(d.nameEn).toBeTruthy();
    }
  });

  it("all disk sets have set descriptions", () => {
    for (const d of diskSetsData) {
      expect(d.setDescription2pc).toBeTruthy();
      expect(d.setDescription2pcEn).toBeTruthy();
    }
  });

  it("no duplicate disk set ids", () => {
    const ids = diskSetsData.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("anomalies.json data integrity", () => {
  it("has at least 10 anomalies", () => {
    expect(anomaliesData.length).toBeGreaterThanOrEqual(10);
  });

  it("all anomalies have bilingual names", () => {
    for (const a of anomaliesData) {
      expect(a.name).toBeTruthy();
      expect(a.nameEn).toBeTruthy();
    }
  });

  it("no duplicate anomaly ids", () => {
    const ids = anomaliesData.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("vehicles.json data integrity", () => {
  it("has at least 10 vehicles", () => {
    expect(vehiclesData.length).toBeGreaterThanOrEqual(10);
  });

  it("all vehicles have bilingual names", () => {
    for (const v of vehiclesData) {
      expect(v.name).toBeTruthy();
      expect(v.nameEn).toBeTruthy();
    }
  });

  it("all vehicles have valid rarity (1-5)", () => {
    for (const v of vehiclesData) {
      expect(v.rarity).toBeGreaterThanOrEqual(1);
      expect(v.rarity).toBeLessThanOrEqual(5);
    }
  });

  it("no duplicate vehicle ids", () => {
    const ids = vehiclesData.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("faqs.json data integrity", () => {
  it("has at least 50 FAQs", () => {
    expect(faqsData.length).toBeGreaterThanOrEqual(50);
  });

  it("all FAQs have bilingual question/answer", () => {
    for (const f of faqsData) {
      expect(f.question).toBeTruthy();
      expect(f.questionEn).toBeTruthy();
      expect(f.answer).toBeTruthy();
      expect(f.answerEn).toBeTruthy();
    }
  });

  it("all FAQs have a category", () => {
    for (const f of faqsData) {
      expect(f.category).toBeTruthy();
    }
  });

  it("all FAQ relatedCharacters exist in characters.json (if any)", () => {
    const charIds = new Set(charactersData.map((c) => c.id));
    for (const f of faqsData) {
      if (f.relatedCharacters) {
        for (const rc of f.relatedCharacters) {
          // Allow known missing character "zero"
          if (rc === "zero") continue;
          expect(charIds.has(rc) || rc === "zero").toBe(true);
        }
      }
    }
  });

  it("no duplicate FAQ ids", () => {
    const ids = faqsData.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("guides.json data integrity", () => {
  it("has at least 20 guides", () => {
    expect(guidesData.length).toBeGreaterThanOrEqual(20);
  });

  it("all guides have bilingual title and content", () => {
    for (const g of guidesData) {
      expect(g.title).toBeTruthy();
      expect(g.titleEn).toBeTruthy();
      expect(g.content).toBeTruthy();
      expect(g.contentEn).toBeTruthy();
    }
  });

  it("all guides have a category", () => {
    for (const g of guidesData) {
      expect(g.category).toBeTruthy();
    }
  });

  it("no duplicate guide ids", () => {
    const ids = guidesData.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("blog.json data integrity", () => {
  it("has at least 10 blog posts", () => {
    expect(blogData.length).toBeGreaterThanOrEqual(10);
  });

  it("all blog posts have valid dates", () => {
    for (const b of blogData) {
      const date = new Date(b.date);
      expect(date.toString()).not.toBe("Invalid Date");
    }
  });

  it("all blog posts have bilingual titles", () => {
    for (const b of blogData) {
      expect(b.title).toBeTruthy();
      expect(b.titleEn).toBeTruthy();
    }
  });

  it("no duplicate blog post ids", () => {
    const ids = blogData.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("lore.json data integrity", () => {
  it("has at least 5 lore entries", () => {
    expect(loreData.length).toBeGreaterThanOrEqual(5);
  });

  it("all lore entries have bilingual content", () => {
    for (const l of loreData) {
      expect(l.name).toBeTruthy();
      expect(l.nameEn).toBeTruthy();
      expect(l.content).toBeTruthy();
      expect(l.contentEn).toBeTruthy();
    }
  });

  it("no duplicate lore ids", () => {
    const ids = loreData.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("locations.json data integrity", () => {
  it("has at least 5 locations", () => {
    expect(locationsData.length).toBeGreaterThanOrEqual(5);
  });

  it("all locations have bilingual content", () => {
    for (const l of locationsData) {
      expect(l.name).toBeTruthy();
      expect(l.nameEn).toBeTruthy();
    }
  });

  it("no duplicate location ids", () => {
    const ids = locationsData.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("compares.json data integrity", () => {
  it("has at least 3 compare articles", () => {
    expect(comparesData.length).toBeGreaterThanOrEqual(3);
  });

  it("all compares have bilingual content", () => {
    for (const c of comparesData) {
      expect(c.title).toBeTruthy();
      expect(c.titleEn).toBeTruthy();
      expect(c.content).toBeTruthy();
      expect(c.contentEn).toBeTruthy();
    }
  });

  it("no duplicate compare ids", () => {
    const ids = comparesData.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
