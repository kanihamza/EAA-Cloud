# 05 · Iconography

> DGO ships **one SVG sprite** with **46 icons**, all drawn on a **24×24 viewBox**.
> The sprite lives at `assets/icons/sprite.svg`. There is no second icon library.

## The shipped set

All 46 symbol IDs in `assets/icons/sprite.svg`, grouped by intent. Use the ID exactly
as written; the sprite tags include `aria-hidden="true"` so they don't pollute the
accessibility tree by default — see *Accessibility* below.

### Navigation & Structure
`i-home` · `i-grid` · `i-menu` · `i-close` ·
`i-chevron-down` · `i-chevron-right` · `i-chevron-left` ·
`i-arrow-right` · `i-arrow-up` · `i-arrow-down` · `i-external`

### Action & Manipulation
`i-search` · `i-filter` · `i-plus` · `i-edit` · `i-trash` ·
`i-download` · `i-upload` · `i-refresh` · `i-check` · `i-more` · `i-send`

### Status & Feedback
`i-info` · `i-check-circle` · `i-warning` · `i-alert` · `i-bell` · `i-sparkle`

### Document & Object
`i-file` · `i-folder` · `i-mail` · `i-chat` · `i-id` · `i-building`

### Identity & Access
`i-shield` · `i-lock` · `i-user` · `i-users` · `i-settings`

### Time, Place, Domain
`i-calendar` · `i-clock` · `i-globe` · `i-naira`

### Data & Disclosure
`i-chart` · `i-eye` · `i-help`

> If an icon you need is not in this list, **do not add a one-off SVG inline**. Open
> an icon-request issue (see `governance/component-rfc-template.md` — the icon track),
> propose the glyph, get it approved, and ship it into the sprite. Drift here is how
> systems end up with three different "delete" icons.

---

## Geometry rules

Every icon in the sprite obeys these constraints. If you draw a new one, match them:

| Constraint | Value |
|---|---|
| Canvas         | 24 × 24 |
| Live area      | 20 × 20 (2 px padding on all sides) |
| Stroke weight  | 1.5 px (single weight across the set) |
| Corner radius  | 1.5 px on stroke ends, 2 px on bounded shapes |
| Stroke linecap | round |
| Stroke linejoin| round |
| Fill           | none (icons are stroke-based) unless the glyph is a solid pictogram (`i-naira`, `i-coat-of-arms` are the only exceptions in the shipped set) |
| Optical centre | the **visual** centre, not the geometric centre. A right-pointing chevron may sit 0.5 px left of the geometric centre to balance. |

A 1.5 px stroke at 24 px reads as a 1 px stroke at 16 px and a 2 px stroke at 32 px —
the set is calibrated to scale linearly across the three sizes the system uses.

---

## Display sizes

Three sizes. Pick by container, never by visual emphasis.

| Use | Box | CSS |
|---|---|---|
| Inline with body text          | 16 × 16 | `inline-size: 1em; block-size: 1em` (em-bound so it follows the font scale) |
| Default UI affordance          | 20 × 20 | `inline-size: 20px; block-size: 20px` |
| Standalone icon button / chip  | 24 × 24 | `inline-size: 24px; block-size: 24px` |

Anything larger is a **graphic**, not an icon. Use the sparkline-style or empty-state
illustration patterns in `21 · Empty / Error / Onboarding State` instead.

---

## Usage

Always reference the sprite by URL fragment; never inline the SVG content into the
DOM unless you have a measured reason (e.g. needing to recolour a single subpath).

```html
<svg class="dgo-icon" aria-hidden="true" focusable="false" width="20" height="20">
  <use href="/assets/icons/sprite.svg#i-search"></use>
</svg>
```

Recommended utility class — add it to `styles/components/_utilities.css` if you find
yourself repeating the inline attributes:

```css
.dgo-icon {
  inline-size: 20px;
  block-size: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}
.dgo-icon--sm { inline-size: 16px; block-size: 16px; }
.dgo-icon--lg { inline-size: 24px; block-size: 24px; }
```

### Colour

Icons inherit `currentColor`. That is the contract: the parent element sets the
colour. Do not hard-code a `stroke="#…"` on the `<use>`.

