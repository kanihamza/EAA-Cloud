# `command-palette`

> A keyboard-first launcher. Press `Ctrl + K` (or `⌘ + K` on macOS) anywhere in
> the DGO surface to open a single-input panel that searches across navigation,
> actions, and recent dossiers. Type to filter; arrow keys to highlight; `Enter`
> to invoke; `Esc` to dismiss.

**Status:** `proposed` — this document is the v2.1 worked example for the §11
component template. The CSS file at `styles/components/command-palette.css` lands
when this doc is approved.
**Since:** `v2.1` (proposed)
**File:** `styles/components/command-palette.css` (pending)
**Selector namespace:** `.dgo-cmdk__…` (BEM; `cmdk` is the family short-name)

---

## 1 · Anatomy

DOM order, from outermost to innermost:

- `.dgo-cmdk-backdrop` — full-viewport scrim. Hosts the `inert` toggle on the
  page's `<main>` and the click-outside dismissal.
- `.dgo-cmdk` — the dialog itself. Centered horizontally, anchored 14vh from the
  block-start. `role="dialog"` + `aria-modal="true"`.
- `.dgo-cmdk__search` — the input wrapper containing the magnifying-glass icon
  and the text input. Acts as the **combobox**.
- `.dgo-cmdk__input` — the `<input type="text">` element. Carries
  `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant`.
- `.dgo-cmdk__hint` — right-aligned hint text inside the search field
  (`Type to search · ↑↓ to navigate · ↵ to select`). Decorative.
- `.dgo-cmdk__listbox` — the scrollable results region. `role="listbox"`.
  Maximum block-size `40vh` to leave breathing room above and below on small
  screens.
- `.dgo-cmdk__group` — a labelled group inside the listbox. `role="group"` +
  `aria-labelledby`.
- `.dgo-cmdk__group-label` — the group heading (e.g. "Navigation", "Actions",
  "Recent dossiers"). Decorative — the AT-readable label sits on the group's
  `aria-labelledby`.
- `.dgo-cmdk__item` — a single result row. `role="option"` + `aria-selected` +
  `id` for `aria-activedescendant` reference.
- `.dgo-cmdk__item-icon` — leading icon (`aria-hidden="true"`).
- `.dgo-cmdk__item-label` — the primary visible text.
- `.dgo-cmdk__item-meta` — secondary text (right-aligned; sublocation or `kbd`
  shortcut chord).
- `.dgo-cmdk__empty` — empty-state row when the filter returns zero. `role="status"`.
- `.dgo-cmdk__footer` — non-result row at the block-end of the panel. Contains
  the small-print: keyboard hint summary on the inline-start, branded mark on
  the inline-end.

### Slot policy

| Slot | Allowed content |
|---|---|
| `__item-label` | Plain text or a `<mark>` highlighting the matched substring. No icons inside. |
| `__item-meta` | One of: a short string (≤ 24 chars), a `.dgo-kbd` group, or a `.dgo-badge`. Not a button. |
| `__group-label` | Plain text only (1–3 words). |
| `__footer` | Two children max: a hint line and the brand mark. Anything else is out of scope; raise the case in `__hint` or a tooltip. |

---

## 2 · Variants

| Class | Description | Use when |
|---|---|---|
| *(default)* | Centered, 14vh from block-start, max-inline-size `--dgo-cmdk-w`. | Default keyboard-first launcher. |
| `.dgo-cmdk--anchored` | Anchored to a specific UI element via `anchor-positioning` (where supported) instead of centred. Falls back to centred without `anchor-name`. | When the palette serves a *specific* control rather than the whole surface (e.g. an inline cell editor in a data grid). |
| `.dgo-cmdk--inline` | Renders in-flow (not a dialog). Used for filter-search inside a Drawer or a card. Drops the backdrop and the focus trap. | When the palette is **the page** (e.g. a dedicated `/search` surface) and not an overlay. |

`--inline` reads as a different component in ARIA terms — see §10.

---

## 3 · Sizes & density

The palette has a single physical size. `comfortable` and `compact` density both
apply.

| Size | Class | Inline-size | Block-size | Used when |
|---|---|---|---|---|
| Medium (default) | — | `--dgo-cmdk-w` (640px clamped) | intrinsic, max `min(80vh, 720px)` | Always — palette has no `sm`/`lg` siblings. |

