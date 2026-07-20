import assert from 'node:assert/strict';
import { deriveDirectorate, canReadRecord } from '../core/directorate-scope.js';
assert.equal(deriveDirectorate({department:'Registry'},{}),'Registry');
assert.equal(canReadRecord({__directorate:'A'},{persona:'admin'}),true);
assert.equal(canReadRecord({__directorate:'A'},{persona:'general',directorate:'B'}),false);
console.log('directorate-scope-contract passed');
