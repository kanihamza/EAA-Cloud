# DGO Digital Ops Design System — Complete & Standalone

**Version 1.0.0** — Production-ready, fully provisioned sub-brand system

---

## What's Inside

This is the **complete DGO Digital Ops design system** — a standalone, production-ready sub-brand of NITDA. Every component, token, variant, and asset needed to build operational dashboards, email workflows, and government digital services.

### Core System
- **`tokens.css`** — All design tokens (colors, type, spacing, radius, shadows, motion) — 150+ CSS variables, zero dependencies
- **`components.css`** — 20+ production components (buttons, inputs, cards, tables, modals, navigation, alerts, badges, etc.)
- **`GUIDELINES.md`** — Complete brand rules (tone, logo usage, accessibility, applications)
- **`README.md`** — Quick-start guide and system overview

### Brand Assets
- **`assets/`** — 5 logo variants (horizontal, stacked, mark-only, white-out, endorsement) as SVG
- **`assets/logos.html`** — Interactive logo gallery with usage notes

### Preview Cards (Design System Tab)
16 preview cards registered across 5 groups:
- **Brand** — Logo variants
- **Colors** — Primary, semantic, status (7 operational states)
- **Type** — Outfit display + Verdana body, full scale
- **Components** — Buttons, inputs, cards, badges, tables, navigation, modals, alerts
- **Spacing** — Spacing scale (4px increments), radius, elevation (green-tinted shadows)

### UI Kits
- **`ui_kits/dashboard/`** — Full operational dashboard with sidebar, stats, tasks, activity feed
- **`ui_kits/email_templates/`** — 3 responsive email templates (single task, bulk announcement, status update)

### Implementation Examples
- **`examples/app-shell.html`** — Complete app scaffold with routing, sidebar, header, 6 pages (dashboard, tasks, messages, reports, users, settings)

---

## Design Principles

1. **Clarity over decoration** — Every pixel serves operational efficiency
2. **Compact by default** — Dense tables, tight padding, more data visible
3. **WCAG AAA contrast** — Government services must be accessible
4. **Speed** — Fast load, minimal deps, progressive enhancement
5. **NITDA-endorsed** — Always carry parent brand authority

---

## Quick Start

### For Designers
1. Read **`GUIDELINES.md`** for brand rules
2. Explore **`preview/`** cards in Design System tab
3. Copy from **`ui_kits/`** or **`examples/`** to start

### For Developers
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="dgo_digital_ops/tokens.css">
  <link rel="stylesheet" href="dgo_digital_ops/components.css">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>
<body class="dgo">
  <div class="dgo-sidebar">
    <div class="dgo-mark on-dark">
      <div class="word">DG<span class="o-orbit"></span></div>
      <div class="sub">DIGITAL OPS</div>
    </div>
  </div>
  <script>lucide.createIcons();</script>
</body>
</html>
```

---

## Token Philosophy

Every value is a CSS custom property. **Never hardcode colors, spacing, or sizes.**

```css
/* Colors */
--dgo-primary, --dgo-accent, --dgo-surface-*, --dgo-ink-*, --dgo-border

/* Type */
--dgo-font-*, --dgo-fs-*, --dgo-fw-*, --dgo-lh-*

/* Spacing */
--dgo-space-1 through --dgo-space-12 (4px increments)

/* Radius */
--dgo-radius-xs/sm/md/lg/xl/2xl/frame/pill

/* Shadow */
--dgo-shadow-xs/sm/md/lg/xl (green-tinted)

/* Motion */
--dgo-ease-standard, --dgo-dur-base
```

---

## Component Library (20+)

**Layout:** Container, Stack, Row, Grid  
**Buttons:** Primary, Secondary, Ghost, Danger, Success — 3 sizes, icon support  
**Inputs:** Text, Textarea, Select, Checkbox, Radio — with error states  
**Cards:** Standard, Hoverable, Frame  
**Badges:** 7 status + 4 semantic variants  
**Tables:** Compact, bordered, hover states  
**Navigation:** Sidebar (vertical), Horizontal tabs  
**Modals:** Header/body/footer structure  
**Alerts:** Success, warning, danger, info  
**Dropdowns, Spinners, Dividers**

---

## Color Palette

**Primary:** Deep Green `#05583B` (NITDA continuity)  
**Accent:** Smart Green `#17B255` (orbit ring, success, CTAs)  
**Neutrals:** 10-step ink scale `#1B1A1A` → `#F5F5F5`  
**Semantic:** Success, Warning, Danger, Info  
**Status (7):** Pending, Routed, Replied, Action Required, Draft, Archived, Escalated  
**Data Viz:** 8-color categorical + 5-step sequential green scale

---

## Typography

**Display/Headings:** Outfit (Google Fonts) — 400, 600, 700, 800  
**Body/UI:** Verdana (system) — 400, 600, 700  
**Monospace (optional):** SF Mono, Consolas, Courier New

**Scale:** Display (42px) → H1 (32px) → H2 (24px) → H3 (18px) → Body (14px) → Caption (11px)

---

## Spacing & Layout

**Spacing:** 4px increments, 1–12 scale (4px → 96px)  
**Density modes:** Compact (default: 8px pad, 40px rows) | Comfortable (14px pad, 52px rows)  
**Radius:** 4px → 18px (frame) + pill (999px)  
**Shadows:** Green-tinted `rgba(5,88,59,*)` for brand consistency

---

## Iconography

**System:** Lucide (outline, 2px stroke, rounded caps) via CDN  
**Sizes:** 16px (inline), 20px (UI), 24px (headers)  
**Colors:** `--dgo-primary` (actionable), `--dgo-ink-500` (decorative), `#FFFFFF` (on green)

---

## Accessibility

**Target:** WCAG 2.1 AAA  
**Contrast:** 7:1 normal text, 4.5:1 large text, 3:1 UI components  
**Keyboard:** All interactive elements Tab-reachable, 2px focus ring (`--dgo-shadow-focus`)  
**Screen readers:** Semantic HTML, labels on all inputs, `aria-live` for status  
**Motion:** Respects `prefers-reduced-motion`

---

## Endorsement Rule

Every DGO surface **must** display: **"An initiative of NITDA"**

Placements:
1. Header (top-right, small caps, muted)
2. Footer (centered/left, with NITDA address)
3. Login screen (below logo, stacked lockup)

---

## Status

**Complete:** ✅  
- Tokens (standalone, no NITDA imports)  
- Components (20+)  
- Logo suite (5 variants)  
- Preview cards (16)  
- UI kits (dashboard, email)  
- Implementation examples (app shell)  
- Brand guidelines  
- Accessibility (AAA-ready)

**Version:** 1.0.0  
**Maintained by:** NITDA Digital Ops Team  
**Last updated:** May 2026
