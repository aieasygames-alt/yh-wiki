const fs = require('fs');
const path = require('path');

const faqsPath = path.join(__dirname, '..', 'data', 'faqs.json');
const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));

// Map FAQ IDs to related characters and materials based on content
const faqRelations = {
  "how-to-level-up-fast": { rc: [], rm: ["basic-hunter-guide", "advanced-hunter-guide", "elite-hunter-guide"] },
  "material-domains-location": { rc: [], rm: ["basic-hunter-guide", "advanced-hunter-guide", "permit"] },
  "how-to-get-credits": { rc: [], rm: ["credit-point"] },
  "attribute-weakness": { rc: ["nanally", "baicang", "daffodil", "skia"], rm: [] },
  "stamina-management": { rc: [], rm: ["stamina-potion"] },
  "how-to-get-exp-fast": { rc: [], rm: ["basic-hunter-guide", "exp-book"] },
  "test-vs-official": { rc: [], rm: [] },
  "skill-upgrade-materials": { rc: [], rm: ["skill-book", "permit", "anima-shard"] },
  "permit-materials": { rc: [], rm: ["permit", "anima-shard", "blaze-shard"] },
  "resin-stamina-system": { rc: [], rm: ["stamina-potion"] },
  "how-to-reroll": { rc: ["nanally", "jiuyuan", "hotori", "baicang"], rm: [] },
  "best-starter-characters": { rc: ["nanally", "jiuyuan", "hotori", "xiaozhi"], rm: [] },
  "character-tier-list": { rc: ["nanally", "jiuyuan", "hotori", "baicang", "daffodil", "xiaozhi"], rm: [] },
  "free-characters": { rc: ["xiaozhi", "haniel", "zero"], rm: [] },
  "beginner-guide": { rc: ["nanally", "jiuyuan", "xiaozhi"], rm: [] },
  "how-to-unlock-co-op": { rc: [], rm: [] },
  "daily-tasks": { rc: [], rm: ["credit-point", "stamina-potion"] },
  "best-weapons-beginner": { rc: ["nanally", "zero", "xiaozhi"], rm: [] },
  "how-to-join-faction": { rc: [], rm: [] },
  "pvp-system": { rc: [], rm: [] },
  "best-teams-beginner": { rc: ["nanally", "jiuyuan", "hotori", "xiaozhi", "haniel"], rm: [] },
  "elemental-reactions": { rc: ["nanally", "baicang", "daffodil", "skia"], rm: [] },
  "how-to-get-s-rank": { rc: ["nanally", "jiuyuan", "hotori", "baicang"], rm: ["gacha-ticket"] },
  "gacha-pity-system": { rc: [], rm: ["gacha-ticket", "stellar-jade"] },
  "best-disk-sets": { rc: ["nanally", "baicang", "hotori"], rm: ["disk-set"] },
  "arc-disc-guide": { rc: ["nanally", "baicang", "xiaozhi"], rm: ["arc-disc"] },
  "city-tycoon": { rc: ["xiaozhi"], rm: [] },
  "stamina-planning": { rc: [], rm: ["stamina-potion", "basic-hunter-guide", "permit"] },
  "starter-selector": { rc: ["jiuyuan", "hotori", "baicang", "nanally"], rm: [] },
  "free-pulls-470": { rc: [], rm: ["gacha-ticket"] },
  "ring-fusion": { rc: ["nanally", "jiuyuan", "hotori"], rm: [] },
  "f2p-day-one": { rc: ["xiaozhi", "haniel", "jiuyuan"], rm: ["gacha-ticket"] },
  "ue57-engine": { rc: [], rm: [] },
  "character-build-priority": { rc: ["nanally", "jiuyuan", "hotori", "baicang", "xiaozhi"], rm: [] },
  "genesis-team": { rc: ["nanally", "jiuyuan", "hotori"], rm: [] },
  "turbid-burn-team": { rc: ["baicang", "daffodil", "hotori", "adler"], rm: [] },
  "f2p-team": { rc: ["xiaozhi", "haniel", "jiuyuan", "hathor"], rm: [] },
  "blaze-team": { rc: ["baicang", "daffodil", "akane"], rm: [] },
  "best-launch-teams": { rc: ["nanally", "jiuyuan", "hotori", "baicang", "daffodil", "xiaozhi"], rm: [] },
  "disk-upgrade": { rc: [], rm: ["disk-set", "disk-exp"] },
  "weapon-upgrade": { rc: [], rm: ["weapon-material"] },
  "best-disk-per-role": { rc: ["nanally", "baicang", "hotori", "jiuyuan"], rm: ["disk-set"] },
  "mobile-controller": { rc: [], rm: [] },
  "graphics-optimization": { rc: [], rm: [] },
  "android-specs": { rc: [], rm: [] },
  "ios-specs": { rc: [], rm: [] },
  "storage-management": { rc: [], rm: [] },
  "cross-platform-sync": { rc: [], rm: [] },
  "harmonyos-support": { rc: [], rm: [] },
  "battery-drain": { rc: [], rm: [] },
};

let updated = 0;
for (const faq of faqs) {
  const rel = faqRelations[faq.id];
  if (!rel) continue;
  
  let changed = false;
  if (rel.rc.length > 0 && (!faq.relatedCharacters || faq.relatedCharacters.length === 0)) {
    faq.relatedCharacters = rel.rc;
    changed = true;
  }
  if (rel.rm.length > 0 && (!faq.relatedMaterials || faq.relatedMaterials.length === 0)) {
    faq.relatedMaterials = rel.rm;
    changed = true;
  }
  if (changed) updated++;
}

fs.writeFileSync(faqsPath, JSON.stringify(faqs, null, 2));
console.log(`Updated ${updated} FAQs with relation data`);

// Check remaining
const stillMissing = faqs.filter(f => !f.relatedCharacters || f.relatedCharacters.length === 0);
console.log(`Remaining without relatedCharacters: ${stillMissing.length}`);
