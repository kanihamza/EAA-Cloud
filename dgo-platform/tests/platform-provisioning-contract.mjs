import assert from 'node:assert/strict';
import { PlatformProvisioning } from '../config/platform-provisioning.config.js';
const modules=Object.keys(PlatformProvisioning);
assert.equal(modules.length,23);
for(const [name,spec] of Object.entries(PlatformProvisioning)){
  assert.equal(spec.enabled,true, `${name} disabled`);
  assert.ok(spec.features.length>=1, `${name} features missing`);
  assert.ok(spec.functions.length>=1, `${name} functions missing`);
  assert.ok(spec.actions.length>=1, `${name} actions missing`);
  assert.ok(spec.stateKeys.length>=1, `${name} state keys missing`);
}
console.log('platform-provisioning-contract passed');
