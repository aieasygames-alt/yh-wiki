#!/usr/bin/env python3
"""Download ghzs666 tiles and stitch into a single full map image.

ghzs666 tile grid:
- z=7, 64x64 tiles (only x=0..63, y=0..63 have content)
- Each tile: 256x256 WebP
- Total: 16384x16384 pixels
- URL: https://and-static.ghzs.com/web/yihuan-map-260528/{z}/{x}/{y}.webp
"""

import os
import sys
import urllib.request
import time
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

TILE_BASE = "https://and-static.ghzs.com/web/yihuan-map-260528"
ZOOM = 7
GRID = 64  # 64x64 tiles
TILE_SIZE = 256
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "tmp", "ghzs666-tiles")
OUTPUT_IMAGE = os.path.join(os.path.dirname(__file__), "..", "tmp", "ghzs666-full.webp")
MAX_WORKERS = 8

def download_tile(z, x, y):
    url = f"{TILE_BASE}/{z}/{x}/{y}.webp"
    path = os.path.join(OUTPUT_DIR, f"{z}_{x}_{y}.webp")
    if os.path.exists(path) and os.path.getsize(path) > 100:
        return path, True
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        data = resp.read()
        if len(data) > 100:
            with open(path, "wb") as f:
                f.write(data)
            return path, True
        return None, False
    except Exception as e:
        return None, False

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = GRID * GRID
    print(f"Downloading {total} tiles ({GRID}x{GRID}) at z={ZOOM}...")

    downloaded = 0
    cached = 0
    failed = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {}
        for x in range(GRID):
            for y in range(GRID):
                f = executor.submit(download_tile, ZOOM, x, y)
                futures[f] = (x, y)

        for f in as_completed(futures):
            x, y = futures[f]
            path, ok = f.result()
            if ok:
                if path and os.path.exists(path):
                    size = os.path.getsize(path)
                    if size > 1000:
                        downloaded += 1
                    else:
                        cached += 1
                else:
                    cached += 1
            else:
                failed += 1

            done = downloaded + cached + failed
            if done % 100 == 0 or done == total:
                print(f"  {done}/{total}: {downloaded} downloaded, {cached} cached, {failed} failed")

    print(f"\nDone: {downloaded + cached} tiles available, {failed} failed")

    # Check if PIL is available for stitching
    try:
        from PIL import Image
        print(f"\nStitching tiles into {GRID * TILE_SIZE}x{GRID * TILE_SIZE} image...")

        full_img = Image.new("RGB", (GRID * TILE_SIZE, GRID * TILE_SIZE), (0, 0, 0))
        stitched = 0
        for x in range(GRID):
            for y in range(GRID):
                tile_path = os.path.join(OUTPUT_DIR, f"{ZOOM}_{x}_{y}.webp")
                if os.path.exists(tile_path):
                    try:
                        tile = Image.open(tile_path).convert("RGB")
                        full_img.paste(tile, (y * TILE_SIZE, x * TILE_SIZE))
                        stitched += 1
                    except Exception:
                        pass

        print(f"Stitched {stitched} tiles")
        full_img.save(OUTPUT_IMAGE, "WEBP", quality=90)
        size_mb = os.path.getsize(OUTPUT_IMAGE) / 1024 / 1024
        print(f"Saved to {OUTPUT_IMAGE} ({size_mb:.1f} MB)")
    except ImportError:
        print("\nPIL not available, skipping stitching.")
        print("Tiles saved in tmp/ghzs666-tiles/")

if __name__ == "__main__":
    main()
