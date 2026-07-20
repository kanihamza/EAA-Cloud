# `sidebar`

> The primary vertical navigation rail for **operator** surfaces — the persistent
> left-hand list of destinations in a back-office app. It is **brand-inverse by
> design**: a dark surface (`--dgo-sidebar-bg`) carrying light text, so it anchors
> the page as a stable frame while the content area stays light. It is *navigation*,
> not a menu (it persists; a `.dgo-menu` is transient) and not a generic container —
> its dark-green identity is part of the system's vocabulary and must not be
> recoloured per product (§13).

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/sidebar.css`
**Selector namespace:** `.dgo-sidebar` (BEM)

---

## 1 · Anatomy

DOM order, outermost to innermost:

- `.dgo-sidebar` — the rail. `flex; flex-direction: column; gap: var(--dgo-s-5)`;
  `padding: var(--dgo-s-5) var(--dgo-s-3)`; `background: var(--dgo-sidebar-bg)`;
  `color: var(--dgo-sidebar-fg)`; `block-size: 100vh`; `position: sticky;
  inset-block-start: 0` — it pins to the viewport and runs full height.
- `.dgo-sidebar__brand` — the top brand block. `padding-block-end: var(--dgo-s-4)`
  with a `1px` `--dgo-color-border-on-brand` bottom rule separating it from the nav.
- `.dgo-sidebar__nav` — the nav region. `flex-direction: column; gap: 2px; flex: 1`
  — it takes the remaining height so the footer sits at the bottom.
- `.dgo-sidebar__group-label` — an uppercased section heading (`10px`,
  `--dgo-wt-700`, `--dgo-tr-widest` tracking).
- `.dgo-sidebar__item` — one nav link (a real `<a>`). `flex; align-items: center;
  gap: var(--dgo-s-3)`; `padding: var(--dgo-s-2) var(--dgo-s-3)`;
  `border-radius: var(--dgo-radius-control)`; `min-block-size: 36px`.
- `.dgo-sidebar__item--active` / `[aria-current="page"]` — the active link, plus a
  `3px` accent stripe drawn with `::before`.
- `.dgo-sidebar__count` — a trailing inline pill carrying a numeric badge
  (`margin-inline-start: auto` pushes it to the trailing edge).
- `.dgo-sidebar__footer` — the bottom block, separated by a `1px`
  `--dgo-color-border-on-brand` top rule.

---

## 2 · Variants

**No variant is shipped in the CSS.** The rail has **no `inline-size` declaration
at all** — its width is the consumer's to set, and the "expanded 260px / collapsed
icon-only 68px" pattern that operator apps use is **entirely consumer-owned**
(width + a collapsed-state class the consumer defines and toggles). The system
ships the dark surface, the item treatment, the active stripe, and the full-height
sticky behaviour — not a collapse mechanism. (Earlier drafts listed concrete
260px/68px widths as if shipped; corrected 2026-06-05 — they are conventions, not
CSS.) See §16 for the open question on promoting a shipped toggle.

---

## 3 · Sizes & density

Single treatment. **Density has no effect.** The rail declares no density block and
consumes no `--dgo-density-*` token; its padding is fixed `--dgo-s-5` / `--dgo-s-3`
and item height is a fixed `36px`. (Earlier drafts claimed "density adjusts internal
padding via the `--dgo-density-pad` chain" — boilerplate, and incorrect for this
family; corrected 2026-06-05 against the shipped CSS.) See
`docs/04-spacing-grid.md` §"Density".

---

## 4 · States

| State | Selector | Visual change | Driver |
| --- | --- | --- | --- |
| Rest | `.dgo-sidebar__item` | Text `rgba(255,255,255,0.78)` on the dark surface (see §5 — a hardcoded alpha, not a token) | — |
| Hover | `:hover` | Text → `#fff`; background → `rgba(255,255,255,0.06)` | mouse |
| Active | `[aria-current="page"]` / `.dgo-sidebar__item--active` | Text → `#fff`; background → `rgba(255,255,255,0.10)`; a `3px` `--dgo-color-action-accent` stripe via `::before` (inset `8px` top/bottom) | data |

