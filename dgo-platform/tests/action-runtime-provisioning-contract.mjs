import assert from 'node:assert/strict';
import { ActionRuntime } from '../core/action-runtime.js';
assert.ok(ActionRuntime.canRun('correspondence','create'));
assert.ok(ActionRuntime.canRun('dispatch','send-dispatch'));
assert.ok(ActionRuntime.canRun('archive','archive-reference'));
assert.equal(ActionRuntime.canRun('archive','create-user'),false);
const res=await ActionRuntime.run('lookup','search',{q:'REF'});
assert.equal(res.ok,true);
console.log('action-runtime-provisioning-contract passed');
