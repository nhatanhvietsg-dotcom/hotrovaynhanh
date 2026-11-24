# Cập nhật rà soát — 24/11/2026

**Đã sửa các phần có căn cứ. Chưa đủ công bố khoản vay cá nhân để xác nhận sẵn sàng Google Ads.**

Đã đọc [chính sách Google chính thức](https://support.google.com/adspolicy/answer/15188216?hl=vi) trước khi sửa. Chính sách áp dụng cả website tìm khách/giới thiệu khoản vay; phải công bố nổi bật kỳ hạn min/max, APR tối đa tách riêng và ví dụ toàn bộ chi phí. Chỉ quảng bá khoản vay hoàn trả toàn bộ từ 61 ngày trở lên.

## Thay đổi trong đợt này

| Vị trí | Trước sửa trên production | Sau sửa |
|---|---|---|
| Khối “Thông tin tham khảo” | 6–100 triệu, 6–36 tháng; 2,1%/tháng, 25%/năm; ví dụ 10 triệu, khoảng 950.000đ/tháng; thiếu APR/phí; vẫn có điều kiện Viettel dù CMS bỏ tên ở tiêu đề | Gỡ toàn bộ khỏi trang và cấu hình CMS vì chưa chứng minh sản phẩm liên quan hoặc đủ chi phí; không thay bằng số giả hoặc placeholder |
| Phạm vi dịch vụ, FAQ và JSON-LD FAQ | Nhắc “thông tin tham khảo có dẫn nguồn” | Bỏ tham chiếu đến khối đã gỡ; giữ mô tả tiếp nhận tư vấn, không phải hạn mức phê duyệt |
| Ghi chú hero | Ghi chú miễn phí và không bảo đảm vay ở nhiều câu | “Miễn phí gửi yêu cầu tư vấn. Khoản vay có thể phát sinh lãi và phí. Việc gửi thông tin không bảo đảm được cấp khoản vay.” |
| Form | Chưa có mô tả đầy đủ vai trò ở đầu; ghi chú ngắn; form không khai báo method/action | Thêm mô tả dịch vụ đã công bố và ghi chú thống nhất; khai báo POST /api/leads để tránh fallback GET đưa dữ liệu vào URL khi JS lỗi |
| Chữ trên desktop/mobile | Ghi chú form có breakpoint 7–8px, consent 10px | Ghi chú, consent và lưu ý 14px; mô tả/phạm vi dịch vụ 16px |
| Cookie banner | Cố định đè lên trang | Đưa vào luồng trang, giữ hai lựa chọn, không che nội dung |
| Công bố khoản vay mới | Chưa có dữ liệu cùng một sản phẩm | Tạo drafts/loan-disclosure.json và drafts/loan-disclosure.html nội bộ, không nằm trong public hoặc output build |

H1/title/meta, CTA, thông báo thành công, thông tin vận hành và các trang điều khoản/bảo mật đã dùng nội dung tư vấn phù hợp trước đợt này, được rà soát lại. Không ghi nhận các phần có sẵn là thay đổi mới. Giữ nguyên thay đổi CMS trên main và chỉ xóa nhóm thông tin khoản vay không có căn cứ.

## Tình trạng công bố

| Công bố | Kết quả |
|---|---|
| Vai trò website, không cho vay/xét duyệt/giải ngân; gửi yêu cầu miễn phí, không bảo đảm cấp vay | Có, thống nhất giữa trang chủ, form, FAQ, footer và chính sách |
| Người vận hành, địa chỉ, hotline/email | Thống nhất với CMS production: Trần Thị Yến Nhi; 19 Nguyễn Hữu Cảnh, Phường Thạnh Mỹ Tây, TP.HCM; 0938443655; thienhuongnguyen1010@gmail.com. Chưa có xác nhận mới hoặc giấy tờ chứng minh từ chủ website; không suy ra giấy phép kinh doanh |
| Tên sản phẩm và pháp nhân cho vay thực tế | Chưa có chứng cứ |
| Số tiền min/max và kỳ hạn min/max; hoàn trả toàn bộ từ 61 ngày | Chưa có tài liệu sản phẩm. Thanh trượt 500.000–30.000.000đ chỉ là nhu cầu tư vấn |
| APR tối đa riêng biệt và cách tính được bên cho vay xác nhận | Chưa có |
| Lãi suất, cách tính, tất cả phí và bảo hiểm bắt buộc/tùy chọn | Chưa có |
| Ví dụ cùng sản phẩm: tiền hợp đồng, tiền thực nhận, từng kỳ, từng phí, tổng lãi/chi phí/tổng trả | Chưa có |
| Phí chậm trả và tất toán sớm, điều kiện/công thức, tách khỏi trả đúng hạn | Chưa có |

Cần chủ website cung cấp tài liệu chính thức sản phẩm đang tư vấn, bảng APR/lãi/phí/bảo hiểm có ngày hiệu lực, lịch dòng tiền và ví dụ bên cho vay xác nhận; bằng chứng thực tế giới thiệu sản phẩm/quyền hợp tác nếu có. Xác nhận lại thông tin chủ thể vận hành và quy trình tư vấn/chuyển dữ liệu ngoài website. Mã nguồn chỉ chứng minh hiện gửi qua Netlify/Gmail, không chứng minh cách nhân sự xử lý sau khi nhận email.

## Kiểm tra

- Hai build (Worker preview và Netlify) thành công; 28/28 kiểm thử Node qua, gồm SMTP mock, từ chối dữ liệu không hợp lệ, consent, lỗi dịch vụ, chống trùng, không lộ secret và gỡ số liệu không có căn cứ.
- Browser thực tế tại localhost: 360, 390, 768, 1440px không tràn ngang. Kiểm tra 390×844 và desktop; mô tả dịch vụ 16px, ghi chú/consent 14px. Cookie banner ở luồng trang; form không bị nút liên hệ hoặc sticky CTA che.
- Form: checkbox chưa tích; chưa đồng ý bị chặn; SMTP giả lập lỗi trả thông báo lỗi và giữ form. Gửi lại được máy chủ mock xác nhận mới chuyển /cam-on, hiển thị đúng “Đã tiếp nhận yêu cầu tư vấn. Đây không phải thông báo phê duyệt khoản vay. Bộ phận hỗ trợ sẽ liên hệ theo thông tin bạn cung cấp.” URL kết quả không có tên/phone/email. Không gửi lead/email thật.
- Frontend không lưu tên/phone/email vào storage, không đưa vào sự kiện đo lường. API chỉ nhận qua POST, pageUrl bỏ query/hash. Cần kiểm tra lại container GTM nếu chủ website bổ sung tag hoặc tính năng tự thu dữ liệu sau này.
- Chưa có quyền đọc tài khoản Google Ads: không xác nhận được URL cuối cùng, tracking template, chuỗi chuyển hướng hoặc cấu hình chiến dịch thực tế. Tham số UTM/GCLID kiểm thử không thay thế kiểm tra URL quảng cáo trong tài khoản.

## Website tham khảo theo yêu cầu

- [Vaymeo.vn](https://vaymeo.vn/): chỉ tham khảo bố cục/giọng văn. APR, kỳ hạn, ví dụ và đối tác thuộc website đó, không chứng minh sản phẩm của hotrovaynhanh.com.
- [taichinhnhanh24h.net](https://taichinhnhanh24h.net/): ảnh người dùng cho thấy quảng cáo được tài trợ về vay doanh nghiệp. Trang có khối APR tối đa 20%/năm và kỳ hạn 12–60 tháng, trong khi công cụ ước tính cho chọn 6–420 tháng. Còn các tuyên bố giải ngân 24–48h, 98% duyệt, hơn 30 đối tác chưa được xác minh trong đợt này. Không dùng làm căn cứ cho số liệu/khẳng định của website đang sửa. Không kết luận website tham khảo tuân thủ hoặc vi phạm toàn bộ chỉ từ quan sát này.

## Xét duyệt lại

Chỉ sau khi có đủ tài liệu, công bố khối “Thông tin khoản vay và tổng chi phí” trực tiếp trước form trên đúng trang đích, kiểm tra mobile và URL/tham số/chuyển hướng thực tế, mới vào Google Ads chọn quảng cáo bị từ chối → Kháng nghị/Yêu cầu xem xét → **“Đã thực hiện các thay đổi để tuân thủ chính sách”** (nhãn có thể được giao diện diễn đạt tương đương). Không chọn lý do nhầm lẫn nếu thực tế vừa sửa trang. Google quyết định kết quả xét duyệt; thay câu chữ không bảo đảm được duyệt.

---

Lịch sử các đợt trước (các số liệu tham khảo bên dưới đã bị gỡ khỏi website trong đợt 24/11):

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

Lịch sử (đã gỡ ngày 24/11/2026): đã đối chiếu ảnh với https://viettelmoney.vn/service/fecredit/ và thêm mục tham khảo FE CREDIT qua Viettel Money: 6–100 triệu, 6–36 tháng, tối thiểu 2,1%/tháng theo dư nợ giảm dần, điều kiện nguồn và ví dụ 10 triệu/12 tháng với các số làm tròn. Không thêm logo, không tuyên bố quan hệ đối tác, không gắn form với sản phẩm, không đổi phạm vi tiền trên form tư vấn. Phân biệt lãi suất tối thiểu với APR tối đa, công khai rằng nguồn chưa đủ APR tối đa/phí/bảo hiểm cho ví dụ. Mục tham khảo này không khắc phục các dữ liệu và bằng chứng còn thiếu đã liệt kê, không tạo kết luận sẵn sàng chạy Google Ads.
