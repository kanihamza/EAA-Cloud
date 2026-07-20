# Governance

How the **DGO Design System** is owned, evolved, and released.

This file is a structural stub. Bracketed `[…]` markers flag where
operating bodies, names, and cadences need to be confirmed by the
NITDA DS team before a public release. The scaffolding — roles,
decision flow, RFC requirements, release gates — is design-system work
and is ready as-is.

---

## 1 · Roles

| Role | Holder | Responsibility |
|---|---|---|
| **Steward** | `[NITDA DS team: confirm steward — typically the head of the agency's design office or the senior PM on operational systems]` | Final call on any RFC. Signs each minor and major release. |
| **Maintainers** | `[NITDA DS team: confirm 2–4 maintainer names]` | Review and merge RFCs, ship releases, run office hours. |
| **Family owners** | One per shipped component family, listed in §18 of each component doc | Own the family's contract, anti-patterns, and migration entries. |
| **Consumer leads** | `[per-consuming-product owner — confirmed on intake]` | Represent their product's needs in RFC discussion. Sign the release-acceptance checkpoint for their product. |
| **A11y reviewer** | `[NITDA DS team: confirm — should be independent of family owners]` | Reviews every component RFC against §08-accessibility. May veto a release for an A-level WCAG regression. |
| **Brand custodian** | `[NITDA brand office: confirm — owner of the NITDA Brand Guidelines (2020)]` | Reviews any change touching `assets/logo/`, the "An Initiative of NITDA" lockup, or the brand-tier color tokens (Deep Green family). |

The steward and maintainers operate the system day-to-day. Family
owners are point-of-contact for their family. The A11y reviewer and
brand custodian have **veto rights** on their respective surfaces;
all other decisions are consensus-among-maintainers with the steward
breaking ties.

---

## 2 · Decision flow

Every change to the system follows one of four paths.

### Path A — PATCH

A visual fix that moves no tokens, classes, or attributes.

1. Open a PR with a before/after screenshot or note.
2. One maintainer review.
3. Merge. Released as a patch bump on the next batched patch release
   (typically weekly).

### Path B — MINOR additive

A new token, class, component family, theme, density, or doc chapter.

1. Open an issue describing the addition and the consumer need.
2. Tag the relevant family owner (or steward if cross-family).
3. If new component family → continue to **Path D (RFC)**.
4. If existing family addition → open the PR. Two maintainer reviews
   plus the family owner's sign-off.
5. Merge. Released as a minor bump on the next minor release
   (typically monthly).

### Path C — MAJOR breaking

A rename, removal, or behaviour change to anything published.

1. Open an issue with the **breaking-change template** (see
   `CONTRIBUTING.md`). It must include: scope of break, every consumer
   surface affected, the deprecation period proposal, and a codemod.
2. Continue to **Path D (RFC)** — no shortcuts.
3. The deprecation must ship in a minor release **before** the
   breaking change merges into main. Minimum one full minor-version
   grace period; longer for tokens and component classes (these touch
   every consumer); shorter is acceptable for internal-only files
   (e.g. `_utilities.css` helpers used in `styles/` only).
4. Released as a major bump. Codemod published in the release notes.

### Path D — RFC

Required for: new component families, breaking changes, new themes,
new densities, a new token tier, anything that changes
`docs/11-component-template.md`'s shape.

1. **Draft.** Open a discussion (or doc PR) titled
   `RFC: <subject>`. Include: problem statement, what's in scope,
   what's out, alternatives considered, the proposed contract,
   migration plan, a11y review, brand review (if applicable).
2. **Two-week review window.** Maintainers, family owners, consumer
   leads, the A11y reviewer, and (if applicable) the brand custodian
   weigh in.
3. **Office hours.** A single live review in the maintainer office
   hour for that week. `[NITDA DS team: confirm office-hour cadence
   and channel]`.
4. **Decision.** Steward records the outcome — **accepted**,
   **accepted with changes**, **rejected**, or **deferred** — at the
   bottom of the RFC. An accepted RFC unlocks the implementation PR.
5. **Implementation.** The PR carries an explicit link back to the
   RFC. Maintainers verify the PR matches the accepted contract.

---

## 3 · Release process

### Cadence

- **Patch** — weekly, batched. Cut on Fridays. `[NITDA DS team:
  confirm or adjust]`.
- **Minor** — monthly. Cut on the last Friday of the month. Carries
  the accumulated `[Unreleased]` block from `CHANGELOG.md`.
