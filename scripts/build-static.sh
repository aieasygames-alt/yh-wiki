#!/bin/bash
# Assemble static site from .next build output for Cloudflare Pages
set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

echo "Assembling static site from .next build output..."

rm -rf out
mkdir -p out

# 1. Copy static assets
mkdir -p out/_next
cp -r .next/static out/_next/

# 2. Copy public assets (images, favicon, etc.)
if [ -d "public" ]; then
  cp -r public/* out/
fi

# 3. Copy pre-rendered HTML pages
find .next/server/app -name "*.html" ! -name "_not-found*" | while read -r html_file; do
  # Get relative path from .next/server/app/
  rel="${html_file#.next/server/app/}"
  route="${rel%.html}"

  if [[ "$route" == "index" ]]; then
    cp "$html_file" "$ROOT/out/index.html"
  else
    mkdir -p "$ROOT/out/${route}"
    cp "$html_file" "$ROOT/out/${route}/index.html"
  fi
done

echo "Static site assembled."
echo "HTML pages: $(find out -name '*.html' | wc -l)"
echo "Total files: $(find out -type f | wc -l)"
