# QA — 16/10/2026

## Đã xác minh

- Build Worker ESM hợp lệ; 8/8 bài kiểm thử Node API vượt qua.
- Trang chủ và 6 route phụ trả HTTP 200, route lạ trả 404; mỗi trang có đúng một H1, lang vi, canonical và metadata.
- Backend từ chối nhu cầu ngoài hạn mức/sai bước, purpose không hợp lệ, thiếu consent, honeypot, timing không hợp lệ, PII trong demo, cross-origin, payload quá lớn và sai content type.
- Bài test webhook dùng mock: validate server, cấu hình thiếu, idempotency header, thành công có xác nhận, lỗi upstream. Chưa gọi hệ thống đối tác thật.
- Kiểm tra trình duyệt in-app tại 360, 375, 390, 430, 768, 1024, 1280, 1440px: scrollWidth bằng viewport, không tràn ngang.
- CTA hero nằm trong vùng đầu của màn hình mobile cao 900px, trước y=550px trong các kích thước đã đo.
- Slider điều khiển được bằng bàn phím, đồng bộ số tiền với modal.
- Modal mở; input có label; thông báo lỗi tên, điện thoại và email hiển thị; Back giữ thông tin; purpose hiển thị đúng tại bước xác nhận; consent bắt buộc; thử nghiệm gửi thành công và đến trang cảm ơn có nhãn demo.
- FAQ mở nội dung; CTA mobile xuất hiện khi rời hero, ẩn khi mở modal; menu mobile mở và đóng bằng Escape; trang liên hệ ghi rõ thông tin chưa xác nhận.
- Không có lỗi/warning JavaScript được ghi nhận trong các thao tác trên.

## Giới hạn

- Chưa có API, webhook, dữ liệu đối tác, ID analytics hoặc pháp lý thật để kiểm thử integration end-to-end.
- Chưa chạy Lighthouse; không khẳng định Performance >=90. Ảnh WebP, font local, không framework runtime, không carousel/video; hero mobile ẩn để ưu tiên CTA.
- Screenshot desktop trong trình duyệt in-app bị giới hạn vùng chụp; kiểm tra kích thước bằng DOM vẫn hoạt động. Không coi đây là xác nhận hoàn toàn mọi chi tiết visual trên thiết bị thật.
- Cần kiểm tra Safari/iOS, Chrome Android và hosting domain thật trước chiến dịch.

## Bản cập nhật theo thiết kế người dùng — 16/10/2026

- Dựng lại layout từ ảnh tham chiếu; ảnh hero/nhân vật được tạo riêng và tối ưu WebP, không nhúng screenshot nguyên trang.
- Kiểm tra Chrome thực tế tại 360, 375, 390, 430, 768, 1024, 1280, 1440px: không tràn ngang, không tiêu đề tràn khung. Desktop có ảnh chụp toàn trang để đối chiếu thiết kế.
- Form: default 8.500.000đ, slider phím mũi tên, validation bắt buộc, Back giữ thông tin, chọn nhu cầu, consent và kết quả demo hoạt động sau thay đổi layout.
- Menu mobile mở/đóng; FAQ mở/đóng; CTA sticky xuất hiện khi rời hero và ẩn trong modal.
- Không ghi nhận lỗi từ mã website. Chrome có cảnh báo từ extension MetaMask, không xuất phát từ website.
- `/gioi-thieu` là route mới, giữ nội dung giới thiệu khi bỏ section khỏi luồng homepage để theo bố cục ảnh.
- Vẫn là chế độ demo riêng tư, chưa có webhook hoặc pháp lý chính thức, chưa có Lighthouse score được xác nhận.
