import assert from 'node:assert/strict';
import { isFlowEndpoint, requiresInputPreview } from '../core/flow-confirmation.js';
assert.equal(isFlowEndpoint('DYNAMIC_ACTIONS',{write:true},{operation:'x'}),true);
assert.equal(isFlowEndpoint('FETCH_ALL',{write:false},{}),false);
assert.equal(requiresInputPreview({name:'Registry'}),true);
assert.equal(requiresInputPreview({}),false);
console.log('flow-confirmation-contract passed');
