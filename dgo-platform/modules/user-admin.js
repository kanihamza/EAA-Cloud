import { hydrateGovernance, governedTransition, actor } from '../core/governed-actions.js';
import { State } from '../core/state.js';
import { head, esc, toast, confirmAction } from '../core/ui.js';
import { UIState } from '../core/ui-state.js';
import { RoleList } from '../config/rbac.config.js';
import { capRows, RenderBudget } from '../core/render-budget.js';
export async function mount(el){hydrateGovernance();render(el); }
function render(el) {
  const s = State.get(); const users = s.users;
  const u = UIState.get('user-admin', { editing: null });
  const editing = users.find(x => x.id === u.editing) || null;
  el.innerHTML = `<div class="workspace">${head('User Administration', 'Manage users, roles, access status and RBAC capability assignments.')}
    <div class="split"><div class="detail-col panel">
      <div class="eyebrow panel-eyebrow">User Profile</div>
      <form class="grid" id="ua-form">
        <label>Full Name<input name="fullName" value="${esc(editing?.fullName || '')}" required></label>
        <label>Email<input name="email" type="email" value="${esc(editing?.email || '')}" required></label>
        <label>Directorate / DSU<input name="directorate" value="${esc(editing?.directorate || '')}"></label>
        <label>Role<select name="role">${RoleList.map(r => `<option value="${r.id}" ${editing?.role === r.id ? 'selected' : ''}>${esc(r.label)}</option>`).join('')}</select></label>
        <label>Status<select name="status"><option value="active" ${editing?.status !== 'disabled' ? 'selected' : ''}>Active</option><option value="disabled" ${editing?.status === 'disabled' ? 'selected' : ''}>Disabled</option></select></label>
        <div class="wide"><button class="btn">${editing ? 'Update User' : 'Create User'}</button> <button type="button" class="btn ghost" data-clear>Clear Form</button></div>
      </form></div>
    <div class="panel">
      <div class="eyebrow panel-eyebrow">Users and Assignments</div>
      ${users.length ? `<div class="tablewrap dgo-table-wrap"><table class="dgo-table"><thead><tr><th>Name</th><th>Email</th><th>Directorate</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        ${capRows(users, RenderBudget.tableRows).map(x => `<tr class="${editing?.id === x.id ? 'row-active' : ''}"><td>${esc(x.fullName || '—')}</td><td>${esc(x.email)}</td><td>${esc(x.directorate || '—')}</td><td>${esc(RoleList.find(r => r.id === x.role)?.label || x.role)}</td><td><span class="pill ${x.status === 'disabled' ? 'danger' : 'ok'}">${esc(x.status)}</span></td>
        <td><button class="btn ghost compact" data-edit="${esc(x.id)}">Edit</button> <button class="btn ghost compact" data-disable="${esc(x.id)}" ${x.status === 'disabled' ? 'disabled' : ''}>Disable</button></td></tr>`).join('')}
        </tbody></table></div>` : '<div class="empty"><h2>No users configured</h2><p>Create the first user with the form.</p></div>'}
      </div></div>
    <div class="panel stack-panel"><div class="eyebrow panel-eyebrow">Role Capability Matrix</div>
      ${RoleList.map(r => `<details class="role-details"><summary><b>${esc(r.label)}</b> · ${r.permissions.length} permission(s)</summary>
        <div class="chips">${r.permissions.length ? r.permissions.map(p => `<span class="chip">${esc(p)}</span>`).join('') : '<span class="chip">read-only / no elevated permissions</span>'}</div></details>`).join('')}
    </div></div>`;
  el.querySelector('#ua-form').onsubmit = e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
    if (!d.email.includes('@')) { toast('Enter a valid email address', 'error'); return; }
    const rec = { id: editing?.id || crypto.randomUUID(), fullName: d.fullName, email: d.email, directorate: d.directorate, role: d.role, status: d.status, createdAt: editing?.createdAt || new Date().toISOString() };
    const list = editing ? s.users.map(x => x.id === rec.id ? rec : x) : [...s.users, rec];
    State.patch({ users: list }, { module: 'user-admin', action: editing ? 'user:update' : 'user:create', ref: rec.email });
    UIState.set('user-admin', { editing: null }); toast('Saved ' + rec.email, 'success'); render(el);
  };
  el.querySelector('[data-clear]').onclick = () => { UIState.set('user-admin', { editing: null }); render(el); };
  el.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => { UIState.set('user-admin', { editing: b.dataset.edit }); render(el); });
  el.querySelectorAll('[data-disable]').forEach(b => b.onclick = async () => {
    const x = s.users.find(y => y.id === b.dataset.disable); if (!x) return;
    if (!await confirmAction({ title: 'Disable user', body: `<p>Revoke platform access for <b>${esc(x.fullName || x.email)}</b>?</p>` })) return;
    State.patch({ users: s.users.map(y => y.id === x.id ? { ...y, status: 'disabled' } : y) }, { module: 'user-admin', action: 'user:disable', ref: x.id });
    toast('Disabled ' + x.email, 'error'); render(el);
  });
}
