# `table`

> Tabular data — rows, columns, headers, sortable affordances. The shipped
> component covers **read-only and simply-sortable** tables built on native
> HTML `<table>` markup. Interactive grids (editable cells, focusable rows
> with the WAI-ARIA grid pattern) are not in v2.0 — they're a coverage gap
> tracked in §16 and §00 §6.

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/table.css`
**Selector namespaces:** `.dgo-table-wrap`, `.dgo-table`, `.dgo-table__num`, `.dgo-table__sort` (BEM)

---

## 1 · Anatomy

The shipped CSS styles a native HTML table. The DOM hierarchy:

- `.dgo-table-wrap` — the outer container. `border + border-radius + overflow:
  clip + background`. Owns the visible "card" chrome around the table; the
  table itself doesn't carry the border.
- `<table class="dgo-table">` — the table element. `inline-size: 100%; border-
  collapse: collapse`.
  - `<caption>` — optional. Styled by `base.css`; the system convention is to
    use a heading immediately above the wrap when possible (the `<caption>`
    is then redundant and can be `.dgo-visually-hidden`).
  - `<thead>` — header row container. Background `--dgo-table-header-bg`
    (sunken surface).
    - `<tr>` — single row.
      - `<th scope="col">` — column header. ALL CAPS, `--dgo-tr-wide` tracking,
        `--dgo-type-caption` size. May contain a `<button class="dgo-table__sort">`
        for sortable headers.
  - `<tbody>` — body. Striped variant alternates row backgrounds.
    - `<tr>` — data row. `:hover` rebinds row td-background to
      `--dgo-table-row-hover` (soft green tint, `--dgo-green-50`).
      - `<th scope="row">` — row header (first column when rows are
        identified by reference). Inherits cell styling.
      - `<td>` — data cell. Block-size 44px (`--dgo-table-row-h`), vertical-
        align middle, border-block-end 1px.
- `.dgo-table__num` — utility class on `<td>` / `<th>` for numeric cells:
  `text-align: end; font-variant-numeric: tabular-nums`. Reach for this on
  every column where digits align matters.
- `.dgo-table__sort` — the in-header sort trigger. A `<button>` that contains
  the column label and (consumer-supplied) sort glyph.
- `.dgo-table--striped` — modifier on `.dgo-table` for zebra striping.

### Slot policy

| Slot | Allowed content |
|---|---|
| `<th scope="col">` | Plain text label; optionally wrap in `<button class="dgo-table__sort">` for sortable; the visible sort glyph is supplied by the consumer (a chevron `<svg>` with `aria-hidden="true"`). The shipped CSS has no glyph. |
| `<td>` (data cell) | Plain text, numbers, a single `.dgo-badge`, a `.dgo-chip`, a `.dgo-btn--ghost dgo-btn--sm` for inline actions. **Not** complex layouts — keep cells scannable. |
| Row-selection column (when used) | First column `<th>` with `aria-label="Select"` (or `.dgo-visually-hidden` heading); each cell `<td>` carries a `<input type="checkbox">` with `aria-label="Select [row identifier]"`. |

---

## 2 · Variants

| Class | Description | Use when |
|---|---|---|
| *(default)* | Plain rows; hover background; full-width border. | Most cases. |
| `.dgo-table--striped` | Even rows get `--dgo-color-surface-sunken` background. | Dense tables (>15 rows) where row tracking benefits from alternation. Don't use on tables with `:hover` only — the hover tint must remain distinguishable; in shipped tokens `--dgo-green-50` clears `--dgo-color-surface-sunken`, so it does. |

### Not shipped

- **Compact-density visual variant.** No `.dgo-table--dense` class. Density
  adjusts via the global `[data-density="compact"]` attribute — see §3.
- **Bordered / borderless** modifiers. The wrap owns the outer border;
  internal borders are between rows only (`border-block-end` on `td`/`th`).
  No vertical separators between columns — the system relies on alignment
  and tabular numerics for column legibility instead.
- **Sticky header**, **sticky first column**, **expandable rows**. All
  unshipped. Tracked in §16.

---

## 3 · Sizes & density

| Measure | Token | Default |
|---|---|---:|
| Row block-size | `--dgo-table-row-h` | `44px` |
| Cell padding-inline | `--dgo-table-cell-px` | `var(--dgo-s-3)` (12px) |
| Header bg | `--dgo-table-header-bg` | `--dgo-color-surface-sunken` |
| Header fg | `--dgo-table-header-fg` | `--dgo-color-fg-muted` |
| Row hover bg | `--dgo-table-row-hover` | `--dgo-green-50` |
| Border | `--dgo-table-border` | `--dgo-color-border-default` |

### Touch-target floor

The 44px row height **meets** the §04 touch-target floor. Interactive controls
inside rows (action buttons, checkboxes) should respect their own touch-target
contracts — typically `.dgo-btn--sm` (32px) inside a 44px row, with an
extended hit region. See `button.md` §3.

### Density behaviour

The shipped CSS does **not** re-bind `--dgo-table-row-h` or `--dgo-table-cell-px`
under `[data-density="compact"]`. A compact-mode table is identical to a
comfortable-mode one.

If your operational surface needs dense rows (32 / 36 px) to fit more on
screen, override at the table:

```css
.compact-table {
  --dgo-table-row-h: 36px;
  --dgo-table-cell-px: var(--dgo-s-2);
}
```

…**but** be aware: rows below 44px no longer meet the touch-target floor for
interactive cells. Use only on keyboard/mouse surfaces.

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Default cell | `td`, `th` | Border-block-end 1px | — |
| Row hover | `tbody tr:hover td` | Background → `--dgo-table-row-hover` | mouse |
| Last row | `tbody tr:last-child td` | Border-block-end removed (cleans up the wrap's bottom edge) | — |
| Striped even rows | `.dgo-table--striped tbody tr:nth-child(even) td` | Background → `--dgo-color-surface-sunken` | data |
| Numeric column | `.dgo-table__num` | `text-align: end; font-variant-numeric: tabular-nums` | data |
| Sort trigger | `.dgo-table__sort` | Inline-flex; inherits color; cursor pointer | data |
| Sort active (ascending/descending) | `<th aria-sort="ascending">` / `"descending"` | **Not shipped.** Consumer adds the glyph rotation / colour via their own CSS keyed off `aria-sort` | data |

### What the shipped CSS does NOT include

- A `:focus-visible` rule on the sort button. It inherits from `base.css`'s
  global rule. Verify on first integration; track if needed.
- An active-sort visual cue. `aria-sort="ascending"` / `"descending"` /
  `"none"` is set by consumer JS; the shipped CSS doesn't react to it.
  Consumer-side, add:

  ```css
  th[aria-sort="ascending"]  .dgo-table__sort-glyph { transform: rotate(0); }
  th[aria-sort="descending"] .dgo-table__sort-glyph { transform: rotate(180deg); }
  th[aria-sort="none"]       .dgo-table__sort-glyph { opacity: 0.4; }
  ```

- A row-selected state. Native `<input type="checkbox" checked>` is fine; if
  the row needs a tinted background when selected, that's consumer CSS.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-table-row-h` | `44px` | — |
