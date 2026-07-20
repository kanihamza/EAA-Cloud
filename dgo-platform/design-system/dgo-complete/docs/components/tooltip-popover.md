# `tooltip-popover`

> Two siblings that share one file but almost nothing else. **Tooltip** = a single
> short, non-interactive string surfaced on hover/focus; a dark capsule that floats
> at a low elevation and vanishes on blur. **Popover** = a rich, interactive surface
> (text, buttons, a small form) surfaced on click; a light card at a higher
> elevation that traps focus until dismissed. They live together because both are
> *anchored, portalled overlays* — but they differ in trigger, interactivity,
> elevation, colour, and ARIA role. Pick by **interactivity**: if the user needs to
> *do* something inside it, it is a popover; if they only need to *read* it, it is a
> tooltip.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/tooltip-popover.css`
**Selector namespace:** `.dgo-tooltip` · `.dgo-popover` (BEM)

---

## 1 · Anatomy

The two surfaces are **parallel top-level classes**, not a nested pair — a tooltip
is never inside a popover and neither wraps the other. Each is a single element the
consumer's positioning layer mounts and places.

### `.dgo-tooltip`

- A single `inline-block` capsule. Owns: dark `--dgo-tooltip-bg` fill, white
  `--dgo-tooltip-fg` text, `--dgo-type-caption` size at `--dgo-wt-500` weight, a 6px
  (`--dgo-tooltip-radius`) radius, the `--dgo-shadow-3` drop shadow, and a
  `max-inline-size: 280px` wrap cap.
- **No child elements.** The tooltip contains one run of text and nothing else (see
  §13 — a tooltip with a button in it is an anti-pattern).

### `.dgo-popover`

- A single card surface. Owns: `--dgo-color-surface-raised` background, a 1px
  `--dgo-color-border-default` edge, a 10px (`--dgo-popover-radius`) radius,
  `--dgo-popover-pad` (12px) padding, the `--dgo-popover-shadow` elevation, and a
  `min-inline-size: 220px` floor.
- **Holds any DGO content** — headings, body text, buttons, a compact form. The
  popover is a container; its children are ordinary system components.

### No arrow / caret element

The shipped CSS draws **no** connector arrow on either surface. If a design calls
for a caret pointing at the trigger, it is the consumer's positioning library
(e.g. Floating UI's `arrow` middleware) that renders and places it — the system
ships the surface, not the pointer. Do not hand-roll a CSS-triangle arrow inside
`.dgo-tooltip` / `.dgo-popover`; it will not track the flip logic.

---

## 2 · Variants

No variants on either surface. A tooltip is always the dark capsule; a popover is
always the light card. Anchoring side, offset, and flip behaviour are the
consumer's positioning decision, not a class.

For a list-shaped popover (a menu of actions), use `.dgo-menu` portalled to the
trigger instead — it ships the `role="menu"` semantics and the roving-tabindex
contract a bare popover does not. For a search-shaped overlay, use the command
palette. The popover is for **bespoke** content that no other family covers.

---

## 3 · Sizes & density

Single size each. **Density has no effect on this family** — and this is worth
stating precisely because the box around it implies otherwise:

- `.dgo-tooltip` padding is the literal `6px 10px` (see §5 — a hardcoded value,
  not a token).
- `.dgo-popover` padding is `--dgo-popover-pad`, which resolves to the **fixed
  primitive** `--dgo-s-3` (12px). It does **not** read `--dgo-density-pad`, so it
  does not rebind under `[data-density="compact"]`.

Neither surface declares a density block and neither consumes a `--dgo-density-*`
token. An overlay is a transient, self-contained surface; it keeps one comfortable
internal rhythm regardless of the density of the page beneath it. (Earlier drafts
of this doc claimed density "adjusts internal padding via the `--dgo-density-pad`
chain" — that was boilerplate and is incorrect for this family; corrected
2026-06-05 against the shipped CSS.) See `docs/04-spacing-grid.md` §"Density".

---

## 4 · States

There is **no state styling in the CSS.** Both `.dgo-tooltip` and `.dgo-popover`
are painted always-visible; an "open" overlay is simply a *mounted* one (the same
"open = mounted" model as `.dgo-menu`). The `data-state` and `aria-expanded`
attributes below are written and read by the **consumer's JS**, not by the
stylesheet — they are the contract the JS must honour, documented here so the
visual and behavioural sides agree.

| Logical state | Attribute the consumer sets | Trigger | Notes |
| --- | --- | --- | --- |
| Tooltip shown | `data-state="open"` on the tooltip; trigger is the focused / hovered element | mouse hover **or** keyboard focus of the trigger | Non-interactive: the tooltip never receives focus itself. |
| Tooltip hidden | `data-state="closed"` / unmounted | blur or `Escape` | |
| Popover shown | `data-state="open"` on the popover; `aria-expanded="true"` on the trigger | click or `Enter`/`Space` on the trigger | Focus moves into the popover (see §8). |
| Popover hidden | `data-state="closed"` / unmounted; `aria-expanded="false"` | `Escape`, outside-click, or close button | Focus returns to the trigger. |

The CSS exposes **no** `[data-state]` selector to hook an enter/exit transition —
any open/close motion lives in the consumer's portal JS and must honour
`prefers-reduced-motion` there (see §10, §16).

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in
`styles/components/tooltip-popover.css`, verified against the shipped CSS on
2026-06-05. Tokens reached only through a component-token's internal chain (e.g.
`--dgo-shadow-4` behind `--dgo-popover-shadow`) are documented at their own tier,
not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Resolves to | Used for |
|---|---|---|
| `--dgo-tooltip-bg` | `--dgo-ink-900` (`#1B1A1A`) | Tooltip capsule fill — a near-black, **fixed across themes** (see note). |
| `--dgo-tooltip-fg` | `--dgo-ink-0` (`#FFFFFF`) | Tooltip text — white on ink-900, clears AAA. |
| `--dgo-tooltip-radius` | `--dgo-r-6` (6px) | Tooltip corner radius — one step tighter than the popover. |
| `--dgo-popover-radius` | `--dgo-radius-card` → `--dgo-r-10` (10px) | Popover corner radius (intent tier). |
| `--dgo-popover-pad` | `--dgo-s-3` (12px) | Popover interior padding (all sides). |
| `--dgo-popover-shadow` | `--dgo-elevation-popover` → `--dgo-shadow-4` | Popover drop shadow — the higher of the two elevations. |

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-surface-raised` | Popover background |
| `--dgo-color-border-default` | Popover 1px border |
| `--dgo-type-caption` | Tooltip font-size (12px) |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-shadow-3` | `0 4px 6px …, 0 2px 4px …` (green-tinted) | **Tooltip** drop shadow — read as a primitive directly, one elevation *below* the popover (see §7). |
| `--dgo-wt-500` | medium | Tooltip font-weight |

