# 11 · Component Documentation Template

> A fillable shape. Copy this file to `docs/components/<family>.md` and fill it in.
> Every shipped component in the v2.x library must have one of these on file before
> it counts as documented.

The template enforces the **system's questions** — anatomy, states, tokens consumed,
behaviour, keyboard, ARIA, density, theming, anti-patterns. If a section is genuinely
not applicable, write `Not applicable — [reason]` rather than deleting the heading.
The heading inventory is part of what makes the docs grep-able across components.

A worked example is shipped alongside this template in Turn 4 (`components/command-
palette.md`). Read both side-by-side before filling in a new one.

---

## How to use this template

1. **Copy.** `cp docs/11-component-template.md docs/components/<family>.md`.
2. **Replace** every `<<…>>` placeholder. The angle-bracket form is intentional —
   it grep-fails CI if you forget one.
3. **Verify** all listed token names exist in `tokens/` (run the token-lint script
   when it ships; until then, code review).
4. **Cross-link** from §08-accessibility's per-family entry and from
   `styles/components/_index.css`'s comment header.
5. **Open a PR** with both the docs and the component CSS in the same change. The
   docs are not a follow-up.

---

# `<<Component Name>>`

> One-sentence purpose. What this component is, and what role it plays in the system.
> Not a description of what it looks like — that's downstream.

**Status:** `<<shipped | proposed | deprecated>>`
**Since:** `<<v2.x>>`
**File:** `styles/components/<<family>>.css`
**Selector namespace:** `.dgo-<<family>>__…` (BEM)

---

## 1 · Anatomy

A bulleted list of named parts, in DOM order. The parts are the BEM elements; the
list is the contract.

- `.dgo-<<family>>` — root
- `.dgo-<<family>>__<<part1>>` — `<<role of part 1>>`
- `.dgo-<<family>>__<<part2>>` — `<<role of part 2>>`
- …

If the component has internal slots, name them and describe what content is allowed:

| Slot | Allowed content |
|---|---|
| `<<slot name>>` | `<<e.g. text + one icon | a single .dgo-btn | inline form fields>>` |

---

## 2 · Variants

Modifier classes that change the **kind** of component, not its state. Each variant
gets a one-line description and an example use.

| Class | Description | Use when |
|---|---|---|
| `.dgo-<<family>>--<<variant1>>` | `<<one sentence>>` | `<<one sentence>>` |
| `.dgo-<<family>>--<<variant2>>` | `<<one sentence>>` | `<<one sentence>>` |

If there are no variants, write *"No variants. The component is configured through
its content and ARIA state, not through CSS modifiers."*

---

## 3 · Sizes & density

Sizes that change the **physical footprint** of the component. Usually three (`sm`,
`md`, `lg`) or none. Density (`comfortable` vs `compact`) is **orthogonal** — it's
not a size, it's a global mode.

| Size | Class | Height | Padding | Used when |
|---|---|---:|---|---|
| Small | `.dgo-<<family>>--sm` | `<<…>>` | `<<…>>` | `<<…>>` |
| Medium (default) | — | `<<…>>` | `<<…>>` | `<<…>>` |
| Large | `.dgo-<<family>>--lg` | `<<…>>` | `<<…>>` | `<<…>>` |

### Density behaviour

How does this component respond to `[data-density="compact"]`? Reference the
density tokens it consumes (e.g. `--dgo-density-pad`, the per-component height
overrides in `tokens.density.css`). If density has no effect, say so.

```
[data-density="compact"]:
  --dgo-<<family>>-h        →  <<…>>
  --dgo-<<family>>-pad      →  <<…>>
```

---

## 4 · States

State is what changes about a single instance over its lifetime — focus, hover,
active, disabled, loading, selected, error, invalid, empty, expanded. Each gets a
row. Use this table even if the component has only `:hover` and `:focus-visible`.

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Default | — | — | — |
| Hover | `:hover` | `<<which token rebinds>>` | mouse / touch |
| Focus | `:focus-visible` | `box-shadow: var(--dgo-focus-ring)` | keyboard |
| Active / pressed | `:active` | `<<…>>` | press |
| Disabled | `[aria-disabled="true"]`, `:disabled` | opacity + cursor | data |
| Loading | `[data-loading="true"]` | spinner + `aria-busy` | data |
| Error / invalid | `[aria-invalid="true"]`, `.is-error` | red border, danger fg | data |
| Selected / current | `[aria-current]`, `[aria-selected="true"]` | `<<…>>` | data |
| `<<other state>>` | `<<selector>>` | `<<change>>` | `<<driver>>` |