| `--dgo-table-cell-px` | `var(--dgo-s-3)` | — |
| `--dgo-table-header-bg` | `var(--dgo-color-surface-sunken)` | theme:dark, theme:hc |
| `--dgo-table-header-fg` | `var(--dgo-color-fg-muted)` | — |
| `--dgo-table-row-hover` | `var(--dgo-green-50)` | theme:dark (deeper tint), theme:hc |
| `--dgo-table-border` | `var(--dgo-color-border-default)` | theme:hc → `#000` |

### Tier 2 — Semantic tokens (read directly)

- `--dgo-color-surface-raised` (the table-wrap background)
- `--dgo-color-surface-sunken` (the striped-row background)
- `--dgo-color-fg-default` (cell text)
- `--dgo-radius-card` (the wrap border-radius)
- `--dgo-type-body-sm` (cell font-size)
- `--dgo-type-caption` (header font-size)
- `--dgo-wt-600` (header weight)
- `--dgo-tr-wide` (header letter-spacing — needed because headers are uppercase)
- `--dgo-s-1`, `--dgo-s-3` (spacing)

### Tier 1 — Primitives

- `--dgo-green-50` — consumed via `--dgo-table-row-hover`. This is **Tier 1
  consumption from Tier 3**, which is the intended chain. Components do not
  read `--dgo-green-50` directly; they read `--dgo-table-row-hover`.