- **Major** — when accepted breaking changes have completed their
  deprecation cycle. Communicated **eight weeks** in advance to
  consumer leads.

### Release gates

A release does not ship until **every** gate is green.

- [ ] `CHANGELOG.md` `[Unreleased]` block renamed and dated.
- [ ] `README.md` version-strapline and counts table reflect the
      release (token count, family count).
- [ ] `index.html` showcase carries one demo for every new family.
- [ ] Every new component family has a full §11-template fill on disk
      and is linked from `styles/components/_index.css` and
      `docs/08-accessibility.md`.
- [ ] `MIGRATION.md` updated with a row per renamed symbol if any.
- [ ] Smoke-pass the showcase under light, dark, HC themes and both
      densities — no console errors, no visual breakage in the
      embedded patterns (operator dashboard, citizen portal).
- [ ] A11y reviewer sign-off (a comment on the release issue is
      sufficient until the formal AT matrix is funded — see §08).
- [ ] Brand custodian sign-off if any change touched
      `assets/logo/` or the brand-tier tokens.
- [ ] Tag in git, attach the changelog excerpt to the release entry.

### Deprecation cadence

A deprecated symbol must:

1. Carry a `@deprecated` CSS comment immediately above its declaration
   in the file that ships it.
2. Have a per-symbol row in `MIGRATION.md` with old → new mapping and
   a codemod (sed regex, JS Codemod, or manual recipe).
3. Continue to work for **one full minor-version** at minimum.
   Tokens and base component classes carry **two** minors.
4. Surface a console.warn on first observed use, gated on
   `data-dgo-debug="true"` on `<html>` to avoid spamming production
   surfaces. `[NITDA DS team: confirm whether to ship the warner as
   part of the system or leave to consumers]`.

---

## 4 · Versioning

Semver, with one DGO-specific clarification:

| Surface | Semver-tracked? |
|---|---|
| Token names (`--dgo-*`) | **Yes.** |
| Token values | **Yes** — a token's *value* is part of the contract for partial-adoption consumers. Visual change without rename = MAJOR for that token. |
| Component classes (`.dgo-*`) | **Yes.** |
| Component DOM structure (BEM children, ARIA attributes) | **Yes.** |
| Internal CSS implementation (selectors not exported via the BEM contract) | No. Refactor freely. |
| File paths under `tokens/` and `styles/components/` | **Yes** — they are the import surface. A path move is MAJOR. |
| The `index.html` showcase content | No — it's documentation, not contract. |
| `docs/**` content | No — but documented contracts inside the docs *do* track semver via the symbols they describe. |

---

## 5 · Consumer commitments

What consumers can expect from the system, and what the system
expects from consumers in return.

### From the system

- **Six-month notice** before any breaking change to a token, base
  class, or attribute.
- **A working codemod** in `MIGRATION.md` for every rename.
- **No silent visual changes** to shipped tokens. A token's value
  cannot be moved within a minor.
- **Reduced-motion, RTL, and HC theme honoured** in every shipped
  component before release.

### From consumers

- **Stay on a supported version.** The current minor and the previous
  minor are supported; older versions are best-effort.
- **Report breakage upstream.** A visual regression that looks like a
  system bug should be filed against the system before being patched
  downstream. See `CONTRIBUTING.md`.
- **Don't fork tokens.** Re-binding a component-tier token in a
  consumer-local theme file is fine; redeclaring a primitive
  (`--dgo-green-700: #other`) is not. Open an RFC if a value needs
  to move.

---

## 6 · Out-of-scope (intentionally)

The system does **not** ship:

- JavaScript runtime for component behaviour. Components are CSS-only;
  per-component JS contracts are documented (see §8 of each component
  doc) but implementations live in consuming apps.
- A formal AT test matrix. `[NITDA DS team: confirm funding for a
  VoiceOver / NVDA / JAWS / TalkBack lab]`. Until funded, every
  component doc carries an aspirational AT checklist in §15.
- Localised string libraries. The system ships token-level
  i18n-readiness (logical properties, line-height floor, Latin-
  extended font stack); the strings themselves are consumer-owned.
- A telemetry layer. Adoption metrics are consumer-owned. If a
  centralised telemetry surface becomes desired, open an RFC.

---

## 7 · Document status

This file is a structural stub. The bracketed `[…]` markers flag
every place where the agency must confirm a name, a cadence, or a
policy choice before a public release.
