import { hydrateGovernance, executeOwnedAction } from '../core/governed-actions.js';
import { State } from '../core/state.js';
import { head, esc, toast, confirmAction, badge, mdBack, mdSwitch, resetDetailScroll, statRow } from '../core/ui.js';
import { acknowledgeTask } from '../core/enterprise-domain.js';
import { UIState } from '../core/ui-state.js';
export async function mount(el){hydrateGovernance();render(el); }
function slaCompliance(tasks) {
  const withDue = tasks.filter(t => t.ack);
  if (!withDue.length) return null;
  const onTime = withDue.filter(t => t.acknowledged && (!t.ackedAt || new Date(t.ackedAt).getTime() <= new Date(t.ack + 'T23:59:59').getTime()));
  return Math.round((onTime.length / withDue.length) * 100);
}
function ageDays(t) {
  const from = t.created || t.start; if (!from) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(from).getTime()) / 86400000));
}
function render(el) {
  const s = State.get(); const tasks = s.tracking;
  const u = UIState.get('acknowledgment', { selected: null, md: 'list' });
  const pending = tasks.filter(t => !t.acknowledged); const acked = tasks.filter(t => t.acknowledged);
  const sel = tasks.find(t => t.id === u.selected) || tasks[0] || null;
  const sla = slaCompliance(tasks);
  el.innerHTML = `<div class="workspace">${head('Acknowledgment Queue', 'Compliance acknowledgment desk for routed tasks.')}
    ${statRow([['Pending Acknowledgements', pending.length], ['Acknowledged Tasks', acked.length], ['SLA Compliance', sla == null ? 'N/A' : sla + '%'], ['Total', tasks.length]])}
    <div class="split" ${mdSwitch(sel?u.md:'list')}><div class="panel">${tasks.length ? `<div class="tablewrap dgo-table-wrap"><table class="dgo-table"><thead><tr><th>Task</th><th class="col-narrow">Ageing</th><th class="col-narrow">Status</th></tr></thead><tbody>
      ${tasks.map(t => { const age = ageDays(t); return `<tr class="row-link ${sel && sel.id === t.id ? 'row-active' : ''}" data-id="${esc(t.id)}"><td><div>${esc(t.title)}</div><div class="meta">${esc(t.referenceId || t.id)}</div></td><td>${age == null ? '—' : badge(age + 'd', !t.acknowledged && age >= 2 ? 'danger' : '')}</td><td>${badge(t.acknowledged ? 'Acknowledged' : 'Pending', t.acknowledged ? 'ok' : '')}</td></tr>`; }).join('')}
      </tbody></table></div>` : '<div class="empty"><h2>No tasks</h2><p>Tasks appear here once assignments are created.</p></div>'}</div>
    <div class="detail-col panel-stack">${sel ? detail(sel) : '<section class="panel"><div class="empty"><h2>Select a task</h2></div></section>'}</div></div></div>`;
  el.querySelectorAll('tbody tr').forEach(tr => tr.onclick = () => { UIState.set('acknowledgment', { selected: tr.dataset.id, md: 'detail' }); render(el); resetDetailScroll(el); });
  el.querySelector('[data-md-back]')?.addEventListener('click', () => { UIState.set('acknowledgment', { md: 'list' }); render(el); });
  const ackBtn = el.querySelector('[data-ack]'); if (ackBtn) ackBtn.onclick = async () => {
    if (!await confirmAction({ title: 'Confirm Acknowledgment', body: `<p><b>${esc(sel.title)}</b></p><p>${esc(sel.referenceId || sel.id)}</p>` })) return;
    await executeOwnedAction('acknowledgment', 'acknowledge', () => {
      const r = acknowledgeTask(State.get(), sel.id, s.profile.email, { surface: 'acknowledgment' });
      if (r) State.patch(r.patch, { module: 'acknowledgment', action: 'ack:receipt', ref: sel.referenceId || sel.id });
    }, { ref: sel.referenceId || sel.id });
    toast('Acknowledgment recorded', 'success'); render(el);
  };
  const remindBtn = el.querySelector('[data-remind]'); if (remindBtn) remindBtn.onclick = async () => {
    if (!await confirmAction({ title: 'Send acknowledgment reminder', body: `<p><b>${esc(sel.title)}</b></p><p>Remind ${esc(sel.assignedTo || 'the assignee')} to acknowledge receipt.</p>` })) return;
    await executeOwnedAction('acknowledgment', 'remind-assignee', () => {
      State.patch({
        notifications: [{ id: crypto.randomUUID(), at: new Date().toISOString(), taskId: sel.id, referenceId: sel.referenceId || '', title: `Acknowledgment reminder: ${sel.title}`, assignedTo: sel.assignedTo || '' }, ...s.notifications]
      }, { module: 'acknowledgment', action: 'ack:remind', ref: sel.referenceId || sel.id });
    }, { ref: sel.referenceId || sel.id });
    toast('Reminder queued for ' + (sel.assignedTo || 'assignee'), 'success'); render(el);
  };
  const trackBtn = el.querySelector('[data-track]'); if (trackBtn) trackBtn.onclick = () => { State.patch({ selectedId: sel.id }); location.hash = '#/response-tracking'; };
}
function detail(t) {
  const age = ageDays(t);
  return `${mdBack('Back to queue')}<section class="panel"><div class="eyebrow panel-eyebrow">Acknowledgment Notice</div><div class="meta">${esc(t.referenceId || t.id)} · ${badge(t.acknowledged ? 'Acknowledged' : 'Pending', t.acknowledged ? 'ok' : '')}${age != null ? ' · ' + badge('Waiting ' + age + 'd', !t.acknowledged && age >= 2 ? 'danger' : '') : ''}</div><h2>${esc(t.title)}</h2>
    <p class="meta">From: DGO Digital Ops &lt;noreply@dgo.gov.ng&gt;</p>
    <p>Subject: Task acknowledgment required — ${esc(t.title)}</p></section>
    <section class="panel"><div class="eyebrow panel-eyebrow">Receipt Actions</div><div class="form-row">${t.acknowledged ? '<span class="pill ok">Acknowledgment logged</span>' : '<button class="btn" data-ack>Acknowledge Receipt</button><button class="btn ghost" data-remind>Send Reminder</button>'}<button class="btn ghost" data-track>Track History</button></div></section>`;
}
