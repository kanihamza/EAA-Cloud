# Contributing to the DGO Design System

This guide is for anyone proposing a change — a new component family,
a token rename, a doc improvement, a bug fix. Read `GOVERNANCE.md`
first; it tells you **who** decides what. This file tells you **how**
to make a change land.

---

## TL;DR

| What you want to do | Path | Approximate effort |
|---|---|---|
| Fix a typo or broken link in a doc | PR direct to main. One maintainer review. | <1 hr |
| Fix a visual bug in an existing component | PR with before/after. One maintainer + family owner review. | 1–4 hr |
| Add a token value (new colour stop, new spacing step) | Issue → PR. Two maintainers + a11y reviewer. | 1–2 days |
| Add a variant to an existing component family | Issue → PR. Family owner + two maintainers. | 2–5 days |
| Add a brand-new component family | **RFC required.** See §3. | 2–6 weeks |
| Rename or remove anything published | **RFC required.** Deprecation cycle required. | 1–2 quarters |
| Change `docs/11-component-template.md` itself | **RFC required.** Touches every future component. | 4–8 weeks |

---

## 1 · Before you start

1. Search existing issues and PRs. Someone may already be on it.
2. Read the relevant doc chapter — the answer is often already
   written.  `[NITDA DS team: confirm whether to require an issue
   before a PR for non-RFC paths, or accept direct PRs for path-A
   and path-B changes]`.
3. If your change touches `assets/logo/` or the brand-tier colour
   tokens (Deep Green family), loop the **brand custodian** before
   writing code. Brand changes are not negotiable downstream of
   approval.
4. If your change adds or alters keyboard or ARIA behaviour, loop the
   **a11y reviewer** before writing code. A late-stage A regression
   discovery costs more than a 15-minute early conversation.

---

## 2 · Setting up locally

```bash
# clone
git clone [NITDA DS team: confirm repo URL]
cd dgo-design-system

# open the showcase
open index.html               # macOS
xdg-open index.html           # Linux
start index.html              # Windows
```

No build step. No package install. The system is plain HTML / CSS /
SVG and the showcase is a single static page. If you need a server
(for `<use href>` sprite resolution in some browsers), any static
server works:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

### Required tooling

Nothing required. Recommended:

- A modern Chromium build + Firefox + Safari for browser parity
  checks.
- A screen reader (VoiceOver on macOS is free and built-in; NVDA on
  Windows is free).
- An OS-level forced-colours toggle for HC theme checks
  (System Preferences → Accessibility → Display → Increase Contrast
  on macOS; Settings → Accessibility → Contrast Themes on Windows).

---

## 3 · The RFC process (for new families and breaking changes)

An RFC is a written proposal. It exists so that the contract is
debated before code is written, not after.

### When you need one

- New component family (anything under a new `.dgo-<family>` namespace).
- Renaming or removing any published token, class, or attribute.
- Adding a new theme (`data-theme="…"`).
- Adding a new density (`data-density="…"`).
- Adding a new token tier.
- Changing the shape of `docs/11-component-template.md`.

### What it contains

Use the §11 template as the skeleton for component-family RFCs. For
non-component RFCs, the structure below:

1. **Title** — `RFC: <subject>`.
2. **Status** — `draft` → `review` → `accepted` / `rejected` / `deferred`.
3. **Authors** — name + role.
4. **Problem statement** — what's the consumer pain? Cite a real
   product surface that needs this.
5. **Proposal** — the contract. What gets added, in what files,
   under what names.
6. **Alternatives considered** — at least two, with the reason each
   was set aside.
7. **Migration plan** — for breaking changes only. Codemod or sed
   recipe required.
8. **Accessibility review** — keyboard, ARIA, HC, reduced-motion,
   forced-colours.
9. **i18n review** — RTL, translation expansion, diacritic safety.
10. **Brand review** — only if touching `assets/logo/` or brand-tier
    colour tokens.
11. **Out of scope** — what the RFC explicitly does **not** answer.
12. **Open questions** — what the author is unsure about.

