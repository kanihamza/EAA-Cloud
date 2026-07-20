# `input` / `textarea` / `field`

> The text-entry family. Two controls (`.dgo-input` for single line, `.dgo-textarea`
> for multi-line) wrapped in an optional `.dgo-field` that provides label, helper,
> and error semantics. A `.dgo-input-group` composes inputs with leading or
> trailing addon chrome (a `+234` prefix, a currency mark, a unit suffix).

**Status:** `shipped`
**Since:** `v2.0`
**File:** `styles/components/input.css`
**Selector namespaces:** `.dgo-input`, `.dgo-textarea`, `.dgo-field`, `.dgo-input-group`

The same shipped declaration also styles `.dgo-select__field` so the three
controls (input, textarea, native select) keep visually identical chrome. The
select's structural notes are out of scope here — see `docs/components/select.md`
when authored.

---

## 1 · Anatomy

### Bare input (no wrapper)

- `<input class="dgo-input">` — single-line.
- `<textarea class="dgo-textarea">` — multi-line.

### Field wrapper (preferred)

- `.dgo-field` — vertical stack via `display: flex; flex-direction: column;
  gap: var(--dgo-s-1_5)`.
  - `.dgo-field__label` — the label. Required to be a real `<label for="…">`.
    - `.dgo-field__label--req` — required-marker modifier; appends a `*` via
      `::after`.
  - `<input class="dgo-input">` or `<textarea class="dgo-textarea">` — the control.
  - `.dgo-field__help` — helper text below the input.
  - `.dgo-field__error` — error text. Replaces (or sits beside) the helper.

### Addon group

- `.dgo-input-group` — a flex row that visually unifies addon chrome with the
  input.
  - `.dgo-input-group__addon` — inline-start or inline-end addon. Contains a
    short label or an icon.
  - `<input class="dgo-input">` — the input itself, with its border and radius
    suppressed (the group owns the border + radius + focus ring).

### Slot policy

| Slot | Allowed content |
|---|---|
| `__label` | Plain text. Sentence case. No HTML other than `<abbr>` for unit hints. |
| `__help`  | Plain text. One sentence. Format examples allowed (`"DD/MM/YYYY."`). |
| `__error` | Plain text + optional leading icon (`<svg aria-hidden="true">`). One sentence. |
| `__addon` | A short string (≤ 6 chars), a unit, or a single icon. **Not** a button. |

If an addon needs to *do* something on click (toggle password visibility, clear
the field), it's a button **adjacent** to the input — not an addon. The addon
is decorative chrome; reusing it for an action creates a non-keyboard-reachable
control.

---

## 2 · Variants

The bare input has **no variants** — its appearance is configured by composition
(`.dgo-field` wrapper, `.dgo-input-group` wrapper) and by ARIA state
(`aria-invalid`, `aria-disabled`).

| Class | Description | Use when |
|---|---|---|
| `.dgo-textarea` | Multi-line. Resizes vertically. Min block-size = `--dgo-input-h × 2.5`. | Free-form text > one line: notes, addresses, comments. |
| `.dgo-input-group` (composed) | Input with leading/trailing static addons. | "₦", "+234", "%", unit suffixes. |
| `.dgo-field__label--req` (composed) | Required-field marker. | Inline visual cue on the label. AT consumes `aria-required` on the input itself. |

The shipped CSS does **not** ship size variants for inputs — there's a single
40px height. See §16.

---

## 3 · Sizes & density

| Control | Token | Default |
|---|---|---:|
| Input / textarea height | `--dgo-input-h` | `40px` |
| Padding-inline | `--dgo-input-px` | `var(--dgo-s-3)` (12px) |
| Border-radius | `--dgo-input-radius` | `var(--dgo-radius-control)` |
| Textarea min block-size | computed | `calc(--dgo-input-h × 2.5)` ≈ 100px |

### Touch-target floor — caveat

The shipped `--dgo-input-h: 40px` is below §04's 44px touch-target floor (same
caveat as the button-md issue). The focus ring's 3px halo extends the keyboard
hit-target effectively to ~46px, but the touch hit-target is the visual 40px.

