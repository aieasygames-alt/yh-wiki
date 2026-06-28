# Fetch missing character images — Xiaozhen / Nelly / Lilina

This document lists known sources for each character's official artwork. Pick one image per character, download to `public/images/characters/<name>.<ext>`, and update `data/characters.json` `image` field to match.

The existing placeholder files (3-4 KB webp with just the character name) should be replaced.

## Xiaozhen (明虎) — S-rank Anima Attack

**Description**: S-rank anima-attribute Attack character; available at 1.0 launch. Cat-tribe or tiger-themed design.

Candidate sources:

1. **Official NTE wiki (CN)**: <https://wiki.biligame.com/yh/> — search 明虎 in sidebar
2. **Kardz NTE wiki**: <https://kardzntewiki.kardz.com/zh-tw/game/neverness-to-everness> — search 明虎 in character list, right-click the portrait → Save image as
3. **HoYoLab NTE section**: <https://www.hoyolab.com/topicDetail/nte> — search "明虎"
4. **NTE Fandom EN**: <https://neverness-to-everness.fandom.com/wiki/Xiaozhen> — may need a logged-in session
5. **Bing image search** (manual filter for "large" size): <https://www.bing.com/images/search?q=Neverness+to+Everness+Xiaozhen+%E6%98%8E%E8%99%8E>

**Target**: a 400x500 or larger portrait-style image (PNG/JPG/WEBP/AVIF).

## Nelly (奈莉) — A-rank Support

**Description**: A-rank anima-attribute Support character; available at 1.0 launch.

Candidate sources:

1. **Biligame yh wiki**: <https://wiki.biligame.com/yh/> — search 奈莉
2. **Kardz**: <https://kardzntewiki.kardz.com/zh-tw/game/neverness-to-everness> — search 奈莉
3. **Bing image search**: <https://www.bing.com/images/search?q=Neverness+to+Everness+Nelly+%E5%A5%88%E8%8E%89>

## Lilina (莉莉娜) — S-rank

**Description**: S-rank cosmos-attribute character; available at 1.0 launch.

Candidate sources:

1. **Biligame yh wiki**: <https://wiki.biligame.com/yh/> — search 莉莉娜
2. **Kardz**: <https://kardzntewiki.kardz.com/zh-tw/game/neverness-to-everness> — search 莉莉娜
3. **Bing image search**: <https://www.bing.com/images/search?q=Neverness+to+Everness+Lilina+%E8%8E%89%E8%8E%89%E5%A8%9C>

---

## After downloading

For each character, drop the file at:

```
public/images/characters/xiaozhen.<ext>     (webp/jpg/png/avif)
public/images/characters/nelly.<ext>
public/images/characters/lilina.<ext>
```

Delete the existing 3-4 KB placeholder `.webp` files first:

```bash
rm public/images/characters/xiaozhen.webp
rm public/images/characters/nelly.webp
rm public/images/characters/lilina.webp
```

If you downloaded as `.png` / `.jpg` / `.avif`, update `data/characters.json`:

```json
{ "id": "xiaozhen", "image": "/images/characters/xiaozhen.png" }
{ "id": "nelly",    "image": "/images/characters/nelly.jpg" }
{ "id": "lilina",   "image": "/images/characters/lilina.avif" }
```

**Recommended**: convert to `.webp` for consistency with the rest of the site (and smaller payload):

```bash
cd /Users/robert/Documents/Website/异环/yh-wiki

for name in xiaozhen nelly lilina; do
  src=$(ls public/images/characters/${name}.{png,jpg,jpeg,avif} 2>/dev/null | head -1)
  if [ -n "$src" ]; then
    npx sharp -i "$src" -o "public/images/characters/${name}.webp" \
      resize 400 500 --fit cover --format webp --quality 85
    rm "$src"
    echo "✓ $name → webp"
  fi
done
```

Then commit:

```bash
git add -A public/images/characters/ data/characters.json
git commit -m "Replace xiaozhen / nelly / lilina placeholders with real art"
git push origin main
```

After Cloudflare deploys, **purge these URLs** in the Cloudflare dashboard (same as the blog image issue — old placeholder may be cached):

```
https://nteguide.com/images/characters/xiaozhen.webp
https://nteguide.com/images/characters/nelly.webp
https://nteguide.com/images/characters/lilina.webp
```

Or change the file extension (different URL) to bypass the cache naturally.
