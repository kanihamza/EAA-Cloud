# 08 · Accessibility

> Per-component keyboard maps and ARIA contracts for **the 26 component families
> shipped in v2.0/2.1**. Anything not in the shipped index is out of scope for this
> document — when we ship date-picker, command-palette, kanban, etc. (§ Coverage
> gaps in the project roadmap), they'll get their own entries here.

This document covers the **interaction contract** — what assistive tech expects.
For colour-contrast specifics see §02-color. For touch-target sizing see
§04-spacing-grid. For reduced-motion behaviour see §06-motion.

---

## Foundations

### Conformance target

WCAG 2.2, Level AA. Some surfaces (status badges in HC theme, focus rings in HC)
hit AAA. See §02-color for the contrast matrix and known gaps.

### Focus management — the shipped ring

`tokens.semantic.css` declares two focus rings:

```css
--dgo-focus-ring:        0 0 0 2px var(--dgo-color-surface-page),
                         0 0 0 5px var(--dgo-smart-400);
--dgo-focus-ring-inset:  inset 0 0 0 3px var(--dgo-smart-400);
```

- The default ring is a **two-layer halo**: a 2px page-coloured "moat" punched out
  of the control, then a 3px smart-green ring outside that. This survives on top of
  controls that already have a green or near-green background — the moat creates
  separation.
- The inset variant is for controls living inside a clipped scroller (filter bar
  chips, command palette items in a future release) where the outer ring would
  clip.
- HC theme rebinds the ring to a **three-layer stack** (white / black / amber)
  designed for forced-colours environments.

**Never set `outline: none` without replacing it.** The shipped components use
`outline: none` only because they immediately apply a `box-shadow: var(--dgo-focus-ring)`
on `:focus-visible`. If you remove the ring rule you must restore the outline.

### Keyboard primitives — the universal rules

| Key | Default behaviour |
|---|---|
| `Tab` | Move forward through focusable elements. |
| `Shift + Tab` | Move backward. |
| `Enter` | Activate buttons and links. Submit forms when focus is on a single-line input. |
| `Space` | Activate buttons (alongside Enter); toggle checkboxes / switches; scroll the page when focus is not on a control. |
| `Esc` | Close the topmost dismissible: tooltip → popover → menu → modal. Pop one layer at a time. |
| `Arrow keys` | Navigate **within** a composite widget (tabs, menus, radios, table rows). Never used for inter-widget navigation — that's `Tab`. |
| `Home` / `End` | Jump to first/last item in a composite widget. |
| `PageUp` / `PageDown` | Page through long lists; scroll modals. |

### Skip link

`styles/base.css` ships `.dgo-skip-link`, hidden until focused, anchored top-inline-start.
Every page must render one as the first focusable element:

```html
<a class="dgo-skip-link" href="#main">Skip to main content</a>
…
<main id="main" tabindex="-1">…</main>
```

`tabindex="-1"` on `<main>` is what lets the skip link actually transfer focus
into the content — without it the anchor scrolls but doesn't move focus.

### Visually-hidden utility

For labels assistive tech needs but sighted users don't, use `.dgo-visually-hidden`
(also from `base.css`). Do **not** use `display: none` (hides from AT) or
`visibility: hidden` (same).

```html
<button class="dgo-btn dgo-btn--icon" aria-label="Close">
  <svg aria-hidden="true">…</svg>
</button>

<!-- or, when the icon already conveys meaning to AT via aria-label on the button -->
<span class="dgo-visually-hidden">Estimated time: 4 minutes</span>
```

### Touch targets

Hard floor: **44 × 44 px** (`--dgo-s-11`). See §04-spacing-grid for the rule and the
per-component anchor table. Where the visible chrome is smaller (icon buttons,
table-row actions), extend the **hit area** with padding or a pseudo-element —
don't enlarge the glyph.

### Reduced motion & forced colours

- **`prefers-reduced-motion: reduce`** — handled at the token level (see §06-motion).
  Components inherit. Status indicators (skeleton, spinner) intentionally keep
  animating; gate them on a class if your audience needs them off.
- **`forced-colors: active`** — `tokens.theme-hc.css` rebinds key tokens to system
  colours (`ButtonText`, `CanvasText`, `LinkText`). Every elevated surface in the
  shipped set also carries a border so it survives shadow stripping. See §07-elevation.

---

## Per-family contracts