---

## 6 · Layout & sizing

- **Inline-size:** the table is `inline-size: 100%` and the wrap is a normal
  block element — together, the table fills its parent's inline-size.
- **Block-size:** intrinsic from row count × row height. No max-block-size or
  scroll behaviour shipped. For long tables, the consumer wraps the wrap in
  a scroll container or paginates with `.dgo-pagination` below.
- **Column widths:** intrinsic. The browser's table layout algorithm sizes
  columns to their content. To pin a column width (e.g. a fixed 80px "Status"
  column), set `inline-size` on the `<th>` directly:

  ```html
  <th scope="col" style="inline-size: 80px">Status</th>
  ```

  Avoid this if you can — translation expansion can blow through a fixed
  width. Prefer letting the browser size and using `white-space: nowrap` on
  columns that must stay single-line.
- **Border-collapse:** `border-collapse: collapse`. This is what makes the
  per-cell `border-block-end` lines into a single shared row separator.
- **Container query:** none on the table itself. Wrap-level container queries
  for responsive table treatments (collapse to card list on narrow widths)
  are the consumer's call — not shipped.

---

## 7 · Composition

- **Contains:** `.dgo-badge` (status), `.dgo-chip` (filters in cells — rare),
  `.dgo-btn--ghost dgo-btn--sm` and `.dgo-btn--icon` (row actions),
  `<input type="checkbox">` (row selection), `<a>` (linked cell content),
  plain text, numbers, dates.
- **Contained by:** `.dgo-card`, `.dgo-modal__body` (rare — modals are
  decisions; a table in a modal is usually a preview), in-flow page
  sections.
- **Conflicts with:**
  - **Two `.dgo-table-wrap` siblings without a heading or separator
    between them.** They read as one table. Add a heading or border.
  - **Buttons inside cells that open menus.** Possible, but the menu's
    z-index (popover layer = 1100) clears the table, and the table-wrap's
    `overflow: clip` does **not** clip an absolutely-positioned popover
    portal-mounted to the body. If you mount the popover inline (inside
    the cell), `overflow: clip` clips it. Portal popovers, please.

---

## 8 · Behaviour (JS contract)

The shipped CSS is presentation only. Sort, pagination, selection, filtering,
expansion are all consumer-implemented.

### Attributes the component reads

| Attribute | Carrier | Type | Meaning |
|---|---|---|---|
| `aria-sort` | `<th>` | `"ascending" \| "descending" \| "none"` | Consumer-set on sortable columns; the shipped CSS doesn't react but AT does. |
| `aria-rowcount` | `<table>` | integer | Required if the visible rows are paginated — gives the total. |
| `aria-rowindex` | `<tr>` | integer | Required for each row when paginated, so AT users know "row 23 of 1200" not "row 3 of 20". |

### Events the consumer fires

| Event | When | Payload |
|---|---|---|
| `table:sort` | A sortable header is activated | `{ column, direction }` |
| `table:select` | A row's selection state changes | `{ rowId, selected }` |
| `table:rowAction` | A row's primary action is invoked | `{ rowId }` |

### Focus management

- **Read-only table:** cells are not focusable. `Tab` skips into the table
  region, then to the next focusable on the page.
- **Sortable headers:** the sort `<button>` is focusable. Standard `Tab`
  order across all sort buttons; `Enter` / `Space` activates.
- **Row selection checkboxes:** each `<input type="checkbox">` is focusable.
- **Row actions inside cells:** each `<button>` is focusable. The system
  convention is to put row actions in the last column; users Tab through
  rows action-by-action.

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| `Tab` | Move focus into the table to the next focusable child (sort button, checkbox, link, row action). Then to the next focusable beyond the table. |
| `Shift+Tab` | Reverse. |
| `Enter` / `Space` on a sort button | Toggle sort. The shipped pattern is three-state: ascending → descending → none → ascending. Some surfaces ship two-state (asc → desc → asc); document which you ship. |
| `Enter` / `Space` on a checkbox | Toggle row selection. Native. |
| `Enter` / `Space` on a row action button | Activate. Native. |
| Arrow keys | **Not bound** by the shipped pattern. A read-only table is not a grid; arrow keys are reserved for grid widgets. See §16. |

