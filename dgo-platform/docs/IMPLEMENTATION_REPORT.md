# DGO Digital Operations R11.2.1 — Independent Verification & Audit

**Artifact:** `DGO_Digital_Operations_R11_2_1_Configured_Endpoints_Runtime_state_forensic.json`
**Snapshot:** 2026-07-17T20:59:06Z · 201 files · 31 directories · 1,706,581 bytes
**Scope:** correctness, UI/frontend, frontend↔backend contract, performance. Endpoint security explicitly out of scope.
**Method:** snapshot reconstituted to disk, SHA-256 verified, bundled test suite re-run, static reading of 100% of runtime code, plus behavioural probes executed against the real modules in a DOM.

---

## Verdict

**The platform is not error- and bug-free.** It boots, it is syntactically clean, and all six bundled contract tests pass — but that green status is not evidence of correctness. Eight probes were run against the actual shipped modules; **seven failed.**

| | Result |
|---|---|
| Integrity — 201/201 files match their recorded SHA-256 | ✅ Clean |
| Syntax — `node --check` across all 39 JS + 6 MJS files | ✅ Clean |
| Bundled suite — 6/6 contract tests | ✅ Pass (but see §5) |
| Behavioural probes — written for this audit | ❌ **7 of 8 fail** |

The bundled suite passes because **it tests that files exist and that strings appear in them.** Not one assertion exercises a function, renders a component, or checks a value. One test actively *pins the bug described in §2.1 in place* as a contract.

---

## 1. Critical

### 1.1 Stored HTML injection via the Settings → Name field · `modules/settings.js:5`, `shared/shell.js`

`core/ui.js` exports a correct escaper, `esc()`. Settings does not use it.

```js
<input name="name" value="${s.profile.name}">     // unescaped
<input name="email" value="${s.profile.email}">   // unescaped
<input name="${k}" value="${s.settings.endpoints[k]||''}">  // unescaped
```

The value is attacker-supplied through the very form that renders it, persisted to `localStorage`, and re-rendered on every visit. `shared/shell.js` repeats the flaw in two more sinks — `<b data-name>${s.profile.name}</b>` in the sidebar and `<h1>Welcome, ${s.profile.name}</h1>` in the welcome dialog — so the payload also lands in the persistent shell chrome on every route.

**Probe result — attribute break-out succeeded:**

```
input:  " autofocus onfocus="window.__PWNED__=1
result: autofocus=true  onfocus="window.__PWNED__=1"
```

This is not an endpoint-security issue; it's an output-encoding defect inside the frontend, and it is in scope. Every other module escapes correctly — Settings and the shell are the outliers.

**Fix:** wrap all three sinks in `esc()`. In `shell.js` use `textContent` for `data-name`, as `identity()` already correctly does.

### 1.2 Saving Settings silently destroys `welcomeSeen` · `modules/settings.js:5`

```js
State.patch({ settings: { theme: d.theme, density: d.density, maxBulkAssign: +d.max||50, endpoints } });
```

The object is rebuilt from scratch rather than spread over the existing settings, so any key not in that literal is dropped.

**Probe result:** `welcomeSeen: true` → **`undefined`** after one Save. The onboarding modal returns on the next boot for every user who has ever opened Settings. Any future settings key inherits the same silent data loss.

**Fix:** `settings: { ...State.get().settings, theme: d.theme, ... }`.

### 1.3 State written by an earlier build hard-crashes the API layer · `core/state.js:5`

```js
state = { ...initial, ...JSON.parse(localStorage.getItem(AppConfig.storageKey) || '{}') };
```

A **shallow** merge with no schema version and no migration. Persisted `settings` replaces the default `settings` wholesale — it does not merge into it. Users upgrading from any build whose settings lacked `endpoints` get `settings.endpoints === undefined`, and then:

```js
const url = st.settings.endpoints[key] || ...   // core/api.js:5
```

**Probe result:** `TypeError: Cannot read properties of undefined (reading 'FETCH_ALL')`.