The 26 shipped families, in the index order from `styles/components/_index.css`.

> Seven families have full **§11-template per-component docs** that go deeper
> than the keyboard + ARIA summary below:
> - `docs/components/button.md` (shipped, v2.0)
> - `docs/components/input.md` (shipped, v2.0)
> - `docs/components/tabs.md` (shipped, v2.0)
> - `docs/components/table.md` (shipped, v2.0)
> - `docs/components/toast.md` (shipped, v2.0)
> - `docs/components/modal.md` (shipped, v2.0)
> - `docs/components/command-palette.md` (proposed v2.1 — spec only)
>
> The entries below are the system-wide accessibility contract. When a
> per-component doc exists, it supersedes the summary here for everything except
> the keyboard map (the maps are kept identical by §11 §9's review checklist).

### 1. Button (`.dgo-btn`)

| Key | Behaviour |
|---|---|
| `Enter`, `Space` | Activate. |
| `Tab`, `Shift+Tab` | Move focus out. |

| ARIA | Notes |
|---|---|
| Native `<button>` is the default. | Don't put `role="button"` on a `<div>` — you'll have to re-implement keyboard. |
| `aria-disabled="true"` (preferred) **or** the native `disabled` attr | Prefer `aria-disabled` when the control still needs to receive focus (e.g. a "Submit" button that explains why it's disabled on hover/focus). Native `disabled` removes from the tab order. |
| `aria-pressed` | For toggle buttons (`.dgo-btn--toggle` if used). |
| `aria-busy="true"` paired with `data-loading="true"` | For loading state. The spinner pseudo-element doesn't need its own announcement. |
| Icon-only button | **Must** have `aria-label`. The `<svg>` inside is `aria-hidden="true"`. |

### 2. Input / Textarea (`.dgo-input`, `.dgo-textarea`)

| Key | Behaviour |
|---|---|
| Standard text-editing keys | Native. |
| `Enter` in a single-line input inside a `<form>` | Submits the form. |

| ARIA | Notes |
|---|---|
| `<label for="…">` | **Required.** Placeholder is not a label. |
| `aria-describedby` | For helper text and error text. Reference by id. |
| `aria-invalid="true"` | When in error state. Drives `--dgo-input-border-error`. |
| `aria-required="true"` | When the field is required. The visual `*` marker on the label is decorative; AT reads `aria-required`. |
| `autocomplete` | Always set when the field maps to a known token (email, tel, given-name, postal-code, etc). |

### 3. Select (`.dgo-select`)

Use a **native `<select>`** unless the design requires options with rich content
(icons, secondary text, separators). The shipped `.dgo-select` style applies to
native `<select>`.

| Key | Behaviour |
|---|---|
| `Space` | Open the menu. |
| `Up` / `Down` | Move highlight (also pre-selects on most platforms). |
| `Enter` | Confirm selection. |
| Type-ahead | First-letter jumps to next matching option. |

| ARIA | Notes |
|---|---|
| Native `<select>` carries its own role and state. | Don't add `role="combobox"`. |
| If you build a rich-content select on top of `.dgo-menu` (no shipped component for this yet), follow the **WAI-ARIA combobox 1.2 pattern** — `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-activedescendant`. Document it at promotion time. | |

### 4. Checkbox / Radio (`.dgo-check`, `.dgo-radio`)

Native `<input type="checkbox">` and `<input type="radio">`. The shipped styles
target the input directly.

| Key (checkbox) | Behaviour |
|---|---|
| `Space` | Toggle. |
| `Tab` | Move to next focusable. |

| Key (radio — *inside a group*) | Behaviour |
|---|---|
| `Tab` | Enter the group (focus the checked radio, or the first if none). |
| `Up` / `Down` / `Left` / `Right` | Move within group, **selecting as you go** (this is the platform default and the WAI-ARIA spec — do not implement non-selecting arrow navigation). |
| `Tab` again | Leave the group. |

| ARIA | Notes |
|---|---|
| `<fieldset>` + `<legend>` for groups. | The legend names the group; individual labels name each option. Don't reach for `role="radiogroup"` unless you can't use `<fieldset>` for layout reasons. |
| Indeterminate checkbox | Set the `.indeterminate` JS property (not an attribute) AND `aria-checked="mixed"`. |

### 5. Switch (`.dgo-switch`)

A switch is **not** a checkbox in disguise — it's a state toggle.

| Key | Behaviour |
|---|---|
| `Space` | Toggle. |
| `Enter` | Toggle (per WAI-ARIA APG; some implementations omit, we include for muscle-memory). |

| ARIA | Notes |
|---|---|
| `role="switch"` + `aria-checked="true|false"` | The shipped markup wraps a native `<input type="checkbox">` for keyboard fallback; the `role="switch"` goes on the input. |
| Visible label, not just `aria-label` | A switch with only `aria-label` is hostile to AT users browsing in scan mode. |

### 6. Search (`.dgo-search`)

The wrapper element. Inside is a standard `<input type="search">`.

| Key | Behaviour |
|---|---|
| `Esc` | Clear the input (native behaviour of `type="search"` — keep it). |
| `Enter` | Submit the search. |

| ARIA | Notes |
|---|---|
| `role="search"` on the surrounding `<form>` or container. | The shipped wrapper class doesn't apply role automatically — set it on your form. |
| `aria-label` on the input if there's no visible label. | A magnifying-glass icon is not a label. |

### 7. Badge / Tag / Chip (`.dgo-badge`, `.dgo-tag`, `.dgo-chip`)

**Non-interactive** badge/tag: a styled `<span>`. **Interactive** chip with a close
button: a `<span>` containing a `<button>`.

| Key (chip close) | Behaviour |
|---|---|
| `Enter`, `Space` | Remove the chip; move focus to the next chip, or to the search field that produced it. |

| ARIA | Notes |
|---|---|
| Status-meaning badges (e.g. "Pending" workflow status) need their meaning to be **text** in the badge, not colour. The shipped operational-status tokens are paired with text labels in the system. | |
| `aria-label` on the close button | "Remove [tag name]". |
| `role="status"` on a badge that updates dynamically (a count that ticks up) | Pair with `aria-live="polite"`. |

### 8. Avatar (`.dgo-avatar`)

Decorative when next to a labelled name; meaningful when standing alone.

| ARIA | Notes |
|---|---|
| `<img alt="…">` with the person's name, **or** `alt=""` if their name is rendered next to the avatar. | Don't repeat the name in alt and adjacent text. |
| Initial-only avatar (no image) | `aria-hidden="true"` when the name is adjacent; otherwise `aria-label="[full name]"`. |

### 9. Card (`.dgo-card`)

Cards are a layout primitive, not an interactive role.

| ARIA | Notes |
|---|---|
| If the **whole card** is clickable, wrap it in a single `<a>` or `<button>` — don't add `role="button"` to the card itself. | Use the "card with a nested heading-linked element" pattern: the heading inside the card is a link; CSS extends the clickable region via `::after { position: absolute; inset: 0 }`. |
| Heading inside card | Use a real `<h2>`/`<h3>` consistent with page outline — not a `<div class="dgo-h3">`. |

### 10. Alert / Banner (`.dgo-alert`)

| ARIA | Notes |
|---|---|
| `role="alert"` for errors that appear in response to user action and need immediate AT announcement. | Implies `aria-live="assertive"` and `aria-atomic="true"`. |
| `role="status"` for less-urgent messages (info, success). | Implies `aria-live="polite"`. |
| Static info banner (always present on the page) | No live role needed. |
| Dismiss button | `aria-label="Dismiss"` if icon-only. Focus moves to the next focusable on dismiss. |

### 11. Toast (`.dgo-toast`)

Like alerts, but **transient** and **stacked**.

| Key | Behaviour |
|---|---|
| `Esc` (focus inside the toast region) | Dismiss the focused toast. |

| ARIA | Notes |
|---|---|
| Toast container: `role="region"` + `aria-label="Notifications"`. | Persistent, even when empty. |
| Each toast: `role="status"` (polite) by default; `role="alert"` for errors. | |
| Auto-dismiss timer | Pause on hover/focus (the shipped component does this). Never less than 5s; never less than `--dgo-dur-slow` × 12 = 4800ms. |
| Action buttons inside a toast | Focusable. Toast must not auto-dismiss while focus is inside it. |

### 12. Modal / Drawer (`.dgo-modal`, `.dgo-drawer`)

The most failure-prone component in any system. Get these four things right and
the rest follows.

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Trapped inside the modal. From the last focusable, `Tab` wraps to the first; from the first, `Shift+Tab` wraps to the last. |
| `Esc` | Close the modal. Focus returns to the trigger. |

| ARIA | Notes |
|---|---|
| Container: `role="dialog"` + `aria-modal="true"` + `aria-labelledby="[id of title]"` (and `aria-describedby` if there's a leading paragraph). | Use the HTML `<dialog>` element if you can — it provides all of these natively plus the focus trap. |
| **On open:** move focus to the first interactive element inside, or to a `tabindex="-1"`-marked heading if the modal is read-only. | Never leave focus outside the modal. |
| **On close:** restore focus to the element that opened it. | If that element no longer exists (e.g. a row was deleted), focus a sensible neighbour. |
| Background `inert` | Set `inert` on the page's `<main>` while the modal is open — this removes the rest of the page from the tab order and from AT entirely. |
| Drawer | Same contract as modal. `role="dialog"`, focus trap, `Esc` to close. |

### 13. Sidebar (`.dgo-sidebar`)

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Traverses sidebar items linearly. |
| `Enter` / `Space` | Activate the focused item. |
| `Up` / `Down` (optional but recommended) | Move between top-level items without leaving the sidebar. If you implement this, the items must use the **roving tabindex** pattern — exactly one item has `tabindex="0"`; others have `tabindex="-1"`. |

| ARIA | Notes |
|---|---|
| `<nav aria-label="Primary">` wrapping the sidebar items. | The label disambiguates from other navs on the page. |
| Active item | `aria-current="page"`. Not `aria-selected`. |
| Collapsible groups | Group header is a `<button>` with `aria-expanded`. |

### 14. Topbar (`.dgo-topbar`)

| ARIA | Notes |
|---|---|
| Wrap in `<header>`. | The implicit `banner` landmark; don't add `role="banner"` manually inside the page (only the page-level `<header>` carries it). |
| Brand lockup | `<a>` to home with the agency name as accessible name. The svg lockup is `aria-hidden`. |
| Right-side icon-buttons (notifications, profile, theme toggle) | Each `aria-label`'d. Notification button announces its count with `aria-label="Notifications, 3 unread"` (re-rendered when the count changes). |

### 15. Tabs (`.dgo-tabs`)

Implement against **WAI-ARIA Tabs Pattern**.

| Key | Behaviour |
|---|---|
| `Tab` | Move focus to the active tab; another `Tab` leaves the tablist into the panel. |
| `Left` / `Right` (or `Up` / `Down` for vertical tabs) | Move focus between tabs and **activate** — manual activation (where arrow keys move focus without changing the panel and `Enter` activates) is allowed but the shipped behaviour is automatic. |
| `Home` / `End` | First/last tab. |

| ARIA | Notes |
|---|---|
| Tablist: `role="tablist"`. | |
| Each tab: `role="tab"` + `aria-selected="true|false"` + `aria-controls="[panelId]"`. Inactive tabs `tabindex="-1"`; active tab `tabindex="0"` (roving). | |
| Each panel: `role="tabpanel"` + `aria-labelledby="[tabId]"` + `tabindex="0"` (so the panel itself can scroll/be focused if it overflows). | |

### 16. Breadcrumb (`.dgo-breadcrumb`)

| ARIA | Notes |
|---|---|
| Wrap in `<nav aria-label="Breadcrumb">`. | |
| Ordered list `<ol>` inside; each step `<li>`. | The visual separator is a CSS `::before`, not a DOM child — AT shouldn't read "chevron". |
| Current page is the last `<li>`, **not a link** (or a link with `aria-current="page"` if you must keep it linked for symmetry). | |

### 17. Stepper / Pagination (`.dgo-stepper`, `.dgo-pagination`)

| Key | Behaviour |
|---|---|
| `Tab` | Linear through page buttons. |
| `Enter` / `Space` | Go to that page. |
| `Left` / `Right` | (Optional) move between adjacent pages. If implemented, roving tabindex. |

| ARIA | Notes |
|---|---|
| Pagination: `<nav aria-label="Pagination">`. | |
| Current page button | `aria-current="page"` + visually-distinct style. Not `aria-selected`. |
| Disabled prev/next | `aria-disabled="true"` so the button remains focusable but inert; AT users can still discover it exists. |
| Stepper (multi-step form): each step is a `<button>` (if navigable) or `<span>` (if not). | Step with `aria-current="step"` for the active step. |

### 18. Table / Data grid (`.dgo-table`)

For a static or simply-sortable table, **use `<table>`** with `<thead>` / `<tbody>` /
`<th scope="col">` / `<th scope="row">`. The shipped `.dgo-table` styles assume
this markup.

| Key (read-only table) | Behaviour |
|---|---|
| `Tab` | Skips into the table, then to the next focusable on the page. The table cells themselves are not focusable unless they contain a control. |

| Key (sortable headers) | Behaviour |
|---|---|
| Header is a `<button>` inside a `<th>`. `Enter` / `Space` toggles sort. | |
| Sortable header: `aria-sort="ascending|descending|none"` on the `<th>`. Update on toggle. | |

| Key (interactive grid — *not shipped as a component yet, document at promotion*) | Reserved. |

| ARIA | Notes |
|---|---|
| `<caption>` if the table title isn't already a heading immediately above. | |
| Row selection checkboxes | First column `<th scope="col">` with `.dgo-visually-hidden` label "Select row"; each cell carries a checkbox with `aria-label="Select [row identifier]"`. |
| Empty state | `<tbody>` with a single row spanning all columns and a `role="status"` message. Not a hidden table. |

### 19. Tooltip / Popover (`.dgo-tooltip`, `.dgo-popover`)

| Key (tooltip) | Behaviour |
|---|---|
| Focus on the trigger | Tooltip appears. |
| `Esc` | Hide the tooltip while keeping focus on the trigger. |

| Key (popover) | Behaviour |
|---|---|
| `Enter` / `Space` on trigger | Open popover; move focus into the popover. |
| `Esc` | Close popover; focus returns to trigger. |
| `Tab` from last popover focusable | Closes popover and continues to next page focusable, or wraps inside — both patterns are valid; the shipped behaviour is **wraps inside** for popovers that contain forms, **continues out** for popovers that contain pure navigation. Document at usage site. |

| ARIA | Notes |
|---|---|
| Tooltip: `role="tooltip"` + `id="…"`. Trigger: `aria-describedby="[tooltipId]"`. | Never `aria-labelledby` — tooltips supplement, they don't replace the label. |
| Tooltip content must be **non-interactive**. Buttons and links inside a tooltip are a hard antipattern — they can't be reached by keyboard. | If you need interactivity, it's a popover, not a tooltip. |
| Popover: `role="dialog"` (if focus-managed and modal-like) **or** `role="region"` + `aria-label` (if a non-modal panel). | |

### 20. Menu / Dropdown (`.dgo-menu`)

Application menus, not navigation menus. (Sidebar nav uses `role="navigation"`,
not menu semantics.)

| Key | Behaviour |
|---|---|
| `Enter` / `Space` on trigger | Open menu; focus first item. |
| `Up` / `Down` | Move between items. |
| `Home` / `End` | First / last item. |
| Type-ahead | First-letter to next matching item. |
| `Enter` / `Space` on item | Activate; close menu; focus returns to trigger. |
| `Esc` | Close menu without activating. |

| ARIA | Notes |
|---|---|
| Trigger: `<button>` with `aria-haspopup="menu"` + `aria-expanded="true|false"`. | |
| Menu: `role="menu"`. Each item: `role="menuitem"`. Roving tabindex. | |
| Menu item with submenu | `role="menuitem"` + `aria-haspopup="menu"` + `aria-expanded`. |
| Separator | `role="separator"`. |
| Menu item as checkbox/radio | `role="menuitemcheckbox"` / `role="menuitemradio"`. |

### 21. Empty state / Error state (`.dgo-empty-state`)

| ARIA | Notes |
|---|---|
| Live empty state (appears after a search returns zero) | Wrap in `role="status"` so AT announces. The illustration is `aria-hidden`. |
| Static empty state (a tab that is empty by default) | No live role. Just a heading + body. |
| Error state with a retry button | The retry button is the primary focusable; on render move focus to its container heading (which is `tabindex="-1"`) so a screen reader user lands at the explanation, not the button. |

### 22. Progress / Spinner (`.dgo-progress`, `.dgo-spinner`)

| ARIA | Notes |
|---|---|
| Determinate progress | `<progress max="100" value="…">` is fine. Or `<div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="…">`. |
| Indeterminate progress / spinner | `role="progressbar"` + no `aria-valuenow`. Pair with `aria-label="Loading"`. |
| Loading region | The container surrounding the loading content sets `aria-busy="true"` while loading, removed when complete. |
| **Don't** use a spinner as the only loading cue for screen-reader users. | Accompany with a `role="status"` text region: "Loading dossiers…", "12 of 200 loaded…". |

### 23. Skeleton (`.dgo-skeleton`)

| ARIA | Notes |
|---|---|
| `aria-hidden="true"` on every skeleton element. | Skeletons are pure visual scaffolding — they have no semantic content. |
| The skeleton's container gets `aria-busy="true"` (same as the progress contract). | |
| The animation continues under reduced-motion — see §06-motion. If your audience needs it stopped, gate on a class. | |

### 24. Metric / Stat (`.dgo-metric`)

| ARIA | Notes |
|---|---|
| Value + label structure: render the label as the `<dt>` and value as `<dd>` inside a `<dl>` when the metric pairs are in a list. Otherwise a `<div>` containing label + value is fine, with the label as a real heading (`<h3>`) or `<p>` — the value is **not** the heading. | |
| Trend deltas (▲ +12%) | Use an SVG with `aria-label="up 12 percent"` if the colour-coded triangle is the only direction cue. Otherwise the percent string itself carries the sign. |
| Live ticker | `aria-live="polite"` on the value, `aria-atomic="true"` so the whole new value is read on update. |

### 25. Kbd / Code (`.dgo-kbd`, `.dgo-code`)

| ARIA | Notes |
|---|---|
| `<kbd>` semantics are native; no role override needed. | A keyboard shortcut hint like `<kbd>Ctrl</kbd>+<kbd>K</kbd>` reads as "Control K" on most screen readers, which is what you want. |
| Inline code: `<code>` (native, no role override). | |
| Block code: `<pre><code>` — wrap a copy button as a separate `<button>` outside the `<pre>` so its activation isn't confused with the code semantics. |

### 26. Filter bar (`.dgo-filter-bar`)

A composite of chips, search, and select.

| Key | Behaviour |
|---|---|
| `Tab` | Linear through filter controls. |
| Chip close (`.dgo-chip__close`) | See § 7 above. |
| Clear-all button | At the end of the filter bar. Focusable. On activation, removes all filters, announces via `role="status"`, returns focus to the search input. |

| ARIA | Notes |
|---|---|
| Wrap in `role="search"` if the bar's primary purpose is to filter a result set. | |
| Active filters (the chips) | Live region: `aria-live="polite"` on the chips container so additions and removals announce. |
| Filter count text ("12 results") | `aria-live="polite"`. |

---

## What's intentionally NOT in this document

The following are common patterns we **don't have shipped components for**, and so
they are not documented here:

- **Combobox / autocomplete** (a richer Select with type-ahead and async options).
- **Date picker / Calendar.**
- **Command palette** (the keyboard-first launcher). *A spec-only worked example
  exists at `docs/components/command-palette.md`, built against the §11 template.
  It documents the full keyboard + ARIA contract; the CSS implementation lands
  in v2.1 if/when approved.*
- **Tree view.**
- **Carousel / Slider** (range input is not shipped as a styled component yet).
- **Mega-menu.**

When these ship, each gets a numbered entry above. If your application needs one
today, follow the **WAI-ARIA Authoring Practices Guide 1.2** for the pattern and
note in your component RFC that you anticipate adoption back into the system.

---

## Audit checklist

Before any v2.x release ships, the following must pass:

- [ ] Skip link is the first focusable on every page.
- [ ] Every interactive control reaches `--dgo-focus-ring` on `:focus-visible`.
- [ ] Every page has exactly one `<h1>`.
- [ ] Every form input has an associated `<label for="…">` or `aria-label`.
- [ ] Every icon-only button has `aria-label`.
- [ ] Every dialog traps focus and restores it on close.
- [ ] Every dialog backgrounds the rest of the page with `inert`.
- [ ] Every live region has the right `role` / `aria-live` pair.
- [ ] No `outline: 0` without a replacement.
- [ ] No `tabindex` value > 0.
- [ ] Touch targets meet `--dgo-s-11` (44px).
- [ ] Pages render correctly under `[data-theme="dark"]`, `[data-theme="hc"]`, and `forced-colors: active`.
- [ ] Pages render correctly under `prefers-reduced-motion: reduce`.
- [ ] Yorùbá / Hausa / Igbo content meets the `--dgo-lh-150` floor (see §03-typography).
- [ ] Contrast pairs flagged in §02-color *Known issues* are not used as load-bearing UI.
