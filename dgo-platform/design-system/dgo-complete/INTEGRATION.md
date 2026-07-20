# Integration

How to drop the **DGO Design System** into a new or existing project,
and how it composes with the frameworks and build tools the team
actually uses.

This is the practical companion to `README.md`'s quick-start. Read
`README.md` first; come here for the harder cases.

---

## Table of contents

1. The integration surface
2. Five-minute new project
3. Adopting into an existing project
4. Build-tool wiring (Vite, webpack, Parcel, Rollup, esbuild)
5. Framework adapters (React, Vue, Svelte, Solid, Angular, Web Components)
6. Server-side rendering and hydration
7. Theming and density at runtime
8. Bundle size and tree-shaking
9. CDN delivery
10. Test environments (Jest / Vitest / Playwright)
11. Storybook and design-handoff
12. Verifying the integration

---

## 1 · The integration surface

The system is **plain CSS and SVG**. Three contracts to learn:

- **CSS custom properties** under `--dgo-*` — read by component CSS,
  rebound by themes and densities.
- **BEM classes** under `.dgo-*` — the component contract.
- **Data and ARIA attributes** on the `<html>` element and on
  individual components — the state contract.

There is no JavaScript runtime. There are no peer dependencies. There
is no build step in the system itself. A consuming app can wrap the
contract in whatever runtime it wants (React component, Vue SFC,
Lit element); the system stays unopinionated about that wrapper.

What this means in practice:

- The system ships **eight token files** + **four base stylesheets**
  + **one components bundle** (or 27 split files) + **one icon sprite**.
- All assets are static. Serve from any CDN, any path, any origin
  that allows your application to load CSS and SVG.
- No version of the system has ever shipped a `package.json`,
  `tsconfig`, or framework adapter — those are the consumer's
  problem to wrap if they want one. `[NITDA DS team: confirm whether
  an npm package will be published for v2.x. Until confirmed, treat
  the system as a static-asset drop]`.

---

## 2 · Five-minute new project

The shortest path from zero to a DGO-styled page:

```html
<!doctype html>
<html lang="en-NG" data-theme="light" data-density="comfortable" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My DGO surface</title>

  <link rel="stylesheet" href="/dgo/tokens/tokens.primitive.css">
  <link rel="stylesheet" href="/dgo/tokens/tokens.semantic.css">
  <link rel="stylesheet" href="/dgo/tokens/tokens.theme-light.css">
  <link rel="stylesheet" href="/dgo/tokens/tokens.theme-dark.css">
  <link rel="stylesheet" href="/dgo/tokens/tokens.theme-hc.css">
  <link rel="stylesheet" href="/dgo/tokens/tokens.component.css">
  <link rel="stylesheet" href="/dgo/tokens/tokens.density.css">

  <link rel="stylesheet" href="/dgo/styles/reset.css">
  <link rel="stylesheet" href="/dgo/styles/base.css">
  <link rel="stylesheet" href="/dgo/styles/layout.css">
  <link rel="stylesheet" href="/dgo/styles/components/_index.css">
</head>
<body>

  <main class="dgo-stack" style="padding: var(--dgo-s-6);">
    <h1>New dossier</h1>
    <p>An operator-facing surface inside the DGO Digital Ops portal.</p>

    <div class="dgo-cluster">
      <button class="dgo-btn dgo-btn--primary">Submit</button>
      <button class="dgo-btn dgo-btn--secondary">Cancel</button>
    </div>
  </main>

</body>
</html>
```

That's the contract. Theming and density are attributes on `<html>`;
component CSS reads tokens.

---

## 3 · Adopting into an existing project

When the destination already has its own CSS, the goal is **no global
collisions** and **incremental adoption**. The system makes both easy:

- All system classes are namespaced (`.dgo-*`). They cannot collide
  with `.btn` or `.card` already in your codebase.
- All system tokens are namespaced (`--dgo-*`). They cannot collide
  with `--brand-primary` already in your codebase.
- The system's reset only applies inside surfaces that opt in (see
  below).

### Scoping the reset

`styles/reset.css` is a modern, opinionated reset. Apply it where you
want a DGO surface; **do not** load it globally if other UI on the
same page needs its own typography.

Add a wrapper selector to scope the reset:

```css
/* somewhere after styles/reset.css */
:where(.dgo-surface) { /* the reset rules go here, scoped */ }
```