For touch surfaces, the recommended workaround:

```css
[data-touch="true"] { --dgo-input-h: 44px; }
```

Setting the token at any ancestor — the document root or a feature-flag wrapper
— lifts every input in the subtree without overriding individual selectors.

### Density behaviour

The shipped CSS does **not** re-bind `--dgo-input-h` under `[data-density="compact"]`.
A compact-mode form does not get shorter inputs — it gets tighter `--dgo-field`
gaps (`--dgo-s-1_5` is dense already) and smaller adjacent components.

If your dense surface genuinely needs a 32px input, override the token at the
form root:

```css
.compact-form { --dgo-input-h: 32px; }
```

…and document the override in your form-page's design notes.

---

## 4 · States

| State | Selector | Visual change | Driver |
|---|---|---|---|
| Default | — | `--dgo-input-bg` background, `--dgo-input-border` border | — |
| Hover | `:hover:not(:disabled)` | Border → `--dgo-input-border-hover` | mouse |
| Focus | `:focus-visible` | Border → `--dgo-input-border-focus`; 3px alpha halo using `color-mix(in srgb, var(--dgo-color-action-primary) 22%, transparent)` | keyboard |
| Disabled | `:disabled` | Background → `--dgo-input-bg-disabled`; foreground → `--dgo-color-fg-disabled`; `cursor: not-allowed` | data |
| Invalid | `[aria-invalid="true"]` | Border → `--dgo-input-border-error` | data |
| Placeholder visible | `::placeholder` | `color: var(--dgo-input-placeholder)` | content |
| Within addon group, focused | `.dgo-input-group:focus-within` | Group border + halo as above; inner input drops its own focus ring | keyboard |

### Focus-ring inconsistency — known caveat

The shipped focus ring uses a **bespoke `color-mix()`** halo rather than the
system `--dgo-focus-ring` token. Functionally equivalent (3px alpha halo at
brand-primary tint); architecturally inconsistent — every other shipped
component reaches for `--dgo-focus-ring`. See §14.

### Read-only is not modelled

`<input readonly>` is a valid HTML state with distinct semantics (focusable,
selectable, copyable; not editable). The shipped CSS does not style it
distinctly — readonly inputs look identical to default inputs. If your surface
needs a visual distinction, add it at the consumer level; track for §16.

---

## 5 · Tokens consumed

### Tier 3 — Component tokens (`tokens.component.css`)

| Token | Default value | Re-bindings |
|---|---|---|
| `--dgo-input-radius` | `var(--dgo-radius-control)` | — |
| `--dgo-input-h` | `40px` | recommended: `[data-touch="true"]` → `44px` (consumer override) |
| `--dgo-input-px` | `var(--dgo-s-3)` | — |
| `--dgo-input-bg` | `var(--dgo-color-surface-page)` | theme:dark, theme:hc |
| `--dgo-input-bg-disabled` | `var(--dgo-color-surface-muted)` | theme:dark, theme:hc |
| `--dgo-input-border` | `var(--dgo-color-border-strong)` | theme:hc → `#000` |
| `--dgo-input-border-hover` | `var(--dgo-color-border-stronger)` | — |
| `--dgo-input-border-focus` | `var(--dgo-color-action-primary)` | — |
| `--dgo-input-border-error` | `var(--dgo-color-danger-strong-bg)` | — |
| `--dgo-input-placeholder` | `var(--dgo-color-fg-subtle)` | — |

### Tier 2 — Semantic tokens (read directly)

- `--dgo-color-fg-default`, `--dgo-color-fg-disabled`, `--dgo-color-fg-muted`
- `--dgo-color-action-primary` (consumed inside `color-mix` for the focus halo)
- `--dgo-color-action-danger` (the required-field marker)
- `--dgo-color-danger-subtle-fg` (the error text colour)
- `--dgo-color-surface-sunken` (the addon background)
- `--dgo-motion-state` (border / box-shadow / background transitions)
- `--dgo-type-body`, `--dgo-type-body-sm`, `--dgo-type-caption`
- `--dgo-family-sans`
- `--dgo-lh-150` (textarea line-height)
- `--dgo-s-1`, `--dgo-s-1_5`, `--dgo-s-2`, `--dgo-s-3` (spacing)
- `--dgo-wt-600` (label weight)