The deliberate single-size choice is so the keyboard chord `Ctrl + K` produces an
identical visual every time, regardless of which page invoked it. Muscle memory
matters.

### Density behaviour

```
[data-density="comfortable"]:
  --dgo-cmdk-item-h    →  44px
  --dgo-cmdk-item-pad  →  var(--dgo-s-3)

[data-density="compact"]:
  --dgo-cmdk-item-h    →  36px
  --dgo-cmdk-item-pad  →  var(--dgo-s-2)
```

The 44px floor at comfortable density honours the touch-target rule (§04). Compact
mode is keyboard-only — a touch user on a tablet should be on comfortable.

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Closed | `[data-state="closed"]` on `.dgo-cmdk-backdrop` | `display: none` | data |
| Opening | `[data-state="opening"]` | Backdrop animates `dgo-fade-in`; panel animates `dgo-cmdk-in` (uses `dgo-modal-in` semantics) | data, on open |
| Open | `[data-state="open"]` | Rest state. | data |
| Closing | `[data-state="closing"]` | Reverse-direction animations on `--dgo-motion-exit` | data, on close |
| Input focus | `.dgo-cmdk__input:focus-visible` | None — the input has no visible ring (the entire dialog is the focus context). The "active item" cue replaces it. | keyboard |
| Item highlighted (active descendant) | `.dgo-cmdk__item[aria-selected="true"]` | Background `var(--dgo-cmdk-item-bg-active)`; icon and meta gain `--dgo-color-fg-on-accent` if the active background is brand-strong | data (input value + active index) |
| Item pressed | `.dgo-cmdk__item:active` | `transform: scale(0.99)` for `--dgo-dur-instant` | mouse |
| Item disabled | `.dgo-cmdk__item[aria-disabled="true"]` | `opacity: 0.6`; cursor `not-allowed`; not selectable via arrows | data |
| Empty results | `.dgo-cmdk__listbox[data-empty="true"]` | Listbox replaced by `__empty` row | data |
| Loading (async source) | `.dgo-cmdk[data-loading="true"]` | `__listbox` shows up to 5 skeleton rows; `aria-busy="true"` on the listbox | data |
| Error (async source) | `.dgo-cmdk[data-error="true"]` | `__listbox` replaced by an inline `.dgo-alert--danger` | data |

The **input never gets a focus ring** — by design. The focus indicator the user
sees is the highlighted item in the listbox. This is the WAI-ARIA combobox-with-
`aria-activedescendant` pattern: the input keeps focus while the active descendant
moves. See §10.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens (declared in `tokens.component.css`)

A new `--dgo-cmdk-*` block. Listed here because the doc is the spec; the token
file edit lands alongside the CSS.

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-cmdk-w`              | `clamp(320px, 90vw, 640px)` | — |
| `--dgo-cmdk-bg`             | `var(--dgo-color-surface-raised)` | theme:dark, theme:hc |
| `--dgo-cmdk-border`         | `var(--dgo-color-border-default)` | theme:hc → `#000` |
| `--dgo-cmdk-radius`         | `var(--dgo-radius-lg)` | — |
| `--dgo-cmdk-shadow`         | `var(--dgo-elevation-modal)` | — |
| `--dgo-cmdk-pad`            | `var(--dgo-s-2)` | — |
| `--dgo-cmdk-input-h`        | `48px` | density:compact → `40px` |
| `--dgo-cmdk-input-fs`       | `var(--dgo-type-body-lg)` | — |
| `--dgo-cmdk-input-bg`       | `transparent` | — |
| `--dgo-cmdk-item-h`         | `44px` | density:compact → `36px` |
| `--dgo-cmdk-item-pad`       | `var(--dgo-s-3)` | density:compact → `var(--dgo-s-2)` |
| `--dgo-cmdk-item-radius`    | `var(--dgo-radius-sm)` | — |
| `--dgo-cmdk-item-fs`        | `var(--dgo-type-body)` | — |
| `--dgo-cmdk-item-bg`        | `transparent` | — |
| `--dgo-cmdk-item-bg-active` | `var(--dgo-color-action-primary-soft)` | theme:hc → `Highlight` system colour |
| `--dgo-cmdk-item-fg-active` | `var(--dgo-color-fg-strong)` | theme:hc → `HighlightText` |
| `--dgo-cmdk-meta-fg`        | `var(--dgo-color-fg-muted)` | — |
| `--dgo-cmdk-group-label-fs` | `var(--dgo-fs-overline)` | — |
| `--dgo-cmdk-group-label-fg` | `var(--dgo-color-fg-muted)` | — |
| `--dgo-cmdk-backdrop-bg`    | `var(--dgo-overlay-tint)` | — |
| `--dgo-cmdk-z`              | `var(--dgo-z-modal)` | — |