### The two-week clock

When the RFC moves from `draft` → `review`, a two-week window opens.
During that window:

- Maintainers and family owners must read it.
- Consumer leads who would adopt it should leave at least one comment.
- The a11y reviewer and brand custodian (if applicable) sign off
  explicitly.

At the end of the window, the **steward** records the decision at the
bottom of the RFC.

---

## 4 · The PR process

### Branch and commit

`[NITDA DS team: confirm branching strategy — main-trunk vs. release
branches. The system is small enough that main-trunk is fine until
volume requires otherwise]`.

Commit-message convention:

```
<type>(<scope>): <subject>

<body>

<trailers>
```

Where `<type>` is one of: `feat`, `fix`, `docs`, `refactor`, `chore`,
`a11y`, `i18n`, `perf`, `revert`.

Examples:

- `feat(command-palette): ship CSS + token block + showcase demo`
- `fix(button): correct disabled cursor under data-loading="true"`
- `docs(accessibility): add NVDA-tested note to the modal entry`
- `a11y(toast): meet 3:1 against gradient background in danger variant`

### PR description checklist

Use the auto-template `[NITDA DS team: ship one when repo is hosted]`,
or copy this in by hand:

```
## What
<one-paragraph summary>

## Why
<consumer pain or RFC link>

## How
<approach in 3–6 bullets>

## Testing
- [ ] Showcase renders without console errors under light / dark / HC
- [ ] Showcase renders under comfortable / compact density
- [ ] Keyboard pass — every interactive surface reachable via Tab; the
      component's own keyboard map matches its §11-doc §9
- [ ] Screen-reader pass — name + role + value announced (VoiceOver or
      NVDA acceptable)
- [ ] `prefers-reduced-motion: reduce` — no animation > 50ms
- [ ] `forced-colors: active` — component still legible
- [ ] At least one example renders correctly with Yorùbá / Hausa /
      Igbo content

## Risks
<known limitations, follow-ups>

## Linked
- Issue: #…
- RFC: #…
- Migration entry: <MIGRATION.md anchor>
```

### Review SLA

`[NITDA DS team: confirm SLA]`. Suggested:

- PATCH path — 2 business days.
- MINOR additive path — 5 business days.
- RFC-gated path — within the two-week review window above.

If a PR has been open for longer than the SLA without a review, ping
the steward in the maintainer channel.

---

## 5 · Coding conventions

### CSS

- **BEM under the `.dgo-` namespace.** `.dgo-<family>__<element>--<modifier>`.
- **Cascade layer.** Every component CSS file's selectors land in
  the `dgo-component` layer (declared once in
  `styles/components/_index.css`). Family files do not declare their
  own `@layer` block — they inherit from the index.
- **Tokens only.** Component CSS reads Tier-2 (semantic) and Tier-3
  (component) tokens. **Never** a Tier-1 primitive. If you need one,
  add a Tier-3 token in `tokens.component.css` and read that.
- **Logical properties.** `margin-inline-start`, `padding-block-end`,
  `inset-inline-end`. Never `margin-left` for layout.
- **No `!important`.** If you reach for it, the cascade is wrong —
  surface it in the PR for review.
- **No hard-coded values.** Hex codes, pixel values, milliseconds —
  all must reference a token. Single exception: shadow strokes that
  the elevation system declares centrally.
- **State drivers.** Prefer `aria-*` and `data-state` selectors over
  bespoke `.is-*` classes. ARIA is the contract; `.is-*` is the
  workaround.
- **Selector specificity.** Single-class wherever possible. Avoid
  descendant chains > 3 deep.

### Token naming

```
--dgo-<scope>-<role>[-variant][-state]
```

- `--dgo-green-700` — primitive (the only exception to the
  scope-role rule; primitives are scale names).
- `--dgo-color-action-primary` — semantic (intent name).
- `--dgo-btn-bg-primary` — component-tier (per-component binding).
- `--dgo-color-action-primary-soft` — semantic + variant.
- `--dgo-cmdk-item-bg-active` — component-tier + state.

