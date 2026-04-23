const fs = require('fs');
const path = require('path');

const faqsPath = path.join(__dirname, '..', 'data', 'faqs.json');
const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));

// Comprehensive FAQ-to-character/material mapping based on question content
const mappings = {
  // Combat mechanics
  "perfect-dodge-counter": { rc: ["zero", "daffodil", "xiaozhen"], rm: [] },
  "chain-burst": { rc: ["nanally", "jiuyuan", "hotori"], rm: [] },
  "combat-tips": { rc: ["nanally", "zero", "baicang"], rm: [] },
  "collapse-mechanic": { rc: ["adler", "daffodil"], rm: [] },
  "ring-fusion-mechanic": { rc: ["nanally", "jiuyuan", "hotori"], rm: [] },
  "six-attributes": { rc: ["nanally", "baicang", "skia", "daffodil"], rm: [] },
  
  // Exploration
  "hethereau-exploration": { rc: [], rm: ["crow-jade"] },
  "crow-jade": { rc: [], rm: ["crow-jade"] },
  "hidden-areas": { rc: [], rm: ["crow-jade"] },
  
  // Systems
  "awakening-system": { rc: ["hotori", "jiuyuan", "nanally"], rm: [] },
  "anomaly-commission": { rc: [], rm: ["permit"] },
  "disk-system": { rc: [], rm: ["disk-set"] },
  "weapon-upgrade": { rc: [], rm: ["weapon-material"] },
  "housing-system": { rc: [], rm: [] },
  "shop-auto-farm": { rc: [], rm: ["credit-point"] },
  "character-customization": { rc: [], rm: [] },
  "auto-battle": { rc: [], rm: [] },
  "vehicle-driving": { rc: ["jiuyuan"], rm: [] },
  
  // Gacha / monetization
  "pity-system": { rc: [], rm: ["gacha-ticket"] },
  "gacha-currency": { rc: [], rm: ["stellar-jade", "gacha-ticket"] },
  "redeem-codes": { rc: [], rm: ["gacha-ticket", "stellar-jade"] },
  "boss-materials": { rc: [], rm: ["boss-drop", "permit"] },
  
  // Download / platform
  "download-installation": { rc: [], rm: [] },
  "system-requirements": { rc: [], rm: [] },
  "release-date": { rc: [], rm: [] },
  "test-signup": { rc: [], rm: [] },
  "preregistration-rewards": { rc: [], rm: ["gacha-ticket", "stellar-jade"] },
  "test-vs-official": { rc: [], rm: [] },
  
  // Leveling / materials
  "how-to-level-up-fast": { rc: [], rm: ["basic-hunter-guide", "advanced-hunter-guide", "elite-hunter-guide"] },
  "material-domains-location": { rc: [], rm: ["basic-hunter-guide", "permit"] },
  "how-to-get-credits": { rc: [], rm: ["credit-point"] },
  "stamina-management": { rc: [], rm: ["stamina-potion"] },
  "how-to-get-exp-fast": { rc: [], rm: ["basic-hunter-guide"] },
  "skill-upgrade-materials": { rc: [], rm: ["skill-book", "permit"] },
  "permit-materials": { rc: [], rm: ["permit"] },
  "resin-stamina-system": { rc: [], rm: ["stamina-potion"] },
  "attribute-weakness": { rc: ["nanally", "baicang", "daffodil", "skia"], rm: [] },
  
  // Launch 2026
  "launch-date-2026": { rc: [], rm: [] },
  "pre-download-time": { rc: [], rm: [] },
  "global-server-launch": { rc: [], rm: [] },
  "cn-vs-global": { rc: [], rm: [] },
  "cross-platform-save": { rc: [], rm: [] },
  "download-size": { rc: [], rm: [] },
  "is-nte-free": { rc: [], rm: [] },
  "no-50-50-system": { rc: [], rm: ["gacha-ticket"] },
  "f2p-friendly": { rc: ["xiaozhi", "haniel"], rm: [] },
  "multiplayer-coop": { rc: [], rm: [] },
  "ps5-support": { rc: [], rm: [] },
  "mac-support": { rc: [], rm: [] },
  "gacha-currency-name": { rc: [], rm: ["stellar-jade", "gacha-ticket"] },
  
  // Advanced guides
  "no-50-50-confirmed": { rc: [], rm: ["gacha-ticket"] },
  "standard-banner-selector": { rc: ["jiuyuan", "hotori", "baicang", "nanally"], rm: ["gacha-ticket"] },
  "beta-refund": { rc: [], rm: ["stellar-jade"] },
  "xiaozhi-free-s-rank": { rc: ["xiaozhi"], rm: [] },
  "pre-download-details": { rc: [], rm: [] },
  "nvidia-driver-nte": { rc: [], rm: [] },
  "pink-paws-coop": { rc: [], rm: [] },
  "prison-system": { rc: [], rm: [] },
  "aurelia-launch-character": { rc: ["aurelia"], rm: [] },
  
  // Mobile
  "mobile-controller-support": { rc: [], rm: [] },
  "mobile-graphics-settings": { rc: [], rm: [] },
  "android-minimum-specs": { rc: [], rm: [] },
  "ios-minimum-specs": { rc: [], rm: [] },
  "mobile-storage-management": { rc: [], rm: [] },
  "cross-platform-how-to": { rc: [], rm: [] },
  "harmonyos-details": { rc: [], rm: [] },
  "mobile-battery-drain": { rc: [], rm: [] },
  
  // Prereg / livestream
  "preregistration-rewards-how": { rc: [], rm: ["gacha-ticket", "stellar-jade"] },
  "livestream-codes-2026": { rc: [], rm: ["gacha-ticket", "stellar-jade"] },
  
  // P0-P1 content
  "free-pulls-total": { rc: [], rm: ["gacha-ticket"] },
  "stamina-planning": { rc: [], rm: ["stamina-potion", "permit"] },
  "ring-fusion-mechanics": { rc: ["nanally", "jiuyuan", "hotori"], rm: [] },
  "arc-disc-faq": { rc: ["nanally", "baicang", "xiaozhi"], rm: ["arc-disc"] },
  "ue5-7-engine-update": { rc: [], rm: [] },
  "disk-upgrade-faq": { rc: [], rm: ["disk-set", "disk-exp"] },
  "weapon-upgrade-faq": { rc: [], rm: ["weapon-material"] },
  "best-disk-set-per-role": { rc: ["nanally", "baicang", "hotori", "jiuyuan"], rm: ["disk-set"] },
  
  // Team guides
  "genesis-team": { rc: ["nanally", "jiuyuan", "hotori"], rm: [] },
  "turbid-burn-team": { rc: ["baicang", "daffodil", "hotori", "adler"], rm: [] },
  "f2p-team": { rc: ["xiaozhi", "haniel", "jiuyuan", "hathor"], rm: [] },
  "blaze-team": { rc: ["baicang", "daffodil", "akane"], rm: [] },
  "best-launch-teams": { rc: ["nanally", "jiuyuan", "hotori", "baicang", "daffodil", "xiaozhi"], rm: [] },
};

let updated = 0;
for (const faq of faqs) {
  const m = mappings[faq.id];
  if (!m) continue;
  
  if (!faq.relatedCharacters) faq.relatedCharacters = [];
  if (!faq.relatedMaterials) faq.relatedMaterials = [];
  
  if (m.rc.length > 0 && faq.relatedCharacters.length === 0) {
    faq.relatedCharacters = m.rc;
    updated++;
  }
  if (m.rm.length > 0 && faq.relatedMaterials.length === 0) {
    faq.relatedMaterials = m.rm;
    updated++;
  }
}

fs.writeFileSync(faqsPath, JSON.stringify(faqs, null, 2));

const withRc = faqs.filter(f => f.relatedCharacters && f.relatedCharacters.length > 0).length;
const withRm = faqs.filter(f => f.relatedMaterials && f.relatedMaterials.length > 0).length;
console.log(`Updated: ${updated}`);
console.log(`With relatedCharacters: ${withRc}/${faqs.length}`);
console.log(`With relatedMaterials: ${withRm}/${faqs.length}`);
