import assert from 'node:assert/strict';
import { actionOwner, ActionOwnership } from '../config/action-ownership.config.js';
assert.equal(actionOwner('triage'),'correspondence');
assert.equal(actionOwner('send-dispatch'),'dispatch');
assert.equal(actionOwner('archive-reference'),'archive');
for (const [action,spec] of Object.entries(ActionOwnership)) { assert.ok(spec.owner, `${action} owner missing`); assert.ok(spec.audit, `${action} audit missing`); assert.ok(spec.service, `${action} service missing`); }
console.log('action-ownership-contract passed');
