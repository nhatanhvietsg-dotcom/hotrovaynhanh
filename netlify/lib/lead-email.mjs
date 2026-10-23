import nodemailer from 'nodemailer';
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function smtpSetupRequired(env) {
 const missing=[];
 if(!env.SMTP_HOST?.trim())missing.push('SMTP_HOST');
 const port=Number(env.SMTP_PORT||465);
 if(![465,587].includes(port))missing.push('SMTP_PORT');
 if(port===465&&env.SMTP_SECURE==='false')missing.push('SMTP_SECURE');
 if(!emailPattern.test(env.SMTP_USER||''))missing.push('SMTP_USER');
 if(!emailPattern.test(env.LEAD_RECEIVER_EMAIL||''))missing.push('LEAD_RECEIVER_EMAIL');
 if(!env.SMTP_APP_PASSWORD?.trim())missing.push('SMTP_APP_PASSWORD');
 return missing;
}
export function smtpSettings(env) {
 if(smtpSetupRequired(env).length)return null;
 const port=Number(env.SMTP_PORT||465),secure=env.SMTP_SECURE!=='false';
 return {host:env.SMTP_HOST,port,secure,requireTLS:true,auth:{user:env.SMTP_USER,pass:env.SMTP_APP_PASSWORD},connectionTimeout:8000,greetingTimeout:5000,socketTimeout:15000,dnsTimeout:5000,logger:false,debug:false};
}
export function leadMessage(lead, env) {
 const amount = new Intl.NumberFormat('vi-VN').format(lead.amount)+'đ';
 const customer = [['Họ và tên',lead.fullName],['Số điện thoại',lead.phone],...(lead.email?[['Email',lead.email]]:[]),['Số tiền khách đang cần',amount],['Nhu cầu',lead.purpose]];
 const source = [['Website','hotrovaynhanh.com'],['Trang đăng ký',lead.pageUrl],['Thời gian đăng ký',new Date(lead.submittedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour12:false})+' (GMT+7)'],...['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid'].filter(k=>lead.attribution[k]).map(k=>[k.toUpperCase().replaceAll('_',' '),lead.attribution[k]])];
 const audit = [['Mã yêu cầu',lead.requestId],['Đồng ý xử lý dữ liệu','Có'],['Phiên bản đồng ý',lead.consentVersion],['Nội dung đồng ý',lead.consentNotice]];
 const textSection = (title,rows) => title+'\n'+rows.map(([k,v])=>k+': '+v).join('\n');
 const htmlSection = (title,rows) => '<h2 style="font-size:17px;color:#087f78">'+title+'</h2><table role="presentation" style="width:100%;border-collapse:collapse">'+rows.map(([k,v])=>'<tr><td style="padding:8px;border-bottom:1px solid #eee;vertical-align:top">'+escapeHtml(k)+'</td><td style="padding:8px;border-bottom:1px solid #eee;overflow-wrap:anywhere">'+(['Họ và tên','Số điện thoại','Số tiền khách đang cần'].includes(k)?'<strong>'+escapeHtml(v)+'</strong>':escapeHtml(v))+'</td></tr>').join('')+'</table>';
 return {from:{name:'Hỗ Trợ Vay Vốn',address:env.SMTP_USER},to:env.LEAD_RECEIVER_EMAIL,...(lead.email?{replyTo:lead.email}:{}),subject:'[Hỗ Trợ Vay Vốn] Có khách hàng đăng ký mới',messageId:'<lead-'+lead.requestId+'@hotrovaynhanh.com>',text:[textSection('THÔNG TIN KHÁCH HÀNG',customer),textSection('NGUỒN KHÁCH HÀNG',source),textSection('XÁC NHẬN',audit)].join('\n\n'),html:'<!doctype html><html lang="vi"><meta charset="utf-8"><body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#16313f;max-width:640px;margin:auto;padding:16px">'+htmlSection('THÔNG TIN KHÁCH HÀNG',customer)+htmlSection('NGUỒN KHÁCH HÀNG',source)+htmlSection('XÁC NHẬN',audit)+'</body></html>',disableFileAccess:true,disableUrlAccess:true};
}
export function emailSender(env, createTransport = nodemailer.createTransport) {
 const settings=smtpSettings(env);
 if(!settings)return null;
 return async lead => {
  const transport=createTransport(settings);
  try {
   console.info(JSON.stringify({event:'lead_email_requested',requestId:lead.requestId}));
   const result=await transport.sendMail(leadMessage(lead,env));
   if(!result.accepted?.some(address=>String(address).toLowerCase()===env.LEAD_RECEIVER_EMAIL.toLowerCase()))throw Object.assign(new Error('not accepted'),{code:'ERECIPIENT'});
   console.info(JSON.stringify({event:'lead_email_accepted',requestId:lead.requestId}));
  } catch(error) {
   // Never log error.message, SMTP responses, credentials or lead contents.
   const code=['EAUTH','ECONNECTION','ETIMEDOUT','ESOCKET','ERECIPIENT','EENVELOPE','EMESSAGE'].includes(error.code)?error.code:'EDELIVERY';
   console.error(JSON.stringify({event:'lead_email_failed',requestId:lead.requestId,code}));
   throw new Error('Email delivery failed');
  } finally {transport.close?.()}
 };
}
