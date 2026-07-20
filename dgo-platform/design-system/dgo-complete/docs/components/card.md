# `card`

> A container that elevates a related cluster of content above the page surface. The default grouping primitive.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/card.css`
**Selector namespace:** `.dgo-card` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-card` — root, default elevation 1
- `.dgo-card__header` — optional header row
- `.dgo-card__title` — header H3-level title
- `.dgo-card__sub` — header subtitle / meta
- `.dgo-card__footer` — optional footer row
- `.dgo-frame` — sibling — large, rounded, brand-tinted container

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| `.dgo-card--flat` | No shadow; relies on border only. | Inside a busy surface. |
| `.dgo-card--raised` | Elevation 3 — top of the visual stack. | Highlighted cards in a grid. |
| `.dgo-card--hoverable` | Lifts on `:hover`. Implies the whole card is a link. | Catalogue grids. |
| `.dgo-card--accent` | Leading inline-start accent stripe. | Drawing attention to one card. |

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

| State | Visual change | Driver |
| --- | --- | --- |
| hover | when `--hoverable`, raises shadow | mouse |
| focus-within | 3px focus ring on the card | keyboard, when card is a link |

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/card.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-card-bg`
- `--dgo-card-border`
- `--dgo-card-pad`
- `--dgo-card-radius`
- `--dgo-card-shadow-hover`

### Tier 2 — Semantic tokens

- `--dgo-color-action-accent`
- `--dgo-color-border-default`
- `--dgo-color-border-strong`
- `--dgo-color-fg-muted`
- `--dgo-color-surface-page`
- `--dgo-elevation-card`
- `--dgo-elevation-flat`
- `--dgo-motion-state`
- `--dgo-radius-frame`
- `--dgo-type-body-sm`
- `--dgo-type-h4`

### Tier 1 — Primitives

- `--dgo-family-display`
- `--dgo-lh-120`
- `--dgo-s-2`
- `--dgo-s-3`
- `--dgo-s-4`
- `--dgo-wt-700`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** uses the component-tier padding tokens listed in §5.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** anything
- **Contained by:** `.dgo-grid`, page-content region
- **Conflicts with:** Three-deep card nesting

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

None on the card itself. When `--hoverable` makes the entire card a link, wrap in `<a>` and Tab reaches it.

---

## 10 · ARIA

No required role. Use a heading inside `.dgo-card__title` so AT users land on it via heading navigation.

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
<article class="dgo-card">
  <header class="dgo-card__header">
    <h3 class="dgo-card__title">Routing decision</h3>
    <p class="dgo-card__sub">Last updated 2 minutes ago</p>
  </header>
  <p>Body text.</p>
</article>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Three nested `.dgo-card`s.
  ✅ Use a `.dgo-stack` inside a single card.
- ❌ `.dgo-card--hoverable` without a wrapping `<a>`.
  ✅ Affordance you cannot click. Wrap or drop the modifier.
- ❌ `.dgo-card__title` as `<div>`.
  ✅ Use `<h2>` / `<h3>` so the document outline includes the card.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-card` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

Per-family caveats:

- Uses `color-mix()` for the hover lift in some themes. All target engines ship it.

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

- "Loading card" skeleton variant is unimplemented; consumers compose `.dgo-skeleton` inside `.dgo-card__body`. Promote a shipped variant in v2.2 if patterns converge.

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
