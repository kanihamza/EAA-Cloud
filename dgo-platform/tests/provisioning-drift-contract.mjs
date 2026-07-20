// R11.6.3 contract: provisioning declarations must track implementation. For every
// provisioned module, each declared stateKey must actually appear in the module source,
// and every platform state collection a module references must be declared. This turns
// platform-provisioning.config.js from aspiration into an enforced inventory — the
// drift class found in the R11.6.2 assessment (slas declared everywhere/read nowhere,
// dispatches/escalations declared but unread) cannot silently return.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PlatformProvisioning } from '../config/platform-provisioning.config.js';
import { RequiredStateCollections } from '../config/state-schema.config.js';

const SCANNABLE = [...RequiredStateCollections, 'runtime', 'settings', 'profile', 'selectedId'];
const problems = [];
for (const [mod, spec] of Object.entries(PlatformProvisioning)) {
  const src = fs.readFileSync(new URL(`../modules/${mod}.js`, import.meta.url), 'utf8');
  for (const key of spec.stateKeys) {
    if (!new RegExp(`\\b${key}\\b`).test(src)) problems.push(`${mod}: declares stateKey '${key}' but never references it`);
  }
  for (const key of SCANNABLE) {
    if (new RegExp(`\\b${key}\\b`).test(src) && !spec.stateKeys.includes(key)) problems.push(`${mod}: references '${key}' but does not declare it`);
  }
}
assert.deepEqual(problems, []);
// The dead 'slas' collection stays dead: not in the schema, not declared anywhere.
assert.ok(!RequiredStateCollections.includes('slas'), 'slas must stay removed from the state schema');
for (const spec of Object.values(PlatformProvisioning)) assert.ok(!spec.stateKeys.includes('slas'));
console.log(`provisioning-drift-contract passed: ${Object.keys(PlatformProvisioning).length} modules reconciled`);
