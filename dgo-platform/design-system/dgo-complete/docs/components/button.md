# `button`

> The system's action trigger. A `.dgo-btn` is the only element in DGO that lets
> a user *do* something — submit, save, withdraw, confirm, cancel. Other
> clickable surfaces (cards, list items, navigation links) are not buttons and
> must not be styled like them.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/button.css`
**Selector namespace:** `.dgo-btn` + `.dgo-btn-group` (BEM)

---

## 1 · Anatomy

A button is a single native element with optional inline children.

- `.dgo-btn` — root. **Must be a native `<button>`** for in-page actions, or `<a>`
  for navigation that visually looks like a button. Never a `<div>` or `<span>`
  with a click handler.

### Slot policy

| Position | Allowed content |
|---|---|
| Before the label | Optional leading icon (`<svg aria-hidden="true">`). 16px stroke. |
| Centre | The label. Single line of text. |
| After the label | Optional trailing icon (chevron, external-link mark). |

`gap` between slots is `var(--dgo-s-2)` (8px), declared on `.dgo-btn`. Do not add
margin on icons inside a button — the gap token handles spacing.

### Button group

`.dgo-btn-group` is a sibling component that wraps 2+ `.dgo-btn` into a
horizontal strip with collapsed borders. Not a button itself.

---

## 2 · Variants

| Class | Description | Use when |
|---|---|---|
| `.dgo-btn--primary` | Filled, brand Deep Green. The page's primary action. | One per view, at most. The "submit", the "save", the "next step". |
| `.dgo-btn--secondary` | Outline, Deep Green text on transparent. | The complement to a primary — usually paired ("Cancel" + "Submit"). |
| `.dgo-btn--tertiary` / `.dgo-btn--ghost` | Text-only, no border. | Low-emphasis actions inside busy chrome — table-row actions, breadcrumb-adjacent links. The two classes are aliases; prefer `--tertiary` for actions and `--ghost` for chrome (close buttons, icon-only menu triggers). |
| `.dgo-btn--danger` | Filled, danger red. | Destructive irreversible actions: delete, withdraw, terminate. Pair with a confirm modal — never fire on a single click without a guard. |
| `.dgo-btn--accent` | Filled, Smart Green. | The single accent moment — "Approve", "Promote", "Publish". Used sparingly; the system reserves Smart Green for accent. See §02-color. |
| `.dgo-btn--icon` | Square button containing only an icon. | Toolbars, table-row actions, modal close. Must carry `aria-label`. |
| `.dgo-btn--block` | Full inline-size. | Mobile primary actions; "Sign in" inside a constrained form. |

`--icon` is **orthogonal** to the colour variants — compose them: `.dgo-btn .dgo-btn--ghost .dgo-btn--icon`.

`--block` is orthogonal to everything; compose it with size and colour variants.

---

## 3 · Sizes & density

Three sizes. Default is medium.

| Size | Class | Block-size | Padding-inline | Font-size token |
|---|---|---:|---|---|
| Small  | `.dgo-btn--sm` | 32px (`--dgo-btn-h-sm`) | `--dgo-btn-px-sm` (12px) | `--dgo-type-body-sm` (12px) |
| Medium (default) | — | 40px (`--dgo-btn-h-md`) | `--dgo-btn-px-md` (16px) | `--dgo-type-body` (14px) |
| Large  | `.dgo-btn--lg` | 48px (`--dgo-btn-h-lg`) | `--dgo-btn-px-lg` (20px) | `--dgo-type-body-lg` (16px) |

### Touch-target floor — known caveat

§04-spacing-grid requires a **44 × 44 px** touch-target floor. Only `.dgo-btn--lg`
meets that floor at default density. The shipped policy is:

- **Touch surfaces** (mobile, tablets, public-kiosk): use `.dgo-btn--lg`.
- **Mouse / keyboard surfaces** (operator desktops): `.dgo-btn` (md) is the
  default — the 40px clickable region is paired with an `8px` outer focus-ring
  halo (`--dgo-focus-ring`), so the keyboard hit-target is effectively `56px`.
- **`.dgo-btn--sm`** is reserved for dense surfaces where the *user is not
  expected to touch the screen* (data-table inline actions, filter-bar chips).

The "use `--lg` on touch" rule must be enforced at the layout level — there is
no responsive auto-promotion. See §16 *Open questions*.

### Density behaviour

The button does **not** re-bind under `[data-density="compact"]` — its three sizes
already cover the density envelope. Compact-mode views should use `.dgo-btn--sm`
where comfortable-mode views use `.dgo-btn` (md).

```
[data-density="compact"]:
  /* no token rebinding for button — choose .dgo-btn--sm explicitly */
