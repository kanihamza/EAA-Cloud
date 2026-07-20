// R11.6.3 contract: locks in the resolution of every finding from the R11.6.2
// duplication/redundancy/overlap assessment (docs/DUPLICATION_REDUNDANCY_ASSESSMENT_R11_6_2.md).
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

// A1 — one acknowledgment model: both surfaces call the canonical transition, which
// writes both historical field sets in lockstep.
const domain = read('core/enterprise-domain.js');
assert.match(domain, /export function acknowledgeTask/);
assert.match(domain, /acknowledged:true,ackedAt:at,acknowledgedAt:at/);
for (const m of ['acknowledgment','response-tracking']) assert.match(read(`modules/${m}.js`), /acknowledgeTask\(/, `${m} must use the canonical acknowledgment transition`);

// A2 — one task factory behind all creation surfaces.
assert.match(domain, /export function createTask/);
for (const m of ['single-assignment','executive','lookup']) assert.match(read(`modules/${m}.js`), /createTask\(/, `${m} must create tasks through the canonical factory`);

// A3 — one priority vocabulary; legacy vocabularies eliminated from module sources.
assert.ok(fs.existsSync(new URL('../config/priority.config.js', import.meta.url)));
const legacy = [/P1 \(High\)/, /<option>Low<\/option><option selected>Medium<\/option>/, /<option>LOW<\/option>/, /'low','normal','high','urgent'/];
for (const m of ['activities','correspondence','executive','lookup','registry','single-assignment']) {
  const s = read(`modules/${m}.js`);
  assert.match(s, /priority\.config\.js/, `${m} must consume the canonical priority scale`);
  for (const rx of legacy) assert.doesNotMatch(s, rx, `${m} still carries a legacy priority vocabulary`);
}

// A4 — one correspondence disposition transition beneath both persona surfaces.
assert.match(domain, /export function setCorrespondenceStatus/);
for (const m of ['correspondence','executive']) assert.match(read(`modules/${m}.js`), /setCorrespondenceStatus\(/);

// A5/A7 — shared report engine and exporters; no hand-rolled CSV builders in modules.
const engine = read('core/report-export-service.js');
for (const fn of ['normalizeReportRows','reportSummary','groupCount','exportCsv','csvString']) assert.ok(engine.includes(fn), `report engine missing ${fn}`);
for (const m of ['reports','statistics']) assert.match(read(`modules/${m}.js`), /report-export-service\.js/);
for (const m of ['orchestrator','response-tracking','correspondence']) assert.doesNotMatch(read(`modules/${m}.js`), /replace\(\/"\/g,\s*'""'\)/, `${m} still hand-builds CSV`);

// A6 — one sync façade behind every sync trigger.
assert.match(read('core/data-loader.js'), /export async function requestSync/);
for (const m of ['executive','correspondence','statistics','fasttrack','lookup','operator-hud']) assert.match(read(`modules/${m}.js`), /requestSync/, `${m} must sync through the façade`);
assert.match(read('shared/shell.js'), /requestSync/);

// A8 — no write-only embedded task comment arrays; lookup notes land in the shared store.
assert.doesNotMatch(read('modules/lookup.js'), /comments:\[\.\.\.\(t\.comments/);
assert.match(read('modules/lookup.js'), /type:'task-update'/);

// B1 — notifications have a consumer surface.
const shell = read('shared/shell.js');
assert.match(shell, /data-notifs/); assert.match(shell, /openNotifications/); assert.match(shell, /notifCount/);

// B2 — escalations have a queue and producers write real records.
const fast = read('modules/fasttrack.js');
assert.match(fast, /renderEscalations/); assert.match(fast, /data-resolve-esc/);
assert.match(fast, /escalations:\[\{id:crypto\.randomUUID/);
assert.doesNotMatch(fast, /escalationLevel:'sla'/, 'escalation level must be numeric');

// B3 — dispatches are read, not just written.
assert.match(read('modules/home.js'), /s\.dispatches\.length/);
assert.match(read('modules/statistics.js'), /Dispatch channels/);

// B5 — document flags are rendered.
assert.match(read('modules/lookup.js'), /r\.flags\?\.length/);

// C1 — governance is real: no ceremonial imports remain, mutating modules execute
// through the ownership façade.
for (const m of ['acknowledgment','activities','approvals','archive','bulk-assignment','comments','correspondence','dispatch','executive','fasttrack','lookup','orchestrator','registry','response-tracking','settings','single-assignment','user-admin']) {
  const s = read(`modules/${m}.js`);
  assert.ok(s.includes('executeOwnedAction'), `${m} must execute owned actions through the governance façade`);
  assert.doesNotMatch(s, /governedTransition/, `${m} still carries a ceremonial governedTransition import`);
}

// C3 — OTP protects large bulk batches through the provisioned runtime.
const bulk = read('modules/bulk-assignment.js');
assert.match(bulk, /OTP_THRESHOLD/); assert.match(bulk, /ActionRuntime\.run\('bulk-assignment','request-otp'/); assert.match(bulk, /verify-otp/);

// C4 — formerly orphaned services now have real consumers.
assert.match(read('modules/dispatch.js'), /WriteManager\.backend/);
assert.match(read('modules/operator-hud.js'), /operationalMetrics/);
assert.match(read('modules/settings.js'), /DataReconciler\.apply/);
assert.match(read('modules/assistant.js'), /QueryStore\.dashboard/);
assert.ok(!fs.existsSync(new URL('../shared/generic-module.js', import.meta.url)), 'generic-module must stay deleted');

// D2 — one lineage heuristic.
const selectors = read('core/data-selectors.js');
assert.match(selectors, /export function relatedEmails/); assert.match(selectors, /export function relatedTasks/);
for (const m of ['fasttrack','response-tracking','correspondence','executive']) assert.match(read(`modules/${m}.js`), /data-selectors\.js/, `${m} must use shared lineage selectors`);

// D3 — one status classifier family.
const dom = read('core/domain.js');
for (const fn of ['isComplete','isPendingStatus','statusTone']) assert.ok(dom.includes(`export const ${fn}`));
assert.doesNotMatch(read('modules/response-tracking.js'), /const isComplete=x=>\/treated/);
assert.doesNotMatch(read('modules/executive.js'), /function stateClass\(x\)\{return \/overdue/);

// D4/D5/D6 — sanctioned shared helpers in use.
const ui = read('core/ui.js');
for (const fn of ['statRow','fmtDate','fmtDateTime']) assert.ok(ui.includes(`export const ${fn}`));
assert.match(read('core/ui-interactions.js'), /export function debouncedInput/);
for (const m of ['orchestrator','lookup','response-tracking','activities','correspondence','registry']) assert.match(read(`modules/${m}.js`), /debouncedInput\(/, `${m} must use the shared debounced input`);

// E1 — HUD/diagnostics delineation: diagnostics no longer duplicates sync execution.
const diag = read('modules/diagnostics.js');
assert.doesNotMatch(diag, /loadRuntimeData|requestSync\(\{source:'diagnostics'/);
assert.match(diag, /Operator HUD/);
assert.match(read('modules/operator-hud.js'), /operatorDataOpsSummary\(\)/);

// E3 — registry archive constitutes the immutable evidence bundle.
assert.match(read('modules/registry.js'), /ArchiveService\.archiveReference/);
console.log('consolidation-contract passed');
