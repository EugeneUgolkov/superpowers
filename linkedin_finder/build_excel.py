#!/usr/bin/env python3
"""Build linkedin_profiles.xlsx from manually verified search results."""

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter


# Each row: (name, linkedin_url, role/agency notes, source)
# Source notes whether the LinkedIn profile was directly returned by search.
ROWS = [
    ("Nathan Baker", "", "Not found - too many matches with no clear sports agent", "search (no match)"),
    ("James Paul, Esq", "https://pt.linkedin.com/in/james-paul-esq-m-b-a-69953226a/", "NFL Agent / Attorney, BC Sports, Inc.", "search"),
    ("Lukman Abdulai", "https://www.linkedin.com/in/lukman-abdulai-818bb352/", "NFL Agent, WIN Sports Group (formerly CAA Football)", "search"),
    ("Paul T DeRousselle", "https://www.linkedin.com/in/paul-t-derousselle-06959859/", "NFL Agent / Attorney, Paul T. DeRousselle, Attorney at Law PLLC", "search"),
    ("Brandyn Garth", "https://ca.linkedin.com/in/brandyn-garth-883a331a7", "Co-Founder / Player Agent, Quantum Hockey Agency", "search"),
    ("Ryan Leff", "https://www.linkedin.com/in/ryan-leff-87270992", "NBA Agent, Glushon Sports Management (verify - common name)", "search (uncertain)"),
    ("Jordan Donald", "https://www.linkedin.com/in/jordan-donald/", "NFL Agent & Business Development, The Familie", "search"),
    ("Blaine Roche", "https://www.linkedin.com/in/blaineroche/", "NFL Agent / Contract Advisor, Athletes First", "search"),
    ("Felix Neboh", "https://www.linkedin.com/in/felix-neboh-737275248", "NFL Agent / Attorney, Milk and Honey Sports / Chavez Law Firm", "search"),
    ("Joe Caligiuri", "https://www.linkedin.com/in/joe-caligiuri-26ab84130/", "NHLPA & PHPA Certified Player Agent, CAL Sports Management", "search"),
    ("DJ Dermitt", "", "Not found - possibly DJ Demeritt (LOGOsports, NFL Agent) - verify spelling", "search (no match)"),
    ("Drew Koehler", "https://www.linkedin.com/in/drew-koehler-42a899195/", "NFL Agent, LAA Sports & Entertainment", "search"),
    ("Rick Valette", "https://www.linkedin.com/in/rick-valette-04199b27/", "NHLPA Certified Agent, Octagon / Valette Sports Group", "search"),
    ("Nicholas Bedford", "", "Not found on LinkedIn - CEO/NFL Agent at Elite Sports & Entertainment Firm (NFLPA #62596)", "search (no match)"),
    ("James McClendon", "", "Not found - results returned Jacques McClendon (WME Sports), different person", "search (no match)"),
    ("Tyler Urban", "https://www.linkedin.com/in/tyler-urban-62546571/", "Roc Nation - verify (the Newport Sports hockey agent named Tyler appears to be Tyler Nother)", "search (uncertain)"),
    ("Keith Mckittrich", "https://www.linkedin.com/in/keithmckittrick/", "NHLPA Certified Player Agent, Gold Star Hockey (note: actual spelling is McKittrick)", "search"),
    ("Bob Lisanti", "https://www.linkedin.com/in/bob-lisanti-6a4b3884/", "MLBPA Certified Agent, Octagon Baseball / Bo Jackson's Elite Sports", "search"),
    ("Hernan Ramos", "https://www.linkedin.com/in/hernan-ramos-4838b2113/", "CEO / Agent, SCS Rep Sports", "search"),
    ("Jeff Boston", "https://www.linkedin.com/in/jeff-boston-11b716210/", "NHLPA Certified Agent, Roy Hockey Group / RSG Hockey", "search"),
    ("Long Diep", "https://www.linkedin.com/in/long-diep-68a300207/", "Upcoming NFL Agent", "search"),
    ("Adrian Soun", "https://www.linkedin.com/in/adrian-soun-b5691343/", "Vice President, Import Sports Management (hockey)", "search"),
    ("Nick Riopel", "https://www.linkedin.com/in/nick-riopel-4332a6b9/", "President / Hockey Player Agent, Propulsion Sports Agency", "search"),
    ("Sean Russi", "https://www.linkedin.com/in/srussi2345/", "Reliance Sports Agency", "search"),
    ("Don Weatherell", "https://www.linkedin.com/in/don-weatherell-550421218/", "NFL Agent, Klutch Sports Group, LLC", "search"),
    ("Ken Sarnoff", "https://www.linkedin.com/in/ken-sarnoff-49b9b312/", "NFL Agent / Attorney, 1 of 1 Agency (formerly Lagardere Unlimited)", "search"),
    ("Drew Campbell", "https://www.linkedin.com/in/drew-campbell-afa/", "CEO / NFL Agent, Athlete Factory Agency", "search"),
    ("Rand Simon", "https://ca.linkedin.com/in/randsimon", "NHLPA Certified Agent, Newport Sports Management", "search"),
    ("Elroy Vazover Jr.", "", "Not found - verify spelling", "search (no match)"),
    ("Kim Miale", "https://www.linkedin.com/in/kim-miale-3199a4", "General Counsel & Co-Head of Football, Roc Nation Sports (NFL Agent)", "search"),
    ("Randy Robitaille", "https://ca.linkedin.com/in/randy-robitaille-7b9a57103", "NHLPA Certified Agent, Edge Sports Management (former NHL player)", "search"),
    ("Renat Mamashev", "https://www.linkedin.com/in/renat-mamashev-b0aa28165/", "NHL & KHL Certified Agent, Raze Sports (former KHL defenseman)", "search"),
    ("Maine Prince", "https://www.linkedin.com/in/maineprince/", "NFL Agent / Business Manager, Prince Management Group", "search"),
    ("Cobb Raring", "https://www.linkedin.com/in/cobb-raring-204b4a196/", "NFL Agent, KMM Sports", "search"),
    ("John Tournour", "https://www.linkedin.com/in/john-tournour-15985111", "Sports radio host (JT The Brick), Las Vegas Raiders / SiriusXM", "search"),
    ("John Kofi Osei-Tutu", "https://www.linkedin.com/in/john-kofi-osei-tutu-25307034/", "NHLPA Registered Agent / Attorney, The OT Sports Group, LLC", "search"),
]


