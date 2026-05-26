# Fixes & Pending Content

Items flagged during content audit on 2026-05-26.

---

## Empty Links (`href="#"`) — Need Real URLs

### Research.html

| Line | Link Text | Status |
|------|-----------|--------|
| 501 | Read paper (PDF) | No PDF linked |
| 502 | DOI · IJEECS | No DOI URL |
| 503 | View code on GitHub | No GitHub repo linked |
| 607 | Hardware notes | No URL |
| 608 | Request early draft | No URL |

### Work.html

| Line | Link Text | Status |
|------|-----------|--------|
| 505 | Product site | No URL |
| 507 | Case study | No URL |
| 508 | Architecture notes | No URL |
| 555 | Writeup | No URL |

---

## TBD Content

### Research.html

| Line | Content | Note |
|------|---------|------|
| 534 | `target venue TBD` | Draft manuscript, venue not yet decided |

---

## Intentional / OK

These use `href="#"` by design — they are contact-intent links, not destinations:

- `Work.html` — "Reference on request" (lines 364, 412, 556)
- `Work.html` — "Design notes on request" (line 460)
- `Research.html` — "Request early draft" (line 608) — borderline; could become a mailto
