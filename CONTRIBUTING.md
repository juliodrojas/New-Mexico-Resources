# Contributing

This project is maintained by Julio, Jazmin, and Will, with Claude ("Claudio") doing the research and build work. If you're part of the team — or forking this for your own region — here's how the pieces fit together.

## Where edits actually go

**The spreadsheet is the source of truth, not the website.** `index.html` is *generated* from `data/abq_unm_resource_dataset.xlsx` — never hand-edit `index.html` directly, since any change will be overwritten the next time the site is regenerated.

To add, correct, or remove a resource:
1. Edit the **Master Dataset** tab in `data/abq_unm_resource_dataset.xlsx`
2. If you're unsure whether a detail is accurate, set its **Status** column to `Needs Verification` rather than guessing — log it in the **Verification Queue** tab so someone can confirm it later
3. Run `python3 scripts/generate_site.py` to regenerate `index.html` from the updated spreadsheet
4. Commit both the spreadsheet and the regenerated `index.html` together

## Adding curated relationships

Resources can point directly to related resources (e.g., El Centro de la Raza → Transformar Fellowship) via the **Related Resources (curated)** column in the spreadsheet — enter the *exact* resource name(s), separated by semicolons, matching the **Resource Name** column exactly. If the name doesn't match exactly, the link silently won't show up on the site, so double-check spelling/punctuation.

## Editing the site itself (not the data)

- `css/styles.css` — all styling
- `js/app.js` — all site logic, including the router (`navigate()`, `applyRoute()`), search/filter logic, and rendering functions
- `templates/index.template.html` — the HTML shell; contains a `__DATA__` placeholder that `generate_site.py` fills in

After editing any of these, run `python3 scripts/generate_site.py` again to rebuild `index.html`.

## Before committing

- Run `node --check js/app.js` to catch syntax errors (or let the CI workflow do it automatically on push)
- If you added a new resource, verify the source URL actually works and reflects what you wrote
- Never add fabricated content — reviews, testimonials, or "facts" you haven't verified against a real source. If uncertain, mark it `Needs Verification` instead of guessing.

## Reporting a problem with a specific resource

Use the "Report an issue" button on that resource's page in the live site (opens a pre-filled email), or open a GitHub Issue referencing the resource name directly.
