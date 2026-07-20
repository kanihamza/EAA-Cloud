import assert from 'node:assert/strict';
import { CacheManager } from '../core/cache-manager.js';
import { cachePolicyFor } from '../config/cache-policy.config.js';
await CacheManager.set('LOOKUP',{q:'x'},{value:1});
const hit=await CacheManager.get('LOOKUP',{q:'x'});
assert.equal(hit.value,1);
assert.ok(cachePolicyFor('ARCHIVE').immutable);
assert.ok(CacheManager.stats().entries>=1);
console.log('cache-policy-contract passed');