### The two-elevation split

The tooltip's shadow is the **primitive** `--dgo-shadow-3`; the popover's is the
**component** token `--dgo-popover-shadow` → `--dgo-elevation-popover` →
`--dgo-shadow-4`. The popover therefore sits one elevation step *higher* than the
tooltip. That is intentional: a popover is an interactive surface the user is
acting inside, so it lifts further off the page; a tooltip is a light, transient
read-only hint that hovers just above its trigger. The tooltip reaching the
primitive directly (rather than an `--dgo-elevation-tooltip` intent token that does
not exist) is the one place this family steps past the intent tier — tracked in §16.

### Un-tokenised value in the CSS — known

`.dgo-tooltip` declares `padding: 6px 10px` as **literals**, contradicting the file
header's "every value is a var()" claim. The `6px`/`10px` pair is a deliberately
snug capsule fit (tighter than any `--dgo-s-*` step would give: `s-2` is 8px,
`s-1` is 4px), but it is a real exception to the system's token discipline and
does not rebind under theme or density. Tracked in §16. The popover, by contrast,
is fully tokenised.

---

## 6 · Layout & sizing

- **Tooltip inline-size:** intrinsic (`inline-block`), capped at
  `max-inline-size: 280px` — past that the string wraps onto a second line rather
  than running off-screen.
