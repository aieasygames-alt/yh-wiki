# Archive — applied data-migration scripts

Scripts in this directory are **one-time data migrations that have already been applied** to the JSON files in `data/`. They are kept for historical reference and audit but are not part of the build pipeline.

## Do NOT re-run

These scripts mutate `data/*.json` in place. Re-running them is generally idempotent (most use `upsert` patterns), but some are append-only and will create duplicate entries. If you need to re-apply a migration, read the script first.

## Active scripts (stay in `scripts/`, not here)

The build pipeline uses these and they must stay in `scripts/`:

- `prebuild.js` — regenerates sitemaps, search index, API JSON, llms-full.txt
- `build-static.sh` — assembles `out/` from `.next/` for Cloudflare Pages
- `generate-redirects.js` — writes `_redirects` for Cloudflare
- `patch-next.sh` + `patch-next.js` — postinstall fixups
- `submit-indexnow.js` — notifies Bing/Yandex of URL changes
- `normalize-faq-categories.mjs` — idempotent FAQ category slug normalizer

Utility scripts that may be re-run:

- `convert-to-webp.js` — batch image conversion
- `generate-favicons.js` — favicon generation from source PNG
- `generate-placeholders.js` — placeholder image generation
- `generate-map-tiles.js` — Leaflet tile generation
- `generate-api-json.js` — standalone API JSON generator (also done by prebuild)
- `scrape-data.ts`, `download-images.ts`, `download-arc-images.{js,sh}`, `download-ghzs666-tiles.py`, `fetch-ghzs666-data.js`, `fetch-imapp-data.js`, `import-images.js`, `split-map-data.py` — data ingestion (handle with care)

## When to archive a new script

After applying a data migration:

1. Confirm the change is committed to `data/*.json`
2. Move the script here with `git mv scripts/<name>.js scripts/archive/`
3. Add a line to this README explaining what it was for

## Why archive instead of delete

Audit trail. If a `data/*.json` field ever looks suspicious, you can trace back to the script that introduced it.
