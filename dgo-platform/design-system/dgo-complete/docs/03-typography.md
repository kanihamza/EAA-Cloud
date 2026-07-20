# 03 · Typography

> Four families, a 1.200 modular scale, six weights, six line-heights, six tracking
> stops. Everything you read in DGO falls inside this matrix — anything that doesn't
> is a bug or an asset (logo lockup, coat-of-arms set in metal).

The system ships **four type families**, all declared in `tokens.primitive.css` and
exposed through semantic intent tokens in `tokens.semantic.css`. Web fonts load
through a single `@import` line in `styles/base.css`:

```css
@import url('https://fonts.googleapis.com/css2?
  family=Outfit:wght@400;500;600;700;800
 &family=Inter:wght@400;500;600;700
 &family=JetBrains+Mono:wght@400;600
 &display=swap');
```

(Whitespace added for clarity — the shipped line is unbroken.)

`Verdana` is intentionally **not** loaded — it's a fallback stack head and ships with
every shipping operating system. See *§ The body family: why Verdana* below.

---

## The four families

| Token | Stack head | When to use |
|---|---|---|
| `--dgo-family-display` | **Outfit** (400–800) | Display, headings, marketing-tier copy. The geometric voice. |
| `--dgo-family-sans`    | **Inter** (400–700)  | UI sans default: form labels, body in dense screens, menu items, button labels. |
| `--dgo-family-body`    | **Verdana**          | Long-form running body — memos, policy text, briefings, anything > ~80 words at body size. |
| `--dgo-family-mono`    | **JetBrains Mono** (400, 600) | Code blocks, `.dgo-kbd`, tabular figures inside data tables (via `.dgo-tabular-nums`). |

`base.css` sets `font-family: var(--dgo-family-sans)` on `html, body`, and rebinds
headings to `var(--dgo-family-display)`. Long-form views must opt **into**
`--dgo-family-body` on the prose container — it is not the global default.

---

## The size ramp

Ten stops, all driven by a single 1.200 ratio (the "minor third"). Stops below 16px
are caption / dense-table territory; stops above 33px are display only.

| Primitive | Px | Intent token | Used by |
|---|---:|---|---|
| `--dgo-size-12` | 12 | `--dgo-type-body-sm`, `--dgo-type-caption` | Captions, helper text, badges, sidebar items, table cells in compact density. |
| `--dgo-size-14` | 14 | `--dgo-type-body`         | Default UI body (`html` `font-size`), labels, buttons, table cells. |
| `--dgo-size-16` | 16 | `--dgo-type-body-lg`      | Long-form body. `h5` / `.dgo-h5`. |
| `--dgo-size-19` | 19 | `--dgo-type-h4`           | `h4`, card titles, list-row primary text. |
| `--dgo-size-23` | 23 | `--dgo-type-h3`           | `h3`, modal title, drawer title. |
| `--dgo-size-28` | 28 | `--dgo-type-h2`           | `h2`, section header on a content page. |
| `--dgo-size-33` | 33 | `--dgo-type-h1`           | `h1`, page title. |
| `--dgo-size-40` | 40 | `--dgo-type-display`      | `.dgo-display`, marketing or landing hero. |
| `--dgo-size-48` | 48 | `--dgo-type-display-xl`   | `.dgo-display-xl`, hero on a campaign page. |
| `--dgo-size-60` | 60 | `--dgo-type-display-xxl`  | `.dgo-display-xxl`, ops-floor wall display only. |

