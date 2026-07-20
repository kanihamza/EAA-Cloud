# `switch`

> A toggle for a single on/off setting that **commits immediately** — flipping it
> is the action, with no separate Save step. For a boolean that submits later as
> part of a form, use a checkbox (§13). The switch is a styled **native
> `<input type="checkbox">`**: the input stays in the DOM as the focusable,
> AT-readable, form-serialisable control; the visible track and thumb are painted
> by the wrapping `<label>` and a `::before` pseudo-element, wired to the input's
> state through `:has()`.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/switch.css`
**Selector namespace:** `.dgo-switch` (BEM)

---

## 1 · Anatomy

Three parts, two of them painted:

- `<label class="dgo-switch">` — the **track**. `position: relative`,
  `inline-flex`, a fixed `38 × 22 px` pill (`--dgo-r-pill`), `flex-shrink: 0` so it
  never compresses inside a flex row. Its `background` *is* the track colour and is
  the only thing that recolours between off and on.
- `::before` on the label — the **thumb**. An absolutely-positioned `18 × 18 px`
  circle inset `2px` from the start and top edges, filled `--dgo-color-surface-page`
  with a `--dgo-shadow-1` lift. It is the element that translates.
- `<input type="checkbox">` — the **real control**. `position: absolute; inset: 0;
  opacity: 0` — it covers the entire track as an invisible hit-area and keeps full
  keyboard / AT / autofill behaviour. **Never `display: none`** (that would remove
  it from the tab order and the form). An optional visible or visually-hidden text
  label sits alongside.

The track reads the input's checked and focus state with `:has()` — there is no
JS and no state class on the label (see §8).

---

## 2 · Variants

No variants. One size, one shape, one colour pair (off `--dgo-ink-200` → on
`--dgo-color-action-primary`). Emphasis is carried by the on/off state alone, never
by a colour modifier.

---

## 3 · Sizes & density

Single fixed size — `38 × 22 px` track, `18 × 18 px` thumb. **Density has no
effect.** The switch declares no density block and consumes no `--dgo-density-*`
token; its geometry is fixed literals (§5). A control this small keeps one
consistent footprint whether the surrounding page is comfortable or compact.
(Earlier drafts claimed "density adjusts internal padding" — there is no padding
and no density token; corrected 2026-06-05 against the shipped CSS.) See
`docs/04-spacing-grid.md` §"Density".

---

## 4 · States

Every row below is a rule that exists in `switch.css`. States the CSS does **not**
ship are called out explicitly rather than implied.

| State | Selector | Visual change | Driver |
| --- | --- | --- | --- |
| Off | `.dgo-switch` | Track `--dgo-ink-200`; thumb at `inset-inline-start: 2px` | data |
| On | `:has(input:checked)` | Track → `--dgo-color-action-primary`; thumb `translateX(16px)` (RTL: `-16px`) | data |
| Focus | `:has(input:focus-visible)` | `outline: 2px solid var(--dgo-color-border-focus)`; `outline-offset: 2px` — a **2px outline**, not the 3px input-style ring | keyboard |

### Two transitions, both on `--dgo-motion-state`

The track's `background-color` and the thumb's `transform` each transition on
`--dgo-motion-state` (250ms). The thumb slide and the colour wipe run together, so
the toggle reads as one motion. Both collapse under reduced motion (§10).

### Disabled is not shipped

There is **no `:disabled` rule in `switch.css`** — no opacity change, no
`pointer-events`, no cursor change. Because the native input is `opacity: 0`,
setting `disabled` on it produces *no visible effect*. A disabled switch is
therefore an **open gap**, not a styled state (§16). Until it ships, a consumer
needing a disabled switch must style the wrapper itself (e.g. reduced opacity +
`pointer-events: none` on `.dgo-switch`) and set `disabled` on the input for the
semantics. Do not assume the system paints it.

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/switch.css`,
verified against the shipped CSS on 2026-06-05. Tokens reached only through a
component-token's internal chain are documented at their own tier, not duplicated
here._

### Tier 3 — Component tokens (`tokens.component.css`)

