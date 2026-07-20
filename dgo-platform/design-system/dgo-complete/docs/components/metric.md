# `metric`

> A single number with a label and an optional delta. The atomic dashboard unit.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/metric.css`
**Selector namespace:** `.dgo-metric` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-metric` — root, card-like surface
- `.dgo-metric__label` — overline-style label above the value
- `.dgo-metric__value` — large display number, tabular-nums
- `.dgo-metric__delta` — optional change indicator

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| `.dgo-metric__delta--up` | Positive change (green). | Increase from prior period. |
| `.dgo-metric__delta--down` | Negative change (red). | Decrease from prior period. |

---

## 3 · Sizes & density

Single size, but the tile **does respond to density** — its padding is
`--dgo-card-pad`, which `tokens.density.css` rebinds from `--dgo-s-5` (comfortable)
to `--dgo-s-4` (compact). So a metric tile tightens in a compact dashboard exactly
as a card does. The mechanism is `--dgo-card-pad`, **not** `--dgo-density-pad`
(which this family does not consume). See `docs/04-spacing-grid.md` §"Density".

---

## 4 · States

- no states — metric is static

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/metric.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

> `.dgo-metric` is built on the `.dgo-card` surface; it references the card component tokens directly, listed under Tier 3.

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-card-bg`
- `--dgo-card-border`
- `--dgo-card-pad`
- `--dgo-card-radius`

### Tier 2 — Semantic tokens

- `--dgo-color-danger-subtle-fg`
- `--dgo-color-fg-muted`
- `--dgo-color-fg-strong`
- `--dgo-color-success-subtle-fg`
- `--dgo-type-body-sm`
- `--dgo-type-caption`
- `--dgo-type-h1`

### Tier 1 — Primitives

- `--dgo-family-display`
- `--dgo-lh-110`
- `--dgo-s-1`
- `--dgo-s-2`
- `--dgo-tr-tightest`
- `--dgo-tr-wide`
- `--dgo-wt-600`
- `--dgo-wt-700`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** uses the component-tier padding tokens listed in §5.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** value text, `.dgo-metric__delta` (optional)
- **Contained by:** `.dgo-grid`, `.dgo-card`
- **Conflicts with:** Metric inside metric

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

Not focusable.

---

## 10 · ARIA

Value-with-label semantics carry naturally; no extra ARIA. If the metric is also a link to a detail page, wrap in `<a>`.

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
<div class="dgo-metric">
  <div class="dgo-metric__label">Open dossiers</div>
  <div class="dgo-metric__value">1,284</div>
  <div class="dgo-metric__delta dgo-metric__delta--down">−4.2% vs last week</div>
</div>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ `.dgo-metric__value` with a long string ("3,481,294").
  ✅ Pre-format with K/M abbreviation or widen the card.
- ❌ Up arrow paired with negative delta (or vice versa).
  ✅ Arrow and sign must agree. Invert manually for "less is good" metrics (e.g. backlog).

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-metric` | `[v1 maintainers: confirm regex]` |

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

- Trend sparkline slot is unshipped. Add a sparkline outside the metric if needed.

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
