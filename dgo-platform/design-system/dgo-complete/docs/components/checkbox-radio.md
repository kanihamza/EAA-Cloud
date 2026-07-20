# `checkbox-radio`

> Boolean (`checkbox`) and exclusive-choice (`radio`) form controls. Both are
> **native `<input>` elements left to render themselves**, tinted to the brand with
> `accent-color` and given a branded focus outline — there is **no custom-drawn
> indicator**. The native box/disc, its checkmark/dot, the checked and
> indeterminate rendering, hover, and disabled all come from the platform; the
> system contributes exactly three things: the brand accent colour, a focus
> outline, and the label layout. This is a deliberate correctness trade — native
> controls carry keyboard, AT, autofill, and forced-colours behaviour that a
> hand-drawn indicator routinely breaks (§13).

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/checkbox-radio.css`
**Selector namespace:** `.dgo-check` · `.dgo-radio` (BEM)

---

## 1 · Anatomy

Two parallel families, identical structure — a wrapping `<label>` so the text and
the control share one hit-target:

- `.dgo-check` / `.dgo-radio` — the wrapper `<label>`. `inline-flex`,
  `align-items: center`, `gap: var(--dgo-s-2)` (8px), `cursor: pointer`,
  `user-select: none`, text at `--dgo-type-body` (14px). The whole label is
  clickable, so a tap on the text toggles the control.
- `<input type="checkbox">` / `<input type="radio">` — the **real, native, focusable
  control**. Fixed `18 × 18 px`, `margin: 0`, `accent-color: var(--dgo-color-action-primary)`,
  `cursor: pointer`. It is *present and visible* — never `display: none` — so it
  keeps the platform indicator and every native behaviour.
- text-node label — the visible label, a direct child of the same `<label>`.

There is **no `::before` / `::after` indicator pseudo-element** (contrast the
switch). What you see checked is the browser's own checkmark/dot, recoloured by
`accent-color`.

---

## 2 · Variants

No variants. The native control's shape is the visual — a square box for the
checkbox, a circle for the radio. The only stylistic lever the system pulls is
`accent-color`; everything else is the platform's.

---

## 3 · Sizes & density

Single fixed size — `18 × 18 px`. **Density has no effect.** The family declares no
density block and consumes no `--dgo-density-*` token; the `18px` box is a fixed
literal and the label gap is the fixed primitive `--dgo-s-2`. (Earlier drafts
claimed "density adjusts internal padding" — there is no padding and no density
token; corrected 2026-06-05 against the shipped CSS.) See
`docs/04-spacing-grid.md` §"Density".

---

## 4 · States

`checkbox-radio.css` ships exactly **two** rules of its own — the `accent-color`
tint and the focus outline. Every other "state" below is the **native UA
rendering**, listed so an implementer knows what is system-styled versus
platform-default. States the CSS does not ship are labelled as native.

| State | Source | Visual |
| --- | --- | --- |
| Default (unchecked) | native | Platform empty box / disc. |
| Hover | native | Platform UA hover — the system adds nothing. |
| Focus | **shipped** | `outline: 2px solid var(--dgo-color-border-focus)`; `outline-offset: 2px` on `input:focus-visible`. A **2px outline**, not a 3px ring. |
| Checked | **shipped tint** | Native `:checked` checkmark/dot, recoloured by `accent-color: var(--dgo-color-action-primary)`. |
| Indeterminate (checkbox) | native, JS-set | `el.indeterminate = true` in JS renders the platform dash; there is no CSS or attribute for it. |
| Disabled | **native only** | `disabled` attribute → the platform's own dimmed rendering. The CSS ships **no** opacity or `pointer-events` rule — disabled appearance is whatever the browser draws. |

> **Correction note:** earlier drafts described focus as a "native 3px focus ring"
> and listed a "disabled: opacity 0.55" state. Both were inaccurate — the shipped
> focus outline is an explicit **2px** custom rule (not native, not 3px), and the
> CSS ships **no** disabled opacity (the browser's native disabled rendering is all
> there is). Corrected 2026-06-05.

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in
`styles/components/checkbox-radio.css`, verified against the shipped CSS on
2026-06-05. Tokens reached only through a component-token's internal chain are
documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

**None.** The family references no component-tier token — it is the leanest
control in the system, three tokens total.

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-action-primary` | The `accent-color` tint applied to the native control. |
| `--dgo-color-border-focus` | The 2px focus-outline colour. |
| `--dgo-type-body` | Label font-size (14px) on the wrapper. |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-s-2` | 8px | Gap between the control and its text label. |

### Un-tokenised geometry — known

The `18px × 18px` control size and the `2px` focus outline + `2px` outline-offset
are **literals**, a minor exception to the file header's "every value is a var()".
The `18px` is the conventional touch-comfortable native checkbox footprint; the
`2px`/`2px` outline pair matches the switch's focus treatment for consistency
across the two native-control families. A `--dgo-control-size` / `--dgo-focus-outline-*`
token set would close the gap — tracked in §16.

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic — the wrapper is `inline-flex` and sizes to the
  control plus its label.
- **Block-size:** intrinsic — the taller of the `18px` control and the label line.
- **Internal spacing:** the only internal gap is `--dgo-s-2` (8px) between control
  and label. There is **no padding** on the control or wrapper. (Earlier drafts
  said "uses the component-tier padding tokens listed in §5" — there are none;
  corrected 2026-06-05.)
- **Touch target:** the `18px` control sits below the 44px touch floor, but the
  whole `<label>` (control + text) is the clickable area, so the effective target
  is the label's full width and line-height. For control-only layouts (a checkbox
  with no adjacent text), provide padding on the label to reach the floor.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** the native `<input>` and a text-node label. Nothing else.
- **Contained by:** `.dgo-field` (a labelled form row or fieldset), a
  `.dgo-modal__body` (a consent checkbox), a `.dgo-filter-bar` (multi-select
  filters), a `.dgo-table` row (row-selection checkboxes).
- **Conflicts with:**
  - **Wrapping the input outside its `<label>` without a `for=`/`id` pair** — the
    label/control association breaks and the text stops being a click target.
  - **A radio group whose members don't share a `name`** — without the shared
    `name` they are all independently checkable, defeating the exclusivity that is
    the radio's entire purpose (§13).

---

## 8 · Behaviour (JS contract)

**No JS for checkbox or radio** — both are fully declarative; the consumer reads
the value via `change` or on submit. The one JS touch-point is the checkbox's
**indeterminate** state, which has no HTML attribute and must be set in script:
`checkboxEl.indeterminate = true`. Indeterminate is a *display* state only — the
checkbox still submits its `checked` value, so clear it deliberately when the user
acts.

---

## 9 · Keyboard

Entirely native:

| Control | Key | Behaviour |
|---|---|---|
| Checkbox | `Tab` / `Shift+Tab` | Focus in / out. |
| Checkbox | `Space` | Toggle checked. |
| Radio | `Tab` | Focus *enters the group* at the checked member (or the first if none checked). |
| Radio | `Arrow` keys | Move selection within the group — and the group is **one tab stop**. This is native radio-group behaviour; do not re-implement it. |

---

## 10 · ARIA

Native `<input>` semantics carry the role — `checkbox` or `radio`. The `<label>`
association is by **wrapping** (the input is inside the label), so no explicit
`for=`/`id` is required in the shipped pattern; add them if structure forces the
label and input apart. For a set of related checkboxes or a radio group, wrap them
in a `<fieldset>` with a `<legend>` so AT announces the group's purpose.

### Forced-colours behaviour

Native checkboxes and radios are **first-class in forced-colours mode** — the
engine draws them with system colours (`CanvasText`, `Highlight`) regardless of
`accent-color`, so the control stays visible and correctly checked/unchecked. This
is the core payoff of styling the native control rather than a custom indicator: it
needs no forced-colours fallback because the platform supplies one. The 2px focus
outline maps to the system focus colour. See `docs/07-elevation.md`.

### Reduced-motion behaviour

The family declares no transitions or animations, so there is nothing to collapse —
the native check/uncheck is instantaneous on every platform. See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** the label is `--dgo-type-body` (14px); the body ramp's
  line-height gives stacked Yorùbá / Hausa / Igbo combining marks vertical room,
  and the `inline-flex; align-items: center` keeps a marked label optically aligned
  with the control.
- **RTL:** the control-then-label order flips automatically under `[dir="rtl"]`
  because the wrapper uses `inline-flex` with `gap` (no directional margins) — the
  control lands on the reading-start side. The native indicator mirrors itself.
- **Translation expansion:** a long label wraps inside the `<label>`; the control
  stays vertically centred on the first line via `align-items: center`. Never
  truncate a checkbox/radio label — the user must read the full choice before
  committing.

---

## 12 · Examples

### Checkbox

```html
<label class="dgo-check">
  <input type="checkbox">
  <span>Confirm I have reviewed the attached materials</span>
