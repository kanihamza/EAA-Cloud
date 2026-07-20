# `menu`

> A short list of actions or navigation targets attached to a trigger. Smaller
> than the command palette; bound to one trigger, dismissed on selection or
> `Escape`. The menu is a **transient action surface** — it is not a navigation
> region (use `.dgo-sidebar` or a plain `<nav>` for that) and not a search
> surface (use the command palette).

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/menu.css`
**Selector namespace:** `.dgo-menu` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-menu` — root container; `role="menu"`. Surface, border, radius, padding,
  elevation, and a `200px` minimum width all live here.
- `.dgo-menu__label` — optional uppercased group label; `role="presentation"`
  (it labels a group visually but is not itself an item).
- `.dgo-menu__item` — a single action; `role="menuitem"`.
- `.dgo-menu__item--danger` — destructive modifier.
- `.dgo-menu__sep` — 1px separator between groups; `role="separator"`.

### Slot policy (`.dgo-menu__item`)

The item is `display: flex; align-items: center; gap: var(--dgo-s-2)` (8px), so
it lays out as a single horizontal row with token-driven spacing between slots.

| Position | Allowed content |
|---|---|
| Leading (optional) | One `.dgo-icon` (`<svg aria-hidden="true">`, 16px). |
| Centre | The label. May wrap to two lines — there is **no** `white-space: nowrap` on the item, so long / translated labels reflow rather than clip. |
| Trailing (optional) | A `.dgo-kbd` shortcut hint, or a trailing chevron for a *(future)* submenu disclosure. |

The item sets `text-decoration: none` so an `<a class="dgo-menu__item">` does not
render an underline — but see §10: a menu item is an **action**, and routing a
plain navigation link through `role="menuitem"` is an anti-pattern. The
text-decoration reset exists for action items that are semantically links
(e.g. "Open in new tab"), not to repurpose the menu as a nav list.

---

## 2 · Variants

| Class | Description | Use when |
| --- | --- | --- |
| *(default)* | Neutral menu item. Rest colour `--dgo-color-fg-default`; hover/focus fill `--dgo-color-surface-sunken`. | Most cases. |
| `.dgo-menu__item--danger` | Destructive action. Rest colour `--dgo-color-action-danger`; hover fill `--dgo-color-danger-subtle-bg` (a tinted danger wash, **not** the neutral sunken fill). | Delete, archive, revoke. Always the last item in its group, below a `__sep`. |

There is no `--primary` or `--accent` menu item. Emphasis inside a menu is
carried by **position and the danger modifier only** — a menu is a flat list of
peers, not a hierarchy of button weights.

---

## 3 · Sizes & density

Single size. There is no `--sm` / `--lg` menu. Density adjusts internal padding
only — the item's `padding: var(--dgo-s-2) var(--dgo-s-3)` rebinds with the
`--dgo-s-*` scale under `[data-density]` (the scale is the density lever; the
menu does not declare its own density block).

| Element | Padding (comfortable) | Resolved |
|---|---|---|
| `.dgo-menu` (container) | `var(--dgo-s-1)` | 4px all sides |
| `.dgo-menu__item` | `var(--dgo-s-2) var(--dgo-s-3)` | 8px × 12px |
| `.dgo-menu__label` | `var(--dgo-s-2) var(--dgo-s-3) var(--dgo-s-1)` | 8px top / 12px sides / 4px bottom |

The label's **asymmetric** bottom padding (`s-1`, half the top) optically tightens
the gap between a group label and the first item beneath it, so the label reads
as attached to its group rather than floating between two groups.

---

## 4 · States

