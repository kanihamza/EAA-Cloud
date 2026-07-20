# `toast` / `snackbar`

> Transient, non-modal status announcements. A toast tells the user something
> happened — a save succeeded, a connection dropped, an action is queued — and
> then disappears. Toasts do **not** block work, do **not** demand attention,
> and do **not** carry decisions. Decisions are modals.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/toast.css`
**Selector namespaces:** `.dgo-toast-region`, `.dgo-toast` (BEM)

---

## 1 · Anatomy

- `.dgo-toast-region` — the **toast container**. One per page. `position: fixed`,
  anchored to `inset-block-end` / `inset-inline-end`. Hosts stacked toasts in
  insertion order. `role="region"` + `aria-label="Notifications"`. The region
  is **always present** in the DOM even when empty.
- `.dgo-toast` — a single toast instance. `role="status"` (default) or
  `role="alert"` (for errors that need immediate AT announcement).
  - leading icon (optional) — `<svg aria-hidden="true">`
  - `__title` (consumer-named) — a short heading line
  - `__body` (consumer-named) — the toast message
  - `__action` (consumer-named) — at most one action button (e.g. "Undo")
  - close button (optional) — icon-only `<button>` at the inline-end

> **Slot naming caveat.** The shipped CSS styles only `.dgo-toast` and the
> region — it does **not** define `__title`, `__body`, `__action`, `__close`
> selectors. Those are recommendations for consumer markup; the shipped styles
> use flex `gap` and `align-items: flex-start` to lay them out. See §16.

### Slot policy

| Slot | Allowed content |
|---|---|
| Body text | 1–2 sentences. Past-tense fact for success ("Submitted."); plain statement + next step for errors. See §10-content-voice §5. |
| Action button | At most **one**. Used for the 5–8 second Undo window. Not a menu. |
| Close button | `aria-label="Dismiss"`. Optional but recommended for non-auto-dismissing toasts (errors). |

---

## 2 · Variants

The shipped CSS ships **no severity variants** — there is no
`.dgo-toast--success`, `.dgo-toast--danger`, `.dgo-toast--info`. Every toast
looks the same: white raised surface, default border, overlay shadow.

Severity is communicated by **icon + copy**, not by colour, in the current
shipped set. This is consistent with NITDA's restrained visual register; it
is also a known gap for high-frequency operator surfaces where colour-coded
toasts speed scanning. See §16.

If your surface needs severity colour-coding today, lift the colour from a
sibling `.dgo-alert` component (which **does** ship severity variants —
`--info`, `--success`, `--warning`, `--danger`) and apply equivalent treatment
to `.dgo-toast` inline. Document the override in your page's design notes
until v2.1 ships the variants.

---

## 3 · Sizes & density

The toast ships **one size**.

| Measure | Resolved |
|---|---:|
| Max inline-size | `380px` (on the region) |
| Padding | `var(--dgo-s-4)` (16px) |
| Gap between toasts | `var(--dgo-s-3)` (12px) |
| Internal gap (icon ↔ content) | `var(--dgo-s-3)` (12px) |
| Region offset from viewport edge | `var(--dgo-s-6)` (24px) inset-block-end + inset-inline-end |

### Density behaviour

Toasts do **not** re-bind under `[data-density="compact"]`. Density affects
*workspace* surfaces; toast chrome stays comfortable for at-a-glance reading
regardless of density.

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Entering | (on mount) | `animation: dgo-toast-in var(--dgo-motion-enter)` — fades from `opacity: 0` and translates `translateY(8px)` to rest | mount |
| Resting | — | Default appearance | — |
| Dismissing | (consumer-added class, e.g. `[data-state="closing"]`) | Reverse the entrance under `--dgo-motion-exit`. **Not in shipped CSS** — consumer adds | data |
| Action-button focus | `.dgo-toast button:focus-visible` | `--dgo-focus-ring` via base.css | keyboard |
| Pointer over toast | `.dgo-toast:hover` | No visual change shipped. Consumer JS should **pause the auto-dismiss timer** | mouse |
| Focus inside toast | (consumer-detected `focusin`) | No visual change. Consumer JS should pause the auto-dismiss timer | keyboard |

### What the shipped CSS does NOT include

- An exit animation. The toast appears with `dgo-toast-in`; removing it from
  the DOM is the consumer's responsibility, with whatever exit treatment they
  prefer. Track for §16.
- A progress-bar countdown showing remaining time. Some toast libraries
  include this; the shipped CSS does not.
- A "view all notifications" affordance when many toasts stack. The region
  caps stacking by inserting new toasts above old ones; old toasts dismiss on
  their own timers. If consumers need a notification center, that's a
  separate component.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens

The toast does **not** declare its own `--dgo-toast-*` token block in
`tokens.component.css`. It reads semantic tokens directly. See §14.

### Tier 2 — Semantic tokens (read directly)

- `--dgo-color-surface-raised` (toast background)
- `--dgo-color-border-default` (toast border; HC re-binds to black)
- `--dgo-radius-card` (toast border-radius)
- `--dgo-elevation-overlay` (toast shadow; same lift as popovers)
- `--dgo-z-toast` (region z-index)
- `--dgo-motion-enter` (entrance animation timing)
- `--dgo-s-3`, `--dgo-s-4`, `--dgo-s-6` (spacing)

### Tier 1 — Primitives

**Empty.** All consumption is Tier 2.

---

## 6 · Layout & sizing

### Region

- **Position:** `position: fixed; inset-block-end: var(--dgo-s-6); inset-inline-end: var(--dgo-s-6)`.
  Mirrored automatically under `[dir="rtl"]` — the region appears on the
  screen-start side in RTL because `inset-inline-end` flips.
- **Layout:** `display: flex; flex-direction: column; gap: var(--dgo-s-3)`.
  New toasts insert at the block-start (top of the stack); old toasts dismiss
  from below.
- **Max inline-size:** `380px`. The region itself sizes to its widest child up
  to this cap.
- **Pointer-events:** `pointer-events: none` on the region; `pointer-events: auto`
  on each `.dgo-toast`. This is so the region doesn't block clicks on the page
  beneath when it's empty, but individual toasts remain interactive.

### Toast

- **Inline-size:** intrinsic, bounded by the region's max.
- **Block-size:** intrinsic from content.
- **Layout:** `display: flex; gap: var(--dgo-s-3); align-items: flex-start`.
  Icon at the inline-start; content fills; action and close at the inline-end.
- **Container query:** none.

---

## 7 · Composition

- **Contains:** `<svg>` icons, plain text, at most one `.dgo-btn` (the action),
  at most one icon `.dgo-btn--icon` (the close).
- **Contained by:** Only `.dgo-toast-region`. Toasts never sit in-flow.
- **Conflicts with:**
  - **Toasts opened while a modal is open.** Toasts have a higher z-index
    (`--dgo-z-toast` = 1200 > `--dgo-z-modal` = 1000) — they appear over the
    modal. This is correct: a toast announcing the result of an action inside
    a modal should not be hidden by the modal. But the modal's focus trap
    means a toast action button inside the modal context is **not Tab-
    reachable** without breaking the trap. The shipped guidance: do not put
    action buttons on toasts that fire while a modal is open; let the toast
    auto-dismiss.
  - **Multiple toast regions on one page.** One region per page. Multiple
    regions confuse the AT live-region semantics and stack at different screen
    corners.
  - **A `.dgo-tooltip` anchored to a toast.** Tooltip z (1300) clears toast z,
    so it would appear on top — but the user has milliseconds to interact
    before the toast dismisses. Don't.

---

## 8 · Behaviour (JS contract)

The shipped CSS handles presentation only. Auto-dismiss timing, pause-on-hover,
pause-on-focus, and stacking limits are the consumer's responsibility.

### Lifecycle the consumer must implement

1. **Mount.** Insert the `.dgo-toast` into `.dgo-toast-region`. The entrance
   animation runs automatically.
2. **Timer.** Start an auto-dismiss timer (recommended: 5000–7000ms for
   normal toasts; **never less than 5000ms**; **never auto-dismiss** errors
   with `role="alert"`).
3. **Pause on hover / focus.** When the pointer enters the toast or focus
   moves inside it, **pause the timer**. Resume when both conditions are no
   longer true.
4. **Exit animation.** Add a closing-state class. Wait for `--dgo-motion-exit`
   (150ms). Then unmount.
5. **Focus return.** When a toast with an action button is dismissed by
   button click, focus may stay where it was before the click (the button no
   longer exists). The consumer should restore focus to the element that
   triggered the action (the form's submit button, the row's action). This
   is the same contract as a modal's focus restoration — see `modal.md` §8.

### Attributes the component reads

| Attribute | Carrier | Type | Meaning |
|---|---|---|---|
| `role` | `.dgo-toast` | `"status"` (default) \| `"alert"` (for errors) | Drives live-region politeness. See §10. |
| `data-state` | `.dgo-toast` | `"open" \| "closing"` | Optional — for exit animation. |

### Events the consumer fires

| Event | When | Payload |
|---|---|---|
| `toast:show` | A new toast is mounted | `{ id, severity, message }` |
| `toast:dismiss` | A toast is removed | `{ id, reason: 'timer' \| 'click' \| 'action' \| 'programmatic' }` |
| `toast:action` | The action button is clicked | `{ id, action }` |

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` | Move focus into the toast region (when focus arrives at it via natural tab order) and through any interactive elements inside. **Note:** the region is positioned `fixed`; in source-order tab traversal it may appear early or late depending on its DOM position. The shipped recommendation is to mount the region just before `</body>`. |
| `Esc` (when focus is inside the toast) | Dismiss the toast. Focus returns to the trigger (consumer-implemented; see §8). |
| `Enter` / `Space` on the action button | Activate. Dismiss the toast. |
| `Enter` / `Space` on the close button | Dismiss the toast. |

