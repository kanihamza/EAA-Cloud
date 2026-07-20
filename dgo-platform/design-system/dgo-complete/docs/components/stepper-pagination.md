# `stepper-pagination`

> Two navigation siblings sharing one file. **`.dgo-stepper`** shows a user where
> they are in a *known, ordered, multi-step process* (Draft → Review → Submit) —
> progress through a finite sequence. **`.dgo-pagination`** moves a user through a
> *long list, one page at a time* — random access to numbered pages. They pair in
> the file because both are horizontal rows of position-markers, but they answer
> different questions: the stepper says "how far along am I?"; pagination says
> "which page am I on, and how do I jump?"

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/stepper-pagination.css`
**Selector namespace:** `.dgo-stepper` · `.dgo-pagination` (BEM)

---

## 1 · Anatomy

### Stepper

- `.dgo-stepper` — the row. `flex; align-items: center; gap: var(--dgo-s-3)`.
- `.dgo-stepper__step` — one step. `flex; align-items: center; gap: var(--dgo-s-2)`;
  `--dgo-type-body-sm`; rest colour `--dgo-color-fg-muted`. Carries
  `data-state="current"` or `data-state="done"` — **`upcoming` is the unstyled
  default** (there is no `data-state="upcoming"` selector; an unmarked step *is*
  upcoming).
- `.dgo-stepper__bullet` — the `28 × 28 px` circle (`border-radius: 50%`) holding a
  number or a check glyph (the glyph is consumer content, not drawn by the CSS).
- `.dgo-stepper__line` — the connector between two steps. `flex: 1`, `2px` tall.

### Pagination

- `.dgo-pagination` — the row. `inline-flex; align-items: center; gap: var(--dgo-s-1)`.
- `.dgo-pagination__btn` — one page button. Square-ish (`min-inline-size` and
  `block-size` both `--dgo-pagination-h`), `--dgo-pagination-radius`,
  `--dgo-type-body-sm` at `--dgo-wt-500`. The current page carries
  `aria-current="page"`; prev/next-at-the-ends carry `disabled`.

---

## 2 · Variants

No CSS variants on either component — **state attributes carry every visual
difference**. A stepper step's appearance is its `data-state`; a pagination
button's appearance is `aria-current` / `:disabled` / `:hover`. There is no
`--primary`, `--lg`, etc.

---

## 3 · Sizes & density

Single size each. **Density has no effect.** Neither component declares a density
block; the bullet (`28px`), the pagination button (`--dgo-pagination-h`, a *fixed*
component token that does **not** rebind in `tokens.density.css`), and all gaps
(fixed `--dgo-s-*` primitives) keep one footprint across comfortable and compact.
(Earlier drafts claimed "density adjusts internal padding" — there is no density
token in this family; corrected 2026-06-05.) See `docs/04-spacing-grid.md`
§"Density".

---

## 4 · States

### Stepper — driven by `data-state` on `.dgo-stepper__step`

| State | Selector | Bullet | Step text |
| --- | --- | --- | --- |
| Upcoming (default) | *(no attribute)* | `--dgo-color-surface-sunken` fill, `--dgo-color-fg-muted` glyph, 1px `--dgo-color-border-default` | `--dgo-color-fg-muted` |
| Current | `[data-state="current"]` | `--dgo-color-action-primary` fill, `--dgo-color-fg-on-brand` glyph, primary border | `--dgo-color-fg-default` |
| Done | `[data-state="done"]` | `--dgo-color-action-accent` fill, `--dgo-color-fg-on-accent` glyph, accent border | `--dgo-color-fg-default` |

**Current is brand green; done is accent (Smart Green) — they are different
colours, deliberately.** The current step draws attention with the primary action
colour; completed steps recede into the accent that the system reserves for
"resolved / approved" moments. (Earlier drafts swapped these — corrected
2026-06-05.)

### The connector line propagates completion

`.dgo-stepper__step[data-state="done"] + .dgo-stepper__line` turns
`--dgo-color-action-accent`. So the line *trailing a completed step* fills with
accent while lines ahead of the current step stay `--dgo-color-border-default`
grey — the row reads as a progress fill, not just a set of independent bullets.
This is the single most important visual in the stepper and it is pure CSS, no JS.

### Pagination — driven by attributes on `.dgo-pagination__btn`

| State | Selector | Visual |
| --- | --- | --- |
| Default | `.dgo-pagination__btn` | Transparent fill, transparent 1px border, `--dgo-color-fg-default` text. |
| Hover | `:hover` | Fill → `--dgo-color-surface-sunken`. |
| Current | `[aria-current="page"]` | Fill → `--dgo-color-action-primary`, text → `--dgo-color-fg-on-brand`. |
| Disabled | `:disabled` | Text → `--dgo-color-fg-disabled`; `cursor: not-allowed`. |

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in
`styles/components/stepper-pagination.css`, verified against the shipped CSS on
2026-06-05. Tokens reached only through a component-token's internal chain are
documented at their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Used for |
|---|---|
| `--dgo-pagination-h` | Pagination button `min-inline-size` **and** `block-size` (square target). Fixed — does not rebind under density. |
| `--dgo-pagination-radius` | Pagination button corner radius. |

(The **stepper** uses no component token — its bullet and line geometry are
hardcoded; see the exception note.)

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-action-primary` | Current stepper bullet; current pagination button |
| `--dgo-color-action-accent` | Done stepper bullet **and** the trailing connector line |
| `--dgo-color-fg-on-brand` | Glyph/text on the primary fills |
| `--dgo-color-fg-on-accent` | Glyph on the accent (done) bullet |
| `--dgo-color-fg-default` | Active step text; default pagination text |
| `--dgo-color-fg-muted` | Upcoming step text and bullet glyph |
| `--dgo-color-fg-disabled` | Disabled pagination button |
| `--dgo-color-surface-sunken` | Upcoming bullet fill; pagination hover fill |
| `--dgo-color-border-default` | Bullet border; default connector line |
| `--dgo-type-body-sm` | Step text, bullet glyph, pagination button — all 12px |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-s-1` | 4px | Pagination row gap |
| `--dgo-s-2` | 8px | Step internal gap; pagination button inline padding |
| `--dgo-s-3` | 12px | Stepper row gap |
| `--dgo-wt-600` | semibold | Bullet glyph weight |
| `--dgo-wt-500` | medium | Pagination button weight |

### Un-tokenised geometry — known

The stepper's `28px` bullet, its `50%` radius, the `2px` connector-line height and
its `2px` radius, and the `1px` bullet border are **literals**, contradicting the
file header's "every value is a var()". A `--dgo-stepper-bullet` / `-line` token set
would close the gap and let the bullet scale — tracked in §16. Pagination, by
contrast, is fully tokenised (`--dgo-pagination-h` / `-radius`).

---

## 6 · Layout & sizing

- **Stepper inline-size:** intrinsic; the `flex: 1` connector lines stretch to fill
  whatever width the consumer's container provides, so steps distribute evenly
  across the row.
- **Pagination inline-size:** intrinsic — `inline-flex`, sized to its buttons.
- **Block-size (both):** intrinsic — the bullet height (28px) for the stepper, the
  `--dgo-pagination-h` button for pagination.
- **Internal spacing:** stepper gaps `--dgo-s-3` (row) / `--dgo-s-2` (step); the
  pagination button's only padding is `padding-inline: var(--dgo-s-2)`. (Earlier
  drafts said "uses the component-tier padding tokens listed in §5" — the only
  component tokens are pagination *sizing* tokens, not padding; corrected
  2026-06-05.)
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:**
  - Stepper — a number or check glyph per bullet plus a short step label. For an
    *interactive* stepper, each step may be a `<button>` (see §9).
  - Pagination — page numbers and prev/next controls, each a `<button>` or `<a>`.
- **Contained by:** a stepper sits at the top of a multi-step form
  (`.dgo-card`/`.dgo-modal` body); pagination sits **below** a `.dgo-table` or in a
  `.dgo-card__footer`.
- **Conflicts with:**
  - **A stepper inside a stepper** — nested processes are a sign the flow should be
    flattened or split into separate screens.
  - **A stepper used as a determinate progress bar** for a *single* operation — use
    `.dgo-progress` (§13).

---

## 8 · Behaviour (JS contract)

Mostly declarative. The CSS renders whatever `data-state` / `aria-current` /
`disabled` the consumer sets; the consumer owns the logic:

| Responsibility | Owner |
|---|---|
| Advancing `data-state` on steps as the user progresses | Consumer |
| Setting `aria-current="page"` on the active page button | Consumer |
| Disabling prev on page 1 / next on the last page | Consumer |
| Navigating on click (route change, list re-fetch) | Consumer |

No system JS, no custom events.

---

## 9 · Keyboard

- **Stepper:** **not interactive by default** — `Tab` skips it. It is a *status
  indicator*. If the consumer makes each step a `<button>` (to let users jump back
  to a completed step), those buttons become normal tab stops; never make an
  *upcoming* step activable (the user can't skip ahead).
- **Pagination:** each button is a real `<button>`/`<a>` — `Tab` to focus, `Enter`
  (and `Space` on `<button>`) to navigate. The current and disabled buttons are
  still focusable for orientation unless the consumer removes them.

---

## 10 · ARIA

- **Stepper:** mark up as an ordered list — `<ol class="dgo-stepper">` with
  `<li class="dgo-stepper__step">` — and put `aria-current="step"` on the current
  step so AT announces position. The `data-state` attribute is *visual*; pair it
  with `aria-current` for the semantic.
- **Pagination:** wrap in `<nav aria-label="Pagination">`; put `aria-current="page"`
  on the active button (it is also the styling hook). Give icon-only prev/next
  buttons an `aria-label` ("Previous page" / "Next page").

### Forced-colours behaviour

Under `forced-colors: active` and `[data-theme="hc"]` the fills map to system
colours: the current/done bullets and the current page button take `Highlight` +
`HighlightText`; upcoming bullets and default buttons take `Canvas` + `CanvasText`
with a `CanvasText` border. The **accent connector line** (a background fill on a
2px element) may be stripped — completion is then carried by the bullet's system
colour, not the line. See `docs/07-elevation.md`.

### Reduced-motion behaviour

Neither component declares a transition or animation, so there is nothing to
collapse — state changes are instantaneous. See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** step labels and page numbers are `--dgo-type-body-sm`;
  numbers carry no marks, and short step labels clear stacked Yorùbá / Hausa / Igbo
  marks at the body-sm ramp.
- **RTL:** both rows use `flex` with `gap` and no directional margins, so step
  order and page order flow start-to-end under `[dir="rtl"]` automatically. A
  "Next →" pagination control should flip its arrow per `docs/05-iconography.md`.
- **Translation expansion:** long step labels wrap; the bullet stays centred on the
  first line. Keep step labels to one or two words — a stepper is a glance-able
  status, not a place for sentences.

---

## 12 · Examples

### Stepper

```html
<ol class="dgo-stepper">
  <li class="dgo-stepper__step" data-state="done">
    <span class="dgo-stepper__bullet">✓</span>Draft
  </li>
  <span class="dgo-stepper__line"></span>
  <li class="dgo-stepper__step" data-state="current" aria-current="step">
    <span class="dgo-stepper__bullet">2</span>Review
  </li>
  <span class="dgo-stepper__line"></span>
  <li class="dgo-stepper__step">
    <span class="dgo-stepper__bullet">3</span>Submit
  </li>
