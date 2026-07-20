import assert from 'node:assert/strict';
import { RequiredStateCollections, RequiredStateObjects, normalizePlatformState } from '../config/state-schema.config.js';
const s=normalizePlatformState({});
for(const k of RequiredStateCollections) assert.ok(Array.isArray(s[k]), `${k} not array`);
for(const k of RequiredStateObjects) assert.equal(typeof s[k], 'object', `${k} not object`);
console.log('state-schema-provisioning-contract passed');
