"""
Regenerates index.html from data/abq_unm_resource_dataset.xlsx and
templates/index.template.html.

Usage (from the repo root):
    python3 scripts/generate_site.py

Requires: openpyxl (pip install openpyxl --break-system-packages)
"""
import os
import json
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX_PATH = os.path.join(ROOT, "data", "abq_unm_resource_dataset.xlsx")
TEMPLATE_PATH = os.path.join(ROOT, "templates", "index.template.html")
OUTPUT_PATH = os.path.join(ROOT, "index.html")

DOMAIN_BUCKET_MAP = {
    "Housing": "Housing", "Housing / Health / Recreation / Education": "Housing",
    "Housing / Homeownership": "Housing", "Housing / Legal Rights": "Housing",
    "Shelter / Housing": "Housing", "Shelter / DV": "Housing", "Shelter / Multi-Service": "Housing",
    "Food": "Food", "Food / Multi-Service": "Food", "Financial / Food": "Food",
    "Clothing / School Supplies": "Food", "Food / Financial": "Food", "Food / Clothing": "Food",
    "Food / Financial / Identity-Based": "Food",
    "Financial": "Financial & Banking", "Financial / Banking": "Financial & Banking",
    "Financial / Homeownership": "Financial & Banking", "Financial / Tax Credits": "Financial & Banking",
    "Financial / Tax Info": "Financial & Banking", "Financial Aid / Education": "Financial & Banking",
    "Financial / Health": "Financial & Banking", "Emergency Relief": "Financial & Banking",
    "Disaster Relief": "Financial & Banking", "Financial / Grants": "Financial & Banking",
    "Healthcare": "Healthcare", "Health & Wellness": "Healthcare", "Immigrant-Specific / Healthcare": "Healthcare",
    "Behavioral Health": "Healthcare",
    "Employment": "Employment & Workforce", "Employment / Self-Employment": "Employment & Workforce",
    "Employment / Education": "Employment & Workforce", "Employment / Business": "Employment & Workforce",
    "Career": "Employment & Workforce", "Academic / Career": "Employment & Workforce",
    "Workforce": "Employment & Workforce", "Disability / Employment": "Employment & Workforce",
    "Academic": "Education & Academic Support", "Academic Support": "Education & Academic Support",
    "Academic Success": "Education & Academic Support", "Academic Advising (General)": "Education & Academic Support",
    "Academic / Cultural": "Education & Academic Support", "Graduate Students": "Education & Academic Support",
    "International Students": "Education & Academic Support", "Mentoring": "Education & Academic Support",
    "Community Engagement": "Education & Academic Support", "Study Abroad Funding": "Education & Academic Support",
    "Accessibility": "Education & Academic Support", "Education": "Education & Academic Support",
    "Legal": "Legal & Civic", "Legal / Consumer Protection": "Legal & Civic",
    "Legal / Domestic Violence": "Legal & Civic", "Civic": "Legal & Civic", "Civic / Cultural": "Legal & Civic",
    "Civic / Economic": "Legal & Civic", "Civic / Financial": "Legal & Civic", "Civic / Legal Hub": "Legal & Civic",
    "Civil Rights / Legal": "Legal & Civic", "Civil Rights / Worker Justice": "Legal & Civic",
    "Civil Rights / Worker Rights": "Legal & Civic", "Safety": "Legal & Civic", "Legal & Civic": "Legal & Civic",
    "Identity-Based": "Identity & Cultural", "Identity-Based / Cultural": "Identity & Cultural",
    "Cultural / Faith": "Identity & Cultural", "Cultural / Faith-Adjacent": "Identity & Cultural",
    "Cultural / Identity": "Identity & Cultural", "Cultural / Multi-Service": "Identity & Cultural",
    "Direct Service / Faith": "Identity & Cultural", "Identity & Cultural": "Identity & Cultural",
    "Senior / Disability": "Senior & Disability", "Senior Services": "Senior & Disability", "Disability": "Senior & Disability",
    "Senior & Disability": "Senior & Disability",
    "Child Welfare": "Family & Childcare", "Youth & Family": "Family & Childcare", "Youth / Health": "Family & Childcare",
    "Utilities": "Utilities",
    "Veterans": "Veterans", "Veterans / Education": "Veterans", "Veterans/Military": "Veterans",
    "General Hub": "General Hub / Directory", "General Hub / Multi-Service": "General Hub / Directory",
    "Multi-Service": "General Hub / Directory", "Multi-Service Hub": "General Hub / Directory",
    "Resettlement / Multi-Service": "General Hub / Directory", "Community Directory": "General Hub / Directory",
    "Hidden/Unadvertised": "General Hub / Directory",
    "Immigrant-Specific": "Immigrant & ITIN Resources",
    "Transportation": "General Hub / Directory",
    "Low-income households — HISTORICAL/DISCONTINUED": "Utilities",
}
IMMIGRANT_KEYWORDS = ["immigrant", "itin", "undocumented", "daca", "refugee", "asylee",
                      "asylum", "non-citizen", "noncitizen", "matrícula"]


def build_rows():
    wb = openpyxl.load_workbook(XLSX_PATH)
    ws = wb["Master Dataset"]
    rows = []
    for r in ws.iter_rows(min_row=2, values_only=True):
        if r[0] is None:
            continue
        item = {
            "id": r[0], "level": r[1], "domain": r[2], "sub": r[3], "name": r[4],
            "org": r[5], "what": r[6], "how": r[7], "elig": r[8], "contact": r[9],
            "url": r[10], "status": r[11], "hidden": r[12], "related": r[14] or "",
            "lat": r[15], "lng": r[16],
        }
        item["bucket"] = DOMAIN_BUCKET_MAP.get(item["domain"], "General Hub / Directory")
        blob = " ".join(str(item.get(k, "")) for k in
                         ["domain", "sub", "name", "org", "what", "how", "elig"]).lower()
        item["immigrant_tag"] = any(k in blob for k in IMMIGRANT_KEYWORDS)
        rows.append(item)
    return rows


def main():
    rows = build_rows()
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()
    final_html = template.replace("__DATA__", json.dumps(rows, separators=(",", ":")))
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(final_html)
    print(f"Generated {OUTPUT_PATH} with {len(rows)} resources.")


if __name__ == "__main__":
    main()
