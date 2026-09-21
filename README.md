# AI LÀ CON BÓNG CHÚA 🌈

Game social deduction realtime fan-made bằng Node.js + Express + Socket.IO.

## Chế độ chơi
- 4 người: 1 Con Bóng + 3 Người Thường
- 6 người: 2 Con Bóng + 4 Người Thường
- 8 người: 2 Con Bóng + 6 Người Thường

Chủ phòng chọn chế độ khi tạo phòng hoặc đổi chế độ trong lobby. Phòng chỉ bắt đầu khi đủ đúng số người.

## Chạy local
```bash
npm install
npm start
```
Mở http://localhost:3000

## Lưu ý
- Room state lưu trong RAM; restart server sẽ mất phòng đang chơi.
- Speech dùng giọng tổng hợp của trình duyệt.
- Hiệu ứng ném gạch/xịt nước chỉ là tương tác vui trong game, không gây thương tích thật.


## Danh xưng vai trò v5
- Người thường nhận danh xưng riêng: "Con bê đê số 1", "Con bê đê số 2", ...
- Người thuộc phe bóng nhận danh xưng: "Con bóng chúa".
- Tên người chơi thật vẫn được giữ trong phòng chờ để mọi người nhận diện và bình chọn.