</label>
```

### Radio group (shared `name`, wrapped in a fieldset)

```html
<fieldset class="dgo-field">
  <legend class="dgo-label">Routing priority</legend>
  <label class="dgo-radio">
    <input type="radio" name="priority" value="standard" checked>
    <span>Standard</span>
  </label>
  <label class="dgo-radio">
    <input type="radio" name="priority" value="urgent">
    <span>Urgent</span>
  </label>
</fieldset>
```

### Indeterminate (parent of a partially-checked set)

```html
<label class="dgo-check">
  <input type="checkbox" id="select-all">
  <span>Select all dossiers</span>
</label>
<script>
  // set in JS — there is no indeterminate HTML attribute
  document.getElementById('select-all').indeterminate = true;
</script>
```

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the
showcase (`index.html`) — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ A custom-drawn checkbox with `display: none` on the input.
  ✅ Breaks keyboard, AT, autofill, and forced-colours. Keep the native input
  present and visible; tint it with `accent-color`.
- ❌ Radio inputs in a group not sharing a `name`.
  ✅ They become independently checkable. The shared `name` is the exclusivity
  contract.
- ❌ A checkbox used where one of several exclusive options must be chosen.
  ✅ That is a radio group. Checkbox = independent boolean; radio = pick-one.
- ❌ Conveying "partially selected" by leaving a checkbox unchecked.
  ✅ Use the native `indeterminate` display state (§8).

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-check` / `.dgo-radio` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `accent-color` | required | Control renders in the UA default colour (un-branded) but stays fully functional — a graceful, safe degradation. |
| `:focus-visible` | required | — |
| Native `indeterminate` | required for the parent-checkbox pattern | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. This family is the **lowest-risk**
row in the matrix — native checkbox/radio semantics have the broadest, oldest AT
support of any control here.

---

## 16 · Open questions

- **Geometry is hardcoded** (`18px` control, `2px`/`2px` focus outline) rather than
  tokenised (§5). A `--dgo-control-size` token (shared with any future native-control
  family) plus `--dgo-focus-outline-w` / `-offset` would bring this family and the
  switch to full token discipline.
- **A fully custom indicator** (bespoke checkmark, animated check) is unshipped and
  intentionally so — the native-control approach pays for itself in correctness and
  forced-colours support (§10). Revisit only if a brand requirement cannot be met
  with `accent-color`.
- **Control-only touch targets.** A checkbox with no adjacent text is an `18px`
  target below the 44px floor (§6); a system utility that pads a bare control to
  the floor would remove the per-consumer workaround.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Native checkbox + radio, `accent-color`-tinted, branded focus outline. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): corrected the "custom indicator" mischaracterisation (the control is native, `accent-color`-tinted, **no** custom indicator), §4 (focus is a **2px** custom outline, not a native 3px ring; **removed the fabricated `opacity 0.55` disabled state** — disabled is native-only), §3 (no density response), and §6 (no padding); documented the native-vs-shipped state split, the indeterminate JS contract, and the forced-colours payoff of the native approach. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