The toast region itself is **not focusable**. Focus only lands inside via
interactive children.

### Tabbing into a toast — caveat

Most users will never Tab into a toast — toasts are transient, and the user is
focused on whatever action triggered the toast. The keyboard contract exists
for the rare case where the user wants to interact with the action button
(commonly "Undo" within the dismissal window). If your toasts never carry
actions or close buttons, the keyboard contract is functionally moot.

Cross-link: §08 §11.

---

## 10 · ARIA

| Attribute | Carrier | Value | When |
|---|---|---|---|
| `role` | `.dgo-toast-region` | `"region"` | always |
| `aria-label` | `.dgo-toast-region` | `"Notifications"` (translated per locale) | always — disambiguates from other regions |
| `aria-live` | (implicit via child role) | `"polite"` for status, `"assertive"` for alert | per-toast |
| `role` | `.dgo-toast` | `"status"` (default) \| `"alert"` (errors that need immediate announcement) | per-toast |
| `aria-atomic` | `.dgo-toast` | `"true"` | recommended — the whole toast content is read on mount, not just the diff |
| `aria-label` | close `<button>` | `"Dismiss"` | when close button is icon-only |

### Live-region semantics

- **`role="status"`** (the default) → implicit `aria-live="polite"`. The toast
  is announced when the AT user is between phrases. Used for success
  confirmations, info messages, neutral updates.