### Tier 1 — Primitives

**Empty.** The component is fully Tier-2/Tier-3.

(The `color-mix(in srgb, …)` expression consumes `--dgo-color-action-primary`
at Tier 2, not a primitive. The 22% alpha is hard-coded in the CSS rule, not
in a token — see §14 for the cleanup ticket.)

---

## 6 · Layout & sizing

- **Inline-size:** `inline-size: 100%` — the input fills its container.
  Constrain via the parent (form column width, grid track), never via inline
  `width` on the input itself.
- **Block-size:** `var(--dgo-input-h)` (40px) for `.dgo-input`; intrinsic with
  a `min-block-size` floor for `.dgo-textarea`.
- **Padding:** `padding-inline: var(--dgo-input-px)`; `padding-block: 0` for
  inputs (block size is the height); `padding-block: var(--dgo-s-2)` for
  textareas.
- **Border + radius:** 1px solid border, `--dgo-input-radius`. Inside an
  `.dgo-input-group`, the inner input drops its border to zero — the group
  owns the chrome.
- **Field stack:** `display: flex; flex-direction: column; gap: var(--dgo-s-1_5)`.
  Label → input → helper/error. Always above-label; never beside-label. See §11.
- **Container query:** none. The input doesn't respond to container size.

---

## 7 · Composition

- **Contains:** Nothing — inputs are leaf controls. (Textareas contain text,
  which is content, not composition.)
- **Contained by:** `.dgo-field` (preferred), `.dgo-input-group`, `.dgo-modal__body`,
  `.dgo-drawer`, `.dgo-card`, in-flow `<form>` sections.
- **Conflicts with:**
  - **Don't wrap an input in a `<label>` that also contains a heading.** The
    label's accessible name becomes the heading + the input's value, which is
    confusing. Use `<label for="…">` sibling-style.
  - **Don't put a button **inside** an `.dgo-input-group__addon`.** See §1
    slot policy.
  - **Don't compose `.dgo-input` and `.dgo-textarea` inside the same field —**
    they are alternative controls, not co-existing parts.

---

## 8 · Behaviour (JS contract)

**Mostly CSS.** Native inputs handle their own keyboard, IME, autocomplete, and
selection model. The consumer wires the form's onsubmit / onchange.

### Attributes the component reads

| Attribute | Carrier | Type | Meaning |
|---|---|---|---|
| `disabled` | the input | boolean | Native disabled — drives `:disabled` styling. Removes from tab order. |
| `readonly` | the input | boolean | Native read-only. Visually identical to default (see §4). |
| `aria-invalid` | the input | `"true" \| "false"` | Drives the error border. Pair with a visible `.dgo-field__error`. |
| `aria-required` | the input | `"true" \| "false"` | AT-visible required state. The visual `*` is decorative; AT reads this. |
| `aria-describedby` | the input | id list | References the helper and/or error element by id. Required for both. |
| `autocomplete` | the input | W3C token | `email`, `tel`, `given-name`, `family-name`, `street-address`, etc. Always set when the field maps to a known token. |
| `inputmode` | the input | `"numeric" \| "decimal" \| "tel" \| "email" \| …` | Drives the mobile keyboard. Pair with `type` appropriately. |
| `autocorrect`, `spellcheck` | the input | boolean | Off for code / identifiers; on for prose. |

### Events the consumer fires

Native `input`, `change`, `blur`, `focus`, `invalid`. The system convention:

- **Validate on `blur`,** not on every keystroke. Mid-typing errors train users
  to read errors that don't yet apply.
- **Re-validate on `input` only after the first `blur`** — once the user has
  seen the error, fixing it should clear immediately, not on the next blur.
- **Move focus to the first error on submit.** The error element's container
  is `tabindex="-1"` for this; focus goes there, not the input.

