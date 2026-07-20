from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def need(path,patterns):
 p=ROOT/path
 if not p.exists(): errors.append(f"missing: {path}"); return
 s=p.read_text(encoding="utf-8")
 for pattern in patterns:
  if not re.search(pattern,s,re.M): errors.append(f"{path}: missing {pattern}")
need("styles/enhancements.css",[r":focus-visible",r"forced-colors",r"prefers-reduced-motion",r"\[dir=\"rtl\"\]",r"\.dgo-accordion",r"\.dgo-file",r"\.dgo-chart"])
need("scripts/dgo-runtime.js",[r"openModal",r"closeModal",r"initTabs",r"initAccordion",r"textContent"])
m=json.loads((ROOT/"coverage/technical-coverage.json").read_text())
for c in m["components"]:
 for k in ("styles","documentation"):
  if not (ROOT/c[k]).exists(): errors.append(f"{c['id']}: missing {k} {c[k]}")
print(json.dumps({"ok":not errors,"errors":errors,"componentCount":len(m["components"])},indent=2))
sys.exit(bool(errors))
