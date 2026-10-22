'use strict';
(() => {
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 const format = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
 let runtime = {mode:'demo',GTM_ID:'',GA_ID:'',META_PIXEL_ID:'',partners:[]};
 let analyticsEnabled=false, analyticsInitialized=false, amount=Number($('.amount-range')?.value || 0),step=1,submitting=false,opener=null;
 let startedAt=Date.now(),requestId=crypto.randomUUID();
 const dialog=$('#lead-dialog'), form=$('#lead-form');
 const eventNames=new Set(['hero_cta_click','amount_changed','form_started','form_step_completed','form_submit','lead_success','partner_offer_view','partner_redirect','faq_open','final_cta_click']);
 // Only these non-personal values may leave the page through analytics.
 function track(event,details={}){
  if(!analyticsEnabled || !eventNames.has(event))return;
  const safe={event};
  for(const key of ['amount','step','faq_index','partner_index'])if(Number.isFinite(details[key]))safe[key]=details[key];
  if(['demo','live'].includes(details.mode))safe.mode=details.mode;
  window.dataLayer=window.dataLayer||[];window.dataLayer.push(safe);
  if(window.gtag && !runtime.GTM_ID)window.gtag('event',event,Object.fromEntries(Object.entries(safe).filter(([k])=>k!=='event')));
  if(window.fbq)window.fbq('trackCustom',event,Object.fromEntries(Object.entries(safe).filter(([k])=>k!=='event')));
 }
 function stored(key,session=false){try{return (session?sessionStorage:localStorage).getItem(key)}catch{return null}}
 function save(key,value,session=false){try{(session?sessionStorage:localStorage).setItem(key,value)}catch{/* The site works with storage disabled. */}}
 function loadScript(src,id){if(document.getElementById(id))return;const script=document.createElement('script');script.id=id;script.async=true;script.src=src;document.head.appendChild(script)}
 function enableAnalytics(){
  analyticsEnabled=true;
  if(analyticsInitialized)return;
  analyticsInitialized=true;
  window.dataLayer=window.dataLayer||[];
  if(/^GTM-[A-Z0-9]+$/.test(runtime.GTM_ID)){
   window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
   loadScript('https://www.googletagmanager.com/gtm.js?id='+runtime.GTM_ID,'gtm-loader');
  }else if(/^G-[A-Z0-9]+$/.test(runtime.GA_ID)){
   window.gtag=function(){window.dataLayer.push(arguments)};
   window.gtag('js',new Date());window.gtag('config',runtime.GA_ID,{send_page_view:true});
   loadScript('https://www.googletagmanager.com/gtag/js?id='+runtime.GA_ID,'ga-loader');
  }
  if(/^\d+$/.test(runtime.META_PIXEL_ID)){
   const fb=function(){fb.callMethod?fb.callMethod.apply(fb,arguments):fb.queue.push(arguments)};fb.queue=[];fb.loaded=true;fb.version='2.0';window.fbq=fb;
   fb('init',runtime.META_PIXEL_ID);fb('track','PageView');loadScript('https://connect.facebook.net/en_US/fbevents.js','meta-loader');
  }
 }
 function applyRuntime(){
  if(runtime.mode==='live'){
   $('.demo-notice').hidden=true;
   $('#consent-note').textContent=runtime.consentNotice;
   if(!runtime.consentNotice){$('#continue').disabled=true;$('#submit-error').textContent='Thông tin xử lý dữ liệu chưa được cấu hình. Vui lòng quay lại sau.'}
  }
  if(stored('htvv-cookie')==='all')enableAnalytics();
 }
 const runtimeReady=fetch('/api/config').then(r=>{if(!r.ok)throw new Error();return r.json()}).then(data=>{runtime=data;applyRuntime()}).catch(()=>{runtime.mode='unavailable';$('.demo-notice').hidden=true;$('#submit-error').textContent='Chưa thể kiểm tra trạng thái dịch vụ. Vui lòng tải lại trang.'});
 $$('.amount-range').forEach(range=>{
  const sync=()=>{const pct=(Number(range.value)-Number(range.min))/(Number(range.max)-Number(range.min))*100;range.style.setProperty('--percent',pct+'%');range.setAttribute('aria-valuetext',format(Number(range.value)))};
  sync();range.addEventListener('input',()=>{amount=Number(range.value);$$('[data-amount]').forEach(el=>el.textContent=format(amount));$$('.amount-range').forEach(other=>{other.value=amount;other.style.setProperty('--percent',(amount-Number(other.min))/(Number(other.max)-Number(other.min))*100+'%');other.setAttribute('aria-valuetext',format(amount))})});
  range.addEventListener('change',()=>track('amount_changed',{amount}));
 });
 const names=['Nhu cầu của bạn','Thông tin cơ bản','Kế hoạch của bạn','Kiểm tra & đồng ý'];
 const titles=['Bạn đang cần bao nhiêu?','Làm quen một chút nhé.','Bạn dùng cho kế hoạch nào?','Bạn đã sẵn sàng?'];
 function showStep(n,focus=true){
  step=n;$$('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==step);
  $('#step-name').textContent=names[n-1];$('#step-count').textContent=n+' / 4';$('#form-progress').style.width=(n/4*100)+'%';$('#form-title').textContent=titles[n-1];
  $('#previous').hidden=n===1;$('#continue').innerHTML=(n===4?(runtime.mode==='live'?'Gửi thông tin':'Hoàn tất trải nghiệm'):'Tiếp tục')+' <span aria-hidden="true">→</span>';
  $('#purpose-summary').textContent=$('input[name="purpose"]:checked').parentElement.textContent.trim();
  $('#submit-error').textContent='';
  if(focus){$('#form-title').focus({preventScroll:true});dialog.scrollTop=0}
 }
 function openForm(button){
  opener=button;
  if(button.dataset.purpose){const input=$('input[name="purpose"][value="'+button.dataset.purpose+'"]');if(input)input.checked=true}
  else if(button.dataset.purpose==='0')$('input[name="purpose"][value="0"]').checked=true;
  if(button.dataset.cta==='hero')track('hero_cta_click',{amount});
  if(button.dataset.cta==='final')track('final_cta_click',{amount});
  $('.menu-toggle').setAttribute('aria-expanded','false');$('#navigation').classList.remove('open');
  dialog.showModal();document.body.classList.add('modal-open');updateSticky();showStep(step);
  track('form_started',{amount,mode:runtime.mode});
 }
 $$('[data-cta]').forEach(button=>button.addEventListener('click',()=>openForm(button)));
 function closeForm(){if(submitting)return;dialog.close();document.body.classList.remove('modal-open');updateSticky();opener?.focus({preventScroll:true})}
 $('.close-dialog').addEventListener('click',closeForm);
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeForm()});
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog && (event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))closeForm()});
 // Native dialog provides keyboard focus trapping, Escape handling and inert background.
 const validators={
  fullName:()=>{const v=form.elements.fullName.value.trim();return v.length>=2&&v.length<=100&&/^[\p{L}\p{M}\s.'’-]+$/u.test(v)?'':'Vui lòng nhập họ tên hợp lệ, ít nhất 2 ký tự.'},
  phone:()=>/^0[35789]\d{8}$/.test(form.elements.phone.value.replace(/[\s().-]/g,'').replace(/^\+84/,'0'))?'':'Nhập số điện thoại Việt Nam hợp lệ (10 chữ số).',
  email:()=>!form.elements.email.value.trim()||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim())?'':'Vui lòng kiểm tra lại địa chỉ email.',
  consent:()=>form.elements.consent.checked?'':'Bạn cần đọc và đồng ý với chính sách trước khi tiếp tục.'
 };
 const errorIds={fullName:'name-error',phone:'phone-error',email:'email-error',consent:'consent-error'};
 function validate(name){const error=validators[name]();const input=form.elements[name];$('#'+errorIds[name]).textContent=error;input.setAttribute('aria-invalid',String(!!error));input.dataset.touched='true';return !error}
 for(const name of Object.keys(validators)){const input=form.elements[name];input.addEventListener('blur',()=>validate(name));input.addEventListener('input',()=>{if(input.dataset.touched)validate(name)})}
 $('#previous').addEventListener('click',()=>showStep(Math.max(1,step-1)));
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(submitting)return;
  if(step===2){const checks=['fullName','phone','email'].map(validate);if(checks.includes(false)){form.elements[['fullName','phone','email'][checks.indexOf(false)]].focus();return}}
  if(step<4){track('form_step_completed',{step,amount});showStep(step+1);return}
  if(!validate('consent')){form.elements.consent.focus();return}
  await runtimeReady;
  if(runtime.mode==='unavailable'){ $('#submit-error').textContent='Chưa thể kết nối dịch vụ. Thông tin vẫn được giữ trong biểu mẫu. Vui lòng thử lại.';return}
  submitting=true;$('#continue').disabled=true;$('#previous').disabled=true;$('.close-dialog').disabled=true;$('#continue').textContent='Đang xử lý…';$('#submit-error').textContent='';
  track('form_step_completed',{step:4,amount});track('form_submit',{step:4,amount,mode:runtime.mode});
  const payload={amount,purpose:Number(form.elements.purpose.value),consent:form.elements.consent.checked,website:form.elements.website.value,startedAt,requestId};
  // Demo deliberately excludes every personally identifying input from the request.
  if(runtime.mode==='live')Object.assign(payload,{fullName:form.elements.fullName.value.trim(),phone:form.elements.phone.value.replace(/[\s().-]/g,'').replace(/^\+84/,'0'),email:form.elements.email.value.trim()});
  try{
   const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(18000)});
   const result=await response.json();if(!response.ok||!result.accepted)throw new Error(result.message||'Không thể gửi thông tin lúc này. Vui lòng thử lại.');
   const receipt={demo:result.demo,id:result.id,at:Date.now()};save('htvv-receipt',JSON.stringify(receipt),true);
   track('lead_success',{amount,mode:runtime.mode});window.location.assign('/cam-on');
  }catch(error){$('#submit-error').textContent=error.name==='TimeoutError'?'Kết nối đang chậm. Thông tin vẫn được giữ; vui lòng thử lại.':(error.message==='Failed to fetch'?'Mất kết nối. Thông tin vẫn được giữ; vui lòng thử lại.':error.message)}
  finally{submitting=false;$('#continue').disabled=false;$('#previous').disabled=false;$('.close-dialog').disabled=false;$('#continue').textContent=runtime.mode==='live'?'Gửi thông tin':'Hoàn tất trải nghiệm'}
 });
 $('.menu-toggle').addEventListener('click',event=>{const expanded=event.currentTarget.getAttribute('aria-expanded')!=='true';event.currentTarget.setAttribute('aria-expanded',String(expanded));$('#navigation').classList.toggle('open',expanded)});
 $$('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}});
 $$('[data-faq]').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)track('faq_open',{faq_index:Number(detail.dataset.faq)})}));
 let heroVisible=true,footerVisible=false;
 function updateSticky(){const bar=$('.sticky-mobile');bar.hidden=heroVisible||footerVisible||dialog.open||!$('#de-xuat')}
 if('IntersectionObserver' in window){
  const hero=$('#de-xuat');if(hero)new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;updateSticky()},{threshold:0}).observe(hero);
  new IntersectionObserver(entries=>{footerVisible=entries[0].isIntersecting;updateSticky()},{threshold:0}).observe($('.footer'));
 }
 const banner=$('#cookie-banner');
 if(!stored('htvv-cookie'))banner.hidden=false;
 $$('[data-cookie-settings]').forEach(el=>el.addEventListener('click',()=>{banner.hidden=false}));
 $$('[data-cookie]').forEach(button=>button.addEventListener('click',()=>{
  const choice=button.dataset.cookie,wasEnabled=analyticsEnabled;save('htvv-cookie',choice);banner.hidden=true;
  if(choice==='all')enableAnalytics();else {analyticsEnabled=false;if(wasEnabled){for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)){const hosts=[location.hostname,'.'+location.hostname];document.cookie=name+'=; Max-Age=0; path=/';for(const domain of hosts)document.cookie=name+'=; Max-Age=0; path=/; domain='+domain}}window.location.reload()}}
 }));
 if(location.pathname==='/cam-on'){
  let receipt;try{receipt=JSON.parse(stored('htvv-receipt',true))}catch{}
  if(receipt&&Date.now()-receipt.at<30*60*1000){
   $('#receipt-title').textContent=receipt.demo?'Bạn đã hoàn tất trải nghiệm':'Đã nhận thông tin của bạn';
   $('#receipt-message').textContent=receipt.demo?'Bạn vừa đi qua quy trình tìm đề xuất của Hỗ Trợ Vay Vốn. Không có hồ sơ thật được gửi.':'Chúng tôi đang xác định các đề xuất phù hợp với nhu cầu bạn cung cấp.';
   $('#receipt-detail').hidden=false;$('#receipt-detail').textContent=receipt.demo?'Bản trải nghiệm chưa kết nối đối tác. Chúng tôi không lưu hoặc chuyển họ tên, số điện thoại và email bạn đã nhập.':'Mã ghi nhận: '+receipt.id+'. Việc gửi thông tin không đồng nghĩa với việc khoản vay được phê duyệt.';
   runtimeReady.then(()=>{if(!receipt.demo)renderPartners(runtime.partners)})
  }else{$('#receipt-title').textContent='Bắt đầu từ nhu cầu của bạn';$('#receipt-message').textContent='Bạn chưa có yêu cầu được ghi nhận trong phiên này. Về trang chủ để bắt đầu.'}
 }
 function renderPartners(partners){
  const root=$('#partner-offers');if(!partners?.length){const p=document.createElement('p');p.textContent='Chưa có đề xuất để hiển thị. Bạn chưa được phê duyệt khoản vay.';root.append(p);return}
  partners.forEach((partner,index)=>{let url;try{url=new URL(partner.url);if(url.protocol!=='https:')return}catch{return}
   const card=document.createElement('article');card.className='partner-card';const h=document.createElement('h2');h.textContent=partner.name;const p=document.createElement('p');p.textContent=partner.description;const a=document.createElement('a');a.className='button';a.textContent='Xem chi tiết tại đối tác →';a.href=url.href;a.rel='noopener noreferrer';a.addEventListener('click',event=>{if(!confirm('Bạn đang được chuyển sang website của đối tác để xem chi tiết và tiếp tục đăng ký. Bạn có muốn tiếp tục?')){event.preventDefault();return}track('partner_redirect',{partner_index:index})});card.append(h,p,a);root.append(card);track('partner_offer_view',{partner_index:index})
  })
 }
})();
