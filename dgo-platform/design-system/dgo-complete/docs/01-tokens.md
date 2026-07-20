# 01 · Token Reference

> **Index of every CSS custom property shipped in `dgo-design-system/tokens/` (v2.0).**
> Authored by walking each `tokens.*.css` file. No values are invented; if a token is not in
> the shipped files, it is not listed here.

The system is built in four tiers. Tier 1 is raw values; tiers 2–4 reference up the chain.
You should consume the **highest tier that fits your intent**.

| Tier | File | Purpose | Consumers |
|---|---|---|---|
| 1 · Primitive | `tokens.primitive.css` | Raw hex / px / ms / unitless numbers. The palette. | Tier 2 only. **Never consume directly from components.** |
| 2 · Semantic  | `tokens.semantic.css`  | Intent-named (`--dgo-color-fg-default`, `--dgo-type-h2`, `--dgo-elevation-card`). | Components, app code. |
| 3 · Component | `tokens.component.css` | Per-component bindings (`--dgo-btn-h-md`, `--dgo-card-pad`). | The component CSS for that family only. |
| 4 · Theme / Density | `tokens.theme-*.css`, `tokens.density.css` | Re-bindings activated by `[data-theme]` / `[data-density]` attributes. | Set on `<html>` or any scoped ancestor. |

The cascade order is fixed in `styles/components/_index.css`:

```css
@layer dgo-reset, dgo-base, dgo-component, dgo-utility;
```

Token files are not layered — they live in the unlayered cascade so app overrides on
`:root` always win, which is the intended escape hatch for product-team theme overlays.

---

## Tier 1 · Primitive (`tokens.primitive.css`)

### Color · Primary Green
`--dgo-green-50` · `--dgo-green-100` · `--dgo-green-200` · `--dgo-green-300` ·
`--dgo-green-400` · `--dgo-green-500` · `--dgo-green-600` ·
**`--dgo-green-700`** *(brand deep green — PANTONE 7484C sibling)* ·
`--dgo-green-800` · `--dgo-green-900` · `--dgo-green-950`

### Color · Accent / Smart Green
`--dgo-smart-50` … `--dgo-smart-300` · **`--dgo-smart-400`** *(brand smart green — PANTONE 354C)* ·
`--dgo-smart-500` · `--dgo-smart-600` · `--dgo-smart-700` · `--dgo-smart-800`

### Color · Ink (warm-cool neutral)
`--dgo-ink-0` (white) · `--dgo-ink-25` · `--dgo-ink-50` · `--dgo-ink-100` · `--dgo-ink-200` ·
`--dgo-ink-300` · `--dgo-ink-400` · `--dgo-ink-500` · `--dgo-ink-600` ·
**`--dgo-ink-700`** *(brand black)* · `--dgo-ink-800` · `--dgo-ink-900` · `--dgo-ink-1000`

### Color · Paper
`--dgo-paper` · `--dgo-paper-raised` · `--dgo-paper-sunken` · `--dgo-overlay-tint` (rgba)

### Color · Status Hues
| Hue | Stops |
|---|---|
| info   | `--dgo-info-50/100/400/600/800` |
| warn   | `--dgo-warn-50/100/400/600/800` |
| danger | `--dgo-danger-50/100/400/600/800` |

### Color · Restricted Use
`--dgo-coa-red` · `--dgo-coa-yellow` — Coat-of-arms reproductions only.
**Never use for general UI.** See §02-color.

### Color · Data Viz
- **Categorical (8):** `--dgo-cat-1` … `--dgo-cat-8` (deep green, smart green, civic blue, amber, red, indigo, gold-brown, teal).
- **Sequential (single-hue green):** `--dgo-seq-1` … `--dgo-seq-5`.
- **Diverging:** `--dgo-div-neg-2`, `--dgo-div-neg-1`, `--dgo-div-mid`, `--dgo-div-pos-1`, `--dgo-div-pos-2`.

### Type · Families
| Token | Stack head | Role |
|---|---|---|
| `--dgo-family-display` | Outfit | Display & headings |
| `--dgo-family-sans`    | Inter  | UI sans default |
| `--dgo-family-body`    | Verdana | Long-form body (high-screen-readability fallback chain) |
| `--dgo-family-mono`    | JetBrains Mono | Code, kbd, tabular figures |

### Type · Sizes (1.200 modular scale, 8 steps + 2 display)
`--dgo-size-12 / 14 / 16 / 19 / 23 / 28 / 33 / 40 / 48 / 60`

### Type · Weights
`--dgo-wt-300 / 400 / 500 / 600 / 700 / 800`

### Type · Line Heights (diacritic-safe set)
`--dgo-lh-100 / 110 / 120 / 140 / 150 / 170`

> **Note for §03-typography:** `--dgo-lh-150` and above are the line-heights cleared for
> Yoruba, Igbo, and Hausa tone-mark stacks. Anything tighter risks clipping combining marks.

