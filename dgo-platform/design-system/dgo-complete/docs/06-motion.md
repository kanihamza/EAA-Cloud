# 06 · Motion

> Motion in DGO is **state, not decoration.** Every transition tells the user
> something changed; every animation has a reason or doesn't ship. Reduced-motion
> is a first-class state, not a fallback.

The motion system is two orthogonal axes — **duration** and **easing** — composed
into four **intent** shortcuts that components consume. All values are tokens; no
component CSS file references a raw `ms` or `cubic-bezier()`. The lint rule for
this is **TODO**; until it ships, code review carries the load.

---

## The duration ramp

Five stops, declared in `tokens.primitive.css`.

| Token | Value | Anchored to |
|---|---:|---|
| `--dgo-dur-instant`    | 50ms  | Pure feedback (button press, switch flip). The user must not perceive a delay. |
| `--dgo-dur-fast`       | 150ms | Hover transitions, focus rings settling, color tweens. |
| `--dgo-dur-base`       | 250ms | The default for state changes: tab indicator, table sort, card lift. |
| `--dgo-dur-slow`       | 400ms | Element entrance — modal, drawer, toast, sheet. |
| `--dgo-dur-deliberate` | 600ms | Hero / orchestrated moments. Used sparingly — at most one per view. |

**Per the W3C ceiling**, anything longer than 5000ms is a user-visible loading event
and should not be a transition. We don't ship a stop above 600ms.

---

## The easing ramp

Six curves. Three "directional" curves for entrance / exit / transit; three special-
purpose.

| Token | Curve | Use |
|---|---|---|
| `--dgo-ease-standard`   | `cubic-bezier(0.2, 0, 0, 1)`     | Default — state changes that begin and end on screen. |
| `--dgo-ease-entrance`   | `cubic-bezier(0.0, 0, 0.2, 1)`   | Element enters the viewport. Slow start, settle. |
| `--dgo-ease-exit`       | `cubic-bezier(0.4, 0, 1, 1)`     | Element leaves. Quick depart, no settle. |
| `--dgo-ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1.2)`   | Slight overshoot — for hero moments only. |
| `--dgo-ease-sharp`      | `cubic-bezier(0.4, 0, 0.6, 1)`   | Symmetrical — temporary states that revert (tooltip, hover). |
| `--dgo-ease-linear`     | `linear`                         | Progress, spinners, marquees. Never UI state. |

> **Why `--dgo-ease-standard` ends at `0, 1` not `0.2, 1`.** A faster-than-deceleration
> arrival reads as confident; cubic curves that hang at the end read as hesitant on
> ops-floor displays where pixels are big and timing is brutal.

---

## Intent tier (the only thing components touch)

| Token | Resolves to | Used by |
|---|---|---|
| `--dgo-motion-enter` | `var(--dgo-dur-slow) var(--dgo-ease-entrance)` (400ms) | Modal backdrop, modal body, drawer, toast — every shipped *entrance* keyframe. |
| `--dgo-motion-exit`  | `var(--dgo-dur-fast) var(--dgo-ease-exit)` (150ms) | Dismissal transitions. |
| `--dgo-motion-state` | `var(--dgo-dur-base) var(--dgo-ease-standard)` (250ms) | Default for `transition:` on color, border, shadow, transform. |
| `--dgo-motion-hero`  | `var(--dgo-dur-deliberate) var(--dgo-ease-emphasized)` (600ms) | Reserved for marketing-tier moments — landing, dashboard refresh. |

**Always reach for the intent tier first.** Drop to a primitive duration/easing pair
only if your case genuinely doesn't fit one of the four buckets (and write it down
in a comment if you do).

---

## Shipped keyframes

These are the only named animations declared in shipped component files. **Do not
add inline `@keyframes` to a feature** — promote the pattern up to the relevant
component file, or to `_utilities.css` if it's cross-cutting.

| Keyframe | File | Used by | Notes |
|---|---|---|---|
| `dgo-spin`       | `button.css` (canonical) + reused in `progress.css` | Button loading spinner, `.dgo-spinner` | `to { transform: rotate(360deg) }`. 0.6s in button, 0.8s in progress — both `linear infinite`. |
| `dgo-fade-in`    | `modal.css` | `.dgo-modal-backdrop` | Plain opacity tween. |
| `dgo-modal-in`   | `modal.css` | `.dgo-modal` | `translateY(8px) scale(0.98)` → rest. |
| `dgo-drawer-in`  | `modal.css` | `.dgo-drawer` | `translateX(100%)` → rest. Mirrored under `[dir="rtl"]`. |
| `dgo-toast-in`   | `toast.css` | `.dgo-toast` | `translateY(8px)` → rest. |
| `dgo-skeleton`   | `skeleton.css` | `.dgo-skeleton` | 1.4s `linear infinite` shimmer; `background-position` 200% → -200%. |

### Reusing vs. duplicating

`dgo-spin` is the single canonical spinner. Any new "loading" indicator must reuse
it, not declare a new rotation. Likewise, any rectangular entrance from below
should compose `dgo-fade-in` + `translateY(8px)` rather than inventing
`dgo-something-pop-in`.

---

## Transitions in the shipped components

Every shipped transition uses `--dgo-motion-state` (250ms standard) except where
noted. Pulled from `styles/components/`:

| Component | Properties transitioned |
|---|---|
| Button         | `background-color`, `border-color`, `color`, `box-shadow`, `transform` |
| Input / Search | `border-color`, `box-shadow`, `background-color` |
| Card           | `box-shadow`, `border-color`, `transform` |
| Sidebar item   | `background`, `color` |
| Tabs trigger   | `color`, `border-color` |
| Switch track   | `background-color` |
| Switch knob    | `transform` (the slide) |
| Progress fill  | `inline-size` |
| Chip           | `background` |
| Link (base.css)| `color`, `text-decoration-color` |
| Skip link      | `transform` (slide-in on focus) |

If you write a new component and your `transition:` doesn't end in
`var(--dgo-motion-state)` — pause. The custom duration is probably not earning its
place.

---

## Reduced motion — first-class

`tokens.semantic.css` ends with a `@media (prefers-reduced-motion: reduce)` block
that rebinds the duration primitives at the **token level**:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --dgo-dur-instant:    0ms;
    --dgo-dur-fast:       0ms;
    --dgo-dur-base:       0ms;
    --dgo-dur-slow:       50ms;
    --dgo-dur-deliberate: 50ms;
  }
}
```

Because intent tokens reference duration primitives, every `--dgo-motion-*` shortcut
automatically collapses — components don't need to opt in. The two slow stops keep
a **50ms minimum** so entrances are still perceived (a hard cut into a modal is
disorienting), just not animated.

### What still moves under reduced motion

| Pattern | Behaviour |
|---|---|
| Color / border / shadow transitions | Instant — `0ms`. Functionally a swap. |
| Modal / drawer / toast entrance     | 50ms cross-fade. No translate. |
| Skeleton shimmer                    | **Still animates** — it's a status indicator, not a transition. If you object to that for your audience, gate it on a class. |
| Spinner                             | **Still animates** — same rationale. |
| Progress fill                       | Still transitions (50ms via `--dgo-motion-state` → 0ms). |

### What you must not do

- ❌ Write `@media (prefers-reduced-motion: no-preference) { … }` to gate animation
  *on*. The system already collapses durations to zero — opt-out, not opt-in.
- ❌ Use `transform: scale()` or `transform: translate()` outside a named keyframe
  without wrapping the animation in `@media (prefers-reduced-motion: no-preference)`.
  Translation and scale are the vestibular-trigger axes; color and shadow are safe.
- ❌ Parallax. Period. There is no scroll-linked motion in the shipped set and there
  shouldn't be.

---

## Composition recipes

### Entrance + exit pair

The shipped pattern: backdrop fades, content translates-and-fades. The exit reverses
on `--dgo-motion-exit` (150ms), not `--dgo-motion-enter` — exits are faster than
entrances.

```css
.dgo-modal-backdrop[data-state="open"]    { animation: dgo-fade-in var(--dgo-motion-enter); }
.dgo-modal-backdrop[data-state="closing"] { animation: dgo-fade-in var(--dgo-motion-exit) reverse; }
.dgo-modal[data-state="open"]             { animation: dgo-modal-in var(--dgo-motion-enter); }
.dgo-modal[data-state="closing"]          { animation: dgo-modal-in var(--dgo-motion-exit) reverse; }
```

### Press feedback

The button rule uses `--dgo-motion-state` for hover and a separate `transform`
declaration for press. The transform is the only thing on `--dgo-dur-instant` —
press feedback must be sub-100ms or it reads as latency, not response.

```css
.dgo-btn { transition: transform var(--dgo-dur-instant) var(--dgo-ease-standard); }
.dgo-btn:active { transform: scale(0.98); }
```

### Tab indicator slide

A horizontal indicator under tabs is the classic case where transition wins over
animation: the underline doesn't enter or exit, it moves.

```css
.dgo-tabs__indicator {
  transition: transform var(--dgo-motion-state), inline-size var(--dgo-motion-state);
}
```

`--dgo-motion-state` (standard easing) — not entrance, because the indicator is
already on screen.

---

## Choreography

Two rules for sequencing.

1. **Stagger by intent, not by index.** A list of cards entering should not animate
   in order with a 50ms-per-card delay; it should fade in as a block at
   `--dgo-motion-enter`. If you genuinely need staggered entrance (an empty-state
   illustration revealing its parts), cap total choreography under 800ms.
2. **One hero per view.** `--dgo-motion-hero` is for the single moment of arrival
   on a page. Two simultaneous hero animations don't read as orchestration; they
   read as broken.

---

## Anti-patterns

- ❌ `transition: all`. Specify properties. The `all` shortcut transitions properties
  you didn't intend (layout, intrinsic size) and trashes performance.
- ❌ Hover-only animation on a touch surface. Touch users get nothing, then a
  delayed `:hover` sticky state. Use focus + active in addition.
- ❌ Re-triggering an entrance on every state change. Animations should fire on
  mount/unmount, not on every prop update. Use CSS `animation-play-state` or scope
  the keyframe to a `[data-state="entering"]` selector.
- ❌ Auto-dismiss timers shorter than the entrance duration. A toast that animates
  in over 400ms and dismisses at 2s feels frantic. The system's toast component
  defaults to 5–7s — keep it there.
- ❌ Looping decoration. There is one looping animation in the shipped set
  (`dgo-skeleton`) and it has a status reason. Pulses, glows, breathing rectangles
  do not ship.

---

## Open questions (for v2.2)

- **Page-level view transitions** via the View Transitions API are not shipped.
  Worth piloting on the dashboard once browser coverage clears 90% (currently the
  evergreen-Chromium-only API would force a polyfill we don't want to maintain).
- **A canonical `pulse` keyframe** for "live data" indicators (live tickers,
  ops-floor alerts) — not shipped because we don't yet have a component that
  needs one. Add when the first does, not before.