def build(out_path: str = "linkedin_profiles.xlsx") -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "LinkedIn Profiles"

    headers = ["Name", "LinkedIn URL", "Role / Agency", "Source", "Verified"]
    ws.append(headers)

    header_fill = PatternFill("solid", fgColor="1F4E78")
    header_font = Font(bold=True, color="FFFFFF")
    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="left", vertical="center")

    not_found_fill = PatternFill("solid", fgColor="FFF2CC")
    uncertain_fill = PatternFill("solid", fgColor="FFE4B5")

    for name, url, role, source in ROWS:
        ws.append([name, url, role, source, ""])
        row_idx = ws.max_row
        if "no match" in source:
            for c in range(1, len(headers) + 1):
                ws.cell(row=row_idx, column=c).fill = not_found_fill
        elif "uncertain" in source:
            for c in range(1, len(headers) + 1):
                ws.cell(row=row_idx, column=c).fill = uncertain_fill

        if url:
            link_cell = ws.cell(row=row_idx, column=2)
            link_cell.hyperlink = url
            link_cell.font = Font(color="0563C1", underline="single")

    widths = {1: 28, 2: 64, 3: 60, 4: 22, 5: 12}
    for col_idx, width in widths.items():
        ws.column_dimensions[get_column_letter(col_idx)].width = width

    for row in ws.iter_rows(min_row=1, max_row=ws.max_row):
        for cell in row:
            cell.alignment = Alignment(vertical="center", wrap_text=True)

    ws.freeze_panes = "A2"

    found = sum(1 for r in ROWS if r[1])
    print(f"Writing {out_path}: {found}/{len(ROWS)} profiles populated")
    wb.save(out_path)


if __name__ == "__main__":
    build()
