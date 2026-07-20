import { Router } from './router.js';
import { State } from './state.js';
import { loadRuntimeData } from './data-loader.js';
import { PlatformProvisioner } from './platform-provisioner.js';
import { CacheManager } from './cache-manager.js';
import { LoadingState } from './loading-state.js';
import { PerformanceMonitor } from './performance-monitor.js';
import { PendingQueue } from './pending-queue.js';
import './nitda-module-adapter.js';
const modules = {'home':()=>import('../modules/home.js'),'activities':()=>import('../modules/activities.js'),'correspondence':()=>import('../modules/correspondence.js'),'response-tracking':()=>import('../modules/response-tracking.js'),'orchestrator':()=>import('../modules/orchestrator.js'),'single-assignment':()=>import('../modules/single-assignment.js'),'bulk-assignment':()=>import('../modules/bulk-assignment.js'),'fasttrack':()=>import('../modules/fasttrack.js'),'approvals':()=>import('../modules/approvals.js'),'acknowledgment':()=>import('../modules/acknowledgment.js'),'dispatch':()=>import('../modules/dispatch.js'),'registry':()=>import('../modules/registry.js'),'comments':()=>import('../modules/comments.js'),'reports':()=>import('../modules/reports.js'),'statistics':()=>import('../modules/statistics.js'),'executive':()=>import('../modules/executive.js'),'assistant':()=>import('../modules/assistant.js'),'lookup':()=>import('../modules/lookup.js'),'archive':()=>import('../modules/archive.js'),'operator-hud':()=>import('../modules/operator-hud.js'),'settings':()=>import('../modules/settings.js'),'diagnostics':()=>import('../modules/diagnostics.js'),'user-admin':()=>import('../modules/user-admin.js')};
async function boot(){
  const host=document.getElementById('app');
  try{
    PlatformProvisioner.ensure();
    window.__DGO_PROVISIONING__ = PlatformProvisioner.validate();
    window.__DGO_DATA_OPS__ = { cache:CacheManager, loading:LoadingState, performance:PerformanceMonitor, pending:PendingQueue };
    for(const [id,load] of Object.entries(modules)) Router.register(id, async el => (await load()).mount(el));
    const s=State.get(); document.documentElement.dataset.theme=s.settings.theme; document.documentElement.dataset.density=s.settings.density;
    await import('../shared/shell.js'); host.replaceChildren(document.createElement('dgo-shell')); window.__DGO_BOOTED__=true; loadRuntimeData().catch(e=>document.querySelector('dgo-shell')?.toast('Live data could not be loaded: '+e.message,'error'));
  }catch(e){ console.error('[DGO BOOT]',e); host.innerHTML=`<div class="fatal"><h1>DGO could not start</h1><pre>${String(e.stack||e)}</pre></div>`; }
}
boot();
