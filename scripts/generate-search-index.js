const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const outFile = path.join(__dirname, "..", "public", "search-index.json");

const characters = JSON.parse(fs.readFileSync(path.join(dataDir, "characters.json"), "utf-8"));
const weapons = JSON.parse(fs.readFileSync(path.join(dataDir, "weapons.json"), "utf-8"));
const materials = JSON.parse(fs.readFileSync(path.join(dataDir, "materials.json"), "utf-8"));
const faqs = JSON.parse(fs.readFileSync(path.join(dataDir, "faqs.json"), "utf-8"));
const guides = JSON.parse(fs.readFileSync(path.join(dataDir, "guides.json"), "utf-8"));
const lore = JSON.parse(fs.readFileSync(path.join(dataDir, "lore.json"), "utf-8"));
const locations = JSON.parse(fs.readFileSync(path.join(dataDir, "locations.json"), "utf-8"));

const index = [];

function addEntry(id, nameZh, nameEn, type, urlPath, tags) {
  index.push({
    id,
    name: nameZh,
    nameEn,
    type,
    url: `/zh${urlPath}`,
    tags,
  });
  index.push({
    id,
    name: nameEn,
    nameEn,
    type,
    url: `/en${urlPath}`,
    tags,
  });
}

// characters → tags: [attribute, rank.toLowerCase(), role.toLowerCase()]
for (const c of characters) {
  addEntry(c.id, c.name, c.nameEn, "character", `/characters/${c.id}`, [
    c.attribute,
    c.rank.toLowerCase(),
    c.roleEn.toLowerCase(),
  ]);
}

// weapons → tags: [type.toLowerCase()]
for (const w of weapons) {
  addEntry(w.id, w.name, w.nameEn, "weapon", `/weapons/${w.id}`, [
    w.type.toLowerCase(),
  ]);
}

// materials → tags: [type.toLowerCase()]
for (const m of materials) {
  addEntry(m.id, m.name, m.nameEn, "material", `/materials/${m.id}`, [
    m.type.toLowerCase(),
  ]);
}

// faqs → tags from faq item
for (const f of faqs) {
  addEntry(f.id, f.question, f.questionEn, "faq", `/faq/${f.id}`, f.tags || []);
}

// guides → tags from guide item
for (const g of guides) {
  addEntry(g.id, g.title, g.titleEn, "guide", `/guides/${g.id}`, g.tags || []);
}

// lore → tags: [category.toLowerCase()]
for (const l of lore) {
  addEntry(l.id, l.name, l.nameEn, "lore", `/lore/${l.id}`, [
    l.category.toLowerCase(),
  ]);
}

// locations → tags: [category.toLowerCase()]
for (const loc of locations) {
  addEntry(loc.id, loc.name, loc.nameEn, "location", `/locations/${loc.id}`, [
    loc.category.toLowerCase(),
  ]);
}

fs.writeFileSync(outFile, JSON.stringify(index, null, 2), "utf-8");

console.log(`Generated search index: ${index.length} entries -> ${outFile}`);
