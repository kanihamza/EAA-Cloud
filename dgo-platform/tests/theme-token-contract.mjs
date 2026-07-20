// R11.6.1 workspace review contract: component styling must draw from the DGO token
// system so every surface adapts across government/dark/high-contrast themes. Off-brand
// hard-coded palette values are banned from app.css (the registry minute-sheet "paper"
// skeuomorph is the one deliberate exception and carries its own fixed ink colors).
import assert from 'node:assert/strict';
import fs from 'node:fs';
const tokens=fs.readFileSync(new URL('../styles/tokens.css',import.meta.url),'utf8');
for (const t of ['--gold','--ok-soft','--warn-soft','--danger-soft','--info-soft','--accent-soft','--neutral-soft'])
  assert.ok(tokens.includes(t), `missing token ${t}`);
assert.match(tokens,/\[data-theme=dark\][^}]*--ok-soft/s,'dark theme must override tone surfaces');
assert.match(tokens,/\[data-theme=high-contrast\][^}]*--ok-soft/s,'high-contrast theme must override tone surfaces');
const css=fs.readFileSync(new URL('../styles/app.css',import.meta.url),'utf8');
const banned=['#0078D4','#fee4e2','#fff7e0','#e6f4ea','#f2f4f7','#b42318','#b45309','#027a48','#667085','#c9a227','#00A69D','#E05606','#FBF1D8','#E4F5E1','#FBE4E4','#E4EFFB','#EAF7EF','#f9fafb'];
const found=banned.filter(h=>css.toLowerCase().includes(h.toLowerCase()));
assert.deepEqual(found, [], 'off-brand hard-coded colors remain in app.css');
for (const c of ['.pill{','.tag.overdue','.recip-chip','.sla-progress','.report-banner'])
  assert.ok(css.includes(c), `expected component rule ${c}`);
console.log('theme-token-contract passed');
