# DGO R11.6.2 — Critical Duplication, Redundancy & Overlap Assessment

Method: full trace of all 23 modules, 45 core/config files, provisioning declarations and
contract suite. Every finding below is evidence-backed (consumer greps, import graphs,
vocabulary scans). Severity: H = data-integrity/user-facing risk, M = maintenance/consistency
cost, L = hygiene. Findings are recommendations only — no behaviour was changed in this pass.

## A. Duplicated user-facing capabilities

| # | Sev | Finding | Evidence | Recommendation |
|---|-----|---------|----------|----------------|
| A1 | H | Acknowledgment implemented twice with divergent data models | acknowledgment.js writes `acknowledged:true, ackedAt`; response-tracking.js writes `status:'Acknowledged', acknowledgedAt`. A task acked in one lens still shows Pending in the other; SLA compliance reads only `ack/ackedAt` | Single `acknowledgeTask()` transition in core/enterprise-domain writing both field sets; both modules call it |
| A2 | H | Four task-creation paths with divergent record shapes | single-assignment (full: ack, due, supportingDsu), bulk-assignment, executive.routeTask (status 'In progress', no due), lookup.createTaskFromEmail (priority 'P3 (Normal)') | One `createTask()` factory in core/domain; executive/lookup either call it or deep-link into single-assignment with prefill (pattern already used by activities) |
| A3 | H | Five priority vocabularies for the same field | 'low/normal/high/urgent' (activities, single-assignment), 'Low/Medium/High' (correspondence), 'Normal/High/Low' (executive), 'P1 (High)…P4 (Low)' (lookup; fasttrack writes bare 'P1'), 'LOW/MEDIUM/HIGH/URGENT' (registry) | Single PriorityScale in config with display labels; normalize stored values in data-loader; all selects render from it |
| A4 | M | Correspondence disposition in two modules with different audit vocabularies | tracker quick-accept → `tracker:quick-action`; executive approve → `executive-approve` on the same records | Keep both persona surfaces; route both through one `setCorrespondenceStatus()` domain transition so audit trail and side-effects are identical |
| A5 | M | Reports vs Statistics ≈70% overlap | Both: M1–M10 template selectors, date ranges, HTML doc builders, EMAIL dispatch, category/status breakdowns; normalizeRows ≈ rows() duplicated | Merge into one Reports & Analytics workspace (tabs: Management Reports / Analytics), or extract a shared report engine into core/report-export-service.js (exists, currently unused) |
| A6 | M | Eight sync triggers, two endpoint idioms | shell ↻, operator-hud, diagnostics, executive Sync Live (FETCH_ALL), correspondence Force Sync (DYNAMIC_ACTIONS full_sync), fasttrack ribbon ×5, statistics SharepointReport, lookup direct | All delegate to a single sync façade over loadRuntimeData(); keep local buttons, one implementation, one audit action; operator-hud remains the provisioned owner |
| A7 | M | Seven ad-hoc exporters hand-building CSV/HTML/JSON | orchestrator, response-tracking, correspondence (CSV), reports+statistics (HTML), executive (JSON), shell (full-state JSON) | One exportCsv/exportHtml/exportJson in core/report-export-service.js; shell Export delegates to settings exporter or is scoped to current workspace |
| A8 | M | Three annotation stores | s.comments (comments module + executive minutes), s.registryMinutes, task-embedded t.comments (lookup update — never rendered anywhere) | Converge on s.comments with a `type` field (comment / minute / executive-minute / registry-minute); stop writing embedded task comment arrays |

## B. Write-only & orphaned features

| # | Sev | Finding | Evidence | Recommendation |
|---|-----|---------|----------|----------------|
| B1 | H | notifications[] has 3 producers, 0 consumers | fasttrack notify, orchestrator reminder, acknowledgment remind write it; no module renders it | Add a notification surface (shell bell or Home/Operator-HUD panel) — or remove the producers; current UX silently discards user-triggered actions |
| B2 | M | escalations[] written, never read | activities escalation form writes records; executive provisioning claims the stateKey but never reads | Render an escalation queue in FastTrack (its provisioned domain) |
| B3 | M | dispatches[] now written (R11.6.1) but unread | home/statistics provisioning claim it; neither charts it | Add Home 'Dispatched' KPI and a statistics dispatch/channel breakdown |
| B4 | M | s.slas exists in schema + provisioning, never read or written | fasttrack/statistics stateKeys claim it | Remove from schema & provisioning, or implement an SLA policy table that risk()/matrix read |
| B5 | L | activities[].flags written by lookup, rendered nowhere | flagActivity (DG Attention / Follow-Up / INT / UNC) | Badge flags on activities list items and correspondence detail |

## C. Dead / ceremonial code layer

