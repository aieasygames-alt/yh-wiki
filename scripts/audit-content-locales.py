#!/usr/bin/env python3
"""Audit locale coverage and freshness risks in NTE Guide content."""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MESSAGES = ROOT / "messages"
CURRENT_VERSION = "1.4"
CURRENT_DATE = "2026-10-26"
COLLECTIONS = ["guides.json", "blog.json", "faqs.json", "locations.json", "lore.json"]
LOCALIZED_FIELDS = {
    "title": ["title", "titleEn", "titleTw"],
    "summary": ["summary", "summaryEn", "summaryTw"],
    "content": ["content", "contentEn", "contentTw"],
}
RISK_PATTERNS = {
    "wrong_product_name": re.compile(r"Everyloop|everyloop", re.I),
    "rumor_or_preview": re.compile(r"rumor|rumored|leak|upcoming|preview|前瞻|泄露|洩露|傳言|传言|预计|預計|未确认|未確認", re.I),
    "absolute_claim": re.compile(r"best|must[- ]?build|must[- ]?pull|guaranteed|strongest|T0|S\+|最强|最強|必练|必練|必抽|保证|保證|绝对|絕對", re.I),
    "old_version": re.compile(r"\b(?:v?1\.[0-2])\b|1\.0|1\.1|1\.2|2026年(?:3|4|5|6|7|8)月|April|May|June|July|August", re.I),
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def records(path: Path):
    value = load_json(path)
    return list(value.values()) if isinstance(value, dict) else value


def text_of(item: dict) -> str:
    return " ".join(str(item.get(k, "")) for k in (*sum(LOCALIZED_FIELDS.values(), []), "id", "date", "status", "category"))


HISTORICAL_CONTEXT = re.compile(
    r"historical|history|archive|historical reference|历史|歷史|旧版|舊版|公测时期|公測時期|版本回顾|版本回顧",
    re.I,
)


def risk_hits(item: dict) -> list[str]:
    """Return actionable risks, not expected markers in archived records."""
    text = text_of(item)
    hits = [name for name, pattern in RISK_PATTERNS.items() if pattern.search(text)]
    historical = item.get("verificationStatus") == "historical" or HISTORICAL_CONTEXT.search(text)
    if historical:
        # Old dates and preview language are expected in explicitly archived
        # records; they are not current-content defects.
        hits = [name for name in hits if name not in {"old_version", "rumor_or_preview", "absolute_claim"}]
    return hits


def main() -> None:
    locales = load_json(ROOT / "lib" / "../messages/zh.json") if False else None
    i18n = (ROOT / "lib" / "i18n.ts").read_text(encoding="utf-8")
    locale_match = re.search(r'LOCALES\s*:[^=]+?=\s*\[([^\]]+)\]', i18n, re.S)
    code_locales = re.findall(r'"([a-z-]+)"', locale_match.group(1)) if locale_match else []
    message_locales = sorted(p.stem for p in MESSAGES.glob("*.json"))

    print("# NTE Guide Content Locale Audit")
    print(f"Current policy: version={CURRENT_VERSION}, reviewed={CURRENT_DATE}")
    print(f"Code locales: {', '.join(code_locales)}")
    print(f"Message files: {', '.join(message_locales)}")
    print(f"Locale mismatch: {set(code_locales) != set(message_locales)}")
    print()

    all_risks: Counter[str] = Counter()
    missing_records: list[tuple[str, str, str]] = []
    risk_records: list[tuple[str, str, list[str]]] = []

    for filename in COLLECTIONS:
        path = DATA / filename
        items = records(path)
        print(f"## {filename} ({len(items)} records)")
        for group, fields in LOCALIZED_FIELDS.items():
            present = sum(bool(item.get(field)) for item in items for field in [fields[0]])
            # Report each localized field independently.
            counts = [sum(bool(item.get(field)) for item in items) for field in fields]
            print(f"- {group}: " + ", ".join(f"{field}={count}/{len(items)}" for field, count in zip(fields, counts)))
        for item in items:
            item_id = str(item.get("id", "<no-id>"))
            title = str(item.get("title", item.get("question", "")))
            for field in LOCALIZED_FIELDS["content"]:
                if field in item and not item.get(field):
                    missing_records.append((filename, item_id, field))
            hits = risk_hits(item)
            if hits:
                risk_records.append((filename, item_id, hits))
                all_risks.update(hits)
        print()

    print("## Missing localized content")
    if missing_records:
        for filename, item_id, field in missing_records:
            print(f"- {filename}::{item_id} missing {field}")
    else:
        print("- None")
    print()

    print("## Risk summary")
    for name, count in all_risks.most_common():
        print(f"- {name}: {count} records")
    print()

    blog = records(DATA / "blog.json")
    missing_tw = [item for item in blog if not item.get("contentTw")]
    print(f"## Blog action queue ({len(missing_tw)} missing contentTw)")
    for item in sorted(missing_tw, key=lambda x: (str(x.get("date", "")), str(x.get("id", ""))), reverse=True):
        hits = risk_hits(item)
        action = "historical-review" if "old_version" in hits or "rumor_or_preview" in hits else "translate-and-review"
        print(f"- {item.get('date', '-')} | {item.get('id')} | {action} | {item.get('title', '')}")

    report = {
        "policy": {"currentVersion": CURRENT_VERSION, "reviewedDate": CURRENT_DATE},
        "codeLocales": code_locales,
        "messageLocales": message_locales,
        "localeMismatch": set(code_locales) != set(message_locales),
        "missingLocalizedContent": [
            {"file": f, "id": i, "field": field} for f, i, field in missing_records
        ],
        "riskSummary": dict(all_risks),
        "blogActionQueue": [
            {
                "id": item.get("id"),
                "date": item.get("date"),
                "action": "historical-review" if "old_version" in risk_hits(item) else "translate-and-review",
            }
            for item in missing_tw
        ],
    }
    output = ROOT / "plans" / "content-locale-audit.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print()
    print(f"Machine-readable report: {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
