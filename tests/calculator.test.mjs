import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateLoan} from '../public/loan-calculator.js';
import {renderPage} from '../src/pages.js';

const base={amount:40000000,months:24,annualRate:20.22,fees:1000000,netReceived:40000000,method:'flat'};
test('loan simulation distinguishes full proceeds from withheld fees without double counting',()=>{
 const upfront=calculateLoan({...base,netReceived:39000000});
 const later=calculateLoan(base);
 assert.equal(Math.round(upfront.payment),2340667);
 assert.equal(Math.round(upfront.interest),16176000);
 assert.equal(Math.round(upfront.cost),17176000);
 assert.equal(Math.round(upfront.total),56176000);
 assert.equal(Math.round(later.total),57176000);
 assert.equal(Math.round(upfront.total-upfront.netReceived),Math.round(upfront.cost));
 assert.equal(Math.round(later.total-later.netReceived),Math.round(later.cost));
});
test('loan simulation handles zero interest, annuity payments and invalid cash flows',()=>{
 for(const method of ['flat','annuity']){
  const zero=calculateLoan({...base,annualRate:0,method});
  assert.equal(zero.interest,0);assert.equal(Math.round(zero.payment),1666667);
 }
 assert.equal(Math.round(calculateLoan({...base,annualRate:12,method:'annuity'}).payment),1882939);
 for(const change of [{fees:undefined},{netReceived:undefined},{months:0},{annualRate:NaN},{fees:-1},{netReceived:41000000},{fees:0,netReceived:39000000}])assert.throws(()=>calculateLoan({...base,...change}));
});
test('homepage includes usable calculator without unsupported bank claims or preset loan rate',()=>{
 const html=renderPage('/');
 assert.ok(html.includes('9 thẻ thông tin từ mẫu tham khảo'));
 assert.ok(html.includes('Nguồn tham khảo độc lập.'));
 assert.ok(html.includes('không phải APR tối đa đã được xác nhận'));
 assert.equal((html.match(/class="bank-reference-card"/g)||[]).length,9);
 assert.match(html,/<form id="loan-calculator" novalidate>/);
 assert.match(html,/<script type="module" src="\/loan-calculator.js"><\/script>/);
 assert.doesNotMatch(html,/hợp tác hơn 30|20,22|20\.22/);
 for(const id of ['estimate-rate','estimate-fees','estimate-net'])assert.doesNotMatch(html.match(new RegExp('<input id="'+id+'"[^>]+>'))[0],/value=/);
 assert.ok(html.indexOf('id="loan-guide-title"')<html.indexOf('id="loan-calculator"'));
 assert.match(html,/<button type="button"[^>]+data-cta="loan-calculator"/);
});
