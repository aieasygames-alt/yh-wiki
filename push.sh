#!/usr/bin/env bash
# One-shot: commit the 1.2 update changes and push to GitHub (triggers Cloudflare Pages deploy).
# Run from your Mac:  cd ~/Documents/nteguide/yh-wiki && bash push.sh
set -e

cd "$(dirname "$0")"

# Clear the stale lock left by the sandbox (harmless if it doesn't exist).
rm -f .git/index.lock

git add -A

git commit -m "content: 1.2 九百九十九夜 launch update + banner date fixes

- changelog: 1.2 confirmed live 2026-07-02; enriched sections; 1.3 Canhong firmed
- fix wrong 1.2 banner dates in gacha.json / banners / cn-vs-global / guides
  (CN 7/2 launch; Illica 7/2-7/23, Zhenhong 7/23-8/13); fix reversed CN/global
- fix 1.1 cn-vs-global row (CN 5/28 / global 6/3)
- gacha: add 1.3 Canhong phase-1 (upcoming)
- new: Warren Continent location, 999 Nights guide (zh/tw/en), 999 Nights + GS25 FAQs
- redeem-codes: add 1.2 codes 999NIGHTS / IROI0729 / SHINKU0708
- regenerate search-index, sitemaps, redeem API"

git push origin main

echo ""
echo "Pushed to origin/main. Cloudflare Pages will now auto-build and deploy to nteguide.com."