### Focus is **not** styled by this family

There is **no `:focus-visible` rule in `sidebar.css`.** Item focus falls through to
the global base focus style (`docs/08-accessibility.md`), whatever that resolves to
*on the dark surface*. This is a **real gap**: a focus ring tuned for light
surfaces may have insufficient contrast against `--dgo-sidebar-bg`, and the system
does not currently guarantee a visible focus indicator here. Tracked in §16.
(Earlier drafts described a "3px focus ring cleared by the `data-theme="dark"`
rebind of `--dgo-color-border-focus`" — that rule does not exist in the shipped
CSS; corrected 2026-06-05.)

### The active stripe is the one fully-tokenised state signal

The `3px` accent stripe reads `--dgo-color-action-accent` — a real token — so it
survives where the white-alpha backgrounds do not (forced colours, §10). It is the
most robust active cue; the background tint is secondary.

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in
`styles/components/sidebar.css`, verified against the shipped CSS on 2026-06-05.
Tokens reached only through a component-token's internal chain are documented at
their own tier, not duplicated here._

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Used for |
|---|---|
| `--dgo-sidebar-bg` | Rail background (the dark-green inverse surface) |
| `--dgo-sidebar-fg` | Rail base foreground colour |

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-action-accent` | Active-item stripe (`::before`) |
| `--dgo-color-border-on-brand` | The brand-block and footer divider rules |
| `--dgo-radius-control` | Item corner radius |
| `--dgo-motion-state` | Item hover transition (background + colour) |
| `--dgo-type-body-sm` | Item label size |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-s-1` … `--dgo-s-5` | 4–24px | Rail/brand/item/label/footer padding and gaps |
| `--dgo-r-pill` | 999px | Count-badge pill radius |
| `--dgo-tr-widest` | widest tracking | Group-label letter-spacing |
| `--dgo-wt-500` | medium | Item label weight |
| `--dgo-wt-700` | bold | Group-label weight |

### Un-tokenised values — known, and substantial

`sidebar.css` is the **most-divergent file from its own "every value is a var()"
header** in the system. The on-dark foreground and background treatments are
**hardcoded white-alpha literals and a bare `#fff`**, not tokens:

| Literal | Where |
|---|---|
| `rgba(255,255,255,0.78)` | Item rest text |
| `#fff` | Item hover / active text |
| `rgba(255,255,255,0.06)` | Item hover background |
| `rgba(255,255,255,0.10)` | Item active background **and** count-badge background |
| `rgba(255,255,255,0.45)` | Group-label text |
| `10px` / `11px` | Group-label / count font sizes |
| `2px 6px` | Count-badge padding |
| `2px` | Nav row gap; active-stripe radius |
| `3px` | Active-stripe width |
| `8px` | Active-stripe vertical inset |
| `36px` | Item `min-block-size` |
| `100vh` | Rail height |

These work, and the white-alpha approach is a *reasonable* way to derive a tonal
ramp on an unknown dark surface — but it means the rail's text colours **do not
read from the token graph** and cannot be themed or contrast-tuned centrally. A
`--dgo-sidebar-fg-{rest,hover,muted}` and `--dgo-sidebar-item-bg-{hover,active}`
token set would bring the family into discipline. This is the headline cleanup item
for the family — tracked in §16.

---

## 6 · Layout & sizing

- **Inline-size:** **not set by the CSS** — consumer-bounded (see §2). Size the rail
  by setting a width on `.dgo-sidebar` (or via the page-shell grid column).
- **Block-size:** `100vh` (a literal, not a token), with `position: sticky;
  inset-block-start: 0` so the rail stays put as the content area scrolls.
