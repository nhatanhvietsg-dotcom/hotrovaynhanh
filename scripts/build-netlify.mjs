import './build-admin.mjs';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { config } from '../src/config.js';
import { legalPages, renderPage } from '../src/pages.js';
import { security } from '../worker/index.js';
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'netlify-dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, 'public'), output, { recursive: true });
const routes = ['/', ...Object.keys(legalPages), '/cam-on', '/gioi-thieu'];
for (const route of routes) {
  const folder = resolve(output, '.' + route);
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, 'index.html'), renderPage(route));
}
await writeFile(resolve(output, '404.html'), renderPage('/404'));
// Explicitly requested public design preview, separate from the ad landing page.
const previewSource = await readFile(resolve(root, 'drafts/reference-layout.html'), 'utf8');
const previewScript = previewSource.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!previewScript) throw new Error('Loan design preview script is missing');
await mkdir(resolve(output, 'ban-nhap-khoan-vay'), { recursive: true });
await writeFile(resolve(output, 'assets/loan-design-preview.js'), previewScript);
await writeFile(resolve(output, 'ban-nhap-khoan-vay/index.html'), previewSource.replace(/<script>[\s\S]*?<\/script>/, '<script src="/assets/loan-design-preview.js" defer></script>'));
const headers = ['/*', ...Object.entries(security).map(([key, value]) => `  ${key}: ${value}`)];
if (!config.policiesPublished) headers.push('  X-Robots-Tag: noindex, nofollow');
headers.push('/api/*','  X-Robots-Tag: noindex, nofollow','/cam-on','  X-Robots-Tag: noindex, nofollow','/cam-on/*','  X-Robots-Tag: noindex, nofollow','/404.html','  X-Robots-Tag: noindex, nofollow');
headers.push('/ban-nhap-khoan-vay','  X-Robots-Tag: noindex, nofollow','/ban-nhap-khoan-vay/*','  X-Robots-Tag: noindex, nofollow');
headers.push('/admin/*','  X-Robots-Tag: noindex, nofollow','  Cache-Control: no-store',"  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net/npm/decap-cms@3.18.0/dist/decap-cms.js; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com; font-src 'self' data:; connect-src 'self' https://api.github.com https://api.netlify.com https://raw.githubusercontent.com; frame-src 'self' blob: https://api.netlify.com; frame-ancestors 'self'; worker-src blob:; base-uri 'self'; form-action 'self'; object-src 'none'");
await writeFile(resolve(output, '_headers'), headers.join('\n') + '\n');
const runtime = resolve(root, '.netlify-runtime');
await mkdir(runtime, { recursive: true });
const worker = await readFile(resolve(root, 'worker/index.js'), 'utf8');
await writeFile(resolve(runtime, 'api-core.mjs'), `const CONFIG=${JSON.stringify(config)};\nconst ASSETS={};\n${worker}`);
console.log(`Netlify: ${routes.length} static pages, assets, and shared API runtime built.`);
