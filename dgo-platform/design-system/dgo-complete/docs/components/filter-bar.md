# `filter-bar`

> Two siblings. `.dgo-filter-bar` houses search + filter chips above a data region. `.dgo-bulk-bar` is the brand-strong row that appears when one or more rows are selected.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/filter-bar.css`
**Selector namespace:** `.dgo-filter-bar · .dgo-bulk-bar` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-filter-bar` — flex row of inputs, chips, and right-aligned actions
- `.dgo-bulk-bar` — flex row that surfaces selection actions in brand-primary

---

## 2 · Variants

No CSS variants — the difference is which family you reach for.

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

- hover / focus on contained controls follows each control's own contract

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/filter-bar.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

**None** — this family references no component-tier token directly; it composes from semantic and primitive tiers.

### Tier 2 — Semantic tokens

- `--dgo-color-action-primary`
- `--dgo-color-border-default`
- `--dgo-color-fg-on-brand`
- `--dgo-color-surface-raised`
- `--dgo-radius-card`

### Tier 1 — Primitives

- `--dgo-s-3`
- `--dgo-s-4`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** `padding: var(--dgo-s-3) var(--dgo-s-4)` and `gap: var(--dgo-s-3)` (with `flex-wrap: wrap`) — all **primitive** tokens, not component-tier.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `.dgo-search`, `.dgo-chip`, `.dgo-select`, `.dgo-btn`
- **Contained by:** region above `.dgo-table`, `.dgo-card__header`
- **Conflicts with:** Filter-bar inside `.dgo-modal` — modals are point-of-action, not exploration

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

Tab through contained controls in DOM order. Filter-bar is not itself focusable.

---

## 10 · ARIA

Wrap in `<form role="search">` if the filter is a single search input; otherwise `<div>`.

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
<form class="dgo-filter-bar" role="search">
  <span class="dgo-search"><input type="search" placeholder="Search dossiers…"></span>
  <span class="dgo-chip">Pending <button class="dgo-chip__close" aria-label="Remove filter">×</button></span>
  <button class="dgo-btn dgo-btn--secondary" type="button">Export CSV</button>
</form>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Bulk-bar shown while zero rows are selected.
  ✅ Mount when count > 0; unmount on count = 0.
- ❌ Filter-bar that scrolls horizontally on overflow.
  ✅ Wrap to two lines or collapse to a "Filter" button that opens a drawer.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-filter-bar` | `[v1 maintainers: confirm regex]` |

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

- Sticky bulk-bar behaviour (anchor to viewport top while scrolling) is unshipped — consumer's call until v2.2.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
