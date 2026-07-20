# `modal` / `drawer`

> Two overlay families that share one ARIA contract: a centered **modal** for
> bounded decisions and a slide-in **drawer** for adjunct work. Both are
> `role="dialog" aria-modal="true"` with a focus trap; the difference is
> position and entrance metaphor.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/modal.css`
**Selector namespaces:** `.dgo-modal-backdrop`, `.dgo-modal`, `.dgo-drawer` (BEM)

The two components are documented together because they share their JS contract,
ARIA contract, and 80% of their open questions. Where they diverge — entrance
animation, anchoring, RTL mirroring — the section calls it out.

---

## 1 · Anatomy

### Modal

DOM order, outermost-first:

- `.dgo-modal-backdrop` — full-viewport scrim. `position: fixed; inset: 0`.
  Hosts the click-outside dismissal and visually anchors the modal centered via
  `display: grid; place-items: center`.
- `.dgo-modal` — the dialog body. `role="dialog"`, focus-trapped, `aria-modal="true"`.
  - `.dgo-modal__header` — title row. Title + optional close button.
    - `.dgo-modal__title` — the accessible name target. `aria-labelledby` on
      the dialog references its `id`.
  - `.dgo-modal__body` — scrollable content area. The only part that scrolls;
    header and footer stay pinned.
  - `.dgo-modal__footer` — actions row. Right-aligned via `justify-content: flex-end`;
    flips to start-aligned under RTL automatically (it's logical-property flex,
    not a hard `right`).

### Drawer

- `.dgo-drawer` — edge-anchored panel. Defaults to `inset-inline-end: 0`
  (right under LTR, left under RTL). No backdrop element of its own in shipped
  CSS — consumers wrap with their own backdrop if a scrim is needed. See §13.
  - `.dgo-modal__header`, `.dgo-modal__body`, `.dgo-modal__footer` — drawer
    reuses the modal's internal elements. The `__` namespace is shared by
    design; the *root* is what differs.

### Slot policy

| Slot | Allowed content |
|---|---|
| `__header` | The title + optionally one icon-button (close). No other actions. |
| `__title`  | Plain text. Title Case. Names the decision the modal is asking for — see §10-content-voice §5 *Modal*. |
| `__body`   | Free-form. Paragraphs, lists, forms, alerts. **Not** other dialogs. |
| `__footer` | 1–3 buttons. Secondary on the inline-start; primary (or destructive) on the inline-end. No links. |

---

## 2 · Variants

### Modal

| Class | Description | Use when |
|---|---|---|
| *(default)* | `max-inline-size: var(--dgo-modal-w)` = **560px** | Most decisions. Confirms, simple forms, alerts. |
| `.dgo-modal--lg` | `max-inline-size: var(--dgo-modal-w-lg)` = **800px** | A modal that contains a meaningful form (multi-field) or a table preview. Not for "more content" — if you need more content, the answer is usually a drawer or a full page. |

### Drawer

No variants in the shipped CSS — the drawer is one size (`--dgo-drawer-w` = 400px,
capped at viewport-100% on small screens).

- The drawer always anchors to the **inline-end** of the viewport. Under
  `[dir="rtl"]`, the shipped CSS flips it to `inset-inline-start: 0`.
- A **left-anchored** drawer is not a variant; if you need one, the appropriate
  pattern is a `.dgo-sidebar` (persistent navigation), not a transient drawer.

---

## 3 · Sizes & density

| Container | Token | Default | When to change |
|---|---|---|---|
| Modal default | `--dgo-modal-w` | `560px` | — |
| Modal large   | `--dgo-modal-w-lg` | `800px` | Use `--lg` variant |
| Drawer        | `--dgo-drawer-w` | `400px` | Reserved — consumers do not override per instance |
| Modal max block-size | inline `90vh` | — | Hardcoded in shipped CSS; the `__body` scrolls |

### Density behaviour

The modal and drawer **do not** re-bind under `[data-density="compact"]`. They
are presentation containers; density affects the components *inside* them
(buttons, inputs, list rows), not the chrome.

Internal padding (`--dgo-modal-pad` = `var(--dgo-s-6)` = 24px) is the same in
both densities. Compact-mode modals stay 24px-padded around a denser stack of
form fields.

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Closed | (unmounted) | Modal/drawer not in DOM | data |
| Opening | (mounted; first frame) | Backdrop animates `dgo-fade-in`; modal animates `dgo-modal-in` (translateY 8px → 0 + scale 0.98 → 1); drawer animates `dgo-drawer-in` (translateX 100% → 0; mirrored under RTL). Duration: `--dgo-motion-enter` | mount |
| Open | (mounted; idle) | Rest state. | — |
| Closing | (any state marker the consumer adds, e.g. `[data-state="closing"]`) | Reverse animations on `--dgo-motion-exit` | data |
| Body scrolling | `.dgo-modal__body` `overflow-y: auto` | Scrollbar appears when content overflows 90vh − header − footer | content |
| Background inert | `[inert]` on `<main>` | Background unfocusable, AT-invisible | JS sets it |

The shipped CSS **does not** declare an exit animation. Consumers using the
HTML `<dialog>` element get the browser's default; consumers using a JS-driven
modal should add a closing-state class that reverses the entrance under
`--dgo-motion-exit`.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-modal-radius` | `var(--dgo-radius-frame)` | — |
| `--dgo-modal-pad`    | `var(--dgo-s-6)` (24px) | — (consumed for `__body`/`__footer` padding in shipped CSS; header uses `--dgo-s-5` × `--dgo-s-6`) |
| `--dgo-modal-w`      | `560px` | — |
| `--dgo-modal-w-lg`   | `800px` | — |
| `--dgo-modal-shadow` | `var(--dgo-elevation-modal)` | — |
| `--dgo-drawer-w`     | `400px` | — |