- **`role="alert"`** → implicit `aria-live="assertive"` and
  `aria-atomic="true"`. Interrupts whatever AT was reading. Used **only**
  for errors that require immediate attention — connection lost mid-save,
  destructive operation failed, security event.

**Default to `role="status"`.** `role="alert"` is hostile if overused; reserve
it for actual emergencies.

### The container is persistent, even when empty

The `.dgo-toast-region` should be in the DOM on every page, even when no toast
is showing. Live regions only announce content that arrives **after** the
region is in the DOM; mounting the region on-demand misses the first toast.

### Forced-colours behaviour

- `--dgo-elevation-overlay` strips. The toast's 1px `--dgo-color-border-default`
  remains (re-bound to `ButtonText` under forced-colors) and separates it
  from the page.
- The translateY entrance still runs (it's a transform, not stripped by
  forced-colors); under reduced motion it's already gone.

### Reduced-motion behaviour

- `dgo-toast-in` collapses to a 50ms cross-fade per §06-motion. No translate.
- Auto-dismiss timers are unaffected — they're not animations.

---

## 11 · Internationalisation

- **Diacritic safety:** body text uses `--dgo-type-body` (inherited; 14px) at
  the global body line-height `--dgo-lh-150`. Cleared for Yorùbá / Hausa /
  Igbo. The toast's `align-items: flex-start` and intrinsic block-size mean
  multi-line stacked-mark content grows the toast vertically without clipping.
- **RTL:** automatic via `inset-inline-end` on the region — the toast region
  flips to the screen-start corner. The toast's flex layout flips icon ↔
  content order. The translateY entrance is gravity-axis (Y), not direction-
  axis, so no mirroring needed.
- **Translation expansion:** the 380px region cap absorbs ~30% Yorùbá
  expansion comfortably. Long messages wrap to additional lines; the toast
  grows vertically. **Do not** truncate toast messages.
- **The region's `aria-label="Notifications"`** must translate. Hard-coding
  the English string here is the most-missed i18n bug in any toast
  implementation; verify per locale.

---

## 12 · Examples

### Basic — success toast

```html
<!-- Persistent at all times -->
<div class="dgo-toast-region" role="region" aria-label="Notifications">
  <!-- Mounted on save -->
  <div class="dgo-toast" role="status" aria-atomic="true">
    <svg aria-hidden="true" width="20" height="20">
      <use href="../../assets/icons/sprite.svg#i-check-circle"/>
    </svg>
    <div>
      <p>Submitted. Reference 24-0193 issued.</p>
    </div>
  </div>
</div>
```

### With action — undo pattern

```html
<div class="dgo-toast" role="status" aria-atomic="true">
  <svg aria-hidden="true" width="20" height="20">
    <use href="../../assets/icons/sprite.svg#i-archive"/>
  </svg>
  <div style="flex: 1">
    <p>Dossier 24-0193 archived.</p>
  </div>
  <button class="dgo-btn dgo-btn--ghost dgo-btn--sm">Undo</button>
</div>
```

