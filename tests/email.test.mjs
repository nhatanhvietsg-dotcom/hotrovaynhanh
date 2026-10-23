import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {emailSender, leadMessage, smtpSettings} from '../netlify/lib/lead-email.mjs';
import {config} from '../src/config.js';
const source='const CONFIG='+JSON.stringify(config)+';const ASSETS={};\n'+await readFile(new URL('../worker/index.js',import.meta.url),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
const base=()=>({amount:8500000,purpose:0,consent:true,website:'',startedAt:Date.now()-3000,requestId:crypto.randomUUID(),fullName:'Khách Kiểm Thử',phone:'0900000000',email:'test@example.com',pageUrl:'https://test.local/?email=not-forwarded',attribution:{utm_source:'facebook',utm_campaign:'Tháng mười',gclid:'test-click'}});
const request=(body,ip=crypto.randomUUID())=>new Request('https://test.local/api/leads',{method:'POST',headers:{origin:'https://test.local','content-type':'application/json','cf-connecting-ip':ip},body:JSON.stringify(body)});
const env={LEAD_MODE:'email',EMAIL_READY:true,CONSENT_NOTICE:'Consent for email to admin',CONSENT_VERSION:'test-v1'};
const smtp={SMTP_HOST:'smtp.gmail.com',SMTP_PORT:'465',SMTP_SECURE:'true',SMTP_USER:'sender@example.com',SMTP_APP_PASSWORD:'dummy-test-only',LEAD_RECEIVER_EMAIL:'receiver@example.com'};
test('SMTP settings fail closed and enforce encryption',()=>{assert.equal(smtpSettings({...smtp,SMTP_APP_PASSWORD:''}),null);assert.equal(smtpSettings({...smtp,SMTP_SECURE:'false'}),null);assert.equal(smtpSettings(smtp).secure,true);assert.equal(smtpSettings(smtp).requireTLS,true)});
test('email mode cannot report success with incomplete SMTP configuration',async()=>{const r=await worker.fetch(request(base()),{...env,EMAIL_READY:false});assert.equal(r.status,503);assert.equal((await r.json()).accepted,undefined)});
test('email submission waits for delivery, deduplicates retries and strips page query',async()=>{
 let calls=0,release,notify;const gate=new Promise(r=>release=r),started=new Promise(r=>notify=r);const data=base();let submitted;
 const delivery={...env,SEND_LEAD_EMAIL:async lead=>{calls++;submitted=lead;notify();await gate}};
 const pending=worker.fetch(request(data),delivery);const duplicate=worker.fetch(request(data),delivery);
 await started;assert.equal(calls,1);release();
 for(const p of [pending,duplicate]){const r=await p;assert.equal(r.status,200);assert.equal((await r.json()).demo,false)}
 assert.equal(submitted.pageUrl,'https://test.local/');assert.equal(submitted.attribution.utm_campaign,'Tháng mười');assert.equal(submitted.phone,data.phone);assert.equal(submitted.consentVersion,'test-v1');assert.ok(!('birthYear' in submitted));
 assert.equal((await worker.fetch(request({...data,amount:9000000}),delivery)).status,409);
});
test('mail errors have a generic response and same request can retry',async()=>{const data=base();const failed=await worker.fetch(request(data),{...env,SEND_LEAD_EMAIL:async()=>{throw new Error('private SMTP failure')}});assert.equal(failed.status,502);assert.equal((await failed.json()).message,'Chưa thể gửi thông tin. Vui lòng thử lại sau ít phút.');assert.equal((await worker.fetch(request(data),{...env,SEND_LEAD_EMAIL:async()=>{}})).status,200)});
test('server rejects invalid phone, email, missing consent, bots and tracking attacks',async()=>{let calls=0;const delivery={...env,SEND_LEAD_EMAIL:async()=>calls++};for(const patch of [{phone:'123'},{email:'bad@<example.com>'},{consent:false},{website:'bot'},{fullName:'<script>'},{attribution:{utm_source:'x'.repeat(257)}},{pageUrl:'https://evil.test/path'}])assert.equal((await worker.fetch(request({...base(),...patch}),delivery)).status,400);assert.equal(calls,0)});
test('rate limit stops email delivery after sixth request per minute per instance',async()=>{let calls=0;const ip=crypto.randomUUID(),delivery={...env,SEND_LEAD_EMAIL:async()=>calls++};for(let i=0;i<6;i++)assert.equal((await worker.fetch(request(base(),ip),delivery)).status,200);assert.equal((await worker.fetch(request(base(),ip),delivery)).status,429);assert.equal(calls,6)});
const lead={...base(),purpose:'Chi tiêu phát sinh',submittedAt:'2026-10-23T02:00:00Z',consentVersion:'v1',consentNotice:'Tôi đồng ý'};
test('Vietnamese HTML and plain text contain exact form fields and escape HTML',()=>{const msg=leadMessage({...lead,attribution:{utm_campaign:'<img src=x onerror=alert(1)>'}},smtp);assert.equal(msg.subject,'[Hỗ Trợ Vay Vốn] Có khách hàng đăng ký mới');assert.match(msg.text,/8.500.000đ/);assert.match(msg.text,/0900000000/);assert.match(msg.text,/GMT\+7/);assert.match(msg.html,/&lt;img/);assert.doesNotMatch(msg.html,/<img/);assert.doesNotMatch(msg.text,/Năm sinh|Nghề nghiệp|Thu nhập|Khu vực|dummy-test-only/);assert.equal(msg.to,smtp.LEAD_RECEIVER_EMAIL)});
test('SMTP accepted recipient required; safe log omits credentials and lead content',async()=>{
 const logs=[],oldInfo=console.info,oldError=console.error;console.info=x=>logs.push(x);console.error=x=>logs.push(x);
 try{let message;await emailSender(smtp,settings=>{assert.equal(settings.logger,false);return {sendMail:async m=>{message=m;return {accepted:[smtp.LEAD_RECEIVER_EMAIL]}},close(){}}})(lead);assert.ok(message.html&&message.text);await assert.rejects(emailSender(smtp,()=>({sendMail:async()=>{throw Object.assign(new Error(smtp.SMTP_APP_PASSWORD),{code:'EAUTH'})}}))(lead));assert.doesNotMatch(logs.join('\n'),/dummy-test-only|0900000000|Khách Kiểm Thử/);assert.match(logs.join('\n'),/EAUTH/)}finally{console.info=oldInfo;console.error=oldError}
});
test('public assets and config response never contain SMTP environment values',async()=>{const r=await worker.fetch(new Request('https://test.local/api/config'),{...env,...smtp});const raw=await r.text();assert.doesNotMatch(raw,/SMTP_|dummy-test-only/);for(const file of ['../netlify-dist/app.js','../netlify-dist/index.html'])assert.doesNotMatch(await readFile(new URL(file,import.meta.url),'utf8'),/SMTP_APP_PASSWORD|dummy-test-only/)});
