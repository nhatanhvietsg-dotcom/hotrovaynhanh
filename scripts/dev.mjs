import http from 'node:http';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/server/index.js',import.meta.url),'utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
const server=http.createServer(async(req,res)=>{
 try{
  // Design review route; also deployed separately from the ad landing page on Netlify.
  if(new URL(req.url,'http://localhost').pathname==='/ban-nhap-khoan-vay'){
   res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow'});
   res.end(await readFile(new URL('../drafts/reference-layout.html',import.meta.url)));return;
  }
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const request=new Request('http://'+req.headers.host+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const response=await worker.fetch(request,process.env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Preview server error')}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