`[NITDA DS team: confirm whether to publish a `dgo-surface` scoped
build alongside the global reset. Until then, consumers who need
isolation can wrap the system in their build]`.

For most teams, loading the reset globally is fine — it's deliberately
gentle, and the rest of the system uses `:where()`-style low-
specificity selectors to avoid stomping.

### Migrating page by page

Bring DGO in **one surface at a time**:

1. **Pick a page.** Ideally a low-traffic admin surface to start.
2. **Load the chain.** Add the `<link>` tags from §2 to the page.
3. **Re-class the markup.** Replace your buttons with `.dgo-btn`,
   your inputs with `.dgo-input`, etc.
4. **Verify under all three themes.** Most existing-CSS surprises
   show up in dark or HC theme first.
5. **Move to the next page.**

Per `MIGRATION.md`, a page is either on the system or not on the
system — never half-and-half. Within a page, mixing systems leads to
specificity wars and visual debt.

### Cohabitation with Tailwind

The system is **CSS-variable-driven**, not utility-class-driven. It
composes cleanly with Tailwind because they operate at different
layers:

- DGO provides the design contract (tokens, BEM components, themes).
- Tailwind provides the layout escape hatch (`flex gap-4`, `mt-6`).

Use Tailwind utilities for **layout** and DGO classes for **named
components**. Don't restyle a DGO button with Tailwind utilities —
the `.dgo-btn--primary` is the contract, and overriding it with
`bg-blue-500` re-points it off the brand.

If you want to drive Tailwind from DGO tokens, generate a
`tailwind.config.js` `theme` section that reads the CSS variables:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'dgo-action': 'var(--dgo-color-action-primary)',
        'dgo-fg-strong': 'var(--dgo-color-fg-strong)',
        // …
      },
      spacing: {
        'dgo-1': 'var(--dgo-s-1)',
        'dgo-2': 'var(--dgo-s-2)',
        // …
      },
      borderRadius: {
        'dgo-card': 'var(--dgo-radius-card)',
        'dgo-frame': 'var(--dgo-radius-frame)',
      },
    },
  },
};
```

This gets you `bg-dgo-action`, `p-dgo-4`, `rounded-dgo-card` — all
of which automatically theme-switch when `data-theme` changes.

### Cohabitation with another design system

If your team already runs a brand system (Material, Carbon, an
in-house one) and you only need DGO for **federal-facing surfaces**:

1. Load DGO only on those surfaces.
2. Wrap them in a `<div class="dgo-surface">` (or whatever your route
   shell provides) so the reset and base typography stay scoped.
3. Keep the other system loaded globally.

Because the two namespaces don't overlap, the browser is fine
parsing both stylesheets simultaneously. The bytes are the only
cost; defer-load the DGO chain on non-federal routes.

---

## 4 · Build-tool wiring

The system is plain `<link rel="stylesheet">`-friendly. If your build
needs `import "./style.css"` instead, every modern bundler supports
it.

### Vite

```js
// main.js (or main.ts)
import 'dgo-design-system/tokens/tokens.primitive.css';
import 'dgo-design-system/tokens/tokens.semantic.css';
import 'dgo-design-system/tokens/tokens.theme-light.css';
import 'dgo-design-system/tokens/tokens.theme-dark.css';
import 'dgo-design-system/tokens/tokens.theme-hc.css';
import 'dgo-design-system/tokens/tokens.component.css';
import 'dgo-design-system/tokens/tokens.density.css';
import 'dgo-design-system/styles/reset.css';
import 'dgo-design-system/styles/base.css';
import 'dgo-design-system/styles/layout.css';
import 'dgo-design-system/styles/components/_index.css';
```

Order matters: primitives → semantics → themes → component-tokens →
density → reset → base → layout → components. The cascade-layer
declaration in `_index.css` keeps the components in the right layer
regardless of import order, but **token files must load before any
component file that reads them**.

`[NITDA DS team: confirm npm package shape for v2.x release]`. Until
published, replace `dgo-design-system/` with a relative path or a
local symlink.

### webpack, Parcel, Rollup, esbuild

Same imports. All four resolve CSS imports out of the box. No
PostCSS plugins required — the system uses no preprocessor features
beyond what every modern build already passes through (`@layer`,
`@import`, `:has()`, `color-mix()`).

If your build runs through PostCSS with `postcss-preset-env`:

```json
// .browserslistrc — match the system's floor
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
```

This avoids preset-env downgrading features the system relies on
(`@layer`, custom-property fallbacks).

### Static delivery (no build)

The system also runs **without a build**. Drop the directory under
`/public/dgo/` (or wherever your static host serves from), and use
`<link>` tags as in §2.

---

## 5 · Framework adapters

The system is framework-agnostic. Wrappers are easy.

### React

A minimal `<Button>` wrapper, illustrating the pattern:

```tsx
// dgo/Button.tsx
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconOnly = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    'dgo-btn',
    `dgo-btn--${variant}`,
    size !== 'md' && `dgo-btn--${size}`,
    iconOnly && 'dgo-btn--icon',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={cls}
      data-loading={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
```

Notes:

- **The wrapper is thin.** It maps props to BEM modifier classes.
- **The state contract is preserved.** `data-loading` is the system's
  attribute; the React wrapper hands it through.
- **`undefined` not `false`.** React strips `undefined` attributes;
  `data-loading="false"` would still match the CSS selector
  `[data-loading="true"]` (it wouldn't, but you'd have a stray attr
  in the DOM). Strip it cleanly.

For `command-palette`, the React wrapper is heavier because the
component is interactive. See `docs/components/command-palette.md` §8
for the JS contract; the wrapper implements that contract.

### Vue (3, Composition API)

```vue
<!-- dgo/Button.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  iconOnly?: boolean;
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  iconOnly: false,
});
</script>

