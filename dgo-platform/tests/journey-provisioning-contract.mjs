// R11.6.1 workspace review contract: end-to-end journey and provisioning coherence.
// 1) Navigation phases and route metadata must agree, so the shell context, sidebar and
//    command palette never describe the same workspace as belonging to different phases.
// 2) Dispatch executes the provisioned closure gate (only completed work dispatches),
//    records into the dispatches collection, and supports the no-dispatch disposition.
// 3) Acknowledgment provisions its remind action; approvals retain decided history.
// 4) Workspaces with filters/selection keep them in the shared UIState store so state
//    management is uniform and survives route changes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Routes } from '../config/routes.config.js';
import { NavGroups } from '../config/nav.config.js';

for (const g of NavGroups) for (const p of g.routes) {
  const r = Routes.find(x => x.path === p);
  assert.ok(r, `nav route ${p} missing from routes.config`);
  assert.equal(r.group, g.group, `route ${p} group "${r.group}" disagrees with nav group "${g.group}"`);
}

const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const dispatch = read('modules/dispatch.js');
assert.match(dispatch, /t\["status"\] === 'Completed' \|\| t\.dispatchStatus/, 'dispatch queue must gate on completed work');
assert.match(dispatch, /dispatches: \[record, \.\.\.s\.dispatches\]/, 'dispatch must record into the dispatches collection');
assert.match(dispatch, /no-dispatch/, 'dispatch must support the no-dispatch disposition');
assert.match(dispatch, /receiptAt/, 'closure must capture a receipt');

const ack = read('modules/acknowledgment.js');
assert.match(ack, /data-remind/, 'acknowledgment must provision the remind action');
assert.match(ack, /ack:remind/, 'remind must carry audit meta');
assert.match(ack, /ack:receipt/, 'acknowledge must carry audit meta');

const approvals = read('modules/approvals.js');
assert.match(approvals, /data-view/, 'approvals must provision pending/decided views');
assert.match(approvals, /approval:create/, 'approval creation must carry audit meta');
assert.match(approvals, /decidedBy/, 'decisions must record the deciding actor');

for (const m of ['activities','correspondence','registry','approvals','dispatch','acknowledgment','orchestrator','response-tracking','fasttrack','lookup','executive','reports','statistics','user-admin','archive'])
  assert.match(read(`modules/${m}.js`), /ui-state\.js/, `${m} must manage workspace state through UIState`);

console.log('journey-provisioning-contract passed');
