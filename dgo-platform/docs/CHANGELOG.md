# R11.6.3 Consolidation — Full Resolution of the Duplication/Redundancy Assessment

Every finding in docs/DUPLICATION_REDUNDANCY_ASSESSMENT_R11_6_2.md is now implemented and
contract-locked. Nothing deferred.

## Canonical domain layer (A-series)
- `acknowledgeTask()`, `updateTaskState()`, `setCorrespondenceStatus()`, `createTask()` in
  core/enterprise-domain.js — acknowledgment/response-tracking, activities/orchestrator/lookup,
  correspondence/executive and all four task-creation surfaces now share one transition each;
  the two historical acknowledgment field models are written in lockstep.
- Canonical priority scale (config/priority.config.js) with alias normalization on ingest;
  all five legacy vocabularies (P1..P4, Medium, UPPERCASE, mixed-case) eliminated from
  module sources; badges use `priorityLabel`/`priorityTone`.
- Shared report engine + exporters in core/report-export-service.js (normalized rows,
  summary math, group counts, CSV/JSON/HTML download); Reports, Statistics, Orchestrator,
  Response-Tracking, Correspondence and Executive all export through it.
- One sync façade `requestSync()` behind every sync trigger (shell, Operator HUD, Executive,
  Correspondence, Statistics, FastTrack ribbon, Lookup direct) with one audit vocabulary.
- Annotation convergence: lookup task notes now land in the shared comments store
  (`type:'task-update'`); write-only embedded task comment arrays removed.

## Write-only collections surfaced (B-series)
- Notifications: shell bell with unread badge + side-pane inbox (open/dismiss/clear,
  mark-read); Home shows unread count. Producers finally have a consumer.
- Escalations: FastTrack Escalations queue view with resolve action; escalation levels are
  numeric and escalating writes real escalation records.
- Dispatches: Home stat + Statistics dispatch-channel breakdown.
- Dead `slas` collection removed from state schema, initial state, entity hydration map and
  provisioning; document flags now render in Lookup detail and Home queue badges.

## Governance made real, orphans wired or retired (C-series)
- All 16 ceremonial `governedTransition`/`actor` imports removed; 17 mutating workspaces now
  execute through `executeOwnedAction` with 30+ registered entries in action-ownership.config.
- Bulk assignment enforces the provisioned OTP gate above 25 records via ActionRuntime →
  OtpService (backend path with graceful offline challenge fallback) — giving action-runtime
  and otp-service their first real consumers.
- write-manager + idempotency wired into dispatch backend sends and retry; data-reconciler
  powers settings import (fixing stale enterprise projections after import); metrics-service
  and data-ops summaries render in Operator HUD; query-store feeds assistant context;
  ui-interactions hosts the shared debounced input; shared/generic-module.js deleted.
- routes.config `kind`/`kpi` metadata now drives the content-governance contract.

## Shared logic + boundary delineation (D/E-series)
- One classifier family (`isComplete`/`isPendingStatus`/`statusTone`) and one lineage
  heuristic (`relatedTasks`/`relatedEmails` in data-selectors) replace five status regex
  sets and three email-matching implementations.
- `statRow`, `fmtDate`, `fmtDateTime`, `debouncedInput` shared helpers adopted platform-wide.
- Operator HUD = live operations (sync, queues, inventory, data-ops, live metrics);
  Diagnostics = certification (checks, governance/provisioning health) — duplicated panels
  removed, cross-links added.
- Registry archive now constitutes the immutable evidence bundle via ArchiveService.
- Dispatch sends/retries go to the backend idempotently with a queued-retry surface.
- Home quick actions derive from routes.config.

## Enforcement
- `provisioning-drift-contract` — declared stateKeys must match actual module references.
- `consolidation-contract` — locks every A–E resolution above.
- Full suite: 119 checks pass; boot import 23/23.

---

# R11.6.2 View Behaviour, Pane Independence & Panel Separation

## View switching (defects 1 & 2)
- Master-detail workspaces (activities, correspondence, registry, approvals, dispatch, acknowledgment, orchestrator, response-tracking, lookup, executive) now carry an explicit `data-md` view state. On portrait/narrow viewports exactly one view shows at a time: the queue (`list`) or the selected record (`detail`) with a dedicated back control; row selection switches to the detail view instead of rendering below the fold.
- On desktop, selecting a row resets the detail pane's scroll position so the new record always opens at its top.
- The router resets workspace scroll on every route change; tab-style view switches (correspondence tracker/emails/log-new, FastTrack sub-views) also reset scroll.

## Pane scrolling independence (defect 3)
- Each side of a split (and each column of the DG/CEO tri-pane) is now its own bounded scroll region on desktop: scrolling the item list no longer drags the detail pane along, and the detail of the selected item stays in place while browsing long queues.

