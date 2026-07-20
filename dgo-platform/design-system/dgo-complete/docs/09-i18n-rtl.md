# 09 · Internationalisation & RTL

> DGO serves Nigerian federal operations in **four working languages** (English,
> Yorùbá, Hausa, Igbo) and is **structurally prepared** for partner-agency
> surfaces that may add an RTL script (Arabic). This document is the contract for
> both — what's tested, what's prepared-but-not-tested, and what the system
> refuses to do.

Cross-references: §03-typography (per-language type risk surface), §04-spacing-grid
(logical properties), §08-accessibility (`lang` attribute, focus management under
RTL), §10-content-voice (the register itself).

---

## 1 · Supported languages

| Language | BCP-47 tag | Script | Direction | Status |
|---|---|---|---|---|
| English (Nigerian) | `en-NG` | Latin | LTR | **Primary.** Authoring language. |
| Yorùbá | `yo` | Latin (with diacritics) | LTR | **Supported.** Glyph coverage verified in shipped fonts. Translation pipeline owned by `[NITDA i18n: confirm vendor]`. |
| Hausa | `ha` | Latin (with hooked consonants) | LTR | **Supported.** As above. |
| Igbo | `ig` | Latin (with diacritics) | LTR | **Supported.** As above. |
| Arabic (any locale) | `ar`, `ar-NG` | Arabic | RTL | **Prepared.** No translated content shipped; the system's CSS uses logical properties throughout so an RTL surface lays out correctly on day one of content arriving. |

**Hausa in Ajami script** (the Arabic-derived script used historically for Hausa)
is **not** supported in v2.x. The shipped fonts (Outfit, Inter, Verdana, JetBrains
Mono) carry no Arabic glyph coverage; introducing it requires a fifth font family
and a translation vendor for the script variant. Out of scope.

---

## 2 · The `lang` attribute is load-bearing

Set `lang` on the `<html>` element and **on any inline span whose language
differs from the document**. This is not cosmetic — it drives:

- The screen reader's pronunciation engine (a Yorùbá tone mark read in English
  TTS is a different word).
- Font-feature selection (Latin Extended-A diacritic substitution).
- Hyphenation and line-break behaviour (`hyphens: auto` consults `lang`).
- `:lang()` selectors in component CSS for language-specific tweaks.
- Search-engine indexing.

```html
<html lang="en-NG" dir="ltr">
  <body>
    <p>The agency's name in Yorùbá is
       <span lang="yo">Ẹ̀ka Ìmùdàgbà Ìmọ̀ Ìròyìn Orílẹ̀-èdè Nàìjíríà</span>.</p>
  </body>
</html>
```

`:lang(yo)` will match the `<span>`; `:lang(en-NG)` will match the `<p>`. This
mechanism is how language-specific line-height bumps and font-feature overrides
land without forking templates.

---

## 3 · Translation expansion

Translation length grows. The shipped layouts must absorb it without truncation,
overflow, or layout collapse. Expansion factors used in DGO load testing:

| Language | Expected expansion vs English | Notes |
|---|---:|---|
| Yorùbá | +20% to +35% | Diacritics add visual weight; multi-word equivalents for English compounds. |
| Hausa | +10% to +20% | Generally compact; longer compounds in formal register. |
| Igbo | +20% to +30% | Similar profile to Yorùbá. |
| Arabic (when arriving) | -10% to +25% | Highly script-dependent; allow same envelope as Yorùbá to be safe. |

### Implementation rules

1. **No fixed-width buttons that fit English exactly.** Buttons size to their
   content with `--dgo-btn-px-*` padding either side. A "Submit" → "Fi-ranṣẹ́"
   change must not clip.

2. **Two-line caps on display headings are explicit, not accidental.** If a
   heading is meant to fit one line in English, it will wrap in Yorùbá. Either:
   - Allow it to wrap (most cases — `--dgo-lh-120` clears for headings, see §03).
   - Use `font-size: clamp()` between two tokens **only** at the display tier
     (`--dgo-type-display-xl` ↔ `--dgo-type-display`). Body tier is fixed.

3. **Sidebar item labels** must not truncate by default. The shipped
   `.dgo-sidebar__item` wraps to two lines; further wrapping triggers an audit
   review (the route name is probably too long). Translation-expanded labels
   should still fit two lines at `--dgo-fs-body-sm` × `--dgo-lh-140`.

4. **Table headers** use `min-inline-size` not `inline-size`. A "Date of birth"
   header becoming "Ọjọ́ ìbí" (shorter) or "Tarihin haihuwa" (longer) reorganises
   column widths; let the table re-flow.

