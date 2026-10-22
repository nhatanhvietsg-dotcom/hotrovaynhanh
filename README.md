# Hỗ Trợ Vay Vốn

Landing page tiếng Việt, nhận diện navy–teal, HTML render sẵn và JavaScript thuần. Không có runtime dependency; một Cloudflare Worker phục vụ trang, asset và API. Font Be Vietnam Pro được lưu tại dự án; ảnh stock chuyển WebP.

## Bản cập nhật theo thiết kế

Layout đã được dựng lại theo ảnh tham chiếu do người dùng cung cấp. Xem `DESIGN.md` cho cấu trúc mới, danh sách ảnh ImageGen và bộ prompt. Trang giới thiệu nằm tại `/gioi-thieu`. Số tiền mặc định là 8.500.000đ.

## Cấu trúc

- `src/config.js`: brand, hạn mức, bước tiền, mục đích, điều kiện, pháp nhân và đối tác.
- `src/components.js`: các section và form dùng chung.
- `src/pages.js`: trang chủ, trang cảm ơn, trang pháp lý và SEO.
- `public/styles.css`, `public/app.js`: responsive, modal, validation, tracking và consent cookie.
- `worker/index.js`: `/api/config`, `/api/leads`, kiểm tra dữ liệu server và adapter webhook.
- `scripts/build.mjs`: kết xuất HTML và đóng gói asset vào một Worker ESM.
- `tests/api.test.mjs`: kiểm thử route, validation, chống spam cơ bản và webhook.

## Chạy

Node.js 22 trở lên. Không cần cài package.

```sh
npm run build
npm test
npm run validate
npm run dev
```

Mở http://127.0.0.1:4173. Sau thay đổi cần build và khởi động lại preview. `dist/` là output, không sửa trực tiếp. Hosting manifest nằm tại `.openai/hosting.json`.

## Tình trạng bàn giao

Bản triển khai là bản trải nghiệm riêng tư, chưa phải hệ thống tiếp nhận hồ sơ công khai trên hotrovaynhanh.com. Form 4 bước hoạt động đầy đủ nhưng **không gửi họ tên, điện thoại hoặc email trong chế độ demo**. Thông tin chỉ ở bộ nhớ trang; không lưu PII vào localStorage/sessionStorage. Trang kết quả ghi rõ đây là trải nghiệm, không có hồ sơ thật được gửi, không có đề xuất hoặc kết quả phê duyệt giả.

Robots và HTTP X-Robots-Tag hiện chặn lập chỉ mục trong khi `legalApproved=false`. Canonical, OG/X, WebSite, FAQ schema và sitemap đã chuẩn bị cho domain thật. FAQ schema không bảo đảm Google hiển thị rich result.

Các trang pháp lý là khung dự thảo có nhãn rõ ràng; không tự bịa pháp nhân, giấy phép, địa chỉ hoặc đầu mối hỗ trợ. Các placeholder chỉ nằm trong config. Chưa gắn DNS/custom domain. Chưa có ID analytics thật hoặc đối tác thật.

## Bật tiếp nhận hồ sơ thật

1. Hoàn thiện và phê duyệt pháp nhân, đầu mối hỗ trợ, chính sách riêng tư, điều khoản, thời gian lưu trữ, quy trình thực hiện quyền, quy trình chuyển dữ liệu và đối tác; cập nhật nội dung trong `src/pages.js` và thông tin ở config/footer.
2. Hoàn thiện tiêu chí matching có thật. Mục đích sử dụng là câu hỏi duy nhất ở bước 3 hiện tại, chưa có scoring hay đánh giá khả năng tín dụng. `partners` rỗng; chỉ thêm đối tác đã xác nhận. Nếu trả gợi ý theo hồ sơ, cần triển khai matching server trước khi công bố.
3. Triển khai hệ thống nhận hồ sơ do đơn vị vận hành quản lý, có lưu trữ an toàn và idempotency. Thiết lập biến môi trường server theo `.env.example`: `LEAD_MODE=live`, `LEAD_WEBHOOK_URL` (HTTPS), `LEAD_WEBHOOK_TOKEN`, `CONSENT_VERSION`, `CONSENT_NOTICE` mô tả chính xác bên nhận và quá trình xử lý dữ liệu.
4. Khi các chính sách đã có hiệu lực, đổi `legalApproved=true`. Live mode yêu cầu cả cờ này và consent notice; thiếu webhook thì API trả lỗi 503, không báo thành công.
5. Khi công khai trên domain thật, bỏ Disallow trong robots.txt, kiểm tra lại canonical/OG/sitemap, noindex của legal pages và cấu hình DNS/SSL.

