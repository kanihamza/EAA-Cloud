# `select`

> Native `<select>` styled to match `.dgo-input`. Single choice from a known,
> finite list. The select is a **two-file component**: `input.css` supplies the
> box and every interaction state; `select.css` adds only the dropdown chevron
> and the trailing space it needs. There is no custom listbox — the native
> control, and its platform picker, is the feature.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/select.css` (+ shared rules in `styles/components/input.css`)
**Selector namespace:** `.dgo-select` / `.dgo-select__field` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-select` — wrapper. `position: relative; display: block;`. It establishes
  the positioning context and the block-level footprint; the chevron is painted
  on the field, not the wrapper, so the wrapper carries no visual of its own.
- `<select class="dgo-select__field">` — the native, focusable element. **Styled
  by `input.css`**, which lists `.dgo-select__field` alongside `.dgo-input` and
  `.dgo-textarea` in its grouped selector. That is where the height, border,
  radius, background, font, hover, focus-ring, disabled, and `aria-invalid`
  treatments come from — `select.css` never restates them.

### What each file owns

| File | Supplies |
|---|---|
| `input.css` | `block-size` (40px), `padding-inline`, font, colour, `--dgo-input-bg` background, 1px border, radius, the state transitions, **and** `:hover` / `:focus-visible` / `:disabled` / `[aria-invalid]` rebinds — all shared with `.dgo-input`. |
| `select.css` | `appearance: none`, the chevron (an inline-SVG `background-image`), its position, the RTL flip, and the extra `24px` of `padding-inline-end` that keeps the option text clear of the chevron. |

A `<select>` with only `class="dgo-select__field"` (one class) is fully styled —
the grouped selector in `input.css` does the rest. This is intentional; do **not**
also add `class="dgo-input"`.

---

## 2 · Variants

No variants. The select borrows `.dgo-input`'s single visual treatment. For a
richer picker (icons, two-line options, async search) the select is the wrong
component — see §16.

---

## 3 · Sizes & density

Single size, inherited wholesale from `.dgo-input`:

| Property | Token | Resolved |
|---|---|---|
| Height | `--dgo-input-h` | 40px |
| Padding-inline (leading) | `--dgo-input-px` | 12px (`--dgo-s-3`) |
| Padding-inline-end (trailing) | `calc(var(--dgo-input-px) + 24px)` | 36px — leading 12px **plus** the 24px chevron reserve |

Density adjusts the inherited `--dgo-input-*` chain; the select declares no
density block of its own. See `docs/04-spacing-grid.md` §"Density".

---

## 4 · States

All states are inherited from `input.css` (the `.dgo-select__field` arm of each
grouped selector) — they are reproduced here precisely because "matches
`.dgo-input`" is too vague to implement against:

| State | Selector | Visual change | Driver |
| --- | --- | --- | --- |
| Default | `.dgo-select__field` | `--dgo-input-bg`, 1px `--dgo-input-border` | — |
| Hover | `:hover:not(:disabled)` | border → `--dgo-input-border-hover` | mouse |
| Focus | `:focus-visible` | `outline: none`; border → `--dgo-input-border-focus`; `box-shadow: 0 0 0 3px` of `color-mix(action-primary 22%, transparent)` | keyboard |
| Disabled | `:disabled` | background → `--dgo-input-bg-disabled`; text → `--dgo-color-fg-disabled`; `cursor: not-allowed` | `disabled` attr |
| Invalid | `[aria-invalid="true"]` | border → `--dgo-input-border-error` | data |

The focus ring is the same 3px `color-mix` halo as every other input, so a
select sits in a form alongside text fields with one consistent focus language.

### The chevron does not change with state

