import assert from 'node:assert/strict';
import { State } from '../core/state.js';
const before=(State.get().audit||[]).length;
State.patch({selectedId:'AUDIT-TEST'}, {module:'test', action:'audit-check'});
const after=State.get().audit||[];
assert.ok(after.length>before);
assert.equal(after[0].event,'audit:state-patch');
assert.equal(after[0].module,'test');
console.log('audited-state-patch-contract passed');
