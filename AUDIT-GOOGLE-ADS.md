# Rà soát nội dung hotrovaynhanh.com — 07/11/2026

**Trạng thái: đã sửa các phần có căn cứ; chưa đủ dữ liệu để chạy Google Ads cho khoản vay cá nhân. Không bảo đảm quảng cáo được duyệt.**

Website thực tế tiếp nhận yêu cầu qua Netlify Functions/Gmail SMTP, không tự đối sánh khoản vay hoặc trả quyết định tín dụng. Máy chủ chỉ xác nhận thành công sau khi SMTP chấp nhận người nhận. Không gửi lead thật trong đợt rà soát này.

| Vị trí | Nội dung cũ | Nội dung mới |
|---|---|---|
| H1, mô tả, title/meta | Tìm giải pháp tài chính phù hợp với bạn | Gửi nhu cầu tìm hiểu khoản vay cá nhân; nêu rõ tiếp nhận để hỗ trợ liên hệ, không cho vay/xét duyệt/giải ngân |
| CTA toàn website | Nhận đề xuất phù hợp / Nhận đề xuất ngay | Gửi nhu cầu tư vấn |
| Lợi ích, quy trình | Nhiều lựa chọn, tìm đề xuất, chỉ vài phút | Gửi nhu cầu → bộ phận hỗ trợ liên hệ → tìm hiểu điều kiện, lãi và phí |
| Phí | Hoàn toàn miễn phí | Miễn phí gửi yêu cầu tư vấn; khoản vay có thể phát sinh lãi/phí |
| Điều kiện | Bạn có thể đăng ký nếu / Tôi đáp ứng điều kiện | Điều kiện tham khảo khi tìm hiểu khoản vay; checklist kiểm tra chi phí, bên cho vay, khả năng chi trả |
| Định danh | Bộ phận quản trị Hỗ Trợ Vay Vốn | Cá nhân vận hành: Trần Thị Yến Nhi; đồng bộ địa chỉ, hotline, email |
| Form và trang kết quả | Thông báo demo tĩnh, nội dung đề xuất | Chỉ hiện demo khi runtime là demo; xác nhận tiếp nhận tư vấn sau accepted=true và mã hợp lệ, không phải duyệt vay |
| Điều khoản, bảo mật, FAQ | Cách gọi và luồng chưa thống nhất | Đồng bộ tiếp nhận qua email, người nhận, quyền rút đồng ý/xóa, tiêu chí lưu giữ; không chuyển đối tác tự động |

## Kiểm tra trước khi triển khai

- Bản xem trước cục bộ với bộ gửi giả lập, không nạp SMTP secret; desktop và viewport 390×844. Các khối công bố dịch vụ luôn hiển thị, xuống một cột trên mobile, không dùng accordion/tooltip để giấu nội dung này.
- Form bốn bước: thông tin hợp lệ, đồng ý mặc định chưa tích; bấm gửi khi chưa đồng ý bị chặn. Gửi hai lần liên tiếp chỉ tạo một lần tiếp nhận giả lập; nút khóa trong lúc chờ.
- Giả lập thành công hiển thị “Đã tiếp nhận yêu cầu tư vấn”; URL không chứa họ tên, điện thoại, email. Giả lập thất bại hiển thị lỗi, giữ biểu mẫu, không chuyển sang thành công.
- Tất cả route công khai và liên kết chính sách có phản hồi; một H1/route, tiếng Việt, canonical. Trang kết quả/API không được lập chỉ mục.
- Kiểm tra tự động gồm API validation, origin, chống spam/rate limit, lỗi dịch vụ, SMTP mock, secret redaction, email escaping, nội dung công bố và chính sách.
- Rà soát mã frontend: sự kiện analytics chỉ nhận trường số cho phép; dữ liệu biểu mẫu chỉ vào POST /api/leads. Cấu hình live trước sửa không có mã analytics. Không thêm tracker hoặc đổi secret.
- Không thử gọi điện, nhắn Zalo, gửi email production hoặc gửi dữ liệu đối tác. Bộ đếm cục bộ: externalDeliveries=0.

## Dữ liệu chủ website còn phải cung cấp

