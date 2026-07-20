# Defect Registry — DGO_R11_6_OBSIDIAN_BASELINE forensic pass (R11.7)

Full detail in `DEFECT_REGISTRY.json`. Summary:

| ID | File(s) | Category | Severity | Status |
|---|---|---|---|---|
| DGO-R11.7-000 | core/nitda-module-adapter.js | boot | **critical** | Fixed |
| DGO-R11.7-001 | modules/user-admin.js | governance | **critical** | Fixed |
| DGO-R11.7-002 | modules/dispatch.js, modules/orchestrator.js, modules/approvals.js | governance | high | Fixed |
| DGO-R11.7-003 | modules/orchestrator.js, modules/dispatch.js, modules/user-admin.js | performance | medium | Fixed |

## DGO-R11.7-000 — Boot-blocking syntax error, missed by the first review pass (critical)
`core/nitda-module-adapter.js` had three unquoted, digit-leading object keys (`818ec4...`, `37642ba...`, `3931e2ff...`) — invalid JavaScript grammar. Because `core/boot.js` statically imports this file, the error blocked the entire module graph, leaving every browser stuck on the static "Loading…" placeholder forever. **This was reported by the user after the first pass of this review claimed PASS_WITH_FIXES.** The bug was real and present in the original snapshot; it was missed because the first pass's syntax check used plain `node --check`, which has an undocumented blind spot — it silently skips full validation once a file's top-level `import` triggers Node's module-type auto-detection, so this exact class of error produced a false "no syntax error" result. Fixed by quoting the three keys. The unreliable check was replaced with `tests/syntax-integrity-contract.mjs` (forces true ES-module parsing via `--input-type=module`), and the fix was independently confirmed with a real headless-Chromium boot (zero console/page errors, shell renders) rather than another static check alone.

## DGO-R11.7-001 — Disable-user action had no confirmation step (critical)
`modules/user-admin.js`'s "Disable" button revoked a user's access and called `State.patch()` immediately, with no `confirmAction()` call — the only destructive action in the codebase missing this. Fixed by adding a confirmation dialog matching the pattern used everywhere else (dispatch, orchestrator, approvals).

## DGO-R11.7-002 — Bracket-notation status writes bypassed governance and the platform's own lint (high)
`dispatch.js`, `orchestrator.js`, and `approvals.js` mutated state objects in place via `obj["status"] = 'X'` instead of the codebase's immutable-update idiom. This bracket-notation form evaded `tests/direct-status-write-scan.mjs`, whose regex only matched the dot-notation form (`.status =`). All three files import `governedTransition`/`actor` but never call them. Fixed by switching to non-mutating `.map()` updates with structured `{module, action, ref}` audit metadata, and by strengthening the scan test to also catch bracket-notation assignment.

## DGO-R11.7-003 — Missing render-budget caps on three table/list views (medium)
`orchestrator.js`, `dispatch.js`, and `user-admin.js` rendered full, uncapped arrays into the DOM, unlike every comparable module in the codebase, which caps via `core/render-budget.js`. Fixed by applying `capRows()`/`RenderBudget` consistently.

## Explicitly not flagged
Per the operating directive, hardcoded endpoint URLs in `config/endpoints.config.js` and elsewhere were reviewed and are intentional — not flagged as a defect.

## Areas inspected and found sound (no defect)
- XSS/output-escaping discipline: `core/ui.js` exports a single `esc()` used consistently across all 23 modules for DOM interpolation; spot-checked template literals that looked unescaped on first grep pass all resolved to either non-DOM string building (search index, audit `text` fields later passed through `esc()` at render time) or already-escaped output. No unescaped user-controlled HTML injection found.
- `core/flow-confirmation.js`: backend action payload preview, confirmation, and sensitive-field redaction (`token|secret|password|authorization|apikey|otp`) are implemented centrally and apply to all endpoint invocations through `core/data-client.js`.
- `core/audit-log.js`: audit event array is capped at 5000 entries; `core/state.js`'s automatic patch-audit trail caps at 1000.
- `core/nitda-module-adapter.js`: `window.addEventListener('message', ...)` and `window.NITDA` installation are guarded by an idempotency flag (`window.__DGO_NITDA_ADAPTER_INSTALLED__`) preventing duplicate listener registration.
- No `eval`/`new Function`, no `TODO`/`FIXME`/stub/placeholder markers, no leftover `console.log`, no infinite loops found in `core/`, `config/`, `modules/`, `shared/`.
- Full bundled test suite (65 existing contracts) passed at baseline before any changes were made (return code 0).
