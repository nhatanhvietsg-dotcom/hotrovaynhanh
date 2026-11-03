import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {config} from '../src/config.js';
import {legalPages,renderPage} from '../src/pages.js';
test('published policies disclose contact details and no longer carry draft or noindex labels',()=>{
 for(const path of Object.keys(legalPages)) {
  const html=renderPage(path);
  for(const value of [config.operatorName,config.address,config.hotline,config.email,config.policyEffectiveDate,'tel:+84938443655','mailto:'+config.email])assert.ok(html.includes(value),path+' '+value);
  assert.doesNotMatch(html,/Khung dự thảo|chưa phải văn bản pháp lý chính thức|\[ĐỊA CHỈ\]|\[EMAIL\]|name="robots" content="noindex/);
 }
 assert.match(renderPage('/cam-on'),/name="robots" content="noindex/);
});
test('publication opens crawling while receipt and APIs remain excluded',async()=>{
 const base=new URL('../netlify-dist/',import.meta.url),headers=await readFile(new URL('_headers',base),'utf8'),robots=await readFile(new URL('robots.txt',base),'utf8'),sitemap=await readFile(new URL('sitemap.xml',base),'utf8');
 const global=headers.split('\n/api/*')[0];assert.doesNotMatch(global,/X-Robots-Tag/);
 assert.match(headers,/\/cam-on\/\*\n  X-Robots-Tag: noindex/);assert.match(headers,/\/api\/\*\n  X-Robots-Tag: noindex/);
 assert.doesNotMatch(robots,/Disallow:\s*\/\s*$/m);assert.match(robots,/Disallow: \/cam-on/);assert.match(sitemap,/https:\/\/hotrovaynhanh.com\/lien-he/);
 assert.equal(config.legalApproved,false,'publishing website policies must not activate legacy partner transfers');
});