- **Popover inline-size:** intrinsic, with a `min-inline-size: 220px` floor so a
  popover never collapses narrower than a comfortable reading column even for one
  short sentence; it grows to fit its content up to the consumer's positioning
  bounds.
- **Block-size (both):** intrinsic — the sum of the content plus the surface's
  padding.
- **Internal spacing:** tooltip = the literal `6px 10px` (§5); popover =
  `--dgo-popover-pad` (12px, all sides). (Earlier drafts said "uses the
  component-tier padding tokens listed in §5" for both — true only of the popover;
  corrected 2026-06-05.)
- **Positioning:** none in the CSS. The consumer's positioning layer owns anchor,
  offset, side, and viewport-flip. See §8.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:**
  - Tooltip — a single short text string. Nothing focusable, nothing interactive.
  - Popover — any DGO content: a heading, body copy, `.dgo-btn`s, a compact field
    or two. Treat it as a small card you own the inside of.
- **Contained by:** neither sits in normal flow — both are **portalled to
  `<body>`** by the consumer so they escape `overflow: hidden` ancestors and stack
  above the page on their elevation.
- **Conflicts with:**
  - **A tooltip on a popover trigger** — never. The same trigger cannot both
    describe-on-hover and disclose-on-click without the two overlays racing. If the
    trigger needs a label, give it an `aria-label` and reserve the overlay for the
    popover.
  - **An interactive element inside a tooltip** — never (see §13). Move it into a
    popover.
  - **A modal opened from inside a popover** — close the popover first; a popover
    dismisses on outside-click, which would race the modal's backdrop.

---

## 8 · Behaviour (JS contract)

Interactive. The shipped CSS styles surfaces that are **already mounted and
positioned**; the consumer's JS owns everything dynamic. The two surfaces have
**different** contracts:

### Tooltip (the lighter contract)

| Responsibility | Detail |
|---|---|
| Show / hide | On trigger `mouseenter` / `focus`; hide on `mouseleave` / `blur` / `Escape`. A short open delay (≈ 100–300ms) is conventional; closing is immediate. |
| Positioning | Anchor to the trigger, offset a few px, flip when it would overflow the viewport. |
| No focus management | The tooltip is non-interactive and **never** receives focus. It is referenced, not entered. |
| Wiring | Trigger carries `aria-describedby` pointing at the tooltip's `id` (see §10). |

### Popover (the heavier contract)

| Responsibility | Detail |
|---|---|
| Open / close | Toggle presence from the trigger's `click` / `Enter` / `Space` and from `Escape`, outside-click, and any in-popover close button. |
| Positioning | Same anchor-and-flip as the tooltip. |
| Focus management | On open, move focus into the popover (first focusable element, or the popover container if it has none). **Trap `Tab`** inside until close. On close, **return focus to the trigger**. |
| `aria-expanded` | Reflect open state on the trigger. |

### What the component (CSS) owns

Both surfaces' box, colour, radius, padding, elevation, and size floors/caps —
nothing dynamic. No `[data-state]` selector is styled; "open" is "mounted". See
`docs/08-accessibility.md` for the full overlay keyboard contract; the system
enforces visuals only.

---

## 9 · Keyboard

| Surface | Key | Behaviour |
|---|---|---|
| Tooltip | (trigger) `Tab` | Focusing the trigger shows the tooltip via `:focus`. |
| Tooltip | `Escape` | Dismiss the tooltip while leaving trigger focus in place. |
| Tooltip | (trigger) blur | Dismiss. |
| Popover | (trigger) `Enter` / `Space` | Open the popover; move focus inside. |
| Popover | `Tab` / `Shift+Tab` | Cycle focus **within** the popover (trapped) until close. |
| Popover | `Escape` | Close and return focus to the trigger. |

The tooltip must appear on **keyboard `:focus-visible` of the trigger**, not on
hover alone — a hover-only tooltip is invisible to keyboard and touch users (§13).

