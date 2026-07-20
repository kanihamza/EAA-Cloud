# 12 · Anti-Patterns

> **Two or more concrete ❌/✅ pairs for every shipped component family.** These are the
> mistakes that actually recur in DGO product code — caught in review, in QA, or after
> ship. Every counter-example uses the v2.0 tokens and component classes.

Anti-patterns sit on top of the rules in `02-color.md`, `04-spacing-grid.md`,
`06-motion.md`, `08-accessibility.md`, and `10-content-voice.md`. Where a pattern
violates one of those docs, the violated section is named.

---

## 1 · Button

❌ **Two primary buttons in one composition.**

```html
<button class="dgo-btn dgo-btn--primary">Save and close</button>
<button class="dgo-btn dgo-btn--primary">Save</button>
```

A primary button declares the **one** preferred action for the surface. Two primaries
make the user choose between equally-weighted commitments.

✅ **Primary for the recommended action; secondary for alternatives.**

```html
<button class="dgo-btn dgo-btn--primary">Save and close</button>
<button class="dgo-btn dgo-btn--secondary">Save</button>
```

---

❌ **Destructive action styled as a secondary button.**

```html
<button class="dgo-btn dgo-btn--secondary">Delete file</button>
```

Destructive actions need their own colour signal — and a confirmation step, which is
the modal's job, not the button's.

✅ **`dgo-btn--danger`, paired with a confirmation modal for irreversible work.**

```html
<button class="dgo-btn dgo-btn--danger" data-confirm="delete-file">Delete file</button>
```

---

❌ **Icon-only button without `aria-label`.**

```html
<button class="dgo-btn dgo-btn--ghost">
  <svg class="dgo-icon"><use href="…#i-trash"/></svg>
</button>
```

The button has no accessible name. Screen readers announce "button" with no purpose.
See §08-accessibility.

✅ **`aria-label` carries the name; the SVG is `aria-hidden`.**

```html
<button class="dgo-btn dgo-btn--ghost" aria-label="Delete filing">
  <svg class="dgo-icon" aria-hidden="true"><use href="…#i-trash"/></svg>
</button>
```

---

## 2 · Input / Textarea

❌ **Placeholder used as the label.**

```html
<input class="dgo-input" placeholder="Email address" />
```

Placeholders disappear when typing, fail SC 1.3.5 (Identify Input Purpose), and
read as low-contrast `--dgo-color-fg-subtle` text. See §02-color §1.

✅ **Visible label, placeholder reserved for format hints.**

```html
<label class="dgo-field">
  <span class="dgo-field__label">Email address</span>
  <input class="dgo-input" type="email" placeholder="name@nitda.gov.ng"
         autocomplete="email" />
</label>
```

---

❌ **Error styled only with a red border.**

```html
<input class="dgo-input" aria-invalid="true" style="border-color: var(--dgo-color-danger-strong-bg)" />
```