### Focus management

The input doesn't programmatically move focus. The form does.

---

## 9 · Keyboard

| Key | Behaviour |
|---|---|
| Standard text-editing keys | Native (`←`, `→`, `Home`, `End`, `Shift+arrow` selection, `Cmd/Ctrl+A`, `Cmd/Ctrl+C`, etc.). |
| `Enter` in a single-line input inside a `<form>` | Submits the form. Per HTML spec. Do not override unless the form is multi-step. |
| `Enter` in `.dgo-textarea` | Inserts a newline. Submitting a textarea form requires a submit button. |
| `Tab` | Moves focus to the next control. **Never** intercept `Tab` to insert tab characters in a generic textarea — break IME and accessibility. (Code-editing textareas are a different component.) |
| `Esc` (in `<input type="search">`) | Clears the input — native. Preserved. |

Cross-link: §08 §2.

---

## 10 · ARIA

| Attribute | Carrier | Value | When |
|---|---|---|---|
| `<label for="…">` association | sibling element | id of the input | **Required.** Every input has an associated label. Placeholders are not labels. |
| `aria-label` | the input | string | Only when no visible label is possible (search inside chrome). |
| `aria-describedby` | the input | id of help + (id of error if present) | Always wire help by id; add error id when invalid. |
| `aria-invalid` | the input | `"true" \| "false"` | When in error state. |
| `aria-required` | the input | `"true" \| "false"` | When required. |
| `aria-disabled` vs `disabled` | the input | — | Prefer native `disabled` for normal forms (drops from tab order). Use `aria-disabled` only when the user must reach the disabled control to learn why (paired with a tooltip). |

### Forced-colours behaviour

- Background re-binds to `Field` (system colour); the disabled background reads
  as system disabled.
- Border re-binds to `ButtonText`.
- The focus halo (`color-mix(... 22%, transparent)`) does **not** carry under
  `forced-colors: active`. The border-focus colour change still applies, and
  the input's native focus outline becomes visible (we don't strip it under
  forced-colors). See §16 for the focus-ring consolidation ticket.
- The placeholder remains visible as `GrayText`.

### Reduced-motion behaviour

- The 250ms border/background transitions collapse to 0ms — instant swap.

---

## 11 · Internationalisation

- **Diacritic safety:** input text uses `--dgo-type-body` (14px) at the
  browser's input default line-height (~1.4). Cleared for Yorùbá, Hausa, Igbo
  body-size diacritics. Textarea explicitly sets `line-height: var(--dgo-lh-150)`
  to give stacked marks the full body cell.
- **RTL:** the shipped CSS uses `padding-inline`, `border-inline-*`, and the
  `.dgo-input-group` is `display: flex` — addons sit at the start or end per
  reading direction. **The user agent handles input directionality itself**
  based on the field's `dir` attribute (`dir="auto"` is the right default for
  most inputs).
- **Bidi mixed content:** inside an LTR document, set `dir="auto"` on inputs
  that may receive any-script content. For inputs that are **always** LTR
  (email, URL, phone number, password, numeric), set `dir="ltr"` explicitly —
  see §09 §7.
- **Required-field marker** uses a `::after { content: " *" }` pseudo-element
  that is decorative; the AT-visible required state is on `aria-required`.
  The `*` reads correctly under RTL — it appears at the end of the label, which
  in RTL is on the left.
- **Translation expansion:** labels above-input wrap to two lines naturally. The
  `--dgo-field` flex gap absorbs the height growth without misaligning siblings.

### Per-input-type i18n notes

| Type | Direction | Notes |
|---|---|---|
| `text`, `search` | `dir="auto"` | Reads from user's first character. |
| `email`, `url`, `password`, `tel` | `dir="ltr"` | These are LTR strings even inside RTL surfaces. |
| `number` | `dir="ltr"` | The user agent renders digits per locale. |
| `date`, `time`, `datetime-local` | implementation-defined | The user agent renders the picker in the OS locale. |

---

## 12 · Examples

### Basic — labelled input with help and error