**None.** The switch references no component-tier token. (It is the only toggle
control with no `--dgo-switch-*` token namespace — its geometry is hardcoded; see
the exception note below.)

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-action-primary` | On-state track fill |
| `--dgo-color-surface-page` | Thumb fill (reads as white on light, the raised page colour on dark) |
| `--dgo-color-border-focus` | Focus outline colour |
| `--dgo-motion-state` | Track-colour and thumb-transform transition duration |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-ink-200` | warm grey | **Off-state track fill** — read as a primitive directly (there is no semantic "control-track-off" intent token). |
| `--dgo-r-pill` | 999px | Track pill radius |
| `--dgo-shadow-1` | `0 1px 2px …` | Thumb drop shadow |

### Un-tokenised geometry — known

The switch's dimensions are **literals**, contradicting the file header's "every
value is a var()" claim: `38px`/`22px` track, `18px`/`18px` thumb, `2px` thumb
inset, `translateX(16px)` thumb travel, `50%` thumb radius, and the `2px` focus
outline + `2px` offset. The travel value is **derived geometry**, not arbitrary:
`38 (track) − 18 (thumb) − 2 (start inset) − 2 (end inset) = 16px`, so the thumb
lands flush against the trailing inset in the on state. None of this rebinds under
theme or density. A `--dgo-switch-*` token set (track-w, track-h, thumb, travel)
would close the gap — tracked in §16. The off-track also reaches the `--dgo-ink-200`
primitive past the intent tier, the one place this family does so.

---

## 6 · Layout & sizing

- **Inline-size:** fixed `38px`. `flex-shrink: 0` — the switch keeps its width
  inside a crowded settings row rather than squashing.
- **Block-size:** fixed `22px`.
- **Internal spacing:** none — the switch has **no padding**; the thumb is
  absolutely positioned within the track, not laid out by padding. (Earlier drafts
  claimed "uses the component-tier padding tokens listed in §5" — false on both
  counts; corrected 2026-06-05.)
- **Label gap:** if the switch sits beside a text label, the gap is the *parent's*
  layout (e.g. a `.dgo-field` row), not the switch's.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** the native `<input type="checkbox">` and (optionally) a
  visually-hidden or adjacent text label. Nothing else paints inside the track.
- **Contained by:** `.dgo-field` (label + control row), a `.dgo-card` body (a
  settings panel), a `.dgo-table` row (per-row enable toggles).
- **Conflicts with:**
  - **A switch plus a Save button** for the same value — a switch commits
    immediately, so a Save step contradicts its meaning. If the change must be
    staged and submitted, use a checkbox (§13).
  - **A switch with two visible labels ("Off" / "On")** — the position *is* the
    state; redundant dual labels add noise (§13).

---

## 8 · Behaviour (JS contract)

**No JS for the visual.** Off/on, the thumb slide, the colour wipe, and the focus
outline are all driven by `:has()` reading the native input — the consumer only
wires a `change` listener to apply the setting. Because a switch commits on change,
that listener typically performs the side-effect (save the preference, call the
API) immediately rather than waiting for a form submit.

| Responsibility | Owner |
|---|---|
| Toggle visual (track colour, thumb position, focus outline) | CSS (`:has()`) |
| Applying the setting on change | Consumer `change` handler |
| Optimistic / pending state during an async commit | Consumer (`aria-busy` on the label — see §16) |
| Disabled appearance | Consumer (not shipped — §4, §16) |

---

## 9 · Keyboard

Entirely native to the `<input type="checkbox">`:

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Focus in / out — the invisible full-track input is the focus target; the `:has(input:focus-visible)` outline makes the focus visible on the track. |
| `Space` | Toggle off ↔ on. |

No arrow-key handling — a switch is a lone boolean, not a group (contrast the
radio, §`checkbox-radio`).

---

## 10 · ARIA

`role="switch"` is **deliberately not added.** The native
`<input type="checkbox">` is announced as a checkbox, which AT users understand as
on/off; layering `role="switch"` on top risks double-announcement and loses the
form-control semantics. Pair the input with a `<label>` (wrapping or `for=`/`id`).

### Forced-colours behaviour

Under `forced-colors: active` and `[data-theme="hc"]` the track's
`background-color` — the *only* signal distinguishing off from on — may be stripped
by the engine, which would make the two states indistinguishable. The switch has
**no border** to fall back on, so this is a **genuine high-contrast gap**: a
consumer targeting forced-colours environments should add a `1px` `CanvasText`
border and a thumb outline so the state survives. Tracked in §16. (This is the one
family where the standard "elevation falls back to a 1px border" reassurance does
*not* hold — there is nothing in the shipped CSS to fall back to.)