The chevron `background-image` is static. It does not recolour on hover, focus,
disabled, or invalid — and, more importantly, it does not recolour by **theme**.
See §5 and §16.

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/select.css`,
verified against the shipped CSS on 2026-06-05. The box and state tokens
(`--dgo-input-*`, `--dgo-color-*`) are consumed in `input.css` via the
`.dgo-select__field` selector arm and are documented in `input.md` §5 — not
duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Used for |
|---|---|
| `--dgo-input-px` | Both the leading inline padding **and** the base of the trailing `calc()` that reserves chevron space. |

### Tier 2 — Semantic tokens

**None** — `select.css` references no semantic-tier token directly. (The field's
colours arrive through `input.css`.)

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-s-3` | 12px | Chevron inset from the trailing edge (`background-position: right var(--dgo-s-3) center`, mirrored to `left` under RTL). |

### Un-tokenised values in `select.css` — known

Two values in `select.css` are **not** tokens, contradicting the file header's
"every value is a var()" claim:

- **`24px`** — the chevron reserve in `padding-inline-end: calc(var(--dgo-input-px) + 24px)`.
  It pairs with the 12px-wide SVG sitting 12px from the edge (12 + 12 = 24).
- **`#5F5C5D`** — the chevron stroke colour, baked into the SVG `data:` URI as
  `%235F5C5D`. Because it lives inside the data-URI it cannot read a token and
  **does not respond to `[data-theme]`** — the chevron stays this mid-grey in
  light, dark, and high-contrast themes alike.

Both are tracked in §16. Neither breaks the control, but both are real exceptions
to the system's token discipline.

---

## 6 · Layout & sizing

- **Inline-size:** `100%` of the container — `.dgo-select` is `display: block`
  and `.dgo-select__field` inherits `inline-size: 100%` from `input.css`. The
  select is **not** intrinsic-width; bound it by sizing its wrapper (e.g. inside
  a `.dgo-filter-bar` cell), not by setting a width on the `<select>` itself.
  (Earlier drafts described this as "intrinsic; consumer-bounded" — corrected
  2026-06-05.)
- **Block-size:** fixed at `--dgo-input-h` (40px).
- **Internal spacing:** leading padding `--dgo-input-px` (12px); trailing padding
  `--dgo-input-px + 24px` (36px) to clear the chevron; `padding-block: 0`.
- **Chevron:** a 12 × 8 px inline-SVG `background-image`, positioned
  `right var(--dgo-s-3) center` (12px in), no-repeat.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `<option>` and `<optgroup>` only — the native control admits
  nothing else. No icons, no markup, no two-line options (a hard platform limit,
  not a system choice).
- **Contained by:** `.dgo-field` (label + control + help text), `.dgo-filter-bar`
  (as a filter control), `.dgo-input-group` (where `input.css` strips the field's
  border and radius so it can share a bordered group shell).
- **Conflicts with:**
  - Two `<select>`s sharing one `<label>` — each needs its own label.
  - A custom-drawn dropdown layered over a hidden native select — see §13.

---

## 8 · Behaviour (JS contract)

**No JS.** The component is fully declarative — the native `<select>` owns open /
close, option navigation, type-ahead, and the platform picker. The consumer
wires a `change` listener if it needs the value; nothing about the styling
depends on script.

---

## 9 · Keyboard

Entirely native:

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Focus in / out. |
| `Space` / `Enter` / `Arrow` | Open the picker (platform-dependent). |
| `Arrow Up` / `Arrow Down` | Move selection (open or, on some platforms, closed). |
| type a letter | Jump to the next option starting with it (native type-ahead). |
| `Escape` | Close without changing the value. |

The system adds no key handling — and must not, because re-implementing native
select keyboarding is the classic accessibility regression (see §13).

---

## 10 · ARIA

Native `<select>` semantics carry the role; pair it with a `<label>` via
`for=` / `id` (or wrap both in `.dgo-field`). Use `aria-invalid="true"` to turn on
the error border, and `aria-describedby` to point at help / error text.

### Forced-colours behaviour

Under `forced-colors: active` the field's token-driven box maps to system colours
(`Canvas`, `CanvasText`, `Highlight`, `HighlightText`) via `input.css`, and the
1px border becomes a `CanvasText` edge. The custom chevron is a CSS
`background-image`; most engines **drop background images under forced colours**,
so the user sees the OS's own select affordance or no glyph plus the reserved
trailing space — the control stays operable either way. The hardcoded
`#5F5C5D` stroke is therefore moot in forced-colours mode but still wrong in
ordinary dark theme. See `docs/07-elevation.md` and §16.

