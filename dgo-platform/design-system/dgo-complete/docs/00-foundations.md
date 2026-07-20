# 00 · Foundations

> The architectural through-line for everything in `dgo-design-system/`. If §01–§12
> are individual rooms, this document is the floor plan. Read this first; everything
> else assumes the vocabulary set here.

DGO is an **operational** design system. It serves federal digital operations —
contact centres, case work, agency dashboards, public-facing service portals —
under the visual authority of NITDA. That charter shapes every decision below.

---

## 1 · The five pillars

| Pillar | What lives there | Document |
|---|---|---|
| **Tokens** | Every quantifiable design decision (colour, type, space, motion, elevation, z) as a CSS custom property in `tokens/`. Four tiers. | §01-tokens |
| **Themes & density** | Two orthogonal axes that re-bind tokens at the document root: `data-theme="light|dark|hc"` and `data-density="comfortable|compact"`. | §01-tokens, §06-motion (reduced-motion), §07-elevation (HC) |
| **Components** | 26 shipped families in `styles/components/`. Each consumes Tier-2 or Tier-3 tokens only. | §08-accessibility (per-family contracts), §11-component-template |
| **Patterns** | Compositions of components — anti-patterns, content voice, i18n/RTL behaviour. The rules the system applies *to itself*. | §10-content-voice, §09-i18n-rtl, §12-anti-patterns |
| **Process** | The shape of contributions. How a new component arrives, how a token changes, how a deprecation lands. | §11-component-template (the gate), §13-governance (stub) |

This document doesn't replace any of those — it gives you the reading order and
the mental model that makes the rest cohere.

---

## 2 · The token cascade — one page

The single most important diagram in the system.

```
                       ┌─────────────────────────────┐
                       │  Tier 1 · Primitive          │
                       │  tokens.primitive.css        │
                       │  raw hex / px / ms / number  │
                       └──────────────┬───────────────┘
                                      │  referenced by
                       ┌──────────────▼───────────────┐
                       │  Tier 2 · Semantic           │
                       │  tokens.semantic.css         │
                       │  intent names                │
                       │  (--dgo-color-action-primary)│
                       └──────┬────────────────┬──────┘
                              │                │  referenced by
            re-bound by       │                │
       ┌──────────────────────▼───┐    ┌───────▼────────────────────┐
       │  Tier 4 · Theme/Density  │    │  Tier 3 · Component        │
       │  tokens.theme-*.css      │    │  tokens.component.css      │
       │  tokens.density.css      │    │  per-family bindings       │
       │  scoped by attribute     │    │  (--dgo-btn-h-md)          │
       └──────────────────────────┘    └────────────┬───────────────┘
                                                    │  consumed by
                                       ┌────────────▼───────────────┐
                                       │  styles/components/*.css   │
                                       │  components.css            │
                                       └────────────────────────────┘
```

