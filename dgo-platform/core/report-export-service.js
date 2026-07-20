import { State } from './state.js';
import { auditAction } from './action-authority.js';
export const ReportExportService=Object.freeze({createJson,createHtml,downloadText});
function snapshot(){ const s=State.get(); return {generatedAt:new Date().toISOString(), profile:s.profile, counts:{activities:s.activities?.length||0, tracking:s.tracking?.length||0, correspondence:s.correspondence?.length||0, approvals:s.approvals?.length||0, dispatches:s.dispatches?.length||0, registryFiles:s.registryFiles?.length||0}}; }
function createJson(name='platform-report', payload=snapshot()){ auditAction('reports','generate-report',{meta:{name,format:'json'}}); return JSON.stringify({name,...payload},null,2); }
function createHtml(name='platform-report', payload=snapshot()){ auditAction('reports','generate-report',{meta:{name,format:'html'}}); return `<!doctype html><meta charset="utf-8"><title>${name}</title><h1>${name}</h1><pre>${JSON.stringify(payload,null,2)}</pre>`; }
function downloadText(filename, text, type='text/plain'){ const blob=new Blob([text],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); URL.revokeObjectURL(a.href); }
