import fs from 'node:fs';import assert from 'node:assert/strict';
if(!globalThis.localStorage){let v={};globalThis.localStorage={getItem:k=>v[k]??null,setItem:(k,x)=>v[k]=x,removeItem:k=>delete v[k]};}
if(!globalThis.crypto)globalThis.crypto={randomUUID:()=>String(Math.random())};
const {parseFetchAll}=await import('../core/data-loader.js');
const sample=JSON.parse(fs.readFileSync(new URL('./fixtures/fetch-all.sample.json',import.meta.url),'utf8'));
const p=parseFetchAll(sample);
assert.equal(p.counts.activities,300);assert.equal(p.counts.tracking,300);assert.equal(p.counts.comments,2);assert.equal(p.counts.users,793);assert.equal(p.counts.categories,45);assert.equal(p.counts.departments,50);assert.equal(p.counts.emails,50);
assert.equal(p.patch.activities[0].attachmentLink,sample.data.docs[0].AttachmentLink);assert.equal(p.patch.tracking[0].referenceId,sample.data.tasks[0].RefIDD||sample.data.tasks[0].Reference_ID);assert.ok('fullName' in p.patch.users[0]);assert.equal(p.meta.contractVersion,'2026-03-23.5');
console.log('fetchAll sample contract: PASS',p.counts);
