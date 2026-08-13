#!/usr/bin/env python3
"""Select trustworthy, extractable sources before seoscout collection."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from urllib.parse import urlparse


BLOCKED = {
    "facebook.com", "instagram.com", "tiktok.com", "x.com", "twitter.com",
    "softonic.com", "apkmezo.com", "allkeyshop.com", "instant-gaming.com",
    "driffle.com", "gg.deals", "lootboxgaming.com", "tvtropes.org",
    "pcgamingwiki.com", "fandom.com", "wiki.gg", "gamefaqs.gamespot.com",
    "resetera.com", "f95zone.to",
}

TRUST = {
    "refugiumgames.net": 100,
    "store.steampowered.com": 98,
    "steamcommunity.com": 94,
    "perpgames.com": 96,
    "store.playstation.com": 96,
    "gamespress.com": 92,
    "ign.com": 85,
    "gamingnexus.com": 82,
    "gamingtrend.com": 80,
    "metacritic.com": 78,
    "opencritic.com": 78,
    "gamerant.com": 70,
    "gonintendo.com": 75,
    "idreamofindie.com": 72,
    "waytoomany.games": 72,
    "games.gg": 70,
}

CANONICAL = {
    "steam": {
        "title": "Agefield High: Rock the School on Steam",
        "url": "https://store.steampowered.com/app/3562580/Agefield_High_Rock_the_School/",
        "domain": "store.steampowered.com",
        "snippet": "Official Steam store listing with release, feature, platform, and system requirement information.",
    },
    "official": {
        "title": "Agefield High: Rock the School - Refugium Games",
        "url": "https://www.refugiumgames.net/",
        "domain": "www.refugiumgames.net",
        "snippet": "Official Refugium Games website for Agefield High: Rock the School.",
    },
    "achievements": {
        "title": "Agefield High: Rock the School Achievements",
        "url": "https://steamcommunity.com/stats/3562580/achievements",
        "domain": "steamcommunity.com",
        "snippet": "Official Steam Community achievement listing for the game.",
    },
}


def root_domain(value: str) -> str:
    host = (urlparse(value).hostname or value).lower().removeprefix("www.")
    return host


def blocked(item: dict) -> bool:
    host = root_domain(item.get("url", item.get("domain", "")))
    return any(host == domain or host.endswith("." + domain) for domain in BLOCKED)


def score(item: dict, keyword: str) -> int:
    host = root_domain(item.get("url", item.get("domain", "")))
    value = max((points for domain, points in TRUST.items()
                 if host == domain or host.endswith("." + domain)), default=0)
    lower = keyword.lower()
    if "review" in lower or " ign" in lower or "metacritic" in lower or "vs bully" in lower:
        if host.endswith("ign.com") or host.endswith("metacritic.com") or host.endswith("opencritic.com"):
            value += 20
    if "metacritic" in lower and host.endswith("metacritic.com"):
        value += 30
    if any(term in lower for term in ("gameplay", "trailer", "full gameplay")):
        if host.endswith("ign.com"):
            value += 25
    if any(term in lower for term in ("steam", "pc", "requirements", "size", "price", "buy", "length", "multiplayer")):
        if host == "store.steampowered.com":
            value += 25
    if " ign" in lower and "/articles/" in item.get("url", ""):
        value += 30
    return value


def add_if_missing(items: list[dict], item: dict) -> None:
    if not any(existing.get("url") == item["url"] for existing in items):
        items.append({**item, "selected": False})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=Path)
    parser.add_argument("--top-k", type=int, default=2)
    args = parser.parse_args()

    data = json.loads(args.path.read_text(encoding="utf-8"))
    selected_total = 0
    for entry in data.get("keywords", []):
        keyword = entry["keyword"]
        items = entry.setdefault("web", {}).setdefault("items", [])
        add_if_missing(items, CANONICAL["official"])
        add_if_missing(items, CANONICAL["steam"])
        if entry.get("category") == "guide":
            add_if_missing(items, CANONICAL["achievements"])

        allowed = [item for item in items if not blocked(item) and score(item, keyword) > 0]
        allowed.sort(key=lambda item: score(item, keyword), reverse=True)
        selected_urls = {item["url"] for item in allowed[: args.top_k]}
        for item in items:
            item["selected"] = item.get("url") in selected_urls
        items.sort(key=lambda item: (not item["selected"], -score(item, keyword)))
        entry["web"]["count"] = len(items)
        selected_total += len(selected_urls)

    args.path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Curated {len(data.get('keywords', []))} keywords; selected {selected_total} trusted web references")


if __name__ == "__main__":
    main()