<template>
  <button
    class="dgo-btn"
    :class="[
      `dgo-btn--${variant}`,
      size !== 'md' && `dgo-btn--${size}`,
      iconOnly && 'dgo-btn--icon',
    ]"
    :data-loading="loading || undefined"
  >
    <slot />
  </button>
</template>
```

### Svelte

```svelte
<!-- dgo/Button.svelte -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'accent' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let loading = false;
  export let iconOnly = false;
</script>

<button
  class="dgo-btn dgo-btn--{variant}"
  class:dgo-btn--sm={size === 'sm'}
  class:dgo-btn--lg={size === 'lg'}
  class:dgo-btn--icon={iconOnly}
  data-loading={loading || undefined}
  on:click
>
  <slot />
</button>
```

### Solid

Same shape as React, except `class` instead of `className` and
signals instead of props for reactivity.

### Angular

```ts
// dgo/button.component.ts
import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'dgo-button',
  template: `<button
    [class]="cls"
    [attr.data-loading]="loading ? 'true' : null"
    (click)="onClick.emit($event)">
    <ng-content></ng-content>
  </button>`,
})
export class DgoButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'accent' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  get cls() {
    return [
      'dgo-btn',
      `dgo-btn--${this.variant}`,
      this.size !== 'md' && `dgo-btn--${this.size}`,
    ].filter(Boolean).join(' ');
  }
}
```

### Web Components (framework-free)

```js
class DgoButton extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'loading'];
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'md';
    const loading = this.hasAttribute('loading');
    this.innerHTML = `
      <button class="dgo-btn dgo-btn--${variant} ${size !== 'md' ? `dgo-btn--${size}` : ''}"
              ${loading ? 'data-loading="true"' : ''}>
        <slot></slot>
      </button>`;
  }
}
customElements.define('dgo-button', DgoButton);
```

Note: Light-DOM is required for the global CSS to apply. The example
above does not use Shadow DOM. If you need Shadow DOM, declare a
constructable stylesheet and adopt the component CSS into the shadow
root.

---

## 6 · Server-side rendering and hydration

The system is **statically renderable**. Component CSS does not
depend on a script tag running to produce its first paint.

- **Initial paint:** Server renders the markup with the right BEM
  classes and ARIA attributes. The CSS loads via `<link>`. The page
  is correct on first paint.
- **Hydration:** Wrap interactive families (modal, command-palette,
  toast, menu, drawer) in a hydration boundary. The CSS-only paint
  remains correct while the JS hydrates.

State-driven attributes (`data-state`, `aria-expanded`,
`aria-selected`) must reflect the **initial** state on the server.
For dialog components, this is typically `data-state="closed"` and
`aria-hidden="true"` on the dialog container, which the CSS
respects via `display: none`. No flash-of-unstyled-dialog.

Theme and density attributes (`data-theme`, `data-density`) on
`<html>` must also be set server-side. The recommended pattern is:

1. Read the user's theme preference from a cookie or query param.
2. Render `<html data-theme="…" data-density="…">` server-side.
3. After hydration, a tiny inline script before the body checks
   `prefers-color-scheme` and may upgrade `data-theme="auto"` to the
   matched value. Keep this script in the document `<head>` to avoid
   a flash.

```html
<head>
  <!-- … other tags … -->
  <script>
    // Theme inline-resolver — runs before the body paints.
    // Keep this <30 LOC; it's blocking.
    (function () {
      var saved = document.documentElement.getAttribute('data-theme');
      if (saved === 'auto' || !saved) {
        var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      }
    })();
  </script>
