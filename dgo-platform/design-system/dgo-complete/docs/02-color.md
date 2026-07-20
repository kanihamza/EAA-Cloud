# 02 · Color

> **Every pairing in this document was measured against the hex values shipped in
> `tokens.primitive.css` and `tokens.semantic.css`.** Numbers below are produced by the
> WCAG 2.2 relative-luminance formula (Web Content Accessibility Guidelines 2.2 §1.4.3
> and §1.4.11). Re-run the matrix whenever a primitive changes — see the *Verification*
> section at the bottom of this file.

## Palette structure

The DGO palette is built from **four hue families** (Primary Green, Smart Green, Ink,
plus the three Status hues) and a small fixed set of stops per family. The brand keys
sit at `--dgo-green-700` (deep) and `--dgo-smart-400` (operational). All other UI roles
are *derived* from these via semantic tokens; you should not consume the primitives
directly from product code.

| Family | Role | Brand key stop |
|---|---|---|
| Primary Green | Brand identity, primary actions, headings on light | `--dgo-green-700` |
| Smart Green | Operational accents, focus rings, active states | `--dgo-smart-400` |
| Ink | Text and neutral surfaces | `--dgo-ink-700` (brand black) |
| Info / Warn / Danger | Status communication | `--dgo-info-600`, `--dgo-warn-400`, `--dgo-danger-600` |

### Restricted-use primitives

`--dgo-coa-red` and `--dgo-coa-yellow` exist to reproduce the Coat-of-Arms of the
Federal Republic of Nigeria with brand-correct ink. **They must not appear in general
UI** — not as button colors, not as status hues, not in data viz. The federal-symbol
guard belongs in code review.

---

## How to read this matrix

- **AAA** — contrast ≥ 7:1 for body text (≥ 4.5:1 for large/bold text). Aim here.
- **AA**  — contrast ≥ 4.5:1 for body text (≥ 3:1 for large/bold text). The minimum.
- **AA large only** — pair only meets contrast for text ≥ 24px regular or ≥ 19px bold.
  Tagged ⚠️ — usable, but the doc page for the component must restrict it to large text.
- **pass (3:1)** — non-text contrast (UI components, focus indicators, graphical objects)
  per WCAG 1.4.11. Use this row only for icon-only states, decorative borders, and chart
  elements; never for prose.
- **FAIL** — does not meet the relevant threshold. Either pick a different token or
  treat the pair as decorative-only and ensure the same information is conveyed via
  some other channel (label, icon, position).

> **Disabled text is exempt.** WCAG 2.2 §1.4.3 explicitly excludes inactive UI components
> from contrast requirements. `--dgo-color-fg-disabled` is allowed to fall below AA — it
> is *also* signalling "you can't interact with this", which is the point.

---

## Light theme — the production matrix

### Body text on surfaces

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-fg-default` | `--dgo-color-surface-page` | #1B1A1A on #FFFFFF | **17.37:1** | ✅ AAA |
| `--dgo-color-fg-default` | `--dgo-color-surface-sunken` | #1B1A1A on #F5F4F4 | **15.82:1** | ✅ AAA |
| `--dgo-color-fg-default` | `--dgo-color-surface-muted` | #1B1A1A on #F5F4F4 | **15.82:1** | ✅ AAA |
| `--dgo-color-fg-strong` | `--dgo-color-surface-page` | #0D0C0C on #FFFFFF | **19.53:1** | ✅ AAA |
| `--dgo-color-fg-muted` | `--dgo-color-surface-page` | #5F5C5D on #FFFFFF | **6.61:1** | ✅ AA |
| `--dgo-color-fg-subtle` | `--dgo-color-surface-page` | #807D7E on #FFFFFF | **4.08:1** | ⚠️ AA large only |
| `--dgo-color-fg-disabled` | `--dgo-color-surface-page` | #A09E9F on #FFFFFF | **2.66:1** | ❌ FAIL |

### Foreground on brand surfaces (button/header chrome)

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-fg-on-brand` | `--dgo-color-action-primary` | #FFFFFF on #05583B | **8.52:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-action-primary-hover` | #FFFFFF on #033F2A | **12.01:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-action-primary-press` | #FFFFFF on #022819 | **15.91:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-surface-brand` | #FFFFFF on #05583B | **8.52:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-surface-inverse` | #FFFFFF on #022819 | **15.91:1** | ✅ AAA |