- **Internal spacing:** rail padding `--dgo-s-5` / `--dgo-s-3`; item padding
  `--dgo-s-2` / `--dgo-s-3`; nav row gap a literal `2px`. (Earlier drafts said "uses
  the component-tier padding tokens listed in §5" — the padding is primitive +
  literal, not component-tier; corrected 2026-06-05.)
- **Item touch target:** `min-block-size: 36px` — **below the 44px touch floor**
  (`docs/04-spacing-grid.md`). The sidebar is an operator/desktop surface where this
  is the accepted trade for density, but a touch-targeted deployment should raise
  the item height. Tracked in §16.
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** `.dgo-sidebar__brand`, `<a class="dgo-sidebar__item">` links,
  `.dgo-sidebar__group-label` headings, `.dgo-sidebar__count` badges, and a
  `.dgo-sidebar__footer` (often holding a `.dgo-avatar` + user name).
- **Contained by:** the page shell / `<body>` as a top-level layout column. It is
  not nested inside content.
- **Conflicts with:**
  - **A sidebar inside a `.dgo-modal`** — the rail is a page-level frame, never a
    dialog's content.
  - **Recolouring `--dgo-sidebar-bg` per product** — the dark-green identity is part
    of the vocabulary (§13).

---

## 8 · Behaviour (JS contract)

Largely declarative — the CSS renders the active item from `aria-current` /
`--active`. The consumer owns:

| Responsibility | Detail |
|---|---|
| Setting the active item | `aria-current="page"` (and/or `.dgo-sidebar__item--active`) on the current route's link. |
| Collapse / expand | If the product offers an icon-only mode, the consumer owns the width change and the toggle button (§2, §16). |
| Updating counts | The `.dgo-sidebar__count` badge value. |

No system JS, no focus-trap (a persistent rail is not a dismissible overlay — unlike
a `.dgo-menu`).

---

## 9 · Keyboard

`Tab` moves through the items in DOM order. Each `.dgo-sidebar__item` is a real
`<a>` with an `href`, so `Enter` follows the link natively — no custom key handling.
Because the rail is persistent (not a trap), focus enters and leaves it like any
in-flow nav region. See the §4 focus gap caveat.

---

## 10 · ARIA

Wrap the rail in `<nav aria-label="Primary">` so AT announces it as the primary
navigation landmark (distinguish it from any secondary nav with a different label).
Mark the active link with **`aria-current="page"`** — do **not** rely on the
`--active` modifier alone, which conveys nothing to AT. Group headings
(`.dgo-sidebar__group-label`) are visual; if a group needs semantic grouping, nest
its items in a labelled `<ul>`.

### Forced-colours behaviour

Under `forced-colors: active` and `[data-theme="hc"]` the **white-alpha
backgrounds and text vanish or remap** — `rgba(255,255,255,…)` over a system
`Canvas` does not survive as a meaningful tint, so the hover/active *background*
cues are effectively lost. Two things carry the state instead: the
`--dgo-color-action-accent` **stripe** (a real colour that remaps to a system
accent) and `aria-current="page"` for AT. This is exactly why the active state must
**not** depend on the background tint alone (§4) and why `aria-current` is
mandatory (§13). See `docs/07-elevation.md`.

### Reduced-motion behaviour

The only motion is the item hover transition (`background`, `color`, on
`--dgo-motion-state`); it collapses to ≤ 50ms under
`@media (prefers-reduced-motion: reduce)`. See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** item labels are `--dgo-type-body-sm`; the `36px` item height
  and `--dgo-s-2` vertical padding give stacked Yorùbá / Hausa / Igbo marks room
  above the label baseline.
- **RTL:** the rail anchors to the **inline-start** edge, so it moves to the right
  under `[dir="rtl"]` automatically; the active stripe (`inset-inline-start: 0`),
  item gaps, and the count badge's `margin-inline-start: auto` all follow the
  writing direction. The brand/footer dividers are direction-agnostic.
