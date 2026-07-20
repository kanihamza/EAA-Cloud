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
