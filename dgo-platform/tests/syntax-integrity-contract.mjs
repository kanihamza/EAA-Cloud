import { execFileSync } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path';
const root = process.cwd(); const dirs = ['core','config','modules','shared']; const bad = [];
function walk(d){ for(const f of fs.readdirSync(d)){ const p=path.join(d,f); const st=fs.statSync(p); if(st.isDirectory()) walk(p); else if(f.endsWith('.js')||f.endsWith('.mjs')) check(p); } }
function check(p){
  // node --check on a plain .js file silently skips real validation once it detects a
  // top-level `import`, so a genuinely-invalid file can still report a false pass.
  // Forcing --input-type=module applies the real ES module grammar every time.
  try { execFileSync(process.execPath, ['--input-type=module','--check'], { input: fs.readFileSync(p), stdio: ['pipe','pipe','pipe'] }); }
  catch(e){ bad.push({ file: path.relative(root, p), error: String(e.stderr || e.message).split('\n')[0] }); }
}
for (const d of dirs) walk(path.join(root, d));
if (bad.length) { console.error('Syntax errors found:', JSON.stringify(bad, null, 2)); process.exit(1); }
console.log('syntax-integrity-contract passed');
