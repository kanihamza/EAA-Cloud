# `avatar`

> A square-ish photographic or initials-based identity glyph for a person, an agency, or a system actor.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/avatar.css`
**Selector namespace:** `.dgo-avatar` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-avatar` — root; renders the image or the initials
- `.dgo-avatar-stack` — wrapper for overlapping avatars (groups, teams)

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| *(default)* | 32px medium avatar. | The default in lists and tables. |
| `.dgo-avatar--sm` | 24px small avatar. | Compact cells, mention chips. |
| `.dgo-avatar--lg` | 40px large avatar. | Card headers, profile previews. |
| `.dgo-avatar--xl` | 64px extra-large. | Profile pages, hero panels. |

---

## 3 · Sizes & density

Four sizes — `sm` 24px, default 32px, `lg` 40px, `xl` 64px. Density does **not** change avatar size — size is a content decision, not a UI-density one.

---

## 4 · States

- hover (no-op — focus carried by interactive ancestor)
- fallback: initials render when `<img>` is missing or fails to load

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/avatar.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

**None** — this family references no component-tier token directly; it composes from semantic and primitive tiers.

### Tier 2 — Semantic tokens

- `--dgo-color-action-primary`
- `--dgo-color-action-primary-soft`
- `--dgo-color-surface-page`
- `--dgo-type-body-lg`
- `--dgo-type-body-sm`
- `--dgo-type-h3`

### Tier 1 — Primitives

- `--dgo-tr-tight`
- `--dgo-wt-600`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** none — the avatar is a **fixed-dimension** circle (`36px` default; `24` / `48` / `72px` for `--sm` / `--lg` / `--xl`) with its initials centred by flex, **no padding**.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `<img>` or text-node initials
- **Contained by:** `.dgo-card__header`, `.dgo-table` cells, `.dgo-menu__item`, `.dgo-sidebar__footer`
- **Conflicts with:** Avatar-stack inside a tooltip — the truncation count is the better pattern

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

None when decorative. If wrapped in an interactive ancestor (`<a>`, `<button>`), the ancestor carries the keyboard contract.

---

## 10 · ARIA

Decorative when the user's name is also visible (`aria-hidden="true"`). When the avatar is the only identifier, provide `<img alt>` with the person's name, or a `<span class="dgo-visually-hidden">` carrying it.

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
<span class="dgo-avatar" aria-hidden="true">AB</span>
<span class="dgo-avatar dgo-avatar--lg"><img src="/operators/ado.jpg" alt=""></span>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Avatar with initials but no aria-label and no visible name nearby.
  ✅ Either add a `<span class="dgo-visually-hidden">` carrying the name, or surface the name as visible adjacent text.
- ❌ Decorative photo-based avatar with `<img alt="Avatar">`.
  ✅ Set `alt=""`. The alt should be the person's name or empty — never the literal string "Avatar".

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-avatar` | `[v1 maintainers: confirm regex]` |

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

- Status-dot overlay (online / offline / busy) is unshipped — promote in v2.2 if requested.

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
