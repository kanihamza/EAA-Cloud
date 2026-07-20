import assert from 'node:assert/strict';
import fs from 'node:fs';
const s=fs.readFileSync('core/router.js','utf8');
assert.match(s,/stage\.className='route-stage'/);
assert.match(s,/out\.replaceChildren\(stage\)/);
assert.doesNotMatch(s,/replaceChildren\(\.\.\.stage\.childNodes\)/);
console.log('router-host-retention-contract passed');
