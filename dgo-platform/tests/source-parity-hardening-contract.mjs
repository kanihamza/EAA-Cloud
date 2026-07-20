import fs from 'node:fs';
import assert from 'node:assert/strict';

const adapter = fs.readFileSync('core/nitda-module-adapter.js','utf8');
const boot = fs.readFileSync('core/boot.js','utf8');
const css = fs.readFileSync('styles/app.css','utf8');
const settings = fs.readFileSync('modules/settings.js','utf8');

assert.match(boot, /nitda-module-adapter\.js/, 'boot must install the NITDA module adapter');
assert.match(adapter, /NITDA_MODULE/, 'adapter must use the source module message identity');
assert.match(adapter, /PA_CALL/, 'adapter must route shell flow calls through PA_CALL');
assert.match(adapter, /VALIDATE/, 'adapter must support shell validation before flow routing');
assert.match(adapter, /GET_USER/, 'adapter must support shell identity bootstrap');
assert.ok(adapter.includes('powerautomate\\/automations\\/direct') || adapter.includes('powerautomate/automations/direct'), 'adapter must intercept direct Power Automate URLs only inside shell mode');
assert.match(adapter, /workflowEndpointMap/, 'adapter must map known workflow IDs to governed current endpoint keys');
assert.match(css, /data-nitda-embed="1"/, 'embedded mode CSS must be provisioned');
assert.match(css, /\.ministry[\s\S]*display: none !important/, 'embedded mode must suppress duplicate native chrome');
assert.match(settings, /data-copy-endpoints/, 'settings must expose endpoint JSON copy');
assert.match(settings, /data-clear-local/, 'settings must expose governed local-data clearing');
assert.match(settings, /Confirm settings update/, 'settings save must have confirmation preview');
assert.match(settings, /Endpoint changes/, 'settings preview must summarize endpoint changes');
assert.match(settings, /audit:settings-save/, 'settings save must audit state mutation');
assert.match(settings, /Clear endpoint fields/, 'endpoint reset must be explicitly confirmed');
assert.match(settings, /Clear local runtime data/, 'local data clearing must be explicitly confirmed');
console.log('source-parity-hardening-contract passed');
