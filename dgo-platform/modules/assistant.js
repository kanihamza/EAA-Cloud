import { hydrateGovernance, executeOwnedAction } from '../core/governed-actions.js';
import { QueryStore } from '../core/query-store.js';
import { head, esc, confirmAction, toast } from '../core/ui.js';
import { invokeData } from '../core/api.js';
let messages = [], sending = false;
export async function mount(el){hydrateGovernance();render(el); }
function render(el) {
  el.innerHTML = `<div class="workspace">${head('Assistant', 'Ask scoped questions about correspondence, tasks and workflow status. Unauthorized/raw data is not sent.')}
    <div class="panel"><div class="thread" id="asst-log">${messages.length ? messages.map(m => `<div class="msg ${m.role === 'user' ? 'mine' : ''}"><span class="who">${m.role === 'user' ? 'You' : 'Assistant'}</span>${esc(m.content)}</div>`).join('') : '<p class="meta">Ask a question to get started.</p>'}</div>
      <div class="form-row"><textarea id="asst-input" class="flex-1" rows="2" placeholder="Ask the assistant… (Ctrl+Enter to send)"></textarea>
      <button class="btn" id="asst-send" ${sending ? 'disabled' : ''}>${sending ? 'Sending…' : 'Send'}</button></div></div></div>`;
  const input = el.querySelector('#asst-input'), send = el.querySelector('#asst-send');
  send.onclick = () => submit(el);
  input.onkeydown = e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submit(el); } };
  el.querySelector('#asst-log').scrollTop = el.querySelector('#asst-log').scrollHeight;
}
async function submit(el) {
  if (sending) return; const input = el.querySelector('#asst-input'); const text = (input.value || '').trim(); if (!text) return;
  if (!await confirmAction({ title: 'Send to Assistant', body: `<p>${esc(text)}</p><p class="meta">This is sent to the AI_CHAT flow endpoint.</p>` })) return;
  messages.push({ role: 'user', content: text }); sending = true; render(el);
  try {
    const context = await QueryStore.dashboard().catch(()=>null);
    const res = await executeOwnedAction('assistant','ask',()=>invokeData('AI_CHAT', { messages, scoped:true, context }),{meta:{promptLength:text.length}});
    messages.push({ role: 'assistant', content: res?.reply || res?.message || (typeof res==='string'?res:'No reply was returned by the AI flow.') });
    toast('Assistant response received','success');
  } catch (error) { messages.push({ role: 'assistant', content: 'The AI flow could not complete the request. Review Diagnostics or retry. ' + (error?.message||'') }); toast('Assistant request failed','error'); }
  sending = false; render(el);
}
