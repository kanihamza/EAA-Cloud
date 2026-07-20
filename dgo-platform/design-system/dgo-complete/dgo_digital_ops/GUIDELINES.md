# DGO Digital Ops Brand Guidelines

## Brand Identity

**DGO Digital Ops** is the operational technology brand of NITDA — the suite of dashboards, workflow tools, and digital services that power government operations.

**Name**
- Full name: **DGO Digital Ops**
- Short form: **DGO** (acceptable in headings, navigation, casual references)
- Never: "Digital Operations", "DigOps", "D.G.O."

**Tagline / Baseline**
- Primary: **"An initiative of NITDA"**
- Alternate (for operational staff): **"Digital Operations • NITDA"**

---

## Logo System

### Primary Wordmark
The **DGO** wordmark replaces the middle "O" with an **atomic-orbit symbol** — a circle with a centered dot, echoing NITDA's infoweb motif.

**Construction**
- "DG" + atomic-O + (none — the O is the symbol)
- Subtitle: "DIGITAL OPS" in small caps, letterspaced, below or to the right
- Typeface: Outfit Black (800 weight) for "DGO", Outfit SemiBold (600) for subtitle
- Colors: Deep Green `#05583B` for letters and center dot, Smart Green `#17B255` for orbit ring

**Variants**
1. **Horizontal** — "DGO" with subtitle to the right (default for headers, wide spaces)
2. **Stacked** — "DGO" above subtitle (compact spaces, mobile, square lockups)
3. **Mark only** — Just the atomic-O symbol (favicons, app icons, social profiles)
4. **White-out** — All-white version on Deep Green or dark backgrounds

### Endorsement Lockup
Every DGO interface must display the NITDA endorsement. Two approved formats:

1. **Inline** — Small caps "AN INITIATIVE OF NITDA" with a Smart Green dot prefix
2. **Stacked** — DGO logo above, endorsement below, separated by a 1px Smart Green line

### Clear Space
Minimum exclusion zone = height of the atomic-O symbol on all sides.

### Minimum Size
- Digital: 120px wide (horizontal), 80px tall (stacked)
- Print: 25mm wide (horizontal), 18mm tall (stacked)

### Don'ts
- Do not rotate the orbit ring
- Do not change the dot's position inside the orbit
- Do not use colors outside the approved palette
- Do not place the logo on busy backgrounds without a solid backing plate
- Do not use the NITDA logo in place of the DGO logo (use endorsement instead)

---

## Color System

### Primary Palette
| Token | Hex | Use |
|---|---|---|
| `--dgo-primary` | `#05583B` | Buttons, links, active states, primary actions |
| `--dgo-primary-hover` | `#033F2A` | Hover state for primary elements |
| `--dgo-primary-soft` | `#E6EEEB` | Soft backgrounds for primary-tinted surfaces |
| `--dgo-accent` | `#17B255` | Orbit ring, success states, accents, CTAs |
| `--dgo-accent-hover` | `#119143` | Hover state for accent elements |

### Neutral Palette
| Token | Hex | Use |
|---|---|---|
| `--dgo-ink-900` | `#1B1A1A` | Headings, primary text |
| `--dgo-ink-700` | `#373435` | Body text |
| `--dgo-ink-500` | `#5F5C5D` | Muted text, captions |
| `--dgo-ink-300` | `#A09E9F` | Disabled text, placeholders |
| `--dgo-surface` | `#FFFFFF` | Default background |
| `--dgo-surface-alt` | `#FAF9F9` | Alternate row, subtle contrast |
| `--dgo-surface-inverse` | `#0B2A1F` | Dark mode, inverse surfaces |
| `--dgo-border` | `#E8E6E7` | Default borders, dividers |

### Semantic Palette
| Token | Hex | Use |
|---|---|---|
| `--dgo-success` | `#17B255` | Success messages, "Replied" status |
| `--dgo-warning` | `#E1A100` | Warnings, "Pending" status |
| `--dgo-danger` | `#C8102E` | Errors, "Action Required" status |
| `--dgo-info` | `#0B6BB0` | Info messages, "Routed" status |

### Status Colors (Extended)
| Status | Background | Text | Use |
|---|---|---|---|
| Pending | `rgba(225,161,0,0.15)` | `#7A5800` | Awaiting action |
| Routed | `rgba(11,107,176,0.12)` | `#0B6BB0` | Forwarded to another unit |
| Replied | `rgba(23,178,85,0.15)` | `#119143` | Response sent |
| Action Required | `rgba(200,16,46,0.12)` | `#A30D26` | Urgent attention needed |
| Draft | `var(--dgo-primary-soft)` | `var(--dgo-primary)` | Incomplete, unsent |