</ol>
```

### Pagination

```html
<nav class="dgo-pagination" aria-label="Pagination">
  <button class="dgo-pagination__btn" disabled aria-label="Previous page">‹</button>
  <button class="dgo-pagination__btn" aria-current="page">1</button>
  <button class="dgo-pagination__btn">2</button>
  <button class="dgo-pagination__btn">3</button>
  <button class="dgo-pagination__btn" aria-label="Next page">›</button>
</nav>
```

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the
showcase (`index.html`) — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ A stepper used as a progress bar for a single operation ("uploading…").
  ✅ Use `.dgo-progress` — a stepper is for *discrete, named* steps.
- ❌ Pagination with more than ~12 numeric buttons inline.
  ✅ Prev / next plus an ellipsis (`1 … 7 8 9 … 42`). A wall of page numbers is
  unscannable.
- ❌ An upcoming step made clickable so users can skip ahead.
  ✅ Only *completed* steps may be navigable backward; the user can't jump to a
  step they haven't reached.
- ❌ A stepper with the `data-state` set but no `aria-current="step"`.
  ✅ AT users get no position cue from colour alone (§10).

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-stepper` / `.dgo-pagination` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| Adjacent-sibling selector (`+`, for the connector-line fill) | required | Connector lines stay grey; completion still shown by the bullet colours. |
| Logical properties / `flex` `gap` | required | — |
| `forced-colors: active` styling | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational. Highest-risk area: whether the stepper's `<ol>` + `aria-current="step"`
position is announced consistently (step semantics vary more across AT than list
semantics).

---

## 16 · Open questions

- **Stepper geometry is hardcoded** (`28px` bullet, `2px` line) rather than
  tokenised (§5). A `--dgo-stepper-bullet` / `--dgo-stepper-line` token set would
  bring it to full discipline and enable a larger touch variant.
- **No vertical stepper variant.** The horizontal row works for ≤ 5 steps; longer
  flows need a left-rail vertical stepper, which is unshipped.
- **No ellipsis/overflow pattern shipped for pagination.** The `1 … 7 8 9 … 42`
  truncation (§13) is currently the consumer's to assemble; a shipped
  `.dgo-pagination__ellipsis` element would standardise it.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Stepper (process) + pagination (list), both attribute-driven. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): corrected §4 (current = primary, **done = accent** — the two were swapped) and documented the done→accent **connector-line propagation**; corrected §3 (no density response) and §6 (pagination tokens are sizing, not padding); clarified that `upcoming` is the unstyled default; logged the hardcoded `28px`/`2px` stepper geometry as a token-discipline exception. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