### Tier 2 — Semantic tokens (read directly)

- `--dgo-color-surface-overlay` (the backdrop scrim)
- `--dgo-color-surface-raised` (the modal/drawer body background)
- `--dgo-color-border-default` (the header/footer dividers)
- `--dgo-elevation-modal` (via `--dgo-modal-shadow`; the drawer reads it directly)
- `--dgo-z-modal`
- `--dgo-motion-enter`
- `--dgo-type-h3`, `--dgo-wt-700` (for the title)
- `--dgo-s-2`, `--dgo-s-4`, `--dgo-s-5`, `--dgo-s-6` (spacing)

### Tier 1 — Primitives

**Empty.** Modal and drawer are fully Tier-2/Tier-3.

---

## 6 · Layout & sizing

### Modal

- **Inline-size:** `inline-size: 100%; max-inline-size: var(--dgo-modal-w)`.
  Inside `display: grid; place-items: center` on the backdrop. Centers
  horizontally; the `padding: var(--dgo-s-4)` on the backdrop also functions as a
  minimum gutter on small screens.
- **Block-size:** intrinsic, capped at `90vh`. Below that cap, the modal sizes to
  content. At the cap, `__body` scrolls.
- **Internal layout:** `display: flex; flex-direction: column`. Header and footer
  are intrinsic; body is `1fr`-ish via `overflow-y: auto`.
- **Stacking:** `z-index: var(--dgo-z-modal)` on the backdrop. The modal inherits
  via stacking context.
- **No container query.** Modal width is content-bounded, not container-bounded.

### Drawer

- **Inline-size:** `var(--dgo-drawer-w)` capped at `100vw`. On mobile the drawer
  fills the viewport horizontally.
- **Block-size:** `inset-block: 0` — full-height. No cap.
- **Position:** `position: fixed; inset-inline-end: 0`. Mirrored to
  `inset-inline-start: 0` under `[dir="rtl"]`.
- **Stacking:** `z-index: var(--dgo-z-modal)`. Drawer and modal share a layer; do
  not open both simultaneously — see §7.

---

## 7 · Composition

- **Contains:** `.dgo-btn`, `.dgo-input` / form components, `.dgo-alert`,
  `.dgo-table`, `.dgo-empty-state`, `.dgo-card` (rare — usually unnecessary
  inside a modal), `.dgo-tabs` (for multi-section drawers).