```html
<div class="dgo-field">
  <label class="dgo-field__label dgo-field__label--req" for="dob">Date of birth</label>
  <input class="dgo-input"
         type="text"
         id="dob"
         name="dob"
         aria-required="true"
         aria-invalid="false"
         aria-describedby="dob-help"
         inputmode="numeric"
         autocomplete="bday">
  <p class="dgo-field__help" id="dob-help">DD/MM/YYYY.</p>
</div>
```

### With variants and states — error state and textarea

```html
<div class="dgo-field">
  <label class="dgo-field__label" for="email">Email address</label>
  <input class="dgo-input"
         type="email"
         id="email"
         name="email"
         dir="ltr"
         autocomplete="email"
         aria-invalid="true"
         aria-describedby="email-error">
  <p class="dgo-field__error" id="email-error">
    <svg aria-hidden="true" width="14" height="14">
      <use href="../../assets/icons/sprite.svg#i-alert-circle"/>
    </svg>
    Enter a valid email address.
  </p>
</div>

<div class="dgo-field">
  <label class="dgo-field__label" for="note">Note for the desk</label>
  <textarea class="dgo-textarea"
            id="note"
            name="note"
            rows="4"
            aria-describedby="note-help"></textarea>
  <p class="dgo-field__help" id="note-help">
    Visible to the Compliance Office and on the audit log.
  </p>
</div>
```

### Input group with leading addon

```html
<div class="dgo-field">
  <label class="dgo-field__label" for="phone">Phone number</label>
  <div class="dgo-input-group">
    <span class="dgo-input-group__addon">+234</span>
    <input class="dgo-input"
           type="tel"
           id="phone"
           name="phone"
           dir="ltr"
           autocomplete="tel-national"
           inputmode="tel"
           aria-describedby="phone-help">
  </div>
  <p class="dgo-field__help" id="phone-help">XXX XXX XXXX</p>
</div>
```

### Inside a real composition — modal with required fields

```html
<section class="dgo-modal dgo-modal--lg"
         role="dialog"
         aria-modal="true"
         aria-labelledby="m-title">
  <header class="dgo-modal__header">
    <h2 id="m-title" class="dgo-modal__title">Route to Compliance</h2>
  </header>
  <div class="dgo-modal__body">
    <div class="dgo-field">
      <label class="dgo-field__label dgo-field__label--req" for="recipient">
        Recipient desk
      </label>
      <input class="dgo-input"
             type="text"
             id="recipient"
             aria-required="true"
             autocomplete="off"
             list="desks">
      <datalist id="desks">
        <option value="Compliance Office"></option>
        <option value="Legal Office"></option>
        <option value="Director-General"></option>
      </datalist>
    </div>
  </div>
  <footer class="dgo-modal__footer">
    <button class="dgo-btn dgo-btn--secondary" data-modal-close>Cancel</button>
    <button class="dgo-btn dgo-btn--primary">Route</button>
  </footer>
</section>
```

---

## 13 · Anti-patterns

- ❌ Using a placeholder as a label.
  ✅ Always use `<label for="…">`. Placeholders disappear on focus; users with
  cognitive load lose track of what the field was asking. The shipped
  `--dgo-input-placeholder` is `--dgo-color-fg-subtle` — barely-legible by
  design, because placeholders are supplementary.

- ❌ Showing errors on every keystroke during initial entry.
  ✅ Validate on `blur` first; then re-validate on input after the first blur.
  See §8 *Events*.

- ❌ Submitting a form on `Enter` when a textarea has focus.
  ✅ `Enter` in a textarea inserts a newline; `Tab` to the submit button is the
  keyboard path. This is the HTML default — don't override.

- ❌ A clickable addon (a "show password" eye icon as `.dgo-input-group__addon`).
  ✅ The eye is a `<button>` sibling of the input, not an addon. Addons are
  decorative chrome.

- ❌ Sentence-case label + colon: "Date of birth:".
  ✅ "Date of birth" — the visual gap between label and input is the separator.
  See §10-content-voice §5.

