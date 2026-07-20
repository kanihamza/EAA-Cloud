import assert from 'node:assert/strict';
import fs from 'node:fs';
assert.ok(fs.existsSync('core/ui-interactions.js'));
const router=fs.readFileSync('core/router.js','utf8');
assert.match(router,/dataset\.routeHost/);
console.log('ui-selection-contract passed');