A red border alone (a) fails the "not by colour alone" rule (§02-color #2) and (b)
tells the user nothing about what went wrong.

✅ **Red border + icon + below-field error message, wired with `aria-describedby`.**

```html
<label class="dgo-field dgo-field--error">
  <span class="dgo-field__label">Reference number</span>
  <input class="dgo-input" aria-invalid="true" aria-describedby="ref-err" />
  <span id="ref-err" class="dgo-field__error">
    <svg class="dgo-icon dgo-icon--sm" aria-hidden="true"><use href="…#i-alert"/></svg>
    Reference numbers are 12 characters, e.g. DGO-2024-000123.
  </span>
</label>
```

---

❌ **Required field marked only with an asterisk and no programmatic signal.**

```html
<span class="dgo-field__label">Department *</span>
<input class="dgo-input" />
```

✅ **Visual asterisk *and* `required` + descriptive `aria-required` semantics.**

```html
<label class="dgo-field">
  <span class="dgo-field__label">
    Department <span aria-hidden="true">*</span>
    <span class="dgo-sr-only">required</span>
  </span>
  <input class="dgo-input" required aria-required="true" />
</label>
```

---

## 3 · Select

❌ **Custom `<div>`-based select that re-implements keyboard handling badly.**

A bespoke combobox is the second-most-common screen-reader regression in the system
audit. Reach for it only when the native control genuinely cannot do the job.

✅ **Use `dgo-select` styling over a native `<select>`.** Native selects inherit OS
keyboard, search-by-keystroke, and screen-reader behaviour for free.

```html
<label class="dgo-field">
  <span class="dgo-field__label">Status</span>
  <div class="dgo-select">
    <select class="dgo-select__field">
      <option value="">Choose status</option>
      <option value="pending">Pending</option>
      <option value="routed">Routed</option>
    </select>
  </div>
</label>
```

---

❌ **Disabled-but-meaningful options with no explanation.**

```html
<option value="archive" disabled>Archive</option>
```

The user can see "Archive" but cannot pick it, and the screen reader announces
"dimmed" with no reason.

✅ **Either remove the option or pair it with a help row that explains why.** If the
option must remain visible for context, switch to a custom listbox where each
disabled row carries its own description.

---

## 4 · Checkbox / Radio

❌ **Radio used for a Yes/No toggle that takes effect immediately.**

Radios are for picking 1 of N within a stable set. A boolean toggle that applies
immediately is a switch.

✅ **`dgo-switch` for instant settings; `dgo-radio` for mutually-exclusive selections inside a form that will be submitted.**

```html
<!-- Settings panel -->
<div class="dgo-switch">
  <input id="email-on" type="checkbox" role="switch" />
  <label for="email-on">Email notifications</label>
</div>

<!-- Form -->
<fieldset class="dgo-radio-group">
  <legend>Routing priority</legend>
  <label><input type="radio" name="priority" value="standard"/> Standard</label>
  <label><input type="radio" name="priority" value="urgent"/> Urgent</label>
</fieldset>
```

---

❌ **Group of related checkboxes with no `<fieldset>` / `<legend>`.**

```html
<span>Notification types</span>
<input type="checkbox"/> Email
<input type="checkbox"/> SMS
<input type="checkbox"/> In-app
```

Screen readers don't connect the heading to the checkboxes.

✅ **`<fieldset>` groups the controls; `<legend>` names them.**

```html
<fieldset>
  <legend>Notification types</legend>
  <label><input type="checkbox"/> Email</label>
  <label><input type="checkbox"/> SMS</label>
  <label><input type="checkbox"/> In-app</label>
</fieldset>
```

---

## 5 · Switch

❌ **Switch wired to a form that requires Save.**

```html
<form>
  <div class="dgo-switch"><input type="checkbox" role="switch"/> Email me</div>
  <button class="dgo-btn dgo-btn--primary">Save</button>
</form>
```

The switch promises instant effect; the Save button breaks the promise.

✅ **Switch applies on toggle. If a setting needs Save semantics, use a checkbox.**

```html
<label class="dgo-field">
  <input type="checkbox"/>
  Receive a copy of my reply by email
</label>
<button class="dgo-btn dgo-btn--primary">Save preferences</button>
```

---

❌ **Switch label that doesn't say the on-state.**

```html
<div class="dgo-switch">
  <input type="checkbox" role="switch"/>
  <label>Notifications</label>
</div>
```

The user can't predict what "on" will do.

✅ **Label describes what happens when the switch is on.**

```html
<div class="dgo-switch">
  <input type="checkbox" role="switch"/>
  <label>Send a notification when a filing is routed to me</label>
</div>
```

---

## 6 · Search

❌ **Search field that submits on every keystroke without debounce.**

Triggers a server query for every press; bad on mobile and bad on flaky links — and
results flicker as the user types.

✅ **Debounce 250–400 ms (`--dgo-dur-base`/`--dgo-dur-slow`), submit on Enter
immediately, show a spinner while pending.**

---

❌ **Hiding the magnifying-glass icon when the field is focused.**

The icon becomes the only affordance that says "this is search". Hiding it on focus
strips the visual cue at the moment the user needs it most.

✅ **Persist the icon. Show a clear (`×`) affordance only when there is text to clear.**

```html
<div class="dgo-search">
  <svg class="dgo-icon" aria-hidden="true"><use href="…#i-search"/></svg>
  <input class="dgo-search__field" type="search" aria-label="Search filings" />
  <button class="dgo-search__clear" type="button" aria-label="Clear search">×</button>
</div>
```

---

## 7 · Pill / Badge / Tag / Chip

❌ **Using a colour-only pill to convey status.**

```html
<span class="dgo-pill" style="background: var(--dgo-color-danger-strong-bg)"></span>
```

A red dot tells colour-blind users and screen-reader users nothing.

✅ **Pill carries an icon and a text label; colour reinforces, doesn't carry.**

```html
<span class="dgo-pill dgo-pill--action">
  <svg class="dgo-icon dgo-icon--sm" aria-hidden="true"><use href="…#i-alert"/></svg>
  Action required
</span>
```

---

❌ **Same pill style used for different concepts on one page** (status, count, filter).

The user can't tell what a pill *means* without re-reading every instance.

✅ **`dgo-pill` for operational status, `dgo-badge` (round, numeric) for counts,
`dgo-tag` (square, sharp) for filterable taxonomies, `dgo-chip` (with × clear) for
applied filters.** The shapes are different on purpose.

---

## 8 · Avatar

❌ **Avatar with bare initials and no `aria-label` of the full name.**

```html
<div class="dgo-avatar">AO</div>
```

Screen readers say "AO" — useless.

✅ **Initials visible; full name as the accessible label and/or `<title>`.**

```html
<span class="dgo-avatar" role="img" aria-label="Adamu Olawale">
  <span aria-hidden="true">AO</span>
</span>
```

---

❌ **Stacking more than 5 avatars without a `+N` overflow chip.**

```html
<!-- 12 avatars rendered, overlapping into a smear -->
```

✅ **Cap at 4 visible + one `+N more` chip.** The chip is keyboard-reachable and
opens a full list.

```html
<div class="dgo-avatar-stack">
  <span class="dgo-avatar">AO</span><span class="dgo-avatar">FN</span>
  <span class="dgo-avatar">CI</span><span class="dgo-avatar">BO</span>
  <button class="dgo-avatar dgo-avatar--more" aria-haspopup="dialog">+8</button>
</div>
```

---

## 9 · Card

❌ **Card with hover lift and no link/button — purely decorative motion.**

```html
<article class="dgo-card dgo-card--interactive">…</article>
```

If the card lifts on hover but isn't clickable, the lift is a lie about
interactivity (and a violation of §06-motion #3, "don't promise interaction you can't
deliver").

✅ **Either drop the hover state, or wrap the card in `<a>` / `<button>` and let the
whole card be the hit target.** Then the lift means what it says.

---

❌ **Three nested cards (card inside card inside card).**

The grouping logic stops reading. By the third level the user has lost the original
scope.

✅ **Maximum two levels: a section card containing item cards.** Deeper hierarchy
needs a different pattern — a tree, a list with subheaders, or a separate page.

---

## 10 · Alert / Banner

❌ **Permanent danger alert at the top of every page.**

The user habituates after the third page-load and stops seeing the bar. The signal
is wasted when something actually goes wrong.

✅ **Alerts appear when their condition holds; disappear when resolved.** Use
`dgo-alert--info` for persistent informational state (e.g. "You're viewing a draft");
use `dgo-alert--danger` only when there's a recovery action.

---

❌ **Alert with no recovery action.**

```html
<div class="dgo-alert dgo-alert--danger">
  <p>Your submission failed.</p>
</div>
```

✅ **Alert states what's wrong, what the user can do, and how to do it.**

```html
<div class="dgo-alert dgo-alert--danger" role="alert">
  <svg class="dgo-icon" aria-hidden="true"><use href="…#i-alert"/></svg>
  <div>
    <p class="dgo-alert__title">Submission failed</p>
    <p>The reference number you entered isn't on the routing list. Check it against the dispatch email and try again.</p>
    <button class="dgo-btn dgo-btn--secondary dgo-btn--sm">Retry submission</button>
  </div>
</div>
```

---

## 11 · Toast / Snackbar

❌ **Toast used for a critical error.**

```html
<div class="dgo-toast dgo-toast--danger">Payment failed</div>
```

Toasts time out. Critical errors must not.

✅ **Toast for confirmations and reversible state; banner/alert for critical errors.**

```html
<!-- Reversible operation -->
<div class="dgo-toast dgo-toast--success" role="status">
  Filing archived
  <button class="dgo-btn dgo-btn--ghost dgo-btn--sm">Undo</button>
</div>
```

---

❌ **Multiple toasts stacked, each blocking the next.**

✅ **One toast at a time. Queue further messages; never stack more than 1 visible.**
Long-running operations belong in a progress region, not a toast queue.

---

## 12 · Modal / Drawer

❌ **Modal without focus trap.**

A user `Tab`-ing inside the modal lands on a control behind the backdrop. The page
scrolls under the modal. The Esc key does nothing.

✅ **Open: move focus to the first focusable element inside the dialog; trap Tab
inside until close; Esc closes; return focus to the trigger.** This is the
`08-accessibility` modal contract — the shipped `dgo-modal` JS already does it; if
you re-implement, match the contract.

---

❌ **Modal with three primary buttons.**

```html
<button class="dgo-btn dgo-btn--primary">Save</button>
<button class="dgo-btn dgo-btn--primary">Save and continue</button>
<button class="dgo-btn dgo-btn--primary">Save and close</button>
```

The modal asks the user to pick between three "yes" answers.

✅ **One primary, one secondary, optional tertiary as `--ghost`.** If you have three
yes-actions, the design is wrong — split into Save (primary) + a menu of
"and continue / and close" sub-actions, or break the flow into steps.

---

❌ **Drawer that auto-dismisses on outside click during data entry.**

The user clicks the page to highlight a value to copy; the drawer closes; their
unsaved work is gone.

✅ **Drawer dismisses on Esc + explicit close button. Outside click only dismisses
on read-only drawers.** A form-bearing drawer asks before closing.

---

## 13 · Sidebar

❌ **Collapsed sidebar where the icons have no tooltips.**

The icon set is not universally legible — `i-shield` and `i-id` look similar at 20×20.
Without tooltips, the collapsed state is a guessing game.

✅ **Collapsed icons carry tooltips and `aria-label`s.** Tooltip on hover/focus,
label on the link so screen readers announce the destination.

```html
<a class="dgo-sidebar__item" href="/access" aria-label="Access control">
  <svg class="dgo-icon"><use href="…#i-shield"/></svg>
  <span class="dgo-sidebar__label">Access control</span>
</a>
```

---

❌ **Sidebar nav with eight top-level items, all expanded by default.**

User can't see the bottom items on a 14" laptop without scrolling the sidebar — and
sidebars that scroll feel broken.

✅ **Five top-level items. Group the rest under collapsible sections. Collapsed by
default; the active section opens.** If you genuinely need ≥ 8, you have an IA
problem; do not solve it by stacking links.

---

## 14 · Topbar

❌ **Topbar that scrolls with the page.**

The topbar carries persistent identity (logo, agency name, signed-in user). It must
stay anchored.

✅ **`position: sticky; top: 0;` with `z-index: var(--dgo-z-fixed)`.** Shipped
`.dgo-topbar` already does this — don't override.

---

❌ **Putting application primary actions inside the topbar.**

The topbar is global chrome. "New filing" is contextual — it belongs on the screen
that owns the action, not on every page in the app.

✅ **Topbar holds: brand mark, search (if global), notifications, user menu. Page
actions live on the page.**

---

## 15 · Tabs

❌ **Tabs that change the URL but reset scroll position.**

User reads halfway down a tab, clicks the next tab, comes back, finds themselves at
the top.

✅ **Tab activation preserves per-tab scroll position.** Easiest with a
`scrollTop` map keyed by tab id, restored on activate.

---

❌ **Horizontal tabs with > 5 items on a narrow viewport, truncated with `...`.**

Truncation hides the rest of the navigation behind a mystery menu.

✅ **Above 5, switch to a `<select>` on viewports below `--dgo-bp-md`, or to a vertical
tab list above it.** The shipped `dgo-tabs` exposes a `data-overflow="scroll|select"`
attribute for this — use it.

---

## 16 · Breadcrumb

❌ **Breadcrumb with a clickable current page.**

```html
<a href="/filings/123">Filing #123</a>
```

The user is already there; clicking does nothing or reloads.

✅ **Current page is `aria-current="page"` and not a link.**

```html
<nav aria-label="Breadcrumb">
  <ol class="dgo-breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/filings">Filings</a></li>
    <li><span aria-current="page">Filing #123</span></li>
  </ol>
</nav>
```

---

❌ **Breadcrumb that goes seven levels deep.**

If you need seven crumbs, the IA is wrong.

✅ **Maximum five visible crumbs. Collapse the middle into a `…` menu disclosing the
hidden levels.**

---

## 17 · Stepper / Pagination

❌ **Stepper that lets the user click ahead past unfilled required fields.**

The promise of "step 3 of 4" implies linear validation. Clicking ahead and getting
an error on step 4 is a violated promise.

✅ **Steps ahead of the current step are unclickable until prerequisites pass; steps
behind are clickable for edit; current step shows `aria-current="step"`.**

---

❌ **Pagination with only "next" / "previous" — no page numbers, no total.**

The user has no sense of position or magnitude.

✅ **Numbered pages with sensible truncation, `Showing 21–40 of 482` count, jump-to-first / jump-to-last.**

```html
<nav class="dgo-pagination" aria-label="Pagination">
  <button aria-label="First page">«</button>
  <button aria-label="Previous page">‹</button>
  <button>1</button><button aria-current="page">2</button><button>3</button>
  <span>…</span><button>25</button>
  <button aria-label="Next page">›</button>
  <button aria-label="Last page">»</button>
</nav>
<p class="dgo-pagination__count">Showing 21–40 of 482</p>
```

---

## 18 · Table / Data Grid

❌ **Sortable column with no caret indicator.**

The column header sorts on click, but nothing on screen says it's sortable. The user
discovers the behaviour by accident.

✅ **Sortable headers carry a caret; the current sort direction is shown by caret
orientation + `aria-sort`.**

```html
<th aria-sort="ascending">
  Filed on
  <svg class="dgo-icon dgo-icon--sm" aria-hidden="true"><use href="…#i-arrow-up"/></svg>
</th>
```

---

❌ **Row hover that changes background colour but no other state cue, used as a
selection signal.**

The user moves the cursor, three rows light up sequentially — and they have no idea
which one they actually "selected".

✅ **Hover is purely visual; selection is a click and is rendered with a leading
checkbox and a sticky-row colour.** Row click can open detail; row check selects.

---

❌ **Dense table with `text-align: center` on numeric columns.**

Decimal points fail to align; eyes lose place; comparison gets harder.

✅ **Numeric columns are right-aligned with `font-variant-numeric: tabular-nums`
(`.dgo-tnum`).**

---

## 19 · Tooltip / Popover

❌ **Tooltip that holds the only copy of important information.**

Hover-only on desktop, lost entirely on touch. Required information must be
discoverable without hover.

✅ **Tooltips are progressive enhancement of an already-visible label, or carry
descriptive text only.** Required info ships in the visible UI.

---

❌ **Popover that opens on hover and disappears when the user tries to reach a
button inside it.**

✅ **Popover opens on click, dismisses on Esc / outside click / explicit close.
Hover-opened popovers are reserved for read-only, no-interactive-content cases.**

---

## 20 · Menu / Dropdown

❌ **Dropdown that opens on hover and doesn't survive a 200 ms gap.**

The user slides the cursor diagonally; the menu disappears.

✅ **Click to open. Keyboard: Enter/Space to open, Up/Down to move, Esc to close.
First item is focused on open; first letter jumps to matching item.**

---

❌ **Menu items with hidden destructive actions next to benign ones.**

```html
<button class="dgo-menu__item">Open</button>
<button class="dgo-menu__item">Duplicate</button>
<button class="dgo-menu__item">Delete</button>  <!-- same row visual weight -->
```

✅ **Destructive items live below a divider and use `dgo-menu__item--danger`
(red text). They confirm before executing.**

---

## 21 · Empty / Error / Onboarding State

❌ **Empty state that says "No data."**

No data, no reason, no next step.

✅ **State carries: a glyph (or illustration), a one-sentence reason, a single
recovery action.**

```html
<div class="dgo-empty-state">
  <svg class="dgo-empty-state__art"><use href="…#i-folder"/></svg>
  <h2>No filings routed to you</h2>
  <p>When a colleague routes a filing here, it'll appear in this view.</p>
  <button class="dgo-btn dgo-btn--secondary">Browse all filings</button>
</div>
```

---

❌ **Onboarding state that doesn't disappear once the user has data.**

The hint stays. The user grows resentful.

✅ **Empty / onboarding / error states are mutually exclusive and visible only
under their condition.**

---

## 22 · Progress / Spinner

❌ **Spinner shown for an operation that takes < 200 ms.**

The spinner flashes — visual noise.

✅ **Defer the spinner until 200 ms have elapsed. Below that, no indicator.**
Between 200 ms and 1 s, a spinner. Above 1 s for an operation with knowable progress,
a determinate progress bar.

---

❌ **Determinate progress bar that stalls at 95% for the last 80% of the operation.**

The bar is a lie about position. The user loses trust.

✅ **Progress bar moves with the actual measurable progress. If progress is
unknowable, switch to indeterminate, not a fake percentage.**

---

## 23 · Skeleton

❌ **Skeleton block whose dimensions don't match the loaded content's dimensions.**

Layout reflows on data arrival; the page jumps; clicks land on the wrong place.

✅ **Skeleton matches the loaded content's box geometry. A 48 px row stays a 48 px
row; a 24 px avatar stays 24 px.**

---

❌ **Skeleton with strong animation visible for > 2 seconds.**

The user infers something is broken. Long loads belong to a different pattern
(empty state with retry, status callout).

✅ **Skeleton for < 1 s; switch to a status message above that. Always honour
`prefers-reduced-motion` and remove the shimmer.**

---

## 24 · Metric / Stat Tile

❌ **Stat tile showing a number with no comparator.**

```html
<div class="dgo-metric"><h3>Filings today</h3><p>247</p></div>
```

Is 247 good? Bad? Trend?

✅ **Number + comparator (vs yesterday, vs last week, target). Use the trend
treatment and a sparkline where space allows.**

```html
<article class="dgo-metric">
  <h3 class="dgo-metric__label">Filings today</h3>
  <p class="dgo-metric__value">247</p>
  <p class="dgo-metric__delta dgo-metric__delta--up">
    <svg class="dgo-icon" aria-hidden="true"><use href="…#i-arrow-up"/></svg>
    12% vs yesterday
  </p>
</article>
```

---

❌ **Six metric tiles in a row, all using the brand primary green for the headline number.**

The eye can't pick a focus. The visual hierarchy says "everything is the most
important thing".

✅ **At most one metric per row carries an emphasis colour. The rest use
`--dgo-color-fg-default`.** If everything matters equally, the metric grid isn't the
right pattern.

---

## 25 · Kbd / Code

❌ **Keyboard shortcut rendered as plain text inside a paragraph.**

```html
<p>Press Ctrl+S to save.</p>
```

The shortcut doesn't stand out; visual scanners skip it.

✅ **`<kbd>` tag, styled with `dgo-kbd`.**

```html
<p>Press <kbd class="dgo-kbd">Ctrl</kbd>+<kbd class="dgo-kbd">S</kbd> to save.</p>
```

---

❌ **Inline code rendered in the body family.**

Code identifiers (`DGO-2024-000123`) lose their tabular character; `0`s and `O`s are
hard to distinguish.

✅ **`<code>` + `dgo-code` for inline; `--dgo-family-mono` is bound automatically.**

```html
<p>Reference: <code class="dgo-code">DGO-2024-000123</code></p>
```

---

## 26 · Filter Bar / Bulk-Action Bar

❌ **Filter bar that re-queries on every keystroke without showing what's active.**

Results flicker; the user can't tell which filters are applied.

✅ **Applied filters render as chips in the bar; remove via × on each chip; clear-all
present when > 1 chip is set.** Debounce free-text filters; commit
selects/multi-selects on apply.

```html
<div class="dgo-filter-bar">
  <span class="dgo-chip">Status: Pending <button aria-label="Remove">×</button></span>
  <span class="dgo-chip">Routed to: Me <button aria-label="Remove">×</button></span>
  <button class="dgo-btn dgo-btn--ghost dgo-btn--sm">Clear all</button>
</div>
```

---

❌ **Bulk-action bar that floats over content and obscures the row the user just
selected.**

✅ **Bulk-action bar is sticky to the **top** of the table region (under the
header) or the **bottom** of the viewport, with a visible count of selected items
and a Clear selection action. Never floats over the data the user is acting on.**

```html
<div class="dgo-bulk-bar" role="region" aria-label="Bulk actions">
  <span>3 filings selected</span>
  <button class="dgo-btn dgo-btn--secondary dgo-btn--sm">Assign</button>
  <button class="dgo-btn dgo-btn--ghost dgo-btn--sm">Archive</button>
  <button class="dgo-btn dgo-btn--ghost dgo-btn--sm">Clear selection</button>
</div>
```

---

## Cross-cutting anti-patterns

These don't belong to one family but are worth restating here because they recur:

- ❌ Hard-coded hex / px / ms anywhere in a component file.
  ✅ Every value is a `var(--dgo-*)`.
- ❌ Reaching into a primitive token from a component (e.g. `var(--dgo-green-700)`
  inside `dgo-card`).
  ✅ Components consume **semantic** tokens; semantic tokens consume primitives.
- ❌ Animating with the inline `transition: all 0.3s` everyone defaults to.
  ✅ Use `var(--dgo-motion-state)` or one of the named motion intents (§06-motion).
- ❌ Building a one-off variant by adding utility classes in the markup
  (`<button class="dgo-btn" style="background: red">`).
  ✅ If the variant is shipping, declare it as a modifier in the component CSS. If
  it's a one-off, the design is wrong.
- ❌ Adding a new colour, font, or radius for one screen.
  ✅ Use the existing tokens. If they genuinely don't fit, that's an RFC, not a
  divergence (`governance/component-rfc-template.md`).
