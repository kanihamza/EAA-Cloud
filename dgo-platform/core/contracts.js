const array = value => Array.isArray(value) ? value : [];
export function assertEnvelope(response, expectedAction='') {
  if (!response || typeof response !== 'object') throw new Error('Flow returned a non-object response');
  if (response.ok === false || Number(response.status?.http||200) >= 400) {
    const detail=array(response.errors).map(e=>e?.message||e?.code||String(e)).join('; ');
    throw new Error(detail || response.status?.message || 'Flow reported failure');
  }
  if (expectedAction && response.request?.action && String(response.request.action).toLowerCase()!==String(expectedAction).toLowerCase()) throw new Error(`Flow action mismatch: expected ${expectedAction}, received ${response.request.action}`);
  return response.data ?? response;
}
export const responseMeta = response => ({requestId:response?.request?.requestId||'',trackingId:response?.request?.trackingId||'',action:response?.request?.action||'',receivedAt:response?.timing?.receivedAtUtc||'',completedAt:response?.timing?.completedAtUtc||'',durationMs:Number(response?.timing?.durationMs||0),runId:response?.meta?.runId||'',flowName:response?.meta?.flowName||'',contractVersion:response?.meta?.contractVersion||''});
export function collection(data, ...aliases){for(const key of aliases)if(Array.isArray(data?.[key]))return data[key];return []}
export function unwrapActionResponse(key,response){
 const data=assertEnvelope(response);
 if(['AI_CHAT','AI_EMAIL_ANALYSIS','AI_DOC_ANALYSIS'].includes(key)) return data.result??data.analysis??data.message??data;
 if(['OTP_GENERATE','OTP_VERIFY'].includes(key)) return data.result??data;
 return data;
}
