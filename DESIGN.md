# Thiết kế theo ảnh tham chiếu

Nguồn bố cục: ảnh `Landing page tài chính hiện đại Việt Nam.png` do người dùng cung cấp ngày 16/10/2026. Trang được dựng bằng HTML/CSS và JavaScript, không dùng screenshot làm nền hoặc ảnh toàn trang.

Đã thay bố cục hero, card lợi ích có ảnh, khối quy trình có ảnh nam áo xanh lá, các tình huống sử dụng, khối cặp đôi và quyết định có trách nhiệm, điều kiện có icon minh họa, FAQ có ảnh bên trái, CTA cuối và footer. Số tiền mặc định là 8.500.000đ theo ảnh; mọi giá trị vẫn lấy từ config.

Nội dung giới thiệu được chuyển sang `/gioi-thieu` và liên kết từ footer để giữ thứ tự section theo ảnh. Thông tin quan trọng nằm trong mục mở rộng tại footer và route riêng. Không thêm liên kết mạng xã hội giả khi chưa có địa chỉ tài khoản.

## Bộ ảnh

Sáu ảnh minh họa được tạo bằng công cụ ImageGen tích hợp, dùng ảnh thiết kế làm tham chiếu về bối cảnh và bố cục. Đây là nhân vật minh họa do AI tạo, không phải khách hàng hoặc chứng thực. Bản gốc vẫn nằm trong thư mục generated_images; bản WebP đã tối ưu nằm tại dự án:

| Asset cuối | Prompt tạo ảnh (scene brief) |
| --- | --- |
| `public/assets/design-hero.webp` | Photorealistic-natural; wide 3:2 Vietnamese woman age28, long dark hair, pale blue button-down blouse, smiling down at smartphone held in both hands, silver laptop lower left, bright plant-filled modern home cafe, subject in right two-thirds, warm premium commercial daylight photography. Standalone photo, no UI, text, borders, logo or watermark. Match top-right hero photo of provided design. |
| `public/assets/design-steps.webp` | Photorealistic-natural; square Vietnamese man age28, dark side-parted hair, sage green open overshirt over white t-shirt, sitting at warm bright cafe and smiling down at smartphone held with both hands, face upper center and phone lower right, plants and wood in background. No text, arrows, UI, numbers, logo, watermark or borders. Match process-section man of reference. |
| `public/assets/design-couple.webp` | Photorealistic-natural; wide 3:2 young Vietnamese couple age28-32, man in off-white linen button-up on left, woman in cream sweater on right, seated close together smiling down at silver laptop on wooden table, green plant on left, sunlit warm wood home. No text, UI or watermark. Match responsible-decision photograph of reference. |
| `public/assets/design-travel.webp` | Wide 3:2 natural lifestyle photo, young Vietnamese woman in light straw sunhat and pale blue blouse smiling at smartphone at cafe table, blue upright suitcase beside her, bright airy cafe, plants, premium natural daylight. Travel personal-needs card scene in reference. No text, UI, borders, watermark or logo. |
| `public/assets/design-family.webp` | Wide 3:2 photorealistic Vietnamese father age32 in soft gray shirt at wooden table beside daughter age7, smiling and working together with notebook and silver laptop, sunlit modern home, green plants, warm cream and wood palette, medium framing. Fourth use-case card of reference. Clean photograph, no text, graphics, watermark or logo. |
| `public/assets/design-faq.webp` | Wide 4:3 commercial lifestyle photograph, Vietnamese woman age28 with long dark brown hair and pale blue blouse, holding smartphone in right hand and left fingertips lightly against cheek, looking up right with thoughtful gentle smile, plant-filled cafe, warm beige and green, subject on left half. Match FAQ photo in reference. No text, question marks, UI cards, watermark or border. |

Logo và icon là SVG/CSS. Các nét vẽ và card nổi là HTML/CSS, không đóng cứng vào ảnh. Ảnh stock cũ `work.webp` được dùng dưới lớp icon khiên của card bảo mật.