```html
<!-- Correct: icon inherits text colour, themes follow -->
<button class="dgo-btn dgo-btn--primary">
  <svg class="dgo-icon" aria-hidden="true"><use href="…#i-plus"/></svg>
  New filing
</button>
```

### Spacing

The default gap between an icon and its label is **`--dgo-s-2` (8px)** on buttons and
**`--dgo-s-1` (4px)** on chips, badges, and dense menu items. Both are already set on
the shipped components — you only need to override if you're composing a new pattern.

---

## Accessibility

Icons fall into three roles. Tag them accordingly.

### 1 · Decorative (accompanies a text label)

The label carries the meaning. Hide the icon from assistive technology.

```html
<button class="dgo-btn dgo-btn--primary">
  <svg class="dgo-icon" aria-hidden="true" focusable="false">
    <use href="…#i-plus"></use>
  </svg>
  New filing
</button>
```

### 2 · Functional (the icon **is** the label — icon-only button)

The icon must be reachable as text. The visible 24×24 glyph still needs a 44×44 hit
area (§04-spacing-grid).

```html
<button class="dgo-icon-btn" aria-label="Delete row" type="button">
  <svg class="dgo-icon" aria-hidden="true" focusable="false">
    <use href="…#i-trash"></use>
  </svg>
</button>
```

`aria-hidden="true"` on the SVG combined with `aria-label` on the button is the
correct pattern — the screen reader announces the button name; the icon does not
double-up.

### 3 · Informational (icon conveys status alongside text — alerts, badges)

Treat as decorative (the status word does the talking), **unless** the icon stands
alone. Status badges in DGO always pair the icon with a text label, so they fall
under role 1.

### Focus & high contrast

- Icons render via `currentColor`, so the high-contrast theme automatically swaps
  them to black/white without bespoke rules.
- The focus ring belongs on the **button**, never the SVG. An SVG with a focus ring
  is a clue someone made the SVG focusable — which it should not be (the
  `focusable="false"` attribute on every shipped use is for IE-era parity but
  remains correct for VoiceOver/NVDA boundary behaviour).

---

## Adding an icon

1. Draw the glyph in a 24×24 frame at 1.5 px stroke. Match the rules above.
2. Optimise: round to 0.5 px, remove fills where currentColor stroke suffices.
3. Add a `<symbol id="i-…">` block to `assets/icons/sprite.svg`. Keep the
   `viewBox="0 0 24 24"` attribute on the symbol so consumers don't need to set it
   on the `<svg>` element.
4. Update the inventory in this file (group it under the right intent heading) **in
   the same commit** as the sprite change.
5. If the glyph could plausibly be mistaken for an existing one (e.g. another
   chevron variant), explain the difference and the use case in the commit body so
   the next reviewer can refuse a duplicate.

### What does **not** belong in the sprite

- Brand marks (`logo/mark.svg`, `logo/horizontal.svg`, etc. live under `assets/logo/`).
- Coat-of-arms or federal symbology — these have their own asset path and reproduction
  rules.
- Decorative illustrations (empty-state art, onboarding spots) — these ship per-
  component in the component CSS or HTML, not in the icon sprite.
- Vendor or partner logos — keep these external; embedding them in the sprite ties
  the system to a third-party brand.

---

## Anti-patterns

- ❌ Inline `<path>` markup pasted into the DOM with no sprite. Means every screen
  re-parses the same shape; means no single source of truth.
- ✅ `<use href="…/sprite.svg#i-…"/>`.
- ❌ Two icons for the same concept ("delete" with both `i-trash` and `i-close`).
  Pick one per concept — `i-trash` for destructive, `i-close` for dismissal.
- ✅ Document the concept-to-icon mapping in the component page; reuse globally.
- ❌ Setting `stroke="#05583B"` directly on an icon.
- ✅ Set `color: var(--dgo-color-action-primary)` on the parent; the icon inherits.
- ❌ Mixing icon styles (filled + outlined + duotone) on the same screen.
- ✅ The DGO set is single-weight outline. If you need fill, the design system has
  not approved that direction — raise an RFC.
