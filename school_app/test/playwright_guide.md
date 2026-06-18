# Hướng dẫn Cài đặt, Sử dụng & Kịch bản Playwright E2E Testing

Tài liệu này hướng dẫn cách cài đặt và sử dụng Playwright để chạy các bài test End-to-End (E2E) tự động hóa giao diện cho dự án Frappe `school_app`.

## 1. Cách Cài Đặt (Installation)

Playwright là một framework testing bằng Node.js. Để cài đặt vào app, thực hiện các bước sau tại thư mục gốc của app (`apps/school_app`):
# Hướng dẫn Cài đặt, Sử dụng & Kịch bản Playwright E2E Testing

Tài liệu này hướng dẫn cách cài đặt và sử dụng Playwright để chạy các bài test End-to-End (E2E) tự động hóa giao diện cho dự án Frappe `school_app`.

## 1. Cách Cài Đặt (Installation)

Playwright là một framework testing bằng Node.js. Để cài đặt vào app, thực hiện các bước sau tại thư mục gốc của app (`apps/school_app`):

### Bước 1: Khởi tạo Playwright
Chạy lệnh sau để tải và cấu hình Playwright (nếu dự án chưa được cài):
```bash
cd /home/hunganh/frappe-bench/apps/school_app
npm init playwright@latest
```
*(Quá trình này tự động sinh ra file `playwright.config.ts`, `package.json` và thư mục `tests/`)*

### Bước 2: Cài đặt System Dependencies (Rất quan trọng)
Playwright cần chạy trên các trình duyệt ảo và đòi hỏi các thư viện hệ thống của Ubuntu (như `libnspr4.so`). Bạn bắt buộc phải chạy lệnh này bằng quyền `sudo` trên WSL để đáp ứng môi trường:
```bash
sudo npx playwright install-deps
```

---

## 2. Kịch Bản E2E Test (Test Scenarios)

File script test: `tests/student_dashboard.spec.ts`

Kịch bản này mô phỏng toàn bộ hành vi của một người dùng thực tế tương tác với giao diện Student Dashboard theo một luồng liền mạch từ đầu tới cuối.

### Bước 1: Auto Login (Đăng nhập tự động)
- **Hành động**: Tự động mở URL `/login`, điền ID/Mật khẩu (mặc định Administrator/admin) và nhấp "Login".
- **Xác thực**: Chờ và đảm bảo hệ thống chuyển hướng thành công đến không gian làm việc chính của Frappe (`/app` hoặc `/desk`).

### Bước 2: Create Student (Tạo sinh viên)
- **Hành động**: Mở URL `/app/student-dashboard`, nhấp vào nút "New Student".
- **Hành động**: Điền tên sinh viên ngẫu nhiên (gắn kèm theo timestamp để không bao giờ bị trùng lặp) và email vào form Dialog, sau đó nhấn "Create".
- **Xác thực**: Kiểm tra thông báo pop-up `Student created successfully` xuất hiện trên màn hình.
- **Xác thực**: Kiểm tra giao diện danh sách sinh viên đã hiển thị một thẻ (card) mang tên sinh viên vừa tạo.

### Bước 3: Update Student (Sửa sinh viên)
- **Hành động**: Tìm chính xác thẻ sinh viên vừa tạo ở Bước 2, bấm nút "Edit" gắn trực tiếp trên thẻ đó.
- **Hành động**: Đổi tên sinh viên trong Modal thành tên mới (kèm chữ Updated) và bấm "Update".
- **Xác thực**: Kiểm tra thông báo pop-up `Student updated successfully` xuất hiện.
- **Xác thực**: Đảm bảo thẻ sinh viên cũ đã biến mất và thay thế bằng thẻ hiển thị tên mới.

### Bước 4: Delete Student (Xóa sinh viên)
- **Hành động**: Tìm thẻ sinh viên mang tên mới, bấm nút "Delete" màu đỏ.
- **Hành động**: Bấm nút "Yes" trên hộp thoại xác nhận (confirm dialog) của Frappe để chắc chắn xóa.
- **Xác thực**: Kiểm tra thông báo pop-up `Student deleted successfully` xuất hiện.
- **Xác thực**: Xác minh rà soát lại trên DOM để đảm bảo thẻ sinh viên này không còn tồn tại trên giao diện danh sách.

---

## 3. Cách Sử Dụng (Usage)

**Lưu ý**: Luôn di chuyển vào thư mục `apps/school_app` trước khi gõ lệnh.

### Chạy test chế độ ngầm (Headless Mode)
Trình duyệt thao tác ngầm bên dưới (tốc độ nhanh nhất, lý tưởng cho Server):
```bash
npx playwright test tests/student_dashboard.spec.ts
```

### Chạy test chế độ có giao diện (Headed Mode)
Trình duyệt sẽ hiển thị lên màn hình để bạn tận mắt nhìn thao tác tự động:
```bash
npx playwright test tests/student_dashboard.spec.ts --headed
```

### Chỉ chạy trên trình duyệt Chromium
Mặc định Playwright chạy cả 3 trình duyệt (Chrome, Firefox, WebKit). Để chạy nhanh gọn trên Chrome:
```bash
npx playwright test tests/student_dashboard.spec.ts --project=chromium --headed
```

### Xem Báo cáo Kết quả (HTML Report)
Sinh ra một báo cáo phân tích chi tiết về kết quả (Passed/Failed), log báo lỗi, hình ảnh:
```bash
npx playwright show-report
```

---

