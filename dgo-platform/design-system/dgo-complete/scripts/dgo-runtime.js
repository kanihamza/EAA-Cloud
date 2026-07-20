/** DGO declarative runtime: dependency-free, progressive, file:// safe. */
(() => {
  'use strict';
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const focusables=r=>qa('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])',r).filter(x=>!x.hidden&&x.getClientRects().length);
  const emit=(el,name,detail={})=>el.dispatchEvent(new CustomEvent(`dgo:${name}`,{bubbles:true,detail}));
  const escape=s=>globalThis.CSS?.escape?CSS.escape(s):String(s).replace(/[^\w-]/g,'\\$&');
  const state={modalStack:[],returnFocus:new WeakMap(),tooltips:new WeakMap()};

  function setDisabled(el,disabled){
    el.setAttribute('aria-disabled',String(disabled));
    if('disabled' in el) el.disabled=disabled;
  }
  function openModal(modal,opener=document.activeElement){
    if(!modal||state.modalStack.includes(modal)) return;
    state.returnFocus.set(modal,opener); modal.hidden=false; modal.dataset.state='open';
    modal.setAttribute('aria-modal','true'); document.body.dataset.dgoScrollLock='true'; state.modalStack.push(modal);
    const target=q('[autofocus]',modal)||focusables(modal)[0]||modal; if(!modal.hasAttribute('tabindex')) modal.tabIndex=-1;
    requestAnimationFrame(()=>target.focus()); emit(modal,'modal-open');
  }
  function closeModal(modal){
    if(!modal) return; modal.dataset.state='closed'; modal.hidden=true;
    state.modalStack=state.modalStack.filter(x=>x!==modal); if(!state.modalStack.length) delete document.body.dataset.dgoScrollLock;
    const back=state.returnFocus.get(modal); if(back?.isConnected) back.focus(); emit(modal,'modal-close');
  }
  function initTabs(root){
    const tabs=qa('[role="tab"]',root), panels=qa('[role="tabpanel"]',root); if(!tabs.length)return;
    const activate=(tab,focus=true)=>{ tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;}); panels.forEach(p=>p.hidden=p.id!==tab.getAttribute('aria-controls')); if(focus)tab.focus(); emit(root,'tab-change',{tab}); };
    tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab,false));tab.addEventListener('keydown',e=>{let n=i;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%tabs.length;else if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();activate(tabs[n]);});});
    activate(tabs.find(t=>t.getAttribute('aria-selected')==='true')||tabs[0],false);
  }
  function initAccordion(root){
    qa('.dgo-accordion__trigger',root).forEach(btn=>{const panel=q(`#${escape(btn.getAttribute('aria-controls')||'')}`); if(!panel)return; panel.hidden=btn.getAttribute('aria-expanded')!=='true'; btn.addEventListener('click',()=>{const open=btn.getAttribute('aria-expanded')!=='true'; if(root.dataset.single==='true'&&open)qa('.dgo-accordion__trigger[aria-expanded="true"]',root).forEach(other=>{if(other!==btn){other.setAttribute('aria-expanded','false');const p=q(`#${escape(other.getAttribute('aria-controls'))}`);if(p)p.hidden=true;}}); btn.setAttribute('aria-expanded',String(open));panel.hidden=!open;emit(root,'accordion-change',{button:btn,open});});});
  }
  function initFile(zone){
    const input=q('input[type="file"]',zone), list=q('.dgo-file__list',zone); if(!input)return;
    const render=()=>{if(!list)return;list.replaceChildren(...[...input.files].map(file=>{const row=document.createElement('div');row.className='dgo-file__item';const name=document.createElement('span');name.className='dgo-truncate';name.textContent=file.name;const size=document.createElement('small');size.textContent=`${Math.ceil(file.size/1024)} KB`;row.append(name,size);return row;}));emit(zone,'files-change',{files:[...input.files]});};
    zone.addEventListener('click',e=>{if(e.target===zone||e.target.closest('[data-dgo-file-browse]'))input.click();});
    ['dragenter','dragover'].forEach(n=>zone.addEventListener(n,e=>{e.preventDefault();zone.dataset.dragover='true';}));
    ['dragleave','drop'].forEach(n=>zone.addEventListener(n,e=>{e.preventDefault();delete zone.dataset.dragover;}));
    zone.addEventListener('drop',e=>{input.files=e.dataTransfer.files;render();}); input.addEventListener('change',render);
  }
  function initSegmented(root){
    const items=qa('[aria-pressed],[role="radio"]',root); items.forEach((item,i)=>{item.addEventListener('click',()=>{items.forEach(x=>{if(x.hasAttribute('aria-pressed'))x.setAttribute('aria-pressed',String(x===item));if(x.getAttribute('role')==='radio')x.setAttribute('aria-checked',String(x===item));});emit(root,'segment-change',{item});});item.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;items[(i+step+items.length)%items.length].click();items[(i+step+items.length)%items.length].focus();});});
  }
  function showToast(message,{tone='info',duration=5000,actionLabel='',onAction}={}){
    let region=q('.dgo-toast-region');if(!region){region=document.createElement('div');region.className='dgo-toast-region';region.setAttribute('aria-live','polite');region.setAttribute('aria-relevant','additions');document.body.append(region);}
    const toast=document.createElement('div');toast.className=`dgo-toast dgo-toast--${tone}`;toast.setAttribute('role',tone==='danger'?'alert':'status');
    const body=document.createElement('div');body.textContent=message;toast.append(body);
    if(actionLabel){const action=document.createElement('button');action.className='dgo-btn dgo-btn--tertiary dgo-btn--sm';action.textContent=actionLabel;action.addEventListener('click',()=>{onAction?.();toast.remove();});toast.append(action);}
    const close=document.createElement('button');close.className='dgo-btn dgo-btn--icon dgo-btn--ghost dgo-btn--sm';close.setAttribute('aria-label','Dismiss notification');close.textContent='×';close.addEventListener('click',()=>toast.remove());toast.append(close);region.append(toast);
    if(duration>0)setTimeout(()=>toast.remove(),duration);return toast;
  }
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-dgo-open]');if(open){openModal(q(`#${escape(open.dataset.dgoOpen)}`),open);return;}
    const close=e.target.closest('[data-dgo-close]');if(close){closeModal(close.closest('[role="dialog"]'));return;}
    const disabled=e.target.closest('[aria-disabled="true"]');if(disabled){e.preventDefault();e.stopImmediatePropagation();}
  },true);
  document.addEventListener('keydown',e=>{
    const modal=state.modalStack.at(-1);if(!modal)return;if(e.key==='Escape'){e.preventDefault();closeModal(modal);return;}if(e.key==='Tab'){const f=focusables(modal);if(!f.length){e.preventDefault();modal.focus();return;}const first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  function init(root=document){qa('[data-dgo-tabs]',root).forEach(initTabs);qa('[data-dgo-accordion]',root).forEach(initAccordion);qa('[data-dgo-file]',root).forEach(initFile);qa('[data-dgo-segmented]',root).forEach(initSegmented);qa('[role="dialog"]',root).forEach(d=>{if(d.dataset.state!=='open')d.hidden=true;});emit(document.documentElement,'ready');}
  globalThis.DGO=Object.freeze({init,openModal,closeModal,showToast,setDisabled,version:'2.2.0-technical-complete'});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init());else init();
})();