```

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Default | — | Variant base — see §2 | — |
| Hover | `:hover:not(:disabled)` | Per-variant background / border rebind; `--primary` also picks up `--dgo-shadow-2` | mouse / touch |
| Focus | `:focus-visible` | `box-shadow: var(--dgo-focus-ring)` (two-layer green halo) | keyboard |
| Pressed | `:active:not(:disabled)` | `transform: translateY(1px)` on `--dgo-dur-instant`; per-variant `:active` background rebind | press |
| Disabled | `:disabled`, `[aria-disabled="true"]` | `opacity: 0.55`; `cursor: not-allowed`; `pointer-events: none` | data |
| Loading | `[data-loading="true"]` | Label colour transparent; spinner pseudo-element (`dgo-spin`, 0.6s linear infinite); pair with `aria-busy="true"` | data |

### Two flavours of disabled

The shipped rule treats `:disabled` and `[aria-disabled="true"]` identically
visually. They are **not** identical semantically — see §10.

- `disabled` (the native attribute) — removed from tab order; not focusable; AT
  treats as inert.
- `aria-disabled="true"` — still in tab order; still focusable; AT announces as
  unavailable but discoverable. Use when the user needs to *learn why* a button
  is currently unavailable (paired with a tooltip or helper text).

### Loading and label width

`data-loading="true"` makes the label transparent rather than removing it. This
preserves the button's `min-inline-size` — the button doesn't shrink when the
spinner appears, so neighbouring buttons don't reflow. Side-effect: if your
label is shorter than `--_h`, the spinner sits inside the `min-inline-size`
square. Acceptable.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-btn-radius`   | `var(--dgo-radius-control)` | theme:hc — radius preserved |
| `--dgo-btn-fw`       | `var(--dgo-wt-600)` | — |
| `--dgo-btn-tracking` | `var(--dgo-tr-normal)` | — |
| `--dgo-btn-h-sm`     | `32px` | — |
| `--dgo-btn-h-md`     | `40px` | — |
| `--dgo-btn-h-lg`     | `48px` | — |
| `--dgo-btn-px-sm`    | `var(--dgo-s-3)` | — |
| `--dgo-btn-px-md`    | `var(--dgo-s-4)` | — |
| `--dgo-btn-px-lg`    | `var(--dgo-s-5)` | — |

The button also reads internal CSS custom properties scoped to itself (`--_h`,
`--_px`, `--_fs`) which size variants rebind. These are implementation detail,
not public API.

### Tier 2 — Semantic tokens (read directly)

- `--dgo-color-action-primary`, `-hover`, `-press`, `-soft`
- `--dgo-color-action-secondary`, `-hover`, `-press`
- `--dgo-color-action-accent`, `-hover`
- `--dgo-color-action-danger`, `-hover`
- `--dgo-color-fg-on-brand`, `--dgo-color-fg-on-accent`
- `--dgo-color-border-strong`
- `--dgo-focus-ring`
- `--dgo-motion-state`, `--dgo-dur-instant`, `--dgo-ease-sharp`
- `--dgo-type-body`, `--dgo-type-body-sm`, `--dgo-type-body-lg`
- `--dgo-shadow-2` (for `--primary:hover` lift only)
- `--dgo-s-2` (the inline gap between label and icon)
- `--dgo-family-sans`