**Consumption rule.** Components consume Tier 2 and Tier 3. They do not consume
Tier 1 except by deliberate, justified exception (documented in §11 of the
component's own doc). App code may consume any tier but should default to Tier 2 —
it's the layer themes re-skin.

**Re-binding rule.** Themes (`data-theme`) and density (`data-density`) re-bind at
**Tier 2 only**. A theme never reaches into a component file to override a `.dgo-btn`
selector — it changes the semantic token the button reads and the change cascades.

---

## 3 · The cascade layers

`styles/components/_index.css` declares the layer order once:

```css
@layer dgo-reset, dgo-base, dgo-component, dgo-utility;
```

- **`dgo-reset`** — modern reset (`reset.css`). Box-sizing, removed defaults,
  forced-colors safety.
- **`dgo-base`** — typography, accessibility utilities, the skip link, `.dgo-visually-hidden`,
  global `<strong>`/`<em>` rules, focus-ring defaults.
- **`dgo-component`** — the 26 families. Each file imported into this layer.
- **`dgo-utility`** — opt-in atomic helpers (`_utilities.css`). Win over components by
  layer position; lose to inline `style=` only when authors override.

**Tokens are not layered.** They live in the unlayered cascade so an app override
on `:root` always wins. This is the intended escape hatch for product-team theme
overlays without inventing a fifth layer.

App-author rules ship outside `@layer` and therefore win over `dgo-utility`. This
is by design — a feature should always be able to override the library, but the
library's own pieces should not fight each other.

---

## 4 · BEM, briefly

Every component is namespaced `.dgo-` and follows BEM.

```
.dgo-card                   block
.dgo-card__title            element
.dgo-card--elevated         modifier (state / variant)
.dgo-card[data-state="…"]   data-attribute for runtime state
```

- **Block** — the component family.
- **Element** — a named part *of* the block. `__title`, `__footer`, `__icon`.
- **Modifier** — a variant or sticky state. `--primary`, `--sm`, `--danger`.
- **Data-attribute** — runtime/JS-driven state. `data-loading`, `data-state="open"`,
  `data-density="compact"` (the document-level one).

ARIA state (`aria-disabled`, `aria-current`, `aria-expanded`) drives styling
directly via attribute selectors — that's what keeps the visual state and the
accessibility state from drifting out of sync. See §08-accessibility for the
shipped contracts.

---

## 5 · Themes & density — a worked example

A single button declaration touches three tiers and survives all four runtime
re-bindings. Walk through it:

```css
/* tokens.primitive.css */
--dgo-green-700: #05583B;

/* tokens.semantic.css */
--dgo-color-action-primary:        var(--dgo-green-700);
--dgo-color-action-primary-hover:  var(--dgo-green-600);
--dgo-color-fg-on-brand:           var(--dgo-ink-0);

/* tokens.component.css */
--dgo-btn-h-md: 40px;
--dgo-btn-px-md: var(--dgo-s-4);

/* styles/components/button.css — the only place a selector touches CSS values */
.dgo-btn--primary {
  background: var(--dgo-color-action-primary);
  color: var(--dgo-color-fg-on-brand);
  height: var(--dgo-btn-h-md);
  padding-inline: var(--dgo-btn-px-md);
}
.dgo-btn--primary:hover { background: var(--dgo-color-action-primary-hover); }
```

Now flip the runtime axes:

```html
<html data-theme="dark" data-density="compact">
```

- `tokens.theme-dark.css` rebinds `--dgo-color-action-primary` (lighter shade
  appropriate to a dark surface). The button background changes.
- `tokens.density.css` rebinds `--dgo-btn-h-md` to a smaller height. The button
  shrinks.
- The selector in `button.css` doesn't change. The component doesn't know it's in
  dark mode or compact density — the tokens it reads from did the work.

That separation is the entire point of the cascade. It's also why **components
must not consume Tier 1 directly** — primitive consumption skips the layer that
theme and density re-bind.

---

## 6 · The 26 component families

Indexed in `styles/components/_index.css`. Per-family deep dives live in
`docs/components/<family>.md` (template at §11). Per-family accessibility contracts
live in §08.

```
 1. Button              10. Alert / Banner      19. Tooltip / Popover
 2. Input / Textarea    11. Toast               20. Menu / Dropdown
 3. Select              12. Modal / Drawer      21. Empty / Error state
 4. Checkbox / Radio    13. Sidebar             22. Progress / Spinner
 5. Switch              14. Topbar              23. Skeleton
 6. Search              15. Tabs                24. Metric / Stat
 7. Badge / Tag / Chip  16. Breadcrumb          25. Kbd / Code
 8. Avatar              17. Stepper/Pagination  26. Chip / Filter bar
 9. Card                18. Table / Data grid
```

The list is **closed for v2.x.** Coverage gaps (date picker, command palette,
tree view, combobox, calendar, kanban) are tracked in the roadmap and noted in §08
as "not in scope for v2.0 accessibility contracts".

> **Per-component docs landed against the §11 template:**
> - `docs/components/button.md` — Button (shipped, v2.0)
> - `docs/components/input.md` — Input / Textarea / Field (shipped, v2.0)
> - `docs/components/tabs.md` — Tabs (shipped, v2.0)
> - `docs/components/table.md` — Table (shipped, v2.0)
> - `docs/components/toast.md` — Toast (shipped, v2.0)
> - `docs/components/modal.md` — Modal & Drawer (shipped, v2.0)
> - `docs/components/command-palette.md` — Command Palette (proposed v2.1; spec-
>   only worked example, CSS implementation pending doc approval)
>
> Remaining 20 shipped families are covered in §08-accessibility per-family
> contracts but do not yet have full §11 fills. Filling them is the v2.1
> documentation roadmap.

A new family lands the same way a new token does: a docs PR against §11-component-
template's filled-in shape, a CSS file in `styles/components/`, an `_index.css`
import line, a §08 entry, and — if it introduces tokens — entries in
`tokens.component.css` and §01-tokens.

---

## 7 · Floors & ceilings

The system's hard rules. Violations are bugs, not preferences.

| Rule | Floor / Ceiling | Document |
|---|---|---|
| Body text size | Floor 12px (`--dgo-size-12`) | §03 |
| Touch target | Floor 44 × 44 px (`--dgo-s-11`) | §04 |
| Body line-height with diacritics | Floor `--dgo-lh-150` | §03, §09 |
| Component primitive-tier consumption | Ceiling: zero, except justified | §01, §11 §5 |
| Transition duration on a state change | Ceiling: `--dgo-dur-deliberate` (600ms) | §06 |
| Z-index in app code | Ceiling: `--dgo-z-tooltip` (1300); `--dgo-z-max` is reserved | §07 |
| Content voice on public surfaces | First reference: full agency name expanded | §10 |
| Coat-of-arms colours in UI | Use: zero | §02 |

If a feature requires breaking a floor or ceiling, document the exception **in the
component's `docs/components/<family>.md` §13 anti-patterns or §16 open questions
section** rather than silently bending the rule.

---

## 8 · Reading order

If you're new to the system, read in this order:

1. **§00 Foundations** (this file) — what's where, and the cascade.
2. **§01 Tokens** — what's quantified.
3. **§02 Color** — the contrast matrix.
4. **§03 Typography** — the four families, the ramp, the West African coverage.
5. **§04 Spacing & grid** — the 4px base, the 44px floor.
6. **§05 Iconography** — outline-only, 1.5px stroke, the sprite.
7. **§06 Motion** — duration × easing → intent.
8. **§07 Elevation** — green-tinted shadow + z-index.
9. **§08 Accessibility** — per-family contracts.
10. **§09 i18n / RTL** — text expansion, mirroring rules, language-specific
    typesetting.
11. **§10 Content & voice** — institutional register, error messaging, empty states.
12. **§11 Component template** — the shape every component doc takes.
13. **§12 Anti-patterns** — global don'ts.
14. **`docs/components/command-palette.md`** — the worked example built against §11.

The numbered docs are evergreen; the per-component docs are versioned with the
components themselves.

---

## 9 · What's NOT in this system

Naming the absences is part of the system. Avoiding scope creep is how the shipped
parts stay reliable.

- **No icon library** beyond the 40-glyph sprite. Lucide is referenced for legacy
  NITDA usage; DGO ships its own sprite at `assets/icons/sprite.svg`. See §05.
- **No JS framework wrapper** (no React, Vue, or Svelte component bindings).
  Components are CSS + a documented behaviour contract; the consuming app
  implements the behaviour. The contract lives in §11 §8 of each component doc.
- **No design-tools handoff** (Figma library, Sketch library, Tokens Studio
  export). Token files are the source of truth; if a tools-side mirror is ever
  built, it's generated from `tokens/*.css`, not the other way around.
- **No animation/motion library** beyond the keyframes in shipped component files
  (`dgo-spin`, `dgo-fade-in`, `dgo-modal-in`, `dgo-drawer-in`, `dgo-toast-in`,
  `dgo-skeleton`). See §06.
- **No marketing-site primitives** (hero, feature-row, pricing-tier, footer mega-
  nav). DGO is an operational surface. Marketing surfaces live in NITDA's brand
  manual.
- **No CMS schema, no content model, no editorial workflow.** §10 covers voice;
  it does not cover structure.
- **No data-viz component library.** Sequential, diverging, and categorical palettes
  are shipped (Tier 1, see §01); the chart components that consume them are not.

The contributor decision is: *if it's not on this list and not in §06 of any
component doc, file an RFC against §11 before building it.*

---

## 10 · Governance summary

The full governance / license / changelog documents are stubbed; until they are
filled in, the operational rules are:

- **Versioning.** Semantic versioning. Major = breaking token rename or component
  removal. Minor = new component family, new token, additive theme. Patch =
  visual fix, doc clarification, deprecation announcement (deprecation lands in
  minor; removal lands in next major).
- **Deprecation window.** Two minors. A token deprecated in v2.3 is removed no
  earlier than v2.5.
- **Ownership.** `[NITDA DS team: confirm owner]`. The §18 block of each component
  doc names the implementation lead per family.
- **License.** `[NITDA legal: confirm license type, redistribution scope,
  attribution requirement]`. The structural license stub is at `LICENSE.md`
  (TODO).
- **Migration history.** `[v1 maintainers: confirm migration entries]`. Documented
  per-component in each component doc's §14.

---

## 11 · Open questions (for v2.2+)

- A **design-tokens JSON export** so non-CSS consumers (native iOS / Android
  surfaces, server-side PDF rendering for memos) can read the same source of truth.
- A **lint rule pack** that fails CI on Tier-1 consumption from a component file,
  on `outline: none` without a replacement, on raw `ms`/`cubic-bezier()`/hex inside
  `styles/components/`.
- A **CMS-side content voice linter** that enforces the §10 rules on editorial
  copy. Currently the rules live as prose; promoting them to a rule pack would
  reduce review load.
- A **partner-agency theme overlay** mechanism. The current cascade supports it
  (rebind Tier 2 under a scoped attribute), but the convention is undocumented.
  Promote to a real `tokens.theme-partner-<agency>.css` pattern when the second
  agency arrives.
