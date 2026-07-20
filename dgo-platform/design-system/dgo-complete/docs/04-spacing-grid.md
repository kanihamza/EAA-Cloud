# 04 · Spacing & Grid

> Every spacing decision in DGO snaps to a **4-pt grid**. Containers stop at five
> production widths. Breakpoints are declared once. This page is the source of truth
> for all three.

The values below come directly from `tokens.primitive.css`. If you find yourself
typing a px value into a component CSS file, you are off the grid — pick a token.

---

## The spacing ramp (4-pt grid)

Twenty stops, optimised so the gaps you reach for most often (12, 16, 24, 40) are full
ticks, not half-steps.

| Token | Value | Common use |
|---|---:|---|
| `--dgo-s-0`    | 0    | Reset / collapse a margin. |
| `--dgo-s-px`   | 1px  | Hairline divider only. |
| `--dgo-s-0_5`  | 2px  | Focus-ring inner padding, off-grid by design. |
| `--dgo-s-1`    | 4px  | Icon-to-text gap inside a chip. |
| `--dgo-s-1_5`  | 6px  | Compact button gap (`[data-density="compact"]`). |
| `--dgo-s-2`    | 8px  | Default icon-to-text gap (`gap` on `.dgo-btn`). |
| `--dgo-s-3`    | 12px | Input padding-inline; table cell padding-inline. |
| `--dgo-s-4`    | 16px | Card section gap; alert padding; default form-field row gap. |
| `--dgo-s-5`    | 20px | Card padding; default page-content row gap. |
| `--dgo-s-6`    | 24px | Section-to-section spacing inside a card. |
| `--dgo-s-7`    | 28px | Display heading bottom margin (rare). |
| `--dgo-s-8`    | 32px | Top-level section spacing on dense pages. |
| `--dgo-s-9`    | 36px | Compact-density data table row height; pagination button width. |
| `--dgo-s-10`   | 40px | Comfortable button height; default input height. |
| `--dgo-s-11`   | 44px | iOS/WCAG 2.2 minimum touch-target floor. |
| `--dgo-s-12`   | 48px | Large button; default density table row. |
| `--dgo-s-14`   | 56px | Topbar inner content height (topbar is 64px). |
| `--dgo-s-16`   | 64px | Topbar height (`--dgo-topbar-h`). |
| `--dgo-s-20`   | 80px | Block-level section spacing on landing-style pages. |
| `--dgo-s-24`   | 96px | Hero block padding; rarely correct anywhere else. |

> **Why is there a 6 (`s-1_5`) but no 5 or 7 at the small end?** The compact-density
> ramp lives at 2 / 4 / 6 / 8, and the comfortable ramp at 4 / 8 / 12 / 16. The
> half-step at `s-1_5` is the only deliberate off-grid value, included so compact
> density can land between the comfortable stops without inventing a new ramp.

### Component anchors

These component-tier tokens are pegged to the ramp; do not let them drift.

| Component token | Value (comfortable) | Value (compact) | Ramp stop |
|---|---:|---:|---|
| `--dgo-btn-h-sm`   | 32 | 28 | s-8 / s-7 |
| `--dgo-btn-h-md`   | 40 | 32 | s-10 / s-8 |
| `--dgo-btn-h-lg`   | 48 | 40 | s-12 / s-10 |
| `--dgo-input-h`    | 40 | 32 | s-10 / s-8 |
| `--dgo-table-row-h`| 48 | 36 | s-12 / s-9 |
| `--dgo-card-pad`   | 20 | 16 | s-5 / s-4 |
| `--dgo-topbar-h`   | 64 | 64 | s-16 |

### Touch targets — the hard floor

Every interactive element on a touch surface must clear **44×44 px** (`--dgo-s-11`),
even when its visible glyph is smaller (e.g. an icon button). The rule applies to:

- Buttons, link-buttons, icon-buttons.
- Form controls (input, select, checkbox, radio, switch).
- Table row actions and bulk-action checkboxes.
- Tab triggers, breadcrumb items, pagination cells.

If the visible chrome is smaller, expand the **hit area** with an outside padding /
pseudo-element / `::before` overlay — do not enlarge the visible glyph. See
`08-accessibility.md` for the per-component minima.

---

## Breakpoints

Six breakpoints, declared in `tokens.primitive.css` for reference only. Components
use these inside `@media` queries; do not consume them as raw values in app code.

| Token | Value | Devices that anchor it |
|---|---:|---|
| `--dgo-bp-xs`  | 360px  | Small phones (one-handed reach). |
| `--dgo-bp-sm`  | 600px  | Large phones in portrait. |
| `--dgo-bp-md`  | 905px  | Tablets in portrait; small laptops. |
| `--dgo-bp-lg`  | 1240px | Desktops at default zoom. |
| `--dgo-bp-xl`  | 1440px | Large desktops, default for operations consoles. |
| `--dgo-bp-2xl` | 1920px | Wall displays, ops floor monitors. |

