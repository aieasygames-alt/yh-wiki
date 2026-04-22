/**
 * Generate favicon.ico, apple-icon.png, and og-image.png from Logo SVG
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_SVG = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="#818cf8" />
      <stop offset="1" stop-color="#a78bfa" />
    </linearGradient>
    <linearGradient id="logo-glow" x1="20" y1="6" x2="20" y2="34" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1" />
      <stop offset="1" stop-color="#a78bfa" />
    </linearGradient>
  </defs>
  <path d="M 20 4 A 16 16 0 1 1 11.1 7.6" stroke="url(#logo-grad)" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M 24.5 10.5 A 9 9 0 1 0 29 18" stroke="url(#logo-glow)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <circle cx="20" cy="20" r="3" fill="#818cf8"/>
  <circle cx="20" cy="20" r="1.5" fill="#c7d2fe"/>
</svg>`;

const OG_IMAGE_SVG = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0f1117"/>
      <stop offset="1" stop-color="#1a1b2e"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#818cf8"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="brand2" x1="100" y1="30" x2="100" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Decorative circles -->
  <circle cx="100" cy="315" r="300" fill="none" stroke="#818cf8" stroke-width="0.5" opacity="0.15"/>
  <circle cx="100" cy="315" r="200" fill="none" stroke="#818cf8" stroke-width="0.5" opacity="0.1"/>
  <!-- Logo mark centered -->
  <g transform="translate(600, 200)">
    <path d="M 0 -80 A 80 80 0 1 1 -44 -62.5" stroke="url(#brand)" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M 22.5 -52.5 A 45 45 0 1 0 45 0" stroke="url(#brand2)" stroke-width="11" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="0" r="15" fill="#818cf8"/>
    <circle cx="0" cy="0" r="7.5" fill="#c7d2fe"/>
  </g>
  <!-- Title text -->
  <text x="600" y="380" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#e5e7eb">
    Neverness to Everness
  </text>
  <text x="600" y="430" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#818cf8">
    Wiki &amp; Calculator — Characters, Guides, Tools
  </text>
  <!-- URL -->
  <text x="600" y="560" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#6b7280">
    nteguide.com
  </text>
</svg>`;

async function generate() {
  const appDir = path.join(__dirname, '..', 'app');
  const publicDir = path.join(__dirname, '..', 'public');

  console.log('🎨 Generating favicon and icons...\n');

  // Generate favicon.ico (32x32)
  const favicon32 = await sharp(Buffer.from(LOGO_SVG))
    .resize(32, 32)
    .png()
    .toBuffer();

  const favicon16 = await sharp(Buffer.from(LOGO_SVG))
    .resize(16, 16)
    .png()
    .toBuffer();

  // ICO format: header + 2 entries (16x16 + 32x32)
  // Simple approach: just use 32x32 PNG as favicon
  await sharp(Buffer.from(LOGO_SVG))
    .resize(32, 32)
    .toFile(path.join(appDir, 'favicon.ico'));

  console.log('✅ app/favicon.ico (32x32)');

  // Apple touch icon (180x180)
  await sharp(Buffer.from(LOGO_SVG))
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  console.log('✅ app/apple-icon.png (180x180)');

  // OG image (1200x630)
  await sharp(Buffer.from(OG_IMAGE_SVG))
    .png()
    .toFile(path.join(appDir, 'opengraph-image.png'));

  console.log('✅ app/opengraph-image.png (1200x630)');

  // Also save a public logo.svg for reference
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), LOGO_SVG);
  console.log('✅ public/logo.svg');

  console.log('\n🎉 All icons generated!');
}

generate().catch(console.error);
