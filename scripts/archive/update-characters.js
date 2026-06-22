const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'characters.json');
const chars = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// === 1. 定义已实装角色（1.0版本可玩）===
const PLAYABLE = {
  nanally:      { acquisitionMethod: 'limited-banner', availableAtLaunch: true },
  sakiri:       { acquisitionMethod: 'beginner-selector', availableAtLaunch: true },
  fadia:        { acquisitionMethod: 'gacha', availableAtLaunch: true },
  baicang:      { acquisitionMethod: 'gacha', availableAtLaunch: true },
  'zero-male':  { acquisitionMethod: 'free', availableAtLaunch: true },
  'zero-female':{ acquisitionMethod: 'free', availableAtLaunch: true },
  hotori:       { acquisitionMethod: 'limited-banner', availableAtLaunch: true },
  daffodil:     { acquisitionMethod: 'gacha', availableAtLaunch: true },
  jiuyuan:      { acquisitionMethod: 'gacha', availableAtLaunch: true },
  haniel:       { acquisitionMethod: 'free', availableAtLaunch: true },
  adler:        { acquisitionMethod: 'gacha', availableAtLaunch: true },
  skia:         { acquisitionMethod: 'gacha', availableAtLaunch: true },
  edgar:        { acquisitionMethod: 'gacha', availableAtLaunch: true },
  mint:         { acquisitionMethod: 'gacha', availableAtLaunch: true },
  aurelia:      { acquisitionMethod: 'free', availableAtLaunch: true },
  chiz:         { acquisitionMethod: 'city-tycoon', availableAtLaunch: true },
  hathor:       { acquisitionMethod: 'gacha', availableAtLaunch: true },
};

// === 2. 删除 zero（与 zero-male/zero-female 重复）===
const zeroIdx = chars.findIndex(c => c.id === 'zero');
if (zeroIdx >= 0) {
  console.log(`REMOVED: zero (index ${zeroIdx})`);
  chars.splice(zeroIdx, 1);
}

// === 3. 更新所有角色状态 ===
let availableCount = 0, upcomingCount = 0;

chars.forEach(c => {
  if (PLAYABLE[c.id]) {
    // 已实装角色
    c.status = 'available';
    c.acquisitionMethod = PLAYABLE[c.id].acquisitionMethod;
    c.availableAtLaunch = PLAYABLE[c.id].availableAtLaunch;
    availableCount++;
  } else {
    // 未实装角色
    c.status = 'upcoming';
    c.acquisitionMethod = 'future';
    c.availableAtLaunch = false;
    upcomingCount++;
  }
});

// === 4. 写回文件 ===
fs.writeFileSync(filePath, JSON.stringify(chars, null, 2) + '\n', 'utf8');

console.log(`\nUpdated: ${availableCount} available, ${upcomingCount} upcoming`);
console.log(`Total: ${chars.length} characters`);
