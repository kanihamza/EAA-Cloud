# Source-to-Current Parity Matrix

Source = 3 standalone SPAs (NITDA Digital Ops Hub, REGEN Bulk Assign Pro, DAA Single-Item Direct Assign).
Current = DGO_R11_6_OBSIDIAN corrected modular platform.

| Source feature | Classification | Current evidence |
|---|---|---|
| Single assignment (supporting assignee, CC, ack-due) | **covered by stronger equivalent** | `single-assignment.js`: "Supporting assignee", "Copy to" (CC), category/subcategory/DSU cascade, ack-due ≤ task-due validation, `confirmAction` preview, governed `invoke('SINGLE_ASSIGNMENT')`, State audit |
| Bulk assignment | covered by stronger equivalent | `bulk-assignment.js` with confirmation modal + preview |
| Reassignment | covered by equivalent | `single-assignment.js` type `reassignment`; `core/lifecycle.js` |
| Fetch emails | covered by equivalent | `correspondence.js` email intake workbench |
| **Create task from email** | covered by equivalent | `correspondence.js` `convertEmail()` → governed correspondence → assignment → task pipeline |
| Flag: DG Attention / For Attention / For Review | covered by stronger equivalent | `registry.js` routing actions incl. `FOR_DG_ATTENTION` + official minute + movement + audit |
| Flag: Follow-Up / INT / UNC | covered by equivalent | registry routing / category codes (`makeRef` default `UNC`) |
| **Set reminder (datetime)** | **present but inactive → IMPLEMENTED** | see below |
| Fetch docs / tasks / lookups | covered by equivalent | `core/data-loader.js` + endpoint contracts |
| Payload preview before submit | covered by stronger equivalent | `core/flow-confirmation.js` central preview + redaction |
| Telemetry / audit | covered by stronger equivalent | `core/audit-log.js` (cap 5000) + State patch-audit (cap 1000) |
| Request timeout / dedup | covered by equivalent | `core/data-client.js` / `fetch-manager.js` / `pending-queue.js` |
| Output escaping | covered by equivalent | `core/ui.js` `esc()` |

## The one genuine gap — SRC-REMINDER

**Before:** `config/dynamic-actions.config.js` defined `DynamicActions.setReminder` (`operation:'create', required:['dueAt'], confirm:true`) — but a whole-tree grep showed the `DynamicActions` registry was imported by **no module or core file**, and no module surfaced any reminder UI. A platform user could not set a reminder, while the source REGEN SPA offered a working reminder feature (datetime → `SUBSIDIARY_ACTIONS action=setReminder`).

**Classification:** `present but inactive` — the contract existed but was not wired to any UI (not merely a naming difference; verified by absence of importers).

**After (implemented):** `modules/orchestrator.js` now consumes the existing contract via `dynamicActionContract('setReminder')` and surfaces a governed "Set reminder" control in the task detail panel:
- collects a due date, **validates the contract-required `dueAt`**,
- **confirmation** dialog with a **payload preview** (`preview-box`),
- **audit** via `State.patch(..., { module:'orchestrator', action:'setReminder', ref })`,
- **governed invoke** through `invoke('DYNAMIC_ACTIONS', { operation:'create', action:'setReminder', ref, dueAt })` with a pending-queue-style local fallback,
- records the reminder on the task (`reminderAt`) and in `notifications`.

**Verified end-to-end in a real browser:** control renders; setting a date + confirming set `reminderAt` on the task, created a notification, and recorded an audit event — 0 page errors. Locked by `tests/source-parity-reminder-contract.mjs` (proven to fail against the pre-change module and pass after).

## No-regression
Full `bash tests/run-all.sh` returns 0 after the change (was 0 before); `boot_import_check.mjs` 23/23. No existing route, endpoint contract, state collection, governance control, or test was modified or weakened — the change is purely additive and activates a previously-dead contract.