</head>
```

`forced-colors: active` is detected automatically — the system's HC
overrides fire under both `data-theme="hc"` and
`@media (forced-colors: active)`.

---

## 7 · Theming and density at runtime

The contract:

```js
// Set theme
document.documentElement.setAttribute('data-theme', 'dark');  // or 'light' | 'hc'

// Set density
document.documentElement.setAttribute('data-density', 'compact');  // or 'comfortable'
```

That's the entire API. The CSS rebinds every consumed token via
attribute selectors on `:root[data-theme="…"]` and
`:root[data-density="…"]`.

### Persisting the choice

```js
const KEY = 'dgo:theme';
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(KEY, t); } catch { /* private mode etc */ }
}
function loadTheme() {
  let t;
  try { t = localStorage.getItem(KEY); } catch {}
  if (!t) {
    t = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
  }
  setTheme(t);
}
loadTheme();
```

### Listening to OS preference changes

```js
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only auto-track if the user hasn't pinned a choice
  try {
    if (localStorage.getItem('dgo:theme')) return;
  } catch {}
  document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
});
```

### Per-region theming

The shipped contract puts `data-theme` on `<html>`. To theme a
*region* differently (e.g. a "preview as citizen" panel inside an
operator dashboard), the system accepts `data-theme` on any ancestor
of the region:

```html
<main data-theme="light">
  <!-- operator surface in light -->

  <aside data-theme="dark" class="dgo-card">
    <!-- preview region in dark -->
  </aside>