Never collapse the tiers. A component CSS that reads a primitive
breaks the theming contract.

### Documentation

- Every component family has a doc under `docs/components/<family>.md`
  filled in against the §11 template. The doc and the CSS land in
  the **same PR** — never as a follow-up.
- Token names referenced in a doc must exist in `tokens/`. The
  doc-token round-trip is the contract.
- Cross-link liberally. §08-accessibility's per-family entry should
  link to the component doc, and vice versa.

### Showcase

- Every new component family lands with at least one demo in
  `index.html`. Demos use real federal-context content (dossiers,
  approvals, routing) — not lorem ipsum.
- Demos must render correctly under all three themes and both
  densities. Smoke-pass before opening the PR.

---

## 6 · A11y review — what to expect

When your PR adds or changes a component, the a11y reviewer checks:

1. **Keyboard.** Every interactive surface reachable via Tab. No
   keyboard trap unless the component is a modal dialog and the trap
   is documented.
2. **Focus visible.** A `:focus-visible` style on every interactive
   element. The system's 3px Smart Green ring is the default; opt-
   out requires justification.
3. **ARIA.** Role, state, properties match the WAI-ARIA APG pattern
   the component implements. If no APG pattern fits, a custom
   contract is documented in the component's §10.
4. **HC theme.** Component remains legible under `data-theme="hc"`.
   Elevation surfaces fall back to borders.
5. **Forced-colours.** Under `forced-colors: active` the component
   adopts system colours (`Canvas`, `CanvasText`, `Highlight`,
   `HighlightText`, `LinkText`) rather than fixing custom values.
6. **Reduced-motion.** Animations collapse to ≤ 50ms or to a static
   state via `@media (prefers-reduced-motion: reduce)`.
7. **Touch target.** 44×44px floor at comfortable density. Documented
   degradation at compact density (compact is keyboard-only).

A regression on any of the above is a release blocker.

---

## 7 · Brand review — what to expect

When your PR touches `assets/logo/`, the brand-tier color tokens, the
"An Initiative of NITDA" lockup, or any surface where the NITDA mark
appears at scale, the brand custodian checks:

1. The lockup geometry matches the NITDA Brand Guidelines (2020).
2. The "An Initiative of NITDA" attribution is present and rendered
   in `.dgo-overline` style.
3. The Deep Green family of tokens has not been re-pointed.
4. Logo clear-space and minimum-size rules are observed in any new
   showcase or example.

Any change to the brand surface that has not been signed off is
reverted on detection.

---

## 8 · After the merge

Family owners watch their family's surface. If your PR introduced a
new family, you become its owner unless you propose otherwise in
§18 of the new component's doc.

Owners are responsible for:

- Replying to issues filed against the family within five business
  days `[NITDA DS team: confirm SLA]`.
- Reviewing PRs to the family before maintainer approval.
- Six-month review cadence — bump §18's `Last review date` even if
  nothing changes.

---

## 9 · Reporting a bug

Open an issue. Include:

- **What happened** — the observed behaviour.
- **What you expected** — the contract you read in the docs.
- **Reproducer** — a minimal HTML snippet that shows the bug.
- **Environment** — browser + version + OS + theme + density + locale.
- **Severity** — visual / functional / a11y blocker.

A11y-blocker bugs (A or AA WCAG regression) jump the queue.

---

## 10 · Reporting a security issue

`[NITDA DS team: confirm security-reporting channel. The system ships
CSS and SVG only — the attack surface is small but non-zero (SVG XSS
via untrusted icon overrides, CSS injection via untrusted token
overrides). A private disclosure channel is still expected]`.

Do **not** open a public issue. Email `[NITDA DS team: confirm
security@…]` with the same shape as a bug report, plus a CVSS-style
severity.

---

## 11 · Code of conduct

`[NITDA DS team: confirm CoC adoption — recommend either the
Contributor Covenant 2.1 verbatim or a Nigerian-civil-service
equivalent]`.

Until adopted: be professional, be patient, assume good faith, and
defer to the steward on disputes.