### Tier 1 — Primitives

**Empty.** The button is fully Tier-2/Tier-3.

(The hover-lift `--dgo-shadow-2` is a primitive, but it's exposed via Tier 2
`--dgo-elevation-card` semantically. The button reading the primitive directly
is a known minor inconsistency to clean up — see §14.)

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic (`inline-flex`), capped on long labels by the
  consumer's container. `--block` opts into `inline-size: 100%`.
- **Block-size:** fixed by `--_h` (32 / 40 / 48 per size).
- **Min inline-size:** `var(--_h)` — guarantees `--icon` variant is square; also
  protects single-character labels from collapsing.
- **White-space:** `nowrap`. A button label wrapping to two lines is a sign the
  label is too long, not that the button needs to grow taller.
- **Internal gap:** `var(--dgo-s-2)` (8px) between icon and label.
- **No container query.** The button doesn't respond to container size; it
  responds to its size modifier.

---

## 7 · Composition

- **Contains:** `<svg>` icons, plain text, `.dgo-badge` (rare — a count badge on
  a notification button). Nothing else.
- **Contained by:** `.dgo-modal__footer`, `.dgo-card__actions`, `.dgo-toast`,
  `.dgo-empty-state`, `.dgo-topbar`, `.dgo-filter-bar`, in-flow page sections.
- **Conflicts with:**
  - **Don't put a button inside a button.** A "Settings" button with an inline
    "X to dismiss" sub-button is two interactive parents; the inner button is
    unreachable correctly. Split into adjacent siblings instead.
  - **Don't put a button inside a `.dgo-card` that is itself clickable.** Either
    the card is a link (use the heading-link pattern in §08 §9) or there are
    buttons inside it — not both.

---

## 8 · Behaviour (JS contract)

**Mostly CSS.** The button is declarative; the consumer wires `onclick`. Two
state attributes are CSS-driven and require JS only for toggling:

### Attributes the component reads

| Attribute | Type | Meaning |
|---|---|---|
| `data-loading` | `"true" \| "false"` | Toggles the spinner pseudo-element. Always pair with `aria-busy`. |
| `aria-disabled` | `"true" \| "false"` | Visually-disabled state without leaving the tab order. |
| `aria-pressed` | `"true" \| "false"` | For toggle buttons (`.dgo-btn--toggle` if used). |
| `disabled` | boolean attr | Native disabled — removes from tab order. |

### Events the consumer fires

Native `click`, `keydown` (Space and Enter are native). No custom events.

### Focus management

Buttons don't programmatically receive or release focus. If a button opens a
modal, the modal's focus-trap takes over — see `modal.md` §8.

### Loading lifecycle (recommended)

1. On submit: set `data-loading="true"`, `aria-busy="true"`, `disabled` (or
   `aria-disabled` if the consumer needs the button to remain focusable for a
   "Cancel submission" affordance).
2. On success: remove all three attributes. Do not change the label text from
   "Submit" → "Submitted"; render the confirmation in a `.dgo-toast` instead.
3. On failure: remove the loading attributes; surface the error in a
   `.dgo-alert--danger` near the form, focus shifted to the alert's heading.

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Move focus in/out. Default. |
| `Enter` | Activate. Native on `<button>`. |
| `Space` | Activate. Native on `<button>`. |

The button breaks no universal behaviour from §08. Cross-link: §08 §1.

---

## 10 · ARIA

The native `<button>` element carries the right role; **do not add
`role="button"`** to a `<div>` and re-implement the keyboard handling. The
shipped style applies to `<button>` and to `<a class="dgo-btn">` for nav-styled
links.