**Mobile-first**: write the base rule for `< xs`, then layer up with `@media (min-width: …)`.
Never start at desktop and walk down.

```css
.dgo-card { padding: var(--dgo-s-4); }
@media (min-width: 600px)  { .dgo-card { padding: var(--dgo-s-5); } }
@media (min-width: 1240px) { .dgo-card { padding: var(--dgo-s-6); } }
```

When component-internal layout depends on the **container** rather than the viewport,
use `container-type: inline-size` and the `@container` query — most components in the
shipped set (card, modal, sidebar, filter-bar) already do.

---

## Containers

Five canonical content widths. Pick the smallest one your content fits inside.

| Token | Value | Typical use |
|---|---:|---|
| `--dgo-c-narrow`  | 640px  | Auth screens, single-column forms, error pages. |
| `--dgo-c-text`    | 720px  | Long-form reading (memos, policy text — ~70ch with body family). |
| `--dgo-c-content` | 960px  | Standard application body. |
| `--dgo-c-wide`    | 1240px | Data-dense screens (tables, dashboards). |
| `--dgo-c-full`    | 1440px | Wall-mounted operations consoles. |

Centre with `margin-inline: auto` and gutter with `padding-inline: var(--dgo-s-4)` on
mobile, `var(--dgo-s-6)` from `--dgo-bp-md` up.

```css
.page {
  max-inline-size: var(--dgo-c-content);
  margin-inline: auto;
  padding-inline: var(--dgo-s-4);
}
@media (min-width: 905px) {
  .page { padding-inline: var(--dgo-s-6); }
}
```

---

## Layout grid

The reference grid is **12 columns, 24 px gutter, 24 px outer margin** from
`--dgo-bp-md` upward; **4 columns, 16 px gutter** below it. The shipped components
do not require CSS Grid to use them — they're written with flexbox + intrinsic
sizing so they compose inside any grid system the app picks.

If you ship a grid utility, peg it to:

| Span breakpoint | Columns | Gutter | Outer margin |
|---|---:|---:|---:|
| `< sm` (360–600) | 4  | 16px (`--dgo-s-4`) | 16px (`--dgo-s-4`) |
| `sm – md`        | 8  | 16px (`--dgo-s-4`) | 24px (`--dgo-s-6`) |
| `≥ md`           | 12 | 24px (`--dgo-s-6`) | 24px (`--dgo-s-6`) |
| `≥ xl`           | 12 | 24px (`--dgo-s-6`) | 40px (`--dgo-s-10`) |

---

## Radii on the grid

The radius scale (`--dgo-r-*`) is **not** the spacing scale — it has its own intent
tier (`--dgo-radius-sharp/control/card/frame/circle`). Mapping for reference:

| Intent | Value | Typical |
|---|---:|---|
| `--dgo-radius-sharp`   | 2px  | Tags, table headers. |
| `--dgo-radius-control` | 6px  | Buttons, inputs, segmented controls, pagination. |
| `--dgo-radius-card`    | 10px | Cards, popovers, dropdown menus. |
| `--dgo-radius-frame`   | 18px | Modals, drawers, hero panels. |
| `--dgo-radius-circle`  | pill | Avatars, badges, switches. |

Don't mix tiers within a single composition — a card with `--dgo-radius-frame` reads
as a modal that forgot to open.

---

## Stack rhythm

Inside a stacked layout (cards in a column, fields in a form), the recommended
vertical rhythm is:

- **Within a card body** — `gap: var(--dgo-s-4)` (16px) between fields.
- **Between cards in a column** — `gap: var(--dgo-s-5)` (20px).
- **Between major page sections** — `gap: var(--dgo-s-8)` (32px) up to `--dgo-bp-md`,
  `var(--dgo-s-10)` (40px) above.
- **Inside a tight list (e.g. menu items)** — `gap: var(--dgo-s-1)` (4px). Pad the
  item, not the gap, when the row needs a hover surface.

Prefer `display: flex` / `display: grid` with `gap` over per-element margin. Margin
collapse and direction-reversal bugs are the second-biggest source of layout
regressions after hard-coded px values.

---

## Off-grid escape hatches

Three places where off-grid values are tolerated:

1. **Focus-ring inset** — 2/5/9 px stacks. Driven by `--dgo-focus-ring`; do not
   substitute another value.
2. **Hairline dividers** — 1px (`--dgo-s-px`). Use sparingly; prefer surface
   elevation.
3. **Icon-optical alignment** — when a 24×24 icon sits next to body text, you may
   nudge by 1px to optically centre on the cap-height. Comment it.

Anything else off-grid is a bug. The lint rule that catches this is **TODO**;
until it ships, code review carries the load.
