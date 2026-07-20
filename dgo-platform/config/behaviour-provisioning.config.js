export const BehaviourProvisioning = Object.freeze({
  actionFeedback: { successToast:true, errorToast:true, inlineError:true, loadingState:true },
  audit: { statePatch:true, ownedActions:true, archiveAccess:true, endpointOverride:true, userAdmin:true },
  lifecycle: { requireTransitionWriter:true, directStatusMutation:false, closureGate:true, noOrphan:true },
  backend: { useEndpointContracts:true, retryPendingWrites:true, classifyFlowErrors:true },
  ui: { accessibleLabels:true, keyboardReachable:true, confirmationForDestructive:true, responsiveContainment:true },
  data: { defensiveReads:true, directorateScope:true, quarantineInvalidRecords:true, activeArchiveSearch:true }
});