### Tier 2 — Semantic tokens (read directly)

- `--dgo-focus-ring` — used on `.dgo-cmdk__input` **only** in HC theme where the
  active-descendant pattern doesn't carry enough contrast.
- `--dgo-motion-enter` — opening animation duration + easing.
- `--dgo-motion-exit`  — closing animation duration + easing.
- `--dgo-motion-state` — item-row hover / active-descendant transition.

### Tier 1 — Primitives

**Empty.** The component reads no primitive directly.

---

## 6 · Layout & sizing

- **Inline-size:** clamped via `--dgo-cmdk-w`. The lower bound (320px) protects
  mobile; the upper (640px) prevents long lines that hurt scan-ability.
- **Block-size:** intrinsic, capped at `min(80vh, 720px)`. The listbox alone
  caps at `40vh` so the search input is always visible during scroll.
- **Internal spacing:** `padding: var(--dgo-cmdk-pad)` on `.dgo-cmdk`. Items
  use `padding-inline: var(--dgo-cmdk-item-pad)`. Listbox `gap: 0` — rows
  butt against each other; visual separation is the radius + the hover lift.
- **Position:** `position: fixed; inset-block-start: 14vh; inset-inline-start: 50%;
  transform: translateX(-50%)`. Under `[dir="rtl"]` the transform is the
  same — translateX(-50%) is direction-agnostic when the anchor is `inset-inline-
  start: 50%`.
- **Container query (optional):** `container-type: inline-size; @container (max-
  width: 480px) { … }` — at narrow widths the `__item-meta` keyboard chord
  collapses to a chevron. Used only on the `--inline` variant; the dialog variant
  is already clamped above 320px.

---

## 7 · Composition

- **Contains:**
  - `.dgo-input` styling for `.dgo-cmdk__input` (same border, same focus
    semantics; the visible ring is suppressed but the input is still a real
    `<input>`).
  - `.dgo-kbd` for keyboard chord hints inside `__item-meta` and `__footer`.
  - `.dgo-badge` for status pills inside `__item-meta` (rare — used when a
    result is "Recently archived").
  - `.dgo-skeleton` for loading state.
  - `.dgo-alert--danger` for async error state.
- **Contained by:** No usual parent. The dialog mounts to `<body>` (or a portal
  root) — putting it inside a transformed ancestor breaks `position: fixed`.
  The `--inline` variant lives inside a `.dgo-card`, `.dgo-drawer`, or a
  page-level `<section>`.
- **Conflicts with:**
  - **Don't open the palette while a `.dgo-modal` is already open** — two
    `aria-modal="true"` overlays on the same page break the inert contract.
    The shipped pattern is: close any open modal, then open the palette; or
    open the palette **inside** the modal as the modal's primary content (in
    which case use the `--inline` variant).
  - **Don't nest a `.dgo-popover` inside the palette.** The palette already owns
    the focus context; a popover competes for `Esc` and active-descendant.

---

## 8 · Behaviour (JS contract)

The system ships CSS only; consuming apps implement the behaviour. The contract
below is what the CSS expects from the JS layer.

### Attributes the component reads

| Attribute | Carrier | Type | Meaning |
|---|---|---|---|
| `data-state` | `.dgo-cmdk-backdrop`, `.dgo-cmdk` | `"closed" \| "opening" \| "open" \| "closing"` | Drives mount + animation. CSS reacts; nothing else does. |
| `data-loading` | `.dgo-cmdk` | `"true" \| "false"` | Toggles the skeleton listbox. Pair with `aria-busy="true"` on `.dgo-cmdk__listbox`. |
| `data-error` | `.dgo-cmdk` | `"true" \| "false"` | Replaces the listbox with the error alert. |
| `data-empty` | `.dgo-cmdk__listbox` | `"true" \| "false"` | Renders the `__empty` row. |
| `aria-selected` | `.dgo-cmdk__item` | `"true" \| "false"` | Drives the active-row styling. Exactly one item carries `"true"` while the listbox is non-empty. |
| `aria-activedescendant` | `.dgo-cmdk__input` | id of the active `.dgo-cmdk__item` | Required by the combobox pattern. |
| `aria-expanded` | `.dgo-cmdk__input` | `"true" \| "false"` | Tracks whether the listbox is showing results. |
| `aria-disabled` | `.dgo-cmdk__item` | `"true" \| "false"` | Skipped during keyboard navigation. |