Every backend call in the app dies at this line. `modules/settings.js:5` and `modules/bulk-assignment.js` reach through the same undefined path. The `storageKey` is `dgo.r11.viewport.runtime.state` while `AppConfig.version` reads `11.1.3-viewport-containment` — the key is stable across versions, so this state *will* be inherited.

**Fix:** deep-merge per section and gate on a persisted schema version; drop or migrate on mismatch.

### 1.4 The bulk-assignment cap is bypassable through the same path · `modules/bulk-assignment.js`

```js
const cap = s.settings.maxBulkAssign;
if (ids.length > cap) return toast('Bulk limit exceeded','error');
```

When §1.3's stale state leaves `maxBulkAssign` undefined, `5000 > undefined` → `false`.

**Probe result:** `settings.maxBulkAssign=undefined; guard "5000 > undefined" evaluates to false` — **cap silently disabled**, and the read-only field renders the literal text `undefined`. An unbounded bulk write reaches `BULK_ASSIGNMENT`. This is a governance control failing open, not a cosmetic issue.

**Fix:** `const cap = s.settings.maxBulkAssign ?? AppConfig.maxBulkAssign;` and validate `Number.isInteger(cap)`.

---

## 2. High

### 2.1 The high-contrast theme does not exist

This is the most consequential UI defect, and it is invisible to every bundled test. **Two independent failures stack:**

**(a) The revised HC token file keys on a value the app never writes.**
The app writes `data-theme="high-contrast"` (`app.config.js`, `settings.js`, `shell.js`). `tokens.theme-hc.css:7` selects `[data-theme="hc"]`. It never matches. 24 `--dgo-color-*` HC overrides are dead on arrival. (`tokens.theme-light.css` keys on `"light"` — also never written — but it carries a `:root` fallback, so it survives as the base layer by accident, not design.)

**(b) The legacy HC fallback is clobbered by cascade order.**
`index.html` loads `styles/tokens.css` first and `revised-dgo/platform-authority.css` last. `tokens.css` sets HC values under `[data-theme=high-contrast]` — specificity (0,1,0). `platform-authority.css` reassigns the same variables under `:root` — **also (0,1,0)**. Equal specificity, later source wins.

```
HC theme vars:       --a --bd --bg --dark --fg --focus --mut --p --s --strong --sunken
clobbered by :root:  --a --bd --bg --dark --fg --focus --mut --p --s --strong --sunken
survive:             (none)
```

**All eleven.** Nothing survives. High-contrast renders pixel-identical to the default theme. The dark theme escapes only by luck: `platform-authority.css` points `--bg` at `var(--dgo-color-surface-sunken)`, and `tokens.theme-dark.css` *does* override 17 matching `--dgo-color-*` vars under a selector that matches. The HC file overrides 24 under a selector that doesn't.

Compounding it, `platform-authority.css:28` declares `html[data-theme="high-contrast"] { color-scheme: light; }` — the wrong `color-scheme` for what is meant to be a black-background accessibility theme, and the only place in the revised layer that spells the value correctly.

For a Nigerian federal government platform this is likely an accessibility-compliance exposure, not just a cosmetic one.

**Fix:** rename the selector in `tokens.theme-hc.css` to `[data-theme="high-contrast"]`, and resolve the `:root`-vs-`[data-theme]` collision — either move `platform-authority.css`'s legacy-alias block ahead of `tokens.css`, scope it to `html:not([data-theme])`, or delete the now-redundant legacy theme blocks. Add a computed-style test that asserts `--bg` actually changes per theme.

### 2.2 Every search box loses focus on the first keystroke

`activities.js`, `correspondence.js`, `orchestrator.js`, and `lookup.js` all do:

```js
el.querySelector('[data-q]').oninput = e => { q = e.target.value; render(el); };
```

`render()` rewrites `el.innerHTML`. The focused `<input>` is destroyed and replaced mid-keystroke.

**Probe result:** `focused before keystroke=true; input node replaced=true; still focused after=false`

