const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({headless:true});const context=await browser.newContext();const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await fs.mkdir('artifacts',{recursive:true});
 await page.goto('http://127.0.0.1:4173');await page.evaluate(()=>document.fonts.ready);
 await page.locator('[data-cookie="necessary"]').click();
 for(const width of [360,375,390,430,768,1024,1280,1440]){
  await page.setViewportSize({width,height:900});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}`);
  await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:width===1440||width===390});
  console.log(`Responsive ${width}px: no overflow`);
 }
 assert.equal(await page.locator('h1').count(),1);
 const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[]);
 const hrefs=await page.locator('a[href^="/"]').evaluateAll(a=>[...new Set(a.map(el=>el.getAttribute('href').split('#')[0]).filter(Boolean))]);
 for(const href of hrefs){const response=await context.request.get('http://127.0.0.1:4173'+href);assert.equal(response.status(),200,href)}
 await page.setViewportSize({width:390,height:844});
 await page.locator('#hero-amount').fill('10000000');await page.locator('#hero-amount').dispatchEvent('input');
 assert.equal(await page.locator('.hero [data-amount]').textContent(),'10.000.000đ');
 await page.locator('[data-cta="hero"]').click();assert(await page.locator('#lead-dialog').isVisible());
 assert.equal(await page.locator('#form-amount').inputValue(),'10000000');
 await page.locator('#continue').click();await page.locator('#continue').click();assert(await page.locator('#name-error').isVisible());
 await page.locator('#full-name').fill('Người Dùng Thử');await page.locator('#phone').fill('123');await page.locator('#continue').click();assert.match(await page.locator('#phone-error').textContent(),/hợp lệ/);
 await page.locator('#phone').fill('0900000000');await page.locator('#email').fill('wrong');await page.locator('#continue').click();assert.match(await page.locator('#email-error').textContent(),/email/);
 await page.locator('#email').fill('');await page.locator('#continue').click();await page.locator('input[name="purpose"][value="3"]').check();
 await page.locator('#previous').click();assert.equal(await page.locator('#full-name').inputValue(),'Người Dùng Thử');await page.locator('#continue').click();await page.locator('#continue').click();
 assert.match(await page.locator('#purpose-summary').textContent(),/Đầu tư/);await page.locator('#continue').click();assert(await page.locator('#consent-error').isVisible());
 await page.locator('#consent').check();
 // First inject an API outage: same step and all values must survive.
 await page.route('**/api/leads',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Thử nghiệm lỗi kết nối.'})}));
 await page.locator('#continue').click();await page.locator('#submit-error').waitFor({state:'visible'});assert.equal(await page.locator('#full-name').inputValue(),'Người Dùng Thử');assert(await page.locator('#consent').isChecked());
 await page.screenshot({path:'artifacts/form-error.png'});await page.unroute('**/api/leads');
 const sentPromise=page.waitForRequest('**/api/leads');await page.locator('#continue').click();const sent=JSON.parse((await sentPromise).postData());assert(!('fullName' in sent));assert(!('phone' in sent));assert(!('email' in sent));
 await page.waitForURL('**/cam-on');assert.match(await page.locator('#receipt-title').textContent(),/trải nghiệm/);await page.screenshot({path:'artifacts/thank-you.png',fullPage:true});
 await page.goto('http://127.0.0.1:4173');await page.locator('details').first().locator('summary').click();assert(await page.locator('details').first().getAttribute('open')!==null);
 await page.locator('#benefits').scrollIntoViewIfNeeded();await page.waitForTimeout(300);assert(await page.locator('.sticky-mobile').isVisible());
 await page.locator('.sticky-mobile button').click();assert(await page.locator('.sticky-mobile').isHidden());
 await page.keyboard.press('Escape');assert(await page.locator('#lead-dialog').isHidden());
 await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 await page.locator('.footer').scrollIntoViewIfNeeded();await page.waitForTimeout(300);assert(await page.locator('.sticky-mobile').isHidden());
 assert.deepEqual(errors,[]);console.log('CTA, slider, validation, back, consent, API error, retry, demo success, FAQ, mobile sticky, menu, legal links and console: PASS');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
