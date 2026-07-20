import { Routes } from '../config/routes.config.js';
import { NavGroups } from '../config/nav.config.js';
import { canAccess } from '../config/rbac.config.js';
import { State } from '../core/state.js';
import { Router } from '../core/router.js';
import { esc } from '../core/ui.js';
const glyph={home:'⌂',activities:'▤',correspondence:'✉','response-tracking':'↔',orchestrator:'⌘','single-assignment':'１','bulk-assignment':'∞',fasttrack:'⚡',approvals:'✓',acknowledgment:'A',dispatch:'➤',registry:'▣',comments:'◌',reports:'R',statistics:'∑',executive:'E',assistant:'✦',lookup:'⌕','operator-hud':'O',settings:'⚙',diagnostics:'D','user-admin':'U'};
class Shell extends HTMLElement{
  connectedCallback(){this.render();this._off=State.on(()=>this.refreshIdentityAndNav());Router.start();}
  disconnectedCallback(){this._off?.();}
  render(){const s=State.get();this._persona=s.profile.persona; const nav=NavGroups.map(g=>{const rs=Routes.filter(r=>g.routes.includes(r.path)&&canAccess(s.profile.persona,r.path)); return rs.length?`<div class="group">${g.group}</div>${rs.map(r=>`<a class="navlink dgo-sidebar__item" href="#/${r.path}" data-route="${r.path}" title="${r.label}"><span class="glyph dgo-icon-slot">${glyph[r.path]||'•'}</span><span class="label">${r.label}</span></a>`).join('')}`:''}).join('');
    this.innerHTML=`<div class="ministry">FEDERAL MINISTRY OF COMMUNICATIONS, INNOVATION & DIGITAL ECONOMY</div><header class="top"><button class="iconbtn" data-menu aria-label="Toggle navigation">☰</button><img class="logo" src="assets/dgo-logo.svg" alt="DGO Digital Ops"><div class="context"><small>ACTIVE WORKSPACE</small><b data-context>Activities</b></div><div class="grow"></div><label class="header-search"><span>⌕</span><input data-search placeholder="Search current workspace" aria-label="Search current workspace"></label><button class="iconbtn" data-sync title="Synchronize data" aria-label="Synchronize data">↻</button><button class="iconbtn" data-theme title="Change theme" aria-label="Change theme">◐</button><button class="btn ghost" data-export>Export</button></header><div class="shell" data-shell><nav class="nav" data-nav>${nav}<div class="identity"><b data-name>${esc(s.profile.name)}</b><small data-role>${esc(s.profile.persona)} · ${esc(s.profile.email)}</small></div></nav><div class="content"><main id="main" data-outlet tabindex="-1"></main><footer class="footer"><div class="brand"><img src="assets/dgo-mark.svg" alt=""><span><b>DGO Digital Operations</b><br><small>An Initiative of NITDA</small></span></div><p>National Information Technology Development Agency · Secure internal workspace</p><small class="copy">© ${new Date().getFullYear()} NITDA Digital Ops</small></footer></div></div><aside class="pane hidden" data-pane><button class="btn ghost" data-close>Close</button><div data-pane-body></div></aside><div class="command-results hidden" data-command-results role="listbox"></div><div class="feedback" aria-live="polite"></div><dialog><form method="dialog"><h2 data-title></h2><div data-body></div><p><button class="btn" value="ok">Confirm</button> <button class="btn ghost" value="cancel">Cancel</button></p></form></dialog>${this.welcomeMarkup(s)}`;
    const shell=this.querySelector('[data-shell]'), navEl=this.querySelector('[data-nav]'), main=this.querySelector('main');
    if(innerWidth>768 && (s.settings.navCollapsed ?? innerWidth<1280)) shell.classList.add('collapsed');
    const collapse=()=>{ if(innerWidth<=768) navEl.classList.remove('open'); else shell.classList.add('collapsed'); };
    this.querySelector('[data-menu]').onclick=e=>{e.stopPropagation();if(innerWidth<=768){navEl.classList.toggle('open')}else{shell.classList.toggle('collapsed');State.patch({settings:{...State.get().settings,navCollapsed:shell.classList.contains('collapsed')}})}};
    main.addEventListener('pointerdown',()=>{if(innerWidth<=768)navEl.classList.remove('open')});
    navEl.addEventListener('click',e=>{if(!e.target.closest('[data-route]'))return;if(innerWidth<=768)navEl.classList.remove('open');else if(innerWidth<1280){shell.classList.add('collapsed');State.patch({settings:{...State.get().settings,navCollapsed:true}})}});
    this.querySelector('[data-close]').onclick=()=>this.closePane();
    this.querySelector('[data-theme]').onclick=e=>{e.stopPropagation(); const a=['government','dark','high-contrast']; const i=(a.indexOf(State.get().settings.theme)+1)%a.length; State.patch({settings:{...State.get().settings,theme:a[i]}}); document.documentElement.dataset.theme=a[i];};
    this.querySelector('[data-sync]').onclick=async e=>{e.stopPropagation();e.currentTarget.disabled=true;try{const {loadRuntimeData}=await import('../core/data-loader.js');await loadRuntimeData({force:true});this.toast('Data synchronized','success')}catch(x){this.toast(x.message,'error')}finally{e.currentTarget.disabled=false}};
    this.querySelector('[data-export]').onclick=e=>{e.stopPropagation(); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(State.get(),null,2)],{type:'application/json'})); a.download='dgo-runtime-export.json'; a.click();};
    {let searchTimer;this.querySelector('[data-search]').oninput=e=>{const q=e.target.value.trim().toLowerCase();clearTimeout(searchTimer);searchTimer=setTimeout(()=>this.commandSearch(q),120)}};
    const welcome=this.querySelector('[data-welcome]');
    if(welcome){const dismiss=()=>{State.patch({settings:{...State.get().settings,welcomeSeen:true}}); welcome.remove();}; welcome.querySelector('[data-enter]').onclick=dismiss; welcome.querySelector('[data-goto-home]').onclick=()=>{dismiss(); Router.go('home');};}
  }
  welcomeMarkup(s){
    if(s.settings.welcomeSeen) return '';
    const groups=[['INTAKE','Capture and triage incoming correspondence as it arrives.'],['ROUTING','Move files and tasks to the right desk, with a full minute-sheet trail.'],['ACTION','Assign work single or in bulk, with FastTrack SLA visibility.'],['REVIEW','Approve, sign off and dispatch with a recorded, auditable decision.']];
    return `<div class="welcome" data-welcome role="dialog" aria-modal="true" aria-labelledby="welcome-title"><div class="welcome__card">
      <img class="welcome__mark" src="assets/dgo-mark.svg" alt="">
      <div class="eyebrow">DGO DIGITAL OPS · A NITDA PLATFORM</div>
      <h1 id="welcome-title">Welcome, ${esc(s.profile.name)}</h1>
      <p class="subtitle">A unified workspace for intake, routing, assignment, approval and dispatch of NITDA correspondence.</p>
      <div class="welcome__grid">${groups.map(([t,d])=>`<div class="welcome__item"><b>${t}</b><p>${d}</p></div>`).join('')}</div>
      <div class="form-row"><button class="btn" data-enter>Enter Workspace</button><button class="btn ghost" data-goto-home>Go to Home Dashboard</button></div>
    </div></div>`;
  }
  commandSearch(q){const box=this.querySelector('[data-command-results]');if(!q){box.classList.add('hidden');box.innerHTML='';return}const s=State.get(),routes=Routes.filter(r=>r.label.toLowerCase().includes(q)).map(r=>({type:'Workspace',title:r.label,meta:r.group,route:r.path,id:''})),docs=s.activities.filter(a=>[a.title,a.referenceId,a.category].some(v=>String(v||'').toLowerCase().includes(q))).slice(0,8).map(a=>({type:'Correspondence',title:a.title,meta:a.referenceId||'No reference',route:'activities',id:a.id})),tasks=s.tracking.filter(t=>[t.title,t.referenceId,t.assignedTo].some(v=>String(v||'').toLowerCase().includes(q))).slice(0,8).map(t=>({type:'Task',title:t.title,meta:t.referenceId||'No reference',route:'orchestrator',id:t.id})),rows=[...routes,...docs,...tasks].slice(0,16);box.innerHTML=rows.map((x,i)=>`<button class="command-item" data-command="${i}"><b>${esc(x.title)}</b><small>${esc(x.type)} · ${esc(x.meta)}</small></button>`).join('')||'<div class="empty">No results</div>';box.classList.remove('hidden');box.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{const x=rows[+b.dataset.command];if(x.id)State.patch({selectedId:x.id});Router.go(x.route);box.classList.add('hidden');this.querySelector('[data-search]').value=''});}
  active(p){const r=Routes.find(x=>x.path===p); this.querySelector('[data-context]').textContent=r?.label||'Workspace'; document.title=`${r?.label||'Workspace'} · DGO Digital Operations`; this.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===p)); if(innerWidth<=768)this.querySelector('.nav')?.classList.remove('open');}
  refreshIdentityAndNav(){const persona=State.get().profile.persona;if(persona!==this._persona){this._persona=persona;const current=Router.path();this.render();Router.render();return}this.identity()}
  identity(){const s=State.get(); this.querySelector('[data-name]').textContent=s.profile.name; this.querySelector('[data-role]').textContent=`${s.profile.persona} · ${s.profile.email}`;}
  toast(m,t=''){const x=document.createElement('div'); x.className='toast '+t; x.textContent=m; this.querySelector('.feedback').append(x); setTimeout(()=>x.remove(),3500);}
  confirm({title,body}){const d=this.querySelector('dialog'); d.querySelector('[data-title]').textContent=title; d.querySelector('[data-body]').innerHTML=body; d.showModal(); return new Promise(r=>d.addEventListener('close',()=>r(d.returnValue==='ok'),{once:true}));}
  openPane(h){this.querySelector('[data-pane-body]').innerHTML=h; this.querySelector('[data-pane]').classList.remove('hidden');}
  closePane(){this.querySelector('[data-pane]').classList.add('hidden');}
}
if(!customElements.get('dgo-shell'))customElements.define('dgo-shell',Shell);
