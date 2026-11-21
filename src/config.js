import {siteContent,readSettings} from './content.js';
export const config = {
  brandName: 'Hỗ Trợ Vay Vốn', domain: 'hotrovaynhanh.com',
  minAmount: 500000, maxAmount: 30000000, amountStep: 500000, defaultAmount: 8500000,
  companyName: '', taxCode: '', address: '19 Nguyễn Hữu Cảnh, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh',
  hotline: '0938443655', email: 'thienhuongnguyen1010@gmail.com',
  // Keep false until official policies, controller details, and partner data flow are approved.
  legalApproved: false, // Legacy partner/webhook approval remains independent of publication.
  policiesPublished: true,
  operatorName: 'Trần Thị Yến Nhi',
  operatorType: 'Cá nhân vận hành',
  policyEffectiveDate: '07/11/2026',
  policyVersion: '2026-11-07',
  emailConsentNotice: 'Tôi đồng ý gửi họ tên, số điện thoại, email (nếu nhập), nhu cầu, số tiền và nguồn quảng cáo đến hộp thư quản trị Hỗ Trợ Vay Vốn qua Netlify và Gmail để liên hệ, tư vấn. Không tự động chuyển hồ sơ cho đối tác.',
  partners: [],
  purposes: ['Chi tiêu phát sinh', 'Cân đối tài chính', 'Nhu cầu cá nhân', 'Nhu cầu khác'],
  eligibilityRules: ['Đọc kỳ hạn trả nợ', 'Kiểm tra APR và cách tính lãi', 'Xem toàn bộ khoản phí', 'Biết tổng tiền phải trả', 'Xác minh bên cho vay', 'Cân nhắc khả năng chi trả'],
  title: 'Gửi nhu cầu tìm hiểu khoản vay cá nhân | Hỗ Trợ Vay Vốn',
  description: 'Hỗ Trợ Vay Vốn tiếp nhận nhu cầu để bộ phận hỗ trợ liên hệ tư vấn. Website không trực tiếp cho vay, xét duyệt hoặc giải ngân.'

};
export const faqs = [
 ['Hỗ Trợ Vay Vốn là gì?', 'hotrovaynhanh.com tiếp nhận nhu cầu tìm hiểu khoản vay cá nhân để bộ phận hỗ trợ liên hệ tư vấn. Website không trực tiếp cho vay, xét duyệt hoặc giải ngân và hiện không tự động đối sánh hay chuyển hồ sơ cho bên cho vay.'],
 ['Gửi yêu cầu có mất phí không?', 'Website không thu phí tiếp nhận yêu cầu tư vấn. Khoản vay có thể phát sinh lãi và phí theo điều kiện của bên cho vay. Miễn phí gửi yêu cầu không có nghĩa khoản vay miễn lãi hoặc miễn phí.'],
 ['Số tiền trên biểu mẫu có phải hạn mức được duyệt?', 'Không. Số tiền bạn chọn chỉ thể hiện nhu cầu tham khảo, không phải hạn mức hoặc sản phẩm vay được chào bán. Biểu mẫu tư vấn này không gắn với một sản phẩm vay cụ thể; thông tin tham khảo có dẫn nguồn không phải hạn mức được cấp cho bạn.'],
 ['Gửi biểu mẫu xong có được duyệt vay không?', 'Không. Thông báo tiếp nhận chỉ xác nhận yêu cầu tư vấn được gửi đến bộ phận hỗ trợ. Website không đưa ra quyết định tín dụng và không bảo đảm bạn được cấp khoản vay.'],
 ['Khi nào bộ phận hỗ trợ liên hệ?', 'Bộ phận hỗ trợ sẽ liên hệ theo thông tin bạn đã đồng ý cung cấp. Website không cam kết thời gian liên hệ, phê duyệt hoặc giải ngân cố định.'],
 ['Website có bỏ qua kiểm tra CIC không?', 'Website không thẩm định tín dụng, không tra cứu CIC qua biểu mẫu này và không cam kết bất kỳ bên cho vay nào bỏ qua việc kiểm tra. Điều kiện thẩm định cần được xác minh trực tiếp với bên cho vay.']
];
Object.assign(config,readSettings(siteContent));

export const money = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