</main>
```

The component-tier tokens (`--dgo-cmdk-bg`, `--dgo-btn-bg-primary`,
…) re-resolve through the closest ancestor with `data-theme`, because
they're declared on `:root[data-theme="…"]` *and* mirrored onto
`[data-theme="…"]` without the `:root` qualifier. `[NITDA DS team:
confirm the mirroring rule — until v2.1 verifies it across all 26
families, treat per-region theming as opt-in and test the surface in
question]`.

---

## 8 · Bundle size and tree-shaking

The split CSS (`styles/components/*.css`) is the tree-shaking
surface. Each family file is independent of the others except for the
shared token + base + layout chain.

Approximate weights (uncompressed, v2.1):

| Layer | Files | Bytes (approx) |
|---|---|---|
| Tokens (all 7 files) | required | ~ 22 KB |
| Reset + base + layout | required | ~ 8 KB |
| All 26 component families | optional, family-by-family | ~ 65 KB |
| Components monolith (`styles/components.css`) | alternative entry | ~ 65 KB |
| Icons sprite | as-needed (loaded by `<use href>`) | ~ 14 KB |
| Logo assets | as-needed | ~ 8 KB |

Gzip ratio for the chain is typically ~3.5×, so the all-in
compressed weight is around **30 KB** for a full v2.1 drop.

`[NITDA DS team: confirm a precise byte-budget per release]`. Until
confirmed, treat the numbers above as rough.

### Tree-shaking checklist

If bundle size is a hard constraint:

- Replace the monolith load with hand-picked family files.
- Skip families you don't render. The `_utilities.css` file is also
  optional — only `.dgo-divider` and `.dgo-tabular-nums` live there.
- Skip themes you don't ship. If you only ship light + HC, drop
  `tokens.theme-dark.css`.
- Skip the icon sprite if you're already shipping an icon system;
  rebind `--dgo-icon-*` if any to your sprite.

---

## 9 · CDN delivery

The system is static. Any CDN works.

`[NITDA DS team: confirm whether the agency will publish a canonical
CDN URL (e.g. `cdn.nitda.gov.ng/dgo/2.1.0/`). Until published,
consumers vendor the system into their own static-asset host]`.

Recommended cache headers:

- `Cache-Control: public, max-age=31536000, immutable` — the system
  is versioned in the URL, so any release is permanently cacheable.
- Serve over HTTP/2 or HTTP/3. The system is many small files —
  multiplexing helps a lot.
- Brotli-compress everything. Gzip is the floor; Brotli saves
  another ~15% on CSS.

### Sub-resource integrity

Once a CDN URL is published, the system will publish SRI hashes
alongside each release. Until then:

```html
<link rel="stylesheet" href="…" integrity="sha384-…" crossorigin="anonymous">
```

`[NITDA DS team: ship SRI hashes with each release. They're a
one-liner per file in the release script]`.

---

## 10 · Test environments

### Jest / Vitest (jsdom)

jsdom doesn't render the CSS, so component snapshots are testing
*structure*, not visuals. Check classes and attributes, not pixels.

```ts
expect(button).toHaveClass('dgo-btn');
expect(button).toHaveClass('dgo-btn--primary');
expect(button).toHaveAttribute('data-loading');
```

### Playwright / Cypress (real browsers)

Visual regression and a11y assertions belong here. Load the same CSS
chain you ship in production; otherwise tests pass against a CSS
state that production never sees.

Recommended a11y assertions per page:

- `@axe-core/playwright` (or `cypress-axe`) — runs the standard
  WCAG ruleset.
- Manual check: focus ring visible on every interactive element.
- Manual check: page renders correctly under `data-theme="hc"`.

### Visual regression

The showcase (`index.html`) is the canonical reference. Capture it
under all three themes and both densities; diff on every release.

---

## 11 · Storybook and design-handoff

A minimal Storybook config:

```ts
// .storybook/preview.ts
import 'dgo-design-system/tokens/tokens.primitive.css';
// …rest of the chain…
import 'dgo-design-system/styles/components/_index.css';

export const parameters = {
  backgrounds: { disable: true },  // we use data-theme, not story-level bg
};

export const globalTypes = {
  theme: {
    name: 'Theme', defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'hc', title: 'High contrast' },
      ],
    },
  },
  density: {
    name: 'Density', defaultValue: 'comfortable',
    toolbar: {
      icon: 'ruler',
      items: [
        { value: 'comfortable', title: 'Comfortable' },
        { value: 'compact', title: 'Compact' },
      ],
    },
  },
};

export const decorators = [
  (Story, ctx) => {
    document.documentElement.setAttribute('data-theme', ctx.globals.theme);
    document.documentElement.setAttribute('data-density', ctx.globals.density);
    return Story();
  },
];
```

`[NITDA DS team: confirm whether to publish a `@dgo/storybook-preset`
or leave the snippet above as canonical]`.

### Design tooling

The system is also a Figma library — `[NITDA DS team: confirm Figma
URL]`. Token names in Figma match `--dgo-*` exactly so handoff is
mechanical. `[NITDA DS team: confirm Figma plugin (e.g. Figma Tokens,
Style Dictionary) used to keep sync]`.

---

## 12 · Verifying the integration

Before you ship, smoke-pass the following on the surfaces you've
adopted:

- [ ] **Three themes.** `data-theme="light"`, `dark`, `hc` — page
      renders without console errors and without contrast issues.
- [ ] **Two densities.** `data-density="comfortable"`, `compact` —
      no overflow, no clipping.
- [ ] **Two locales.** Render the surface in en-NG and in
      `[Yo|Ha|Ig]`. Headings, button labels, table headers do not
      truncate or wrap badly.
- [ ] **RTL.** Add `dir="rtl"` to `<html>`. Inline padding, icon
      placement, and dialog anchoring flip correctly.
- [ ] **Reduced motion.** Toggle the OS preference. No animation
      exceeds 50ms.
- [ ] **Forced colours.** Toggle the OS preference. Components are
      legible. Focus rings, dialog borders, selected rows all visible.
- [ ] **Keyboard pass.** Every interactive surface reachable via Tab.
      Focus ring visible on each.
- [ ] **Screen-reader pass.** Run VoiceOver or NVDA on one page.
      Headings, landmarks, buttons, form fields announced with
      meaningful names.
- [ ] **No console errors.** The chain loads cleanly under HTTP/2
      with the prescribed cache headers.

If any of these fail, file an issue against the system before
patching downstream — see `CONTRIBUTING.md` §9.
