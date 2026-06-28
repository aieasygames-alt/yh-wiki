#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate sitemap XML files from data JSON files."""
import json, os, re
from datetime import datetime, timezone

BASE = "https://nteguide.com"
LOCALES = ["zh", "tw", "en"]
NOW = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

def make_url(loc, path, lastmod=NOW, changefreq="weekly", priority="0.8"):
    return (
        "  <url>\n"
        f"    <loc>{BASE}/{loc}/{path}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
    )

def make_urlset(urls):
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n"
        "</urlset>\n"
    )

def make_sub_sitemap(name, lastmod=NOW):
    return (
        "  <sitemap>\n"
        f"    <loc>{BASE}/sitemap-{name}.xml</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        "  </sitemap>"
    )

def make_sitemapindex(sitemaps):
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(sitemaps) + "\n"
        "</sitemapindex>\n"
    )

def load(name):
    with open(f"data/{name}", encoding="utf-8") as f:
        return json.load(f)

# Load all data
characters = load("characters.json")
weapons = load("weapons.json")
vehicles = load("vehicles.json")
guides = load("guides.json")
blog = load("blog.json")
anomalies = load("anomalies.json")
disk_sets = load("disk-sets.json")
materials = load("materials.json")
locations = load("locations.json")
lore = load("lore.json")
quests = load("quests.json")
changelog = load("changelog.json")
faqs = load("faqs.json")

# === sitemap-characters.xml ===
urls = []
for char in characters:
    for loc in LOCALES:
        urls.append(make_url(loc, f"characters/{char['id']}/"))
with open("public/sitemap-characters.xml", "w", encoding="utf-8") as f:
    f.write(make_urlset(urls))
print(f"sitemap-characters.xml: {len(urls)} URLs ({len(characters)} chars x 3)")

# === sitemap-weapons.xml ===
urls = []
for w in weapons:
    for loc in LOCALES:
        urls.append(make_url(loc, f"weapons/{w['id']}/", priority="0.7"))
with open("public/sitemap-weapons.xml", "w", encoding="utf-8") as f:
    f.write(make_urlset(urls))
print(f"sitemap-weapons.xml: {len(urls)} URLs ({len(weapons)} weapons x 3)")

# === sitemap-vehicles.xml ===
urls = []
for v in vehicles:
    for loc in LOCALES:
        urls.append(make_url(loc, f"vehicles/{v['id']}/", priority="0.7"))
with open("public/sitemap-vehicles.xml", "w", encoding="utf-8") as f:
    f.write(make_urlset(urls))
print(f"sitemap-vehicles.xml: {len(urls)} URLs ({len(vehicles)} vehicles x 3)")

# === sitemap-guides.xml ===
urls = []
for g in guides:
    for loc in LOCALES:
        urls.append(make_url(loc, f"guides/{g['id']}/", priority="0.7"))
with open("public/sitemap-guides.xml", "w", encoding="utf-8") as f:
    f.write(make_urlset(urls))
print(f"sitemap-guides.xml: {len(urls)} URLs ({len(guides)} guides x 3)")

# === sitemap-other.xml ===
urls = []

for p in blog:
    for loc in LOCALES:
        urls.append(make_url(loc, f"blog/{p['id']}/", priority="0.6", changefreq="monthly"))

for a in anomalies:
    for loc in LOCALES:
        urls.append(make_url(loc, f"anomalies/{a['id']}/", priority="0.6"))

for d in disk_sets:
    for loc in LOCALES:
        urls.append(make_url(loc, f"disk-sets/{d['id']}/", priority="0.6"))

for m in materials:
    for loc in LOCALES:
        urls.append(make_url(loc, f"materials/{m['id']}/", priority="0.6", changefreq="monthly"))

for l in locations:
    for loc in LOCALES:
        urls.append(make_url(loc, f"locations/{l['id']}/", priority="0.6"))

for l in lore:
    for loc in LOCALES:
        urls.append(make_url(loc, f"lore/{l['id']}/", priority="0.6"))

for q in quests:
    for loc in LOCALES:
        urls.append(make_url(loc, f"quests/{q['id']}/", priority="0.6"))

for c in changelog:
    for loc in LOCALES:
        urls.append(make_url(loc, f"changelog/{c['version']}/", priority="0.7"))

for faq in faqs:
    if "id" in faq:
        for loc in LOCALES:
            urls.append(make_url(loc, f"faq/{faq['id']}/", priority="0.5", changefreq="monthly"))

compare_pages = [
    "nte-vs-genshin", "nte-vs-ananta", "nte-vs-wuthering-waves",
    "nte-vs-zzz", "nte-vs-honkai-star-rail", "games-like-nte",
]
for cp in compare_pages:
    for loc in LOCALES:
        urls.append(make_url(loc, f"compare/{cp}/", priority="0.7"))

all_tags = set()
for p in blog:
    all_tags.update(p.get("tags", []))
