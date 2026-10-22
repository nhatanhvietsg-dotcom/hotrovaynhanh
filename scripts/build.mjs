import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {renderPage,legalPages} from '../src/pages.js';
import {config} from '../src/config.js';
const root=resolve(import.meta.dirname,'..');
const types={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const assets={};
for(const path of ['/',...Object.keys(legalPages),'/cam-on','/gioi-thieu','/404'])assets[path]={type:'text/html; charset=utf-8',body:Buffer.from(renderPage(path)).toString('base64')};
async function walk(dir,prefix=''){for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name),route=prefix+'/'+entry.name;if(entry.isDirectory())await walk(path,route);else assets[route]={type:types[extname(entry.name)]||'application/octet-stream',body:(await readFile(path)).toString('base64')}}}
await walk(resolve(root,'public'));
await rm(resolve(root,'dist'),{force:true,recursive:true});await mkdir(resolve(root,'dist/server'),{recursive:true});await mkdir(resolve(root,'dist/.openai'),{recursive:true});
const worker=await readFile(resolve(root,'worker/index.js'),'utf8');
await writeFile(resolve(root,'dist/server/index.js'),'const CONFIG='+JSON.stringify(config)+';\nconst ASSETS='+JSON.stringify(assets)+';\n'+worker);
await writeFile(resolve(root,'dist/.openai/hosting.json'),await readFile(resolve(root,'.openai/hosting.json')));
console.log('Built '+Object.keys(assets).length+' routes and assets. No third-party JavaScript dependencies.');
