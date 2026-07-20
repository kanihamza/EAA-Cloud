# `tabs`

> Horizontal segmented navigation between sibling views of the same content set.
> A tab strip + an active indicator. Panels are the consumer's responsibility —
> the shipped CSS styles the trigger row, not the content region. The system
> ships **only horizontal** tabs.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/tabs.css`
**Selector namespace:** `.dgo-tabs__…` (BEM)

---

## 1 · Anatomy

The shipped CSS covers two visible parts:

- `.dgo-tabs` — root. `display: flex; flex-direction: column; gap: var(--dgo-s-5)`.
  Holds the tab list and (consumer-supplied) panel container.
- `.dgo-tabs__list` — the horizontal strip of tab triggers. `role="tablist"`.
  Carries a 1px block-end border that the active tab "joins" via its `-1px`
  margin-block-end.
- `.dgo-tabs__tab` — a single trigger. `role="tab"`. Active state is
  `aria-selected="true"`.

### Not shipped (consumer responsibility)

- **Tab panels.** The active panel sits as a sibling of `.dgo-tabs__list` inside
  `.dgo-tabs`. The consumer adds `role="tabpanel"`, `aria-labelledby`,
  `tabindex="0"`. See §10.
- **Sliding indicator.** The shipped active indicator is **a `border-block-end`
  colour change**, not a sliding underline. There is no transform-based
  indicator that translates between tabs. See §16.
- **Vertical orientation.** Not shipped. The flex defaults assume row layout.

### Slot policy

| Slot | Allowed content |
|---|---|
| `.dgo-tabs__tab` | One leading icon (`<svg aria-hidden="true">`) + a text label; optionally a trailing `.dgo-badge` (count). |
| `.dgo-tabs__list` | Only `.dgo-tabs__tab` children. Not separators, not buttons. |

---

## 2 · Variants

The shipped CSS ships **no variants** — `.dgo-tabs__tab[aria-selected="true"]`
is the only state-driven appearance change. There is no `--vertical`, no
`--pill`, no `--enclosed`, no `--bordered`.

If a surface needs a pill-style segmented control with mutually-exclusive
options, that's a different pattern (radio-group with custom styling), not a
variant of tabs. See §16.

---

## 3 · Sizes & density

The tabs ship **one size**. Height is intrinsic from the padding
(`var(--dgo-s-3) var(--dgo-s-4)` = 12 × 16) plus the body font-size
(`--dgo-type-body` = 14px) plus the 2px indicator.

| Measure | Resolved |
|---|---:|
| Trigger height | ~46px (12 + 14 + 12 + 2) |
| Trigger padding-block | `var(--dgo-s-3)` (12px) |
| Trigger padding-inline | `var(--dgo-s-4)` (16px) |
| Gap between triggers | `var(--dgo-s-1)` (4px) |
| Indicator height | `var(--dgo-tabs-indicator-h)` (2px) |

### Density behaviour

The shipped CSS does **not** re-bind tab metrics under
`[data-density="compact"]`. A compact-mode tab strip looks the same as a
comfortable-mode one. If your surface needs denser tabs, override at the strip:

```css
.compact-tabs .dgo-tabs__tab { padding-block: var(--dgo-s-2); }
```

…and document the override.

The 46px trigger height already clears the §04 44px touch-target floor — tabs
are touch-safe at default density.

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Default (inactive) | `.dgo-tabs__tab` | `color: var(--dgo-color-fg-muted)`; transparent indicator | — |
| Hover | `.dgo-tabs__tab:hover` | `color: var(--dgo-color-fg-default)` | mouse |
| Focus | `.dgo-tabs__tab:focus-visible` | `box-shadow: var(--dgo-focus-ring)` | keyboard |
| Active (selected) | `.dgo-tabs__tab[aria-selected="true"]` | `color: var(--dgo-color-action-primary)`; indicator `var(--dgo-tabs-indicator)`; weight bumps to `--dgo-wt-600` | data |
| Disabled | `[aria-disabled="true"]` | Not shipped — add at consumer level if needed | data |

### `:focus-visible` — caveat

The shipped CSS does **not** apply `--dgo-focus-ring` to `.dgo-tabs__tab`
explicitly. The trigger is a native `<button>` (per the recommended markup in
§12), so it inherits the global `:focus-visible` rule from `base.css`. Verify
on first integration; if the global rule doesn't apply (because of layer
ordering), add an explicit rule. Track for §16.

### Transitions

`.dgo-tabs__tab` transitions `color` and `border-color` on `--dgo-motion-state`
(250ms standard easing). The active state is a colour swap, not a slide.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-tabs-indicator-h` | `2px` | — |
| `--dgo-tabs-indicator` | `var(--dgo-color-action-accent)` | theme:dark, theme:hc |

