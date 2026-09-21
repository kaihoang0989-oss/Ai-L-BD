# AI LÀ GIÁN ĐIỆP — bản online 6 người

Game realtime lấy cảm hứng từ cơ chế "Who's the Spy/Who is Undercover": đa số nhận cùng một từ khóa, gián điệp nhận một từ liên quan nhưng khác; mỗi người mô tả, sau đó bỏ phiếu. Đây là bản game riêng, không sao chép giao diện/tài sản của WePlay.

## Luật của bản này

- Đúng 6 người.
- 4 người dân + 2 gián điệp.
- Người dân cùng một từ khóa.
- 2 gián điệp cùng một từ khóa khác nhưng có liên quan.
- Mỗi lượt nói đúng 1 câu, tối đa 120 ký tự.
- Không được nói trực tiếp từ khóa.
- Sau khi 6 người nói, tất cả người còn sống bỏ phiếu.
- Người có nhiều phiếu nhất bị loại.
- Nếu hòa, có một vòng bỏ phiếu lại giữa những người hòa.
- Nếu vẫn hòa, không ai bị loại và sang vòng mới.
- Người dân thắng khi cả 2 gián điệp bị loại.
- Gián điệp thắng khi số gián điệp còn sống >= số người dân còn sống.
- Nếu một người rời phòng giữa ván, ván kết thúc để tránh kẹt lượt.

## Chạy trên máy

Cần Node.js 18+.

```bash
npm install
npm start
```

Mở:
http://localhost:3000

## Cho bạn bè chơi qua Internet

Cách đơn giản là deploy project này lên một dịch vụ Node.js có public URL (ví dụ Render/Railway/Fly.io).

Build command:
```bash
npm install
```

Start command:
```bash
npm start
```

Không cần database cho bản đầu tiên: trạng thái phòng nằm trong RAM của server. Vì vậy nếu server restart thì các phòng đang chơi mất.

## Lưu ý để làm bản production

Nên thêm:
- Redis adapter nếu chạy nhiều server instance.
- Database để lưu tài khoản/lịch sử.
- reconnect/resume khi mất mạng.
- host chuyển quyền.
- chống spam/rate limit.
- HTTPS.
- bộ từ khóa quản trị được.
- timer cho từng lượt.
- chat/voice nếu cần.
- kiểm soát gian lận khi một thiết bị được nhiều người chuyền tay.

## Cấu trúc

- `server.js`: Express + Socket.IO, phòng và luật game.
- `public/index.html`: giao diện mobile + logic client.

## Deploy nhanh bằng Render

1. Tạo một repository mới trên GitHub.
2. Upload toàn bộ file trong thư mục này lên repository.
3. Trong Render chọn **New → Web Service**, kết nối repository.
4. Render sẽ đọc `render.yaml` hoặc bạn đặt:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Sau khi deploy, Render cấp một URL dạng:
   `https://ten-game.onrender.com`
6. Gửi URL đó cho bạn bè. Mỗi người mở URL, nhập tên và nhập cùng mã phòng.

Bản này không cần frontend riêng và không cần database cho MVP.
