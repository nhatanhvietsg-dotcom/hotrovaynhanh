export function calculateLoan({amount,months,annualRate,fees,netReceived,method}){
 if(!Number.isFinite(amount)||amount<=0||!Number.isInteger(months)||months<3||months>57||!Number.isFinite(annualRate)||annualRate<0||annualRate>100||!Number.isFinite(fees)||fees<0||!Number.isFinite(netReceived)||netReceived<=0||netReceived>amount||!['flat','annuity'].includes(method))throw new Error('Vui lòng kiểm tra số tiền, kỳ hạn, lãi suất, phí và tiền thực nhận.');
 const deducted=amount-netReceived;
 if(deducted>fees)throw new Error('Khoản khấu trừ vượt tổng phí đã nhập. Vui lòng đối chiếu lại phí và tiền thực nhận.');
 const r=annualRate/1200;
 const payment=method==='flat'?amount/months+amount*r:r===0?amount/months:amount*r/(-Math.expm1(-months*Math.log1p(r)));
 const interest=Math.max(0,payment*months-amount);
 const result={payment,interest,fees,netReceived,deducted,cost:interest+fees,total:payment*months+fees-deducted};
 if(!Object.values(result).every(Number.isFinite))throw new Error('Thông số vượt phạm vi tính toán.');
 return result;
}

if(typeof document!=='undefined'){
 const form=document.getElementById('loan-calculator');
 if(form){
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>document.body.classList.toggle('loan-tool-visible',entries[0].isIntersecting)).observe(form);
  const $=id=>document.getElementById(id),money=n=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:0}).format(n)+'đ';
  const inputs={amount:$('estimate-amount'),months:$('estimate-months'),annualRate:$('estimate-rate'),fees:$('estimate-fees'),netReceived:$('estimate-net'),method:$('estimate-method')};
  const outputs={payment:'estimate-payment',interest:'estimate-interest',fees:'estimate-result-fees',netReceived:'estimate-result-net',deducted:'estimate-deducted',cost:'estimate-cost',total:'estimate-total'};
  function clear(){Object.values(outputs).forEach(id=>$(id).textContent=id==='estimate-payment'?'Nhập thông số để tính':'—')}
  function update(showErrors=false){
   const missing=Object.entries(inputs).find(([key,input])=>key!=='method'&&input.value.trim()==='');
   $('estimate-error').textContent='';
   if(missing){clear();if(showErrors){$('estimate-error').textContent='Nhập đầy đủ lãi suất, phí, bảo hiểm và số tiền thực nhận để tính tổng chi phí.';missing[1].focus()}return;}
   try{
    if(!inputs.amount.checkValidity()||!inputs.months.checkValidity())throw new Error('Số tiền hoặc kỳ hạn nằm ngoài phạm vi điều chỉnh của công cụ.');
    const values=Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,key==='method'?input.value:Number(input.value)]));
    const result=calculateLoan(values);for(const [key,id] of Object.entries(outputs))$(id).textContent=money(result[key]);
   }catch(error){clear();$('estimate-error').textContent=error.message;}
  }
  for(const input of Object.values(inputs))input.addEventListener('input',()=>{
   for(const key of ['amount','months'])if(inputs[key].checkValidity())$('estimate-'+key+'-range').value=inputs[key].value;
   update();
  });
  for(const key of ['amount','months'])$('estimate-'+key+'-range').addEventListener('input',event=>{inputs[key].value=event.target.value;update()});
  form.addEventListener('submit',event=>{event.preventDefault();update(true)});
 }
}
