# `breadcrumb`

> Inline trail of ancestor pages leading to the current surface. One row, ellipsis-free, never wraps.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/breadcrumb.css`
**Selector namespace:** `.dgo-crumbs` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-crumbs` — root, an `<ol>`. `aria-label="Breadcrumb"` on the wrapping `<nav>`
- `<li>` — each crumb is a list item; contains one `<a>` or one `.dgo-crumbs__current`
- `.dgo-crumbs__sep` — between-crumbs separator. `aria-hidden="true"`
- `.dgo-crumbs__current` — the terminal crumb — the current page; carries `aria-current="page"`

---

## 2 · Variants

No variants. Length is governed by content, not modifiers.

---

## 3 · Sizes & density

Single size. **Density has no effect** — `breadcrumb.css` declares no density block
and consumes no `--dgo-density-*` token; the only spacing is a fixed `--dgo-s-2`
(8px) gap and there is no padding. A breadcrumb is a thin one-line trail that reads
the same at any page density. (Earlier drafts claimed "density adjusts internal
padding via the `--dgo-density-pad` chain" — boilerplate, incorrect for this family;
corrected 2026-06-05 against the shipped CSS.) See `docs/04-spacing-grid.md`
§"Density".

---

## 4 · States

| State | Selector | Visual change | Driver |
| --- | --- | --- | --- |
| Link rest | `.dgo-crumbs a` | `--dgo-color-fg-muted`, `text-decoration: none` | — |
| Link hover | `.dgo-crumbs a:hover` | Colour shifts to `--dgo-color-action-primary` — **a colour change, not an underline** | mouse |
| Separator | `.dgo-crumbs__sep` | `--dgo-color-fg-subtle` (quieter than the links it sits between) | — |
| Current | `.dgo-crumbs__current` | `--dgo-color-fg-default`, `--dgo-wt-600`; not a link; carries `aria-current="page"` | data |

### Focus is not styled by this family

There is **no `:focus-visible` rule in `breadcrumb.css`** — link focus falls
through to the global base focus style (`docs/08-accessibility.md`). (Earlier drafts
listed a `box-shadow: var(--dgo-focus-ring)` rule here; that rule does not exist in
the shipped CSS — the base focus applies; corrected 2026-06-05.)

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/breadcrumb.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

**None** — this family references no component-tier token directly; it composes from semantic and primitive tiers.

### Tier 2 — Semantic tokens

- `--dgo-color-action-primary`
- `--dgo-color-fg-default`
- `--dgo-color-fg-muted`
- `--dgo-color-fg-subtle`
- `--dgo-type-body-sm`

### Tier 1 — Primitives

- `--dgo-s-2`
- `--dgo-wt-600`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic — the row sizes to its crumbs; the consumer bounds it.
- **Block-size:** intrinsic — one line of `--dgo-type-body-sm` text.
- **Internal spacing:** a single `--dgo-s-2` (8px) gap between crumbs and
  separators. There is **no padding** and no component-tier token. (Earlier drafts
  said "uses the component-tier padding tokens listed in §5" — there are none;
  corrected 2026-06-05.)
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `<a>`, `.dgo-crumbs__current` (terminal `<span>`)
- **Contained by:** `.dgo-topbar`, page header region above `<h1>`
- **Conflicts with:** Breadcrumb inside `.dgo-modal__header` — modals do not have a hierarchy

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

Tab through the link children. The separator and current crumb are not focusable.

---

## 10 · ARIA

Wrap in `<nav aria-label="Breadcrumb">` so the surface is a discoverable landmark. The list uses native `<ol>` semantics.

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
<nav aria-label="Breadcrumb">
  <ol class="dgo-crumbs">
    <li><a href="/">Dashboard</a></li>
    <li class="dgo-crumbs__sep" aria-hidden="true">›</li>
    <li><a href="/dossiers">Dossiers</a></li>
    <li class="dgo-crumbs__sep" aria-hidden="true">›</li>
    <li><span class="dgo-crumbs__current" aria-current="page">DGO/2026/0421</span></li>
  </ol>
</nav>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Breadcrumb that wraps to two lines.
  ✅ Truncate middle crumbs to "…" instead.
- ❌ Last crumb as a link to the current page.
  ✅ Use `<span class="dgo-crumbs__current" aria-current="page">`.
- ❌ Custom separator per consumer.
  ✅ The chevron is part of the visual vocabulary; do not override.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-crumbs` | `[v1 maintainers: confirm regex]` |

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

- No truncation policy shipped. Long trails (> 6 crumbs) overflow inline; consumer picks a collapse strategy.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc corrected against shipped CSS (2026-06-05): §4 (hover is a **colour change** to `--dgo-color-action-primary`, not an underline; **removed the fabricated `--dgo-focus-ring` focus rule** — none ships), §3 (no density response), §6 (no padding tokens). No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
