export const esc = v => String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export const head = (title, subtitle, eyebrow='DGO DIGITAL OPS · A NITDA PLATFORM') => `<header class="pagehead dgo-module-view__head"><div><div class="eyebrow dgo-overline">${esc(eyebrow)}</div><h1>${esc(title)}</h1><p class="subtitle dgo-muted">${esc(subtitle)}</p></div></header>`;
// Sanctioned stat-row builder for non-dashboard workspaces (dashboards use kpis()).
export const statRow = (xs, cls='') => `<div class="stat-row ${cls}">${xs.map(x=>`<div class="kpi"><small>${esc(x[0])}</small><b>${esc(x[1])}</b></div>`).join('')}</div>`;
export const fmtDate = v => String(v??'').slice(0,10);
export const fmtDateTime = v => String(v??'').slice(0,16).replace('T',' ');
export const kpis = xs => `<div class="kpis dgo-dashboard__metrics">${xs.map(x=>`<div class="kpi dgo-metric"><small class="dgo-metric__label">${esc(x[0])}</small><b class="dgo-metric__value">${esc(x[1])}</b></div>`).join('')}</div>`;
export const toast = (m,t='') => document.querySelector('dgo-shell')?.toast(m,t);
function normalizeConfirmOptions(o){return typeof o==='string'?{title:'Confirm action',body:o}:o;}
export const confirmAction = async o => { const shell=typeof document!=='undefined'?document.querySelector('dgo-shell'):null; if(!shell?.confirm) return true; return shell.confirm(normalizeConfirmOptions(o)); };
export const badge = (text, tone='') => `<span class="pill dgo-pill ${tone}">${esc(text)}</span>`;
export const emptyState = (title, body) => `<div class="empty dgo-empty"><h2 class="dgo-empty__title">${esc(title)}</h2><p>${esc(body)}</p></div>`;
export const chips = (items, active, attr='data-chip') => `<div class="chips">${items.map(i=>`<button type="button" class="chip dgo-chip ${i.value===active?'active':''}" ${attr}="${esc(i.value)}">${esc(i.label)}</button>`).join('')}</div>`;
export const table = (cols, rows, rowAttr) => rows.length
  ? `<div class="tablewrap dgo-table-wrap"><table class="dgo-table"><thead><tr>${cols.map(c=>`<th>${esc(c.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr ${rowAttr?rowAttr(r):''}>${cols.map(c=>`<td>${c.render?c.render(r):esc(r[c.key]??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
  : emptyState('No records', 'Nothing to show for the current filter.');
export const listItem = (r, active, title, meta, id) => `<div class="list-item dgo-card ${active?'active':''}" data-ref="${esc(id)}"><h4>${esc(title)}</h4><div class="meta">${esc(meta)}</div></div>`;

// R11.6.2 master-detail view switching. On narrow viewports a data-md split shows one
// view at a time; mdBack() renders the portrait-only return control, mdSwitch() computes
// the attribute, and resetDetailScroll() pins the detail pane back to its top whenever a
// new row is selected (each pane is an independent scroll region on desktop).
export const mdBack = (label='Back to list') => `<button type="button" class="btn ghost md-back" data-md-back>← ${esc(label)}</button>`;
export const mdSwitch = view => `data-md="${view==='detail'?'detail':'list'}"`;
export const resetDetailScroll = el => { const d=el?.querySelector?.('[data-md]>*:last-child'); if(d&&typeof d.scrollTo==='function')d.scrollTo(0,0); };
export const resetWorkspaceScroll = () => { const m=typeof document!=='undefined'?document.querySelector('main'):null; if(m)m.scrollTop=0; };

export const authorityCard = (role, owns=[], excludes=[]) => `<section class="panel boundary-note"><div class="eyebrow">Module Authority</div><p><b>${esc(role)}</b></p><p class="meta">Owns: ${esc((owns||[]).join(', '))}</p><p class="meta">Does not own: ${esc((excludes||[]).join(', '))}</p></section>`;