---

## 10 · ARIA

| Surface | Role | Trigger wiring |
|---|---|---|
| Tooltip | `role="tooltip"` on the capsule | Trigger carries `aria-describedby="<tooltip-id>"`. The tooltip *describes* the trigger; it is not a label. |
| Popover | `role="dialog"` with `aria-labelledby` pointing at its own heading | Trigger carries `aria-expanded` and `aria-haspopup="dialog"`. |
| Popover (list-shaped) | If the popover is really a list of choices, use `role="listbox"` / `role="menu"` — but prefer the `.dgo-menu` family, which ships those semantics. | — |

A tooltip must reference a **focusable** trigger. A `<div>` with no `tabindex`
cannot surface its tooltip on keyboard focus (§13); use a real `<button>` or add
`tabindex="0"` to a genuinely interactive element.

### Forced-colours behaviour

Under `forced-colors: active` and `[data-theme="hc"]`:

- The popover swaps custom colour tokens for system colours — `--dgo-color-surface-raised`
  → `Canvas`, text → `CanvasText` — and the 1px border becomes a `CanvasText` edge.
  `--dgo-popover-shadow` drops; the border is then the only thing separating the
  popover from the page, which is why the 1px border is non-negotiable.
- The tooltip's `--dgo-tooltip-bg` / `-fg` map to `Canvas` / `CanvasText` (or the
  system tooltip colours where the engine provides them); `--dgo-shadow-3` drops and
  a forced 1px border carries the edge.

See `docs/07-elevation.md`.

### Reduced-motion behaviour

The CSS declares **no** transitions or animations on either surface, so there is
nothing in the stylesheet to collapse. Any enter/exit motion lives in the
consumer's portal JS and **must** be gated on
`@media (prefers-reduced-motion: reduce)` there — the system cannot enforce motion
it does not own. See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** the tooltip is `--dgo-type-caption` (12px) at
  `--dgo-wt-500`; the 6px top padding plus the caption ramp's line-height keeps
  stacked Yorùbá / Hausa / Igbo combining marks (`ọ́`, `ǹ`) off the capsule's top
  edge. Popover body text uses the consumer's chosen type ramp; size it from the
  body ramp (`--dgo-lh-150`) so marks have vertical room.
- **RTL:** both surfaces use logical properties (`max-inline-size`,
  `min-inline-size`, logical padding), so width caps and floors follow the writing
  direction. The **anchoring side flips** under `[dir="rtl"]` — but that is the
  consumer's positioning layer's job; a popover anchored "to the end of the
  trigger" lands on the correct side automatically only if the positioning code is
  direction-aware.
- **Translation expansion:** tooltip strings wrap at the `280px` cap rather than
  clipping; popover content reflows. Never truncate either with
  `text-overflow: ellipsis` — a half-shown hint is worse than a wrapped one. Keep
  tooltip strings to one or two short lines; a tooltip that needs a paragraph is a
  popover.

---

## 12 · Examples

### Tooltip — basic

```html
<button id="trg" class="dgo-btn dgo-btn--icon" aria-describedby="tt1" aria-label="Routing help">
  <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-info"/></svg>
</button>

<!-- portalled to <body>, positioned by the consumer -->
<div class="dgo-tooltip" role="tooltip" id="tt1" data-state="open">
  Routing rules apply to dossiers approved after 14:00.
</div>
```

### Popover — interactive

```html
<button id="filters-trg"
        class="dgo-btn dgo-btn--secondary"
        aria-haspopup="dialog"
        aria-expanded="true"
        aria-controls="filters-pop">Filters</button>

<div class="dgo-popover" role="dialog" id="filters-pop" aria-labelledby="filters-h" data-state="open">
  <h3 id="filters-h" class="dgo-h4">Filter dossiers</h3>
  <label class="dgo-field">
    <span class="dgo-label">Desk</span>
    <span class="dgo-select">
      <select class="dgo-select__field">
        <option>Compliance</option>
        <option>Operations</option>
      </select>
    </span>
  </label>
  <footer class="dgo-modal__footer">
    <button class="dgo-btn dgo-btn--secondary" data-popover-close>Cancel</button>
    <button class="dgo-btn dgo-btn--primary">Apply</button>
  </footer>
</div>
```

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the
showcase (`index.html`) — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ A tooltip containing a button, link, or any focusable control.
  ✅ Tooltips are non-interactive read-only hints. If the user must *act*, use a
  popover — focus can enter a popover, never a tooltip.
