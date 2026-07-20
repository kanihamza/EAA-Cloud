# DGO Digital Ops Design System

**A complete, production-ready sub-brand of NITDA** — designed for operational dashboards, workflow tools, email systems, and internal government digital services.

---

## About DGO Digital Ops

**DGO** (Digital Ops) is the operational arm of NITDA's digital infrastructure — the suite of tools, dashboards, and workflows that power internal agency operations, inter-agency collaboration, and citizen-facing service portals.

While **NITDA** is the public-facing institutional brand (formal, governmental, Deep Green `#05583B`), **DGO Digital Ops** is its digital operations counterpart: designed for speed, clarity, and daily use by government staff, developers, and service administrators.

**Relationship to NITDA**
- DGO inherits NITDA's geometric vocabulary (the atomic-orbit motif, Outfit typeface lineage, governmental formality).
- DGO differentiates through color (retains Deep Green as primary for continuity), density (compact layouts for data-heavy workflows), and tone (operational precision vs. institutional gravitas).
- Every DGO surface carries the endorsement line: **"An initiative of NITDA"** — ensuring the parent brand's authority is visible.

---

## What's Inside

```
dgo_digital_ops/
├── README.md                     ← you are here
├── GUIDELINES.md                 ← brand rules, tone, usage
├── tokens.css                    ← complete design token system (standalone)
├── components.css                ← all component styles
├── assets/
│   ├── logo-primary.svg          ← DGO wordmark (Deep Green)
│   ├── logo-stacked.svg          ← stacked variant
│   ├── logo-mark.svg             ← atomic-O mark only
│   ├── logo-white-out.svg        ← white-out on green
│   └── endorsement.svg           ← "An initiative of NITDA" lockup
├── preview/                      ← design system tab cards
│   ├── brand-logo.html
│   ├── colors-primary.html
│   ├── colors-semantic.html
│   ├── typography.html
│   ├── components-buttons.html
│   ├── components-inputs.html
│   ├── components-cards.html
│   ├── components-tables.html
│   ├── components-modals.html
│   ├── components-navigation.html
│   └── ... (20+ component cards)
├── ui_kits/
│   ├── dashboard/                ← operational dashboard kit
│   ├── email_templates/          ← bulk, single, notification templates
│   └── landing/                  ← DGO landing page
├── templates/
│   ├── letterhead.html           ← memo/letter template
│   ├── report.html               ← operational report
│   └── presentation.html         ← slide deck shell
└── examples/
    ├── app_shell.html            ← full app scaffold with nav + routing
    └── data_table.html           ← advanced table with filters, sorting, pagination
```

---

## Design Principles

1. **Clarity over decoration** — Every pixel serves operational efficiency.
2. **Compact by default** — Dense tables, tight padding, more data visible without scrolling.
3. **WCAG AAA contrast** — Government services must be accessible to all citizens.
4. **Speed** — Fast load times, minimal dependencies, progressive enhancement.
5. **NITDA-endorsed** — Always carry the parent brand's authority.

---

## Quick Start

### For Designers
1. Read `GUIDELINES.md` for brand rules and usage.
2. Explore `preview/` cards in the Design System tab.
3. Copy components from `ui_kits/` as starting points.

### For Developers
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DGO Digital Ops</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="components.css">
</head>
<body class="dgo">
  <header class="dgo-header">
    <div class="dgo-mark">
      <span class="word">DG<span class="o-orbit"><span class="dot"></span></span></span>
      <span class="sub">DIGITAL OPS</span>
    </div>
    <div class="dgo-endorse">An initiative of NITDA</div>
  </header>
  
  <main class="dgo-container">
    <h1>Operational Dashboard</h1>
    <button class="dgo-btn dgo-btn-primary">Create Task</button>
  </main>
</body>
</html>
```

---

## Token Philosophy

DGO uses **CSS custom properties** for every value. Never hardcode colors, spacing, or type sizes.

**Colors** — `--dgo-primary`, `--dgo-accent`, `--dgo-surface-*`, `--dgo-ink-*`, `--dgo-border`  
**Type** — `--dgo-font-*`, `--dgo-fs-*`, `--dgo-fw-*`, `--dgo-lh-*`  
**Spacing** — `--dgo-space-*` (4px increments, 1–12)  
**Radius** — `--dgo-radius-*` (xs/sm/md/lg/xl/pill)  
**Shadow** — `--dgo-shadow-*` (xs/sm/md/lg/xl)  
**Motion** — `--dgo-ease-*`, `--dgo-dur-*`  

---

## Support

This is a **standalone system**. It does not import NITDA tokens — all values are defined here.

For questions or contributions, contact the NITDA Digital Operations team.

---

**Version:** 1.0.0  
**Last updated:** May 2026  
**Maintained by:** NITDA Digital Ops Team