- **Contained by:** Nothing in normal use. Modal and drawer mount to `<body>`
  (or a portal root) to escape transformed ancestors that would break
  `position: fixed`.
- **Conflicts with:**
  - **Two `aria-modal="true"` dialogs open at once.** Hard antipattern. Both
    declare the rest of the page inert; AT can't reconcile which is the
    foreground. If you need a confirm-inside-a-dialog flow, the second
    confirmation should *replace* the first dialog's contents, not stack on
    top.
  - **A drawer opened while a modal is open** (or vice versa). Same reason.
  - **A `.dgo-popover` opened inside a modal.** Permitted, with one caveat: the
    popover's `z-index` (`--dgo-z-popover` = 1100) must exceed the modal's
    (`--dgo-z-modal` = 1000). The shipped tokens already provide this; do not
    override.
  - **A `.dgo-tooltip` inside a modal.** Fine — tooltip z (1300) clears the
    modal layer.
  - **A `.dgo-card`'s own elevation lift inside a modal body.** Drop cards
    inside the modal to `--dgo-elevation-flat`. See §07-elevation §"Lift
    everything inside a modal back down."

---

## 8 · Behaviour (JS contract)

The shipped CSS is presentation only. Focus management and dismissal handling
are the consumer's responsibility. The contract:

### The four-thing checklist (per §08-accessibility §12)

1. **On open:** move focus to the first interactive element inside, or to a
   `tabindex="-1"`-marked heading if the modal is read-only.
2. **Trap Tab:** `Tab` from the last focusable wraps to the first; `Shift+Tab`
   from the first wraps to the last.
3. **On `Esc`:** close. Focus returns to the trigger.
4. **Background `inert`:** set `inert` on the page's `<main>` (or whichever
   landmark holds the rest of the page) on open; remove on close.

### Attributes the component reads

The CSS itself reads no JS-driven state attributes. The consumer's wrapper may
add some for animation choreography:

| Attribute | Carrier | Type | Meaning |
|---|---|---|---|
| `data-state` | `.dgo-modal-backdrop`, `.dgo-drawer` | `"open" \| "closing"` | Optional — only needed for an exit animation. Shipped CSS doesn't reference it; consumers add the closing-state class and the reverse-animation rule. |
| `inert` | `<main>` (sibling) | boolean | Required on open; removed on close. |

### Events the consumer fires

Up to the consumer. The system convention:

| Event | When | Payload |
|---|---|---|
| `modal:open`  | After mount + focus moved | `{ id, source }` |
| `modal:close` | Before unmount | `{ id, reason: 'escape' \| 'backdrop' \| 'action' \| 'programmatic' }` |

### The native `<dialog>` option

If a consumer can use the HTML `<dialog>` element with `dialog.showModal()`, it
provides for free:
- The focus trap.
- `Esc` dismissal.
- The `::backdrop` pseudo-element (you can style it via `dialog::backdrop`
  instead of `.dgo-modal-backdrop`).
- Correct `aria-modal` semantics.

The shipped DGO CSS works both ways. For new code, **prefer `<dialog>`** unless
the SSR / portal architecture can't support it.

### Focus restoration on close