## 4. Mẹo xịn sò (Tips)
- **Chế độ Debug (UI Inspector)**: Tạm dừng bài test ở từng dòng lệnh để soi xét trạng thái HTML thay đổi thế nào.
  ```bash
  npx playwright test tests/student_dashboard.spec.ts --debug
  ```
- **Chế độ Record Code (Codegen)**: Bạn không rành code? Bật tính năng này lên, tự tay click chuột trên màn hình web, hệ thống sẽ tự động gõ mã lệnh TypeScript cho bạn:
  ```bash
  npx playwright codegen http://localhost:8000/login
  ```

### Bước 1: Khởi tạo Playwright
Chạy lệnh sau để tải và cấu hình Playwright (nếu dự án chưa được cài):
```bash
cd /home/hunganh/frappe-bench/apps/school_app
npm init playwright@latest
```
*(Quá trình này tự động sinh ra file `playwright.config.ts`, `package.json` và thư mục `tests/`)*

### Bước 2: Cài đặt System Dependencies (Rất quan trọng)
Playwright cần chạy trên các trình duyệt ảo và đòi hỏi các thư viện hệ thống của Ubuntu (như `libnspr4.so`). Bạn bắt buộc phải chạy lệnh này bằng quyền `sudo` trên WSL để đáp ứng môi trường:
```bash
sudo npx playwright install-deps
```

---

## 2. Kịch Bản E2E Test (Test Scenarios)

File script test: `tests/student_dashboard.spec.ts`

Kịch bản này mô phỏng toàn bộ hành vi của một người dùng thực tế tương tác với giao diện Student Dashboard theo một luồng liền mạch từ đầu tới cuối.

### Bước 1: Auto Login (Đăng nhập tự động)
- **Hành động**: Tự động mở URL `/login`, điền ID/Mật khẩu (mặc định Administrator/admin) và nhấp "Login".
- **Xác thực**: Chờ và đảm bảo hệ thống chuyển hướng thành công đến không gian làm việc chính của Frappe (`/app` hoặc `/desk`).

### Bước 2: Create Student (Tạo sinh viên)
- **Hành động**: Mở URL `/app/student-dashboard`, nhấp vào nút "New Student".
- **Hành động**: Điền tên sinh viên ngẫu nhiên (gắn kèm theo timestamp để không bao giờ bị trùng lặp) và email vào form Dialog, sau đó nhấn "Create".
- **Xác thực**: Kiểm tra thông báo pop-up `Student created successfully` xuất hiện trên màn hình.
- **Xác thực**: Kiểm tra giao diện danh sách sinh viên đã hiển thị một thẻ (card) mang tên sinh viên vừa tạo.

### Bước 3: Update Student (Sửa sinh viên)
- **Hành động**: Tìm chính xác thẻ sinh viên vừa tạo ở Bước 2, bấm nút "Edit" gắn trực tiếp trên thẻ đó.
- **Hành động**: Đổi tên sinh viên trong Modal thành tên mới (kèm chữ Updated) và bấm "Update".
- **Xác thực**: Kiểm tra thông báo pop-up `Student updated successfully` xuất hiện.
- **Xác thực**: Đảm bảo thẻ sinh viên cũ đã biến mất và thay thế bằng thẻ hiển thị tên mới.

### Bước 4: Delete Student (Xóa sinh viên)
- **Hành động**: Tìm thẻ sinh viên mang tên mới, bấm nút "Delete" màu đỏ.
- **Hành động**: Bấm nút "Yes" trên hộp thoại xác nhận (confirm dialog) của Frappe để chắc chắn xóa.
- **Xác thực**: Kiểm tra thông báo pop-up `Student deleted successfully` xuất hiện.
- **Xác thực**: Xác minh rà soát lại trên DOM để đảm bảo thẻ sinh viên này không còn tồn tại trên giao diện danh sách.

---

## 3. Cách Sử Dụng (Usage)

**Lưu ý**: Luôn di chuyển vào thư mục `apps/school_app` trước khi gõ lệnh.

### Chạy test chế độ ngầm (Headless Mode)
Trình duyệt thao tác ngầm bên dưới (tốc độ nhanh nhất, lý tưởng cho Server):
```bash
npx playwright test tests/student_dashboard.spec.ts
```

### Chạy test chế độ có giao diện (Headed Mode)
Trình duyệt sẽ hiển thị lên màn hình để bạn tận mắt nhìn thao tác tự động:
```bash
npx playwright test tests/student_dashboard.spec.ts --headed
```

### Chỉ chạy trên trình duyệt Chromium
Mặc định Playwright chạy cả 3 trình duyệt (Chrome, Firefox, WebKit). Để chạy nhanh gọn trên Chrome:
```bash
npx playwright test tests/student_dashboard.spec.ts --project=chromium --headed
```

### Xem Báo cáo Kết quả (HTML Report)
Sinh ra một báo cáo phân tích chi tiết về kết quả (Passed/Failed), log báo lỗi, hình ảnh:
```bash
npx playwright show-report
```

---

## 4. Mẹo xịn sò (Tips)
- **Chế độ Debug (UI Inspector)**: Tạm dừng bài test ở từng dòng lệnh để soi xét trạng thái HTML thay đổi thế nào.
  ```bash
  npx playwright test tests/student_dashboard.spec.ts --debug
  ```
- **Chế độ Record Code (Codegen)**: Bạn không rành code? Bật tính năng này lên, tự tay click chuột trên màn hình web, hệ thống sẽ tự động gõ mã lệnh TypeScript cho bạn:
  ```bash
  npx playwright codegen http://localhost:8000/login
  ```
