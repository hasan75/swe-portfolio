# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Field Manual — Vol. 01" is a handcrafted static portfolio website for Hasan Ahmed (software engineer). No build system, no framework, no npm — pure HTML, CSS, and minimal vanilla JS served as-is.

## Development

No build step required. Edit files and open directly in a browser, or serve with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

No linting or test infrastructure exists.

## Architecture

### File Structure

Each page is a self-contained HTML file with embedded `<style>` blocks for page-specific styles:

| File | Section |
|---|---|
| `index.html` | § 01 — Hero / Opening |
| `About.html` | § 02 — About |
| `Work.html` | § 03 — Selected Work |
| `Research.html` | § 04 — Research |
| `Now.html` | § 05 — Now |
| `Notes.html` | § 06 — Notes index |
| `Notes - Data Fetching in Nuxt 4.html` | § 06b — Extended note |
| `Commits.html` | § 07 — Commits |
| `Education.html` | § 08 — Education |
| `Colophon.html` | § 09 — Colophon (design reference) |

### Shared Design System (`_field-manual.css`)

All pages link `_field-manual.css`, which owns the entire design token system, masthead, and navigation rail. **All styling should use these tokens — never hardcode colors, spacing, or type sizes.**

**Key tokens:**
- Colors: `--bg-page` (#151310), `--fg-primary` (#E8E1D1), `--accent` (#C8391C)
- Type: `--ff-serif` (Source Serif 4), `--ff-mono` (JetBrains Mono)
- Spacing: `--sp-1` (4px) → `--sp-11` (192px)
- Layout: `--page-max` (1280px), `--marginalia` (220px), `--measure-reading` (62ch)

### Page Layout Pattern

Every page follows this structure:
1. Fixed **masthead** (top bar with site title and section label)
2. Fixed **navigation rail** (left sidebar with section links)
3. Main content in a **two-column grid**: `--marginalia` wide left column + body
4. Responsive breakpoints at 880px (tablet) and 420px (mobile) — fully redesigned, not just compressed

### JavaScript Conventions

JS is minimal and inline per-page. Patterns used:
- `IntersectionObserver` for scroll-based section label updates
- `localStorage` for persisting variant/theme picker state
- Staggered reveal animations via `requestAnimationFrame` / CSS class toggling
- Respects `prefers-reduced-motion` (check before adding any animations)

## Design Principles

See `Colophon.html` for the typography specimen, color palette swatches, and design rationale. The site deliberately avoids JavaScript frameworks — keep it that way.
