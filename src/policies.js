import { config } from './config.js';
const operator = config.operatorName;
const contact = `${operator}. Địa chỉ liên hệ: ${config.address}. Hotline: ${config.hotline}. Email: ${config.email}.`;
export const legalPages = {
 '/dieu-khoan-su-dung': {
  title:'Điều khoản sử dụng',
  intro:'Điều khoản áp dụng khi bạn sử dụng thông tin và gửi yêu cầu hỗ trợ trên hotrovaynhanh.com.',
  sections:[
   ['1. Đầu mối quản trị và phạm vi áp dụng',contact+' Các điều khoản này áp dụng cho nội dung, biểu mẫu và kênh hỗ trợ được công bố trên website.'],
   ['2. Vai trò của website','Hỗ Trợ Vay Vốn cung cấp thông tin và tiếp nhận nhu cầu để bộ phận hỗ trợ liên hệ, tư vấn. Website không phải ngân hàng hoặc tổ chức tín dụng, không trực tiếp cấp khoản vay, quyết định phê duyệt hay giải ngân. Việc gửi biểu mẫu không tạo hợp đồng vay và không bảo đảm được cấp tín dụng.'],
   ['3. Tiếp nhận yêu cầu','Bạn chọn số tiền, nhu cầu, cung cấp họ tên và số điện thoại; email là tùy chọn. Chỉ gửi thông tin của chính bạn hoặc thông tin bạn có quyền cung cấp. Không gửi CCCD, mật khẩu, mã OTP hoặc thông tin tài khoản ngân hàng qua biểu mẫu này. Bạn cần xác nhận đồng ý xử lý dữ liệu trước khi gửi.'],
   ['4. Chi phí và quyền lựa chọn','Website không thu phí sử dụng biểu mẫu tìm kiếm hỗ trợ. Bạn có thể xem thông tin và dừng quy trình bất kỳ lúc nào. Nếu sau này bạn lựa chọn sản phẩm của một bên cung cấp dịch vụ tài chính, lãi suất, phí, điều kiện, lịch thanh toán và tổng nghĩa vụ phải do bên đó công bố trong thỏa thuận riêng trước khi bạn quyết định.'],
   ['5. Kết quả và thông tin từ bên khác','Thông báo “Đã nhận thông tin của bạn” chỉ xác nhận yêu cầu đã được hệ thống tiếp nhận qua email. Website không cam kết phê duyệt, hạn mức hoặc thời gian giải ngân. Hiện chưa có danh sách đối tác được tích hợp để tự động chuyển hồ sơ; bộ phận hỗ trợ không tự động gửi dữ liệu biểu mẫu sang đối tác.'],
   ['6. Sử dụng đúng mục đích','Không sử dụng website để mạo danh, phát tán thông tin sai sự thật, gửi mã độc, spam, can thiệp hệ thống hoặc xâm phạm dữ liệu của người khác. Hệ thống có thể giới hạn hoặc từ chối yêu cầu bất thường nhằm bảo vệ dịch vụ.'],
   ['7. Tính sẵn có và trách nhiệm','Thông tin được cập nhật theo hoạt động của website; dịch vụ có thể gián đoạn do bảo trì hoặc sự cố hạ tầng. Khi gửi không thành công, biểu mẫu hiển thị lỗi và bạn có thể thử lại. Việc mô tả giới hạn dịch vụ không loại trừ các quyền và trách nhiệm bắt buộc theo pháp luật áp dụng.'],
   ['8. Hỗ trợ và khiếu nại',`Gửi yêu cầu đến ${config.email} hoặc gọi ${config.hotline}, nêu nội dung, thời điểm phát sinh và mã ghi nhận nếu có. Bộ phận quản trị tiếp nhận, kiểm tra thông tin liên quan và liên hệ lại để xử lý; không yêu cầu bạn gửi mật khẩu hoặc mã OTP. Với tranh chấp liên quan đến hợp đồng của bên cung cấp tài chính, bạn cần liên hệ bên ký kết hợp đồng đó. Quyền liên hệ cơ quan có thẩm quyền của bạn được giữ nguyên.`],
   ['9. Cập nhật điều khoản','Phiên bản đang áp dụng được công bố tại trang này cùng ngày hiệu lực. Khi thay đổi nội dung xử lý dữ liệu hoặc mục đích sử dụng cần sự đồng ý mới, website sẽ cập nhật thông tin và yêu cầu xác nhận phù hợp trước khi thực hiện.']
  ]
 },
 '/chinh-sach-bao-mat': {
  title:'Chính sách bảo mật',
  intro:'Thông tin về dữ liệu được thu thập, mục đích sử dụng, bên tiếp nhận và cách thực hiện yêu cầu về quyền riêng tư.',
  sections:[
   ['1. Đầu mối tiếp nhận yêu cầu về dữ liệu',contact+' Bạn có thể dùng các kênh này để hỏi về việc xử lý dữ liệu hoặc thực hiện yêu cầu liên quan đến thông tin của mình.'],
   ['2. Dữ liệu bạn cung cấp','Biểu mẫu thu thập họ tên, số điện thoại, email nếu bạn nhập, số tiền cần hỗ trợ, mục đích nhu cầu và xác nhận đồng ý. Website không có trường thu thập năm sinh, nghề nghiệp, thu nhập, CCCD, lịch sử CIC hoặc tài khoản ngân hàng. Không nhập các dữ liệu này vào trường họ tên hoặc email.'],
   ['3. Dữ liệu nguồn và kỹ thuật','Yêu cầu đăng ký kèm trang đăng ký không chứa query hoặc hash, thời gian do máy chủ ghi nhận, mã yêu cầu, nội dung và phiên bản đồng ý. Nếu có, UTM Source, Medium, Campaign, Content, Term, FBCLID và GCLID được giữ theo phiên truy cập để gửi cùng biểu mẫu sau khi bạn đồng ý. Hạ tầng Netlify có thể xử lý địa chỉ IP và thông tin truy cập cần thiết để cung cấp dịch vụ, chống spam và xử lý sự cố.'],
   ['4. Mục đích xử lý','Dữ liệu được dùng để tiếp nhận nhu cầu bạn đã gửi, để bộ phận hỗ trợ liên hệ và tư vấn, nhận biết nguồn đăng ký, xử lý yêu cầu hỗ trợ hoặc khiếu nại, và bảo vệ hệ thống. Thông tin biểu mẫu không được đưa vào sự kiện Google Analytics hoặc Meta Pixel. Việc đồng ý cookie phân tích là một lựa chọn riêng với việc đồng ý gửi biểu mẫu.'],
   ['5. Cách gửi và người nhận',`Sau khi bạn xác nhận đồng ý và nhấn Gửi thông tin, dữ liệu đi qua Netlify Functions và được gửi bằng Gmail SMTP đến ${config.email}, hộp thư của ${operator}. Email có họ tên, số điện thoại, email tùy chọn, số tiền, nhu cầu, nguồn đăng ký và thông tin xác nhận. Website chỉ báo tiếp nhận thành công sau khi máy chủ SMTP chấp nhận thư gửi đến hộp thư đã cấu hình.`],
   ['6. Nhà cung cấp hạ tầng và liên kết ngoài','Netlify cung cấp hạ tầng website/API; Google cung cấp dịch vụ Gmail để truyền và lưu email. Các dịch vụ này có thể xử lý hoặc lưu dữ liệu trên hạ tầng ngoài Việt Nam theo cấu hình và chính sách của nhà cung cấp. Website hiện không tự động chuyển hồ sơ cho đối tác tài chính và không bán dữ liệu biểu mẫu. Khi bạn mở liên kết Zalo hoặc liên kết của một bên khác, dịch vụ đó áp dụng chính sách riêng; bạn chủ động lựa chọn thông tin tiếp tục cung cấp tại đó.'],
   ['7. Lưu trữ và xóa dữ liệu','Email chứa lead được lưu trong hộp thư quản trị; hiện không ấn định một thời hạn cố định theo số ngày và không có lịch tự động xóa lead trên website. Bộ phận quản trị lưu dữ liệu phục vụ việc hỗ trợ, xử lý yêu cầu hoặc nghĩa vụ áp dụng, rà soát nhu cầu lưu giữ và xử lý xóa khi dữ liệu không còn cần thiết hoặc khi có yêu cầu hợp lệ, trừ trường hợp cần tiếp tục lưu theo pháp luật. Website không có cơ sở dữ liệu hồ sơ riêng ngoài luồng email.'],
   ['8. Lưu trữ trên thiết bị','Họ tên, số điện thoại và email chưa gửi chỉ ở bộ nhớ biểu mẫu và không được website lưu vào localStorage hoặc sessionStorage. Trình duyệt có thể có tính năng tự điền do bạn quản lý. Website lưu lựa chọn cookie trên thiết bị và mã nguồn truy cập/mã ghi nhận theo phiên như mô tả tại Chính sách Cookie. Trang cảm ơn không đưa họ tên, số điện thoại hoặc email vào URL.'],
   ['9. Bảo vệ dữ liệu','Website sử dụng HTTPS, SMTP có mã hóa, kiểm tra dữ liệu phía máy chủ, giới hạn kích thước và tần suất yêu cầu cùng trường chống bot. Mật khẩu SMTP được lưu trong secret của hosting, không đưa vào frontend hoặc email lead. Log ứng dụng không ghi nội dung biểu mẫu hoặc mật khẩu. Các biện pháp này giảm rủi ro nhưng không phải cam kết hệ thống không bao giờ xảy ra sự cố.'],
   ['10. Quyền của bạn và cách gửi yêu cầu',`Bạn có thể liên hệ ${config.email} hoặc ${config.hotline} để yêu cầu được biết, truy cập, xem xét chỉnh sửa hoặc xóa dữ liệu, rút lại sự đồng ý, hạn chế hoặc phản đối việc xử lý, và khiếu nại theo quyền áp dụng. Hãy nêu số điện thoại đã đăng ký, mã yêu cầu nếu có và nội dung cần xử lý; không gửi CCCD, mật khẩu hoặc OTP. Bộ phận quản trị có thể cần xác minh ở mức cần thiết để tránh tiết lộ thông tin cho người khác. Rút đồng ý có thể khiến việc tiếp tục tư vấn không thực hiện được; việc xử lý trước đó và nghĩa vụ lưu trữ bắt buộc được xem xét theo pháp luật áp dụng.`],
   ['11. Thay đổi chính sách','Ngày hiệu lực và phiên bản được ghi trên trang này. Nếu bổ sung người nhận, mục đích hoặc loại dữ liệu cần sự đồng ý mới, website sẽ thông báo và xin xác nhận trước khi áp dụng cho dữ liệu liên quan.']
  ]
 },
 '/cookie-policy': {
  title:'Chính sách Cookie',
  intro:'Các lựa chọn lưu trữ và phân tích được dùng trên website; bạn có thể thay đổi lựa chọn cookie bất kỳ lúc nào.',
  sections:[
   ['1. Lựa chọn cần thiết','Website dùng localStorage để ghi nhớ bạn chọn Chỉ cần thiết hoặc Đồng ý phân tích. Lựa chọn này tồn tại cho đến khi bạn thay đổi hoặc xóa dữ liệu trang trên trình duyệt. Thông tin này không bao gồm họ tên, điện thoại hoặc email.'],
   ['2. Nguồn đăng ký trong phiên','sessionStorage giữ các tham số UTM, FBCLID và GCLID nếu có trong phiên của tab để bảo toàn nguồn khi bạn đi qua các bước hoặc trang. Dữ liệu nguồn chỉ được gửi cùng lead khi bạn đồng ý gửi biểu mẫu. Bạn có thể xóa bằng chức năng xóa dữ liệu website của trình duyệt.'],
   ['3. Mã ghi nhận trong phiên','Sau khi gửi biểu mẫu, sessionStorage lưu mã ghi nhận, thời điểm và trạng thái demo/thật để trang cảm ơn hiển thị kết quả trong tối đa 30 phút. Bản ghi này không chứa họ tên, số điện thoại hoặc email. Trạng thái được giữ theo phiên trình duyệt; thời gian hiển thị không có nghĩa email lead cũng bị xóa sau 30 phút.'],
   ['4. Phân tích tùy chọn','Google Tag Manager, Google Analytics và Meta Pixel chỉ được tải khi website có mã cấu hình tương ứng và bạn đã chọn Đồng ý phân tích. Nếu chưa cấu hình, các công cụ này không được tải. Sự kiện do website phát ra không kèm tên, điện thoại, email hoặc nội dung tự do của biểu mẫu. Cookie do nhà cung cấp phân tích đặt và thời gian tồn tại của chúng phụ thuộc vào dịch vụ, cấu hình thực tế và lựa chọn của bạn.'],
   ['5. Thay đổi hoặc rút lựa chọn','Bấm Tùy chọn Cookie ở chân trang. Khi chuyển về Chỉ cần thiết, website dừng gửi sự kiện, xóa các cookie phân tích thông dụng mà website có thể truy cập và tải lại trang. Bạn có thể quản lý hoặc xóa thêm cookie trong cài đặt trình duyệt. Lựa chọn Chỉ cần thiết không ngăn bạn sử dụng biểu mẫu; biểu mẫu có bước đồng ý xử lý dữ liệu riêng.'],
   ['6. Liên hệ',contact]
  ]
 },
 '/thong-tin-quan-trong': {
  title:'Thông tin quan trọng',intro:'Hiểu rõ phạm vi hỗ trợ và các thông tin cần cân nhắc trước khi quyết định.',
  sections:[
   ['Vai trò của Hỗ Trợ Vay Vốn','hotrovaynhanh.com là website cung cấp thông tin và tiếp nhận nhu cầu hỗ trợ, không phải ngân hàng hoặc tổ chức tín dụng; không trực tiếp cấp khoản vay, thẩm định, quyết định phê duyệt hay giải ngân.'],
   ['Gửi nhu cầu không phải được duyệt vay','Số tiền bạn chọn chỉ phản ánh nhu cầu tham khảo. Xác nhận tiếp nhận chỉ ghi nhận yêu cầu qua email, không phải hạn mức, lời hứa cấp tín dụng hoặc quyết định phê duyệt.'],
   ['Điều kiện và chi phí','Website không thu phí sử dụng biểu mẫu hỗ trợ. Trước khi lựa chọn sản phẩm của một bên cung cấp tài chính, cần đọc kỹ lãi suất, phí, tổng số tiền phải trả, lịch thanh toán, điều kiện trả trước hạn và nghĩa vụ khi chậm trả trong tài liệu chính thức của bên đó.'],
   ['Bảo vệ thông tin và giao dịch','Không cung cấp mật khẩu, OTP, thông tin tài khoản ngân hàng hoặc giấy tờ tùy thân qua biểu mẫu này. Không chuyển tiền chỉ để được hứa hẹn duyệt vay. Nếu có người mạo danh website, hãy liên hệ qua kênh công bố bên dưới để kiểm tra.'],
   ['Kênh hỗ trợ chính thức',contact],
   ['Tình trạng kết nối','Website đang tiếp nhận nhu cầu qua email của bộ phận quản trị. Chưa tích hợp danh sách đối tác để tự động chuyển hồ sơ hoặc trả quyết định tín dụng. Việc tiếp tục trao đổi hoặc cung cấp thêm dữ liệu cho bất kỳ bên nào là lựa chọn riêng của bạn.']
  ]
 },
 '/lien-he': {
  title:'Liên hệ & hỗ trợ',intro:'Liên hệ bộ phận quản trị về nhu cầu hỗ trợ, thông tin đã gửi hoặc quyền riêng tư.',
  sections:[
   ['Liên hệ',contact+' Bạn có thể gọi hotline, gửi email hoặc mở Zalo từ nút liên hệ trên website. Không gửi mật khẩu, OTP, CCCD hoặc thông tin ngân hàng khi gửi câu hỏi.'],
   ['Khiếu nại',`Gửi nội dung đến ${config.email}, nêu vấn đề, thời điểm phát sinh, mã ghi nhận nếu có và cách liên hệ lại. Bộ phận quản trị tiếp nhận, kiểm tra và trao đổi để xử lý. Nếu vấn đề thuộc sản phẩm hoặc hợp đồng của một bên khác, cần liên hệ trực tiếp với bên ký kết để được giải quyết theo thỏa thuận và pháp luật áp dụng.`],
   ['Yêu cầu về dữ liệu cá nhân','Bạn có thể dùng cùng đầu mối để yêu cầu truy cập, chỉnh sửa, xóa thông tin hoặc rút đồng ý. Xem Chính sách bảo mật để biết phạm vi dữ liệu và cách xử lý yêu cầu.']
  ]
 }
};