Restore focus to the element that opened the dialog. If that element no longer
exists (e.g. the user's action deleted the row that held the trigger), focus a
sensible neighbour — the next row's primary action, the page heading, or the
nearest `tabindex="-1"` landmark. **Never leave focus on `<body>`** after close
— the next `Tab` will start from the top of the page.

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | **Trapped** inside the dialog. Wraps from last to first and first to last. |
| `Esc` | Close. Focus returns to the trigger. |
| `Enter` on the primary action | Activate the primary button. (Native button behaviour; nothing modal-specific.) |
| Any focus-able key inside the body | Behaves normally for the focused control. |

The dialog **does not** intercept arrow keys, `Home`, `End`, `PageUp`, or
`PageDown` — those are reserved for whatever composite widget has focus
*inside* the modal (a sortable table, a tab strip).

Cross-link: §08 §12.

---

## 10 · ARIA

| Attribute | Carrier | Value | When |
|---|---|---|---|
| `role` | `.dgo-modal`, `.dgo-drawer` | `"dialog"` | always |
| `aria-modal` | `.dgo-modal`, `.dgo-drawer` | `"true"` | always |
| `aria-labelledby` | `.dgo-modal`, `.dgo-drawer` | id of `.dgo-modal__title` | always — the dialog needs an accessible name |
| `aria-describedby` | `.dgo-modal`, `.dgo-drawer` | id of a leading paragraph | optional — when a lead paragraph supplements the title |
| `inert` | the sibling `<main>` landmark | boolean | always while the dialog is open |

### Confirm dialog (the dominant case)

The confirm pattern uses the dialog as a yes-or-no decision surface. ARIA-wise
it's identical to the general modal; copy-wise it follows §10-content-voice §5
*Modal*:

- The title states the decision: "Confirm Withdrawal", not "Are You Sure?".
- The body names the specific consequence with the reference number.
- Buttons are `Cancel` (secondary) + the action verb (primary or danger).

### Forced-colours behaviour

- The backdrop's `--dgo-color-surface-overlay` is `rgba` — under
  `forced-colors: active` it falls back to a system canvas overlay; the system
  is responsible for the visual scrim. The modal still reads correctly because
  it has its own border (added in HC theme).
- The modal's `--dgo-modal-shadow` strips. The HC theme re-binds card / modal
  borders to `#000000` so the modal still separates from the page.
- The drawer's shadow strips identically; the inline-end border becomes the
  separator.

### Reduced-motion behaviour

- `dgo-fade-in` and `dgo-modal-in` collapse to a 50ms cross-fade per §06-motion.
- `dgo-drawer-in` likewise — the drawer doesn't slide; it cross-fades into
  position.
- Backdrop fade is the only persistent transition; the translate + scale on
  modal-in are gone under reduced motion.

---

## 11 · Internationalisation

- **Diacritic safety:** `.dgo-modal__title` is `--dgo-type-h3` (23px) at the
  default heading line-height `--dgo-lh-120` (per §03). Cleared for Yorùbá /
  Hausa / Igbo headings. The body inherits `--dgo-type-body` × `--dgo-lh-150`.
- **RTL — modal:** automatic. The header's `justify-content: space-between` is
  symmetrical; the footer's `justify-content: flex-end` flips with reading
  direction (logical via flex). The 8px translateY on entrance is a physical-
  axis transform — Y is gravity, not direction — so no mirroring needed.
- **RTL — drawer:** the shipped CSS includes the mirror rule:
  ```css
  [dir="rtl"] .dgo-drawer { inset-inline-end: auto; inset-inline-start: 0; }
  ```
  This is the only physical-property pattern in modal.css and it is deliberate.
  The `dgo-drawer-in` keyframe translates from `+100%`; under RTL we *should*
  translate from `-100%` for a visual symmetric slide-in. See §16.
- **Translation expansion:** modal titles wrap at the `--dgo-modal-w` (560px)
  bound. The 90vh body cap absorbs any growth in form-field labels. Long Yorùbá
  titles that wrap to two lines are fine — the title cell at `--dgo-lh-120`
  clears.
- **Mixed-script content** (e.g. an English brand name inside a Yorùbá body)
  uses the Bidi algorithm — see §09 §10.

---

## 12 · Examples

### Basic — confirm modal

```html
<div class="dgo-modal-backdrop" role="presentation">
  <section class="dgo-modal"
           role="dialog"
           aria-modal="true"
           aria-labelledby="m-title-1">
    <header class="dgo-modal__header">
      <h2 id="m-title-1" class="dgo-modal__title">Confirm Withdrawal</h2>
      <button class="dgo-btn dgo-btn--ghost dgo-btn--icon" aria-label="Close">
        <svg aria-hidden="true">
          <use href="../../assets/icons/sprite.svg#i-x"/>
        </svg>
      </button>
    </header>
    <div class="dgo-modal__body">
      <p>This will remove dossier 24-0193 from the active queue.
         It can be restored from the Archive for 30 days.</p>
    </div>
    <footer class="dgo-modal__footer">
      <button class="dgo-btn dgo-btn--secondary" data-modal-close>Cancel</button>
      <button class="dgo-btn dgo-btn--danger">Withdraw Submission</button>
    </footer>
  </section>
</div>
```

### With variants and states — large modal with a form

```html
<div class="dgo-modal-backdrop">
  <section class="dgo-modal dgo-modal--lg"
           role="dialog"
           aria-modal="true"
           aria-labelledby="m-title-2"
           aria-describedby="m-desc-2">
    <header class="dgo-modal__header">
      <h2 id="m-title-2" class="dgo-modal__title">Route to Compliance</h2>
      <button class="dgo-btn dgo-btn--ghost dgo-btn--icon" aria-label="Close">
        <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-x"/></svg>
      </button>
    </header>
    <div class="dgo-modal__body">
      <p id="m-desc-2">Routing dossier 24-0193 to the Compliance Office. The
         desk owner will be notified by email.</p>

      <label class="dgo-label" for="route-note">Note for the desk (optional)</label>
      <textarea class="dgo-textarea" id="route-note" rows="4"
                aria-describedby="route-note-help"></textarea>
      <p id="route-note-help" class="dgo-helper">
        Visible to the Compliance Office and on the audit log.
      </p>
    </div>
    <footer class="dgo-modal__footer">
      <button class="dgo-btn dgo-btn--secondary" data-modal-close>Cancel</button>
      <button class="dgo-btn dgo-btn--primary">Route to Compliance</button>
    </footer>
  </section>
</div>
```

### Drawer — adjunct work without leaving the page

```html
<aside class="dgo-drawer"
       role="dialog"
       aria-modal="true"
       aria-labelledby="d-title-1">
  <header class="dgo-modal__header">
    <h2 id="d-title-1" class="dgo-modal__title">Filter Dossiers</h2>
    <button class="dgo-btn dgo-btn--ghost dgo-btn--icon" aria-label="Close drawer">
      <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-x"/></svg>
    </button>
  </header>
  <div class="dgo-modal__body">
    <!-- Filter form, .dgo-filter-bar, etc. -->
  </div>
  <footer class="dgo-modal__footer">
    <button class="dgo-btn dgo-btn--ghost">Reset</button>
    <button class="dgo-btn dgo-btn--primary">Apply Filters</button>
  </footer>
</aside>
```

### Using the native `<dialog>` element (preferred for new code)

```html
<dialog class="dgo-modal"
        aria-labelledby="m-title-3">
  <header class="dgo-modal__header">
    <h2 id="m-title-3" class="dgo-modal__title">Confirm Withdrawal</h2>
    <form method="dialog">
      <button class="dgo-btn dgo-btn--ghost dgo-btn--icon" aria-label="Close" value="cancel">
        <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-x"/></svg>
      </button>
    </form>
  </header>
  <div class="dgo-modal__body">
    <p>This will remove dossier 24-0193 from the active queue.</p>
  </div>
  <footer class="dgo-modal__footer">
    <form method="dialog">
      <button class="dgo-btn dgo-btn--secondary" value="cancel">Cancel</button>
      <button class="dgo-btn dgo-btn--danger" value="withdraw">Withdraw Submission</button>
    </form>
  </footer>
</dialog>
<script>
  document.querySelector('dialog').showModal();
  // <dialog> provides focus-trap + Esc + ::backdrop for free.
</script>
```

---

## 13 · Anti-patterns

- ❌ A modal opened on page load to announce something. Modals interrupt — they
  are for the *user's* action, not the system's.
  ✅ Use a `.dgo-alert` or a `.dgo-toast` for system-initiated announcements;
  the user can dismiss without losing context.

- ❌ A modal **inside** a modal.
  ✅ Replace the first modal's contents with the second's, or step through with
  a tab strip / stepper inside the same modal. Two stacked dialogs break the
  `inert` contract and confuse focus restoration.

- ❌ A drawer **alongside** an open modal.
  ✅ Close one before opening the other. They share the modal z-layer for a
  reason.

- ❌ Long-form content in a modal ("Terms of Service" 2000-word modal).
  ✅ Either link to a page (preferred), or use a drawer with proper scroll
  position. Modals at `90vh` are usable for *decisions*, not for *reading*.

- ❌ A drawer with its own backdrop **and** no close-on-outside-click.
  ✅ Pick one: drawer-without-backdrop where the rest of the page is still
  usable (Outlook reading-pane pattern), or drawer-with-backdrop where outside-
  click dismisses (filter-bar pattern). Don't show the backdrop without making
  it interactive.

- ❌ `display: none` on the backdrop to "hide" a modal. The modal is still in
  the DOM and AT may still announce it.
  ✅ Unmount the modal entirely, or use the `<dialog>` element which handles this
  natively.

- ❌ Focus moved to the close button on open.
  ✅ Move focus to the **first interactive element of meaningful work** — the
  first form field, or a `tabindex="-1"` heading if the modal is read-only.
  Putting focus on Close trains users to dismiss without engaging.

Cross-link: §12-anti-patterns *"Two `aria-modal` overlays open simultaneously"*;
§07-elevation *"Lift everything inside a modal back down"*; §10-content-voice
§5 *Modal*.

---

## 14 · Migration

`v2.0` is the first shipped version. No migration history.

| From | To | Why | Codemod |
|---|---|---|---|
| — | — | — | — |

**Pending in a future minor:** the drawer's `dgo-drawer-in` keyframe doesn't
have an RTL-mirrored variant. See §16. Adding it is a non-breaking change.

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `position: fixed` with `inset: 0` | required | — |
| Logical properties (`inset-inline-end`, `border-inline-start`) | required | — |
| `inert` attribute on `<main>` | required | WICG `inert` polyfill where unsupported. The shipped CSS doesn't assume polyfill presence; the consumer wires it. |
| HTML `<dialog>` element | optional (preferred) | The `.dgo-modal-backdrop` + `.dgo-modal` pattern works in any browser. |
| `dialog::backdrop` | optional | Fall back to the explicit `.dgo-modal-backdrop` element. |
| `forced-colors: active` styling | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome — note: legacy JAWS versions announce `aria-modal="true"` as
      "dialog" but may not isolate the user from the inert background; confirm
      with the consumer's audience.
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`.

---

## 16 · Open questions

- **RTL drawer entrance.** Shipped `dgo-drawer-in` translates from `+100%`.
  Under `[dir="rtl"]` the drawer anchors to the left, so the entrance should
  translate from `-100%`. Add `[dir="rtl"] .dgo-drawer { animation-name:
  dgo-drawer-in-rtl; }` + the keyframe. Non-breaking. Track for v2.1.
- **Exit animation.** Shipped CSS has none. Recommended addition: a
  `[data-state="closing"]` selector that re-runs the entrance keyframe in
  `reverse` under `--dgo-motion-exit`. Currently consumers add this themselves;
  promoting to the shipped CSS would reduce variance.
- **Backdrop click-out dismissal.** Some consumers want it; some don't (mid-
  edit forms). Convention should be a `data-dismiss-on-backdrop="true"` attribute
  on `.dgo-modal-backdrop`. Promote when the second consumer asks.
- **Stacked dialogs.** Currently a hard antipattern. There are legitimate cases
  (a confirmation inside a multi-step flow) where stacked feels right but isn't
  — they're better as in-place replacement. Document the in-place replacement
  pattern with a worked example before v2.2.
- **Drawer with no `aria-modal`.** A non-modal drawer (Outlook reading-pane;
  doesn't block the rest of the page) is a different component, semantically.
  Currently the shipped drawer is modal. Consider a `.dgo-drawer--inline`
  variant with `aria-modal="false"` and no focus trap.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Modal (default + `--lg`) and drawer (single variant, RTL-mirrored anchor). Shared header / body / footer elements. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[modal — foundations team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
