# `search`

> An inline search field: a leading magnifying-glass icon and a text input sharing
> one bordered shell. It is a **control** the user types into in place — distinct
> from the **command palette**, which is a modal launcher summoned by a shortcut.
> Use `.dgo-search` to filter or query *within the current view* (a table, a list,
> a directory); use `.dgo-cmdk` to jump *across* the app. Architecturally the search
> is a **"naked input in a bordered wrapper"**: the `<input>` itself carries no
> border, background, or outline — the wrapper draws the box and owns the focus
> state through `:focus-within`.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/search.css`
**Selector namespace:** `.dgo-search` (BEM)

---

## 1 · Anatomy

`.dgo-search` is a single flex row, `align-items: center`, `gap: var(--dgo-s-2)`
(8px) between its children:

- `.dgo-search` — the **wrapper and the visible box**. `block-size: var(--dgo-input-h)`,
  `padding-inline: var(--dgo-s-3)`, a `1px var(--dgo-input-border)` border,
  `--dgo-input-radius`, `--dgo-input-bg` background, and a resting text colour of
  `--dgo-color-fg-muted` (which the leading icon inherits). The wrapper — not the
  input — is the bordered, focus-ringed surface.
- `<svg>` leading icon — the magnifying glass, `aria-hidden="true"`. Inherits the
  wrapper's muted colour so it reads as a quiet affordance, not content.
- `<input type="search">` — the real, focusable field. Deliberately **naked**:
  `flex: 1; border: 0; background: transparent; outline: none`; text colour
  `--dgo-color-fg-default`, font `--dgo-type-body`. Because its own outline is
  removed, the *wrapper* must show the focus state (§4).
- *(optional)* a trailing `.dgo-btn--icon` clear button — consumer-provided (§7).

---

## 2 · Variants

No variants. The search is layout-only; it has one visual treatment borrowed from
the input family. There is no `--sm` / `--lg` search (contrast the button) —
its single height tracks `--dgo-input-h`.

---

## 3 · Sizes & density

Single size — but **this is one of the few families that *does* respond to
density.** The wrapper's `block-size` is `--dgo-input-h`, which
`tokens.density.css` rebinds from **40px (comfortable) to 32px (compact)**. So a
search field shrinks in a compact layout exactly as a text input does, keeping the
two aligned in a shared filter bar. The internal `--dgo-s-*` paddings are fixed and
do not change. (Earlier drafts described "sm / default / lg" sizes — those are not
shipped for search; the one size that *does* flex is the density-driven height;
corrected 2026-06-05.) See `docs/04-spacing-grid.md` §"Density".

---

## 4 · States

| State | Selector | Visual change | Driver |
| --- | --- | --- | --- |
| Default | `.dgo-search` | `--dgo-input-bg`, 1px `--dgo-input-border`, muted icon | — |
| Focus | `:focus-within` | Border → `--dgo-color-action-primary`; plus a `3px` `color-mix(action-primary 22%, transparent)` halo `box-shadow` | keyboard / click into the field |
| Has value | (consumer) | A trailing clear button appears — consumer-managed, not a CSS state | data |

### Focus lives on the wrapper, not the input

Because the `<input>` sets `outline: none`, the **wrapper** carries the focus
indicator via `:focus-within`: when the inner input gains focus, the wrapper's
border turns brand-green and the 3px halo appears. This is the *same focus language*
as `.dgo-input` and `.dgo-select` — a search field in a form focus-matches the text
fields beside it. Never restore an outline on the inner input as well; that would
double the ring.

---

## 5 · Tokens consumed

_Every entry below is a direct `var()` reference in `styles/components/search.css`,
verified against the shipped CSS on 2026-06-05. The search **reuses the
`.dgo-input` field tokens** for its box; only the tokens referenced directly in
`search.css` are listed here._

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Used for |
|---|---|
| `--dgo-input-h` | Wrapper height — **rebinds under density** (40 → 32px). |
| `--dgo-input-border` | Wrapper resting border colour |
| `--dgo-input-bg` | Wrapper background |
| `--dgo-input-radius` | Wrapper corner radius |

### Tier 2 — Semantic tokens

| Token | Used for |
|---|---|
| `--dgo-color-action-primary` | Focus border **and** the `color-mix` base of the focus halo |
| `--dgo-color-fg-default` | Input text |
| `--dgo-color-fg-muted` | Wrapper / icon resting colour |
| `--dgo-motion-state` | Border-colour transition |
| `--dgo-type-body` | Input font-size (14px) |

### Tier 1 — Primitives (read directly)

| Token | Resolved | Used for |
|---|---|---|
| `--dgo-s-2` | 8px | Gap between icon, input, and clear button |
| `--dgo-s-3` | 12px | Wrapper inline padding |

### Un-tokenised value — known

The focus halo spread is a literal `0 0 0 3px` and the tint is an inline
`color-mix(in srgb, var(--dgo-color-action-primary) 22%, transparent)` — the same
ring recipe `input.css` uses, but expressed as literals rather than a shared
`--dgo-focus-ring`-style token. Minor; consistent across the input family. Tracked
in §16.

---

## 6 · Layout & sizing

- **Inline-size:** intrinsic, bounded by the consumer's container — the search is a
  `flex` row that grows to its column (e.g. a `.dgo-filter-bar` cell or a topbar
  centre slot). Size it via the parent, not a width on `.dgo-search`.
- **Block-size:** `--dgo-input-h` (40 / 32px by density).
- **Internal spacing:** `padding-inline: var(--dgo-s-3)` on the wrapper; `--dgo-s-2`
  gap between children. The naked input has no padding of its own — `flex: 1` makes
  it fill the space between icon and (optional) clear button. (Earlier drafts said
  "uses the component-tier padding tokens listed in §5" — the padding is primitive;
  corrected 2026-06-05.)
- **Container query:** none in v2.x.

---

## 7 · Composition

- **Contains:** the leading `<svg>` icon, the `<input type="search">`, and
  (optionally) a trailing `.dgo-btn--icon` clear button. The clear button is the
  consumer's to add and wire — the CSS does not ship a clear affordance.
- **Contained by:** `.dgo-filter-bar` (the most common host), `.dgo-topbar` (centre
  slot), `.dgo-card__header` (search within a card's contents).
- **Conflicts with:**
  - **A `.dgo-search` inside a `.dgo-cmdk`** — the palette already *is* a search
    surface; nesting one inside it is redundant. Pick the surface (§13).

---

## 8 · Behaviour (JS contract)

**No JS for the styling.** Focus, the border highlight, and the halo are pure CSS
(`:focus-within`). The consumer owns the *query*:

| Responsibility | Detail |
|---|---|
| Reading the query | An `input` listener (live filter) or `submit` (`<form role="search">`). |
| Clear button | Render it when the field is non-empty; clear the value and refocus the input on click. |
| Debouncing live search | Consumer concern — debounce `input` before hitting an API. |

Native `<input type="search">` provides `Escape`-to-clear and the platform clear
affordance for free (§9).

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` / `Shift+Tab` | Focus in / out — focus lands on the inner input; the wrapper shows the `:focus-within` ring. |
| `Escape` | Clears the field — **native to `<input type="search">`** (this is why §13 insists on `type="search"`, not `type="text"`). |
| typing | Normal text entry; the consumer's `input` handler filters. |

