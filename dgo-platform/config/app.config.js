export const AppConfig = Object.freeze({
  id: 'dgo-r11-3-bespoke-runtime',
  version: '11.6.0-enterprise-domains',
  storageKey: 'dgo.r11.viewport.runtime.state',
  stateSchemaVersion: 4,
  defaultRoute: 'activities',
  maxBulkAssign: 50,
  apiTimeoutMs: 45000,
  themes: ['government','dark','high-contrast'],
  densities: ['comfortable','compact'],
  certifiedViewports: [320,375,430,600,768,1024,1280,1440,1920]
});
