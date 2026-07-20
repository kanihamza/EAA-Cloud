import { hydrateGovernance, governedTransition, actor } from '../core/governed-actions.js';
import { State } from '../core/state.js';
import { status } from '../core/domain.js';
import { head, kpis, esc, badge } from '../core/ui.js';
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}
export async function mount(el){hydrateGovernance();render(el); }
function render(el) {
  const s = State.get();
  const open = s.activities.filter(a => !['Treated', 'Processed'].includes(status(a)));
  const awaiting = s.tracking.filter(t => t.status !== 'Completed');
  const sla = s.tracking.filter(t => t.due && new Date(t.due) < new Date() && t.status !== 'Completed');
  const dueSoon = s.tracking.filter(t => t.due && !sla.includes(t) && (new Date(t.due) - Date.now()) < 86400000 && t.status !== 'Completed');
  const closed = s.tracking.filter(t => t["status"] === 'Completed');
  const queue = [...open].sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 5);
  el.innerHTML = `<div class="workspace">${head('Home', `${greeting()}, ${esc(s.profile.name)}. Operational workspace is ready.`)}
    <div class="toolbar"><div><button class="btn" data-log-corr>Log Correspondence</button>
      <a class="btn ghost" href="#/single-assignment">New Task</a>
      <a class="btn ghost" href="#/executive">Executive View</a></div></div>
    ${kpis([['Open References', open.length], ['Awaiting Action', awaiting.length], ['SLA Attention', sla.length], ['Closed', closed.length]])}
    <div class="split"><div class="panel"><div class="eyebrow panel-eyebrow">My Queue</div>
      ${queue.length ? queue.map(a => `<div class="list-item" data-open="${esc(a.id)}"><h4>${esc(a.title)}</h4><div class="meta">${esc(a.referenceId || '—')} · ${badge(status(a))}</div></div>`).join('') : '<p class="meta">Nothing awaiting action. Nice and clear.</p>'}
      <div class="form-row"><a class="btn ghost" href="#/response-tracking">View all</a></div></div>
    <div class="detail-col panel"><div class="eyebrow panel-eyebrow">Needs Attention</div>
      <div class="stat-row"><div class="kpi"><small>SLA Breached</small><b>${sla.length}</b></div><div class="kpi"><small>Due Within 24h</small><b>${dueSoon.length}</b></div></div>
      <p class="meta">${sla.length ? sla.length + ' task(s) have passed their acknowledgment deadline — check Acknowledgment Queue.' : 'No overdue tasks right now.'}</p></div></div></div>`;
  el.querySelector('[data-log-corr]').onclick = async () => { const m = await import('./correspondence.js'); m.openCreate(); location.hash = '#/correspondence'; };
  el.querySelectorAll('[data-open]').forEach(c => c.onclick = () => { State.patch({ selectedId: c.dataset.open }); location.hash = '#/activities'; });
}