| State | Selector | Visual change | Driver |
| --- | --- | --- | --- |
| Rest (neutral) | `.dgo-menu__item` | fg `--dgo-color-fg-default`, transparent background | — |
| Rest (danger) | `.dgo-menu__item--danger` | fg `--dgo-color-action-danger`, transparent background | data |
| Hover **/** focus | `:hover, :focus-visible` | background → `--dgo-color-surface-sunken`; `outline: none` | mouse **or** keyboard |
| Hover (danger) | `--danger:hover` | background → `--dgo-color-danger-subtle-bg` | mouse |
| Disabled | `[aria-disabled="true"]` | opacity 0.55 (consumer-applied); item stays in roving order so AT can announce it | data |

### Hover and focus are the same cell

`:hover` and `:focus-visible` resolve to the **identical** `surface-sunken` fill,
and the item sets `outline: none`. This is deliberate: in a menu the *active
descendant* — whether reached by mouse hover or arrow-key focus — is one and the
same "highlighted row", so the two inputs must not produce two different
indicators. The consequence for accessibility is that **the background fill *is*
the focus indicator**; `surface-sunken` on `surface-raised` is the contrast pair
that must clear the non-text-contrast floor (see §08-accessibility). Never strip
the fill without supplying another visible focus indicator.

### Danger items break the shared cell

The danger modifier is the one place the neutral fill is overridden: a danger
item hovers to `danger-subtle-bg`, not `surface-sunken`, so a destructive choice
is colour-coded the instant the pointer lands on it — before the click.

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/menu.css`,
verified against the shipped CSS on 2026-06-05. Tokens reached only through a
component-token's internal chain are documented at their own tier, not
duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Resolves to | Used for |
|---|---|---|
| `--dgo-popover-shadow` | `var(--dgo-elevation-popover)` | The container drop shadow. Same elevation as tooltip/popover so all anchored surfaces sit at one consistent height. |

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-surface-raised` | Container background |
| `--dgo-color-surface-sunken` | Item hover / focus fill |
| `--dgo-color-border-default` | Container border **and** separator fill |
| `--dgo-color-fg-default` | Neutral item text |
| `--dgo-color-fg-muted` | Group-label text |
| `--dgo-color-action-danger` | Danger item text |
| `--dgo-color-danger-subtle-bg` | Danger item hover fill |
| `--dgo-radius-card` | Container corner radius (10px) |
| `--dgo-type-body-sm` | Item font-size (12px) |
| `--dgo-type-caption` | Label font-size (12px) |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-r-6` | 6px | **Item** corner radius |
| `--dgo-s-1` | 4px | Container padding; separator margin; label bottom padding |
| `--dgo-s-2` | 8px | Item gap; item/label vertical padding |
| `--dgo-s-3` | 12px | Item/label horizontal padding |
| `--dgo-tr-wide` | 0.06em | Label letter-spacing |

### Note on the radius tier split

The container radius comes through the **semantic** intent token
`--dgo-radius-card` (→ `r-10`, 10px) while the item radius reads the **primitive**
`--dgo-r-6` (6px) directly. The split is geometrically intentional, not an
oversight: with `s-1` (4px) of container padding, a 6px item corner nests
cleanly inside a 10px container corner (`4 + 6 = 10`), so the highlighted item
fill never bleeds past the container's rounded edge. It is, however, the one
place the menu reaches past the intent tier to a raw primitive — tracked as a
cosmetic-consistency item in §16.

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic, with a hard floor of `min-inline-size: 200px`. The
  menu is never narrower than 200px even for one short item; it grows to fit the
  longest item up to the consumer's positioning bounds.
- **Block-size:** intrinsic — the sum of items, labels, separators, and the 4px
  container padding.
- **Internal spacing:** driven by **primitives directly** (`--dgo-s-1/-2/-3`),
  not by a `--dgo-menu-*` component token. The menu family ships **no** component
  padding tokens of its own; its only component token is `--dgo-popover-shadow`.
  (Earlier drafts of this doc claimed component-tier padding tokens — corrected
  2026-06-05 against the shipped CSS.)
- **Item radius vs container radius:** 6px items inside a 10px container — see §5.
- **Container query:** none in v2.x.
- **Overflow:** the menu does not scroll itself. A menu long enough to need
  scrolling is a sign the surface should be a command palette — see §13.

---

## 7 · Composition

- **Contains:** `.dgo-icon` (leading, 16px), `.dgo-kbd` (trailing shortcut hint),
  plain text labels, `.dgo-menu__sep`, `.dgo-menu__label`. Nothing else.
- **Contained by:** anchored to a `<button>` trigger; mounted to `<body>` via a
  JS portal so the menu escapes `overflow: hidden` ancestors and sits above the
  page on the popover elevation.
- **Conflicts with:**
  - **Menu inside a menu** (nested / cascading) — unshipped; never hand-roll it.
    Use a command palette for hierarchical navigation.
  - **Modal inside a menu** — never. A menu is dismissed on outside-click, which
    would race the modal. Close the menu, then open the modal from the chosen
    action.

---

## 8 · Behaviour (JS contract)

Interactive. The shipped CSS styles a menu that is **already open and
positioned**; the consumer's JS owns everything dynamic:

### What the consumer JS must do

| Responsibility | Detail |
|---|---|
| Open / close | Toggle the menu's presence (or a visibility attribute) from the trigger's `click` and from `Escape`. |
| Positioning | Anchor the portalled menu to the trigger and flip it when it would overflow the viewport. The CSS provides no positioning. |
| Focus trap & roving tabindex | One item `tabindex="0"`, the rest `tabindex="-1"`; arrow keys move the `0`. On open, focus the first (or a sensible default) item. On close, return focus to the trigger. |
| Outside-click / blur dismissal | Close on click outside or focus leaving the menu. |
| `aria-expanded` | Reflect open state on the trigger. |

### What the component (CSS) owns

Surface, border, radius, elevation, the 200px floor, item/label/separator
spacing, and the hover/focus/danger fills. No state attribute is read by the CSS
beyond the native `:hover` / `:focus-visible` pseudo-classes — there is no
`data-open` styling; an "open" menu is simply a mounted one.

See `docs/08-accessibility.md` for the full menu keyboard contract; the system
enforces visuals only.

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Focus the trigger (menu items are removed from sequential tab order via roving tabindex). |
| `Enter` / `Space` | Open from the trigger; invoke the focused item. |
| `Arrow Down` / `Arrow Up` | Move the roving `tabindex="0"` to the next / previous item (skips separators and labels). |
| `Home` / `End` | First / last item *(consumer-implemented; recommended)*. |
| `Escape` | Close the menu and return focus to the trigger. |

---

## 10 · ARIA

`role="menu"` on root, `role="menuitem"` on each item, `role="separator"` on
`__sep`, `role="presentation"` on `__label`. The trigger carries
`aria-haspopup="menu"` and `aria-expanded`.

- A `role="menuitem"` must perform an **action**. Do not place a plain
  navigation `<a>` under `role="menuitem"` just because the CSS resets its
  underline — screen-reader users expect a menuitem to *do* something, not to
  navigate. For navigation, use `.dgo-sidebar` or a `<nav><ul>` list. See §13.
- A disabled item uses `aria-disabled="true"` (kept in the roving order so AT
  can announce "dimmed / unavailable"), **not** the `disabled` attribute
  (`<li>` can't take it, and removing the item from the order hides the fact
  that the action exists).

### Forced-colours behaviour

Under `forced-colors: active` the component swaps custom colour tokens for system
colours (`Canvas`, `CanvasText`, `Highlight`, `HighlightText`). The hover/focus
fill maps to `Highlight` + `HighlightText`, so the shared highlight cell survives
as the system selection colour. Elevation (`--dgo-popover-shadow`) drops and the
1px `CanvasText` container border becomes the only edge. See `docs/07-elevation.md`.

### Reduced-motion behaviour

The menu CSS declares no transitions or animations on its own elements, so there
is nothing to collapse — the open/close motion (if any) lives in the consumer's
portal JS and **must** honour `@media (prefers-reduced-motion: reduce)` there.
See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** item text is `--dgo-type-body-sm` (12px). Because items
  may wrap, stacked Yorùbá / Hausa / Igbo combining marks have vertical room;
  the 8px vertical padding keeps a marked first line off the item's top edge.
- **RTL:** logical properties throughout (`padding-inline`, `gap`). Icon
  placement, the leading/trailing slot order, and the label's text alignment all
  flip under `[dir="rtl"]` with no extra code. The separator (`block-size: 1px`,
  full width) is direction-agnostic.
- **Translation expansion:** long labels **wrap inline** — the item has no
  `white-space: nowrap` and no `text-overflow: ellipsis`. Never truncate a menu
  label with an ellipsis without exposing the full string in a tooltip; a
  half-shown destructive action is a safety hazard.
- **Label casing:** `.dgo-menu__label` applies `text-transform: uppercase`. For
  scripts where uppercasing is meaningless or harmful, the consumer should
  override `text-transform: none` on the label rather than ship mis-cased text.

---

## 12 · Examples

### Basic

```html
<ul class="dgo-menu" role="menu">
  <li class="dgo-menu__label" role="presentation">Dossier</li>
  <li class="dgo-menu__item" role="menuitem" tabindex="0">Open</li>
  <li class="dgo-menu__item" role="menuitem" tabindex="-1">Duplicate</li>
  <li class="dgo-menu__sep" role="separator"></li>
  <li class="dgo-menu__item dgo-menu__item--danger" role="menuitem" tabindex="-1">Delete</li>
</ul>
```

### With an icon and a shortcut hint

```html
<li class="dgo-menu__item" role="menuitem" tabindex="-1">
  <svg class="dgo-icon" aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-copy"/></svg>
  Duplicate
  <kbd class="dgo-kbd" style="margin-inline-start:auto">⌘D</kbd>
</li>
```

The `margin-inline-start: auto` pushes the shortcut hint to the trailing edge;
the item's flex layout and 8px gap handle the rest.

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of
the showcase (`index.html`) — every shipped family appears in at least one of
them.

---

## 13 · Anti-patterns

- ❌ Menu inside a menu (nested / cascading submenu).
  ✅ Use a command palette or a drawer for hierarchical navigation. The submenu
  pattern is explicitly unshipped — see §16.
- ❌ Menu without a focusable trigger.
  ✅ Always anchor to a real `<button>` with `aria-haspopup="menu"`.
- ❌ `role="menuitem"` on a navigation link ("Dashboard", "Settings", "Reports").
  ✅ Decide: menu (action) or list (navigation). For navigation use `.dgo-sidebar`
  or a plain `<nav>`. The text-decoration reset on items is for action-links, not
  a licence to build a nav menu.
- ❌ An ellipsis-truncated menu label.
  ✅ Let labels wrap, or shorten the copy. A clipped destructive label is a
  safety hazard.
- ❌ A menu tall enough to need its own scrollbar.
  ✅ That is a command-palette-shaped problem — switch surfaces.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-menu` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| Logical properties (`padding-inline`, `gap`) | required | — |
| `:focus-visible` | required | — |
| `forced-colors: active` styling | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational — the roving-tabindex + `role="menu"` contract is the highest-risk
area to verify against real AT (menu role support varies more than list role).

---

## 16 · Open questions

- **Submenu (cascading menu) is unshipped.** The command palette is the
  recommended pattern for hierarchical navigation. A `--dgo-menu__item--submenu`
  variant with a trailing chevron + nested `role="menu"` would need its own
  focus-management contract before it could ship.
- **Item radius reads the `--dgo-r-6` primitive directly** rather than an intent
  token (the container correctly uses `--dgo-radius-control`-equivalent intent
  via `--dgo-radius-card`). Functionally fine; a future minor could expose a
  `--dgo-menu-item-radius` component token to keep the family fully Tier-2/3.
  Track at `[NITDA DS team: file v2.x cleanup ticket]`.
- **No `data-open` styling hook.** "Open" is "mounted" today. If a future
  consumer needs an enter/exit transition driven by CSS rather than portal JS,
  the menu would need an explicit open-state attribute.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Neutral + danger items, group label, separator. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): corrected §6 padding-token claim, documented the 200px width floor, the shared hover/focus highlight cell, and the item-vs-container radius tier split. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
