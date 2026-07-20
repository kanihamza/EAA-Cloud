# 07 · Elevation

> Elevation in DGO is a **green-tinted shadow ramp** paired with a fixed z-index
> scale. The shadows aren't grey because every surface in the system sits on
> brand-deep-green's optical neighbourhood — neutral grey shadows on a green page
> read as dirt.

The system ships seven shadow stops, a six-level intent tier, and a ten-level
z-index scale. All three are in `tokens.primitive.css` and `tokens.semantic.css`.

---

## The shadow ramp (primitive tier)

Seven stops, declared in `tokens.primitive.css`. The tint is `rgba(5, 88, 59, …)` —
that's `--dgo-green-700` (the brand deep green) in raw rgba form.

| Token | Value | Read as |
|---|---|---|
| `--dgo-shadow-0` | `none` | Flush — no shadow. |
| `--dgo-shadow-1` | `0 1px 2px rgba(5, 88, 59, 0.06)` | A drawn edge. Barely there. |
| `--dgo-shadow-2` | `0 1px 3px rgba(5, 88, 59, 0.10), 0 1px 2px rgba(5, 88, 59, 0.06)` | The card stop. |
| `--dgo-shadow-3` | `0 4px 6px rgba(5, 88, 59, 0.10), 0 2px 4px rgba(5, 88, 59, 0.06)` | Card lifted on hover. |
| `--dgo-shadow-4` | `0 10px 15px rgba(5, 88, 59, 0.12), 0 4px 6px rgba(5, 88, 59, 0.06)` | Popover, dropdown, tooltip. |
| `--dgo-shadow-5` | `0 20px 28px rgba(5, 88, 59, 0.16), 0 8px 12px rgba(5, 88, 59, 0.08)` | Modal. |
| `--dgo-shadow-6` | `0 28px 40px rgba(5, 88, 59, 0.20), 0 12px 18px rgba(5, 88, 59, 0.10)` | Reserved — not consumed by any shipped component. Keep for a future full-screen sheet. |

### Why two-shadow stacks from stop 2 up

Every stop ≥ 2 is **two shadows composed** — a tight one for the contact edge, a
diffuse one for the ambient drop. Single shadows read either too crisp (no
ambient) or too soft (no contact); the stack carries both cues simultaneously.

### The tint, formally

`#05583B` at varying alpha. Pulled to RGB:

```
rgba(5, 88, 59, α)
```

If you ever need to extend the ramp (don't — promote the use-case up the tier
ladder instead), match the tint. A neutral-grey shadow on a green-700 brand
surface generates a colour cast that fights the brand.

---

## Intent tier (the only thing components touch)

Six entries in `tokens.semantic.css`. Components consume **these** — never the
primitives directly.

| Token | Resolves to | Used by |
|---|---|---|
| `--dgo-elevation-flat`    | `--dgo-shadow-0` | Flat card, embedded panels, sidebar children. |
| `--dgo-elevation-card`    | `--dgo-shadow-2` | `--dgo-card-shadow` (default card rest state). |
| `--dgo-elevation-raised`  | `--dgo-shadow-3` | `--dgo-card-shadow-hover`. The card-on-hover lift. |
| `--dgo-elevation-overlay` | `--dgo-shadow-4` | `--dgo-popover-shadow`. Toasts also consume this directly. |
| `--dgo-elevation-modal`   | `--dgo-shadow-5` | `--dgo-modal-shadow`. Drawer also consumes this directly. |
| `--dgo-elevation-popover` | `--dgo-shadow-4` | Alias of `-overlay`. Component-tier readability — `popover-shadow` and `overlay` are the same physical lift, named for the consumer. |

> **Why no `--dgo-elevation-sheet`** mapped to shadow-6. Sheet would be a fullscreen
> bottom panel on mobile; we don't ship that component yet. When we do, the ramp
> already has the stop reserved.

---

## Z-index scale

Elevation has two dimensions — the **visual** dimension (shadow) and the **stacking**
dimension (z-index). They go together; a popover that lifts visually but stacks
below a sticky topbar is a bug.

From `tokens.primitive.css`:

| Token | Value | What lives there |
|---|---:|---|
| `--dgo-z-base`     | 0    | The page. |
| `--dgo-z-raised`   | 10   | Floating UI on the page (sticky cards, in-flow popovers anchored to a row). |
| `--dgo-z-sticky`   | 100  | Sticky table headers, sticky form footers. |
| `--dgo-z-fixed`    | 200  | Fixed-position chrome — the topbar, the sidebar. |
| `--dgo-z-overlay`  | 900  | Backdrops behind modals (the shipped modal backdrop sits at `--dgo-z-modal` because it shares the same z as its content; this layer is reserved for non-modal scrim use). |
| `--dgo-z-modal`    | 1000 | Modal & drawer. |
| `--dgo-z-popover`  | 1100 | Popovers (must sit above an open modal — popovers can be anchored to a control inside a modal). |
| `--dgo-z-toast`    | 1200 | Toasts. Must clear popovers — a toast announcing the result of the popover's action would otherwise hide behind it. |
| `--dgo-z-tooltip`  | 1300 | Tooltips. Topmost first-class layer. |
| `--dgo-z-max`      | 2147483647 | Escape hatch for full-page modal overrides (printing, error boundaries). Never use in normal application code. |

The gaps (10 → 100 → 200 → 900) are intentional — they leave room for in-app
custom layers without colliding with system layers.

### Pairing — visual + stacking

