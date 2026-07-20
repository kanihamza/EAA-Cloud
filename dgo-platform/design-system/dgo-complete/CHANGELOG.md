# Changelog

All notable changes to the **DGO Design System** are recorded here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

A version is **MAJOR** when a published token, class, or attribute is
renamed or removed; **MINOR** when something is added without changing
existing API; **PATCH** for visual fixes that do not move tokens.

Deprecations carry at least one full **MINOR** version of grace, marked
with a `@deprecated` comment in the CSS and a per-symbol entry in this
file. See `GOVERNANCE.md` §"Deprecation cadence".

---

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## [2.1.0] — 2026-05-26

The **adoptable baseline.** v2.0 shipped the system; v2.1 makes it
adoptable — split CSS, full documentation set, governance scaffolding,
and one fully-worked interactive component.

### Added

- **Documentation set — 13 evergreen chapters.** Every numbered doc in
  `docs/00-foundations.md` through `docs/12-anti-patterns.md` is now
  on disk and grounded in shipped artifacts.
  - `00-foundations.md` — cascade diagram, layer order, theming walkthrough.
  - `01-tokens.md` — file-by-file index of every `--dgo-*` declared.
  - `02-color.md` — real contrast matrix from the shipped palette.
  - `03-typography.md` — four families, 1.200 ramp, Yo/Ha/Ig risk surface.
  - `04-spacing-grid.md` — 4px base + density + touch-target floor.
  - `05-iconography.md` — sprite contract, RTL flip rules.
  - `06-motion.md` — duration × easing → intent, reduced-motion contract.
  - `07-elevation.md` — green-tinted shadows + z-index scale.
  - `08-accessibility.md` — per-family keyboard + ARIA contracts.
  - `09-i18n-rtl.md` — Yo/Ha/Ig + RTL preparation.
  - `10-content-voice.md` — federal register, per-surface copy contracts.
  - `11-component-template.md` — the fillable shape, 18 sections.
  - `12-anti-patterns.md` — system-wide don'ts grounded in shipped CSS.
- **Per-family component CSS split** — `styles/components.css` (the
  v2.0 monolith) is now reproduced as 26 family files under
  `styles/components/*.css`, surfaced by `styles/components/_index.css`
  via cascade-layer `@import`s. Both entry points are shipped — choose
  the monolith for a single drop or the split for tree-shaking.
- **`command-palette` family** — first §11-template worked example.
  Ships with full doc (`docs/components/command-palette.md`),
  per-family CSS (`styles/components/command-palette.css`), Tier-3
  token block in `tokens/tokens.component.css`, and an interactive
  demo in `index.html`. Implements the WAI-ARIA APG 1.2 combobox-with-
  `aria-activedescendant` pattern. `Ctrl/⌘ + K` opens; Tab closes
  (deliberate divergence — see §9 of its doc).
- **Per-family component contracts (7).** `button`, `input`, `tabs`,
  `table`, `toast`, `modal`, `command-palette` each have a full §11
  fill on disk under `docs/components/`.
- **Governance scaffolding.**
  - `LICENSE` — structural stub with `[NITDA legal: …]` markers.
  - `CONTRIBUTING.md` — the contribution path, RFC requirements.
  - `GOVERNANCE.md` — owners, decision cadence, release process.
  - `MIGRATION.md` — v2.0 → v2.1 diff (no breaking changes).
  - `CHANGELOG.md` — this file.
- **`INTEGRATION.md`** — drop-in guide covering new projects, existing
  projects, framework wrappers (React / Vue / Svelte / Angular / Web
  Components), build-tool wiring, and the partial-adoption contract.

### Changed

- **`README.md`** bumped to reflect v2.1 file tree and the new
  documentation set. No code changes implied.
- **Documentation roadmap** in `index.html` updated to show 7-of-27
  families fully documented (was 0-of-26 in v2.0). Remaining 20
  families tracked for v2.2.

### Deprecated

None.

### Removed

None.

### Fixed

None — v2.1 is additive over v2.0. Visual regressions in shipped
components have a v2.0.x line reserved.

### Security

None.

### Migration

No breaking changes. See `MIGRATION.md` for the additive diff and the
optional split-CSS migration step for projects that want tree-shaking.

---

## [2.0.0] — `[v1 maintainers: confirm v2.0 release date]`

The **system itself.** First full drop of tokens, themes, densities,
26 component families, and the interactive showcase.

### Added

- **347 design tokens** across three tiers (primitive → semantic →
  component), declared in seven files under `tokens/`.
- **Three themes** — light, dark, high-contrast (HC). Switched via the
  `data-theme` attribute on `<html>`.
- **Two densities** — comfortable, compact. Switched via `data-density`.
- **26 component families** under the `.dgo-*` BEM namespace, declared
  in `styles/components.css`:
  button · input · select · checkbox/radio · switch · search · badge ·
  avatar · card · alert · toast · modal · sidebar · topbar · tabs ·
  breadcrumb · stepper/pagination · table · tooltip/popover · menu ·
  empty-state · progress · skeleton · metric · kbd/code · filter-bar.
- **Reset + base + layout** stylesheets under `styles/`.
- **40+ icon sprite** (`assets/icons/sprite.svg`) with 1.5px outline
  stroke at 24px base.
- **Five logo lockups** (`assets/logo/`) — horizontal, stacked, mark,
  white-out, NITDA-endorsed.
- **Interactive showcase** at `index.html` with theme + density toggle.
- **README.md** with quick-start, token philosophy, accessibility floor,
  i18n posture, and the explicit non-negotiables from the brief.

### Migration from v1.0 (`dgo_digital_ops/`)

The v1.0 system shipped as `dgo_digital_ops/` and remains on disk
alongside this directory. v2.0 is a *parallel* drop — not a renaming —
because the v1.0 directory carried email templates and a dashboard
example kit that v2.0 does not yet replicate. `[v1 maintainers:
confirm migration entries — which v1 templates should port forward,
which class renames apply, which tokens were folded vs renamed]`.

---

## Version policy

| Bump | Triggered by |
|---|---|
| MAJOR | Removed/renamed token, class, attribute. Removed component family. |
| MINOR | Added token, class, component family, theme, density, doc chapter. Added per-family doc. |
| PATCH | Visual fix that does not move tokens. Doc typo / link fix. |

Every MINOR carries a `[Unreleased]` section here that fills as work
lands and is renamed-and-dated on tag. Every MAJOR carries a
top-of-release "Breaking changes" subsection with a codemod or sed
recipe for each rename — see `MIGRATION.md` for the format.
