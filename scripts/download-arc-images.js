const https = require('https');
const fs = require('fs');
const path = require('path');

// icy-veins serves arc icons with slug matching our IDs directly
const BASE = 'https://static.icy-veins.com/images/neverness-to-everness/arc/icons';
const DEST = path.join(__dirname, '..', 'public', 'images', 'weapons');

const IDS = [
  // S-rank (16)
  'ready-ready', 'blow-up-the-crowd', 'watch-your-heads', 'eternal-waltz',
  'youthful-fantasy', 'song-of-the-whale', 'contemplative-cat', 'camellia-society',
  'the-last-rose', 'day-off', 'your-happiness-is-priceless', 'reality-refuge',
  'good-boys-grand-adventure', 'hethereraus-keeper', 'marching-beyond-time', 'raging-flames',

  // A-rank (21)
  'fluff-of-fearlessness', 'fluff-of-ferocity', 'fluff-of-finesse',
  'fluff-of-fleetness', 'fluff-of-fortitude', 'a-time-will-come',
  'call-of-the-twisted-city', 'clear-skies', 'cosmos-daze-wild-reverie',
  'drawn-blade', 'failing-you-heavy-in-my-heart', 'mind-royale',
  'oraora', 'shiny-days', 'the-fools-spring', 'the-forgotten',
  'the-good-the-bad-the-bitter', 'the-great-thief', 'time-bandit',
  'umbrella', 'tears-beneath-the-mask',

  // B-rank (5)
  'real-music', 'be-happy', 'dangerous-game', 'first-step-to-success', 'us',
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(dest, () => {});
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  let success = 0, fail = 0;

  for (let i = 0; i < IDS.length; i += 5) {
    const batch = IDS.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map(id => {
        const url = `${BASE}/${id}.webp`;
        const out = path.join(DEST, `${id}.webp`);
        return download(url, out).then(() => id);
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled') {
        console.log(`OK: ${r.value}`);
        success++;
      } else {
        console.log(`FAIL: ${r.reason?.message || r.reason}`);
        fail++;
      }
    }
  }

  console.log(`\nDone: ${success} success, ${fail} failed`);
}

main();