Typing "memo" requires four separate clicks back into the field. Search is effectively unusable across four workspaces. The `value="${esc(q)}"` round-trip preserves the text, which is why it likely passed manual review — the *characters* survive; the *caret* does not.

**Fix:** re-render only the results container, or restore focus and `selectionStart` after render. Debouncing (§4.1) is a separate, additional need.

### 2.3 Silent data corruption in the Correspondence CSV export · `modules/correspondence.js`

```js
cols.map(c => `"${String(a[c] ?? status(a) ?? '').replace(/"/g,'""')}"`)
```

The `?? status(a)` fallback is applied to **every column**, not just status. Any null/undefined cell is filled with the record's *status*.

**Probe result** — record with `assignedTo: null`:

```
header:  referenceId,title,category,assignedTo,status,created
row:     "R-1","Memo","","Not Treated","Not Treated","2026-01-01"
```

An unassigned record exports as **assigned to "Not Treated."** It is inconsistent, too: `category: ''` stays empty (`??` ignores empty strings) while `assignedTo: null` corrupts. Exported registry data is the kind of artifact that ends up in a minute or a briefing.

**Fix:** `String(c === 'status' ? status(a) : (a[c] ?? ''))`.

Related, same function and `response-tracking.js`/`orchestrator.js`: values beginning `=`, `+`, `-`, or `@` are written unquoted-of-intent into CSV and will execute as formulas in Excel. Prefix such cells with `'`.

### 2.4 Bulk Assignment silently ignores newline-separated IDs · `modules/bulk-assignment.js`

The field is a `<textarea rows="4">` — an invitation to paste one ID per line. The parser splits on commas only.

**Probe result:** two IDs pasted on separate lines → **0 records updated**, and the UI still reports success.

The operator sees a confirmation dialog saying "Apply to 1 record(s)?", confirms, and gets a toast reading `0 records updated`. Nothing warns them that their input was misread.

**Fix:** `d.ids.split(/[\s,;]+/)`, and reject IDs that match no record instead of skipping silently.

---

## 3. Medium

**3.1 Direct state mutation defeats change detection.** `activities.js`, `orchestrator.js`, `approvals.js`, `acknowledgment.js`, `dispatch.js`, `registry.js`, and `user-admin.js` all mutate objects in place, then pass the *same array reference* to `State.patch`:

```js
const t = s.tracking.find(x => x.id === sel.id); t.status = 'Completed';
State.patch({ tracking: s.tracking });   // identical reference
```

It works only because `patch` rebuilds the top-level state object. Any future `===` diffing, undo, or memoization silently no-ops. It also means the `initial` template is progressively contaminated at runtime.

**3.2 Stale-closure races across every confirm dialog.** The pattern is `const s = State.get()` → `await confirmAction(...)` → `State.patch({...s.something})`. `s` is captured *before* an unbounded user-interaction await. Anything that changed while the dialog was open — including a background `State.on` listener — is overwritten on confirm. Re-read state after the await.

**3.3 The router has no render cancellation.** `core/router.js` does `out.innerHTML=''; await fn(out);` with no generation token. Two fast hash changes interleave; the slower module wins and paints into the newer route's outlet. Guard with a monotonic token compared after each await.

**3.4 Unknown routes fail open to the default.** `handlers.get(p) || handlers.get(AppConfig.defaultRoute)` — a typo'd or stale bookmark silently lands on Activities with no 404 and the address bar still showing the bad hash.

**3.5 RBAC nav does not refresh on persona change.** `shell.connectedCallback` subscribes `State.on(() => this.identity())` — identity only. Changing persona in Settings re-computes nothing; `canAccess()` gating is stale until a manual reload. The links are cosmetic anyway — routes are registered unconditionally in `boot.js`, so `#/user-admin` remains reachable by URL for every persona. Gate in `Router.render`, not only in the nav template.

**3.6 Sidebar collapses on every click, by contract.** `shell.js` binds `collapse` to `pointerdown` on both the nav and main. On desktop that fires `shell.classList.add('collapsed')` — so clicking a nav link, or anywhere in the content, collapses the sidebar. The intent was plainly an outside-click handler for mobile. `tests/viewport-containment-contract.mjs` asserts these two lines are *present*, freezing the defect as a contract.