| # | Sev | Finding | Evidence | Recommendation |
|---|-----|---------|----------|----------------|
| C1 | H | Governance is ceremonial in most modules | `governedTransition` imported by 16 modules, called by 0; `actor` similarly; only fasttrack/assistant/executive use executeOwnedAction — all other mutations are raw State.patch | Make governed-actions the single mutation façade: wire executeOwnedAction across mutating modules per action-ownership.config, or drop the unused imports and the pretense |
| C2 | M | Second, unreachable governance stack | action-runtime.js has zero consumers; dispatch-service.js and otp-service.js are reachable only through it | Integrate (route dispatch module sends through dispatch-service; OTP below) or retire all three with contract updates |
| C3 | M | Bulk-assignment provisioning promises OTP; module never uses OtpService | provisioning features otp-modal/requestOtp/verifyOtp; otp-handshake-contract tests the service in isolation only | Wire OTP verification into bulk submissions above a threshold (e.g. >25 records) — closes the gap and gives the service a real consumer |
| C4 | M | Orphan core services kept alive only by contracts | metrics-service, query-store (+data-selectors chain), data-reconciler, write-manager (+idempotency), ui-interactions, shared/generic-module: zero runtime consumers | Decide per service: wire (write-manager → pending-queue writes; data-selectors → shared relatedEmails/lineage selectors), merge, or retire with contract update. generic-module.js can be deleted outright |
| C5 | L | routes.config `kind`/`kpi` metadata unused at runtime | no reader | Either drive nav styling/content-governance from it, or drop the fields |

## D. Duplicated internal logic

| # | Sev | Finding | Evidence | Recommendation |
|---|-----|---------|----------|----------------|
| D1 | M | Activity→correspondence adapters ×3 | enrichCorrespondence (enterprise-domain), correspondence trackerShape/baseRows, executive corrRows — different field fallbacks (subject/title, sender/authorName) | One enrichCorrespondence used by all three |
| D2 | M | Email-correlation heuristics ×3 with different results | fasttrack emailsFor (title substring), response-tracking relatedEmails (ref/title), correspondence/executive (id/subject includes) | Single `relatedEmails(record, s)` selector in core/data-selectors.js (exists, unused) — same lineage everywhere |
| D3 | M | Status classifiers ×5 + canonical status() | response-tracking isComplete/isPending regexes, reports summary() regexes, statistics val() regex, executive stateClass, fasttrack risk() | Extend core/domain with isComplete()/statusTone(); all modules consume it |
| D4 | L | KPI-row builders ×3 | core kpis(), acknowledgment stats(), reports statCards() — the local copies exist to dodge the content-governance `kpis(` ban | Add sanctioned `statRow()` to core/ui.js, allow it in the contract, delete local copies |
| D5 | L | Debounced-search-with-caret ×3, plain debounce ×4 | orchestrator/lookup/response-tracking; activities/correspondence/registry/shell | `debouncedInput()` helper in core/ui.js |
| D6 | L | Date slicing `String(x).slice(0,10/16)` ~30 occurrences | all modules | fmtDate()/fmtDateTime() helpers |

## E. Module-boundary overlaps

| # | Sev | Finding | Evidence | Recommendation |
|---|-----|---------|----------|----------------|
| E1 | M | operator-hud vs diagnostics ≈50% duplicated panels | both show last-load key, requestId/runId, contract badge, pending queue, sync button | Merge into one System Health workspace (tabs: Live Ops / Certification), or strictly delineate: HUD = queues+sync only; diagnostics = checks only |
| E2 | M | Task status mutation leaks across three lenses | activities (full transition), orchestrator (complete), response-tracking (ack→status), lookup (status/priority editor) — despite action-ownership.config | Enforce ownership: transitions in activities/orchestrator only; response-tracking ack via A1's shared transition; lookup links to orchestrator instead of embedding an editor |
| E3 | M | Registry 'Archive file' and Archive module are disconnected | registry sets registryFiles.status='Archived' only; no immutable bundle is created; archive module bundles via ArchiveService independently | Registry archive action calls ArchiveService.archiveReference (or deep-links to Archive with ref prefilled) so 'Archived' status always has evidence |
| E4 | L | Triple navigation entry points | nav sidebar, home quick actions, welcome overlay grid | Acceptable (welcome is once-only); keep home actions data-driven from routes.config to avoid drift |

## F. Provisioning-configuration drift

Declared capabilities not matched by implementation (beyond C3/B2–B4): platform-provisioning
stateKeys reference collections modules never read (statistics: dispatches, slas; executive:
escalations; fasttrack: slas). Recommendation: reconcile the provisioning config each release
and add a drift contract that fails when a module's declared stateKey never appears in its
source — turning provisioning from aspiration into enforcement.

## Priority sequence (impact ÷ effort)

1. A1 acknowledgment unification + A3 priority scale (data integrity, small surface)
2. B1 notifications surface (three existing features currently invisible to users)
3. C1 governance façade decision (largest architectural redundancy)
4. A5 reports/statistics consolidation + A7 shared exporter (biggest code-size win)
5. E3 registry↔archive linkage (evidence-chain completeness)
6. E1 HUD/diagnostics merge; then C2–C5 dead-code disposition; then D-series helper extraction
