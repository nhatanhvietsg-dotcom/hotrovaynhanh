import { emailSender, smtpSetupRequired } from '../lib/lead-email.mjs';
import worker from '../../.netlify-runtime/api-core.mjs';
const envNames = ['LEAD_MODE', 'GTM_ID', 'GA_ID', 'META_PIXEL_ID', 'CONSENT_NOTICE', 'CONSENT_VERSION', 'LEAD_WEBHOOK_URL', 'LEAD_WEBHOOK_TOKEN', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_APP_PASSWORD', 'LEAD_RECEIVER_EMAIL'];
export default async function handler(request, context = {}) {
  const path = new URL(request.url).pathname.replace(/\/$/, '');
  if (!['/api/config', '/api/leads'].includes(path)) return new Response('Not found', { status: 404 });
  const env = Object.fromEntries(envNames.map(name => [name, globalThis.Netlify?.env?.get(name) ?? process.env[name] ?? '']));
  env.SEND_LEAD_EMAIL = emailSender(env);
  env.EMAIL_READY = Boolean(env.SEND_LEAD_EMAIL);
  env.EMAIL_SETUP_REQUIRED = [...smtpSetupRequired(env), ...(!env.CONSENT_NOTICE?['CONSENT_NOTICE']:[])];
  const headers = new Headers(request.headers);
  // Use Netlify's request context, not a client-supplied Cloudflare header.
  headers.set('cf-connecting-ip', context.ip || 'unknown-netlify-ip');
  return worker.fetch(new Request(request, { headers }), env);
}
export const config = { path: ['/api/config', '/api/leads'], rateLimit: { action:'rate_limit', aggregateBy:['ip','domain'], windowSize:60, windowLimit:8 } };