| Attribute | Value | When |
|---|---|---|
| `aria-disabled` | `"true"` | When unavailable but still discoverable (preferred over `disabled` if AT users need to learn why). |
| `aria-pressed`  | `"true" \| "false"` | Toggle buttons only. Mutually exclusive with `aria-disabled` (a disabled toggle has no meaningful pressed state). |
| `aria-busy`     | `"true"` | Pair with `data-loading`. |
| `aria-label`    | string | **Required** for `.dgo-btn--icon`. The `<svg>` inside is `aria-hidden="true"`. |
| `aria-describedby` | id | Optional — used when the button is disabled and a sibling element explains why. |
| `aria-haspopup` | `"menu" \| "dialog" \| "listbox"` | For buttons that open a menu / dialog / dropdown. Set when applicable. |
| `aria-expanded` | `"true" \| "false"` | For toggle / disclosure buttons that open something. |

### Forced-colours behaviour

Under `forced-colors: active` and `[data-theme="hc"]`:

- Background colours strip to system colours (`ButtonFace`).
- Text rebinds to `ButtonText`.
- Focus ring rebinds to the three-layer HC stack (white / black / amber).
- Border is forced on all variants (the shipped CSS uses `border: 1px solid transparent`
  which becomes a real border under forced-colors; this is intentional).
- The shadow-2 lift on `--primary:hover` strips — the hover state is communicated
  by the system colour swap alone.

### Reduced-motion behaviour

- The hover and focus transitions run on `--dgo-motion-state` (250ms) — collapses
  to 0ms.
- The `:active` translateY runs on `--dgo-dur-instant` (50ms) — collapses to 0ms.
- The loading spinner **continues to animate** — see §06 *What still moves under
  reduced motion*.

---

## 11 · Internationalisation

- **Diacritic safety:** the button label is single-line `--dgo-type-body`
  (14px) at `line-height: 1`. The 14px-on-1.0 cell is tight but cleared because
  buttons don't carry stacked combining marks at body-size (verified against
  the Yorùbá / Hausa / Igbo button-label inventory). If translation produces a
  label with stacked marks (`ọ́` etc.), the 40px button height absorbs them.
- **RTL:** icon-and-label order flips automatically because the button uses
  `gap` with `display: inline-flex` — no mirroring code needed. A "Next →"
  button becomes "← Next" under `[dir="rtl"]` if the arrow icon flips per §05.
- **Translation expansion:** the button sizes to content via `padding-inline`.
  A "Submit" → "Fi-ranṣẹ́" change adds ~30% width; the button absorbs it. **Do
  not** set `inline-size` on individual buttons except via `--block`.
- **Button group under RTL:** the `:first-child` / `:last-child` radius rules
  use logical `border-start-start-radius` / `border-end-end-radius`, so the
  corners follow reading direction automatically. The `margin-inline-start:
  -1px` collapsing border works in both directions.

---

## 12 · Examples

### Basic

```html
<button class="dgo-btn dgo-btn--primary">Submit Dossier</button>
```

### With variants and states

```html
<!-- Primary + loading -->
<button class="dgo-btn dgo-btn--primary"
        data-loading="true"
        aria-busy="true"
        aria-disabled="true">Submitting…</button>

<!-- Secondary at large size -->
<button class="dgo-btn dgo-btn--secondary dgo-btn--lg">Save Draft</button>

<!-- Ghost icon-only -->
<button class="dgo-btn dgo-btn--ghost dgo-btn--icon" aria-label="Dismiss">
  <svg aria-hidden="true">
    <use href="../../assets/icons/sprite.svg#i-x"/>
  </svg>
</button>

<!-- Danger with confirm -->
<button class="dgo-btn dgo-btn--danger"
        aria-haspopup="dialog"
        aria-controls="confirm-withdraw">Withdraw Submission</button>

<!-- Block-width primary on mobile -->
<button class="dgo-btn dgo-btn--primary dgo-btn--lg dgo-btn--block">Continue</button>
```

### Inside a real composition

Modal footer with a `Cancel` + destructive primary pair, plus a button group as
an inline pagination control:

```html
<footer class="dgo-modal__footer">
  <button class="dgo-btn dgo-btn--secondary" data-modal-close>Cancel</button>
  <button class="dgo-btn dgo-btn--danger">Withdraw Submission</button>
</footer>

<div class="dgo-btn-group" role="group" aria-label="Pagination">
  <button class="dgo-btn dgo-btn--secondary dgo-btn--sm" aria-label="Previous page">
    <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-chevron-left"/></svg>
  </button>
  <button class="dgo-btn dgo-btn--secondary dgo-btn--sm" aria-current="page">1</button>
  <button class="dgo-btn dgo-btn--secondary dgo-btn--sm">2</button>
  <button class="dgo-btn dgo-btn--secondary dgo-btn--sm">3</button>
  <button class="dgo-btn dgo-btn--secondary dgo-btn--sm" aria-label="Next page">
    <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-chevron-right"/></svg>
  </button>
</div>
```

---

## 13 · Anti-patterns

- ❌ `<div class="dgo-btn" onclick="…">Save</div>`
  ✅ `<button class="dgo-btn dgo-btn--primary">Save</button>`. The native button
  carries the role, the keyboard handlers, and the disabled semantics for free.

- ❌ Two `.dgo-btn--primary` on the same view.
  ✅ One primary, one secondary. The page has a single primary action; everything
  else is secondary, tertiary, or ghost.

- ❌ `.dgo-btn--danger` firing on a single click ("Delete" deletes immediately).
  ✅ `.dgo-btn--danger` opens a confirm modal whose primary action is also
  `--danger`. See §10-content-voice §5 *Confirmation pattern*.

- ❌ Hover-only state on a touch surface ("Click to reveal action" is invisible
  on mobile).
  ✅ Visible by default at touch sizes. Hover-revealed actions are a desktop-only
  pattern.

- ❌ A button label that asks a question. "Are you sure?" on a button.
  ✅ The button states the action: "Withdraw". The question (if any) sits in the
  modal title.

- ❌ "Click here to learn more" / "Click here to submit".
  ✅ "Learn about appeals" / "Submit Dossier". The label states the destination
  or the action, not the gesture. See §10-content-voice §5.

Cross-link: §12-anti-patterns *"Two primaries on a view"*; §10-content-voice §5
*Button*; §08 §1 *Button*.

---

## 14 · Migration

`v2.0` is the first shipped version. No migration history.

| From | To | Why | Codemod |
|---|---|---|---|
| — | — | — | — |

**Known inconsistency to clean up in a future minor:** the primary button's
hover lift consumes `--dgo-shadow-2` (Tier 1) rather than `--dgo-elevation-card`
(Tier 2). Functionally identical; cleaner via the intent tier. Track at
`[NITDA DS team: file v2.x cleanup ticket]`.

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `:focus-visible` | required | — |
| Logical properties (`padding-inline`, `border-start-start-radius`) | required | — |
| `inline-flex` with `gap` | required | — |
| `forced-colors: active` styling | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`.

---

## 16 · Open questions

- **The 40px button-md vs the 44px touch-target floor.** Current rule is "use
  `--lg` on touch surfaces"; the rule is unenforced. A `[data-touch="true"]`
  attribute that re-binds `--dgo-btn-h-md` to `44px` would close the gap
  automatically. Track for v2.2.
- **Loading button accessibility.** The shipped pattern uses
  `aria-busy + aria-disabled + data-loading`. JAWS in some versions doesn't
  announce `aria-busy` until the next focus event — should we add a
  `role="status"` live region announcing "Submitting…"? Test before promoting
  a recommendation.
- **Promoted `--dgo-shadow-2` to intent tier on the hover lift** — see §14.
- **A `--dgo-btn--toggle` variant** with `aria-pressed` styling. Currently the
  pattern is "compose `--secondary` or `--ghost` with `aria-pressed`"; an
  explicit variant would make the segmented-control case cleaner.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Five variants (primary, secondary, tertiary/ghost, danger, accent) + icon + block + group. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[button — typically the foundations team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
