import fs from'node:fs';import assert from'node:assert/strict';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const state=read('core/state.js'),domain=read('core/enterprise-domain.js'),corr=read('modules/correspondence.js'),ops=read('modules/activities.js'),reg=read('modules/registry.js');
for(const key of ['correspondence','operations','registryFiles','fileMovements','registryMinutes','escalations','notifications','slas','dispatches'])assert.match(state,new RegExp(key+':\\[\\]'));
for(const x of ['Received','Classified','Archived'])assert.match(domain,new RegExp(x));
for(const x of ['Email intake workbench','Potential duplicates','Convert to assignment'])assert.match(corr,new RegExp(x));
for(const x of ['My Work','Escalated','Dependencies','Work journal'])assert.match(ops,new RegExp(x,'i'));
for(const x of ['Custody and movement chain','Official minute','Record receipt','Unregistered correspondence'])assert.match(reg,new RegExp(x,'i'));
console.log('enterprise domain contracts passed');