- ❌ A popover that opens on **hover**.
  ✅ Popovers open on click / `Enter` so keyboard and touch users can reach the
  controls inside; a hover-opened interactive surface is unreachable for them.
- ❌ A tooltip on a non-focusable `<div>` (no `tabindex`).
  ✅ The trigger must be focusable — a real `<button>`, or `tabindex="0"` on a
  genuinely interactive element — or the tooltip never surfaces on keyboard focus.
- ❌ A hand-rolled CSS-triangle arrow inside `.dgo-tooltip` / `.dgo-popover`.
  ✅ Let the positioning library draw and place the caret so it tracks the flip
  logic — the system ships no arrow (§1).
- ❌ A tooltip carrying a paragraph of text.
  ✅ That is popover-shaped content. Tooltips are one or two short lines.
- ❌ Both a tooltip *and* a popover on the same trigger.
  ✅ One overlay per trigger; give the trigger an `aria-label` if it also needs a
  name.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-tooltip` / `.dgo-popover` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| Logical properties (`max-inline-size`, `min-inline-size`, logical padding) | required | — |
| `forced-colors: active` styling | required | — |
| Portalling to `<body>` (consumer JS) | required | Overlay clips inside `overflow: hidden` ancestors. |
| CSS `anchor-name` positioning | **not yet** | Use a positioning library (Floating UI) until baseline (see §16). |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational. Highest-risk area to verify against real AT: the **popover**'s
`role="dialog"` + focus-trap + focus-return cycle, and whether `aria-describedby`
tooltips are announced consistently across NVDA/JAWS verbosity settings (tooltip
announcement is the most variable behaviour in this family).

---

## 16 · Open questions

- **The tooltip padding is the literal `6px 10px`**, not a token — a real exception
  to the system's "every value is a var()" discipline (§5). A
  `--dgo-tooltip-pad` component token (or a `4px 8px`-derived `--dgo-s-*` pairing)
  would close it; the current snug fit is intentional but un-tokenised. Track at
  `[NITDA DS team: file v2.x cleanup ticket]`.
- **The tooltip shadow reads the `--dgo-shadow-3` primitive directly** rather than
  an intent token — there is no `--dgo-elevation-tooltip` (the popover correctly
  uses `--dgo-elevation-popover`). Exposing a tooltip elevation intent token would
  bring the family fully Tier-2/3 and make the two-elevation split (§5) explicit in
  the token graph rather than implicit in the CSS.
- **No `[data-state]` styling hook.** "Open" is "mounted" today, so any CSS-driven
  enter/exit transition is impossible — motion must live in the consumer's portal
  JS. If a future consumer needs system-owned open/close motion (honouring
  `prefers-reduced-motion`), the family would need an explicit open-state attribute
  styled in the CSS.
- **CSS `anchor-name` positioning** is the long-term API for both surfaces; until
  baseline support is universal, consumers position with a library (Floating UI).
  When `anchor-name` baselines, a system-owned positioning layer could replace the
  per-consumer JS.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Tooltip (dark capsule) + popover (light card), portalled and anchored by the consumer. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): corrected §3 (this family has **no** density response — removed the incorrect `--dgo-density-pad` claim) and §6 (only the popover padding is tokenised); documented the two-elevation split (tooltip `--dgo-shadow-3` vs popover `--dgo-elevation-popover`), the fixed-across-themes `ink-900`/`ink-0` capsule, the absent arrow element, the separate tooltip vs popover JS contracts, and logged the hardcoded `6px 10px` tooltip padding as a token-discipline exception. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
