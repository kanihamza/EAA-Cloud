# `alert`

> Static, in-flow status message attached to a region or page. Not a toast (transient, out-of-flow) — for that see `toast.md`.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/alert.css`
**Selector namespace:** `.dgo-alert` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-alert` — root, role-bearing
- `.dgo-alert__icon` — leading status icon, `aria-hidden="true"`
- `.dgo-alert__title` — optional bold lead line
- `.dgo-alert__body` — primary message text
- `.dgo-banner` (sibling) — full-bleed variant, anchored to page top

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| `.dgo-alert--info` | Neutral informational notice. | A note about expected behaviour or context. |
| `.dgo-alert--success` | Confirmation of a completed action. | Form submitted, approval recorded. |
| `.dgo-alert--warning` | Heads-up that requires attention but is not a failure. | Quota approaching, deadline near. |
| `.dgo-alert--danger` | Failure, blocker, or destructive consequence. | Submission rejected, validation failed. |
| `.dgo-banner` | Full-bleed brand-strong message for page-top announcements. | System-wide notices, mandatory disclosures. |

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

- hover (no-op — alerts are static)
- dismissed via consumer JS — see §8

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/alert.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-alert-border-w`
- `--dgo-alert-pad`
- `--dgo-alert-radius`

### Tier 2 — Semantic tokens

- `--dgo-color-danger-subtle-bg`
- `--dgo-color-danger-subtle-fg`
- `--dgo-color-fg-default`
- `--dgo-color-fg-on-brand`
- `--dgo-color-info-subtle-bg`
- `--dgo-color-info-subtle-fg`
- `--dgo-color-success-subtle-bg`
- `--dgo-color-success-subtle-fg`
- `--dgo-color-surface-brand`
- `--dgo-color-surface-raised`
- `--dgo-color-warning-subtle-bg`
- `--dgo-color-warning-subtle-fg`
- `--dgo-type-body`
- `--dgo-type-body-sm`

### Tier 1 — Primitives

- `--dgo-s-3`
- `--dgo-s-4`
- `--dgo-s-5`
- `--dgo-wt-600`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** uses the component-tier padding tokens listed in §5.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `.dgo-btn` (dismiss / primary action), `.dgo-icon` via the sprite
- **Contained by:** `.dgo-card`, `.dgo-modal__body`, page-level `<main>`
- **Conflicts with:** Banner inside `.dgo-modal` — the modal already carries severity via its own header

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

None — the alert is non-interactive. A dismiss button inside the alert follows the `.dgo-btn` keyboard contract.

---

## 10 · ARIA

`role="status"` for info / success / warning; `role="alert"` for danger.

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
<div class="dgo-alert dgo-alert--info" role="status">
  <span class="dgo-alert__title">Heads-up</span>
  <span class="dgo-alert__body">This dossier is awaiting a routing decision.</span>
</div>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Stacking three alerts above the page content.
  ✅ Use a banner for one and surface the rest in-flow next to the offending field.
- ❌ `role="alert"` on a `success` alert.
  ✅ `role="alert"` interrupts the screen reader — reserve for failure.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-alert` | `[v1 maintainers: confirm regex]` |

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

- Severity-icon mapping is currently consumer-chosen. Promote to a slot policy in v2.2 if usage diverges.

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