### Data Visualization
**Categorical (8 colors for charts)**
```
#05583B  Deep Green
#17B255  Smart Green
#0B6BB0  Info Blue
#E1A100  Warning Amber
#C8102E  Danger Red
#4538D9  Civic Indigo
#7A5800  Muted Gold
#A30D26  Dark Red
```

**Sequential (single-hue intensity scale)**
```
#E6EEEB → #99C2B3 → #4D957B → #05583B → #033F2A
```

---

## Typography

### Typefaces
- **Display / Headings:** Outfit (Google Fonts) — weights 400, 600, 700, 800
- **Body / UI:** Verdana (system fallback) — weights 400, 600, 700
- **Monospace (optional):** SF Mono, Consolas, 'Courier New'

### Type Scale
| Token | Size | Use |
|---|---|---|
| `--dgo-fs-display` | 42px | Hero headlines |
| `--dgo-fs-h1` | 32px | Page titles |
| `--dgo-fs-h2` | 24px | Section headers |
| `--dgo-fs-h3` | 18px | Subsection headers |
| `--dgo-fs-body` | 14px | Default body text |
| `--dgo-fs-body-sm` | 13px | Small body, table cells |
| `--dgo-fs-caption` | 11px | Captions, footnotes, meta |

### Line Height
| Token | Value | Use |
|---|---|---|
| `--dgo-lh-tight` | 1.2 | Headings, compact text |
| `--dgo-lh-normal` | 1.5 | Body text, paragraphs |
| `--dgo-lh-relaxed` | 1.7 | Long-form content |

### Font Weights
| Token | Value | Use |
|---|---|---|
| `--dgo-fw-regular` | 400 | Body text |
| `--dgo-fw-medium` | 500 | Emphasized body |
| `--dgo-fw-semibold` | 600 | Buttons, labels, nav |
| `--dgo-fw-bold` | 700 | Strong emphasis |
| `--dgo-fw-black` | 800 | Logo, hero headlines |

### Letter Spacing
- Display text: `-0.02em` (slight tightening)
- Body text: `0` (default)
- Small caps / overlines: `0.12em` – `0.18em`

---

## Spacing Scale

Based on **4px increments**.

| Token | Value | Use |
|---|---|---|
| `--dgo-space-1` | 4px | Tight gaps, icon-text spacing |
| `--dgo-space-2` | 8px | Compact padding, small gaps |
| `--dgo-space-3` | 12px | Default gap between elements |
| `--dgo-space-4` | 16px | Card padding, section spacing |
| `--dgo-space-5` | 20px | Generous padding |
| `--dgo-space-6` | 24px | Section padding |
| `--dgo-space-7` | 32px | Large section gaps |
| `--dgo-space-8` | 40px | Page-level spacing |
| `--dgo-space-9` | 48px | Hero spacing |
| `--dgo-space-10` | 64px | Extra-large spacing |
| `--dgo-space-11` | 80px | Layout-level spacing |
| `--dgo-space-12` | 96px | Maximum spacing |

**Density modes**
- **Compact (default):** `--dgo-density-pad: 8px`, `--dgo-density-row: 40px`
- **Comfortable:** `--dgo-density-pad: 14px`, `--dgo-density-row: 52px`

Set `data-dgo-density="comfortable"` on `<body>` or a container to switch.

---

## Border Radius

| Token | Value | Use |
|---|---|---|
| `--dgo-radius-xs` | 4px | Small elements, badges |
| `--dgo-radius-sm` | 6px | Inputs, small buttons |
| `--dgo-radius-md` | 8px | Buttons, cards (default) |
| `--dgo-radius-lg` | 10px | Large cards, modals |
| `--dgo-radius-xl` | 12px | Hero cards, feature panels |
| `--dgo-radius-pill` | 999px | Pills, status badges |

**Frame radius** — Large containers (dashboards, modals) use `18px` for a distinct outer shell.

---

## Elevation (Shadows)

All shadows use green-tinted `rgba(5, 88, 59, *)` to feel branded rather than generic.