Note: the **driver** column is required. It records *what causes the state* — is it
a user gesture (mouse / keyboard / touch), or application data the consumer sets?
That distinction matters for tests.

---

## 5 · Tokens consumed

Every token this component reads. **Components must consume only Tier 2 (semantic)
and Tier 3 (component) tokens** — never Tier 1 primitives directly. If you find
yourself wanting a primitive, add a component-tier token in `tokens.component.css`
that re-points to it.

### Tier 3 — Component tokens (declared in `tokens.component.css`)

Add a `--dgo-<<family>>-*` block to `tokens.component.css`. List every token here.

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-<<family>>-radius` | `var(--dgo-radius-control)` | — |
| `--dgo-<<family>>-h-md`   | `40px` | density:compact → `32px` |
| `--dgo-<<family>>-bg`     | `var(--dgo-color-surface-raised)` | theme:dark, theme:hc |
| `--dgo-<<family>>-border` | `var(--dgo-color-border-default)` | theme:hc → `#000000` |
| `<<…>>` | `<<…>>` | `<<…>>` |

### Tier 2 — Semantic tokens (read directly, not via component tokens)

Sometimes a component reads a semantic token directly (focus ring, motion). List
those here.

- `--dgo-focus-ring`
- `--dgo-motion-state`
- `<<…>>`

### Tier 1 — Primitives

**Should be empty.** If non-empty, justify each entry — e.g. `--dgo-shadow-1` for
an internal divider stroke not otherwise expressible. Most justifications are signs
of a missing component token.

---

## 6 · Layout & sizing

How the component lays out internally. Reference the spacing tokens it consumes;
note any container queries; document what governs its inline-size and block-size.

- **Inline-size:** `<<intrinsic | filled | clamped to --dgo-c-narrow | …>>`
- **Block-size:** `<<intrinsic | fixed via --dgo-<<family>>-h | …>>`
- **Internal spacing:** `padding: <<token>>; gap: <<token>>`
- **Container query (if any):** `container-type: inline-size; @container (min-width: …)`

---

## 7 · Composition

How this component plays with the rest of the system.

- **Contains:** the components this one wraps or accepts as children. (`.dgo-btn`,
  `.dgo-icon`, `.dgo-badge`, etc.)
- **Contained by:** the components this one typically lives inside. (`.dgo-card`,
  `.dgo-modal`, `.dgo-topbar`, etc.)
