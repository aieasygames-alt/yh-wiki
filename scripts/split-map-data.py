#!/usr/bin/env python3
"""Split map-markers.json into core + per-region files for lazy loading."""

import json
from collections import defaultdict
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public" / "data"

def main():
    with open(DATA_DIR / "map-markers.json") as f:
        d = json.load(f)

    src_map = d["maps"][0]
    regions = d.get("regions", {})

    # Core: map metadata + markerTypes + regions, no markers
    core = {
        "maps": [{
            "id": src_map["id"],
            "name": src_map["name"],
            "nameEn": src_map["nameEn"],
            "image": src_map["image"],
            "bounds": src_map["bounds"],
            "minZoom": src_map["minZoom"],
            "maxZoom": src_map["maxZoom"],
            "tms": src_map.get("tms", False),
            "markers": [],  # loaded separately
        }],
        "markerTypes": d["markerTypes"],
        "regions": regions,
    }

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    with open(PUBLIC_DIR / "map-core.json", "w") as f:
        json.dump(core, f, ensure_ascii=False, separators=(",", ":"))
    print(f"map-core.json: {len(json.dumps(core, ensure_ascii=False)) // 1024} KB")

    # Split markers by region
    by_region = defaultdict(list)
    for m in src_map["markers"]:
        region = m.get("region")
        if region and region in regions:
            by_region[region].append(m)
        else:
            # Markers without region go into first region or a misc bucket
            by_region[list(regions.keys())[0]].append(m)

    for region_id, markers in by_region.items():
        filename = f"map-markers-{region_id}.json"
        with open(PUBLIC_DIR / filename, "w") as f:
            json.dump(markers, f, ensure_ascii=False, separators=(",", ":"))
        print(f"{filename}: {len(markers)} markers, {len(json.dumps(markers, ensure_ascii=False)) // 1024} KB")

    # Also write region list as a small index
    region_list = list(regions.keys())
    with open(PUBLIC_DIR / "map-regions.json", "w") as f:
        json.dump(region_list, f)
    print(f"map-regions.json: {region_list}")

if __name__ == "__main__":
    main()
