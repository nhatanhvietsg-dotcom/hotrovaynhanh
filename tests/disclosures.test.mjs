import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderPage,legalPages} from '../src/pages.js';

test('landing page exposes service scope, fees and operator outside collapsed content',()=>{
 const html=renderPage('/');
 const disclosure=html.match(/<section class="section service-disclosure"[\s\S]*?<\/section>/)?.[0];
 assert.ok(disclosure);
 assert.doesNotMatch(disclosure,/<details|\bhidden\b|role="tab/);
 for(const text of ['Website không thu phí tiếp nhận yêu cầu tư vấn.','Khoản vay có thể phát sinh lãi và phí','chưa nhận hồ sơ vay cho một sản phẩm cụ thể','Trần Thị Yến Nhi','0938443655','thienhuongnguyen1010@gmail.com'])assert.ok(disclosure.includes(text),text);
 assert.match(html,/<h1>Gửi nhu cầu tìm hiểu<br> <em>khoản vay cá nhân<\/em><\/h1>/);
 assert.match(html,/<div class="demo-notice" hidden>/);
 const consent=html.match(/<input[^>]+id="consent"[^>]*>/)?.[0];
 assert.ok(consent);assert.doesNotMatch(consent,/\bchecked\b/);
});

test('all routes use consultation copy without obsolete offers or simulated-consent claims',()=>{
 for(const route of ['/','/gioi-thieu','/cam-on',...Object.keys(legalPages)]){
  const html=renderPage(route);
  assert.doesNotMatch(html,/Nhận đề xuất phù hợp|Nhận đề xuất ngay|Chỉ vài phút là xong|Tôi đáp ứng điều kiện|Hoàn toàn miễn phí|Chỉ mô phỏng sự đồng ý|Dữ liệu cá nhân không được gửi hoặc lưu/,route);
  assert.ok(html.includes('Trần Thị Yến Nhi'),route);
 }
});