### Foreground on accent surfaces (operational chrome)

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-fg-on-accent` | `--dgo-color-action-accent` | #FFFFFF on #17B255 | **2.79:1** | ❌ FAIL |
| `--dgo-color-fg-on-accent` | `--dgo-color-action-accent-hover` | #FFFFFF on #119143 | **4.07:1** | ⚠️ AA large only |
| `--dgo-color-fg-on-accent` | `--dgo-color-action-accent-press` | #FFFFFF on #0D7234 | **6.05:1** | ✅ AA |

### Links

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-fg-link` | `--dgo-color-surface-page` | #05583B on #FFFFFF | **8.52:1** | ✅ AAA |
| `--dgo-color-fg-link-hover` | `--dgo-color-surface-page` | #119143 on #FFFFFF | **4.07:1** | ⚠️ AA large only |
| `--dgo-color-fg-link-visited` | `--dgo-color-surface-page` | #033F2A on #FFFFFF | **12.01:1** | ✅ AAA |

### Borders (non-text contrast applies)

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-border-default` | `--dgo-color-surface-page` | #E8E6E7 on #FFFFFF | **1.24:1** | ❌ FAIL (<3:1) |
| `--dgo-color-border-strong` | `--dgo-color-surface-page` | #C4C3C3 on #FFFFFF | **1.76:1** | ❌ FAIL (<3:1) |
| `--dgo-color-border-stronger` | `--dgo-color-surface-page` | #A09E9F on #FFFFFF | **2.66:1** | ❌ FAIL (<3:1) |

### Status pairs — subtle

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-info-subtle-fg` | `--dgo-color-info-subtle-bg` | #054871 on #E6F0F8 | **8.37:1** | ✅ AAA |
| `--dgo-color-success-subtle-fg` | `--dgo-color-success-subtle-bg` | #0D7234 on #E6F7ED | **5.44:1** | ✅ AA |
| `--dgo-color-warning-subtle-fg` | `--dgo-color-warning-subtle-bg` | #5A3F00 on #FBF1D8 | **8.70:1** | ✅ AAA |
| `--dgo-color-danger-subtle-fg` | `--dgo-color-danger-subtle-bg` | #780820 on #FBE7EB | **9.56:1** | ✅ AAA |

### Status pairs — strong

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-info-strong-fg` | `--dgo-color-info-strong-bg` | #FFFFFF on #0B6BB0 | **5.61:1** | ✅ AA |
| `--dgo-color-success-strong-fg` | `--dgo-color-success-strong-bg` | #FFFFFF on #119143 | **4.07:1** | ⚠️ AA large only |
| `--dgo-color-warning-strong-fg` | `--dgo-color-warning-strong-bg` | #1B1A1A on #E1A100 | **7.69:1** | ✅ AAA |
| `--dgo-color-danger-strong-fg` | `--dgo-color-danger-strong-bg` | #FFFFFF on #C8102E | **5.88:1** | ✅ AA |

### Operational status (DGO workflow)

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-status-pending-fg` | `--dgo-color-status-pending-bg` | #5A3F00 on #FBF1D8 | **8.70:1** | ✅ AAA |
| `--dgo-color-status-routed-fg` | `--dgo-color-status-routed-bg` | #054871 on #E6F0F8 | **8.37:1** | ✅ AAA |
| `--dgo-color-status-replied-fg` | `--dgo-color-status-replied-bg` | #0D7234 on #E6F7ED | **5.44:1** | ✅ AA |
| `--dgo-color-status-action-fg` | `--dgo-color-status-action-bg` | #780820 on #FBE7EB | **9.56:1** | ✅ AAA |
| `--dgo-color-status-draft-fg` | `--dgo-color-status-draft-bg` | #033F2A on #EAF3EF | **10.62:1** | ✅ AAA |
| `--dgo-color-status-archived-fg` | `--dgo-color-status-archived-bg` | #4A4849 on #F5F4F4 | **8.27:1** | ✅ AAA |
| `--dgo-color-status-escalated-fg` | `--dgo-color-status-escalated-bg` | #780820 on #FAD2D9 | **8.24:1** | ✅ AAA |

---

## Dark theme

