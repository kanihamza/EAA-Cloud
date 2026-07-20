import { EndpointKeys, EndpointUrls, DefaultEndpointSettings, EndpointContracts } from '../config/endpoints.config.js';
import { State } from '../core/state.js';
const missing=[];
for (const key of EndpointKeys) {
  const url = EndpointUrls[key];
  if (!url) missing.push(key);
  if (!String(url).startsWith('https://defaultca6a4b3f912349bcbcb927085ebbf1.a1.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/')) throw new Error('Unexpected endpoint host/path for '+key);
  if (!String(url).includes('/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=')) throw new Error('Unexpected endpoint query contract for '+key);
  if (DefaultEndpointSettings[key] !== url) throw new Error('DefaultEndpointSettings mismatch for '+key);
  if (EndpointContracts[key]?.url !== url) throw new Error('EndpointContracts.url mismatch for '+key);
}
if (missing.length) throw new Error('Missing configured URLs: '+missing.join(','));
const settings = State.get().settings.endpoints;
for (const key of EndpointKeys) if (!settings[key]) throw new Error('State default endpoint missing '+key);
console.log(`endpoint configuration contract passed: ${EndpointKeys.length}`);
