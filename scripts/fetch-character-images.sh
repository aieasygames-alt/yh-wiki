#!/usr/bin/env bash
# Fetch and install real character artwork for NTE Wiki.
#
# Tries multiple public sources for each character and installs the first
# successful download. Converts to webp 400x500 cover via sharp (installed
# in package.json).
#
# Usage:
#   bash scripts/fetch-character-images.sh
#
# You need to be on macOS / an env where `npx sharp` works.
set -e
cd "$(dirname "$0")/.."

declare -A SOURCES=(
  # Kardz wiki (Chinese community NTE wiki) — known to host high-quality art
  [xiaozhen]="https://kardzntewiki.kardz.com/storage/characters/xiaozhen.webp
https://kardzntewiki.kardz.com/storage/character/xiaozhen.png
https://kardzntewiki.kardz.com/img/characters/xiaozhen.jpg"
  [nelly]="https://kardzntewiki.kardz.com/storage/characters/nelly.webp
https://kardzntewiki.kardz.com/storage/character/nelly.png
https://kardzntewiki.kardz.com/img/characters/nelly.jpg"
  [lilina]="https://kardzntewiki.kardz.com/storage/characters/lilina.webp
https://kardzntewiki.kardz.com/storage/character/lilina.png
https://kardzntewiki.kardz.com/img/characters/lilina.jpg"
)

declare -A FALLBACK_PATTERNS=(
  # Bing image search URL — opens in browser, manual pick
  [xiaozhen]="https://www.bing.com/images/search?q=Neverness+to+Everness+Xiaozhen+%E6%98%8E%E8%99%8E+character"
  [nelly]="https://www.bing.com/images/search?q=Neverness+to+Everness+Nelly+%E5%A5%88%E8%8E%89+character"
  [lilina]="https://www.bing.com/images/search?q=Neverness+to+Everness+Lilina+%E8%8E%89%E8%8E%89%E5%A8%9C+character"
)

echo "=== Fetching character artwork ==="
echo ""

declare -A SUCCESS
declare -A FAILED

for name in xiaozhen nelly lilina; do
  echo "→ $name"
  sources="${SOURCES[$name]}"
  found=0
  while IFS= read -r url; do
    [ -z "$url" ] && continue
    echo "  trying: $url"
    tmpfile="/tmp/${name}-raw"
    if curl -sSL --max-time 15 -o "$tmpfile" "$url" 2>/dev/null && [ -s "$tmpfile" ]; then
      ftype=$(file -b "$tmpfile" 2>/dev/null)
      if echo "$ftype" | grep -qiE "Web/P|JPEG|PNG|AVIF|image"; then
        size=$(stat -f%z "$tmpfile" 2>/dev/null || stat -c%s "$tmpfile")
        if [ "$size" -gt 10000 ]; then  # at least 10KB → not a placeholder
          echo "    ✓ downloaded ($(( size / 1024 )) KB, $ftype)"
          SUCCESS[$name]="$tmpfile|$ftype"
          found=1
          break
        else
          echo "    ✗ too small ($size bytes — likely error page)"
        fi
      else
        echo "    ✗ not an image ($ftype)"
      fi
    else
      echo "    ✗ curl failed"
    fi
  done <<< "$sources"

  if [ "$found" -eq 0 ]; then
    FAILED[$name]="${FALLBACK_PATTERNS[$name]}"
    echo "    ✗ all sources failed — manual fetch needed"
  fi
  echo ""
done

echo "=== Conversion + install ==="
for name in xiaozhen nelly lilina; do
  entry="${SUCCESS[$name]:-}"
  if [ -z "$entry" ]; then
    echo "  ✗ $name: no source downloaded"
    continue
  fi
  tmpfile="${entry%%|*}"
  dest="public/images/characters/${name}.webp"
  if [ -f "$dest" ]; then
    # backup existing placeholder
    cp "$dest" "${dest}.bak"
  fi
  if npx -y sharp -i "$tmpfile" -o "$dest" resize 400 500 --fit cover --format webp --quality 85 2>/dev/null; then
    size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest")
    echo "  ✓ $name → $dest ($(( size / 1024 )) KB)"
    rm -f "$tmpfile"
  else
    echo "  ✗ $name: sharp conversion failed"
    [ -f "${dest}.bak" ] && mv "${dest}.bak" "$dest"
  fi
done

echo ""
echo "=== Summary ==="
success_count=${#SUCCESS[@]}
fail_count=${#FAILED[@]}
echo "  $success_count downloaded, $fail_count failed"
if [ "$fail_count" -gt 0 ]; then
  echo ""
  echo "Manual fetch needed for:"
  for name in "${!FAILED[@]}"; do
    echo "  $name → ${FAILED[$name]}"
  done
  echo ""
  echo "After downloading manually, place each file at:"
  echo "  public/images/characters/<name>.<ext>"
  echo "And update data/characters.json image field to match."
fi

echo ""
echo "Done. Next: 'git add -A public/images/characters/' then commit + push."