### Tier 2 — Semantic tokens (read directly)

- `--dgo-color-fg-default`, `--dgo-color-fg-muted`
- `--dgo-color-action-primary`
- `--dgo-color-action-accent` (consumed via `--dgo-tabs-indicator`)
- `--dgo-color-border-default` (the tablist's block-end border)
- `--dgo-motion-state`
- `--dgo-type-body`
- `--dgo-wt-500`, `--dgo-wt-600`
- `--dgo-s-1`, `--dgo-s-2`, `--dgo-s-3`, `--dgo-s-4`, `--dgo-s-5`

### Tier 1 — Primitives

**Empty.**

---

## 6 · Layout & sizing

- **Inline-size:** the tab list is `display: flex`; triggers size to their
  content. The strip fills its parent's inline-size.
- **Block-size:** intrinsic from padding + font + indicator.
- **Overflow:** the shipped CSS does **not** handle horizontal overflow. If
  the strip has more triggers than fit, they wrap onto a second row (flex
  default — the strip is not `flex-wrap: nowrap`). See §16 for the overflow
  pattern (scroll-snap horizontal strip).
- **Indicator alignment:** the active trigger's `border-block-end-color` is the
  indicator. The trigger sits at `margin-block-end: -1px` so its border
  overlaps the tablist's `border-block-end`. This is what makes the indicator
  visually "join" the strip border instead of stacking on top.
- **Gap between trigger and panel:** `var(--dgo-s-5)` (20px) — set on the
  `.dgo-tabs` flex column.
- **Container query:** none.

---

## 7 · Composition

- **Contains:** `<svg>` icons inside triggers; `.dgo-badge` for count adornment;
  the consumer's `role="tabpanel"` blocks.
- **Contained by:** `.dgo-card`, `.dgo-modal__body`, `.dgo-drawer`, in-flow page
  sections.
- **Conflicts with:**
  - **Nested tab strips.** Tabs inside a tab panel work, but two levels is the
    practical limit — three confuses users about which tier they're navigating.
  - **Tabs inside a `.dgo-tabs__list`.** The list contains only triggers.
  - **A `.dgo-stepper` next to a `.dgo-tabs` for the same content.** Pick one
    — they answer different questions (linear progress vs lateral choice).

---

## 8 · Behaviour (JS contract)

The shipped CSS is presentation only. The behaviour is the consumer's, against
the **WAI-ARIA APG Tabs Pattern**.

### Attributes the component reads

| Attribute | Carrier | Type | Meaning |
|---|---|---|---|
| `aria-selected` | `.dgo-tabs__tab` | `"true" \| "false"` | Drives the active styling. Exactly one trigger at `"true"`. |
| `aria-controls` | `.dgo-tabs__tab` | id of the panel | Required by the WAI-ARIA pattern. |
| `tabindex` | `.dgo-tabs__tab` | `0` (active) / `-1` (inactive) | The **roving tabindex** pattern. Only the active tab is in the tab order; others are arrow-key reachable. |
| `aria-disabled` | `.dgo-tabs__tab` | `"true" \| "false"` | Optional. The shipped CSS doesn't style disabled; consumer adds. |

### Events the consumer fires

| Event | When | Payload |
|---|---|---|
| `tabs:change` | A new tab becomes active | `{ from: id, to: id }` |
| `tabs:keydown` | Optional, for non-trivial keyboard handling | — |

### Activation mode

Two valid modes per WAI-ARIA. **The system convention is automatic.**

- **Automatic** (default): arrow keys move focus *and* activate the tab — the
  panel changes immediately. Suitable when panels are pre-loaded.
- **Manual**: arrow keys move focus only; `Enter` or `Space` activates.
  Suitable when panels load asynchronously and you don't want every arrow press
  to fire a fetch.

If your panels are async, switch to manual mode and document it in your page's
implementation notes.

### Focus management on activation

When the user activates a new tab, focus stays on the trigger. **Focus does
not move to the panel.** Moving focus to the panel on every tab change is
disorienting; the user explicitly Tabs into the panel when they're ready to
read it (the panel's `tabindex="0"` makes that work).

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` | Move focus into the active tab (the one with `tabindex="0"`). Another `Tab` leaves the tablist and enters the panel. |
| `→` (Right arrow) | Move focus to the next trigger; wrap from last to first. **Activate** in automatic mode. |
| `←` (Left arrow) | Move focus to the previous trigger; wrap from first to last. **Activate** in automatic mode. |
| `Home` | First trigger. Activate. |
| `End` | Last trigger. Activate. |
| `Enter` / `Space` | Activate the focused trigger (no-op in automatic mode; required in manual mode). |
| `Shift+Tab` | Leave the tablist backward. |

### Under `[dir="rtl"]`

The arrow keys **do not flip**. The WAI-ARIA spec is explicit: `→` always
moves to the next-in-list trigger, regardless of reading direction. Some
implementations swap `←` ↔ `→` under RTL; this is wrong and confuses users
who have learned the system. The shipped behaviour follows the spec.

Cross-link: §08 §15.

---

## 10 · ARIA

The full WAI-ARIA Tabs Pattern:

| Attribute | Carrier | Value | When |
|---|---|---|---|
| `role` | `.dgo-tabs__list` | `"tablist"` | always |
| `aria-label` or `aria-labelledby` | `.dgo-tabs__list` | descriptive | required — the tablist needs an accessible name (e.g. "Submission status views") |
| `aria-orientation` | `.dgo-tabs__list` | `"horizontal"` | always (the shipped CSS is horizontal-only) |
| `role` | `.dgo-tabs__tab` | `"tab"` | always |
| `aria-selected` | `.dgo-tabs__tab` | `"true" \| "false"` | always |
| `aria-controls` | `.dgo-tabs__tab` | id of panel | always |
| `tabindex` | `.dgo-tabs__tab` | `0` if selected, `-1` otherwise | always — roving tabindex |
| `id` | `.dgo-tabs__tab` | unique | required for the panel's `aria-labelledby` |
| `role` | the panel | `"tabpanel"` | always |
| `aria-labelledby` | the panel | id of the controlling tab | always |
| `tabindex` | the panel | `0` | required — lets the user Tab into the panel and scroll it if it overflows |
| `id` | the panel | unique | required for the tab's `aria-controls` |

### Forced-colours behaviour

- `--dgo-tabs-indicator` strips under `forced-colors: active`. The active tab
  is communicated by the `font-weight: 600` change (which survives) and by
  `aria-selected="true"` (which AT consumes). Consumer-side: verify the active
  tab is still distinguishable. If not, add an `outline` on the active tab in
  HC theme.
- The tablist's block-end border re-binds to `ButtonText` so the strip
  separator remains visible.

### Reduced-motion behaviour

- The colour-and-border transition collapses to 0ms. The active state swaps
  immediately on activation.
- There is no transform-based indicator, so no translate to suppress.

---

## 11 · Internationalisation

- **Diacritic safety:** triggers use `--dgo-type-body` (14px) with no explicit
  `line-height`, inheriting `--dgo-lh-150` from `base.css`. Cleared for Yorùbá,
  Hausa, Igbo. The intrinsic trigger height (~46px) absorbs the slight extra
  height of stacked marks.
- **RTL:** `display: flex` on the tablist; triggers read inline-start to
  inline-end. Under `[dir="rtl"]` the first trigger appears on the right of
  the strip — automatic. Arrow-key behaviour does **not** flip (see §9).
- **Translation expansion:** long Yorùbá / Hausa labels grow the trigger via
  intrinsic sizing. If the strip then overflows, the flex wraps to a second
  row. If the design forbids two rows, the consumer must implement a
  horizontal-scroll variant — see §16.
- **Word-break:** the shipped CSS does not set `white-space` on triggers, so
  long labels do not wrap inside a single trigger. They grow the trigger
  inline. To allow per-trigger wrapping (rare), set `white-space: normal` on
  the tab and bound the inline-size; not the shipped pattern.

---

## 12 · Examples

### Basic — three tabs with panels

```html
<div class="dgo-tabs">
  <div class="dgo-tabs__list"
       role="tablist"
       aria-label="Submission status views">
    <button class="dgo-tabs__tab"
            id="tab-all"
            role="tab"
            aria-selected="true"
            aria-controls="panel-all"
            tabindex="0">All</button>
    <button class="dgo-tabs__tab"
            id="tab-pending"
            role="tab"
            aria-selected="false"
            aria-controls="panel-pending"
            tabindex="-1">Pending Review</button>
    <button class="dgo-tabs__tab"
            id="tab-closed"
            role="tab"
            aria-selected="false"
            aria-controls="panel-closed"
            tabindex="-1">Closed</button>
  </div>

  <div id="panel-all"
       role="tabpanel"
       aria-labelledby="tab-all"
       tabindex="0">
    <!-- all dossiers -->
  </div>
  <div id="panel-pending"
       role="tabpanel"
       aria-labelledby="tab-pending"
       tabindex="0"
       hidden>
    <!-- pending dossiers -->
  </div>
  <div id="panel-closed"
       role="tabpanel"
       aria-labelledby="tab-closed"
       tabindex="0"
       hidden>
    <!-- closed dossiers -->
  </div>
</div>
```

### With icons and a count badge

```html
<div class="dgo-tabs__list" role="tablist" aria-label="Workspace sections">
  <button class="dgo-tabs__tab" role="tab" aria-selected="true" tabindex="0">
    <svg aria-hidden="true" width="16" height="16">
      <use href="../../assets/icons/sprite.svg#i-inbox"/>
    </svg>
    Inbox
    <span class="dgo-badge dgo-badge--neutral">12</span>
  </button>
  <button class="dgo-tabs__tab" role="tab" aria-selected="false" tabindex="-1">
    <svg aria-hidden="true" width="16" height="16">
      <use href="../../assets/icons/sprite.svg#i-archive"/>
    </svg>
    Archive
  </button>
</div>
```

### Inside a modal

```html
<section class="dgo-modal dgo-modal--lg"
         role="dialog"
         aria-modal="true"
         aria-labelledby="m-title">
  <header class="dgo-modal__header">
    <h2 id="m-title" class="dgo-modal__title">Dossier 24-0193</h2>
  </header>
  <div class="dgo-modal__body">
    <div class="dgo-tabs">
      <div class="dgo-tabs__list" role="tablist" aria-label="Dossier sections">
        <button class="dgo-tabs__tab" role="tab" aria-selected="true" tabindex="0"
                aria-controls="dp-summary" id="dt-summary">Summary</button>
        <button class="dgo-tabs__tab" role="tab" aria-selected="false" tabindex="-1"
                aria-controls="dp-history" id="dt-history">History</button>
        <button class="dgo-tabs__tab" role="tab" aria-selected="false" tabindex="-1"
                aria-controls="dp-audit" id="dt-audit">Audit log</button>
      </div>
      <div id="dp-summary" role="tabpanel" aria-labelledby="dt-summary" tabindex="0">…</div>
      <div id="dp-history" role="tabpanel" aria-labelledby="dt-history" tabindex="0" hidden>…</div>
      <div id="dp-audit"   role="tabpanel" aria-labelledby="dt-audit"   tabindex="0" hidden>…</div>
    </div>
  </div>
</section>
```

---

## 13 · Anti-patterns

- ❌ Implementing arrow keys without the roving-tabindex pattern (every trigger
  `tabindex="0"`).
  ✅ Exactly one trigger has `tabindex="0"`; the others have `-1`. The arrow
  keys move both focus and `tabindex`.

- ❌ Moving focus to the panel on tab activation.
  ✅ Focus stays on the trigger; the user Tabs into the panel when ready.

- ❌ Flipping `←` and `→` under RTL.
  ✅ Arrow keys are list-position-based, not visual-direction-based. WAI-ARIA
  spec; do not deviate.

- ❌ Using tabs to switch between unrelated views ("Settings" vs "Help").
  ✅ Tabs lateral between **sibling views of the same content set** — "Pending"
  / "Approved" / "Archived" of the same list. Unrelated views are routes,
  not tabs.

- ❌ More than ~7 tabs in a strip.
  ✅ Either consolidate, or use a `.dgo-sidebar` for top-level navigation +
  tabs for in-view sectioning. A wrapped two-row tab strip rarely reads as
  intended.

- ❌ A tab strip where one trigger is "More…" opening a dropdown.
  ✅ Either fit all options, or rethink the IA. The "More" tab pattern hides
  options from keyboard-arrow navigation and from quick scan.

- ❌ Activation that mutates URL without using `pushState`.
  ✅ Tabs that represent navigable views should update the URL via History API
  so back-button works. Tabs that represent local UI state (a settings dialog
  with sub-sections) don't need URL updates.

Cross-link: §08 §15; §12-anti-patterns *"Tabs for unrelated views"*.

---

## 14 · Migration

`v2.0` is the first shipped version. No migration history.

**Known limitations to address in a future minor:**

| Limitation | Fix | Track |
|---|---|---|
| No explicit `:focus-visible` rule on `.dgo-tabs__tab` (relies on inheritance from `base.css`) | Add an explicit `box-shadow: var(--dgo-focus-ring)` rule | v2.1 |
| No vertical orientation | Add `.dgo-tabs--vertical` with `aria-orientation="vertical"` and rebound arrow keys | v2.2 |
| No overflow handling (>5–7 tabs) | Add `.dgo-tabs__list--scroll` with horizontal scroll-snap | v2.2 |
| No sliding indicator | Add via JS measuring active tab's `offsetLeft`/`offsetWidth`; CSS hook on `.dgo-tabs__list::after` | Optional; current border-bottom approach is functional |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `display: flex` with `gap` | required | — |
| Logical properties (`border-block-end`, `margin-block-end`) | required | — |
| `:focus-visible` | required | — |
| Roving tabindex (consumer-implemented) | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari — note: iOS VoiceOver users navigate tabs by
      swipe; the tablist role announces "tab, 1 of 3, selected".
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`.

---

## 16 · Open questions

- **Sliding indicator.** Cosmetic; the system ships the colour-swap pattern.
  Worth adding if a future surface specifically requires the slide cue. Use
  CSS `transition: transform` on a pseudo-element measured by JS.
- **Vertical tabs.** Common on settings-style surfaces. Not shipped. Track
  for v2.2 if requested.
- **Pill / segmented control.** A different visual treatment (rounded
  background on the active option, no underline). Not a variant of tabs —
  separate component. Decision pending: is it a `--dgo-segmented` or a
  styled `<fieldset>` with radios? Resolve before shipping.
- **Overflow.** Tabs that don't fit. Three patterns: wrap to multiple rows
  (current default), horizontal scroll-snap (proposed `--scroll`), or
  collapse to a select (proposed `--responsive`). Pick one before v2.2.
- **Tab close affordance.** Browser-style "x to close this tab". Not shipped.
  Promote when a consumer needs it (likely never for DGO — operational
  surfaces aren't tabbed workbenches).
- **Lazy panel loading.** Current convention assumes panels are pre-loaded
  (automatic activation mode). When manual mode + async loading lands,
  document the loading-state inside the panel — likely `.dgo-skeleton` for
  the panel's contents while the fetch resolves.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Horizontal only. Border-bottom-colour active indicator (no slide). |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[navigation patterns team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
