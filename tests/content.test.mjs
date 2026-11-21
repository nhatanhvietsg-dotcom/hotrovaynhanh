import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderPage} from '../src/pages.js';
import {siteContent} from '../src/content.js';
import {applyContent,validImagePath,previewHTML,readSettings} from '../public/admin/content-tools.js';
test('edited text is escaped, all matches update, and FAQ JSON-LD remains valid',()=>{
 const text=siteContent.groups.flatMap(g=>g.items).find(i=>i.original.includes('Gửi biểu mẫu xong'));
 const value='Câu hỏi <script>alert("x")</script>';
 const doc={groups:[{items:[{...text,value}]}],images:[]};const html=renderPage('/',doc);
 assert.ok(html.includes('Câu hỏi &lt;script&gt;'));
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(match[1]));
 assert.ok(html.includes('\\u003cscript>'));assert.equal((html.match(/<script>alert/g)||[]).length,0);
});
test('uploaded images retain layout attributes and unsafe image locations are rejected',()=>{
 const doc={images:[{original:'/assets/design-hero.webp',image:'/uploads/anh-moi.webp',alt:'Ảnh "mới" <x>'}]};
 const html=renderPage('/',doc);assert.ok(html.includes('src="/uploads/anh-moi.webp"'));assert.ok(html.includes('width="1400" height="934"'));assert.ok(html.includes('Ảnh &quot;mới&quot; &lt;x&gt;'));
 for(const value of ['javascript:alert(1)','https://evil.test/x.png','/uploads/../secret.png','/uploads/%2e%2e/secret.png','/uploads/%zz.png','/uploads/x.svg'])assert.equal(validImagePath(value),false,value);
 assert.equal(validImagePath('/uploads/ảnh-mới.jpg'),true);
});
test('preview uses editable baseline after earlier publications, disables scripts/forms and keeps same-origin resources',()=>{
 const original=siteContent.groups[0].items[0];const html=previewHTML(renderPage('/',{groups:[],images:[]}),{groups:[{items:[{...original,value:'Lần sửa tiếp theo'}]}]},siteContent.settings,'https://hotrovaynhanh.com');
 assert.ok(html.includes('Lần sửa tiếp theo'));assert.doesNotMatch(html,/<script\b/);assert.match(html,/<form inert/);assert.match(html,/form-action &#39;none&#39;/);assert.ok(html.includes('href="https://hotrovaynhanh.com/styles.css"'));
});
test('public contact settings reject markup and invalid phone/email',()=>{
 const s=readSettings({settings:{hotline:'javascript:1',email:'a"@x.com',operatorName:'<img src=x>Người quản trị'}});assert.equal(s.hotline,undefined);assert.equal(s.email,undefined);assert.doesNotMatch(s.operatorName,/[<>"]/);
});
