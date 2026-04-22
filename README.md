# ĐẶC TẢ BÀI TOÁN

## 1. Tên bài toán

Xây dựng website bán điện thoại.

## 2. Bối cảnh bài toán

Số lượng sản phẩm trên các nền tảng bán hàng đang ngày càng lớn, khiến người dùng gặp khó khăn trong việc tìm kiếm sản phẩm phù hợp với nhu cầu. 

Từ đó, cần xây dựng một hệ thống cho phép:
lưu trữ dữ liệu sản phẩm,
hiển thị sản phẩm trên giao diện web,
hỗ trợ tìm kiếm, lọc theo tiêu chí,
và tiến tới gợi ý sản phẩm phù hợp hoặc sản phẩm tương tự.

Bài toán này kết hợp giữa quản lý dữ liệu sản phẩm, xây dựng website, và có thể mở rộng sang hệ gợi ý sản phẩm.

## 3. Mục tiêu bài toán

### 3.1. Mục tiêu tổng quát
Xây dựng một hệ thống web có khả năng quản lý dữ liệu sản phẩm và hỗ trợ người dùng tiếp cận sản phẩm nhanh hơn thông qua chức năng hiển thị, tìm kiếm, lọc và gợi ý.

### 3.2. Mục tiêu cụ thể
- Xây dựng cơ sở dữ liệu lưu trữ thông tin sản phẩm.
- Hiển thị danh sách sản phẩm trên website.
- Cho phép người dùng tìm kiếm theo tên hoặc lọc theo loại sản phẩm.
- Cung cấp thông tin cơ bản của sản phẩm như tên, loại, giá.
- Hỗ trợ chức năng gợi ý sản phẩm dựa trên dữ liệu có sẵn.
- Tạo nền tảng để có thể mở rộng thêm các chức năng khác trong tương lai.

## 4. Phát biểu bài toán

Cho trước một tập dữ liệu sản phẩm, trong đó mỗi sản phẩm có các thuộc tính như tên sản phẩm, loại sản phẩm, giá bán và một số thông tin liên quan khác nếu có.

Yêu cầu đặt ra là xây dựng một hệ thống có thể tiếp nhận dữ liệu này, lưu vào cơ sở dữ liệu, xử lý và hiển thị lên giao diện web để người dùng dễ dàng tra cứu.

Ngoài ra, hệ thống cần có khả năng hỗ trợ gợi ý sản phẩm dựa trên đặc điểm dữ liệu, giúp người dùng tìm được sản phẩm phù hợp hơn mà không phải duyệt toàn bộ danh sách.

## 5. Đối tượng của bài toán

### 5.1. Đối tượng dữ liệu
Dữ liệu đầu vào là tập dữ liệu sản phẩm bán hàng, ví dụ gồm các trường:

- Tên sản phẩm
- Loại sản phẩm
- Giá sản phẩm
- Hãng sản xuất (nếu có)
- Đánh giá, số lượng bán, mô tả... (nếu có)

### 5.2. Đối tượng sử dụng hệ thống
- Người quản trị hệ thống: quản lý dữ liệu sản phẩm.
- Người dùng cuối: tìm kiếm, xem và nhận gợi ý sản phẩm.

## 6. Đầu vào của bài toán

Đầu vào của hệ thống là dữ liệu sản phẩm được thu thập từ:
https://www.kaggle.com/datasets/waqi786/mobile-sales-dataset

## 7. Đầu ra của bài toán

Hệ thống cần tạo ra các đầu ra sau:

- Danh sách sản phẩm hiển thị trên website.
- Kết quả tìm kiếm theo từ khóa.
- Kết quả lọc theo loại sản phẩm.
- Thông tin chi tiết của từng sản phẩm.
- Danh sách sản phẩm được gợi ý cho người dùng.

## 8. Yêu cầu chức năng

### 8.1. Chức năng quản lý dữ liệu
- Nhập dữ liệu sản phẩm từ file dataset vào hệ thống.
- Lưu trữ dữ liệu vào cơ sở dữ liệu.
- Cập nhật, thêm, sửa, xóa dữ liệu sản phẩm khi cần.

### 8.2. Chức năng hiển thị sản phẩm
- Hiển thị danh sách sản phẩm trên trang web.
- Hiển thị thông tin cơ bản của sản phẩm: tên, loại, giá.
- Cho phép xem chi tiết từng sản phẩm.

### 8.3. Chức năng tìm kiếm và lọc
- Tìm kiếm sản phẩm theo tên.
- Lọc sản phẩm theo loại.
- Lọc sản phẩm theo mức giá.
- Có thể kết hợp nhiều điều kiện tìm kiếm.

## 9. Yêu cầu phi chức năng

### 9.1. Về tính chính xác
- Dữ liệu hiển thị phải đúng với dữ liệu gốc trong cơ sở dữ liệu.
- Kết quả gợi ý cần có mức độ hợp lý nhất định.

### 9.2. Về khả năng mở rộng
- Có thể bổ sung thêm các trường dữ liệu mới.
- Có thể mở rộng thêm nhiều loại sản phẩm khác nhau.

### 9.3. Về giao diện
- Giao diện cần dễ sử dụng, rõ ràng.
- Thông tin sản phẩm phải được trình bày trực quan.

## 10. Phạm vi bài toán

### 10.1. Phạm vi thực hiện
Trong phạm vi đề tài, hệ thống tập trung vào:

- Quản lý dữ liệu sản phẩm
- Hiển thị dữ liệu trên web
- Tìm kiếm và lọc sản phẩm
- Xây dựng chức năng gợi ý ở mức cơ bản

### 10.2. Phạm vi chưa thực hiện
- Chưa xử lý thanh toán trực tuyến
- Chưa triển khai quản lý tài khoản người dùng nâng cao
- Chưa tối ưu gợi ý cá nhân hóa theo người dùng