5. **Form labels** sit above their input, not beside it. A beside-label layout
   that works in English collapses in Yorùbá when the label is longer than the
   input. Above-label is the system default; we document this to keep it the
   default.

6. **Error and helper text** lives in a `<p>` below the input. Word-wrapping is
   on; no `white-space: nowrap` ever on multi-word error messages.

### Anti-patterns

- ❌ `text-overflow: ellipsis` on translated content above caption tier. Truncating
  a Yorùbá word at a sub-dot orphans the dot.
- ❌ Counting characters to gate visibility ("if string is longer than 24 chars,
  show tooltip"). Character counts are a Latin-language heuristic — they
  misclassify diacritic-heavy strings as long when they aren't visually, and
  vice versa.
- ❌ Concatenating strings programmatically ("Welcome, " + name + "!"). Yorùbá
  word order differs; concatenation strands the comma. Use a single full-string
  template per language with named placeholders.

---

## 4 · Logical properties — the contract

Every shipped component uses **logical properties** (`inline-size`, `padding-block`,
`margin-inline-end`, `inset-inline-start`) instead of physical (`width`,
`padding-top`, `margin-right`, `left`). This is what makes RTL "just work" — no
mirroring code, no flipped stylesheet, no `body[dir="rtl"]` overrides.

| Physical (don't use) | Logical (use) |
|---|---|
| `width`             | `inline-size` |
| `height`            | `block-size` |
| `min-width`         | `min-inline-size` |
| `max-height`        | `max-block-size` |
| `margin-left`       | `margin-inline-start` |
| `margin-right`      | `margin-inline-end` |
| `padding-top`       | `padding-block-start` |
| `padding-bottom`    | `padding-block-end` |
| `left: 0`           | `inset-inline-start: 0` |
| `right: 0`          | `inset-inline-end: 0` |
| `border-left`       | `border-inline-start` |
| `border-radius: 0 4px 4px 0` (physical corner pairs) | `border-start-end-radius` + `border-end-end-radius` |
| `text-align: left`  | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left`       | `float: inline-start` |

**Physical properties are allowed only when the direction is genuinely physical**
— `transform: translateY()` for an entrance animation (Y is gravity, not reading
direction); `border-block-start-width` for a top border that means "top of a
hierarchy" not "start of reading". In doubt, ask: *would this still mean the
same thing if the page flipped?* If yes, use physical; if no, use logical.

### Exceptions in shipped files

Two shipped patterns use physical properties deliberately:

1. **Keyframe transforms in `modal.css` and `toast.css`.** `translateY(8px)` and
   `translateX(100%)` (drawer-in). The drawer-in animation is **explicitly
   mirrored** under `[dir="rtl"]` — see `modal.css`. Y-axis transforms are not
   mirrored.
2. **Status-badge icons** (per §05-iconography). Icons that depict reading flow
   (chevron-right meaning "next") are flipped under RTL via a CSS rule, not by
   substituting glyphs.

---

## 5 · RTL — what changes, what doesn't

When `<html dir="rtl">` is set, the **layout** mirrors. Per the shipped CSS:

### What mirrors

- All inline-axis flow: sidebar slides in from the right; drawer slides in from
  the left.
- Form labels remain above inputs (so no mirroring needed there).
- Table column order reads right-to-left; the first column visually is the right-
  most.
- Breadcrumb chevrons flip (`›` → `‹`) via a CSS `::before` rule, not by
  swapping content.
- Card / button / input border-start-end radii — pre-existing logical-radius
  syntax means corners follow reading direction automatically.

### What stays put

- **Numbers, dates, times, and phone numbers** flow LTR even inside RTL prose.
  This is the **Unicode Bidi Algorithm**'s default; trust it. Do not wrap them in
  `<bdo dir="ltr">` unless you're handling the rare case where the algorithm
  guesses wrong (typically Arabic-only digits).
- **Code blocks** and `<kbd>` glyphs. A keyboard shortcut is read left-to-right
  regardless of surrounding script (`Ctrl + K` does not become `K + Ctrl`).
- **Up/down/play/pause/spinner** glyphs — they have no reading-direction
  semantics.
- **Logo lockups.** The NITDA word "NITDA" and the DGO mark are read LTR even
  in RTL context. Wrap the lockup in `dir="ltr"` if Bidi guesses wrong (it
  usually doesn't).

### What's still a manual override

These are flagged in each affected component's doc (§11 §11 of the per-component
template).

| Surface | Rule |
|---|---|
| Drawer entrance keyframe | `dgo-drawer-in` translates `100%` → `0`; under `[dir="rtl"]` it translates `-100%` → `0`. The override lives in `modal.css`. |
| Toast position | Toasts anchor to `inset-inline-end`; no override needed. They appear on the screen-end side in both directions. |
| Tabs underline indicator | Sliding indicator already uses `transform: translateX` indexed against the active tab's `offsetLeft`. JS must read `getBoundingClientRect()` and **not** subtract from a presumed-LTR origin. Documented in `docs/components/tabs.md` when authored. |
| Tooltip arrow | The CSS arrow uses `inset-inline-start` for its anchor; no override. |
| `:focus-visible` halo | Symmetrical — no override. |

---

## 6 · Date, time, number, currency

Use the runtime locale APIs. Do **not** hand-format.

```js
const fmtDate    = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
const fmtNumber  = new Intl.NumberFormat(locale, { useGrouping: true });
const fmtCurrency = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'NGN',
  currencyDisplay: 'symbol',
});
```

### Conventions

- **Calendar.** Gregorian, with day-month-year ordering for `en-NG`, `yo`, `ha`,
  `ig`. Federal date convention is `DD MMMM YYYY` (e.g. `12 March 2024`),
  rendered by `Intl.DateTimeFormat(..., { dateStyle: 'long' })`. Numeric
  short form `DD/MM/YYYY` is acceptable in dense tables.
- **Time.** 24-hour for application surfaces; 12-hour acceptable in citizen-
  facing surfaces only. Be consistent within a screen.
- **Numbers.** Group separator `,`; decimal separator `.` (the `en-NG`
  default). Other locales use `Intl.NumberFormat` and don't need to know.
- **Currency.** `NGN` symbol `₦`. Symbol position is currency-format-driven —
  `Intl.NumberFormat` will place it correctly per locale. Do not concatenate
  the symbol manually.
- **Phone numbers.** Nigerian numbers display as `+234 XXX XXX XXXX` with
  spaces, never `-` or `.`. International prefix is required for any phone
  shown in a profile or contact card.

---

## 7 · Inputs & forms in RTL

A form is the busiest RTL surface in any system. The shipped rules:

1. **Inputs themselves are LTR for some content types.** Email, URL, phone
   number, password, and any numeric input retain `dir="ltr"` even on an RTL
   page. Set explicitly:

   ```html
   <input type="email" dir="ltr" autocomplete="email">
   ```

   The label is RTL; the field is LTR. This is the correct behaviour for emails
   and URLs which are themselves left-to-right strings.

2. **`autocomplete`** values are **always** the W3C-defined tokens (`email`,
   `tel`, `given-name`, `family-name`, `postal-code`, `street-address`,
   `address-level1` etc.) — these aren't translated, they're machine-readable.

3. **Date inputs** (`<input type="date">`) render in the user's OS locale.
   The DGO style applies to the input shell; the picker itself is browser-
   rendered and culture-aware.

4. **Helper / error text** wraps the same as the label — RTL with RTL pages,
   LTR with LTR. Anchor with `aria-describedby` regardless of direction.

5. **Required-field marker.** The visual `*` lives at `inline-end` of the label
   (the end of reading flow). In RTL it appears on the left. Implementation is
   a CSS pseudo-element keyed off `aria-required="true"`; no markup change is
   needed per direction.

---

## 8 · Imagery, illustration, iconography under i18n

- **Illustrations with text inside the SVG** must have a per-locale variant or
  no text inside the SVG. Embedded English text in an SVG illustration is the
  most-missed translation bug in any system.
- **Icons that depict reading flow** (chevrons, "next" arrows, "back" arrows,
  the breadcrumb separator, the tab-next swipe arrow) flip under `[dir="rtl"]`.
  Implementation: a CSS rule in `_utilities.css` (`.dgo-icon--rtl-flip`) or a
  component-scoped rule. Never two SVG variants.
- **Icons that depict objects** (folder, document, search magnifier, clock)
  **do not flip.** The magnifying-glass's handle in the West points down-right
  by convention; this convention is shared across scripts. Some teams flip the
  search icon under RTL; the system does **not** — and the rationale is in
  §12-anti-patterns.
- **Photography.** People look toward the centre of the layout. The shipped
  photo treatments don't pin a face to a side that fights reading flow, but the
  art-direction guideline applies if you commission new imagery.

---

## 9 · Per-language type rules

Pulled from §03 for at-a-glance use here. **Authoritative copy is §03.**

| Language | Min body line-height | Notes |
|---|---|---|
| English (en-NG) | `--dgo-lh-150` for body, `--dgo-lh-120` for headings | Baseline. |
| Yorùbá | `--dgo-lh-150` body, `--dgo-lh-120` heading | Stacked sub-dot + acute demands the full body line cell. |
| Hausa | `--dgo-lh-150` body, `--dgo-lh-120` heading | Easiest of the three — no stacked marks. |
| Igbo | `--dgo-lh-150` body, `--dgo-lh-120` heading | Same hazard surface as Yorùbá. |
| Arabic (when shipped) | `--dgo-lh-150` minimum, `--dgo-lh-170` recommended for long-form. The shaped script has a deep visual centre of mass — generous leading reads correctly. | Re-verify when first Arabic content arrives. |

### Language-specific opt-ins

If a language consistently needs a different line-height or letter-spacing, use
`:lang(…)`:

```css
:lang(yo) .dgo-card__title { line-height: var(--dgo-lh-140); }
```

…and document the override in the relevant component's doc §11 (i18n section).
Do not invent component variants for language differences.

---

## 10 · Bidirectional content quirks

A short list of things real applications hit.

- **Mixing English brand names inside Yorùbá / Hausa / Igbo prose.** The Bidi
  algorithm handles it; no `<bdi>` needed unless you have user-generated content
  that may itself contain mixed scripts.
- **User-generated content** (names, addresses, comments). Wrap untrusted mixed
  content in `<bdi>` (bidirectional isolate). This prevents a malicious or
  accidental Bidi-control character in user input from reordering surrounding
  UI.
- **Punctuation drift.** Question marks, exclamation marks, and brackets sit on
  the reading-end side. In LTR `?` is right; in RTL `؟` (Arabic question mark)
  is left. The browser handles this; don't fight it.
- **Mirrored brackets.** `(` and `)` mirror under RTL automatically (Unicode
  Bidi Mirrored property). `[` and `]` likewise. Custom bracket characters
  (`「`, `『`) do not — avoid them outside a context that demands them.

---

## 11 · Testing matrix

Before any v2.x release ships, the following must be tested:

- [ ] Every shipped page loads with `<html lang="en-NG">` and renders correctly.
- [ ] Every shipped page loads with `<html lang="yo">` and renders correctly,
      including diacritic clearance at every line-height in use.
- [ ] Every shipped page loads with `<html lang="ha">` and renders correctly.
- [ ] Every shipped page loads with `<html lang="ig">` and renders correctly.
- [ ] Every shipped page loads with `<html dir="rtl">` and lays out correctly
      (mirroring is automatic via logical properties; the test confirms no
      bare physical properties slipped in).
- [ ] Bidi-mixed content (English brand inside Yorùbá prose) renders correctly.
- [ ] All `aria-label` strings translate. (A missed `aria-label` is the most
      common i18n bug — search the codebase for raw English strings inside
      `aria-label=`.)
- [ ] All `Intl.DateTimeFormat` / `Intl.NumberFormat` consumers are wired to
      the active locale, not a hard-coded `'en-NG'`.

---

## 12 · Anti-patterns

- ❌ A `body[dir="rtl"] { … flipped values … }` overrides file. The shipped
  approach is logical properties throughout; a parallel RTL stylesheet is a
  maintenance trap.
- ❌ String concatenation for sentences. Use template strings with **named**
  placeholders that the translator can reorder: `"Welcome back, {name}"`, not
  `"Welcome back, " + name`.
- ❌ Embedded English in SVG illustration. Either no text, or a per-locale SVG.
- ❌ Hard-coded `'en'` in any `Intl.*Format` call.
- ❌ Truncating with `text-overflow: ellipsis` on diacritic-heavy strings (see
  §03).
- ❌ "Pseudo-localisation" testing only (Ḅấḋ). It catches bidirectional bugs
  but not script-specific glyph coverage or stacked-mark clearance. Test with
  the real languages.
- ❌ Adding an `aria-label` in English when the visible label is translated.
  The accessible name and the visible name should match in language.

---

## 13 · Open questions (for v2.2+)

- **Arabic content rollout.** No content shipped yet; the CSS is ready. Open
  questions when content arrives: digit handling (Arabic-Indic vs European
  digits — federal-data convention is European in `Intl.NumberFormat`'s
  `numberingSystem: 'latn'`), currency display order, calendar (Hijri shadow
  rendering alongside Gregorian).
- **Hausa Ajami support.** Out of scope for v2.x; reconsider if a partner
  agency requests it. Requires fifth font family + translation vendor.
- **Pidgin English (`pcm`).** Spoken widely; no federal authoring convention
  for written form. Out of scope until `[NITDA editorial: confirm policy]`.
- **Sign-language video** for accessibility-priority public surfaces. Not a
  CSS concern but a content concern; flag for §10 v2.2.
- **Vertical writing modes** (CJK). Not in scope; documented to close the door
  cleanly.
