# `topbar`

> Horizontal app header. Persistent across the operator surface. Hosts the brand, page title, search, notifications, and the user menu.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/topbar.css`
**Selector namespace:** `.dgo-topbar` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-topbar` — flex row, sticky at the top of the viewport
- (slots) — consumer composition — inline-start: brand + breadcrumb; centre: search; inline-end: notifications + user menu

---

## 2 · Variants

No CSS variants. Density and content drive the visual.

---

## 3 · Sizes & density

Single size. **Density has no effect** — the topbar's height is `--dgo-topbar-h`,
which `tokens.density.css` does **not** rebind, and its `--dgo-s-4` / `--dgo-s-5`
gap and padding are fixed primitives. The app header keeps one constant height so
the page frame is stable while the content area below it switches density.
(Earlier drafts claimed "density adjusts internal padding via the
`--dgo-density-pad` chain" — boilerplate, incorrect for this family; corrected
2026-06-05 against the shipped CSS.) See `docs/04-spacing-grid.md` §"Density".

---

## 4 · States

- no states — topbar is a layout primitive

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/topbar.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-topbar-bg`
- `--dgo-topbar-border`
- `--dgo-topbar-h`

### Tier 2 — Semantic tokens

**None** — this family references no semantic-tier token directly.

### Tier 1 — Primitives

- `--dgo-s-4`
- `--dgo-s-5`
- `--dgo-z-sticky`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic — the bar spans its container (the page-shell column);
  consumer-bounded.
- **Block-size:** fixed at `--dgo-topbar-h` (a component token; does not rebind
  under density — §3).
- **Internal spacing:** `padding-inline: var(--dgo-s-5)`; `gap: var(--dgo-s-4)`
  between clusters — both fixed primitives, not component-tier tokens. (Earlier
  drafts said "uses the component-tier padding tokens listed in §5"; corrected
  2026-06-05.)
- **Sticky:** `position: sticky; inset-block-start: 0; z-index: var(--dgo-z-sticky)`
  — the bar pins to the top of the viewport above the scrolling content.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `.dgo-crumbs`, `.dgo-search`, `.dgo-btn--icon`, `.dgo-avatar`
- **Contained by:** `<body>` / page shell, above `.dgo-sidebar`
- **Conflicts with:** Topbar inside a modal

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

Tab through the contained controls. The topbar itself is not focusable.

---

## 10 · ARIA

Wrap in `<header>`; use `<nav aria-label="Primary">` for the navigation cluster inside.

### Forced-colours behaviour

Under `forced-colors: active` the component swaps custom colour tokens for system colours (`Canvas`, `CanvasText`, `Highlight`, `HighlightText`). Elevation falls back to a 1px `CanvasText` border. See `docs/07-elevation.md`.

### Reduced-motion behaviour

Any transitions or animations on this family collapse to ≤ 50ms under `@media (prefers-reduced-motion: reduce)`. See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** body-size text uses `--dgo-lh-150` so Yorùbá, Hausa, and Igbo combining marks have room.
- **RTL:** logical properties throughout. Inline padding, gap, and icon placement flip under `[dir="rtl"]`.
- **Translation expansion:** long labels wrap inline; never truncate with `text-overflow: ellipsis` without a tooltip for the full string.

---

## 12 · Examples

### Basic

```html
<header class="dgo-topbar">
  <div class="dgo-cluster">
    <strong>DGO · Operator</strong>
    <nav aria-label="Breadcrumb"><ol class="dgo-crumbs"><li><a href="/">Dashboard</a></li></ol></nav>
  </div>
  <form role="search" class="dgo-search"><input type="search" placeholder="Search…"></form>
  <div class="dgo-cluster">
    <button class="dgo-btn dgo-btn--icon" aria-label="Notifications"><svg class="icon-sm"><use href="../../assets/icons/sprite.svg#i-bell"/></svg></button>
    <span class="dgo-avatar">AO</span>
  </div>
</header>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Topbar that scrolls with the page.
  ✅ Sticky is the default.
- ❌ Two topbars stacked.
  ✅ Use breadcrumb + page header instead.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-topbar` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

Per-family caveats:

- None specific beyond the system's floor.

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is aspirational.

---

## 16 · Open questions

- Mobile collapse (hamburger → drawer) is consumer-owned.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc corrected against shipped CSS (2026-06-05): §3 (no density response — `--dgo-topbar-h` does not rebind), §6 (padding/gap are fixed primitives `--dgo-s-5` / `--dgo-s-4`, not component-tier; documented the sticky + `z-sticky` behaviour). No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
