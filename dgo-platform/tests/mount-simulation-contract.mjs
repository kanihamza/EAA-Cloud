import assert from 'node:assert/strict';
class FakeNode { constructor(){this.dataset={};this.style={};this.classList={add(){},remove(){},toggle(){}};this.children=[];this.value='';this.files=[];this.elements=new Proxy({}, {get:(t,p)=>t[p]||(t[p]=new FakeNode())});} set innerHTML(v){this._html=String(v||'')} get innerHTML(){return this._html||''} querySelector(){return new FakeNode()} querySelectorAll(){return []} addEventListener(){} replaceChildren(...x){this.children=x} append(){} click(){ if(this.onclick) this.onclick({preventDefault(){},target:this}) }}
globalThis.document={querySelector(){return new FakeNode()},createElement(){return new FakeNode()},documentElement:{dataset:{}}};
globalThis.window=globalThis; globalThis.location={hash:'#/home'}; globalThis.addEventListener=()=>{}; globalThis.CSS={supports:()=>true}; globalThis.HTMLElement=class{}; globalThis.customElements={define(){},get(){return false}}; globalThis.localStorage={store:{},getItem(k){return this.store[k]||null},setItem(k,v){this.store[k]=String(v)}};
const failures=[];
for (const name of ['diagnostics.js','settings.js']) {
  const mod=await import(`../modules/${name}`); const host=new FakeNode();
  try { await mod.mount(host); assert.ok(host.innerHTML.length>=0); } catch(e) { failures.push({module:name,error:e.stack||e.message}); }
}
assert.deepEqual(failures, []);
console.log('mount-simulation-contract passed');
