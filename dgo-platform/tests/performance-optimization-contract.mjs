import assert from 'node:assert/strict';
import { duplicateSummary, capRows, RenderBudget, memoizeBySignature } from '../core/render-budget.js';
const rows=[{id:'1',subject:'A'},{id:'2',subject:'A'},{id:'3',subject:'B'}];
assert.equal(duplicateSummary(rows).count,2);
assert.equal(capRows([1,2,3],2).length,2);
let calls=0; const memo=memoizeBySignature(x=>{calls++; return x.length});
assert.equal(memo(rows),3); assert.equal(memo(rows),3); assert.equal(calls,1);
assert.ok(RenderBudget.listRows>=50);
console.log('performance-optimization-contract passed');