| Intent | Shadow | Z-index |
|---|---|---|
| Flat / flush | `--dgo-elevation-flat`    | `--dgo-z-base` |
| Card         | `--dgo-elevation-card`    | `--dgo-z-base` (cards sit *in flow*, not above) |
| Card hover   | `--dgo-elevation-raised`  | `--dgo-z-raised` |
| Sticky chrome | `--dgo-elevation-flat`   | `--dgo-z-sticky` (sticky elements often have no shadow — the scroll boundary is the cue) |
| Topbar / sidebar | `--dgo-elevation-flat` | `--dgo-z-fixed` |
| Popover / dropdown | `--dgo-elevation-overlay` | `--dgo-z-popover` |
| Toast        | `--dgo-elevation-overlay` | `--dgo-z-toast` |
| Modal / drawer | `--dgo-elevation-modal` | `--dgo-z-modal` |
| Tooltip      | `--dgo-elevation-overlay` | `--dgo-z-tooltip` |

A topbar at fixed position with shadow-4 is **wrong** — it reads as a popover that
forgot it was on the page. Fixed chrome that needs separation from scrolling
content uses a border, not elevation.

---

## Surface as elevation

Shadows do work in light themes. In **dark** and **high-contrast** themes,
elevation is carried as much by **surface contrast** as by shadow.

### Light theme (default)

Surfaces are tonally tight (white on white-grey), so the green-tinted shadow does
the lifting work. From `tokens.semantic.css`:

```
--dgo-color-surface-page    →  white
--dgo-color-surface-raised  →  white       (same colour, shadow does the lift)
--dgo-color-surface-sunken  →  ink-50      (a step down)
```

### Dark theme (`[data-theme="dark"]`)

Surfaces step up tonally; shadows step **down** in saturation and step **up** in
opacity (per `tokens.theme-dark.css`):

```
--dgo-color-surface-page    →  #0B1410   (deepest)
--dgo-color-surface-raised  →  #122019   (a clear step up)
--dgo-color-surface-sunken  →  #081109   (a clear step down)
--dgo-shadow-2              →  pure black rgba(0,0,0,0.50) at 1px3px + 1px2px
--dgo-shadow-3              →  pure black at 0.50 + 0.30
--dgo-shadow-4              →  pure black rgba(0,0,0,0.55)
--dgo-shadow-5              →  pure black rgba(0,0,0,0.60)
```

The green tint disappears in dark — on a near-black surface it would re-emerge as
a green halo. A neutral-black shadow on a green-700 dark theme reads correctly
because the underlying surface is already dark.

### High-contrast theme (`[data-theme="hc"]`)

HC rebinds **borders** to `#000000` across the board. Shadows are unchanged from
the primitive ramp, but the visual hierarchy is now carried by **the border**, not
the lift. A card with a 1px black border and `--dgo-shadow-2` reads correctly; the
shadow becomes a supporting cue rather than the primary one.

> Practical rule: in HC, never rely on shadow alone to indicate elevation. Every
> elevated surface must also have an explicit border. The shipped card / modal /
> input rules already follow this — `--dgo-input-border` rebinds to black under HC,
> `--dgo-card-border` to black, etc.

### Forced colours

When the OS enables `forced-colors: active` (high-contrast mode on Windows; some
assistive-tech configurations), shadows render as nothing at all — the browser
strips `box-shadow`. The shipped components survive this gracefully because every
elevated surface already has a `border`. If you write a new elevated component,
verify under Windows forced-colors that it still reads as separable from its
parent — if it dissolves, add a border.

---

## When to lift, when not to

A page where everything is elevated is a page where nothing is elevated. Three
rules:

1. **Default to flat.** A card with `--dgo-elevation-flat` and a 1px border reads
   as well-organised. Reach for `--dgo-elevation-card` only when the content needs
   to feel **detachable** (a draggable item, a saved view, a card the user might
   bookmark or share).
2. **Hover lift earns its keep.** `--dgo-card-shadow-hover` exists because the card
   says "click me." A dashboard tile that doesn't navigate anywhere shouldn't lift
   on hover.
3. **Lift everything inside a modal back down.** Cards inside a modal that already
   sits at `--dgo-elevation-modal` should drop to `--dgo-elevation-flat`. Two
   competing lift cues inside one bounded surface read as noise.

---

## Anti-patterns

- ❌ `box-shadow: 0 4px 8px rgba(0,0,0,0.1)`. Off-tint, off-stop, hard-coded. Use a
  token.
- ❌ Mixing shadow stops within a composition (a card at `shadow-2` next to a card
  at `shadow-4` inside the same grid). Pick one stop per surface tier.
- ❌ Elevating an inline element. Buttons inside cards do not need `shadow-1`.
  Pressing a button reads as press without a shadow; adding one creates a Russian-
  doll lift the user has to parse.
- ❌ Sticky chrome with elevation. The brief shadow that appears under a sticky
  table header on scroll is acceptable (it cues "this is now floating"), but the
  rest of the time the header sits flush. The shipped table component handles
  this — don't reinvent it inline.
- ❌ Negative z-index. Pulling something **below** the page (`z-index: -1`)
  removes it from the accessibility tree on most engines. If you need a
  background decoration, use `position: absolute` with `z-index: 0` and the
  pointer-events-none + aria-hidden pair.
- ❌ `z-index: 9999`. The escape hatch is `--dgo-z-max`; the layered scale
  exists so you don't need one. If you're at 9999, you're stacking against
  something at 10000 next sprint.

---

## Open questions (for v2.2)

- A **soft-shadow / hard-shadow** dual variant for the card stop (the brand is
  currently soft-only). Useful if we add a "document" card style for memos and
  certificates that want a paper-on-paper feel.
- A **focus-ring elevation** stop — the focus ring is a 2px+5px stack today, not
  a `box-shadow` per se. Worth promoting to a named primitive (`--dgo-shadow-focus`)
  if a future component (segmented control, command palette) needs to compose
  focus on top of its own shadow without flicker.
