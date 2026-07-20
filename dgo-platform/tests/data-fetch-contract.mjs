import assert from 'node:assert/strict';
import { FetchManager } from '../core/fetch-manager.js';
assert.ok(FetchManager.fetch);
assert.ok(FetchManager.refresh);
assert.deepEqual(FetchManager.inflight(), []);
console.log('data-fetch-contract passed');
