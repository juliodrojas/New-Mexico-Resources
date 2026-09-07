# New Mexico Resource Navigator

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Resources](https://img.shields.io/badge/resources-225%2B-2fa093.svg)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)
![Bilingual](https://img.shields.io/badge/language-EN%20%2F%20ES-orange.svg)

A searchable, bilingual directory of 225+ federal, state, county/city, university, and community resources across New Mexico — housing, food, financial aid, healthcare, employment, education, legal aid, and ITIN/immigrant-specific resources.

**Not an official government website.** This is a community-compiled project, built to help people — especially students, immigrants, and families in need — actually find real help fast, without needing to know which of dozens of agencies to search first.

## Live features

- **Quick-start situational guide** — six real-life situations ("I need a place to stay tonight," "I don't have a Social Security Number," etc.) that route straight to curated resources, no category-browsing required
- **Keyword-matching assistant** — a "tell us what's going on" box that suggests relevant resources from free text (explicitly labeled as keyword matching, not AI)
- **Interactive map** — resources with known addresses plotted on a free OpenStreetMap-based map (pin locations are approximate — see in-app disclaimer)
- **Bilingual** — full English/Spanish toggle for the site's navigation, filters, and framing (individual resource descriptions remain in English)
- **Crisis fast-path** — a persistent "Need help right now?" button surfacing shelter and crisis-line resources from anywhere on the site
- **Curated resource relationships** — hand-verified connections between resources (e.g., El Centro de la Raza → Transformar Fellowship), not just generic category matching
- **Eligibility checklists** — auto-parsed from each resource's eligibility text into a scannable list
- **Deep-linkable resource pages** — every resource has its own shareable URL (`#r-<id>`)
- **Print-friendly** — clean printable version of any resource page
- **ITIN/immigrant filter** — surfaces resources relevant regardless of immigration status

## Structure

```
nm-resource-navigator/
├── index.html                          # The rendered site — open this directly, or host it
├── css/
│   └── styles.css                      # All styling
├── js/
│   └── app.js                          # All site logic (search, filters, map, i18n, etc.)
├── templates/
│   └── index.template.html             # HTML shell with a __DATA__ placeholder
├── scripts/
│   ├── build_dataset.py                # Builds data/abq_unm_resource_dataset.xlsx from scratch
│   └── generate_site.py                # Regenerates index.html from the spreadsheet + template
├── data/
│   └── abq_unm_resource_dataset.xlsx   # The dataset — source of truth
├── LICENSE
└── README.md
```

## Running it

**Just viewing the site:** no build step, no dependencies. Open `index.html` directly in a browser, or serve the folder with any static file server.

**Regenerating the site after editing the spreadsheet:**
```bash
pip install openpyxl --break-system-packages   # if not already installed
python3 scripts/generate_site.py
```
This reads `data/abq_unm_resource_dataset.xlsx`, re-buckets every resource into a category, and rewrites `index.html` from `templates/index.template.html`. Run it any time the spreadsheet changes.

**Rebuilding the dataset from scratch:** `scripts/build_dataset.py` contains the full research-to-spreadsheet pipeline used to build the dataset originally (225 resources across federal/state/county/university/community levels, with sources cited per entry). Most contributors will only need `generate_site.py` — `build_dataset.py` is there for reference and for anyone extending the dataset programmatically rather than by hand in Excel.

To host it live for free:
1. Push this repo to GitHub
2. In the repo settings, enable **GitHub Pages**, pointing at the root of the `main` branch
3. The site will be live at `https://<your-username>.github.io/<repo-name>/`

## The dataset

`data/abq_unm_resource_dataset.xlsx` is the actual source of truth — the website is generated from it, not hand-written. It includes several tabs beyond the main resource list:

- **Master Dataset** — every resource, with organization, eligibility, contact info, source URL, verification status, and curated relationships to other resources
- **Tree Overview** — coverage summary by level and domain
- **Verification Queue** — tracks entries needing a second look, flagged conflicts, and stale/time-sensitive information
- **Roadmap** / **Feature Roadmap** — research and feature-development tracking
- **Team Notes** — a shared collaboration log

If you edit the spreadsheet and want to regenerate the site from it, the build script (`build_dataset.py`, used during development) reads the spreadsheet and re-exports the data embedded in `index.html`.

## A note on accuracy

Every entry is sourced from a public agency page or an organization's own materials, but programs, hours, and eligibility rules change. Entries marked "Needs Verification" in the dataset haven't been independently confirmed. Treat this as a strong starting point — always verify directly with an organization before relying on time-sensitive information.

## Contributing

This project is actively maintained by a small team. See [CONTRIBUTING.md](CONTRIBUTING.md) for how edits flow through the spreadsheet, how to regenerate the site, and what to check before committing.
