# Hỗ Trợ Vay Vốn

Landing page HTML/CSS/JavaScript thuần, render sẵn. Production: https://hotrovaynhanh.com, Netlify project `hotrovay` (`9782b2c7-483f-4df1-8b87-1dc204b15677`). GitHub: nhatanhvietsg-dotcom/hotrovaynhanh, main. Domain và HTTPS đã hoạt động.

## Chạy và build

Node.js >=22, `pnpm install --frozen-lockfile`. `npm run build:netlify` tạo `netlify-dist/` và `.netlify-runtime/`; Netlify CDN phục vụ trang tĩnh, Functions phục vụ API. `npm run build` giữ bản Cloudflare Worker cũ cho preview; `npm run dev` chạy tại http://127.0.0.1:4173. `npm test` chạy sau cả hai build.

Không sửa output. `.netlify/`, `.netlify-runtime/`, node_modules, output, artifacts và .env* được ignore; `.env.example` chỉ có ví dụ không chứa secret. Xem DESIGN.md cho bố cục/ảnh và QA.md cho kết quả kiểm tra.

## Luồng nhận lead qua email

Dùng lại `POST /api/leads`, không thêm form hoặc route đăng ký. Tất cả CTA mở cùng form 4 bước: số tiền, họ tên/phone/email tùy chọn, nhu cầu, consent. Không có năm sinh, nghề nghiệp, thu nhập hoặc khu vực; không tạo các field này trong email.

Khách đồng ý → server validate → Gmail SMTP chấp nhận email → success → `/cam-on`. Không có phê duyệt khoản vay. Nếu SMTP thất bại: giữ form và hiển thị “Chưa thể gửi thông tin. Vui lòng thử lại sau ít phút.” Button có trạng thái “Đang gửi thông tin...”, disable trong khi gửi và không cho double-submit.

- `netlify/lib/lead-email.mjs`: Nodemailer chỉ ở backend, email HTML + plain text, escape HTML, số tiền vi-VN và thời gian GMT+7. Subject cố định `[Hỗ Trợ Vay Vốn] Có khách hàng đăng ký mới` tránh đưa PII vào header subject. Highlight họ tên, phone và số tiền.
- `netlify/functions/api.mjs`: đọc env Functions, tạo SMTP sender, lấy IP tin cậy từ context. Rate limit Netlify edge 8 requests/60s/IP cho config và leads.
- `worker/index.js`: validate server, same-origin, honeypot, thời gian điền tối thiểu, payload 4 KB, 6 submission/60s/IP/instance. Chỉ trả success sau SMTP accepted. Chế độ email thiếu cấu hình trả unavailable/503, không giả lập nhận hồ sơ.
- `public/app.js`: giữ UTM source/medium/campaign/content/term, FBCLID, GCLID trong sessionStorage; gửi sau consent. pageUrl bỏ query/hash. Tên/phone/email không lưu sessionStorage, không gửi analytics, không đưa vào URL cảm ơn. Không cấu hình GTM đọc input hay tự thu PII.
- `src/components.js`, `src/pages.js`: consent ghi đúng hộp thư nhận, giải thích nguồn lead và trang cảm ơn.
- `tests/email.test.mjs`: SMTP config, retry/dedup, lỗi giao thư, validation/spam, HTML escaping, UTF-8/format, không lộ credential.

## Biến môi trường Netlify

Context production, scope Functions. Đổi biến phải redeploy:

| Biến | Giá trị |
| --- | --- |
| LEAD_MODE | email |
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 465 |
| SMTP_SECURE | true |
| SMTP_USER | Cấu hình trực tiếp trên hosting |
| SMTP_APP_PASSWORD | Secret do quản trị cấu hình trực tiếp ở hosting |
| LEAD_RECEIVER_EMAIL | Cấu hình trực tiếp trên hosting |
| CONSENT_VERSION | email-2026-10-23-v1 |
| CONSENT_NOTICE | Mô tả dữ liệu, người nhận, mục đích liên hệ và hạ tầng Netlify/Gmail |

Không đặt password vào frontend, Git, netlify.toml, output hoặc API response. `/api/config` chỉ trả trạng thái, ID analytics công khai và consent notice. Log chỉ có event, requestId và mã lỗi allowlist; không log PII/password/SMTP response. Họ tên/số điện thoại chỉ ở email đã được khách đồng ý, không có database hồ sơ.

`LEAD_MODE=demo` không nhận PII. Adapter webhook cũ `LEAD_MODE=live` vẫn yêu cầu `legalApproved=true`, CONSENT_NOTICE và LEAD_WEBHOOK_URL HTTPS. SMTP email mode là luồng do chủ website yêu cầu riêng, không gửi hồ sơ cho đối tác. Không tự đổi legalApproved hoặc bỏ noindex: đơn vị vận hành còn cần hoàn thiện pháp nhân, thời hạn lưu trữ, chính sách và đối tác.

## Kiểm thử

`npm run build && npm run build:netlify && npm test`. Mở trang với `?utm_source=qa&utm_campaign=email-test`; nhập dữ liệu ghi rõ “Kiểm Thử Không Liên Hệ”, hoàn tất form và kiểm tra `/cam-on`. Gmail phải nhận đúng số tiền 8.500.000đ, phone, tiếng Việt và nguồn QA. Kiểm tra Inbox/Spam. Kiểm tra lỗi bằng transport mock, không đổi password production để thử lỗi.

Dedup requestId + digest trong cùng instance 30 phút, không giữ PII trong cache. Không bảo đảm exactly-once giữa cold starts; Message-ID ổn định để đối chiếu. SMTP timeout sau khi server đã nhận có thể khiến retry tạo email trùng. Nếu cần bảo đảm cao hơn, thêm kho idempotency phân tán/queue; Gmail có quota riêng. Rate limit không thay thế CAPTCHA khi bị bot phân tán. SMTP accepted chứng minh Gmail nhận thư để xử lý, không chứng minh inbox của người nhận đã hiển thị; kiểm tra hộp thư riêng.

`CONSENT_NOTICE` là override tùy chọn cho email mode; nếu chưa đặt thì dùng nội dung đồng ý đã công bố trong src/config.js. Secret SMTP vẫn bắt buộc. Khi chưa sẵn sàng, /api/config chỉ trả tên biến cấu hình thiếu qua setupRequired, không trả giá trị. Trang cảm ơn hỗ trợ cả /cam-on và /cam-on/ do Netlify Pretty URLs.