- ❌ Required `*` without `aria-required="true"` on the input.
  ✅ The `*` is decorative; AT reads the `aria-required` attribute. Both must
  be present.

- ❌ Inputs whose `inline-size` is set inline (`style="width: 200px"`) to "fit"
  a layout.
  ✅ Constrain via the parent grid track. Inline widths break translation
  expansion and RTL layouts.

Cross-link: §08 §2; §10-content-voice §5 *Form label & helper*; §12-anti-patterns
*"Placeholder as label"*.

---

## 14 · Migration

`v2.0` is the first shipped version. No migration history.

**Known inconsistencies to address in a future minor:**

| Issue | Fix | Track |
|---|---|---|
| Focus halo uses bespoke `color-mix()` instead of `--dgo-focus-ring` | Replace the `box-shadow` rule with `var(--dgo-focus-ring)`; remove `outline: none` if the system ring covers it. | `[NITDA DS team: file v2.1 ticket]` |
| The 22% alpha on the halo is a hard-coded magic number | Promote to a token `--dgo-input-focus-halo-alpha` or drop into a named primitive | Same ticket |
| `<input readonly>` not styled distinctly | Add a `[readonly]` selector rebinding background to `--dgo-color-surface-sunken` | v2.1 |
| 40px height below 44px touch-target floor | Document the `[data-touch="true"]` override pattern, or add it to the shipped CSS | v2.2 |

---

## 15 · Browser & assistive-tech support

| Engine | Min version |
|---|---|
| Chromium-family | last 2 majors |
| Firefox | last 2 majors |
| WebKit | last 2 majors |

| Feature | Required? | Fallback if absent |
|---|---|---|
| `color-mix(in srgb, …)` | required | — (all evergreen engines ship; Safari 16.4+) |
| Logical properties (`padding-inline`, `border-inline-start`) | required | — |
| `:focus-visible` | required | — |
| `:focus-within` (for input-group) | required | — |
| `inputmode` | optional but recommended | Falls back to keyboard inferred from `type`. |
| `autocomplete` token coverage | required for user-facing forms | — |
| `<datalist>` (used in §12 example) | optional | Falls back to a plain input. |

Assistive-tech tested:

- [ ] VoiceOver (macOS) + Safari
- [ ] VoiceOver (iOS) + Safari
- [ ] NVDA + Firefox
- [ ] NVDA + Chrome
- [ ] JAWS + Chrome
- [ ] TalkBack + Chrome (Android)

`[NITDA DS team: confirm AT test matrix funding]`.

---

## 16 · Open questions

- **Touch-target floor.** Same as button (§16 of `button.md`). A
  `[data-touch="true"]` ancestor attribute that re-binds `--dgo-input-h` to
  44px is the proposed mechanism. Centralise in v2.2.
- **Read-only styling.** Currently identical to default. Promote when the
  first surface needs the distinction.
- **Inline labels.** The system defaults to above-label. A `--inline` variant
  (label beside input, common in dense admin tables) is not shipped; if needed
  document the wrapping rules carefully (see §09 §3).
- **Character-count helper.** Not shipped. When promoted, it must be locale-
  aware (counts grapheme clusters, not bytes — `"ọ́"` is one grapheme).
- **Sizes (`--sm`, `--lg`).** The button has three sizes; the input has one.
  A `--sm` (32px) and `--lg` (48px) for parity would be additive. Track for
  v2.2.
- **Focus-ring consolidation** — see §14.

---

## 17 · Changelog

| Version | Change |
|---|---|
| `v2.0` | Introduced. `.dgo-input`, `.dgo-textarea`, `.dgo-field` (with `__label`, `__help`, `__error`), `.dgo-input-group` (with `__addon`). |

---

## 18 · Owners & contacts

- **DS maintainer:** `[NITDA DS team: confirm owner]`
- **Implementation lead:** `[forms team: confirm]`
- **Last review date:** `2026-05-26`
- **Next scheduled review:** `2026-11-26` (default cadence: 6 months from last review or on any change to consumed tokens, whichever is sooner).
