# Kịch bản kiểm thử API Student (Student API Test Scenarios)

Dưới đây là tài liệu mô tả chi tiết các kịch bản kiểm thử (Test Cases) đã được tự động hóa cho chức năng quản lý Sinh viên (Student API) trong hệ thống Frappe.

## 1. Môi trường và Tiền đề (Setup & Teardown)
- **Setup**: Trước khi chạy mỗi kịch bản, hệ thống sẽ tự động dọn dẹp các dữ liệu rác (xóa các sinh viên có email thử nghiệm dạng `test_%@example.com`) để đảm bảo kết quả không bị ảnh hưởng bởi dữ liệu cũ.
- **Teardown**: Sau khi mỗi kịch bản kết thúc, hệ thống cũng sẽ chủ động xóa sạch dữ liệu sinh viên thử nghiệm vừa tạo để trả lại môi trường sạch.

---

## 2. Các kịch bản kiểm thử (Test Scenarios)

### Kịch bản 1: Tạo mới và lấy thông tin sinh viên (Create & Get)
- **Mục tiêu**: Kiểm tra tính năng tạo mới sinh viên thông qua API `create_student` và truy xuất dữ liệu qua API `get_student`.
- **Các bước thực hiện**:
  1. Gửi request tạo sinh viên mới với tên `Test Student 1` và email `test_1@example.com`.
  2. Xác nhận API trả về thông báo thành công và kèm theo `name` của sinh viên.
  3. Dùng `name` trả về để gọi API `get_student` lấy thông tin chi tiết từ Database.
- **Kết quả mong muốn (Expected Result)**:
  - API trả về thành công và có `name` (ID).
  - Thông tin sinh viên trả về qua hàm Get khớp chính xác với tên `Test Student 1` và email `test_1@example.com`.

### Kịch bản 2: Cập nhật thông tin sinh viên (Update)
- **Mục tiêu**: Đảm bảo API `update_student` cập nhật đúng dữ liệu (đặc biệt là xử lý trường hợp khóa chính `student_name` bị thay đổi).
- **Các bước thực hiện**:
  1. Tạo sẵn một sinh viên có tên `Test Student 2` và email `test_2@example.com`.
  2. Gọi API cập nhật để đổi tên sinh viên thành `Updated Test Student 2`.
  3. Lấy lại ID (name) mới do API update trả về.
  4. Gọi API `get_student` bằng ID mới để truy xuất lại thông tin.
- **Kết quả mong muốn (Expected Result)**:
  - Thông báo trả về báo thành công.
  - Bản ghi trong CSDL đã được đổi tên (renamed) thành `Updated Test Student 2`.
  - Email vẫn được bảo toàn nguyên vẹn là `test_2@example.com`.

### Kịch bản 3: Xóa sinh viên (Delete)
- **Mục tiêu**: Kiểm tra việc xóa vĩnh viễn dữ liệu sinh viên qua API `delete_student`.
- **Các bước thực hiện**:
  1. Tạo một sinh viên thử nghiệm với tên `Test Student 3`.
  2. Gọi API `delete_student` với tham số là ID (name) của sinh viên vừa tạo.
  3. Kiểm tra lại sự tồn tại của ID đó trực tiếp trong Database (`frappe.db.exists`).
- **Kết quả mong muốn (Expected Result)**:
  - API trả về thông báo "Student deleted successfully".
  - Hàm check DB trả về kết quả `False` (bản ghi đã hoàn toàn bị xóa khỏi hệ thống).

### Kịch bản 4: Lấy danh sách toàn bộ sinh viên (Get All)
- **Mục tiêu**: Kiểm tra API `get_all_students` có thể truy xuất và trả về danh sách chính xác không.
- **Các bước thực hiện**:
  1. Tạo liên tiếp 2 sinh viên mới (`Test Student 4` và `Test Student 5`).
  2. Gọi API `get_all_students`.
  3. Duyệt qua mảng kết quả trả về để đối chiếu các email.
- **Kết quả mong muốn (Expected Result)**:
  - Mảng dữ liệu trả về có số lượng phần tử lớn hơn hoặc bằng 2.
  - Trong danh sách các email thu về, chắc chắn phải xuất hiện cả `test_4@example.com` và `test_5@example.com`.

### Kịch bản 5: Xử lý ngoại lệ khi dữ liệu không hợp lệ hoặc không tồn tại (Negative/Edge Cases)
- **Mục tiêu**: Kiểm tra hệ thống có bắt được các lỗi phổ biến từ phía người dùng hay không và trả về các HTTP errors hoặc exception hợp lý.
- **Các bước thực hiện & Kết quả mong muốn**:
  1. **Get Not Found**: Gọi API `get_student` với một ID không tồn tại (`Non_Existent_Student_123`). 
     - *Kết quả*: API sinh ra lỗi `frappe.DoesNotExistError`.
  2. **Create Missing Fields**: Gọi API `create_student` nhưng cố tình truyền thiếu `student_name` (trường bắt buộc).
     - *Kết quả*: Hệ thống chặn lại và sinh ra lỗi xác thực `frappe.exceptions.ValidationError`.
  3. **Update Not Found**: Gọi API `update_student` với một ID không tồn tại.
     - *Kết quả*: Trả về lỗi `frappe.DoesNotExistError`.
  4. **Delete Not Found**: Gọi API `delete_student` với một ID không tồn tại.
     - *Kết quả*: Trả về lỗi `frappe.DoesNotExistError`.

---

## 3. Hướng dẫn chạy bộ Unit Test

Bạn có thể chạy toàn bộ kịch bản kiểm thử trên bằng dòng lệnh sau tại thư mục `frappe-bench`:

```bash
bench --site localhost set-config allow_tests true
bench --site localhost run-tests --module school_app.api.test_student_api
```
