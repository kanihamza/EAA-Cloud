import assert from 'node:assert/strict'; import fs from 'node:fs';
const checks=[
  { file:'modules/user-admin.js', handler:'data-disable', requires:'confirmAction' }
];
for(const c of checks){
  const src=fs.readFileSync(c.file,'utf8');
  const idx=src.indexOf(`[data-${c.handler.replace('data-','')}]`.replace('data-data-','data-'));
  assert.ok(idx!==-1, `${c.file} missing handler wiring for ${c.handler}`);
  const scope=src.slice(src.indexOf(`el.querySelectorAll('[${c.handler}]')`), src.indexOf(`el.querySelectorAll('[${c.handler}]')`)+400);
  assert.match(scope, new RegExp(c.requires), `${c.file} ${c.handler} handler does not call ${c.requires} before mutating state`);
}
console.log('destructive-action-confirmation-contract passed');
