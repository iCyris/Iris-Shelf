# AGENTS.md

## What this project is

Iris Shelf is a Vite + React static shelf that renders self-contained HTML reports as an editorial card grid. It deploys to GitHub Pages via Actions.

## Where reports live

When you generate an HTML report via the Iris skill, place it in:

```
public/reports/<slug>.html
```

The prebuild script (`scripts/sync-reports.mjs`) scans this directory and auto-generates `src/generated/reports.ts`, which drives the homepage card grid.

## Report metadata

Every report HTML must include these `<meta>` tags in `<head>` so the indexer can extract structured data:

```html
<meta name="iris:title" content="Readable Report Title">
<meta name="iris:summary" content="One-sentence summary for the shelf card.">
<meta name="iris:date" content="2026-07-01">
<meta name="iris:mode" content="analysis">
<meta name="iris:tags" content="strategy, product, research">
```

Optional: `iris:id`, `iris:language`, standard `og:title` / `description` / `og:description` fallbacks are also supported.

## Workflow after adding a report

```bash
npm run build    # runs prebuild (sync-reports) → tsc → vite build → write 404 fallback
```

Or during development:

```bash
npm run dev      # Vite dev server on port 5174
npm run index    # regenerate src/generated/reports.ts only
```

## Design constraints

- Keep reports self-contained (no external CSS/JS dependencies).
- The shelf surface is editorial and restrained — no badges, icons, filters, or marketing chrome.
- Card grid uses `auto-fit` with 300px minimum; mobile is single-column.
- Color tokens: `--paper: #f4f2ed`, `--surface: #fbfaf6`, `--ink: #101010`, `--accent: #545f80`.
- Typography: `Avenir Next` for display, system sans for UI, Charter/serif fallback for editorial body.
