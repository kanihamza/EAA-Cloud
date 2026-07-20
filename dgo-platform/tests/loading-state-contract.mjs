import assert from 'node:assert/strict';
import { LoadingState } from '../core/loading-state.js';
LoadingState.start('data','TEST');
assert.equal(LoadingState.get('data','TEST').status,'loading');
LoadingState.success('data','TEST',{source:'cache'});
assert.equal(LoadingState.get('data','TEST').status,'success');
console.log('loading-state-contract passed');
