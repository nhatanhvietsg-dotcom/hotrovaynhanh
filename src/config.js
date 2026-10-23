export const config = {
  brandName: 'Hỗ Trợ Vay Vốn', domain: 'hotrovaynhanh.com',
  minAmount: 500000, maxAmount: 30000000, amountStep: 500000, defaultAmount: 8500000,
  companyName: '[TÊN PHÁP NHÂN]', taxCode: '[MÃ SỐ THUẾ]', address: '[ĐỊA CHỈ]',
  hotline: '0938443655', email: '[EMAIL]',
  // Keep false until official policies, controller details, and partner data flow are approved.
  legalApproved: false,
  emailConsentNotice: 'Tôi đồng ý gửi họ tên, số điện thoại, email (nếu nhập), nhu cầu, số tiền và nguồn quảng cáo đến hộp thư quản trị Hỗ Trợ Vay Vốn qua Netlify và Gmail để liên hệ, tư vấn. Không tự động chuyển hồ sơ cho đối tác.',
  partners: [],
  purposes: ['Chi tiêu phát sinh', 'Cân đối tài chính', 'Nhu cầu cá nhân', 'Đầu tư cho tương lai'],
  eligibilityRules: ['Công dân Việt Nam', 'Đang sinh sống tại Việt Nam', 'Có CCCD/giấy tờ tùy thân còn hiệu lực', 'Có tài khoản ngân hàng chính chủ', 'Có nguồn thu nhập phù hợp', 'Có số điện thoại và email liên hệ'],
  title: 'Hỗ Trợ Vay Vốn | Tìm Giải Pháp Tài Chính Phù Hợp',
  description: 'Hỗ Trợ Vay Vốn giúp bạn tham khảo và kết nối với các đề xuất tài chính phù hợp. Quy trình trực tuyến đơn giản, minh bạch và thuận tiện.'
};
export const faqs = [
 ['Hỗ Trợ Vay Vốn là gì?', 'hotrovaynhanh.com là nền tảng cung cấp thông tin và hỗ trợ kết nối người dùng với các đối tác cung cấp giải pháp tài chính. Chúng tôi không trực tiếp cấp tín dụng hoặc giải ngân.'],
 ['Sử dụng dịch vụ có mất phí không?', 'Người dùng không phải trả phí cho hotrovaynhanh.com khi sử dụng dịch vụ tìm kiếm đề xuất. Lãi suất, phí và các chi phí khác của khoản vay (nếu có) do từng đối tác công bố.'],
 ['Tôi có thể đăng ký bao nhiêu tiền?', 'Hạn mức phụ thuộc vào sản phẩm, hồ sơ và chính sách của từng đối tác. Số tiền bạn chọn trên website chỉ thể hiện nhu cầu tham khảo, không phải hạn mức được phê duyệt.'],
 ['Bao lâu tôi nhận được kết quả?', 'Thời gian xử lý phụ thuộc vào thông tin hồ sơ và quy trình của từng đối tác. Website không cam kết thời gian phê duyệt hoặc giải ngân.'],
 ['CIC hoặc lịch sử tín dụng ảnh hưởng thế nào?', 'Mỗi đối tác có tiêu chí xét duyệt riêng. Lịch sử tín dụng có thể là một yếu tố được xem xét. Quyết định phê duyệt cuối cùng thuộc về đối tác.'],
 ['Hỗ Trợ Vay Vốn có trực tiếp giải ngân không?', 'Không. hotrovaynhanh.com không phải đơn vị trực tiếp cung cấp hoặc giải ngân khoản vay. Nếu bạn lựa chọn một đề xuất, việc hoàn tất hồ sơ sẽ diễn ra theo quy trình của đối tác.']
];
export const money = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