### What's NOT in scope here

The WAI-ARIA **grid** pattern — `role="grid"`, focusable cells, two-dimensional
arrow-key navigation, range selection — is a different component and a
different ARIA contract. The shipped table is **a table**: `role="table"` is
implicit, cells are not focusable, focus only lands on interactive children.
If your surface needs a true grid, the §16 coverage gap applies.

Cross-link: §08 §18.

---

## 10 · ARIA

The native `<table>` element carries `role="table"` implicitly. The shipped
component lays on top of that.

| Attribute | Carrier | Value | When |
|---|---|---|---|
| `<caption>` | inside `<table>` | descriptive | Required unless a heading immediately precedes the table-wrap. |
| `scope="col"` | `<th>` in `<thead>` | always | Required — tells AT which header applies to which column. |
| `scope="row"` | `<th>` first cell in `<tbody>` row | when the row has a header cell | Required when row headers exist. |
| `aria-sort` | sortable `<th>` | `"ascending" \| "descending" \| "none"` | always for sortable columns. Update on toggle. |
| `aria-rowcount` | `<table>` | integer | When paginated. |
| `aria-rowindex` | `<tr>` | integer | When paginated. |
| `aria-label` or `aria-labelledby` | `<table>` | descriptive | When there's no `<caption>` and no preceding heading. |
| Row-select checkbox label | `<input>` | `aria-label="Select [row reference]"` | Required when row selection is offered. |
| Select-all checkbox | `<input>` in header | `aria-label="Select all rows"`; also handle `aria-checked="mixed"` for partial selection | Required when select-all is offered. |

### Empty state

An empty table should **not** be a hidden table or a missing `<tbody>`. Render
a single row spanning all columns:

```html
<tbody>
  <tr>
    <td colspan="5" role="status">
      <div class="dgo-empty-state">
        <h3>No dossiers match the filters.</h3>
        <p>Clear filters to see all dossiers.</p>
      </div>
    </td>
  </tr>
</tbody>
```

The `role="status"` makes the empty announcement live so a filter change
announces "No dossiers match the filters" to AT users.

### Forced-colours behaviour

- The row hover background (`--dgo-green-50`) strips under
  `forced-colors: active`. The hover state is not communicated visually in
  HC. This is acceptable — table hover is mouse-only ambience, not a
  load-bearing cue.
- The `--dgo-table-border` re-binds to `ButtonText`. The wrap's outer border
  remains visible.
- Header text (uppercase + `--dgo-tr-wide` tracking) reads fine in HC; the
  text rebinds to `CanvasText`.

### Reduced-motion behaviour

The table has no transitions or animations. Reduced motion is a no-op.

---

## 11 · Internationalisation

- **Diacritic safety:** cells use `--dgo-type-body-sm` (12px) at body line-
  height. Cleared for Yorùbá / Hausa / Igbo body-size diacritics. **The
  uppercase + wide-tracking** header style is multilingual-safe — see §03
  *§ West African language coverage* on `text-transform: uppercase`. (Latin
  Extended-A upper-case forms preserve the combining marks.)
- **RTL:** `text-align: start` on `<th>` flips automatically to right-align
  under `[dir="rtl"]`. The numeric class `.dgo-table__num` uses
  `text-align: end` — also flipping correctly. **Column order** under RTL
  reads right-to-left: the leftmost column visually is the last in source
  order. The browser handles this for native tables; don't reverse the
  columns in markup.
- **Numeric cells** stay LTR via the Unicode Bidi algorithm — digits flow
  left-to-right inside an RTL row. `font-variant-numeric: tabular-nums`
  preserves column alignment.
- **Translation expansion:** intrinsic column sizing absorbs Yorùbá / Hausa
  growth. **Don't** pin column widths unless the content has a fixed format
  (date, reference number). Headers that are long in translation may wrap
  inside the `<th>` — that's fine; the row sizes vertically to fit.
- **Date and currency rendering:** always via `Intl.DateTimeFormat` /
  `Intl.NumberFormat`. The cell content arrives pre-formatted; the table
  doesn't format. See §09 §6.

---

## 12 · Examples

### Basic — read-only

