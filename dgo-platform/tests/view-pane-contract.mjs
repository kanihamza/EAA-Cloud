// R11.6.2 contract: master-detail view behaviour and pane independence.
// 1) Every selection-driven workspace renders a data-md split, switches to the detail
//    view on row selection (md:'detail'), offers the portrait back control (mdBack) and
//    resets the detail pane scroll on selection (resetDetailScroll).
// 2) Detail columns are panel stacks of independent panels (details / forms / journals),
//    never one merged panel; reveal-on-request forms carry visibility flags.
// 3) The stylesheet provides independent per-pane scroll regions and the portrait
//    one-view-at-a-time rules; the router resets workspace scroll on route change.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const mdModules = ['activities','correspondence','registry','approvals','dispatch','acknowledgment','orchestrator','response-tracking','lookup','executive'];
for (const m of mdModules) {
  const src = read(`modules/${m}.js`);
  assert.match(src, /mdSwitch\(/, `${m}: split must carry the data-md view attribute`);
  assert.match(src, /mdBack\(/, `${m}: detail view must render the portrait back control`);
  assert.match(src, /data-md-back/, `${m}: back control must be wired`);
  assert.match(src, /md:\s*'detail'/, `${m}: row selection must switch to the detail view`);
  assert.match(src, /resetDetailScroll\(/, `${m}: selection must reset the detail pane scroll`);
  assert.match(src, /panel-stack/, `${m}: detail column must be a stack of independent panels`);
}
// Reveal-on-request forms are separate panels behind visibility flags.
assert.match(read('modules/activities.js'), /data-edit-toggle/, 'activities: update form must be reveal-on-request');
assert.match(read('modules/registry.js'), /data-route-toggle/, 'registry: minute/route form must be reveal-on-request');
assert.match(read('modules/correspondence.js'), /data-triage-toggle/, 'correspondence: triage form must be reveal-on-request');

const css = read('styles/app.css');
assert.match(css, /\.panel-stack\{display:flex;flex-direction:column/, 'panel-stack layout missing');
assert.match(css, /\.split>\*\{max-height:var\(--pane-max\);overflow-y:auto/, 'independent split pane scrolling missing');
assert.match(css, /\.dg-layout>\*\{max-height:var\(--pane-max\);overflow-y:auto/, 'independent dg-layout pane scrolling missing');
assert.match(css, /\.split\[data-md="detail"\]>\*:first-child\{display:none\}/, 'portrait detail view must hide the list');
assert.match(css, /\.split\[data-md="list"\]>\*:last-child\{display:none\}/, 'portrait list view must hide the detail');
assert.match(css, /\.dg-layout\[data-md="list"\]>#panel-details\{display:none\}/, 'portrait dg-layout list view must hide details');

const ui = read('core/ui.js');
for (const h of ['mdBack','mdSwitch','resetDetailScroll','resetWorkspaceScroll']) assert.ok(ui.includes(`export const ${h}`), `ui helper ${h} missing`);
assert.match(read('core/router.js'), /out\.scrollTop=0/, 'router must reset workspace scroll on route change');
console.log(`view-pane-contract passed: ${mdModules.length} master-detail workspaces`);
