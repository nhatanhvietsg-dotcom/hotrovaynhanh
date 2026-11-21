import {previewHTML} from './content-tools.js';
async function startEditor(){
 const root=document.getElementById('nc-root');
 try{
  const cms=window.CMS;if(!cms)throw new Error('Không tải được trình sửa nội dung. Hãy tải lại trang hoặc kiểm tra kết nối mạng.');
  const template=await fetch('/admin/preview-template.json').then(r=>{if(!r.ok)throw new Error('Không tải được bản xem trước. Vui lòng tải lại trang.');return r.json()});
  const Preview=window.createClass({render(){const data=this.props.entry.get('data').toJS();for(const item of data.images||[]){try{let path=this.props.getAsset(item.image).toString();if(path.startsWith(location.origin+'/'))path=path.slice(location.origin.length);item.image=path}catch{}}return window.h('iframe',{className:'cms-preview-frame',title:'Xem trước trang chủ — không gửi biểu mẫu',sandbox:'allow-same-origin',srcDoc:previewHTML(template.html,data,template.settings,location.origin)})}});
  cms.registerPreviewTemplate('site',Preview);cms.init();
 }catch(error){root.textContent=error.message}
}
if(document.readyState==='complete')startEditor();else window.addEventListener('load',startEditor,{once:true});
