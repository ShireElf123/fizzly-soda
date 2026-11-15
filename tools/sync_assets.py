#!/usr/bin/env python3
"""Rewrite the ASSETS map in index.html from the files actually in assets/.

Run after adding or removing generated art so the page never requests a file
that does not exist yet (the image slots have drawn-SVG fallbacks, but mixed
half-loaded art looks inconsistent while a set is still being produced).

    python3 tools/sync_assets.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
ASSETS = ROOT / "assets"

# site flavour key -> filename flavour
KEYS = [
    ("cherry", "cherry"),
    ("lime", "lime"),
    ("orange", "orange"),
    ("grape", "grape"),
    ("lemon", "lemon"),
    ("berry", "blue-razz"),  # site calls Blue Razz "berry"
]


def build() -> str:
    have = {p.name for p in ASSETS.glob("*.webp")}

    def one(kind, file_flavour):
        name = f"{kind}-{file_flavour}.webp"
        return f"A+'{name}'" if name in have else None

    can, splash, backdrop, fruit = [], [], [], []
    for key, fflav in KEYS:
        c = one("can", fflav)
        if c:
            can.append(f"{key}:{c}")
        s = one("splash", fflav)
        if s:
            splash.append(f"{key}:{s}")
        b = one("backdrop", fflav)
        if b:
            backdrop.append(f"{key}:{b}")
        pieces = [f"A+'fruit-{fflav}-{n}.webp'" for n in (1, 2, 3, 4)
                  if f"fruit-{fflav}-{n}.webp" in have]
        fruit.append(f"{key}:[{','.join(pieces)}]")

    def obj(entries):
        return "{" + ",".join(entries) + "}"

    return (
        "/* Generated photo assets, synced from assets/ by tools/sync_assets.py.\n"
        "   Keys match F[i].f (Blue Razz uses the key \"berry\"). Empty slots fall\n"
        "   back to the drawn SVG, so a missing file never breaks the page. */\n"
        "const A='assets/';\n"
        "const ASSETS={\n"
        f" can:{obj(can)},\n"
        f" fruit:{obj(fruit)},\n"
        f" splash:{obj(splash)},\n"
        f" backdrop:{obj(backdrop)}\n"
        "};"
    )


def main():
    html = INDEX.read_text()
    pattern = re.compile(r"/\* Generated photo assets.*?const A='assets/';.*?\n\};", re.S)
    if not pattern.search(html):
        raise SystemExit("ASSETS block not found in index.html")
    html = pattern.sub(lambda m: build(), html, count=1)
    INDEX.write_text(html)
    print("ASSETS synced")


if __name__ == "__main__":
    main()
