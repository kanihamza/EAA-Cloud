import assert from 'node:assert/strict';
import { ModuleBoundaries } from '../config/module-boundaries.config.js';
const expected=['home','activities','correspondence','registry','single-assignment','bulk-assignment','fasttrack','acknowledgment','orchestrator','response-tracking','comments','approvals','executive','dispatch','archive','lookup','reports','statistics','assistant','operator-hud','settings','diagnostics','user-admin'];
for (const m of expected) { assert.ok(ModuleBoundaries[m], `${m} boundary missing`); assert.ok(ModuleBoundaries[m].role); assert.ok(ModuleBoundaries[m].owns?.length); }
assert.ok(ModuleBoundaries.correspondence.owns.includes('triage'));
assert.ok(ModuleBoundaries.archive.mustNotOwn.includes('lookup-search'));
console.log('module-boundary-contract passed');
