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

## Nhận lead qua email — 23/10/2026

- Code lên GitHub commit 646120266fef75f6a9493ec3cacfbb84e3219613, Netlify deploy 6adac7bd3814d0cc1c8eef0f ready.
- 17/17 Node tests đạt: 8 test cũ và 9 test email; server validation, honeypot, origin, oversized payload, rate limit, SMTP configuration, errors, dedup concurrent/retry, HTML escaping, UTF-8/vi-VN/GMT+7, config không lộ credential.
- Chrome desktop: mở 4 bước, dữ liệu mẫu, đồng ý, double-click submit; nút disabled hiển thị Đang gửi thông tin..., lỗi SMTP giả lập hiển thị thông báo thân thiện và giữ form.
- Chrome viewport 390x844: quay lại giữ nhu cầu/consent, gửi lại hiển thị loading rồi lỗi thân thiện; chưa gửi email thật trong kiểm tra này.
- Transport SMTP được mock trong kiểm thử lỗi; không thay mật khẩu production để thử lỗi.
- Công cụ Netlify báo upsert thành công nhưng API production sau deploy vẫn mode demo. Chưa xác nhận cấu hình SMTP được lưu; chưa gửi/kiểm tra Inbox Gmail thật. Cần hoàn tất cấu hình hosting rồi redeploy và gửi thử.
- Secret và địa chỉ nhận không được đưa vào source public. Hướng dẫn private local nằm trong artifacts/email-hosting-setup.md (Git ignore).

## Xác minh production sau cấu hình SMTP — 23/10/2026

- Secret SMTP đã khả dụng trên Function production; /api/config trả mode live. Không đọc hay xuất mật khẩu.
- 19/19 tests đạt, bổ sung kiểm tra diagnostics chỉ chứa tên biến và consent fallback đúng nội dung công bố.
- Gửi form desktop thật với lead ghi rõ Kiểm Thử Không Liên Hệ, phone mẫu, email qa@example.com và UTM/FBCLID/GCLID mẫu. Backend chấp nhận và frontend chuyển đến /cam-on/; mã chỉ chấp nhận sau SMTP accepted recipient. Chưa xác nhận nội dung Inbox thực tế từ phía người nhận tại thời điểm ghi nhận này.
- Phát hiện Netlify Pretty URLs thêm slash cuối /cam-on/; sửa nhận diện pathname để thông báo xác nhận và mã ghi nhận hiển thị đúng.
