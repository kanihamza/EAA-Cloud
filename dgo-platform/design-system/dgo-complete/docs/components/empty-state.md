# `empty-state`

> Placeholder shown when a region has no data — search returned nothing, the inbox is empty, the report has no rows.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/empty-state.css`
**Selector namespace:** `.dgo-empty` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-empty` — root, centred block
- `.dgo-empty__title` — H4-level heading
- `.dgo-empty__body` — one-paragraph explanation, optionally with a `.dgo-btn` next-step

---

## 2 · Variants

No variants. Tone is set by copy.

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

- no states — empty-state is static

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/empty-state.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

**None** — this family references no component-tier token directly; it composes from semantic and primitive tiers.

### Tier 2 — Semantic tokens

- `--dgo-color-fg-default`
- `--dgo-color-fg-muted`
- `--dgo-type-h4`

### Tier 1 — Primitives

- `--dgo-s-12`
- `--dgo-s-3`
- `--dgo-s-6`
- `--dgo-wt-700`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** `padding: var(--dgo-s-12) var(--dgo-s-6)` (generous, to centre the state in an empty region) and `gap: var(--dgo-s-3)` between icon, title, body, and action — all **primitive** tokens, not component-tier.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `.dgo-btn`, `.dgo-icon` (illustrative)
- **Contained by:** `.dgo-card`, `.dgo-table`, `.dgo-cmdk__listbox` (see `__empty`)
- **Conflicts with:** Empty state stacked with a banner-style alert — pick one

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

None. Any contained `.dgo-btn` carries the button keyboard contract.

---

## 10 · ARIA

`role="status"` so AT announces the empty state on transition. Most loaders also need this — see `.dgo-cmdk__empty`.

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
<div class="dgo-empty" role="status">
  <h4 class="dgo-empty__title">No dossiers yet</h4>
  <p class="dgo-empty__body">Create your first dossier to get started.</p>
  <button class="dgo-btn dgo-btn--primary">New dossier</button>
</div>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Empty state that just says "No data".
  ✅ Always give the user a next step — "Create your first dossier".
- ❌ Empty state inside an empty state.
  ✅ Render the outer one. The inner is unreachable.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-empty` | `[v1 maintainers: confirm regex]` |

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

- Illustration / iconography slot is not shipped. Consumers occasionally drop an SVG above `__title`; promote in v2.2.

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
