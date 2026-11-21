// Shared by the static renderer and the sandboxed CMS preview. Text edits never become HTML.
export const escapeHTML=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const decode=value=>String(value).replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'");
export function contentMap(document){return new Map((document?.groups||[]).flatMap(group=>(group.items||[]).filter(item=>typeof item.original==='string'&&typeof item.value==='string'&&item.value.length<=20000).map(item=>[item.original,item.value])))}
export function validImagePath(value,preview=false){try{return typeof value==='string'&&((preview&&/^blob:https?:\/\//.test(value))||(/^\/(assets|uploads)\/[\p{L}\p{N}_./% -]+\.(png|jpe?g|webp|gif|avif)$/iu.test(value)&&!decodeURIComponent(value).split('/').includes('..')))}catch{return false}}
export function applyContent(html,document,{preview=false}={}){
 const map=contentMap(document), images=new Map((document?.images||[]).filter(item=>validImagePath(item.image,preview)).map(item=>[item.original,item]));
 function updateJSON(value){if(typeof value==='string')return map.get(value)??value;if(Array.isArray(value))return value.map(updateJSON);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,updateJSON(v)]));return value}
 return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>|[^<]+/g,token=>{
  if(token.startsWith('<script')){if(token.includes('application/ld+json')){try{return '<script type="application/ld+json">'+JSON.stringify(updateJSON(JSON.parse(token.replace(/^<script[^>]*>/,'').replace(/<\/script>$/,'')))).replaceAll('<','\\u003c')+'</script>'}catch{return token}}return token}
  if(token.startsWith('<img')){const src=token.match(/\bsrc="([^"]+)"/)?.[1],item=images.get(src);if(!item)return token;let next=token.replace(/\bsrc="[^"]*"/,'src="'+escapeHTML(item.image)+'"');if(typeof item.alt==='string'&&item.alt!==item.defaultAlt)next=next.replace(/\balt="[^"]*"/,'alt="'+escapeHTML(item.alt)+'"');return next}
  if(token.startsWith('<'))return token;
  const key=token.trim(),value=map.get(key);return value===undefined||value===decode(key)?token:token.replace(key,escapeHTML(value));
 });
}
export function readSettings(document){
 const s=document?.settings||{},out={};
 for(const key of ['title','description','operatorName','address'])if(typeof s[key]==='string'&&s[key].trim()&&s[key].length<=2000)out[key]=s[key].replace(/[<>"\x00-\x1f]/g,'').trim();
 if(/^0[35789]\d{8}$/.test(s.hotline))out.hotline=s.hotline;
 if(typeof s.email==='string'&&/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(s.email))out.email=s.email;
 return out;
}
export function previewHTML(template,document,baseSettings,origin){
 let html=template;
 const settings=readSettings(document);
 for(const key of ['title','description','operatorName','address','email'])if(settings[key]&&settings[key]!==baseSettings[key])html=html.replaceAll(escapeHTML(baseSettings[key]),escapeHTML(settings[key]));
 if(settings.hotline&&settings.hotline!==baseSettings.hotline){html=html.replaceAll('tel:+84'+baseSettings.hotline.slice(1),'tel:+84'+settings.hotline.slice(1)).replaceAll('https://zalo.me/'+baseSettings.hotline,'https://zalo.me/'+settings.hotline).replaceAll(baseSettings.hotline,settings.hotline)}
 html=applyContent(html,document,{preview:true}).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 const policy="default-src 'none'; style-src "+origin+" 'unsafe-inline'; img-src "+origin+" data: blob:; font-src "+origin+"; form-action 'none'; base-uri 'none'";
 return html.replace('<head>','<head><meta http-equiv="Content-Security-Policy" content="'+escapeHTML(policy)+'">').replace(/(href|src)="\//g,'$1="'+origin+'/').replace(/<form\b/g,'<form inert').replace(/<button\b/g,'<button disabled').replace(/<a\b/g,'<a tabindex="-1" aria-disabled="true" style="pointer-events:none"');
}