### Events the consumer fires

| Event | When | Payload |
|---|---|---|
| `cmdk:open`  | The palette mounts (after `Ctrl + K` or programmatic invocation) | `{ source: 'keyboard' \| 'button' \| 'programmatic' }` |
| `cmdk:close` | The palette unmounts | `{ reason: 'escape' \| 'outside-click' \| 'selection' \| 'programmatic' }` |
| `cmdk:query` | Throttled fire on input value change (suggested debounce: 80ms) | `{ value: string }` |
| `cmdk:select` | An item is invoked via mouse, `Enter`, or `Mod+number` | `{ id: string, group: string, value: string }` |
| `cmdk:navigate` | Active descendant changes (arrow keys, hover) | `{ id: string, index: number, total: number }` |

### Focus management

- **On open:** focus moves to `.dgo-cmdk__input`. The current input value is
  selected (so a second `Ctrl + K` press inside an open palette re-selects, not
  appends).
- **On close:** focus returns to the element that triggered the open. If the
  trigger was the keyboard chord (no specific element), focus returns to
  `document.body`; the consumer may choose to restore to the last
  `:focus-visible` element prior to open.
- **Inside the palette:** focus stays on `.dgo-cmdk__input` for the entire
  lifetime. The active row is communicated via `aria-activedescendant`, not by
  moving `document.activeElement`. **Do not** add `tabindex="0"` to
  `.dgo-cmdk__item`; it breaks the pattern.
- **Background:** `<main>` (or whichever page-content landmark) receives `inert`
  on open; removed on close.

### Filtering

The CSS is filter-strategy-agnostic. The JS may filter against title, group,
keywords, fuzzy match — the component doesn't care. The contract is:

- The JS replaces the `<li>` children of `.dgo-cmdk__listbox` and updates
  `data-empty` + `aria-activedescendant`.
- The JS does **not** mutate `display` on individual rows to hide them. Removed
  rows are removed from the DOM. This keeps screen-reader announcements honest
  ("4 results" not "27 results, 23 hidden").

### Shortcut binding

`Ctrl + K` (Windows / Linux / ChromeOS) and `⌘ + K` (macOS) are the **only**
shipped chords for the dialog variant. Consumers must:

1. Detect the chord on `keydown` at the document level (capture phase, so an
   input field with focus doesn't swallow it).
2. Call `event.preventDefault()` — `Ctrl + K` is the browser focus-the-address-
   bar chord on Firefox; the palette pre-empts it inside the application
   surface.
3. **Not** add an additional chord without a §14 entry. Custom shortcuts are
   per-action, declared on individual items via `__item-meta` `kbd` chips, and
   bound by the consumer outside the palette.

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Ctrl + K` / `⌘ + K` | Open the palette from anywhere on the surface. If already open, re-select the input value. |
| `Esc` | Close the palette. Focus returns to the trigger. If the input has a value, the **first** Esc clears the value; the **second** Esc closes. (Match the `<input type="search">` convention.) |
| `↓` (Down arrow) | Move active descendant to the next non-disabled item. Wraps from last to first. |
| `↑` (Up arrow) | Move active descendant to the previous non-disabled item. Wraps from first to last. |
| `Home` | Active descendant to first item. |
| `End` | Active descendant to last item. |
| `PageDown` | Move active descendant down by `--dgo-cmdk-page-size` items (default 5). Useful in long lists. |
| `PageUp` | Move active descendant up by the same. |
| `Enter` | Invoke the active item. Closes the palette unless the item is `data-keep-open="true"` (used for multi-step actions like "Insert citation…"). |
| `Tab` | **Closes the palette.** Tab is reserved for inter-widget movement (per §08); a palette that intercepts Tab to move between groups would violate that contract. |
| `Shift + Tab` | Same — closes the palette. |
| `Mod + 1`…`Mod + 9` | Invoke the 1st–9th visible item directly. Mod is `Ctrl` on Windows/Linux, `⌘` on macOS. Optional but encouraged for the navigation group. |
| Any character | Append to the input. Filtering runs (throttled). Active descendant resets to first item. |
| `Backspace` (when input is empty) | No-op. (Don't close on Backspace — too easy to accidentally dismiss.) |

### Notes on `Tab`

Closing on `Tab` is a deliberate divergence from a typical dialog's focus-trap.
The reasoning: a command palette is a **transient** dialog — keyboard users
expect `Tab` to leave it the way `Tab` leaves a menu. The palette mounts, the
user acts, the palette unmounts. Tab is for the page beyond the palette, not
for movement inside it.

The trade-off: there's no way to reach the `__footer` content (hint summary,
brand mark) via keyboard. By design — the footer is decorative.

---

## 10 · ARIA

The palette implements the **WAI-ARIA APG 1.2 Combobox** pattern with
`aria-activedescendant`. Not the focus-moves-into-listbox variant — the
activedescendant variant is what makes the input continually receive characters.

| Attribute | Carrier | Value | When |
|---|---|---|---|
| `role`            | `.dgo-cmdk`              | `"dialog"` | Default variant. The `--inline` variant uses `role="region"` with `aria-label`. |
| `aria-modal`      | `.dgo-cmdk`              | `"true"`   | Default variant only. |
| `aria-labelledby` | `.dgo-cmdk`              | id of a visually-hidden `<h2>` reading "Command Palette" | always — the dialog needs an accessible name. |
| `role`            | `.dgo-cmdk__input`       | `"combobox"` | always |
| `aria-expanded`   | `.dgo-cmdk__input`       | `"true" \| "false"` | always |
| `aria-controls`   | `.dgo-cmdk__input`       | id of `.dgo-cmdk__listbox` | always |
| `aria-activedescendant` | `.dgo-cmdk__input` | id of active `.dgo-cmdk__item`, or empty when no items | always |
| `aria-autocomplete` | `.dgo-cmdk__input`     | `"list"` | always — the listbox is the autocomplete surface; no inline ghost text. |
| `aria-label` or `aria-labelledby` | `.dgo-cmdk__input` | "Search commands and dossiers" or equivalent | always — no visible `<label>` element. |
| `role`            | `.dgo-cmdk__listbox`     | `"listbox"` | always |
| `aria-label`      | `.dgo-cmdk__listbox`     | "Results" or equivalent | always |
| `role`            | `.dgo-cmdk__group`       | `"group"` | always |
| `aria-labelledby` | `.dgo-cmdk__group`       | id of `.dgo-cmdk__group-label` | always |
| `role`            | `.dgo-cmdk__item`        | `"option"` | always |
| `aria-selected`   | `.dgo-cmdk__item`        | `"true" \| "false"` | always — exactly one `"true"` when non-empty |
| `aria-disabled`   | `.dgo-cmdk__item`        | `"true" \| "false"` | when disabled |
| `role`            | `.dgo-cmdk__empty`       | `"status"` | always — empty state announces |
| `aria-busy`       | `.dgo-cmdk__listbox`     | `"true"`   | while `data-loading="true"` |

### Result-count announcement

When the result count changes, the JS layer must update an offscreen
`role="status"` live region with the count: "12 results", "No results". This is
a separate node from `__empty` — `__empty` carries the user-visible message;
the live region carries the AT-readable count.

```html
<span class="dgo-visually-hidden" role="status" aria-live="polite">
  12 results
</span>
```

### Forced-colours behaviour

- The active-descendant background (`--dgo-cmdk-item-bg-active`) re-binds to the
  system `Highlight` colour under `forced-colors: active`; the active foreground
  re-binds to `HighlightText`. This is the only way the active row stays visible
  when the OS strips all custom backgrounds.
- The dialog gains a 2px solid `CanvasText` border under `forced-colors: active`
  so the panel is separable from the page even when the box-shadow strips. See
  §07-elevation.
- The input shows a 2px `CanvasText` underline at the block-end edge — without it
  the input's `border: transparent` strategy becomes invisible.

### Reduced-motion behaviour

- `dgo-cmdk-in` keyframe collapses to a 50ms cross-fade per §06-motion. No
  translateY component under reduced motion.
- Listbox row hover transitions collapse to 0ms (instant). The `aria-selected`
  styling swaps immediately.

---

## 11 · Internationalisation

- **Diacritic safety:** `__item-label` uses `--dgo-type-body` × `--dgo-lh-150` —
  cleared for Yorùbá, Hausa, Igbo stacked marks. The 44px item height (36 in
  compact) is high enough that combining marks have full vertical room.
- **RTL:** uses logical properties throughout. The leading icon sits at
  `inline-start`; the meta sits at `inline-end`. Under `[dir="rtl"]` the icon
  flips to the screen-right and the meta to the screen-left — automatic.
- **Active-descendant chevron** (the small `›` after an item title that opens a
  submenu, when used) flips under RTL via `.dgo-cmdk__item-chevron[data-rtl-flip]`.
- **Translation expansion:** the palette is bound by `--dgo-cmdk-w` (max 640px);
  long Yorùbá / Hausa labels wrap to two lines inside `__item-label`. The
  44px-min row height grows to accommodate; the `__item-meta` stays right-
  aligned vertically centred. **Do not** truncate item labels with `text-overflow:
  ellipsis` — see §03 and §09. Two-line labels are fine; the listbox scrolls.
- **Filtering substring match** must use locale-aware string matching. A naïve
  `.toLowerCase().includes(query)` fails on Yorùbá tone marks; use
  `Intl.Collator(locale, { sensitivity: 'base' })` to compare. Consumer
  responsibility; not enforced by CSS.

---

## 12 · Examples

### Basic

The smallest correct invocation: dialog variant, three items, no groups, no
async, no meta.

```html
<div class="dgo-cmdk-backdrop" data-state="open">
  <div class="dgo-cmdk"
       role="dialog"
       aria-modal="true"
       aria-labelledby="cmdk-title">
    <h2 id="cmdk-title" class="dgo-visually-hidden">Command Palette</h2>

    <div class="dgo-cmdk__search">
      <svg class="dgo-cmdk__search-icon" aria-hidden="true">
        <use href="../../assets/icons/sprite.svg#i-search"/>
      </svg>
      <input
        class="dgo-cmdk__input"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="cmdk-listbox"
        aria-activedescendant="cmdk-item-1"
        aria-autocomplete="list"
        aria-label="Search commands and dossiers"
        placeholder="Type a command or search…"
      >
    </div>

    <ul class="dgo-cmdk__listbox"
        id="cmdk-listbox"
        role="listbox"
        aria-label="Results">
      <li class="dgo-cmdk__item" role="option" id="cmdk-item-1" aria-selected="true">
        <span class="dgo-cmdk__item-label">New dossier</span>
      </li>
      <li class="dgo-cmdk__item" role="option" id="cmdk-item-2" aria-selected="false">
        <span class="dgo-cmdk__item-label">Open dossier by reference</span>
      </li>
      <li class="dgo-cmdk__item" role="option" id="cmdk-item-3" aria-selected="false">
        <span class="dgo-cmdk__item-label">Withdraw active submission</span>
      </li>
    </ul>
  </div>
</div>
```

### With variants and states

Two groups, icons, meta with kbd chord, one disabled row, one in loading state
illustrated separately.

```html
<div class="dgo-cmdk" role="dialog" aria-modal="true" aria-labelledby="cmdk-title-2">
  <h2 id="cmdk-title-2" class="dgo-visually-hidden">Command Palette</h2>

  <div class="dgo-cmdk__search">
    <svg class="dgo-cmdk__search-icon" aria-hidden="true">
      <use href="../../assets/icons/sprite.svg#i-search"/>
    </svg>
    <input class="dgo-cmdk__input"
           type="text"
           role="combobox"
           aria-expanded="true"
           aria-controls="cmdk-listbox-2"
           aria-activedescendant="cmdk-item-a1"
           aria-autocomplete="list"
           aria-label="Search commands and dossiers">
    <span class="dgo-cmdk__hint" aria-hidden="true">↑↓ to navigate · ↵ to select</span>
  </div>

  <ul class="dgo-cmdk__listbox" id="cmdk-listbox-2" role="listbox" aria-label="Results">

    <li role="group" aria-labelledby="cmdk-group-a">
      <div id="cmdk-group-a" class="dgo-cmdk__group-label">Navigation</div>
      <ul>
        <li class="dgo-cmdk__item" role="option" id="cmdk-item-a1" aria-selected="true">
          <svg class="dgo-cmdk__item-icon" aria-hidden="true">
            <use href="../../assets/icons/sprite.svg#i-home"/>
          </svg>
          <span class="dgo-cmdk__item-label">Dashboard</span>
          <span class="dgo-cmdk__item-meta">
            <kbd class="dgo-kbd">G</kbd><kbd class="dgo-kbd">D</kbd>
          </span>
        </li>
        <li class="dgo-cmdk__item" role="option" id="cmdk-item-a2" aria-selected="false">
          <svg class="dgo-cmdk__item-icon" aria-hidden="true">
            <use href="../../assets/icons/sprite.svg#i-folder"/>
          </svg>
          <span class="dgo-cmdk__item-label">Dossiers</span>
          <span class="dgo-cmdk__item-meta">
            <kbd class="dgo-kbd">G</kbd><kbd class="dgo-kbd">O</kbd>
          </span>
        </li>
      </ul>
    </li>

    <li role="group" aria-labelledby="cmdk-group-b">
      <div id="cmdk-group-b" class="dgo-cmdk__group-label">Actions</div>
      <ul>
        <li class="dgo-cmdk__item" role="option" id="cmdk-item-b1" aria-selected="false">
          <svg class="dgo-cmdk__item-icon" aria-hidden="true">
            <use href="../../assets/icons/sprite.svg#i-plus"/>
          </svg>
          <span class="dgo-cmdk__item-label">New dossier</span>
          <span class="dgo-cmdk__item-meta">
            <kbd class="dgo-kbd">Ctrl</kbd><kbd class="dgo-kbd">N</kbd>
          </span>
        </li>
        <li class="dgo-cmdk__item" role="option" id="cmdk-item-b2"
            aria-selected="false" aria-disabled="true">
          <svg class="dgo-cmdk__item-icon" aria-hidden="true">
            <use href="../../assets/icons/sprite.svg#i-archive"/>
          </svg>
          <span class="dgo-cmdk__item-label">Restore from archive</span>
          <span class="dgo-cmdk__item-meta">
            <span class="dgo-badge dgo-badge--neutral">Compliance only</span>
          </span>
        </li>
      </ul>
    </li>
  </ul>

  <div class="dgo-cmdk__footer">
    <span class="dgo-cmdk__footer-hint">
      <kbd class="dgo-kbd">↑↓</kbd> navigate ·
      <kbd class="dgo-kbd">↵</kbd> select ·
      <kbd class="dgo-kbd">Esc</kbd> dismiss
    </span>
  </div>
</div>
```

Loading state (skeleton listbox):

```html
<ul class="dgo-cmdk__listbox" role="listbox" aria-busy="true" aria-label="Results">
  <li><span class="dgo-skeleton" aria-hidden="true" style="block-size: 44px"></span></li>
  <li><span class="dgo-skeleton" aria-hidden="true" style="block-size: 44px"></span></li>
  <li><span class="dgo-skeleton" aria-hidden="true" style="block-size: 44px"></span></li>
</ul>
```

### Inside a real composition

The palette anchored inside a `.dgo-drawer` for a "search this drawer's
contents" pattern. Uses the `--inline` variant; no backdrop, no focus trap.

```html
<aside class="dgo-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  <header class="dgo-drawer__header">
    <h2 id="drawer-title">Filter Dossiers</h2>
    <button class="dgo-btn dgo-btn--icon" aria-label="Close">
      <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-x"/></svg>
    </button>
  </header>

  <div class="dgo-cmdk dgo-cmdk--inline" role="region" aria-label="Filter">
    <div class="dgo-cmdk__search">
      <svg class="dgo-cmdk__search-icon" aria-hidden="true">
        <use href="../../assets/icons/sprite.svg#i-search"/>
      </svg>
      <input class="dgo-cmdk__input"
             type="text"
             role="combobox"
             aria-expanded="true"
             aria-controls="cmdk-listbox-3"
             aria-autocomplete="list"
             aria-label="Filter dossiers by reference or owner">
    </div>
    <ul id="cmdk-listbox-3" class="dgo-cmdk__listbox" role="listbox" aria-label="Matches">
      <!-- items … -->
    </ul>
  </div>
</aside>
```

---

## 13 · Anti-patterns

- ❌ Moving real focus into the listbox (`element.focus()` on each `.dgo-cmdk__item`
  as the user arrows).
  ✅ Use `aria-activedescendant`. Real focus stays on the input. Per the WAI-ARIA
  combobox 1.2 spec — and crucial for letting the user keep typing.

- ❌ A "Cancel" button inside the palette that closes it.
  ✅ The shipped close is `Esc`. A persistent Cancel button takes a hit of vertical
  space the listbox needs, and trains users away from the keyboard chord the
  palette exists to teach.

- ❌ Filtering by hiding rows with `display: none`.
  ✅ Remove non-matching rows from the DOM. The result-count live region must
  reflect what is announceable; hidden rows confuse the count and the
  `aria-activedescendant` index.

- ❌ Auto-closing on `Tab`.
  Wait — this is shipped behaviour. (Listed here for clarity.) **The shipped
  behaviour is correct.** What's anti-pattern is *trapping* Tab inside the
  palette. Tab closes; that's the contract. See §9 *Notes on Tab*.

- ❌ A loading spinner replacing the entire palette.
  ✅ Skeleton rows inside the listbox; the input stays visible and editable. The
  user can refine the query while the previous query is still in flight.

- ❌ Custom keyboard chord per-app (`Ctrl + Shift + P`, `Alt + Space`).
  ✅ `Ctrl/⌘ + K`. The whole point of a system-wide palette is the muscle memory.
  Add per-action chords on individual items; do not move the opener.

Cross-link: §12-anti-patterns *"Two `aria-modal` overlays open simultaneously"*.

---

## 14 · Migration

v2.x introduces this component. No migration.

| From | To | Why | Codemod |
|---|---|---|---|
| — | — | — | — |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family (Chrome, Edge, Brave, Opera) | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari, mobile Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `aria-activedescendant` | required | — (universally supported) |
| `inert` attribute on background `<main>` | required | Polyfill via WICG `inert` shim if a target environment lacks support; the shipped CSS does not assume polyfill presence. |
| `:focus-visible` | required | — |
| `clamp()` for `--dgo-cmdk-w` | required | — |
| `anchor-positioning` (the `--anchored` variant) | optional | Falls back to centred via media-query feature detection: `@supports not (anchor-name: --x) { .dgo-cmdk--anchored { /* centred fallback */ } }` |
| `forced-colors: active` styling | required | — |
| View Transitions API (cross-page palette → page navigation) | optional, future | None — out of v2.1 scope. |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari — note: iOS Safari requires the `aria-activedescendant`
      target row to be `aria-current="true"` *as well as* `aria-selected="true"`
      for VoiceOver to announce the row. Tested workaround documented in
      `[NITDA DS team: capture iOS VoiceOver findings on first ship]`.
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android) — the touch interaction model on TalkBack is
      different; the palette's primary affordance is the keyboard. TalkBack users
      can still operate it via the standard list-navigation gestures.

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational.

---

## 16 · Open questions

- **Recent / pinned items.** The current spec assumes a stateless filter against
  a static list. Real consumers will want "recently used" and "pinned" items at
  the top. Where does the storage live — client localStorage, server-side per
  user, both? `[Product owner: confirm before v2.2]`.
- **Async sources.** The spec covers loading and error states but doesn't
  prescribe debounce timing or cancellation strategy. 80ms is a starting
  recommendation; profile against real APIs before locking in.
- **Multi-step actions.** "Insert citation…" → opens a sub-palette of citation
  sources. The spec allows `data-keep-open="true"` and a navigated state, but
  the markup for nested palettes is not documented. Add in v2.2 if the case
  arises.
- **Server-side rendering.** The dialog is a portal — does it render correctly
  in SSR before hydration? The shipped CSS makes the `[data-state="closed"]`
  variant `display: none`, which is SSR-safe. Confirm with the first SSR
  consumer.
- **Customization API.** A consuming app may want to add a footer button or a
  branded watermark. The current slot policy disallows it (see §1). Reconsider
  if multiple consumers request it; until then, "no" is the answer.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.1` (proposed) | Introduced as the §11-template worked example. CSS implementation pending doc approval. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[command-palette product team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence:
  6 months from last review or on any change to consumed tokens, whichever is
  sooner).
