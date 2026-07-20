import { hydrateGovernance, governedTransition, actor } from '../core/governed-actions.js';
import { State } from '../core/state.js';
import { head, esc, toast, confirmAction, badge } from '../core/ui.js';
import { UIState } from '../core/ui-state.js';
import { capRows, RenderBudget } from '../core/render-budget.js';
export async function mount(el){hydrateGovernance();render(el); }
function badgeTone(ds) { return ds === 'dispatched' ? 'ok' : ds === 'closed' ? 'info' : ds === 'no-dispatch' ? 'warn' : ''; }
const CHANNELS = ['Internal Memo', 'Email', 'Courier', 'Portal Upload'];
function queue(s) {
  // Closure gate: only completed work is eligible for outbound dispatch; anything already
  // dispatched (or marked no-dispatch) stays visible until it is closed.
  return s.tracking.filter(t => t.dispatchStatus !== 'closed' && (t["status"] === 'Completed' || t.dispatchStatus))
    .sort((a, b) => (a["dispatchStatus"] ? 1 : 0) - (b["dispatchStatus"] ? 1 : 0));
}
function render(el) {
  const s = State.get(); const u = UIState.get('dispatch', { selected: null }); const list = queue(s); const sel = list.find(t => t.id === u.selected) || null;
  const closedCount = s.tracking.filter(t => t.dispatchStatus === 'closed').length;
  el.innerHTML = `<div class="workspace">${head('Dispatch', 'Outbound dispatch and closure queue.')}
    <div class="toolbar"><span class="meta">${list.length} in queue · ${s.dispatches.length} dispatch record(s) · ${closedCount} closed</span><a class="btn ghost" href="#/orchestrator">Complete work in Orchestrator</a></div>
    <div class="split"><div class="list-col">${list.length ? capRows(list, RenderBudget.listRows).map(t => `<div class="list-item ${sel && sel.id === t.id ? 'active' : ''}" data-ref="${esc(t.id)}">
      <div class="meta">${badge(t.dispatchStatus === 'no-dispatch' ? 'No Dispatch' : t.dispatchStatus || 'Ready for Dispatch', badgeTone(t.dispatchStatus))} ${esc(t.referenceId || '')}</div>
      <h4>${esc(t.title)}</h4><div class="meta">${esc(t.assignedTo || '—')}</div></div>`).join('') : '<div class="empty"><h2>Queue empty</h2><p>Completed tasks appear here for dispatch. Mark work completed in the Orchestrator first.</p></div>'}</div>
    <div class="detail-col panel">${sel ? detail(sel, s) : '<div class="empty"><h2>Select a record</h2></div>'}</div></div></div>`;
  el.querySelectorAll('[data-ref]').forEach(c => c.onclick = () => { UIState.set('dispatch', { selected: c.dataset.ref }); render(el); });
  const dispatchBtn = el.querySelector('[data-dispatch]'); if (dispatchBtn) dispatchBtn.onclick = async () => {
    const channel = el.querySelector('[data-channel]')?.value || CHANNELS[0];
    const recipient = el.querySelector('[data-recipient]')?.value?.trim() || '';
    if (!recipient) return toast('Confirm the recipient before dispatching', 'error');
    if (!await confirmAction({ title: 'Confirm dispatch', body: `<p><b>${esc(sel.title)}</b></p><p>Channel: ${esc(channel)} · Recipient: ${esc(recipient)}</p>` })) return;
    const at = new Date().toISOString();
    const record = { id: crypto.randomUUID(), taskId: sel.id, referenceId: sel.referenceId || '', title: sel.title, channel, recipient, status: 'dispatched', at, by: s.profile.email };
    State.patch({
      tracking: s.tracking.map(x => x.id === sel.id ? { ...x, dispatchStatus: 'dispatched', dispatchedAt: at, dispatchChannel: channel, dispatchRecipient: recipient } : x),
      dispatches: [record, ...s.dispatches]
    }, { module: 'dispatch', action: 'dispatch:send', ref: sel.referenceId || sel.id });
    toast('Dispatched via ' + channel, 'success'); render(el);
  };
  const noDispatchBtn = el.querySelector('[data-no-dispatch]'); if (noDispatchBtn) noDispatchBtn.onclick = async () => {
    const reason = el.querySelector('[data-nd-reason]')?.value?.trim() || '';
    if (!reason) return toast('A reason is required to mark no-dispatch', 'error');
    if (!await confirmAction({ title: 'Mark as no dispatch required', body: `<p><b>${esc(sel.title)}</b></p><p>Reason: ${esc(reason)}</p>` })) return;
    State.patch({ tracking: s.tracking.map(x => x.id === sel.id ? { ...x, dispatchStatus: 'no-dispatch', noDispatchReason: reason } : x) }, { module: 'dispatch', action: 'dispatch:no-dispatch', ref: sel.referenceId || sel.id });
    toast('Marked as no dispatch required', 'success'); render(el);
  };
  const closeBtn = el.querySelector('[data-close-item]'); if (closeBtn) closeBtn.onclick = async () => {
    if (!await confirmAction({ title: 'Close record', body: `<p><b>${esc(sel.title)}</b></p><p>Closing confirms receipt and ends the dispatch lifecycle for this record.</p>` })) return;
    const at = new Date().toISOString();
    State.patch({
      tracking: s.tracking.map(x => x.id === sel.id ? { ...x, dispatchStatus: 'closed', closedAt: at } : x),
      dispatches: s.dispatches.map(d => d.taskId === sel.id && d.status === 'dispatched' ? { ...d, status: 'closed', receiptAt: at, receiptBy: s.profile.email } : d)
    }, { module: 'dispatch', action: 'dispatch:close', ref: sel.referenceId || sel.id });
    UIState.set('dispatch', { selected: null }); toast('Record closed', 'success'); render(el);
  };
}
function detail(t, s) {
  const record = s.dispatches.find(d => d.taskId === t.id && d.status !== 'closed') || s.dispatches.find(d => d.taskId === t.id);
  return `<div class="meta">${badge(t.dispatchStatus === 'no-dispatch' ? 'No Dispatch' : t.dispatchStatus || 'Ready for Dispatch', badgeTone(t.dispatchStatus))}</div><h2>${esc(t.title)}</h2>
    <p class="meta">${esc(t.referenceId || '—')} · Assigned to ${esc(t.assignedTo || '—')}</p>
    ${record ? `<dl class="detail-grid"><dt>Channel</dt><dd>${esc(record.channel)}</dd><dt>Recipient</dt><dd>${esc(record.recipient || '—')}</dd><dt>Dispatched</dt><dd>${esc(String(record.at || '').slice(0, 16).replace('T', ' '))}</dd><dt>By</dt><dd>${esc(record.by || '—')}</dd>${record.receiptAt ? `<dt>Receipt</dt><dd>${esc(String(record.receiptAt).slice(0, 16).replace('T', ' '))} by ${esc(record.receiptBy || '—')}</dd>` : ''}</dl>` : ''}
    ${t.noDispatchReason ? `<p class="meta">No-dispatch reason: ${esc(t.noDispatchReason)}</p>` : ''}
    ${!t.dispatchStatus ? `<div class="grid"><label>Channel<select data-channel>${CHANNELS.map(c => `<option>${c}</option>`).join('')}</select></label><label>Recipient<input data-recipient placeholder="Recipient name or address" value="${esc(t.assignedTo || '')}"></label><label class="wide">No-dispatch reason (only if not dispatching)<input data-nd-reason placeholder="Why no outbound dispatch is required"></label></div>
    <div class="form-row"><button class="btn" data-dispatch>Dispatch</button><button class="btn ghost" data-no-dispatch>No Dispatch Required</button></div>` : ''}
    ${t["dispatchStatus"] === 'dispatched' || t["dispatchStatus"] === 'no-dispatch' ? '<div class="form-row"><button class="btn" data-close-item>Close</button></div>' : ''}`;
}
