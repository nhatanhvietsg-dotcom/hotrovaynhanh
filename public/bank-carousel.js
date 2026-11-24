(()=>{
 const track=document.getElementById('bank-reference-track');if(!track)return;
 const cards=[...track.children],dots=[...document.querySelectorAll('[data-bank-index]')];
 const prev=document.querySelector('[data-bank-prev]'),next=document.querySelector('[data-bank-next]'),position=document.getElementById('bank-card-position');
 function step(){return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth}
 function update(){const count=Math.max(1,Math.round(track.clientWidth/step()));const index=Math.min(cards.length-1,Math.max(0,Math.round(track.scrollLeft/step())));const maxIndex=Math.ceil((track.scrollWidth-track.clientWidth)/step());dots.forEach((dot,i)=>{dot.setAttribute('aria-current',String(i===index));dot.hidden=i>maxIndex});position.textContent='Thẻ '+(index+1)+(count>1?'–'+Math.min(cards.length,index+count):'')+' / '+cards.length;prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}
 function go(index){const motion=matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';track.scrollTo({left:Math.max(0,Math.min(cards.length-1,index))*step(),behavior:motion});}
 prev.addEventListener('click',()=>go(Math.round(track.scrollLeft/step())-1));next.addEventListener('click',()=>go(Math.round(track.scrollLeft/step())+1));dots.forEach(dot=>dot.addEventListener('click',()=>go(Number(dot.dataset.bankIndex))));
 track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(Math.round(track.scrollLeft/step())+(event.key==='ArrowRight'?1:-1))}});
 if('ResizeObserver' in window)new ResizeObserver(update).observe(track);update();
})();