### Hợp đồng webhook

POST JSON, Authorization Bearer nếu cấu hình token; `Idempotency-Key` là request UUID, được giữ nguyên khi người dùng thử lại. Payload gồm `requestId, fullName, phone, email, amount, purpose, consent, consentVersion, consentNotice, consentedAt`. Phải kiểm tra, lưu và deduplicate theo requestId tại bên nhận. Chỉ sau khi lưu thành công trả HTTP 2xx với `{ "accepted": true, "id": "lead_123" }`. ID chỉ chứa a-z, A-Z, 0-9, gạch dưới hoặc gạch ngang, tối đa 100 ký tự. Trang cảm ơn chỉ xuất hiện sau xác nhận này. Timeout/lỗi giữ dữ liệu ở form để thử lại; không tự động báo đã duyệt.

Không có database hồ sơ trong Worker hiện tại. Rate limit 6 lần/phút/IP trong bộ nhớ **mỗi isolate**, không phải giới hạn phân tán; cần WAF/Turnstile hoặc rate limiter phân tán ở hạ tầng thật trước khi chạy quảng cáo. Honeypot, thời gian điền tối thiểu, JSON size limit, same-origin và backend validation đã có. Không log PII.

## Analytics

`GTM_ID`, `GA_ID`, `META_PIXEL_ID` là ID công khai, lấy qua `/api/config`; secret webhook chỉ tồn tại server. Chưa cấu hình thì không tải script third-party. Chỉ tải analytics sau opt-in. Nếu có GTM, dùng GTM để quản lý GA thay vì tải GA trực tiếp song song. Không cấu hình trình quản lý thẻ đọc input form, gửi PII hay tự thu thập dữ liệu người dùng.

Sự kiện: hero_cta_click, amount_changed, form_started, form_step_completed, form_submit, lead_success, partner_offer_view, partner_redirect, faq_open, final_cta_click. Chỉ allowlist event và số tiền, chỉ số step/FAQ/đối tác, mode; không gửi chuỗi nhập tự do. `lead_success` có mode demo/live để loại thử nghiệm khỏi báo cáo. Đổi cookie về chỉ cần thiết sẽ dừng tracking và tải lại trang.

## Hình ảnh

Ảnh Pexels (stock minh họa, không phải khách hàng hoặc chứng thực):

- Antonius Ferret, [5253850](https://www.pexels.com/photo/woman-holding-her-phone-5253850/): portrait/work.
- Pavel Danilyuk, [7190922](https://www.pexels.com/photo/a-woman-using-a-smartphone-7190922/): hero/about.
- Yan Krukau, [6209632](https://www.pexels.com/photo/a-woman-using-her-phone-at-home-6209632/): home.
- Zen Chung, [5538624](https://www.pexels.com/photo/young-asian-woman-surfing-smartphone-while-working-on-project-at-home-5538624/): study.

Font Be Vietnam Pro: Google Fonts, SIL Open Font License. Không có asset/nội dung nguyên văn từ website tham khảo. SVG icon và logo được dựng riêng.

## Kiểm tra

Xem `QA.md` để biết kiểm tra đã thực hiện và giới hạn xác minh. Script browser-qa.cjs là kịch bản tự động tùy chọn cho môi trường có Playwright/Chromium, chưa chạy hoàn tất tại máy bàn giao. Không có Lighthouse score được xác nhận.

## Netlify

Chạy `npm run build:netlify`; `netlify.toml` cấu hình build, publish `netlify-dist` và Functions. Trang/ảnh được phục vụ qua CDN; `/api/config` và `/api/leads` dùng lại validation và webhook adapter hiện có. Biến môi trường đặt trong Netlify với scope Functions, không đưa secret vào repository. Chế độ demo và chặn lập chỉ mục vẫn giữ nguyên. Cấu hình Sites cũ được giữ để có thể tiếp tục dùng bản riêng tư.