- **Translation expansion:** item labels wrap (no `nowrap`); a two-line item grows
  past `36px` rather than clipping. The group-label `text-transform: uppercase`
  should be overridden to `none` for scripts where uppercasing is meaningless
  (consumer override).

---

## 12 · Examples

### Basic

```html
<nav class="dgo-sidebar" aria-label="Primary" style="inline-size: 260px">
  <div class="dgo-sidebar__brand">DGO · Operator</div>
  <div class="dgo-sidebar__nav">
    <div class="dgo-sidebar__group-label">Work</div>
    <a class="dgo-sidebar__item dgo-sidebar__item--active" href="/" aria-current="page">Dashboard</a>
    <a class="dgo-sidebar__item" href="/dossiers">
      Dossiers <span class="dgo-sidebar__count">12</span>
    </a>
    <a class="dgo-sidebar__item" href="/reports">Reports</a>
  </div>
  <div class="dgo-sidebar__footer">
    <a class="dgo-sidebar__item" href="/account">Account</a>
  </div>
</nav>
```

> Note the `style="inline-size: 260px"` — width is the consumer's responsibility
> (§2); the CSS ships none.

### Inside a real composition

See the **Operator dashboard** pattern at the bottom of the showcase
(`index.html`) — the sidebar frames the full operator shell.

---

## 13 · Anti-patterns

- ❌ A sidebar with more than ~14 items and no grouping.
  ✅ Break the list into `.dgo-sidebar__group-label` sections.
- ❌ An active item without `aria-current="page"`.
  ✅ AT users get nothing from the accent stripe / tint alone (§10). `aria-current`
  is mandatory.
- ❌ Overriding `--dgo-sidebar-bg` to a per-product colour.
  ✅ The dark-green inverse surface is part of the system vocabulary.
- ❌ Putting the rail inside a `.dgo-modal` or other content container.
  ✅ The sidebar is a page-level frame.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-sidebar` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `position: sticky` | required | Rail scrolls with the page instead of pinning. |
| Logical properties (`inset-inline-start`, `margin-inline-start`) | required | — |
| `forced-colors: active` styling | required (with the §10 caveat — background tints don't survive) | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational. Highest-risk area: the §4 **focus-visible gap** on the dark surface —
verify a focus indicator is actually visible against `--dgo-sidebar-bg` before
shipping to keyboard-dependent users.

---

## 16 · Open questions

- **On-dark colours are hardcoded white-alphas, not tokens** (§5) — the headline
  cleanup. A `--dgo-sidebar-fg-{rest,hover,muted}` + `--dgo-sidebar-item-bg-{hover,active}`
  token set would bring the rail into the token graph and make it centrally
  themeable / contrast-tuneable. Track at `[NITDA DS team: file v2.x cleanup ticket]`.
- **No shipped focus-visible style** on items (§4). The family must guarantee a
  focus indicator with adequate contrast on the dark surface; today it inherits the
  global (light-tuned) focus style. High priority before any keyboard-AT sign-off.
- **Item height `36px` is below the 44px touch floor** (§6). Acceptable for
  operator/desktop; a touch deployment needs a taller item — possibly a
  `[data-touch]` rebind.
- **Collapsed (icon-only) mode is consumer-owned** (§2). If consumers diverge on the
  collapse mechanism, promote a shipped width token + toggle in v2.2.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Dark-inverse navigation rail with brand block, grouped items, active stripe, count badges, footer. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): **removed the fabricated `:focus-visible` rule** (none ships — logged as a real gap) and the **fabricated 260px/68px width variants** (no width ships — width is consumer-owned); documented the substantial **hardcoded white-alpha colour** divergence from the file header, the accent-stripe-as-robust-state-signal, the `36px` sub-floor item height, the forced-colours loss of background tints, and corrected §3 (no density response). No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