```html
<div class="dgo-table-wrap">
  <table class="dgo-table" aria-label="Recent dossiers">
    <caption class="dgo-visually-hidden">Recent dossiers, last 30 days</caption>
    <thead>
      <tr>
        <th scope="col">Reference</th>
        <th scope="col">Petitioner</th>
        <th scope="col">Status</th>
        <th scope="col" class="dgo-table__num">Days open</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">24-0193</th>
        <td>A. Adekunle</td>
        <td><span class="dgo-badge dgo-badge--status-pending">Pending</span></td>
        <td class="dgo-table__num">4</td>
      </tr>
      <tr>
        <th scope="row">24-0192</th>
        <td>O. Olawale</td>
        <td><span class="dgo-badge dgo-badge--status-replied">Replied</span></td>
        <td class="dgo-table__num">7</td>
      </tr>
    </tbody>
  </table>
</div>
```

### With sortable headers

```html
<div class="dgo-table-wrap">
  <table class="dgo-table" aria-label="All dossiers">
    <thead>
      <tr>
        <th scope="col" aria-sort="ascending">
          <button class="dgo-table__sort" type="button">
            Reference
            <svg aria-hidden="true" width="12" height="12" class="dgo-table__sort-glyph">
              <use href="../../assets/icons/sprite.svg#i-chevron-up"/>
            </svg>
          </button>
        </th>
        <th scope="col" aria-sort="none">
          <button class="dgo-table__sort" type="button">
            Petitioner
            <svg aria-hidden="true" width="12" height="12" class="dgo-table__sort-glyph">
              <use href="../../assets/icons/sprite.svg#i-chevrons-up-down"/>
            </svg>
          </button>
        </th>
        <th scope="col">Status</th>
        <th scope="col" class="dgo-table__num" aria-sort="none">
          <button class="dgo-table__sort" type="button">
            Days open
            <svg aria-hidden="true" width="12" height="12" class="dgo-table__sort-glyph">
              <use href="../../assets/icons/sprite.svg#i-chevrons-up-down"/>
            </svg>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- rows -->
    </tbody>
  </table>
</div>
```

### Striped + row selection

```html
<div class="dgo-table-wrap">
  <table class="dgo-table dgo-table--striped" aria-label="Filtered dossiers">
    <thead>
      <tr>
        <th scope="col" style="inline-size: 44px">
          <span class="dgo-visually-hidden">Select</span>
          <input type="checkbox" aria-label="Select all rows">
        </th>
        <th scope="col">Reference</th>
        <th scope="col">Petitioner</th>
        <th scope="col">Status</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="checkbox" aria-label="Select dossier 24-0193"></td>
        <th scope="row">24-0193</th>
        <td>A. Adekunle</td>
        <td><span class="dgo-badge dgo-badge--status-pending">Pending</span></td>
        <td>
          <button class="dgo-btn dgo-btn--ghost dgo-btn--sm">View</button>
          <button class="dgo-btn dgo-btn--ghost dgo-btn--sm dgo-btn--icon"
                  aria-label="More actions for dossier 24-0193">
            <svg aria-hidden="true"><use href="../../assets/icons/sprite.svg#i-more"/></svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Empty state inside the table

```html
<div class="dgo-table-wrap">
  <table class="dgo-table" aria-label="Filtered dossiers">
    <thead>…</thead>
    <tbody>
      <tr>
        <td colspan="5" role="status" style="block-size: 200px; text-align: center">
          <div class="dgo-empty-state">
            <h3>No dossiers match the filters.</h3>
            <p>Clear filters to see all dossiers.</p>
            <button class="dgo-btn dgo-btn--secondary dgo-btn--sm">Clear filters</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 13 · Anti-patterns

- ❌ A `<div>` grid faking a table.
  ✅ Real `<table>`. Native tables carry the right ARIA, the right keyboard,
  the right screen-reader header-cell pairing. Reach for `role="grid"` only
  when you need cell-level focus and arrow-key navigation — not as a
  shortcut to avoid `<table>`.

- ❌ Empty `<tbody>` when there are no results.
  ✅ Single row with `colspan` + `role="status"` empty-state.

- ❌ `aria-sort` updated visually but not on the attribute.
  ✅ The attribute is the AT contract. The glyph is decorative. Update both.

