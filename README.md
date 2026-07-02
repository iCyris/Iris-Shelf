# Iris Shelf

A Vite + React shelf for self-contained Iris HTML reports.

The project is intentionally small:

- Put finished report HTML files in `public/reports/`.
- Run `npm run build`.
- The prebuild step scans reports and writes `src/generated/reports.ts`.
- Deploy the `docs/` output via GitHub Pages (set source to `/docs` on the `main` branch).

## Add A Report

Save a complete HTML file here:

```text
public/reports/my-report.html
```

Recommended metadata:

```html
<meta name="iris:title" content="Readable report title">
<meta name="iris:summary" content="One sentence summary for the shelf index.">
<meta name="iris:date" content="2026-07-01">
<meta name="iris:mode" content="standard analysis">
<meta name="iris:tags" content="strategy, product, research">
```

Then run:

```bash
npm run build
```

The report will appear on the homepage and remain available at:

```text
/reports/my-report.html
```

## GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set `Source` to `Deploy from a branch`, choose `main` branch and `/docs` folder.
4. (Optional) Set a custom domain — edit the `CNAME` file at the repo root with your domain, then rebuild.
5. Push to `main`.

## Scripts

- `npm run dev`: start local development.
- `npm run index`: regenerate the report manifest.
- `npm run build`: generate the manifest, type-check, build, and write the GitHub Pages fallback.
- `npm run preview`: preview the production build.

## Design Direction

The shelf follows the Iris visual system: editorial paper, fine rules, compact metadata, restrained accent ink, and report-first hierarchy. It avoids a landing-page frame so the first screen is already the shelf surface.
