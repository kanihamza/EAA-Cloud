import assert from 'node:assert/strict';
import { WriteManager } from '../core/write-manager.js';
import { State } from '../core/state.js';
const before=(State.get().audit||[]).length;
await WriteManager.local({module:'settings',action:'profile',patch:{selectedId:'WRITE-TEST'},message:''});
assert.equal(State.get().selectedId,'WRITE-TEST');
assert.ok((State.get().audit||[]).length>before);
console.log('write-manager-contract passed');