### Reduced-motion behaviour

Both transitions (`background-color`, `transform`, on `--dgo-motion-state`) collapse
to ≤ 50ms under `@media (prefers-reduced-motion: reduce)` — the thumb jumps rather
than slides. The state still changes; only the animation is removed. See
`docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** the switch carries no text of its own; any adjacent label
  uses the consumer's type ramp (`--dgo-lh-150` body) which clears stacked Yorùbá /
  Hausa / Igbo combining marks.
- **RTL:** the thumb travel is mirrored in the CSS —
  `[dir="rtl"] .dgo-switch:has(input:checked)::before { transform: translateX(-16px); }`
  — so the thumb moves toward the reading-end in both directions. The `2px` start
  inset uses `inset-inline-start`, so the off-position follows the writing
  direction automatically.
- **Translation expansion:** not applicable to the control itself (no internal
  text). A long adjacent label wraps in its own container; never truncate it with
  an ellipsis that hides which setting the switch controls.

---

## 12 · Examples

### Basic (visually-hidden label)

```html
<label class="dgo-switch">
  <input type="checkbox" checked>
  <span class="dgo-visually-hidden">Email notifications</span>
</label>
```

### In a settings row with a visible label

```html
<div class="dgo-field" style="flex-direction:row; align-items:center; justify-content:space-between">
  <span class="dgo-label">Route high-priority dossiers to me</span>
  <label class="dgo-switch">
    <input type="checkbox">
    <span class="dgo-visually-hidden">Route high-priority dossiers to me</span>
  </label>
</label>
```

### Pending commit (consumer-managed)

```html
<!-- consumer sets aria-busy while the API call is in flight -->
<label class="dgo-switch" aria-busy="true">
  <input type="checkbox" checked>
  <span class="dgo-visually-hidden">Two-factor authentication</span>
</label>
```

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the
showcase (`index.html`) — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ A switch for a setting that requires **Save** before applying.
  ✅ Use a checkbox — switches commit immediately by definition.
- ❌ A switch with two visible labels ("Off" / "On").
  ✅ The thumb position is the state. Label the *setting*, once.
- ❌ A custom switch drawn without the real `<input>` (or with `display: none` on
  it).
  ✅ Breaks keyboard toggling, AT announcement, and form autofill. Keep the input
  present at `opacity: 0`; style the label and `::before`.
- ❌ Relying on the track colour alone in a high-contrast setting.
  ✅ Add a border for forced-colours environments (§10, §16).

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-switch` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `:has()` | **required** | Drives **both** the checked-state visual **and** the focus outline. Without it the switch never changes appearance — a hard requirement, not a progressive enhancement. All target engines ship it. |
| Logical properties (`inset-inline-start`, RTL `translateX`) | required | — |
| `forced-colors: active` styling | required (with the §10 caveat) | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational. Highest-risk area to verify: whether AT announces the
checkbox-as-toggle clearly without `role="switch"` (the deliberate choice in §10).

---

## 16 · Open questions

- **Disabled state is unshipped.** The CSS paints no disabled appearance and the
  `opacity: 0` input makes the native `disabled` invisible (§4). A
  `.dgo-switch:has(input:disabled)` rule (reduced opacity + `pointer-events: none`)
  would close it. Track at `[NITDA DS team: file v2.x cleanup ticket]`.
- **High-contrast state gap.** With no border, a forced-colours engine that strips
  `background-color` renders off and on identically (§10). A forced-colours border
  rule is needed before this family can claim full HC support.
- **Geometry is hardcoded** (`38/22/18/2/16`), the only toggle without a component
  token namespace (§5). A `--dgo-switch-*` token set would bring it to full
  token discipline and allow a future larger/touch variant.
- **Mid-toggle pending state** ("optimistic on, server confirms later") is not a
  shipped CSS state — the consumer sets `aria-busy="true"` on the wrapping
  `<label>` (§8, §12). A system-owned pending visual could standardise it.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Native checkbox styled as a track + thumb via `:has()`. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): corrected §4 (focus is a **2px outline**, not a 3px ring; **removed the fabricated disabled state** the CSS never shipped), §3 (no density response), and §6 (no padding); documented the `:has()` architecture, the `16px` thumb-travel geometry, the `--dgo-ink-200` off-track primitive, the forced-colours gap, and the hardcoded geometry as a token-discipline exception. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