### Type · Tracking
`--dgo-tr-tightest / -tight / -normal / -wide / -wider / -widest`

### Spacing · 4-pt Grid
`--dgo-s-0 / -px / -0_5 / -1 / -1_5 / -2 / -3 / -4 / -5 / -6 / -7 / -8 / -9 / -10 / -11 / -12 / -14 / -16 / -20 / -24`
*(see §04-spacing-grid for the rendered ramp and pixel values)*

### Radius
`--dgo-r-0 / -2 / -4 / -6 / -8 / -10 / -12 / -16 / -18 / -24 / -pill`

### Border widths
`--dgo-bw-0 / -1 / -2 / -3 / -4`

### Elevation · Shadow stops (green-tinted in light theme)
`--dgo-shadow-0` (none) · `--dgo-shadow-1` … `--dgo-shadow-6`

### Motion · Duration
`--dgo-dur-instant` (50ms) · `--dgo-dur-fast` (150ms) · `--dgo-dur-base` (250ms) ·
`--dgo-dur-slow` (400ms) · `--dgo-dur-deliberate` (600ms)

### Motion · Easing
`--dgo-ease-standard` · `--dgo-ease-entrance` · `--dgo-ease-exit` ·
`--dgo-ease-emphasized` · `--dgo-ease-sharp` · `--dgo-ease-linear`

### Z-Index
`--dgo-z-base` (0) · `--dgo-z-raised` (10) · `--dgo-z-sticky` (100) · `--dgo-z-fixed` (200) ·
`--dgo-z-overlay` (900) · `--dgo-z-modal` (1000) · `--dgo-z-popover` (1100) ·
`--dgo-z-toast` (1200) · `--dgo-z-tooltip` (1300) · `--dgo-z-max`

### Opacity
`--dgo-op-0 / 10 / 20 / 40 / 60 / 80 / 95 / 100`

### Blur
`--dgo-blur-0 / 4 / 8 / 16`

### Breakpoints (reference only — used inside `@media` clauses)
`--dgo-bp-xs` 360px · `--dgo-bp-sm` 600px · `--dgo-bp-md` 905px ·
`--dgo-bp-lg` 1240px · `--dgo-bp-xl` 1440px · `--dgo-bp-2xl` 1920px

### Container widths
`--dgo-c-narrow` 640px · `--dgo-c-text` 720px · `--dgo-c-content` 960px ·
`--dgo-c-wide` 1240px · `--dgo-c-full` 1440px

---

## Tier 2 · Semantic (`tokens.semantic.css`)

Components must consume these — **never reach into primitives from a component file**.
Themes swap primitives behind these names; reaching past the abstraction breaks dark mode
and the high-contrast theme.

### Action
`--dgo-color-action-primary` / `-hover` / `-press` / `-soft`
`--dgo-color-action-accent`  / `-hover` / `-press` / `-soft`
`--dgo-color-action-secondary` / `-hover` / `-press`
`--dgo-color-action-danger` / `-hover` / `-soft`

### Surface
`--dgo-color-surface-page` · `-raised` · `-sunken` · `-muted` · `-inverse` · `-brand` · `-overlay`

### Foreground / text
`--dgo-color-fg-default` · `-strong` · `-muted` · `-subtle` · `-disabled`
`--dgo-color-fg-on-brand` · `-on-accent`
`--dgo-color-fg-link` · `-link-hover` · `-link-visited`

### Border
`--dgo-color-border-default` · `-strong` · `-stronger` · `-brand` · `-accent` ·
`-on-brand` · `-focus`

### Status pairs (subtle + strong)
`--dgo-color-info-subtle-{bg,fg}`     · `--dgo-color-info-strong-{bg,fg}`
`--dgo-color-success-subtle-{bg,fg}`  · `--dgo-color-success-strong-{bg,fg}`
`--dgo-color-warning-subtle-{bg,fg}`  · `--dgo-color-warning-strong-{bg,fg}`
`--dgo-color-danger-subtle-{bg,fg}`   · `--dgo-color-danger-strong-{bg,fg}`

### Operational status (DGO workflow vocabulary)
`--dgo-color-status-pending-{bg,fg}` · `-routed-` · `-replied-` · `-action-` ·
`-draft-` · `-archived-` · `-escalated-`

### Focus
`--dgo-focus-ring` (default, 2-ring stack with smart-400 outer)
`--dgo-focus-ring-inset` (3px inset, for compact controls inside scrollers)

### Type intent
`--dgo-type-display-xxl` / `-xl` / `-display` / `-h1` / `-h2` / `-h3` / `-h4` /
`-body-lg` / `-body` / `-body-sm` / `-caption`

### Radius intent
`--dgo-radius-sharp` (2px) · `-control` (6px) · `-card` (10px) · `-frame` (18px) · `-circle` (pill)

