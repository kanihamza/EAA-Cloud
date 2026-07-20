# `skeleton`

> Loading placeholder that takes the shape of the content it replaces. Animated shimmer suggests forward motion without a spinner.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/skeleton.css`
**Selector namespace:** `.dgo-skeleton` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-skeleton` — a generic block — consumer sets width/height via inline style
- `.dgo-skeleton--circle` — modifier for avatar-shaped placeholders

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| `.dgo-skeleton--circle` | Round. | Matches a `.dgo-avatar` placeholder. |

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

- static shimmer; no interaction

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/skeleton.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-skeleton-base`
- `--dgo-skeleton-shine`

### Tier 2 — Semantic tokens

**None** — this family references no semantic-tier token directly.

### Tier 1 — Primitives

- `--dgo-r-6`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** none — a skeleton is a sized placeholder block with **no padding** (`min-block-size: 12px`, radius `--dgo-r-6`). The consumer sizes it to mirror the content it stands in for.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** no DGO children required
- **Contained by:** anywhere the real content goes
- **Conflicts with:** Skeleton + spinner together — redundant

---

## 8 · Behaviour (JS contract)

Mostly declarative. Consumer JS updates `aria-valuenow` (progress) or toggles `aria-busy` on the wrapper (skeleton). The CSS reacts.

---

## 9 · Keyboard

Not focusable.

---

## 10 · ARIA

`aria-hidden="true"`. The loading-region wrapper should carry `aria-busy="true"` and `role="status"` with a label like "Loading dossiers".

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
<div role="status" aria-busy="true" aria-label="Loading dossiers">
  <span class="dgo-skeleton" style="display:block; block-size:16px; margin-block-end: 8px;"></span>
  <span class="dgo-skeleton" style="display:block; block-size:16px; inline-size: 70%;"></span>
</div>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Skeleton that exceeds 1500ms before content arrives.
  ✅ Switch to a real progress indicator with text.
- ❌ Skeleton without `aria-busy` on the parent region.
  ✅ Screen-reader users hear silence.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-skeleton` | `[v1 maintainers: confirm regex]` |

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

- Shape-presets (paragraph, table-row, card) unshipped. Consumers compose with inline width/height; promote presets in v2.2 if patterns converge.

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