---

## 10 · ARIA

Wrap the field in `<search>` (the HTML element) or `<form role="search">` so it
becomes a **discoverable search landmark** for AT. The leading icon is
`aria-hidden="true"` (decorative). If the input has no visible label, give it an
`aria-label` ("Search dossiers") — a placeholder is not a label.

### Forced-colours behaviour

Under `forced-colors: active` and `[data-theme="hc"]` the wrapper's token-driven box
maps to system colours (`Canvas`, `CanvasText`) and the 1px border becomes a
`CanvasText` edge; the focus state remaps to the system focus colour. The decorative
magnifier may drop if engines strip the SVG — the field stays fully operable. See
`docs/07-elevation.md`.

### Reduced-motion behaviour

The wrapper's `border-color` transition (`--dgo-motion-state`) collapses to ≤ 50ms
under `@media (prefers-reduced-motion: reduce)`. The focus halo appears without a
fade. See `docs/06-motion.md`.

---

## 11 · Internationalisation

- **Diacritic safety:** input text is `--dgo-type-body` (14px); the 40/32px wrapper
  height clears stacked Yorùbá / Hausa / Igbo combining marks on the typed query.
- **RTL:** the leading icon and the input flip order automatically under
  `[dir="rtl"]` because the row uses `flex` with `gap` and logical
  `padding-inline` — the magnifier lands on the reading-start side. A trailing clear
  button follows to the reading-end side.
