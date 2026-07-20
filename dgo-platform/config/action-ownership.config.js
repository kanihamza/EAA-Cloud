export const ActionOwnership = Object.freeze({
  'create-correspondence': { owner:'correspondence', service:'Entities.create', audit:'audit:correspondence-created', backend:'DYNAMIC_ACTIONS.optional' },
  triage: { owner:'correspondence', service:'Entities.transitionStatus', audit:'audit:triage-completed', backend:'DYNAMIC_ACTIONS.optional' },
  'assign-one': { owner:'single-assignment', service:'Entities.create(task)', audit:'audit:assigned', backend:'SINGLE_ASSIGNMENT' },
  'bulk-assign': { owner:'bulk-assignment', service:'OtpService+Idempotency', audit:'audit:bulk-assignment-submitted', backend:'BULK_ASSIGNMENT' },
  acknowledge: { owner:'acknowledgment', service:'governedTransition', audit:'audit:acknowledged', backend:'DYNAMIC_ACTIONS.optional' },
  'start-work': { owner:'orchestrator', service:'governedTransition', audit:'audit:work-started', backend:'DYNAMIC_ACTIONS.optional' },
  'complete-action': { owner:'orchestrator', service:'governedTransition', audit:'audit:action-complete', backend:'DYNAMIC_ACTIONS.optional' },
  approve: { owner:'approvals', service:'governedTransition', audit:'audit:approved', backend:'DYNAMIC_ACTIONS.optional' },
  'executive-approve': { owner:'executive', service:'governedTransition', audit:'audit:executive-approved', backend:'DYNAMIC_ACTIONS.optional' },
  'send-dispatch': { owner:'dispatch', service:'DispatchService.dispatchOutbound', audit:'audit:dispatch-started', backend:'DISPATCH_OUTBOUND' },
  'archive-reference': { owner:'archive', service:'ArchiveService.archiveReference', audit:'audit:archived', backend:'ARCHIVE_REFERENCE.optional' },
  'generate-report': { owner:'reports', service:'ReportExportService', audit:'audit:report-generated', backend:'none' },
  'run-checks': { owner:'diagnostics', service:'Diagnostics', audit:'audit:diagnostics-run', backend:'none' },
  'profile': { owner:'settings', service:'State.patch', audit:'audit:settings-updated', backend:'none' },
  'create-user': { owner:'user-admin', service:'State.patch', audit:'audit:user-created', backend:'DYNAMIC_ACTIONS.optional' }
});
export function actionSpec(action){ return ActionOwnership[action] || null; }
export function actionOwner(action){ return actionSpec(action)?.owner || ''; }