### Error — `role="alert"`

```html
<div class="dgo-toast" role="alert" aria-atomic="true">
  <svg aria-hidden="true" width="20" height="20">
    <use href="../../assets/icons/sprite.svg#i-alert-circle"/>
  </svg>
  <div style="flex: 1">
    <p>Could not send. The recipient address is invalid.</p>
  </div>
  <button class="dgo-btn dgo-btn--ghost dgo-btn--icon" aria-label="Dismiss">
    <svg aria-hidden="true" width="16" height="16">
      <use href="../../assets/icons/sprite.svg#i-x"/>
    </svg>
  </button>
</div>
```

### Inside a real page — region at the end of body

```html
<body>
  <main>
    <!-- page content -->
  </main>

  <!-- The region lives just before </body>; always present, populated by JS -->
  <div class="dgo-toast-region" role="region" aria-label="Notifications"></div>

  <script>
    // Consumer toast manager
    function showToast({ message, severity = 'status', action }) {
      // mount .dgo-toast with role=status/alert; start timer; pause on hover/focus
    }
  </script>
</body>
```

---

## 13 · Anti-patterns

- ❌ Auto-dismissing an error toast.
  ✅ Errors must persist until the user dismisses. Pair with `role="alert"`.

- ❌ Toast as a decision surface ("Save changes? [Yes] [No]" as a toast).
  ✅ Decisions are modals (or inline confirms). Toasts announce; they don't
  ask.

- ❌ Toast with multiple action buttons.
  ✅ One action max — typically "Undo". Multiple actions are a modal.

- ❌ Toast displaying form-field errors.
  ✅ Field-level errors live next to the field (see `input.md`). A toast that
  reads "Validation failed" tells the user nothing actionable.

- ❌ Stack of 6+ toasts that the user can't dismiss fast enough.
  ✅ Coalesce: "Saved 6 dossiers" not six separate "Saved" toasts. Apply a
  per-action throttle.

- ❌ `role="alert"` on every toast "to make sure they read it."
  ✅ Use `role="status"` by default. AT users notice polite-live announcements;
  shouting at them with assertive every time trains them to ignore.

- ❌ Toast that auto-dismisses while focus is inside it.
  ✅ Pause the timer when the toast has focus inside it. Otherwise a user
  Tabbing onto "Undo" can't press it before the toast disappears.

- ❌ Hard-coded English `aria-label="Notifications"`.
  ✅ Translate per locale. See §11.

Cross-link: §08 §11; §10-content-voice §5 *Toast*; §12-anti-patterns.

---

## 14 · Migration

`v2.0` is the first shipped version. No migration history.

**Known limitations to address in a future minor:**

| Issue | Fix | Track |
|---|---|---|
| No `--dgo-toast-*` token block | Promote at least `--dgo-toast-w`, `--dgo-toast-pad`, `--dgo-toast-gap` to Tier 3 | v2.1 |
| No exit animation | Add a `[data-state="closing"]` rule reversing `dgo-toast-in` under `--dgo-motion-exit` | v2.1 |
| No severity variants (`--success`, `--danger`, etc.) | Add four variants paralleling `.dgo-alert`'s | v2.1 (high priority) |
| No `__title`, `__body`, `__action`, `__close` BEM selectors | Declare in shipped CSS so consumer markup is stable | v2.1 |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `position: fixed` with logical `inset-inline-end` | required | — |
| `aria-live` regions | required | — |
| `pointer-events: none` on container | required | — |
| `flex` with `gap` | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari — known: VoiceOver may delay or skip
      `role="status"` announcements when other speech is active. `aria-atomic="true"`
      mitigates.
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android) — TalkBack treats `role="alert"` aggressively;
      use only for true emergencies.

`[NITDA DS team: confirm AT test matrix funding]`.

---

## 16 · Open questions

- **Severity variants** — see §14. The single biggest gap. Operator surfaces
  scan a stack of toasts by colour; the current monochrome treatment slows
  triage.
- **Toast positioning.** Currently inset-block-end + inset-inline-end (bottom-
  end corner). Some surfaces argue for top-end (more visible during scroll).
  Track a `data-toast-position="top-end"` attribute on the region if a
  second consumer requests it; until then, the corner is locked.
- **Maximum stack height.** Should the region cap at 3 / 5 / N visible toasts
  and queue the rest? Currently unbounded; long-running surfaces accumulate.
- **Notification center.** Persistent log of past toasts — out of scope for
  the toast component, but a related component that should ship together.
- **Persistent toasts.** Currently every toast is transient. A "you have an
  unsaved change" toast that stays until the change is saved is a real case;
  is it a different component (banner) or a `data-persistent="true"` toast?

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. One size, no severity variants, entrance animation only. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[notifications platform team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