1. Tài liệu chính thức của **sản phẩm thực tế sẽ quảng bá**: đơn vị cho vay, tên sản phẩm, kỳ hạn trả nợ tối thiểu/tối đa; bằng chứng sản phẩm có thời hạn hoàn trả toàn bộ từ 61 ngày trở lên.
2. APR tối đa (tách riêng ví dụ), lãi suất danh nghĩa, cơ sở/cách tính lãi, tất cả phí bắt buộc/tùy chọn và điều kiện áp dụng, phí trả trước/chậm trả nếu có.
3. Ví dụ đại diện có căn cứ: tiền vay, kỳ hạn, lãi suất/cách tính, từng phí, tổng chi phí và tổng tiền phải trả, lịch trả. Cần tài liệu và ngày áp dụng để đối chiếu phép tính.
4. Bằng chứng quan hệ hợp tác/quyền giới thiệu sản phẩm, thông tin đăng ký/giấy phép của chủ thể và bên cho vay **nếu áp dụng**; không tự tạo mã số hoặc suy ra tư cách pháp lý từ tên cá nhân.
5. Xác nhận quy trình tư vấn thực tế, người được phép truy cập hộp thư và quy trình xử lý yêu cầu xóa/rút đồng ý. Chính sách hiện không đặt số ngày lưu cố định, mô tả tiêu chí cần thiết và xử lý yêu cầu hợp lệ theo lựa chọn chủ website.

Trang vaymeo.vn do chủ website tham khảo là website của bên khác. Số liệu hoặc tên đối tác trên đó không chứng minh sản phẩm, giá, quyền phân phối hoặc hoạt động của hotrovaynhanh.com; không sao chép các thông tin đó.

## Những điểm vẫn ngăn sẵn sàng chạy quảng cáo

**Chưa có công bố sản phẩm khoản vay đủ căn cứ** về bên cho vay, kỳ hạn, APR tối đa, phí và ví dụ toàn bộ chi phí. Mục “phạm vi dịch vụ” công khai hiện chỉ mô tả trung thực trạng thái; không thay thế các công bố này. Đổi tên thành tư vấn không miễn chính sách khoản vay đối với website tạo khách hàng tiềm năng. Chưa kiểm tra/xác nhận tài khoản Google Ads, xác minh nhà quảng cáo hoặc các yêu cầu xác minh dịch vụ tài chính theo thị trường áp dụng. Không kết luận tên cá nhân cung cấp đã chứng minh toàn bộ quyền kinh doanh.

Khi có tài liệu xác thực, bổ sung đầy đủ thông tin sản phẩm trực tiếp trên trang đích, APR tối đa trình bày riêng ví dụ, rồi rà soát lại trước khi chạy quảng cáo.

## Tài liệu Google chính thức đã đọc

- [Sản phẩm và dịch vụ tài chính](https://support.google.com/adspolicy/answer/2464998)
- [Khoản vay cá nhân](https://support.google.com/adspolicy/answer/15188216)
- [Công bố thông tin](https://support.google.com/adspolicy/answer/15187149)
- [Thông tin gây hiểu nhầm](https://support.google.com/adspolicy/answer/6020955)


## Cập nhật 21/11/2026: thông tin tham khảo từ ảnh chủ website cung cấp

Đã đối chiếu ảnh với https://viettelmoney.vn/service/fecredit/ và thêm mục tham khảo FE CREDIT qua Viettel Money: 6–100 triệu, 6–36 tháng, tối thiểu 2,1%/tháng theo dư nợ giảm dần, điều kiện nguồn và ví dụ 10 triệu/12 tháng với các số làm tròn. Không thêm logo, không tuyên bố quan hệ đối tác, không gắn form với sản phẩm, không đổi phạm vi tiền trên form tư vấn. Phân biệt lãi suất tối thiểu với APR tối đa, công khai rằng nguồn chưa đủ APR tối đa/phí/bảo hiểm cho ví dụ. Mục tham khảo này không khắc phục các dữ liệu và bằng chứng còn thiếu đã liệt kê, không tạo kết luận sẵn sàng chạy Google Ads.
