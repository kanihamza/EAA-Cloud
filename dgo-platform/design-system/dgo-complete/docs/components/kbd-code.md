# `kbd-code`

> Two siblings for monospaced rendering: `.dgo-kbd` for keyboard chord chips, `.dgo-inline-code` and `.dgo-code-block` for source.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/kbd-code.css`
**Selector namespace:** `.dgo-kbd · .dgo-inline-code · .dgo-code-block` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `<kbd class="dgo-kbd">` — a single key glyph — one per `<kbd>`. Chord = adjacent `<kbd>`s.
- `<code class="dgo-inline-code">` — inline-flow monospace tint
- `<pre class="dgo-code-block">` — block-level monospace, scroll-x on overflow

---

## 2 · Variants

No variants. The three classes are siblings, not modifiers.

---

## 3 · Sizes & density

Single size. Density adjusts internal padding only.

---

## 4 · States

- no states — these are typographic primitives

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/kbd-code.css`, verified against the shipped CSS on 2026-06-05. Tokens reached only through a component-token's internal chain are documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

- `--dgo-code-bg`
- `--dgo-code-fg`
- `--dgo-kbd-bg`
- `--dgo-kbd-border`

### Tier 2 — Semantic tokens

- `--dgo-color-border-default`
- `--dgo-color-fg-default`
- `--dgo-radius-card`
- `--dgo-type-body-sm`

### Tier 1 — Primitives

- `--dgo-family-mono`
- `--dgo-lh-150`
- `--dgo-r-4`
- `--dgo-s-4`
- `--dgo-wt-600`

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic; consumer-bounded.
- **Block-size:** intrinsic.
- **Internal spacing:** mixed and **not** component-tier — `.dgo-code-block` uses `padding: var(--dgo-s-4)` (primitive); `.dgo-kbd` uses a literal `padding-inline: 6px`; `.dgo-inline-code` a literal `2px 6px`. The literals are a minor token-discipline exception (§16).
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** no DGO children required
- **Contained by:** `.dgo-cmdk__item-meta`, documentation prose, `.dgo-card`
- **Conflicts with:** `.dgo-kbd` rendering a non-key (e.g. "Click")

---

## 8 · Behaviour (JS contract)

No JS — the component is declarative.

---

## 9 · Keyboard

Not focusable.

---

## 10 · ARIA

Native semantics. `<kbd>` for a key, `<code>` for source. Don't use `<kbd>` for non-key glyphs.

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
<p>Press <kbd class="dgo-kbd">Ctrl</kbd>+<kbd class="dgo-kbd">K</kbd> to open the palette.</p>
<p>The token is <code class="dgo-inline-code">--dgo-color-action-primary</code>.</p>
```

### With variants and states

See the live demos in the showcase (`index.html`) for the full state matrix rendered against the shipped CSS.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the showcase — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ Three-key chord in one `<kbd>` element ("Ctrl+Shift+P").
  ✅ One `<kbd>` per key.
- ❌ `.dgo-inline-code` inside `<pre>`.
  ✅ `<pre>` already preserves whitespace; use `.dgo-code-block` on the `<pre>` directly.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2 mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-kbd` | `[v1 maintainers: confirm regex]` |

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

- **Literal padding values.** `.dgo-kbd` (`padding-inline: 6px`) and
  `.dgo-inline-code` (`padding: 2px 6px`) use literals rather than tokens,
  contradicting the file header's "every value is a var()" (§6). A
  `--dgo-kbd-pad` / `--dgo-inline-code-pad` token pair would close the gap; the
  `11px` kbd font-size is similarly un-tokenised. Track at
  `[NITDA DS team: file v2.x cleanup ticket]`.
- `.dgo-code-block` syntax highlighting is consumer-owned; the shipped CSS provides the chrome.

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
