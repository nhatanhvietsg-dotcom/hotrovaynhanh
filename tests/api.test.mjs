import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {config} from '../src/config.js';
const built=await readFile(new URL('../dist/server/index.js',import.meta.url),'utf8');
const moduleOf=async source=>(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
const worker=await moduleOf(built);
function req(body,options={}){return new Request('https://test.local/api/leads',{method:'POST',headers:{origin:'https://test.local','content-type':'application/json','cf-connecting-ip':crypto.randomUUID(),...options.headers},body:JSON.stringify(body)})}
const payload=()=>({amount:config.defaultAmount,purpose:0,consent:true,website:'',startedAt:Date.now()-10000,requestId:crypto.randomUUID()});
test('all public routes respond, have a single H1, correct language and canonical',async()=>{
 for(const path of ['/','/dieu-khoan-su-dung','/chinh-sach-bao-mat','/cookie-policy','/thong-tin-quan-trong','/lien-he','/gioi-thieu','/cam-on']){const res=await worker.fetch(new Request('https://test.local'+path));assert.equal(res.status,200);const html=await res.text();assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/<html lang="vi">/);assert.match(html,/<link rel="canonical"/);assert.equal(res.headers.get('x-robots-tag'),'noindex, nofollow')}
 assert.equal((await worker.fetch(new Request('https://test.local/does-not-exist'))).status,404);
});
test('preview accepts non-personal metadata and accurately labels demo',async()=>{const res=await worker.fetch(req(payload()));const data=await res.json();assert.equal(res.status,200);assert.equal(data.accepted,true);assert.equal(data.demo,true)});
test('preview refuses accidental personally identifying fields',async()=>{assert.equal((await worker.fetch(req({...payload(),phone:'0900000000'}))).status,400)});
test('invalid amount, purpose, consent, timing and spam are rejected',async()=>{for(const patch of [{amount:0},{amount:510000},{amount:31000000},{purpose:99},{consent:false},{startedAt:Date.now()},{website:'spam.test'}])assert.equal((await worker.fetch(req({...payload(),...patch}))).status,400)});
test('cross-origin and oversized or wrong content type requests are rejected',async()=>{assert.equal((await worker.fetch(req(payload(),{headers:{origin:'https://other.local'}}))).status,403);assert.equal((await worker.fetch(req(payload(),{headers:{'content-type':'text/plain'}}))).status,415);assert.equal((await worker.fetch(req({...payload(),extra:'a'.repeat(6000)}))).status,400)});
test('per-isolate rate limit rejects seventh request within a minute',async()=>{const headers={'cf-connecting-ip':'limited-ip'};for(let i=0;i<6;i++)assert.equal((await worker.fetch(req(payload(),{headers}))).status,200);assert.equal((await worker.fetch(req(payload(),{headers}))).status,429)});
test('live mode remains gated by approved legal configuration',async()=>{const response=await worker.fetch(new Request('https://test.local/api/config'),{LEAD_MODE:'live',CONSENT_NOTICE:'notice',LEAD_WEBHOOK_URL:'https://example.test'});assert.equal((await response.json()).mode,'demo')});
test('live service validates on server, sends idempotency key, handles upstream failure',async()=>{
 const source='const CONFIG='+JSON.stringify({...config,legalApproved:true})+';const ASSETS={};\n'+await readFile(new URL('../worker/index.js',import.meta.url),'utf8');
 const live=await moduleOf(source),env={LEAD_MODE:'live',CONSENT_NOTICE:'Approved data flow',CONSENT_VERSION:'1',LEAD_WEBHOOK_URL:'https://receiver.test/leads',LEAD_WEBHOOK_TOKEN:'test-only'};
 const data={...payload(),fullName:'Người Dùng Thử',phone:'0900000000',email:''};
 assert.equal((await live.fetch(req({...data,phone:'123'}),env)).status,400);
 assert.equal((await live.fetch(req(data),{...env,LEAD_WEBHOOK_URL:''})).status,503);
 const original=globalThis.fetch;
 try{
 globalThis.fetch=async(url,opts)=>{assert.equal(url,env.LEAD_WEBHOOK_URL);assert.equal(opts.headers['idempotency-key'],data.requestId);assert.equal(opts.headers.authorization,'Bearer test-only');const body=JSON.parse(opts.body);assert.equal(body.consentVersion,'1');return Response.json({accepted:true,id:'lead_test_1'})};
 let response=await live.fetch(req(data),env);assert.equal(response.status,200);assert.equal((await response.json()).demo,false);
 globalThis.fetch=async()=>Response.json({accepted:false},{status:503});assert.equal((await live.fetch(req(data),env)).status,502);
 }finally{globalThis.fetch=original}
});
