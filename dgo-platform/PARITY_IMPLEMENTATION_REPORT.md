# Parity Implementation Report — Source SPAs vs DGO_R11_6_OBSIDIAN platform

## 1. Executive verdict
**PASS_WITH_IMPLEMENTATION.** A strict, evidence-led comparison of the three source SPAs against the corrected modular platform found that the platform already covers essentially all source capabilities — most with **stronger** governed/audited equivalents. Exactly **one** genuine gap was found: a `setReminder` action contract that existed in config but was wired to no UI (while the source had a working reminder feature). A tailored, governed equivalent was implemented, validated (full suite RC 0), and verified end-to-end in a real browser. No existing capability was regressed.

## 2. Inputs assessed
- Source: `NITDA_Digital_Ops_Hub_patched.html`, `REGEN_DGO_LIVE_V2_8_ENHANCED_FINAL.html`, `DAA_DGO_HUB_ASSIGN_ITEM_DIRECT_Build_v2.0.html`.
- Current: the corrected `DGO_R11_6_OBSIDIAN` baseline (23 modules, 23 routes, config/core/tests intact), on disk from the prior repair pass.
- Method: direct extraction of source action verbs/flows/endpoints and module-by-module verification in the current platform — not name matching. Every candidate gap was read in source AND checked in the platform before classification.

## 3. Strict parity result
13 source feature areas assessed (`SOURCE_FEATURE_REGISTRY.json`, `PARITY_ASSESSMENT_MATRIX.json/.md`):
- 6 covered by **stronger** equivalents (single/bulk assignment, DG-attention flagging, payload preview, telemetry/audit, escaping).
- 6 covered by equivalents (reassign, email fetch, email-to-task pipeline, follow-up/INT/UNC, data fetch, timeout/dedup).
- **1 present-but-inactive → implemented** (setReminder).

Candidate "gaps" that dissolved on inspection (documented so they are not re-raised): supporting assignee and CC recipient are already in `single-assignment.js` ("Supporting assignee" / "Copy to"); flag→DG-attention is already in `registry.js` routing (`FOR_DG_ATTENTION`); email-to-task is covered by the governed correspondence→assignment pipeline.

## 4. Missing/inferior items found
- **SRC-REMINDER (medium)** — `config/dynamic-actions.config.js` defined `DynamicActions.setReminder` (`operation:'create', required:['dueAt'], confirm:true`) but a whole-tree grep confirmed **zero importers**; no module surfaced a reminder UI. Source REGEN SPA had a working reminder (datetime → `SUBSIDIARY_ACTIONS action=setReminder`). Classified `present but inactive`.

## 5. Implementations completed
- Wired a governed **Set reminder** action into `modules/orchestrator.js` task detail, consuming the existing contract via `dynamicActionContract('setReminder')`:
  contract-driven `dueAt` validation → `confirmAction` with **payload preview** → `State.patch` with **audit meta** (`{module:'orchestrator', action:'setReminder', ref}`) → **governed** `invoke('DYNAMIC_ACTIONS', {operation:'create', action:'setReminder', ref, dueAt})` with a local-fallback catch → records `reminderAt` on the task + a `notifications` entry.
- This also activates the previously-dead `DynamicActions` contract registry in a principled, config-driven way. No stub, no toast-only, no mock endpoint — the real governed call path is used (only live backend execution is environment-dependent).

## 6. Files changed
- `modules/orchestrator.js` (additive: 2 imports, a reminder control in `detail()`, a governed handler in the wiring). No existing behavior removed.

## 7. Tests added
- `tests/source-parity-reminder-contract.mjs` — asserts the contract shape, that a module now consumes it, and that the action is governed (control + dueAt validation + confirmation + preview + audit meta + governed invoke). Proven to **fail** against the pre-change module and **pass** after (not a tautology). Auto-included by the `tests/*.mjs` runner loop.

## 8. Validation result
- `bash tests/run-all.sh` → **RC 0** (all existing contracts + the new parity contract).
- `node boot_import_check.mjs` → 23/23 modules import and expose `mount`.
- **Real headless-Chromium** end-to-end: reminder control renders; date + confirm set `reminderAt`, created a notification, recorded an audit event; 0 page errors.

## 9-11. Runtime package / forensic state / assessment matrix
- Package: `DGO_R11_6_OBSIDIAN_PARITY_HARDENED_RUNTIME.zip` + `.sha256.txt`.
- Forensic state: `PARITY_FORENSIC_STATE.json`.
- Matrix: `PARITY_ASSESSMENT_MATRIX.json` / `.md` (and `SOURCE_TO_CURRENT_PARITY_MATRIX.*`).

## 12. Remaining risks
- Live backend execution of the `setReminder` DYNAMIC_ACTIONS call is environment-dependent (no live NITDA backend here); the governed call path is real and the local state/audit/notification effects are verified. The `.catch` falls back to a queued-locally toast exactly like the platform's other governed invokes.
- The reminder control was placed in the Task Orchestrator detail (the natural task-level home). It is intentionally a single, focused surface rather than duplicated across every module.

## 13. Items intentionally not implemented and why
- **Duplicate per-screen telemetry / preview / timeout from the SPAs** — the platform already centralizes these (audit-log, flow-confirmation, data-client); re-adding per-module copies would weaken, not strengthen, the architecture.
- **SPA lightweight flags (raw DGAttention/FollowUp badges)** — superseded by governed registry routing minutes; adding raw flags would bypass the audit trail.
- **Hardcoded endpoint URLs / workflow IDs** — intentional per directive; left as-is.

## 14. Final status
**PASS_WITH_IMPLEMENTATION** — one genuine present-but-inactive source capability was found, implemented as a governed tailored equivalent, validated (suite RC 0, boot 23/23, real-browser end-to-end), with no regression to existing platform controls.