- **Translation expansion:** a long placeholder truncates at the field edge with the
  native ellipsis; keep placeholders short and treat them as hints, not labels
  (§10). The query text itself scrolls within the field.

---

## 12 · Examples

### Basic

```html
<form role="search" class="dgo-search">
  <svg class="icon-sm" aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-search"/></svg>
  <input type="search" aria-label="Search dossiers" placeholder="Search dossiers, operators, references…">
</form>
```

### With a clear button (consumer-managed)

```html
<form role="search" class="dgo-search">
  <svg class="icon-sm" aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-search"/></svg>
  <input type="search" aria-label="Search" value="dossier 0421">
  <button type="button" class="dgo-btn dgo-btn--icon dgo-btn--ghost" aria-label="Clear search">
    <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-x"/></svg>
  </button>
</form>
```

### Inside a real composition

See the **Operator dashboard** and **Citizen portal** patterns at the bottom of the
showcase (`index.html`) — every shipped family appears in at least one of them.

---

## 13 · Anti-patterns

- ❌ A magnifying-glass icon dropped inside a plain `.dgo-input` as a
  background-image or left-padding hack.
  ✅ Use the `.dgo-search` wrapper — the icon is a real, flex-laid child with the
  correct gap and colour.
- ❌ `<input type="text">` instead of `<input type="search">`.
  ✅ `type="search"` gives native `Escape`-to-clear and the platform clear control.
- ❌ Restoring an `outline` on the inner input.
  ✅ The wrapper owns focus via `:focus-within`; a second ring is visual noise.
- ❌ A `.dgo-search` nested inside a `.dgo-cmdk`.
  ✅ The palette is already a search surface — pick one.

Cross-link: `docs/12-anti-patterns.md`.

---

## 14 · Migration

v2.0 introduces this family. No migration from a v2 predecessor. For the v1 → v2
mapping (`dgo_digital_ops/` → `dgo-design-system/`), see `MIGRATION.md`.

| Version | From | To | Codemod |
|---|---|---|---|
| 1.0 → 2.0 | `[v1 class — confirm]` | `.dgo-search` | `[v1 maintainers: confirm regex]` |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit (Safari) | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `:focus-within` | **required** | Without it the wrapper never shows focus (the input's own outline is removed) — a hard requirement. |
| `color-mix()` (focus halo) | required | Halo absent; brand-green border still shows focus. |
| `<input type="search">` Esc-to-clear | required | Field still works; loses native clear. |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`. Until then this list is
aspirational. Verify the `<search>` / `role="search"` landmark is announced and the
`aria-label` (not the placeholder) names the field.

---

## 16 · Open questions

- **The focus halo is expressed as literals** (`0 0 0 3px` + inline `color-mix`)
  rather than a shared `--dgo-focus-ring`-style token (§5). Promoting the input
  family's ring to one token would let search, input, and select share a single
  source of truth.
- **No built-in autocomplete / suggestions dropdown.** A type-ahead list is composed
  by the consumer (a `.dgo-menu` or `.dgo-cmdk--inline` anchored below the field),
  not shipped inside `.dgo-search`. A shipped combobox variant is a v2.x candidate.
- **No shipped clear button.** The trailing clear is consumer-rendered (§7); a
  `.dgo-search__clear` element that shows/hides on value would standardise it.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Naked input in a bordered wrapper with a leading search icon. |
| `v2.1` | §11-template doc fill landed; CSS unchanged. |
| `v2.1` | Doc deepened against shipped CSS (2026-06-05): documented the "naked input in a bordered wrapper" architecture and the `:focus-within` ring (focus lives on the wrapper, not the input); corrected §3 (no sm/lg sizes — the one flex is the **density-driven** `--dgo-input-h`, 40→32px) and §6 (padding is primitive, not component-tier); logged the literal focus-halo recipe as a token-discipline note. No CSS change. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[product-team-owner-on-record]`
- **Last review date:** `2026-06-05`
- **Next scheduled review:** `2026-12-05` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