- ❌ Per-row drop-down menu opened inline (overflow clipped by the wrap).
  ✅ Portal the menu to `<body>` and position via JS (`getBoundingClientRect()`).
  The `overflow: clip` on the wrap is intentional — it keeps the rounded
  corners; in-flow popovers fight it.

- ❌ Hover-only row actions (visible only on `:hover`).
  ✅ Visible by default at touch sizes. Hover-revealed actions are invisible
  on mobile and undiscoverable by keyboard users.

- ❌ Truncating reference numbers with `…`.
  ✅ Reference numbers are identifying. Wrap or expand the column. Use
  truncation on free-text descriptions only.

- ❌ Many small action buttons in a column (`View | Edit | Archive | Send |
  Delete`).
  ✅ One primary action button + a "More" menu button for the rest. Five
  buttons per row × twenty rows = 100 buttons; the page becomes unscannable.

Cross-link: §08 §18; §12-anti-patterns *"Div-grid faking a table"*.

---

## 14 · Migration

`v2.0` is the first shipped version. No migration history.

**Known limitations to address in a future minor:**

| Limitation | Fix | Track |
|---|---|---|
| No active-sort visual cue in shipped CSS | Add rules keyed off `aria-sort` (glyph rotation + colour) | v2.1 |
| `--dgo-green-50` consumed via the table-row-hover token reads as a Tier-1-via-Tier-3 chain | Acceptable per the cascade rules; document the pattern | — |
| No sticky-header support | Add `.dgo-table--sticky-head` with `position: sticky` on `<thead>` + brief shadow on scroll | v2.1 (high priority) |
| No sticky-first-column support | Add `.dgo-table--sticky-col` | v2.2 |
| No responsive collapse-to-card pattern for narrow viewports | Add a container-query variant `.dgo-table--responsive` | v2.2 |
| No row-selected state styling | Add `tr[data-selected="true"]` rule | v2.1 |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| Native `<table>` | required | — |
| `border-collapse: collapse` | required | — |
| `text-align: start` / `end` (logical) | required | — |
| `font-variant-numeric: tabular-nums` | required | falls back to non-tabular digits; columns may not align perfectly. The shipped table fonts (Inter, Verdana) both ship tabular figures. |
| `overflow: clip` on the wrap | required | falls back to `overflow: hidden` semantically — same visual, slightly different reflow behaviour. |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari — known: VoiceOver announces `aria-sort` on
      focus of a sortable header.
- [ ] VoiceOver (iOS) + Safari — tables are usable via rotor "table" item;
      cell navigation is row-by-row.
- [ ] NVDA + Firefox — table mode (`T` to next table; arrow keys inside)
      works on native `<table>` markup.
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome — JAWS reads column header on each cell as the user moves
      vertically; this is what `scope="col"` enables.
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`.

---

## 16 · Open questions

- **Sticky header.** The highest-asked-for v2.1 feature. Promote.
- **Sticky first column.** Useful for wide reports; harder to ship cross-
  browser because of `border-collapse` interactions. Track for v2.2.
- **Responsive collapse-to-card.** On narrow viewports, the table re-flows
  into a stack of cards (one per row) where each cell becomes a label/value
  pair. Hard to do well; harder to do without breaking screen-reader
  table-mode. Track for v2.2 with prototype.
- **WAI-ARIA grid** (focusable cells, arrow-key navigation, range selection).
  Coverage gap noted in §00 §6. When promoted, it's a **different component**,
  not a variant of `.dgo-table`. Likely `.dgo-grid` with its own file.
- **Row expansion** (twist arrow to reveal a sub-table or detail panel
  inside a row). Not shipped. Promote when first consumer needs it.
- **Bulk-actions toolbar** that appears when rows are selected. Pattern;
  may live as a `.dgo-table__bulk-actions` element promoted on `[data-has-
  selection="true"]`. Track.
- **Pagination integration.** `.dgo-pagination` ships as a sibling component;
  the table doesn't know about it. Document the recommended pairing
  (pagination *below* the wrap, `aria-rowcount` set on `<table>`).

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. Read-only and simply-sortable native tables. Striped variant. No sticky, no grid, no responsive collapse. |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[data-display team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
