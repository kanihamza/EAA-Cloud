export const LoadingPolicy = Object.freeze({
  scopes:['global','route','module','data','action','background'],
  states:['idle','loading','refreshing','success','error'],
  showSkeletonAfterMs:150,
  showSlowWarningAfterMs:5000,
  showBackendWarningAfterMs:10000,
  actionButtonLock:true,
  preserveLastGoodData:true
});
