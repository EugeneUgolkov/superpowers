# LinkedIn Profile Finder

Best-effort lookup of LinkedIn profiles for a list of names, written to an Excel file.

## Files
- `find_linkedin_profiles.py` — search script (DuckDuckGo HTML + Bing fallback, no API key needed).
- `names.txt` — input list of people (sports agents / NHL professionals).
- `linkedin_profiles.xlsx` — pre-populated results from manual web search verification.

## Usage

```bash
pip install openpyxl
python find_linkedin_profiles.py names.txt --out linkedin_profiles.xlsx --hint "NHL sports agent"
```

Each result row has: Name, LinkedIn URL, Source, Verified. The `Verified` column is left
blank for a human reviewer — search results can collide on common names, so always confirm
the profile matches the right person before using the URL.