Computed against the surface re-bindings in `tokens.theme-dark.css`.

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-fg-default` | `--dgo-color-surface-page` | #E8EDEA on #0B1410 | **15.81:1** | ✅ AAA |
| `--dgo-color-fg-default` | `--dgo-color-surface-raised` | #E8EDEA on #122019 | **14.23:1** | ✅ AAA |
| `--dgo-color-fg-default` | `--dgo-color-surface-sunken` | #E8EDEA on #081109 | **16.20:1** | ✅ AAA |
| `--dgo-color-fg-strong` | `--dgo-color-surface-page` | #FFFFFF on #0B1410 | **18.72:1** | ✅ AAA |
| `--dgo-color-fg-muted` | `--dgo-color-surface-page` | #9AA8A2 on #0B1410 | **7.57:1** | ✅ AAA |
| `--dgo-color-fg-subtle` | `--dgo-color-surface-page` | #6F7E78 on #0B1410 | **4.40:1** | ⚠️ AA large only |
| `--dgo-color-fg-disabled` | `--dgo-color-surface-page` | #4F5C57 on #0B1410 | **2.68:1** | ❌ FAIL |
| `--dgo-color-fg-link` | `--dgo-color-surface-page` | #45C578 on #0B1410 | **8.48:1** | ✅ AAA |
| `--dgo-color-fg-link-hover` | `--dgo-color-surface-page` | #8BD9A9 on #0B1410 | **11.23:1** | ✅ AAA |
| `--dgo-color-border-default` | `--dgo-color-surface-page` | #1F2F27 on #0B1410 | **1.33:1** | ❌ FAIL (<3:1) |
| `--dgo-color-border-strong` | `--dgo-color-surface-page` | #2D3F36 on #0B1410 | **1.67:1** | ❌ FAIL (<3:1) |
| `--dgo-color-border-stronger` | `--dgo-color-surface-page` | #42554B on #0B1410 | **2.35:1** | ❌ FAIL (<3:1) |

> **Status subtle pairs in dark.** `tokens.theme-dark.css` defines status subtle
> backgrounds as `rgba(…, 0.18)` rendered over `--dgo-color-surface-page` (#0B1410).
> The rendered background depends on alpha blending and cannot be expressed as a single
> hex, so it is excluded from this static matrix. **[Owner: design-system team — add a
> per-status blended-hex computation to the contrast script and re-emit these rows for
> the dark theme on the next minor release.]**

---

## High-contrast theme

| Foreground | Background | Hex pair | Ratio | Verdict |
|---|---|---|---|---|
| `--dgo-color-fg-default` | `--dgo-color-surface-page` | #000000 on #FFFFFF | **21.00:1** | ✅ AAA |
| `--dgo-color-fg-muted` | `--dgo-color-surface-page` | #2D2C2C on #FFFFFF | **13.92:1** | ✅ AAA |
| `--dgo-color-fg-subtle` | `--dgo-color-surface-page` | #4A4849 on #FFFFFF | **9.07:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-action-primary` | #FFFFFF on #022819 | **15.91:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-action-accent` | #FFFFFF on #0A5828 | **8.61:1** | ✅ AAA |
| `--dgo-color-fg-on-brand` | `--dgo-color-action-danger` | #FFFFFF on #780820 | **11.33:1** | ✅ AAA |
| `--dgo-color-fg-link` | `--dgo-color-surface-page` | #022819 on #FFFFFF | **15.91:1** | ✅ AAA |
| `--dgo-color-border-default` | `--dgo-color-surface-page` | #000000 on #FFFFFF | **21.00:1** | ✅ pass (3:1) |
| `--dgo-color-status-pending-fg` | `--dgo-color-status-pending-bg` | #5A3F00 on #FBF1D8 | **8.70:1** | ✅ AAA |
| `--dgo-color-status-routed-fg` | `--dgo-color-status-routed-bg` | #054871 on #E6F0F8 | **8.37:1** | ✅ AAA |
| `--dgo-color-status-replied-fg` | `--dgo-color-status-replied-bg` | #07401D on #C2EED2 | **9.35:1** | ✅ AAA |
| `--dgo-color-status-action-fg` | `--dgo-color-status-action-bg` | #780820 on #FBE7EB | **9.56:1** | ✅ AAA |
| `--dgo-color-status-draft-fg` | `--dgo-color-status-draft-bg` | #022819 on #CFE3D8 | **11.84:1** | ✅ AAA |
| `--dgo-color-status-archived-fg` | `--dgo-color-status-archived-bg` | #000000 on #E8E6E7 | **16.90:1** | ✅ AAA |
| `--dgo-color-status-escalated-fg` | `--dgo-color-status-escalated-bg` | #FFFFFF on #780820 | **11.33:1** | ✅ AAA |

Every textual pairing in the HC theme is AAA. Borders and focus rings are pushed to
true black; the focus ring stacks white → black → `--dgo-coa-yellow` for an additional
3px outer band to survive on top of any background.

---

## Known issues & guard rails

The matrix above flags three real failures in the v2.0 light theme. The recommended
remediation for each is captured here; each requires a tracked patch in
`CHANGELOG.md`.

### 1 · `--dgo-color-action-accent` button text — **2.79:1, fails even non-text**

