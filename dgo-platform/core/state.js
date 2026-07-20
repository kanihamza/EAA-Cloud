import { AppConfig } from '../config/app.config.js';
import { DefaultEndpointSettings } from '../config/endpoints.config.js';
const initial = { schemaVersion:AppConfig.stateSchemaVersion, profile:{name:'Registry',email:'dgsregistry@nitda.gov.ng',persona:'admin'}, settings:{theme:'government',density:'comfortable',maxBulkAssign:AppConfig.maxBulkAssign,endpoints:{...DefaultEndpointSettings},welcomeSeen:false,navCollapsed:null}, activities:[], tracking:[], correspondence:[], operations:[], registryFiles:[], fileMovements:[], registryMinutes:[], escalations:[], notifications:[], dispatches:[], comments:[], approvals:[], users:[], categories:[], departments:[], emails:[], audit:[], pending:[], runtime:{loading:false,lastLoad:null,lastError:null}, selectedId:null };
const clone = v => structuredClone(v);
function safeLocalStorage(){ try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; } }
function hydrate(raw={}) { const p=raw.profile||{}, x=raw.settings||{}; return {...clone(initial),...raw,schemaVersion:AppConfig.stateSchemaVersion,profile:{...initial.profile,...p},settings:{...initial.settings,...x,endpoints:{...DefaultEndpointSettings,...(x.endpoints||{})},maxBulkAssign:Number.isInteger(+x.maxBulkAssign)&&+x.maxBulkAssign>0?+x.maxBulkAssign:AppConfig.maxBulkAssign}}; }
let state; try { const ls=safeLocalStorage(); state=hydrate(JSON.parse(ls?.getItem(AppConfig.storageKey)||'{}')); } catch { state=clone(initial); }
const listeners=new Set();
function buildPatchAudit(p, meta={}){
  const keys=Object.keys(p||{}).filter(k=>k!=='audit'&&k!=='runtime');
  if(meta.silent || !keys.length) return p;
  const event={ at:new Date().toISOString(), action:meta.action||'state.patch', event:meta.event||'audit:state-patch', actor:state?.profile||{}, module:meta.module||'state', keys, ref:meta.ref||'' };
  return {...p, audit:[event, ...((p&&p.audit)||state.audit||[])].slice(0,1000)};
}

function persist(){try{const ls=safeLocalStorage(); if(!ls) return false; ls.setItem(AppConfig.storageKey,JSON.stringify(state));return true}catch(e){console.error('[DGO STATE]',e);return false}}
export const State={get:()=>state,patch(p, meta={}){const patch=buildPatchAudit(p, meta);state={...state,...patch};const keys=Object.keys(p||{});if(!(keys.length===1&&keys[0]==='runtime'))persist();listeners.forEach(f=>f(state));return state},update(fn){return this.patch(fn(state)||{})},on(f){listeners.add(f);return()=>listeners.delete(f)},reset(){state=clone(initial);persist();listeners.forEach(f=>f(state));return state}};
