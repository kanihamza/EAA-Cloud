import assert from 'node:assert/strict';
import { Selectors } from '../core/data-selectors.js';
assert.ok(Array.isArray(Selectors.activities()));
assert.ok(Selectors.paginate([1,2,3],1,2).rows.length===2);
console.log('data-selectors-contract passed');
