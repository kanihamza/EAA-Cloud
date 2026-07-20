import assert from 'node:assert/strict';
import fs from 'node:fs';
const executive=fs.readFileSync('modules/executive.js','utf8');
const fasttrack=fs.readFileSync('modules/fasttrack.js','utf8');
const assistant=fs.readFileSync('modules/assistant.js','utf8');
assert.match(executive,/data-exec-approve/); assert.match(executive,/data-exec-return/); assert.match(executive,/data-exec-escalate/);
assert.match(fasttrack,/data-fasttrack/); assert.match(fasttrack,/data-escalate/); assert.match(fasttrack,/data-notify/);
assert.match(assistant,/executeOwnedAction\('assistant','ask'/);
console.log('action-surface-contract passed');
