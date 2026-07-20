// Contract registry for endpoint-less actions routed through DYNAMIC_ACTIONS.
// Ported from the R11.5 platform's dynamic-actions.config.js (operation/mode/required/optional/confirm).
export const DynamicActions = Object.freeze({
  transition:         { operation:'transition', mode:'single', required:['ref','status'], confirm:false, successMessage:'Status updated' },
  addComment:         { operation:'create', mode:'single', required:['referenceId','body'], confirm:false, successMessage:'Comment added' },
  acknowledge:        { operation:'acknowledge', mode:'single', required:['ref'], confirm:true, successMessage:'Acknowledged' },
  route:              { operation:'route', mode:'single', required:['ref'], confirm:true, successMessage:'Routed' },
  dispatchEmail:      { operation:'send', mode:'single', required:['email'], confirm:true, successMessage:'Email sent' },
  prepareMeetingPack: { operation:'generate', mode:'batch', required:['refs'], confirm:true, successMessage:'Pack generated' },
  issueTripClearance: { operation:'issue', mode:'single', required:['ref','traveller','destination'], confirm:true, successMessage:'Clearance issued' },
  setReminder:        { operation:'create', mode:'single', required:['dueAt'], confirm:true, successMessage:'Reminder set' },
  dispatch:           { operation:'dispatch', mode:'single', required:['ref','recipientAddress'], confirm:true, successMessage:'Dispatched' }
});
export const dynamicActionContract = (action) => DynamicActions[action] || null;
