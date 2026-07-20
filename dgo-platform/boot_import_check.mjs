import { Router } from './core/router.js';
const modules = {
  home:()=>import('./modules/home.js'), activities:()=>import('./modules/activities.js'), correspondence:()=>import('./modules/correspondence.js'), 'response-tracking':()=>import('./modules/response-tracking.js'), orchestrator:()=>import('./modules/orchestrator.js'), 'single-assignment':()=>import('./modules/single-assignment.js'), 'bulk-assignment':()=>import('./modules/bulk-assignment.js'), fasttrack:()=>import('./modules/fasttrack.js'), approvals:()=>import('./modules/approvals.js'), acknowledgment:()=>import('./modules/acknowledgment.js'), dispatch:()=>import('./modules/dispatch.js'), registry:()=>import('./modules/registry.js'), comments:()=>import('./modules/comments.js'), reports:()=>import('./modules/reports.js'), statistics:()=>import('./modules/statistics.js'), executive:()=>import('./modules/executive.js'), assistant:()=>import('./modules/assistant.js'), lookup:()=>import('./modules/lookup.js'), archive:()=>import('./modules/archive.js'), 'operator-hud':()=>import('./modules/operator-hud.js'), settings:()=>import('./modules/settings.js'), diagnostics:()=>import('./modules/diagnostics.js'), 'user-admin':()=>import('./modules/user-admin.js')
};
const results=[];
for (const [id, load] of Object.entries(modules)) {
  try { const m=await load(); if (typeof m.mount !== 'function') throw new Error('missing mount export'); results.push({id,ok:true}); }
  catch (e) { results.push({id,ok:false,error:String(e.stack||e)}); }
}
const failed=results.filter(r=>!r.ok);
console.log(JSON.stringify({checked:results.length,failed:failed.length,failedModules:failed},null,2));
if (failed.length) process.exit(1);