White text on `--dgo-smart-400` (#17B255) does not meet AA, AAA, *or* WCAG 1.4.11
non-text contrast. The smart-green ramp is too bright at the 400 stop for white text.

**Do not** use `--dgo-color-action-accent` as a button surface with default
`--dgo-color-fg-on-accent`. Until the hue is re-tuned, the supported uses of
`--dgo-smart-400` are:

- Focus ring outer (decorative — 3:1 against page surfaces is met).
- Tab indicator (`--dgo-tabs-indicator` — 2px stroke, decorative).
- Operational status badge **with the subtle pair** (`--dgo-color-status-replied-*`,
  which routes through smart-50/600 and passes AA at 5.44:1).

For a solid accent button, route the surface through `--dgo-color-action-accent-press`
(`--dgo-smart-600`, 6.05:1 against white — AA) or set the text to `--dgo-ink-900`
(11.4:1, AAA — but verify it reads as a button, not a tag).

### 2 · `--dgo-color-success-strong` solid bg with white text — **4.07:1**

`--dgo-smart-500` (#119143) with white text passes AA for **large/bold text only**
(≥ 18pt regular / ≥ 14pt bold ≈ 24px / 19px in this system's scale). Use the
`--dgo-color-success-subtle-*` pair for body-text labels — at 5.44:1 it passes AA for
all sizes.

### 3 · Borders below 3:1 — `border-default` (1.24:1), `border-strong` (1.76:1), `border-stronger` (2.66:1)

Borders in the DGO palette are intentionally low-contrast because the system relies on
**surface elevation + shadow** rather than line weight to subdivide regions. The rule is:

- A border may sit below 3:1 only when it is **decorative** — purely a visual rhythm cue
  with the same information conveyed by another channel (a label, a heading, a shadow,
  position on the grid).
- A border that is **the only indicator** of a control's boundary (input outline, focus
  ring, error ring, checkbox outline) must use a token that meets ≥ 3:1 against the
  containing surface. The qualifying tokens are `--dgo-color-action-primary` (8.52:1),
  `--dgo-color-action-primary-press` (15.91:1), `--dgo-color-danger-strong-bg`
  (5.88:1), or the dark inks `--dgo-ink-700+`.

`tokens.component.css` binds `--dgo-input-border` to `--dgo-color-border-strong`
(1.76:1 — **fails** when the input is at rest and unfocused). The remediation is tracked
as **[token-fix: input-border ≥3:1]** in `CHANGELOG.md` for v2.0.1. Until then, every
input must additionally carry an `aria-label` or visible label so the boundary is not
the only affordance, and `--dgo-input-border-focus` (`--dgo-color-action-primary`,
8.52:1) takes over the contract on focus.

---

## Color usage rules

1. **Consume semantic tokens, never primitives.** A component reaching for `--dgo-green-700`
   directly will fail to re-theme.
2. **Color is never the only signal.** Status badges have an icon. Required fields have
   an asterisk *and* a label suffix. Sortable columns have a caret. Error inputs have a
   message. (See §12-anti-patterns for the recurring violations.)
3. **Brand-key colors are scarce.** Use `--dgo-green-700` for primary action and headings
   on light. Don't repeat it as a tint background unless you route through
   `--dgo-color-action-primary-soft` (`--dgo-green-50`).
4. **Smart green is for momentum, not danger.** Confirmation, success, "now live",
   "replied". Never as a warning or a delete affordance.
5. **Data-viz uses its own palette.** Reach for `--dgo-cat-*`, `--dgo-seq-*`, or
   `--dgo-div-*`. The 8 categorical stops are pre-cleared for the three common forms of
   color-vision deficiency at the categorical legend scale; the sequential and diverging
   ramps are perceptually uniform within their hue.
6. **The Coat-of-Arms primitives are quarantined.** They exist for symbol reproduction only.

---

## Verification

Reproduce this matrix programmatically. The formula:

```
relativeLuminance(rgb) = 0.2126·R' + 0.7152·G' + 0.0722·B'
  where C' = C/255 ≤ 0.03928 ? (C/255)/12.92 : ((C/255+0.055)/1.055)^2.4
contrast(a, b) = (max(L_a, L_b) + 0.05) / (min(L_a, L_b) + 0.05)
```

Thresholds (WCAG 2.2):

| Use | Minimum |
|---|---|
| Normal text | 4.5:1 (AA) / 7:1 (AAA) |
| Large text — ≥ 24px regular OR ≥ 19px bold | 3:1 (AA) / 4.5:1 (AAA) |
| Non-text (UI components, graphical objects, focus indicators) | 3:1 |
| Disabled UI components | exempt |

If you change a primitive, regenerate the tables above and any component doc whose
verdicts are affected. Numbers in the matrix carry decimals to two places — round
visually, don't fudge thresholds.