**Pixel floor.** Body copy never goes below `--dgo-size-12`. Caption copy never goes
below 11px (we don't ship an 11px token). For wall-mounted displays where text is
read across 4–6 m, start at `--dgo-size-40` and let the room dictate up from there.

---

## Weights & line-heights & tracking

Three orthogonal axes. All three are tokens — components never hard-code numeric
weight, line-height, or letter-spacing.

| Axis | Tokens |
|---|---|
| Weight | `--dgo-wt-300` `400` `500` `600` `700` `800` |
| Line-height | `--dgo-lh-100` `110` `120` `140` `150` `170` |
| Tracking | `--dgo-tr-tightest` (-0.02em) · `tight` (-0.01em) · `normal` (0) · `wide` (0.06em) · `wider` (0.12em) · `widest` (0.18em) |

### Default bindings (from `styles/base.css`)

| Role | Family | Weight | Line-height | Tracking |
|---|---|---|---|---|
| `html, body` | sans (Inter) | 400 | `--dgo-lh-150` | normal |
| `h1`–`h6`, `.dgo-display*` | display (Outfit) | `--dgo-wt-700` (display-xxl/xl use 800) | `--dgo-lh-120` | `--dgo-tr-tight` (display-xxl/xl use `tightest`) |
| `p`, `.dgo-body` | inherits sans | 400 | `--dgo-lh-150` | normal |
| `.dgo-body-sm` | inherits sans | 400 | `--dgo-lh-140` | normal |
| `.dgo-caption`, `small` | inherits sans | 400 | `--dgo-lh-140` | normal |
| `.dgo-overline` | inherits sans | 600 | inherit | `--dgo-tr-widest` (uppercase) |
| `code`, `kbd`, `samp`, `pre` | mono (JetBrains Mono) | 400 | inherit | normal |

### Tracking guidance

- **Display & h1/h2** — `--dgo-tr-tight` (or `tightest` at 40px+). Large type
  opens up perceptually; tighten it back down.
- **Body** — `normal` (0). Verdana and Inter are designed to space themselves.
- **All-caps labels** (`.dgo-overline`, tab keys, `kbd`) — `--dgo-tr-widest`.
  All-caps without added tracking reads as a typo, not a label.
- **Tabular figures inside narrow columns** — `normal`. Tabular numerals already
  carry their own monospaced advance; do not add tracking on top.

---

## The body family: why Verdana

Verdana ships on every major OS at full glyph coverage including Latin Extended-A/B
(the West African diacritic ranges DGO needs), renders cleanly at 14–16 px on
low-DPI government-issue displays, and never blocks first paint on a stalled font
fetch — because it never has to fetch. Inter is the UI sans; Verdana takes over for
sustained reading.

To opt in:

```html
<article class="memo">
  <h1>Subject — Quarterly compliance brief</h1>
  <p>Long-form prose…</p>
</article>
```
```css
.memo p,
.memo li,
.memo blockquote { font-family: var(--dgo-family-body); }
```

Do **not** rebind `--dgo-family-body` to a loaded webfont. The whole reason it's in
the system is to absorb network failure and ship-vintage displays gracefully.

---

## West African language coverage

DGO ships across three working languages besides English: **Yorùbá**, **Hausa**, and
**Igbo**. Each lays a different demand on the typesetting stack. The shipped fonts
(Outfit, Inter, Verdana, JetBrains Mono) all cover the necessary Unicode ranges; the
risk is not coverage but **vertical clipping** of combining marks.

### Line-heights cleared for diacritics

The primitive `--dgo-lh-150` (1.5) and `--dgo-lh-170` (1.7) are the **only**
line-heights cleared for body-size combining-mark stacks. `--dgo-lh-120` is allowed
for display sizes (cap-height is so tall the marks have room regardless). Tighter
than 120 risks the top mark of `ǹ` or `ọ́` clipping into the descenders of the line
above.

| Where it appears | Min line-height |
|---|---|
| Display / heading (`--dgo-size-28` and up) | `--dgo-lh-120` |
| Body / list / table cell (`--dgo-size-16` and below) | `--dgo-lh-150` |
| Long-form prose | `--dgo-lh-170` recommended |

### Yorùbá — sample & risk

> **Ẹ ku àárọ̀. Ìròyìn òní ni pé Ẹ̀ka Ọ́fíìsì ti gba ìwé yín. Ìdáhùn yóò dé l'ọ́jọ́ kẹta.**

Risk surface:
- Sub-dots: `Ẹ` `ẹ` `Ọ` `ọ` `Ṣ` `ṣ` — descender region.
- Tone marks: acute `́`, grave `̀` — top of x-height.
- **Stacked marks** (e.g. `ọ́` = sub-dot + acute) are the worst case. They demand
  the full `--dgo-lh-150` cell.

A label like `Ọfíìsì` set in `--dgo-type-body` (14px) at `--dgo-lh-150` clears. Set
at `--dgo-lh-120` the top of the acute clips at most desktop zooms.

### Hausa — sample & risk

> **Sannu da zuwa. An karɓi takardarku. Amsa za ta zo a rana ta uku.**

Risk surface:
- Hooked letters: `ɓ` `ɗ` `ƙ` `ƴ` — glyphs sit at standard cap/x-height, no stacking
  hazard.
- Long vowels marked with macron in some orthographies: `ā ī ū` — single mark above,
  same height as Yorùbá acute.
- **Verdict:** Hausa is the easiest of the three to set. Any cleared line-height
  works.

### Igbo — sample & risk

> **Ndewo. Anyị anabatala akwụkwọ unu. Azịza ga-abịa n'ụbọchị nke atọ.**

Risk surface:
- Sub-dots on vowels: `Ị` `ị` `Ọ` `ọ` `Ụ` `ụ`.
- Tone marks (acute, grave, macron) — including over `n`: `ǹ` `ń`.
- **Stacked marks** again: `ụ́` `ọ̀`. Same `--dgo-lh-150` floor as Yorùbá.

### Implementation rules

1. **Never tighten line-height for headings carrying diacritics.** A two-line h2
   in Yorùbá at `--dgo-lh-120` clears; a three-line h2 at the same height risks
   the top of line 2's acute touching line 1's underdot. If translation might
   push to three lines, bump to `--dgo-lh-140`.
2. **Pseudo-element trims** (`::first-line`, drop caps, CSS `text-edge`) **strip
   combining marks**. Do not use them on multilingual content. The badge,
   tag, and `.dgo-overline` styles already avoid this.
3. **`text-transform: uppercase`** is fine — Yorùbá, Hausa, Igbo have full
   upper-case forms in Unicode. The transform preserves the combining marks.
4. **Truncation** with `text-overflow: ellipsis` is safe. Sub-dots that fall
   inside the truncated tail are clipped as part of the glyph, not orphaned.
5. **Word-break.** Use `overflow-wrap: anywhere` for proper-noun-heavy lists
   (place names, agency names) — do not use `word-break: break-all`; it breaks
   inside a diacritic stack.

---

## The intent ramp — by component

The intent tier (`--dgo-type-*`) is what components consume. Per shipped family:

| Component | Token | Resolved px |
|---|---|---:|
| Button (sm/md/lg) | `--dgo-type-body` | 14 |
| Input, Select, Textarea | `--dgo-type-body` | 14 |
| Search input | `--dgo-type-body` | 14 |
| Card title | `--dgo-type-h4` | 19 |
| Modal title | `--dgo-type-h3` | 23 |
| Drawer title | `--dgo-type-h3` | 23 |
| Badge / chip | `--dgo-type-caption` (12, via `--dgo-badge-fs`) | 12 |
| Tag | `--dgo-type-caption` | 12 |
| Table header | `--dgo-type-body-sm` | 12 |
| Table cell | `--dgo-type-body` | 14 |
| Sidebar item | `--dgo-type-body-sm` | 12 |
| Topbar | `--dgo-type-body` | 14 |
| Tabs trigger | `--dgo-type-body` | 14 |
| Toast / Alert body | `--dgo-type-body` | 14 |
| Tooltip | `--dgo-type-body-sm` | 12 |
| Breadcrumb | `--dgo-type-body-sm` | 12 |
| Empty-state title | `--dgo-type-h3` | 23 |
| Empty-state body  | `--dgo-type-body-lg` | 16 |
| Metric value | `--dgo-type-h1` or `--dgo-type-display` | 33 / 40 |
| Metric label | `--dgo-type-caption` w/ overline tracking | 12 |
| Code / Kbd | inherits, 0.92 em | ≈ 13 |

If a value isn't in this table, it doesn't exist as a component-level type binding
yet. **Don't invent one inline** — add it to `tokens.component.css`.

---

## Type pairings (recipes)

Three pairings cover ~95% of compositions:

### 1. Display pair — landing / hero
```
.dgo-display      (Outfit 700, 40px, lh-120, tracking-tight)
.dgo-body-lg      (Inter 400, 16px, lh-150)
```

### 2. Page pair — application page
```
h1                (Outfit 700, 33px, lh-120, tracking-tight)
p / .dgo-body     (Inter 400, 14px, lh-150)
```

### 3. Memo pair — long-form prose
```
h2                (Outfit 700, 28px, lh-120, tracking-tight)
.memo p           (Verdana 400, 16px, lh-170)
```

Anything else is custom — and if you find yourself writing custom pairings often,
the next entry to `tokens.component.css` is probably yours.

---

## Anti-patterns

- ❌ Setting `font-size` in `em` to "scale with parent". The intent ramp is a fixed
  ladder; em-scaling reintroduces drift the ramp was designed to eliminate.
- ❌ Loading a fourth webfont. Stack head substitution (`Verdana → DejaVu Sans → sans`)
  is the right path when a face is missing. Adding a fourth loaded family taxes
  first paint and breaks the audit assumption that all type is in four families.
- ❌ `font-weight: bold` on body. `<strong>` already binds to `--dgo-wt-600`; the
  shipped strong rule is in `base.css`. `bold` resolves to 700, which is heading
  weight, not emphasis weight.
- ❌ Tightening line-height below `--dgo-lh-150` on multilingual body copy. See
  *§ West African language coverage*.
- ❌ Italicising Yorùbá. The Latin Extended-A italic glyphs in our shipped families
  do not redraw the sub-dot — they slant it, which reads as a different letter at
  small sizes. Use weight or color for emphasis instead.

---

## Open questions (for v2.2)

- A **fluid type** scale (`clamp()`-based) is not shipped. Consoles run fixed-zoom;
  the discrete ramp wins. Reconsider if we add a public-facing surface.
- An **arabic / RTL family** is not shipped. Igbo and Hausa are LTR; this only
  becomes a question if DGO grows a partner-agency surface in Arabic. Cross-ref
  §09-i18n-rtl (Turn 4).
