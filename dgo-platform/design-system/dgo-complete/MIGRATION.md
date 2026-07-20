# Migration

How to move between published versions of the **DGO Design System**.

One section per version-pair. Every breaking change carries a row.
Every row carries a codemod — a sed expression, a regex, or a manual
recipe — so consumers can mechanise the diff.

For the *additive* diff between versions (new tokens, new component
families), read `CHANGELOG.md`. This file records what **changed
shape** between releases.

---

## 2.0 → 2.1

**No breaking changes.** v2.1 is purely additive over v2.0:
documentation set, governance scaffolding, the `command-palette`
family, and a per-family CSS split that runs **alongside** the v2.0
monolith. Consumers do nothing.

### Optional: switch to the split CSS

If you want tree-shaking — only load the component families you use —
replace the single `<link>` to `styles/components.css` with a load
of `styles/components/_index.css` (full split, same coverage), or
hand-pick individual family files.

```diff
- <link rel="stylesheet" href="styles/components.css">
+ <link rel="stylesheet" href="styles/components/_index.css">
```

Or, for partial adoption — only load what you need:

```html
<!-- Tokens (always all of these — they're additive across themes) -->
<link rel="stylesheet" href="tokens/tokens.primitive.css">
<link rel="stylesheet" href="tokens/tokens.semantic.css">
<link rel="stylesheet" href="tokens/tokens.theme-light.css">
<link rel="stylesheet" href="tokens/tokens.theme-dark.css">
<link rel="stylesheet" href="tokens/tokens.theme-hc.css">
<link rel="stylesheet" href="tokens/tokens.component.css">
<link rel="stylesheet" href="tokens/tokens.density.css">

<!-- Reset + base + layout -->
<link rel="stylesheet" href="styles/reset.css">
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/layout.css">

<!-- Component families — pick only what you render -->
<link rel="stylesheet" href="styles/components/button.css">
<link rel="stylesheet" href="styles/components/input.css">
<link rel="stylesheet" href="styles/components/card.css">
<!-- … -->
<link rel="stylesheet" href="styles/components/_utilities.css">
```

Both entry points (`styles/components.css` monolith and
`styles/components/_index.css` split) are kept in lockstep on every
release. The split is the v2.1+ default; the monolith stays for
projects that don't want a 27-file blast-radius.

| Old | New | Why | Codemod |
|---|---|---|---|
| `styles/components.css` (monolith) | `styles/components/_index.css` (split) | Optional. Same output; the split enables tree-shaking. | `sed -i 's,styles/components\.css,styles/components/_index.css,g' index.html src/**/*.html` |

### No deprecations

No symbols are marked `@deprecated` in this release. The next
deprecation candidates are recorded in v2.x roadmap RFCs (none
currently open).

---

## 1.0 → 2.0

The 1.0 system shipped as `dgo_digital_ops/` and 2.0 shipped as
`dgo-design-system/`. **Both directories remain on disk** — 2.0 is a
parallel drop, not a renaming. v1 consumers do not break.

Migrating from v1 to v2 is opt-in, surface-by-surface. The list
below records the renames and re-pointings v1 consumers will face
when they migrate.

`[v1 maintainers: confirm migration entries below. The values are
placeholders inferred from the file layout; confirm against the v1
shipped tokens before this row is treated as authoritative]`.

| Old (v1 — `dgo_digital_ops/`) | New (v2 — `dgo-design-system/`) | Why | Codemod |
|---|---|---|---|
| `[v1 token name]` | `[v2 token name]` | `[reason]` | `[regex]` |
| `[v1 class]` | `[v2 class]` | `[reason]` | `[regex]` |
| `dgo_digital_ops/ui_kits/dashboard/` | _(not ported)_ | The v1 dashboard kit lives under v1 only. v2's showcase carries an inline dashboard pattern; a v2 standalone dashboard kit is tracked for v2.2. | Continue to consume the v1 file until ported. |
| `dgo_digital_ops/ui_kits/email_templates/` | _(not ported)_ | The v1 email kit (`Single_Task_NITDA.html`, `Bulk_NITDA.html`, `EmailTask_NITDA.html`) ships as v1 only. Tracked for v2.2. | Continue to consume the v1 file until ported. |

### Format of a real migration row

Once a real rename lands, rows follow this shape:

```
| `--dgo-color-text-primary` (v1.x) | `--dgo-color-fg-strong` (v2.0) | Foreground/background semantics standardised; v2 uses fg/bg pair. | `sed -i 's/--dgo-color-text-primary/--dgo-color-fg-strong/g'` |
```

### Cohabitation rules

Both directories can be loaded into the same page during a migration:

```html
<!-- The v1 system, scoped to its own surface -->
<link rel="stylesheet" href="../dgo_digital_ops/styles.css">

<!-- The v2 system, scoped to its surface -->
<link rel="stylesheet" href="../dgo-design-system/tokens/tokens.primitive.css">
<!-- …rest of v2 chain… -->
```

Because v2 namespaces every selector under `.dgo-*` and every token
under `--dgo-*`, and v1 uses the same root namespace, **cohabitation
inside the same DOM tree is unsafe** for any element under both
systems' selectors. Migrate **surface by surface**, not class by
class. A page is either on v1 or on v2; never half-and-half.

---

## Migration template

When the next breaking version lands, add a section here with this
shape:

```markdown
## 2.x → 3.0

Summary: <one paragraph on the scope of breaks>

### Tokens renamed / removed

| Old | New | Why | Codemod |
|---|---|---|---|

### Classes renamed / removed

| Old | New | Why | Codemod |
|---|---|---|---|

### Attributes renamed / removed

| Old | New | Why | Codemod |
|---|---|---|---|

### Behaviour changed

| Surface | Old behaviour | New behaviour | How to detect | Migration |
|---|---|---|---|---|

### File paths moved

| Old | New | Codemod |
|---|---|---|

### Deprecation grace

Every row above shipped with `@deprecated` in version `<prior minor>`.
Removal lands in this version.
```