- **Conflicts with:** combinations to avoid. (e.g. "don't nest a `.dgo-popover`
  inside a `.dgo-tooltip` — see §08-accessibility").

---

## 8 · Behaviour (JS contract)

If the component is **purely CSS**, write *"No JS — the component is declarative."*
and stop.

If JS is required, document the contract — what events fire, what attributes the
JS reads and writes, what the consumer must implement. The DGO system ships CSS
only; behaviour is the consumer app's responsibility, but the **contract** is the
system's.

### Attributes the component reads

| Attribute | Type | Meaning |
|---|---|---|
| `data-<<name>>` | `<<string | "true" | "false">>` | `<<what it controls>>` |
| `aria-<<name>>` | `<<…>>` | `<<…>>` |

### Events the consumer fires

| Event | When | Payload |
|---|---|---|
| `<<click | open | close | change>>` | `<<trigger>>` | `<<{ … }>>` |

### Focus management

Describe what the component does on open/close/mount/unmount. See §08-accessibility
for the focus-management contracts the system enforces.

---

## 9 · Keyboard

The per-component keyboard map. Cross-link to §08-accessibility's entry for this
family if it exists. List **every** key the component handles. The universal
`Tab` / `Shift+Tab` behaviour is implied — only call it out if this component
breaks it (e.g. focus-trapping modal).

| Key | Behaviour |
|---|---|
| `<<key>>` | `<<behaviour>>` |
| `<<key>>` | `<<behaviour>>` |

---

## 10 · ARIA

Cross-link to §08-accessibility's entry. List the **role, state, property** the
component must carry. List the live-region / focus-management consequences.

| Attribute | Value | When |
|---|---|---|
| `role` | `<<…>>` | always |
| `aria-<<state>>` | `"true" | "false"` | `<<…>>` |
| `aria-<<property>>` | `<<…>>` | `<<…>>` |

### Forced-colours behaviour

How the component reads under `forced-colors: active` and `[data-theme="hc"]`. If
the component relies on shadow alone to indicate elevation, that's a bug; add a
border in HC theme. See §07-elevation.

### Reduced-motion behaviour

Reference the keyframes and transitions used; confirm they collapse correctly
through `--dgo-motion-*`. See §06-motion.

---

## 11 · Internationalisation

- **Diacritic safety:** does the component respect `--dgo-lh-150` for body-size
  text? See §03-typography.
- **RTL:** does the component use `inset-inline-*` / `margin-inline-*` and respect
  `[dir="rtl"]`? Note any RTL-specific rules. (The shipped `.dgo-drawer` flips
  inline-end → inline-start under `[dir="rtl"]` — match that pattern.)
- **Translation expansion:** which strings expand >30% in Yorùbá / German / etc.
  How does the layout absorb it? (`min-inline-size`, `flex-wrap`, intrinsic widths.)

---

## 12 · Examples

Three examples, in increasing complexity.

### Basic

```html
<<minimal markup — the smallest correct invocation>>
```

### With variants and states

```html
<<showing 2-3 variants and 2-3 states in one snippet>>
```

### Inside a real composition

```html
<<the component composed with at least one other shipped family —
   e.g. .dgo-btn inside .dgo-modal__footer, .dgo-chip inside .dgo-filter-bar>>
```

---

## 13 · Anti-patterns

Three to five concrete `❌` / `✅` pairs specific to this component. Pull from real
review feedback if possible. Cross-link relevant entries in §12-anti-patterns.

- ❌ `<<thing not to do>>`
  ✅ `<<what to do instead>>`
- ❌ `<<…>>`
  ✅ `<<…>>`

---

## 14 · Migration

If this is a **shipped** component that changed between minor versions, document
the diff here. If it's brand new, write *"v2.x introduces this component. No
migration."*

| From | To | Why | Codemod |
|---|---|---|---|
| `<<old class | token | attr>>` | `<<new>>` | `<<reason>>` | `<<sed / regex / script reference>>` |

---

## 15 · Browser & assistive-tech support

The system's floor (declared once at the project level, repeated here for the
family's specific risks):

| Engine | Min version |
|---|---|
| Chromium-family (Chrome, Edge, Brave, Opera) | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari, mobile Safari) | last 2 majors |

Per-component caveats — any feature the component uses that has uneven support
(e.g. `:has()`, `anchor-positioning`, View Transitions). If the feature is
required-but-recent, document the fallback or graceful degradation.

| Feature | Required? | Fallback if absent |
|---|---|---|
| `<<e.g. :has()>>` | optional | `<<…>>` |
| `<<…>>` | required | — |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

Note that DGO does not yet have a formal AT test matrix; this checklist is
aspirational until the program is funded. Document any AT-specific quirks you
find.

---

## 16 · Open questions

Things this component **does not** answer, that the consumer team or a future
version will need to. Write them down; don't bury them.

- `<<…>>`
- `<<…>>`

---

## 17 · Changelog

| Version | Change |
|---|---|
| `<<v2.0>>` | Introduced. |
| `<<v2.x>>` | `<<diff>>` |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `<<YYYY-MM-DD>>`
- **Next scheduled review:** `<<YYYY-MM-DD>>` (default cadence: 6 months from last
  review or on any change to consumed tokens, whichever is sooner).

---

## Template footer — review before merging

When you copy this file to fill it in, the following must be true at PR time:

- [ ] All `<<…>>` placeholders replaced.
- [ ] Every listed token name verified against `tokens/` files.
- [ ] Tier 1 (primitive) consumption section is either empty or each entry is
      justified.
- [ ] §8 keyboard map matches §08-accessibility's per-family entry. If they
      disagree, fix one and link the change.
- [ ] §9 ARIA contract matches §08-accessibility's per-family entry.
- [ ] At least one example renders correctly in light, dark, and HC themes.
- [ ] At least one example survives `prefers-reduced-motion: reduce`.
- [ ] At least one example survives `[data-density="compact"]`.
- [ ] At least one example carries Yorùbá / Hausa / Igbo content if the
      component renders any text.
- [ ] Linked from `styles/components/_index.css` comment header and from
      §08-accessibility per-family entry.
