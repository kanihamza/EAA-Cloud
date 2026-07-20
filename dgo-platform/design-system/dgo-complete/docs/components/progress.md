# `progress`

> Three siblings for in-progress feedback: linear bar, circular ring, indeterminate spinner.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/progress.css`
**Selector namespace:** `.dgo-progress · .dgo-progress-ring · .dgo-spinner` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-progress` — linear bar wrapper, role-bearing
- `.dgo-progress__fill` — the filled portion
- `.dgo-progress-ring` — circular percentage indicator
- `.dgo-spinner` — indeterminate, ring-shaped, infinite rotation

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| `.dgo-progress--accent` | Uses `--dgo-color-action-accent`. | Secondary progress in a multi-progress layout. |

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

| State | Visual change | Driver |
| --- | --- | --- |
| determinate | fill width controlled by `aria-valuenow` | data |
| indeterminate | spinner runs at full speed | data |

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/progress.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-progress-fill`
- `--dgo-progress-h`
- `--dgo-progress-track`

### Tier 2 — Semantic tokens

- `--dgo-color-action-accent`
- `--dgo-color-action-primary`
- `--dgo-color-fg-default`
- `--dgo-color-surface-page`
- `--dgo-color-surface-sunken`
- `--dgo-motion-state`
- `--dgo-type-body-sm`

### Tier 1 — Primitives

- `--dgo-r-pill`
- `--dgo-wt-700`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** none — the bar, ring, and spinner have **no padding**. The bar's thickness is `--dgo-progress-h`; the ring is a fixed `56px` and the spinner a fixed `24px` (literals). There is no component-tier *padding* token.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** no DGO children required
- **Contained by:** `.dgo-card__footer`, `.dgo-toast`, inline next to `.dgo-btn[data-loading]`
- **Conflicts with:** Three spinners on the same row

---

## 8 · Behaviour (JS contract)

Mostly declarative. Consumer JS updates `aria-valuenow` (progress) or toggles `aria-busy` on the wrapper (skeleton). The CSS reacts.

---

## 9 · Keyboard

Not focusable. Progress is a passive indicator.

---

## 10 · ARIA

`role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` for determinate. For indeterminate, omit `aria-valuenow`. Always provide `aria-label`.

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
<div class="dgo-progress" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
  <div class="dgo-progress__fill" style="inline-size: 62%;"></div>
</div>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Spinner with no `aria-label`.
  ✅ AT users hear nothing. Always label: "Loading dossiers".
- ❌ Indeterminate progress for an operation with known total.
  ✅ Use determinate.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-progress` | `[v1 maintainers: confirm regex]` |

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

- `.dgo-progress-ring` percentage is currently set via inline CSS var by the consumer — promote a `data-progress` attribute API in v2.2.

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