### Elevation intent
`--dgo-elevation-flat` · `-card` · `-raised` · `-overlay` · `-modal` · `-popover`

### Motion intent
`--dgo-motion-enter` · `-exit` · `-state` · `-hero`

> **Reduced-motion override:** `@media (prefers-reduced-motion: reduce)` collapses
> `--dgo-dur-fast/base` to 0ms and `--dgo-dur-slow/deliberate` to 50ms. Components
> consuming `--dgo-motion-*` automatically respect the user's setting. See §06-motion.

---

## Tier 3 · Component (`tokens.component.css`)

The full per-component binding list. **Each component CSS file under `styles/components/`
consumes only the tokens for its family** (and the semantic tier above). If you add a
component, declare its tokens here, not inline in the rule.

| Family | Tokens (selected — full list in `tokens.component.css`) |
|---|---|
| Button | `--dgo-btn-radius`, `--dgo-btn-fw`, `--dgo-btn-tracking`, `--dgo-btn-h-{sm,md,lg}`, `--dgo-btn-px-{sm,md,lg}` |
| Input  | `--dgo-input-{radius,h,px,bg,bg-disabled,border,border-hover,border-focus,border-error,placeholder}` |
| Card   | `--dgo-card-{bg,border,radius,pad,shadow,shadow-hover}` |
| Badge  | `--dgo-badge-{radius,h,px,fs,fw,tracking}` |
| Tag    | `--dgo-tag-{radius,h}` |
| Alert  | `--dgo-alert-{radius,pad,border-w}` |
| Modal / Drawer | `--dgo-modal-{radius,pad,w,w-lg,shadow}`, `--dgo-drawer-w` |
| Popover / Tooltip | `--dgo-popover-{radius,pad,shadow}`, `--dgo-tooltip-{bg,fg,radius}` |
| Table  | `--dgo-table-{row-h,cell-px,header-bg,header-fg,row-hover,border}` |
| Sidebar / Topbar | `--dgo-sidebar-{w,w-collapsed,bg,fg}`, `--dgo-topbar-{h,bg,border}` |
| Tabs   | `--dgo-tabs-{indicator-h,indicator}` |
| Pagination | `--dgo-pagination-{h,radius}` |
| Progress | `--dgo-progress-{h,track,fill}` |
| Skeleton | `--dgo-skeleton-{base,shine}` |
| Code / Kbd | `--dgo-code-{bg,fg}`, `--dgo-kbd-{bg,border}` |

---

## Tier 4 · Theme & Density

### Themes (`data-theme="…"` on `<html>` or a scoped subtree)
| Attribute | File | Notes |
|---|---|---|
| *(unset)* | — | Light is the default; no attribute needed. |
| `light`   | `tokens.theme-light.css` | Currently a passthrough — present so apps can scope a light island inside a dark page. |
| `dark`    | `tokens.theme-dark.css`  | Re-binds surfaces, fg, borders, status subtle bgs (alpha-on-page), shadows (deeper), focus ring (smart-300 outer). Sets `color-scheme: dark`. |
| `hc`      | `tokens.theme-hc.css`    | Pushes text to true black/white, borders to black, focus ring to a 3-stack white/black/amber. Also handles `@media (forced-colors: active)`. |

### Density (`data-density="…"` on any container)
| Attribute | File | Effect |
|---|---|---|
| *(unset)* or `comfortable` | `tokens.density.css` | 40px input/button, 48px row, `--dgo-s-5` card padding. |
| `compact` | `tokens.density.css` | 32px input/button, 36px row, `--dgo-s-4` card padding. **Apply per-region** (e.g. a data table) — do not set globally without reviewing hit-target rules in §08-accessibility. |

---

## Token-naming convention

```
--dgo-{tier-prefix}-{family}-{role}-{state-or-variant}
```

- **Prefix is always `--dgo-`** — no exceptions.
- **`color`** appears only in tier-2 names (`--dgo-color-fg-default`). Tier-1 colors are
  named by hue, not the word "color" (`--dgo-green-700`).
- **State suffixes** are `-hover`, `-press` (not `active`), `-disabled`, `-error`,
  `-visited`. Component-only states (e.g. button loading) stay inside the CSS as
  internal custom properties (`--_loading`).
- **Numeric stops** ramp 0 → 1000; brand-key stops sit at 700 (primary green) and 400
  (smart green). Don't insert new stops without an RFC (`governance/component-rfc-template.md`).

---

## Adding a new token

1. Decide its tier. If it's a raw value, tier 1. If it names an intent that themes will
   swap, tier 2. If it binds to a single component, tier 3.
2. Open the corresponding file. Add the token in the right section block.
3. Reference up the chain — tier 3 should not reach into tier 1 except for a measured
   exception (e.g. `--dgo-btn-h-md` is a raw px because it's the source for density
   overrides; documented inline).
4. If it's a color, run the contrast computation in §02-color before merging.
5. Add to the index above as part of the same PR.