## Panel separation with visibility logic (defect 4)
- Detail columns are now `panel-stack`s of independent panels instead of one merged panel:
  activities (Work Record / Update Work State [reveal-on-request] / Work Journal), registry
  (File Jacket / Minute & Route form [reveal-on-request] / Custody Chain), correspondence
  (Record Details / Triage & Disposition [reveal-on-request] / Linked Tasks / Threads),
  executive (Details / AI Preview / Linked Tasks / Threads / Audit Trail / EA Routing),
  dispatch (Record / Execute Dispatch [only when eligible] / Closure [only after dispatch]),
  approvals (Request / Decision or Decision Record), orchestrator (Record / Actions /
  Reminder), acknowledgment (Notice / Receipt Actions), response-tracking (Trace Details /
  Minute Sheet), lookup (Details / per-type action or form or message-body panels).
- Forms are hidden until requested via explicit toggles (`Update work state`, `Minute / Route file`, `Triage / Update`) and close on save/cancel.

## New contract
- `view-pane-contract` — asserts data-md switching, back controls, selection→detail behaviour, scroll-reset wiring, panel-stack separation, reveal-on-request toggles, independent-pane CSS and router scroll reset.

---

# R11.6.1 Modules & Workspace Review (Obsidian hardened baseline)

## Sectioning, responsiveness and state management
- Archive workspace rebuilt into the standard sectioned layout (`.workspace` wrapper, KPI band, toolbar, split control/readiness panels) with a closure-readiness queue filter; it was the only module rendering outside the workspace container.
- Route metadata (`routes.config.js` groups) aligned with the sidebar phase map (`nav.config.js`) for registry, acknowledgment, comments, executive and lookup, so the shell context, sidebar and command palette always agree on a workspace's phase.
- Per-workspace UI state (filters, tabs, selection, pagination, recipients, report templates) unified onto the shared `UIState` store across activities, correspondence, registry, approvals, dispatch, acknowledgment, orchestrator, response-tracking, fasttrack, lookup, executive, reports, statistics, user-admin and archive — replacing ad-hoc module-level variables so workspace state is managed uniformly and survives route changes.
- In-place state mutation removed from acknowledgment and FastTrack row actions; all patches are immutable and carry audit metadata (`module`, `action`, `ref`), including previously silent patches in comments, approvals, registry, single/bulk assignment and user administration.
- Responsive refinements: intermediate two-column breakpoint for the DG/CEO three-pane layout (1001–1280px), small-screen fixes for recipient input rows, action ribbons and record action grids, and toolbar label/select styling.
- Browser tab title now follows the active workspace.

## Formatting, styling, theming and branding
- New brand tokens: `--gold` (NITDA gold) plus theme-aware tone surfaces (`--ok-soft`, `--warn-soft`, `--danger-soft`, `--info-soft`, `--accent-soft`, `--neutral-soft`) with dark and high-contrast overrides.
- All off-brand hard-coded colors removed from `app.css` (Microsoft-blue recipient chips, grey tag palettes, teal SLA bars, orange danger buttons, fixed light backgrounds on pills/tags/threads/alerts/matrix cards/report templates); every component now derives from the token system and adapts to the government, dark and high-contrast themes. The registry minute-sheet "paper" skeuomorph keeps deliberate fixed ink colors and is now readable in dark mode.
- Static inline styles eliminated from module markup in favour of design-system classes (`.panel-eyebrow`, `.flex-1`, `.row-link`/`.row-active`, `.col-narrow`, `.check-inline`, `.grid-title`, `.btn.compact`, `.stack-panel`, `.role-details`, `.result-group`); hand-built tables in acknowledgment, archive, FastTrack, user-admin and the correspondence email desk now use the canonical `dgo-table` classes.
- Runtime document title corrected to the R11.6 Obsidian designation.

## Feature provisioning, module relationships and user journeys
- Dispatch now enforces its provisioned closure gate: only completed work enters the dispatch queue; sends capture channel + recipient and write real records into the `dispatches` collection (previously never populated, leaving Home/Statistics blind to dispatch volume); closure records receipt evidence; a governed no-dispatch disposition with mandatory reason completes the journey.
- Acknowledgment queue gains its provisioned remind action (queued notification with audit trail) and ageing visibility per row and in the detail pane.
- Approvals gains a decided-history view (pending/decided chips) recording deciding actor, timestamp, signature and minute — decisions no longer vanish from the workspace.
- Row interactions standardized: clickable rows use `row-link`/`row-active` affordances with hover and selection states across orchestrator, response-tracking, acknowledgment and user administration.

## New contracts
- `workspace-sectioning-contract` — mounts all 23 modules, asserts sectioned workspace rendering and bans static inline styles.
- `theme-token-contract` — asserts token definitions/overrides per theme and bans off-brand hard-coded colors.
- `journey-provisioning-contract` — asserts nav/route phase agreement, dispatch closure gating and record-keeping, acknowledgment remind provisioning, approvals decision history, and uniform UIState adoption.

---

# R11.1.3 Viewport Containment and Content Governance

- Footer always visible without page scrolling.
- Page-level scroll disabled.
- Main workspace, navigation, pane, modal and table wrappers are contained scroll regions.
- Navigation automatically collapses on workspace or navigation pointer/touch interaction.
- KPI blocks removed from non-dashboard modules.
- Duplicate active module titles removed.
- Contextual header with active workspace and current-workspace search added.
- Responsive forms and adaptive record cards enforced.