**3.7 `State.patch` writes the entire state to `localStorage` on every mutation, unguarded.** No try/catch. The `pending` queue holds up to 250 full request payloads, `audit` and `comments` grow unbounded. `QuotaExceededError` will surface as an uncaught throw inside an event handler, and every write re-serializes the whole tree.

**3.8 File import has no error handling.** `settings.js`: `JSON.parse(await fi.files[0].text())` — malformed JSON produces an unhandled rejection and no toast; cancelling the picker throws on `files[0]`.

**3.9 Module-level state leaks across navigation.** Eleven modules hold `let q/seg/selId/tab/editing/creating/messages` at module scope. Leave Correspondence mid-draft with `creating = true`, come back later, and the form is still open. `assistant.js` retains the full chat transcript for the session lifetime and re-sends it on every call.

**3.10 SLA compliance is computed by string comparison.** `acknowledgment.js`: `t.ackedAt <= t.ack + 'T23:59:59'` compares a UTC ISO timestamp against a timezone-naive local date string. It happens to work for same-day cases and misreports across the WAT/UTC boundary. Compare `Date` objects.

**3.11 Shell listener is never released.** `State.on()` in `connectedCallback` with no `disconnectedCallback` unsubscribe.

**3.12 Dispatch queue sorts backwards.** `dispatch.js` sorts already-dispatched items above pending ones. For an action queue, that is inverted.

**3.13 Dead code.** `JSON_HEADERS` in `endpoints.config.js` is declared and never used. `core/api.js` builds its headers inline.

---

## 4. Performance

**4.1 The list views have no virtualization, pagination, or debounce.** Measured against the real `activities.js` module with 5,000 records:

| | Measured (jsdom) |
|---|---|
| Initial mount | **6,004 ms** |
| 4 keystrokes in search | **5,271 ms** (~1,318 ms each) |

jsdom is materially slower than a browser engine, so treat these as an upper bound — but even at a 5× discount that is ~260 ms of blocking main-thread work *per keystroke*, on top of a full string-concat and `innerHTML` reparse of the entire result set. Every keystroke rebuilds every row. Debounce the input (~150 ms), render only the visible window, and stop rebuilding the toolbar and KPI header on filter changes.

**4.2 Eleven render-blocking stylesheets.** `index.html` serializes 11 `<link rel="stylesheet">` before first paint — 55.8 KB that would be ~12 KB gzipped as one file. The bundled `scripts/serve.py` uses `SimpleHTTPRequestHandler`, whose `protocol_version` is **HTTP/1.0** — no keep-alive, so that is 11 fresh TCP connections. Concatenate the token layers, or at minimum set `protocol_version = "HTTP/1.1"`.

**4.3 1.8 MB of the 2.2 MB package is never loaded.** `design-system/` is 134 files and 1.8 MB. No runtime code references it — only `tests/design-system-authority-contract.mjs` reads it, to assert files exist. The runtime consumes `styles/revised-dgo/` instead. It is either the source-of-truth that should be building those tokens, or it should not ship.

**4.4 The global header search is O(n) over the DOM on every keystroke** — `shell.js` walks `main .record, main .data-line, main tbody tr` and toggles `hidden` per node, undebounced, and it silently does nothing on routes that render none of those three selectors.

**4.5 22 dynamic `import()` chunks, unbundled**, each a separate request on first navigation.

---

## 5. Why the green status is misleading

The manifest reports `validation.status: "passed"`, `sha256Verified: true`, `configuredEndpointCount: 17`. All three are accurate. They are also nearly meaningless as evidence of correctness.

I re-ran the suite — 6/6 pass. Here is what those six tests actually assert:

| Test | What it checks |
|---|---|
| `static-validation.mjs` | 10 files exist |
| `route-contract.mjs` | 22 module files exist |
| `content-governance-contract.mjs` | the string `kpis(` is absent from 12 files |
| `design-system-authority-contract.mjs` | files exist; strings appear in CSS |
| `viewport-containment-contract.mjs` | CSS/JS substrings appear — **including the §3.6 bug** |
| `endpoint-configuration-contract.mjs` | URL shape; the only test that imports real code |

Five of six are `fs.existsSync` and `String.includes`. **Nothing renders a module, calls a function, or asserts a value.** That is why a dead theme, a focus-destroying search box, a corrupting CSV export, and a cap that fails open all sit inside a green build.

`viewport-containment-contract.mjs` is worth calling out specifically: by asserting that `navEl.addEventListener('pointerdown', collapse)` is present in the source, it converts a UX bug into a protected contract. Any correct fix will fail the suite.

---

## 6. What is genuinely sound

Worth stating plainly, because it is real work:

- **Integrity is perfect** — 201/201 SHA-256 matches, zero skips, zero errors, no binaries.
- **Zero syntax errors** across 45 files; no runaway dependencies; no build step to break.
- **`core/ui.js:esc()` is correct** and applied consistently in ~20 of 22 modules. The XSS is two outliers, not a systemic absence.
- **`core/api.js` is well-shaped** — `AbortController` with per-contract timeouts, correlation IDs, `finally`-scoped cleanup, and a bounded offline queue. The failure-to-`pending` pattern is a sound offline story.
- **The endpoint contract layer is disciplined** — frozen objects, contract/URL separation, a settings override path with restore-to-default, and the one test that does real work guards it.
- **The viewport containment model is coherent** and genuinely uncommon to get right: `100dvh`, contained scroll regions, `forced-colors` and `prefers-reduced-motion` blocks, a print stylesheet, 44px touch targets.
- **Accessibility fundamentals are present** — skip link, `aria-live` toasts, `aria-modal` dialogs, `aria-label`s, `<noscript>` fallback.
- **`shell.js:identity()` uses `textContent`** — the correct pattern, sitting three lines from the `innerHTML` sink that isn't.

The architecture is sound. The defects are localized and every one of them is a contained fix.

---

## 7. Remediation order

**Before this ships**

1. `esc()` the three unescaped sinks — `settings.js` name/email/endpoints, `shell.js` `data-name` and welcome heading (§1.1)
2. Spread existing settings in the Settings save (§1.2)
3. Deep-merge + schema-version the persisted state (§1.3) — this alone clears §1.4 and two crash paths
4. `?? AppConfig.maxBulkAssign` on the bulk cap, and validate it (§1.4)
5. Fix the CSV column fallback (§2.3)

**Next**

6. `[data-theme="hc"]` → `[data-theme="high-contrast"]`, resolve the `:root` cascade collision, add a computed-style assertion per theme (§2.1)
7. Scope the search re-render / preserve focus (§2.2), then debounce (§4.1)
8. Split IDs on any whitespace or delimiter; report unmatched IDs (§2.4)
9. Rewrite `viewport-containment-contract.mjs` to assert behaviour, then fix the pointerdown collapse (§3.6)
10. Re-read state after every `await confirmAction` (§3.2); add a router generation token (§3.3)

**Then**

11. Replace substring assertions with DOM-level tests. The eight probes written for this audit are a starting point — seven of them are currently red and each one maps to a defect above.
12. Bundle the token layers; set `protocol_version = "HTTP/1.1"` (§4.2)
13. Decide whether `design-system/` builds `styles/revised-dgo/` or leaves the package (§4.3)
14. Gate routes in `Router.render`, not only in the nav (§3.5)
15. Guard `localStorage` writes; bound `audit`/`comments` (§3.7)

---

*Endpoint security was excluded by instruction and was not assessed. Note only that the audit's scope boundary is not the code's: `config/endpoints.config.js` embeds 17 live Power Automate SAS signatures in client-delivered source, and `core/state.js` mirrors them into `localStorage`. Flagged as scope, not as a finding.*


# Implementation disposition
Critical and high findings plus the systemic reliability and performance controls were implemented in R11.3.0.
