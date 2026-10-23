// ASSETS and CONFIG are injected by scripts/build.mjs. No runtime dependencies.
const rateWindows = new Map();
const emailRequests = new Map();
const deliveryError = 'Chưa thể gửi thông tin. Vui lòng thử lại sau ít phút.';
export const security = {
 'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin',
 'permissions-policy':'camera=(), microphone=(), geolocation=()',
 'content-security-policy':"default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com; frame-src https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{...security,'content-type':'application/json; charset=utf-8','cache-control':'no-store'}})}
function mode(env){if(env.LEAD_MODE==='email')return env.EMAIL_READY&&env.CONSENT_NOTICE?'live':'unavailable';return env.LEAD_MODE==='live'&&CONFIG.legalApproved&&env.CONSENT_NOTICE?'live':'demo'}
function rateLimited(key){const now=Date.now();if(rateWindows.size>5000)for(const [k,v] of rateWindows)if(v.reset<now)rateWindows.delete(k);const v=rateWindows.get(key);if(!v||v.reset<now){rateWindows.set(key,{count:1,reset:now+60000});return false}v.count++;return v.count>6}
async function readBody(request){if(Number(request.headers.get('content-length'))>4096)throw new Error('large');const reader=request.body?.getReader();if(!reader)throw new Error('empty');let size=0,parts=[];while(true){const r=await reader.read();if(r.done)break;size+=r.value.byteLength;if(size>4096){await reader.cancel();throw new Error('large')}parts.push(r.value)}const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length}return JSON.parse(new TextDecoder().decode(bytes))}
function validBase(data){return Number.isInteger(data.amount)&&data.amount>=CONFIG.minAmount&&data.amount<=CONFIG.maxAmount&&(data.amount-CONFIG.minAmount)%CONFIG.amountStep===0&&Number.isInteger(data.purpose)&&data.purpose>=0&&data.purpose<CONFIG.purposes.length&&data.consent===true&&typeof data.requestId==='string'&&/^[a-f\d-]{36}$/i.test(data.requestId)&&Number.isFinite(data.startedAt)&&Date.now()-data.startedAt>=1500&&Date.now()-data.startedAt<86400000&&!data.website}
function validPersonal(d){return typeof d.fullName==='string'&&d.fullName.trim().length>=2&&d.fullName.length<=100&&/^[\p{L}\p{M}\s.'’-]+$/u.test(d.fullName)&&typeof d.phone==='string'&&/^0[35789]\d{8}$/.test(d.phone)&&typeof d.email==='string'&&d.email.length<=150&&(!d.email||/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(d.email))}
function sourceData(data, url) {
 const attribution={};
 if(data.attribution!==undefined&&(!data.attribution||Array.isArray(data.attribution)||typeof data.attribution!=='object'))throw new Error('tracking');
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid']) {
  const value=data.attribution?.[key];
  if(value!==undefined&&(typeof value!=='string'||value.length>256||/[\r\n\x00-\x1f]/.test(value)))throw new Error('tracking');
  if(value)attribution[key]=value.trim();
 }
 let page=new URL(data.pageUrl||'/',url.origin);
 if(page.origin!==url.origin||page.pathname.length>500)throw new Error('page');
 return {pageUrl:page.origin+page.pathname,attribution};
}
async function deliverEmail(data, env, url) {
 const source=sourceData(data,url);
 const lead={requestId:data.requestId,fullName:data.fullName.trim(),phone:data.phone,email:data.email.trim(),amount:data.amount,purpose:CONFIG.purposes[data.purpose],...source,submittedAt:new Date().toISOString(),consentVersion:env.CONSENT_VERSION||'email-v1',consentNotice:env.CONSENT_NOTICE};
 const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({...lead,submittedAt:''}))))).map(v=>v.toString(16).padStart(2,'0')).join('');
 const now=Date.now();
 for(const [id,v] of emailRequests)if(v.expires<now)emailRequests.delete(id);
 const existing=emailRequests.get(data.requestId);
 if(existing) {if(existing.fingerprint!==fingerprint)return json({message:'Vui lòng tải lại biểu mẫu để gửi thông tin đã thay đổi.'},409);const cached=await existing.promise;return cached?json(cached):json({message:deliveryError},502)}
 if(emailRequests.size>=5000)return json({message:deliveryError},503);
 // Store only a digest and response promise, never retain the personal payload in this cache.
 const promise=(async()=>{try{await env.SEND_LEAD_EMAIL(lead);return {accepted:true,demo:false,id:'lead-'+data.requestId}}catch{emailRequests.delete(data.requestId);return null}})();
 emailRequests.set(data.requestId,{fingerprint,expires:now+30*60*1000,promise});
 const result=await promise;
 return result?json(result):json({message:deliveryError},502);
}
export default {
 async fetch(request,env={}){
  const url=new URL(request.url);const path=url.pathname.replace(/\/$/,'')||'/';
  if(path==='/api/config'&&request.method==='GET')return json({mode:mode(env),GTM_ID:env.GTM_ID||'',GA_ID:env.GA_ID||'',META_PIXEL_ID:env.META_PIXEL_ID||'',consentNotice:mode(env)==='live'?env.CONSENT_NOTICE:'',partners:mode(env)==='live'?CONFIG.partners:[]});
  if(path==='/api/leads'){
   if(request.method!=='POST')return json({message:'Phương thức không được hỗ trợ.'},405);
   if(request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')return json({message:'Yêu cầu không hợp lệ.'},403);
   if(!request.headers.get('content-type')?.includes('application/json'))return json({message:'Định dạng không được hỗ trợ.'},415);
   if(rateLimited(request.headers.get('cf-connecting-ip')||'local'))return json({message:'Bạn đã thử nhiều lần. Vui lòng đợi một phút rồi thử lại.'},429);
   let data;try{data=await readBody(request)}catch{return json({message:'Không thể đọc thông tin. Vui lòng thử lại.'},400)}
   if(!data||!validBase(data))return json({message:'Vui lòng kiểm tra nhu cầu và xác nhận đồng ý trước khi tiếp tục.'},400);
   if(mode(env)==='unavailable')return json({message:deliveryError},503);
   if(mode(env)==='demo'){
    // Reject personal fields in preview rather than accepting accidental PII.
    if(['fullName','phone','email'].some(key=>key in data))return json({message:'Bản trải nghiệm không tiếp nhận dữ liệu cá nhân.'},400);
    return json({accepted:true,demo:true,id:'demo-'+crypto.randomUUID()},200);
   }
   if(!validPersonal(data))return json({message:'Vui lòng kiểm tra lại họ tên, số điện thoại hoặc email.'},400);
   if(env.LEAD_MODE==='email'){try{return await deliverEmail(data,env,url)}catch{return json({message:'Vui lòng kiểm tra lại nguồn đăng ký.'},400)}}
   let endpoint;try{endpoint=new URL(env.LEAD_WEBHOOK_URL);if(endpoint.protocol!=='https:')throw new Error()}catch{return json({message:'Hệ thống chưa sẵn sàng tiếp nhận hồ sơ. Thông tin của bạn chưa được gửi; vui lòng thử lại sau.'},503)}
   try{
    const response=await fetch(endpoint.href,{method:'POST',headers:{'content-type':'application/json','idempotency-key':data.requestId,...(env.LEAD_WEBHOOK_TOKEN?{authorization:'Bearer '+env.LEAD_WEBHOOK_TOKEN}:{})},body:JSON.stringify({requestId:data.requestId,fullName:data.fullName.trim(),phone:data.phone,email:data.email,amount:data.amount,purpose:CONFIG.purposes[data.purpose],consent:true,consentVersion:env.CONSENT_VERSION||'unversioned',consentNotice:env.CONSENT_NOTICE,consentedAt:new Date().toISOString()}),signal:AbortSignal.timeout(12000)});
    const result=await response.json();if(!response.ok||result.accepted!==true||typeof result.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(result.id))throw new Error();
    return json({accepted:true,demo:false,id:result.id});
   }catch{return json({message:'Chưa nhận được xác nhận tiếp nhận. Bạn có thể thử lại với cùng thông tin; hệ thống dùng mã yêu cầu để tránh gửi trùng.'},502)}
  }
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:security});
  const asset=ASSETS[path]||ASSETS['/404'];const status=ASSETS[path]?200:404;
  const bytes=Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));
  return new Response(request.method==='HEAD'?null:bytes,{status,headers:{...security,'content-type':asset.type,'cache-control':path.startsWith('/assets/')?'public, max-age=86400':'no-cache',...(asset.type.startsWith('text/html')&&!CONFIG.legalApproved?{'x-robots-tag':'noindex, nofollow'}:{})}});
 }
};
