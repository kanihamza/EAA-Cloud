// R11.6.1 workspace review contract: every routed module must mount without error,
// render inside the sectioned `.workspace` container with a branded pagehead, and
// must not carry static inline styles (data-driven widths/custom properties excepted).
import assert from 'node:assert/strict';
import fs from 'node:fs';
class FakeNode { constructor(){this.dataset={};this.style={};this.classList={add(){},remove(){},toggle(){},contains(){return false}};this.children=[];this.value='';this.files=[];this.elements=new Proxy({}, {get:(t,p)=>t[p]||(t[p]=new FakeNode())});} set innerHTML(v){this._html=String(v||'')} get innerHTML(){return this._html||''} querySelector(){return new FakeNode()} querySelectorAll(){return []} addEventListener(){} replaceChildren(...x){this.children=x} append(){} focus(){} click(){ if(this.onclick) this.onclick({preventDefault(){},target:this}) }}
globalThis.document={querySelector(){return new FakeNode()},createElement(){return new FakeNode()},documentElement:{dataset:{}}};
globalThis.window=globalThis; globalThis.location={hash:'#/home'}; globalThis.addEventListener=()=>{}; globalThis.CSS={supports:()=>true}; globalThis.HTMLElement=class{}; globalThis.customElements={define(){},get(){return false}}; globalThis.localStorage={store:{},getItem(k){return this.store[k]||null},setItem(k,v){this.store[k]=String(v)}};
globalThis.innerWidth=1440; globalThis.performance=globalThis.performance||{now:()=>0};
const mods=['home','activities','correspondence','response-tracking','orchestrator','single-assignment','bulk-assignment','fasttrack','approvals','acknowledgment','dispatch','registry','comments','reports','statistics','executive','assistant','lookup','archive','operator-hud','settings','diagnostics','user-admin'];
const failures=[];
for (const name of mods) {
  try {
    const mod=await import(`../modules/${name}.js`); const host=new FakeNode();
    await mod.mount(host);
    assert.ok(host.innerHTML.length>0, 'rendered nothing');
    assert.ok(host.innerHTML.includes('class="workspace'), 'not wrapped in .workspace section');
    assert.ok(host.innerHTML.includes('pagehead'), 'missing branded pagehead');
  } catch(e){ failures.push({module:name,error:String(e.message||e)}); }
}
assert.deepEqual(failures, []);
// Static inline styles belong in the design system, not in module markup.
const bannedInline=['style="cursor','style="margin','style="min-height','style="flex:1','style="grid-column','style="display','style="background'];
const offenders=[];
for (const name of mods) {
  const src=fs.readFileSync(new URL(`../modules/${name}.js`,import.meta.url),'utf8');
  for (const b of bannedInline) if (src.includes(b)) offenders.push({module:name,fragment:b});
}
assert.deepEqual(offenders, []);
console.log(`workspace-sectioning-contract passed: ${mods.length} modules`);
