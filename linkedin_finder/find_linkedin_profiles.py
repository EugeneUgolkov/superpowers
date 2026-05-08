#!/usr/bin/env python3
"""
Find LinkedIn profile URLs for a list of people and write the results to an Excel file.

The script tries DuckDuckGo's HTML endpoint first (no API key required) and falls
back to a Google "I'm Feeling Lucky"-style query. Results are best-effort: a human
should still verify each LinkedIn URL.

Usage:
    python find_linkedin_profiles.py names.txt --out profiles.xlsx
        (names.txt has one name per line; blank lines and lines starting with # are ignored.)

    python find_linkedin_profiles.py --out profiles.xlsx
        (uses the default DEFAULT_NAMES list embedded below.)

    python find_linkedin_profiles.py --hint "NHL sports agent" --out profiles.xlsx
        (adds a context hint to every search query.)
"""

from __future__ import annotations

import argparse
import re
import sys
import time
import urllib.parse
from dataclasses import dataclass
from typing import Iterable

import urllib.request
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter


DEFAULT_NAMES: list[str] = [
    "Nathan Baker",
    "James Paul, Esq",
    "Lukman Abdulai",
    "Paul T DeRousselle",
    "Brandyn Garth",
    "Ryan Leff",
    "Jordan Donald",
    "Blaine Roche",
    "Felix Neboh",
    "Joe Caligiuri",
    "DJ Dermitt",
    "Drew Koehler",
    "Rick Valette",
    "Nicholas Bedford",
    "James McClendon",
    "Tyler Urban",
    "Keith Mckittrich",
    "Bob Lisanti",
    "Hernan Ramos",
    "Jeff Boston",
    "Long Diep",
    "Adrian Soun",
    "Nick Riopel",
    "Sean Russi",
    "Don Weatherell",
    "Ken Sarnoff",
    "Drew Campbell",
    "Rand Simon",
    "Elroy Vazover Jr.",
    "Kim Miale",
    "Randy Robitaille",
    "Renat Mamashev",
    "Maine Prince",
    "Cobb Raring",
    "John Tournour",
    "John Kofi Osei-Tutu",
]


USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0 Safari/537.36"
)

LINKEDIN_RE = re.compile(
    r"https?://(?:[a-z]{2,3}\.)?linkedin\.com/in/[A-Za-z0-9\-_%]+/?",
    re.IGNORECASE,
)


@dataclass
class Hit:
    name: str
    url: str
    source: str


def _http_get(url: str, timeout: int = 15) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
    return data.decode("utf-8", errors="replace")


def _build_query(name: str, hint: str | None) -> str:
    pieces = [f'"{name}"', "linkedin"]
    if hint:
        pieces.append(hint)
    return " ".join(pieces)


def search_duckduckgo(name: str, hint: str | None = None) -> str | None:
    """Use DuckDuckGo's HTML endpoint to find a LinkedIn URL."""
    query = _build_query(name, hint) + " site:linkedin.com/in"
    url = "https://duckduckgo.com/html/?q=" + urllib.parse.quote_plus(query)
    try:
        html = _http_get(url)
    except Exception as exc:  # noqa: BLE001
        print(f"  duckduckgo failed for {name!r}: {exc}", file=sys.stderr)
        return None

    # DDG wraps real URLs in /l/?uddg=<encoded>; unwrap them first.
    for match in re.finditer(r"/l/\?[^\"']*uddg=([^&\"']+)", html):
        decoded = urllib.parse.unquote(match.group(1))
        m = LINKEDIN_RE.search(decoded)
        if m:
            return m.group(0)

    direct = LINKEDIN_RE.search(html)
    return direct.group(0) if direct else None


def search_bing(name: str, hint: str | None = None) -> str | None:
    """Fallback: scrape Bing search results."""
    query = _build_query(name, hint) + " site:linkedin.com/in"
    url = "https://www.bing.com/search?q=" + urllib.parse.quote_plus(query)
    try:
        html = _http_get(url)
    except Exception as exc:  # noqa: BLE001
        print(f"  bing failed for {name!r}: {exc}", file=sys.stderr)
        return None
    m = LINKEDIN_RE.search(html)
    return m.group(0) if m else None


def find_profile(name: str, hint: str | None = None) -> Hit:
    for source, fn in (("duckduckgo", search_duckduckgo), ("bing", search_bing)):
        url = fn(name, hint)
        if url:
            return Hit(name=name, url=url, source=source)
        time.sleep(1)  # be polite between providers
    return Hit(name=name, url="", source="not found")


def write_excel(hits: Iterable[Hit], out_path: str) -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "LinkedIn Profiles"

    headers = ["Name", "LinkedIn URL", "Source", "Verified"]
    ws.append(headers)

    header_fill = PatternFill("solid", fgColor="1F4E78")
    header_font = Font(bold=True, color="FFFFFF")
    for col_idx, _ in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="left", vertical="center")

    for hit in hits:
        ws.append([hit.name, hit.url, hit.source, ""])

    widths = {1: 28, 2: 60, 3: 16, 4: 12}
    for col_idx, width in widths.items():
        ws.column_dimensions[get_column_letter(col_idx)].width = width

    ws.freeze_panes = "A2"
    wb.save(out_path)


def load_names(path: str | None) -> list[str]:
    if not path:
        return DEFAULT_NAMES
    with open(path, encoding="utf-8") as f:
        names = []
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            names.append(line)
    return names


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("names_file", nargs="?", help="text file with one name per line")
    parser.add_argument("--out", default="linkedin_profiles.xlsx", help="Excel output path")
    parser.add_argument("--hint", default="", help="extra search context, e.g. 'NHL sports agent'")
    parser.add_argument("--delay", type=float, default=2.0, help="seconds between names")
    args = parser.parse_args()

    names = load_names(args.names_file)
    hint = args.hint or None

    hits: list[Hit] = []
    for i, name in enumerate(names, start=1):
        print(f"[{i}/{len(names)}] {name}")
        hit = find_profile(name, hint)
        marker = hit.url or "<not found>"
        print(f"  -> {marker}  ({hit.source})")
        hits.append(hit)
        if i < len(names):
            time.sleep(args.delay)

    write_excel(hits, args.out)
    found = sum(1 for h in hits if h.url)
    print(f"\nWrote {args.out}: {found}/{len(hits)} profiles found")
    return 0


if __name__ == "__main__":
    sys.exit(main())