for tag in sorted(all_tags):
    for loc in LOCALES:
        urls.append(make_url(loc, f"tags/{tag}/", priority="0.4", changefreq="monthly"))

with open("public/sitemap-other.xml", "w", encoding="utf-8") as f:
    f.write(make_urlset(urls))
print(f"sitemap-other.xml: {len(urls)} URLs")

# === sitemap-pages.xml ===
urls = []
page_paths = [
    ("", "daily", "1"),
    ("characters/", "weekly", "0.8"),
    ("weapons/", "weekly", "0.8"),
    ("vehicles/", "weekly", "0.8"),
    ("materials/", "weekly", "0.8"),
    ("guides/", "weekly", "0.8"),
    ("faq/", "weekly", "0.8"),
    ("lore/", "weekly", "0.8"),
    ("locations/", "weekly", "0.8"),
    ("blog/", "weekly", "0.8"),
    ("changelog/", "weekly", "0.8"),
    ("tier-list/", "weekly", "0.8"),
    ("bosses/", "weekly", "0.8"),
    ("teams/", "weekly", "0.8"),
    ("anomalies/", "weekly", "0.8"),
    ("disk-sets/", "weekly", "0.8"),
    ("builds/", "weekly", "0.8"),
    ("calculator/leveling/", "weekly", "0.9"),
    ("calculator/build/", "weekly", "0.9"),
    ("calculator/stats/", "weekly", "0.9"),
    ("calculator/dps/", "weekly", "0.9"),
    ("calculator/planner/", "weekly", "0.9"),
    ("calculator/disk-score/", "weekly", "0.9"),
    ("gacha/", "weekly", "0.9"),
    ("gacha-analyzer/", "weekly", "0.9"),
    ("banners/", "weekly", "0.9"),
    ("redeem-codes/", "weekly", "0.9"),
    ("map/", "weekly", "0.9"),
    ("system-requirements/", "weekly", "0.9"),
    ("explorer/", "weekly", "0.9"),
    ("team-builder/", "weekly", "0.9"),
    ("city-tycoon/", "weekly", "0.9"),
    ("effects/", "weekly", "0.9"),
    ("compare-characters/", "weekly", "0.9"),
    ("events/", "weekly", "0.9"),
    ("voice-actors/", "weekly", "0.9"),
    ("multiplayer/", "weekly", "0.9"),
    ("gameplay/", "weekly", "0.9"),
    ("porsche-collab/", "weekly", "0.9"),
    ("steam/", "monthly", "0.7"),
    ("cn-vs-global/", "monthly", "0.7"),
    ("troubleshooting/", "monthly", "0.7"),
    ("guides/gacha-system/", "weekly", "0.9"),
    ("about/", "monthly", "0.5"),
    ("contact/", "monthly", "0.5"),
    ("terms/", "monthly", "0.5"),
    ("privacy-policy/", "monthly", "0.5"),
]
for path, freq, pri in page_paths:
    for loc in LOCALES:
        urls.append(make_url(loc, path, changefreq=freq, priority=pri))
with open("public/sitemap-pages.xml", "w", encoding="utf-8") as f:
    f.write(make_urlset(urls))
print(f"sitemap-pages.xml: {len(urls)} URLs")

# === sitemap-anime-destiny.xml (update lastmod only) ===
with open("public/sitemap-anime-destiny.xml", encoding="utf-8") as f:
    ad_content = f.read()
ad_content = re.sub(r"<lastmod>[^<]+</lastmod>", f"<lastmod>{NOW}</lastmod>", ad_content)
with open("public/sitemap-anime-destiny.xml", "w", encoding="utf-8") as f:
    f.write(ad_content)
ad_count = ad_content.count("<url>")
print(f"sitemap-anime-destiny.xml: {ad_count} URLs (updated lastmod)")

# === sitemap.xml (index) ===
sub_sitemaps = [
    make_sub_sitemap("pages"),
    make_sub_sitemap("characters"),
    make_sub_sitemap("weapons"),
    make_sub_sitemap("vehicles"),
    make_sub_sitemap("guides"),
    make_sub_sitemap("other"),
    make_sub_sitemap("anime-destiny"),
]
with open("public/sitemap.xml", "w", encoding="utf-8") as f:
    f.write(make_sitemapindex(sub_sitemaps))
print(f"sitemap.xml: index with {len(sub_sitemaps)} sub-sitemaps")

# Total count
total = 0
for fn in ["sitemap-pages.xml", "sitemap-characters.xml", "sitemap-weapons.xml",
           "sitemap-vehicles.xml", "sitemap-guides.xml", "sitemap-other.xml",
           "sitemap-anime-destiny.xml"]:
    with open(f"public/{fn}", encoding="utf-8") as f:
        total += f.read().count("<url>")
print(f"\nTotal URLs across all sitemaps: {total}")
