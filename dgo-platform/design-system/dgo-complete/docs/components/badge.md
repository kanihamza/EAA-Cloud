# `badge`

> Compact metadata token. Four sibling families: status pills (typed), neutral badges, square tags, and removable chips.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/badge.css`
**Selector namespace:** `.dgo-pill · .dgo-badge · .dgo-tag · .dgo-chip` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-pill` — rounded status pill (preferred for state names)
- `.dgo-pill__dot` — optional 6px circle prefix matching the pill's fg colour
- `.dgo-badge` — tonal pill for non-status metadata (counts, tags)
- `.dgo-tag` — square-cornered alternative for type / category labels
- `.dgo-chip` — removable token; carries a close button
- `.dgo-chip__close` — the close glyph inside a chip

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| `.dgo-pill--pending` | Workflow state. | Routing tables. |
| `.dgo-pill--routed` | Routed to another desk. | Dossier history. |
| `.dgo-pill--replied` | Awaiting response received. | Inbox meta. |
| `.dgo-pill--action` | Requires the current user's action. | Operator dashboards. |
| `.dgo-pill--draft` | Not yet submitted. | Save-draft surfaces. |
| `.dgo-pill--archived` | Long-term archive. | Read-only contexts. |
| `.dgo-pill--escalated` | Senior review. | Compliance, audit. |
| `.dgo-pill--{info,success,warning,danger}` | Generic severity pill. | Form-validation summaries. |
| `.dgo-badge--neutral` | Untyped tonal pill. | Counts, filter tokens. |

---

## 3 · Sizes & density

Single size. **Density has no effect** — the pill (`--dgo-badge-h: 22px`), tag
(`--dgo-tag-h: 24px`), counter badge, and chip are all fixed heights that
`tokens.density.css` does not rebind, and the family consumes no `--dgo-density-*`
token. Inline status pellets keep one footprint regardless of page density. See
`docs/04-spacing-grid.md` §"Density".

---

## 4 · States

- hover on `.dgo-chip__close` raises contrast
- no states on `.dgo-pill` / `.dgo-badge` — they're data, not interactive

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/badge.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-badge-fs`
- `--dgo-badge-fw`
- `--dgo-badge-h`
- `--dgo-badge-px`
- `--dgo-badge-radius`
- `--dgo-tag-h`
- `--dgo-tag-radius`

### Tier 2 — Semantic tokens

- `--dgo-color-action-danger`
- `--dgo-color-action-primary`
- `--dgo-color-action-primary-soft`
- `--dgo-color-border-default`
- `--dgo-color-danger-subtle-bg`
- `--dgo-color-danger-subtle-fg`
- `--dgo-color-fg-default`
- `--dgo-color-fg-on-brand`
- `--dgo-color-info-subtle-bg`
- `--dgo-color-info-subtle-fg`
- `--dgo-color-status-action-bg`
- `--dgo-color-status-action-fg`
- `--dgo-color-status-archived-bg`
- `--dgo-color-status-archived-fg`
- `--dgo-color-status-draft-bg`
- `--dgo-color-status-draft-fg`
- `--dgo-color-status-escalated-bg`
- `--dgo-color-status-escalated-fg`
- `--dgo-color-status-pending-bg`
- `--dgo-color-status-pending-fg`
- `--dgo-color-status-replied-bg`
- `--dgo-color-status-replied-fg`
- `--dgo-color-status-routed-bg`
- `--dgo-color-status-routed-fg`
- `--dgo-color-success-subtle-bg`
- `--dgo-color-success-subtle-fg`
- `--dgo-color-surface-sunken`
- `--dgo-color-warning-subtle-bg`
- `--dgo-color-warning-subtle-fg`
- `--dgo-motion-state`
- `--dgo-type-body-sm`

### Tier 1 — Primitives

- `--dgo-r-pill`
- `--dgo-s-1`
- `--dgo-s-2`
- `--dgo-s-3`
- `--dgo-wt-500`
- `--dgo-wt-700`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** uses the component-tier padding tokens listed in §5.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `.dgo-pill__dot` (optional)
- **Contained by:** `.dgo-table` cells, `.dgo-card__header`, `.dgo-cmdk__item-meta`, `.dgo-filter-bar`
- **Conflicts with:** `.dgo-pill` inside `.dgo-pill` — never

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

None for pill / badge / tag. `.dgo-chip__close` is a real `<button>` (Enter / Space to invoke).

---

## 10 · ARIA

None on `.dgo-pill` — the text is the source of truth for the state name. **Do not** rely on colour alone.

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
<span class="dgo-pill dgo-pill--pending"><span class="dgo-pill__dot"></span>Pending review</span>
<span class="dgo-badge dgo-badge--neutral">12</span>
<span class="dgo-chip">Compliance <button class="dgo-chip__close" aria-label="Remove filter">×</button></span>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Status pill rendered as a button.
  ✅ A pill is a label. If the user can click it to filter, wrap a `<button class="dgo-chip">` instead.
- ❌ Colour-only severity (red dot, no text).
  ✅ Always include the text. Colour fails under colour-blindness and forced-colours.
- ❌ `.dgo-tag` for status.
  ✅ Square corners read as "category". Use `.dgo-pill` for state names — the rounded shape is part of the vocabulary.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-pill` | `[v1 maintainers: confirm regex]` |

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

- Long-translation expansion (Yorùbá / Hausa labels) is bounded by min-inline-size but not by max-inline-size — chip wrap behaviour inside filter-bars is currently inconsistent across browsers.

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
