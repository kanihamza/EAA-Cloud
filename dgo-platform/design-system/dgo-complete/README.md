# DGO Design System v2.1

An enterprise-grade, **NITDA-endorsed** design system for Nigeria's federal digital operations — tokens, components, themes, patterns, and adoption scaffolding built to ship to government operators, agency admins, and citizens.

> **Sub-brand relationship.** DGO is the operational nervous system of NITDA. The relationship reads in three layers — logo geometry (the atomic "O" referencing infoweb), color (a sibling-shade of NITDA's institutional Deep Green), and an explicit "An Initiative of NITDA" lockup that is never omitted on official surfaces.

---

## What's in v2.1

| Pillar | Counts |
|---|---|
| **Design tokens** | 347+ across 3 tiers (primitive → semantic → component), plus the new `--dgo-cmdk-*` block |
| **Themes** | Light · Dark · High-Contrast |
| **Densities** | Comfortable · Compact |
| **Component families** | **27** (26 shipped v2.0 + `command-palette` v2.1) with full state matrices |
| **Per-component docs** | **27 of 27** §11-template fills on disk |
| **Evergreen docs** | **13** chapters (§00–§12) plus this README |
| **Icons** | 40+ outline SVG sprite, 1.5px stroke |
| **Languages** | en-NG · Yoruba · Hausa · Igbo · RTL-ready |
| **Accessibility** | WCAG 2.2 AA (AAA where the HC theme can) |
| **Governance scaffolding** | `LICENSE` · `CHANGELOG.md` · `GOVERNANCE.md` · `CONTRIBUTING.md` · `MIGRATION.md` · `INTEGRATION.md` |

---

## What's new since v2.0

v2.1 is **purely additive** — no breaking changes, no token renames, no class moves.

- **Per-family CSS split.** `styles/components.css` (the v2.0 monolith) is now reproduced as 26 family files under `styles/components/*.css`, surfaced by `styles/components/_index.css`. Both entry points ship — pick the monolith for a single drop, or the split for tree-shaking.
- **`command-palette`** family. v2.1 worked example. Keyboard-first launcher (`Ctrl/⌘ + K`); WAI-ARIA APG 1.2 combobox with `aria-activedescendant`; Tab closes by design.
- **Full documentation set.** Every `docs/00-foundations.md` through `docs/12-anti-patterns.md` lands grounded in shipped artifacts. Every shipped component family has a §11-template fill.
- **Adoption scaffolding.** `INTEGRATION.md` covers new projects, existing projects, build tools, framework adapters, SSR, tree-shaking, CDN delivery, and verifying the integration. `GOVERNANCE.md` and `CONTRIBUTING.md` set the policy and PR shape. `LICENSE`, `CHANGELOG.md`, and `MIGRATION.md` carry structural stubs with `[NITDA legal: …]` and `[NITDA DS team: …]` markers for the fields the agency must confirm before a public release.

See `CHANGELOG.md` for the line-by-line diff.

---

## File tree

```
dgo-design-system/
├── index.html                              ← live showcase (open this first)
├── README.md                               ← you are here
├── LICENSE                                 ← structural stub
├── CHANGELOG.md                            ← Keep-a-Changelog
├── GOVERNANCE.md                           ← roles, RFC flow, release gates
├── CONTRIBUTING.md                         ← PR shape, RFC clock, a11y review
├── MIGRATION.md                            ← v2.0 → v2.1 (additive); v1.0 cohabitation
├── INTEGRATION.md                          ← drop-in guide for new + existing projects
├── tokens/
│   ├── tokens.primitive.css                ← Tier 1 · raw values
│   ├── tokens.semantic.css                 ← Tier 2 · intent ("action-primary")
│   ├── tokens.component.css                ← Tier 3 · component bindings
│   ├── tokens.theme-light.css
│   ├── tokens.theme-dark.css
│   ├── tokens.theme-hc.css
│   └── tokens.density.css                  ← comfortable + compact
├── styles/
│   ├── reset.css                           ← modern reset
│   ├── base.css                            ← typography, accessibility utils
│   ├── layout.css                          ← stack / cluster / grid / sidebar
│   ├── components.css                      ← v2.0 monolith (still shipped)
│   └── components/                         ← v2.1 per-family split
│       ├── _index.css                      ← cascade-layer entry
│       ├── _utilities.css
│       ├── alert.css
│       ├── avatar.css
│       ├── badge.css
│       ├── breadcrumb.css
│       ├── button.css
│       ├── card.css
│       ├── checkbox-radio.css
│       ├── command-palette.css             ← v2.1
│       ├── empty-state.css
│       ├── filter-bar.css
│       ├── input.css
│       ├── kbd-code.css
│       ├── menu.css
│       ├── metric.css
│       ├── modal.css
│       ├── progress.css
│       ├── search.css
│       ├── select.css
│       ├── sidebar.css
│       ├── skeleton.css
│       ├── stepper-pagination.css
│       ├── switch.css
│       ├── table.css
│       ├── tabs.css
│       ├── toast.css
│       ├── tooltip-popover.css
│       └── topbar.css
├── docs/
│   ├── 00-foundations.md
│   ├── 01-tokens.md
│   ├── 02-color.md
│   ├── 03-typography.md
│   ├── 04-spacing-grid.md
│   ├── 05-iconography.md
│   ├── 06-motion.md
│   ├── 07-elevation.md
│   ├── 08-accessibility.md
│   ├── 09-i18n-rtl.md
│   ├── 10-content-voice.md
│   ├── 11-component-template.md            ← fillable shape
│   ├── 12-anti-patterns.md
│   └── components/                         ← §11 fills, one per family (27)
└── assets/
    ├── icons/sprite.svg                    ← inline SVG sprite
    └── logo/                               ← 5 lockups
```

---

## Quick start (5 minutes)

```html
<!doctype html>
<html lang="en-NG" data-theme="light" data-density="comfortable" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="tokens/tokens.primitive.css">
  <link rel="stylesheet" href="tokens/tokens.semantic.css">
  <link rel="stylesheet" href="tokens/tokens.theme-light.css">
  <link rel="stylesheet" href="tokens/tokens.theme-dark.css">
  <link rel="stylesheet" href="tokens/tokens.theme-hc.css">
  <link rel="stylesheet" href="tokens/tokens.component.css">
  <link rel="stylesheet" href="tokens/tokens.density.css">

  <link rel="stylesheet" href="styles/reset.css">
  <link rel="stylesheet" href="styles/base.css">
  <link rel="stylesheet" href="styles/layout.css">

  <!-- Pick one: -->
  <link rel="stylesheet" href="styles/components.css">              <!-- monolith -->
  <!-- or -->
  <link rel="stylesheet" href="styles/components/_index.css">       <!-- split (v2.1) -->
</head>
<body>

  <button class="dgo-btn dgo-btn--primary">Submit request</button>

  <svg class="icon"><use href="assets/icons/sprite.svg#i-check"/></svg>

</body>
</html>
```

Switch theme or density at runtime:

```js
document.documentElement.setAttribute('data-theme', 'dark');     // or 'light' | 'hc'
document.documentElement.setAttribute('data-density', 'compact');// or 'comfortable'
```

For framework adapters, build-tool wiring, SSR, tree-shaking, and CDN, see **`INTEGRATION.md`**.

---

## Token philosophy

Components **only consume semantic or component tokens** — never primitives. This is what lets a theme override re-skin the whole system from one place.

```css
/* Tier 1 — primitive (raw value, never read by components) */
--dgo-green-700: #05583B;

/* Tier 2 — semantic (intent name) */
--dgo-color-action-primary: var(--dgo-green-700);

/* Tier 3 — component (per-component binding; themes adjust here) */
--dgo-btn-bg-primary: var(--dgo-color-action-primary);

/* Component CSS only consumes the binding */
.dgo-btn--primary { background: var(--dgo-btn-bg-primary); }
```

---

## Accessibility

- Every semantic color pairing meets **4.5:1 text** / **3:1 UI** (matrix in `index.html`).
- 3px Smart Green focus ring with 2px offset on every interactive control.
- 44×44 px touch hit-area floor at comfortable density.
- All form fields wired with `<label>` + `aria-describedby` + `aria-invalid`.
- Toasts use `role="status"` / `role="alert"`; the command palette uses `role="dialog"` + `aria-activedescendant`.
- `.dgo-skip-link` available on every page example.
- `@media (prefers-reduced-motion: reduce)` collapses every motion token to ≤ 50ms.
- `@media (forced-colors: active)` swaps custom colors for `Canvas` / `CanvasText` / `Highlight` / `HighlightText`.

Per-family keyboard + ARIA contracts live in `docs/08-accessibility.md` and on each `docs/components/<family>.md`.

---

## Internationalisation

- Logical properties (`margin-inline-start`, `padding-block-end`, `inset-inline-end`) throughout — set `dir="rtl"` and the layout reflows.
- Latin-extended font stack covers Yoruba (ọ ẹ ṣ), Hausa (ɓ ɗ ƙ), and Igbo (ǹ ń) diacritics.
- Body line-height floor of 1.5 prevents diacritic collisions.
- Locale formatting rules for ₦, dates, NIN, and phone are documented in `docs/09-i18n-rtl.md`.

---

## Non-negotiables

- Token-driven — **no hard-coded hex/px/ms** inside component CSS.
- Static-first — content renders without JS; JS is progressive enhancement.
- Vanilla HTML5/CSS3, modern CSS welcome (`@layer`, `:has()`, `color-mix()`, container queries, logical properties).
- BEM under `.dgo-` namespace.
- Zero runtime dependencies in core CSS (icons are an inline SVG sprite).

---

## Governance

Semver. `@deprecated` comment + one minor-version notice before any removal. RFC for new component families. Release gates cover tokens → components → docs → examples → migration notes. Full policy in `GOVERNANCE.md`.

---

## Versioning

| Bump | Triggered by |
|---|---|
| MAJOR | Removed/renamed token, class, attribute. Removed component family. |
| MINOR | Added token, class, component family, theme, density, doc chapter. |
| PATCH | Visual fix that does not move tokens. Doc typo / link fix. |

---

**Open `index.html` to see the system live.** Press `Ctrl/⌘ + K` to try the v2.1 command palette.


## Technical completion layer (2.2)

The repository now includes a non-destructive completion layer for focus safety, touch targets, RTL motion, responsive patterns, forced colours, reduced motion, advanced components and dependency-free interaction behaviour. Load `tokens/tokens.enhanced.css`, `styles/enhancements.css` and `scripts/dgo-runtime.js`. Run `python tools/validate_technical.py` for the machine-readable coverage check. See `docs/13-complete-implementation.md`.
