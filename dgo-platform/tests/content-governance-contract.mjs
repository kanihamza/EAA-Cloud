// Content governance is now driven by route metadata: a workspace whose route declares
// kpi:false must not render the dashboard KPI band (kpis(); stat rows via statRow() are
// the sanctioned equivalent). This gives routes.config's kpi flag a real consumer and
// keeps the flag truthful — flipping it without changing the module fails this contract.
import fs from 'node:fs';
import { Routes } from '../config/routes.config.js';
for (const r of Routes) {
  const s = fs.readFileSync(new URL(`../modules/${r.path}.js`, import.meta.url), 'utf8');
  const usesKpis = s.includes('kpis(');
  if (r.kpi && !usesKpis && r.kind === 'dashboard') throw new Error(`Route ${r.path} declares kpi:true (dashboard) but renders no KPI band`);
  if (!r.kpi && usesKpis) throw new Error('Unexpected KPI in ' + r.path);
}
console.log('content governance contracts passed');