| Token | Value | Use |
|---|---|---|
| `--dgo-shadow-xs` | `0 1px 2px rgba(5,88,59,0.05)` | Subtle lift |
| `--dgo-shadow-sm` | `0 1px 3px rgba(5,88,59,0.08)` | Cards, dropdowns |
| `--dgo-shadow-md` | `0 4px 6px rgba(5,88,59,0.1)` | Elevated cards |
| `--dgo-shadow-lg` | `0 10px 15px rgba(5,88,59,0.12)` | Modals, popovers |
| `--dgo-shadow-xl` | `0 20px 25px rgba(5,88,59,0.15)` | Large overlays |

---

## Motion & Animation

**Philosophy:** Subtle, responsive, governmental. No bounces or playful easing.

| Token | Value | Use |
|---|---|---|
| `--dgo-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default transitions |
| `--dgo-ease-emphasis` | `cubic-bezier(0.4, 0, 0.2, 1)` | Hero animations |
| `--dgo-dur-fast` | 150ms | Hover states, small UI |
| `--dgo-dur-base` | 200ms | Default transitions |
| `--dgo-dur-slow` | 300ms | Modals, large movements |

**Hover states**
- Buttons: color shift + slight shadow increase
- Links: color from `--dgo-primary` → `--dgo-accent`
- Cards: shadow from `sm` → `md`

**Press states**
- `transform: translateY(1px)` for buttons
- Darker background via `--dgo-primary-hover`

---

## Iconography

**System:** Lucide (outline style, 2px stroke, rounded line caps)

**CDN:** `https://unpkg.com/lucide@latest/dist/umd/lucide.js`

**Sizes**
- 16px: Inline with body text, table cells
- 20px: Default UI icons (buttons, nav)
- 24px: Section headers, large actions

**Colors**
- On white: `--dgo-primary` (actionable), `--dgo-ink-500` (decorative)
- On green: `#FFFFFF`

**Usage rule:** Every navigational icon must have a visible text label.

---

## Content & Tone

**Voice:** Operational, precise, governmental — but not robotic.

**Point of view**
- Use "you" for user-facing instructions ("Review your pending tasks")
- Use "DGO" in third-person for institutional messaging ("DGO Digital Ops enables...")
- First-person plural acceptable for team communications ("We've routed this request...")

**Casing**
- **Title Case** for navigation, page titles, section headers
- **Sentence case** for body text, table cells, tooltips
- **ALL CAPS** reserved for NITDA endorsement line only

**Sample operational copy**
- "Task ID #00423 has been routed to Finance Division."
- "14 pending approvals require your action."
- "Bulk memo sent to 127 recipients."
- "Last updated: 2 minutes ago"

**Vibe:** Efficient, trustworthy, government-professional. Think air traffic control UI, not consumer app.

---

## Accessibility

**Target:** WCAG 2.1 Level AAA

**Contrast ratios**
- Normal text (< 18px): 7:1 minimum
- Large text (≥ 18px or ≥ 14px bold): 4.5:1 minimum
- UI components & borders: 3:1 minimum

**Keyboard navigation**
- All interactive elements must be reachable via Tab
- Focus indicators: 2px solid `--dgo-accent`, 3px offset
- Skip-to-main-content link on every page

**Screen readers**
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>`)
- Label all form inputs with `<label>` or `aria-label`
- Status messages use `role="status"` or `aria-live="polite"`

**Motion**
- Respect `prefers-reduced-motion` — disable all transitions and animations

---

## Applications

### Digital (Primary)
- Web dashboards
- Email templates (HTML)
- Internal portals
- Mobile-responsive admin panels
- PDF reports (CSS print styles)

### Print (Secondary)
- Letterhead templates (A4)
- Operational memos
- Weekly/monthly reports
- ID badges (staff only)

### Not Approved For
- Public-facing NITDA.gov.ng properties (use parent NITDA brand)
- External marketing materials (DGO is internal-facing)
- Social media (DGO does not have public social accounts)

---

## Endorsement Rules

Every DGO interface must carry **"An initiative of NITDA"** in one of these placements:

1. **Header** — Top-right corner, small caps, `--dgo-ink-500`
2. **Footer** — Centered or left-aligned, with NITDA logo
3. **Login screen** — Below DGO logo, stacked lockup

The endorsement is non-negotiable. It ensures users understand DGO operates under NITDA's authority.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | May 2026 | Initial release — complete standalone system |

---

**Maintained by:** NITDA Digital Ops Team  
**Contact:** [dgo@nitda.gov.ng](mailto:dgo@nitda.gov.ng)
