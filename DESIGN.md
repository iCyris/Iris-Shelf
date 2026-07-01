# Design Notes

## Visual Theme and Atmosphere

Simple editorial shelf, closer to a quiet reading shelf than a workspace. The surface should feel like Iris: paper, precise rules, strong title typography, and calm article cards.

## Color Palette and Roles

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f4f2ed` | Page canvas |
| `--surface` | `#fbfaf6` | Main sheet and inputs |
| `--ink` | `#101010` | Primary text |
| `--muted` | `#66635e` | Metadata and secondary text |
| `--line` | `#d3d0c7` | Structural rules |
| `--accent` | `#545f80` | Faded ink accent |
| `--accent-2` | `#8caf9a` | Reserved secondary accent |
| `--haze` | `#d8dbea` | Soft evidence wash |

## Typography Rules

Display uses `Avenir Next` with CJK system fallbacks. Body copy uses system sans for interface text and Charter/Songti-style serif fallbacks for editorial prose. Letter spacing stays `0` to match Iris and avoid cramped Chinese rendering.

## Component Stylings

Report cards are the primary component. Each card is a single link to a self-contained HTML report, with date, title, short summary, and tags. Keep card treatment quiet: fine border, paper surface, subtle hover lift, no decorative icons.

## Layout Principles

Use one title block followed by a responsive card grid. Avoid nav bars, filters, status strips, method sections, side notes, and explanatory chrome unless the shelf becomes too large to scan.

## Depth and Elevation

One main sheet sits above the paper canvas with a soft shadow and inset white line. Article cards use a light surface step and a fine border; hover may add a small shadow but should stay restrained.

## Do's and Don'ts

- Do keep report HTML portable and self-contained.
- Do keep the homepage as title plus report cards.
- Do use thin rules, compact labels, and quiet accent ink.
- Do keep mobile as a single reading column.
- Don't add decorative badges, logo marks, filters, or dashboards.
- Don't turn the shelf into a marketing landing page.

## Responsive Behavior

Cards use `auto-fit` with a 300px minimum width. At mobile widths, the page becomes a full-width paper sheet with one card per row.

## Agent Prompt Guide

- Add a report card using `--surface: #fbfaf6`, `--hairline`, 22px padding, title at 24-32px/1.08, summary in serif 15px/1.72, tags in `--mono` 10px uppercase.
- Add a new homepage section only if it contains report cards or a short collection title. Keep it below the main title and avoid extra explanatory panels.
- Add a compact collection heading with `--mono` 10px uppercase kicker, `--display` title, and a simple card grid beneath it.