### Reduced-motion behaviour

The field's `border-color` / `box-shadow` / `background-color` transitions
(`--dgo-motion-state`, from `input.css`) collapse to ≤ 50ms under
`@media (prefers-reduced-motion: reduce)`. The chevron does not animate. See
`docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** option text is rendered by the platform, but the field's
  resting line uses the input type ramp; the 40px height clears stacked Yorùbá /
  Hausa / Igbo marks on the selected value.
- **RTL:** the chevron position flips from `right` to `left` under
  `[dir="rtl"]` (`select.css` ships the mirrored `background-position`), and the
  trailing `padding-inline-end` reserve follows the logical edge automatically.
- **Translation expansion:** option-text wrapping is **platform-controlled** and
  cannot be styled. Keep option labels short (≤ ~40 chars); a long option may be
  truncated by the OS picker with no ellipsis you can control.

---

## 12 · Examples

### Basic

```html
<label class="dgo-field">
  <span class="dgo-label">Routing desk</span>
  <span class="dgo-select">
    <select class="dgo-select__field">
      <option>Compliance</option>
      <option>Operations</option>
    </select>
  </span>
</label>
```

### Invalid

```html
<span class="dgo-select">
  <select class="dgo-select__field" aria-invalid="true" aria-describedby="desk-err">
    <option value="">Choose a desk…</option>
    <option>Compliance</option>
  </select>
</span>
<p id="desk-err" class="dgo-field__error">Select a routing desk to continue.</p>
```

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of
the showcase (`index.html`) — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ A custom-drawn dropdown that hides the native `<select>` to get "nicer"
  styling.
  ✅ Mobile platforms ship battle-tested native pickers; replace the native
  control only with strong justification and full APG combobox compliance. The
  styled native select is the default for a reason.
- ❌ `<option>` text longer than ~40 characters.
  ✅ Option wrapping is platform-dependent and unstyleable. Keep options terse.
- ❌ Setting an explicit `width` on the `<select>`.
  ✅ Size the wrapper / grid cell; the field is `inline-size: 100%`.
- ❌ Relying on the chevron colour to signal a theme.
  ✅ The chevron is a fixed mid-grey today (§16). Don't build meaning on it.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-select__field` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `appearance: none` on `<select>` | required | Native arrow shows **in addition** to the custom chevron — degraded but usable. |
| Inline-SVG `data:` `background-image` | required | Trailing space remains; no glyph. |
| Logical `background-position` keywords | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Native `<select>` has the
broadest AT support of any control here, so this family is the lowest-risk row in
the matrix.

---

## 16 · Open questions

- **The chevron stroke is hardcoded `#5F5C5D`** inside the SVG `data:` URI, so it
  cannot follow `[data-theme]`. In dark theme it reads as a slightly low-contrast
  mid-grey on a dark field. Options: (a) split light / dark chevron URIs behind a
  theme selector, (b) use a masked element coloured by `currentColor`, or
  (c) `mask-image` driven by a `--dgo-color-fg-muted` background. Track at
  `[NITDA DS team: file v2.x cleanup ticket]`.
- **The `24px` chevron reserve is a literal**, not a token. A
  `--dgo-select-chevron-reserve` component token would let dense layouts tune it
  and bring `select.css` back to full token discipline.
- **Custom listbox / combobox** (icons, two-line labels, async search) is
  unshipped. For richer rendering, compose `.dgo-cmdk--inline` rather than
  hacking the native select.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Styled native `<select>` sharing the `.dgo-input` box. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): documented the two-file (`input.css` + `select.css`) architecture and exact inherited states, corrected §6 to `inline-size: 100%`, and logged the hardcoded `#5F5C5D` chevron / `24px` reserve as token-discipline exceptions. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
