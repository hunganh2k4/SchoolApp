# Hướng dẫn Deploy lên Azure VPS bằng Docker

Tài liệu này hướng dẫn cách thiết lập Azure VPS (Virtual Private Server) lần đầu tiên để chạy dự án Frappe `school_app` qua Docker, cũng như cấu hình GitHub Actions (CI/CD) đi kèm bước Admin Approval.

## 1. Yêu cầu hệ thống trên Azure VPS
- **OS**: Ubuntu 22.04 LTS (hoặc mới hơn).
- **Phần mềm cần cài đặt**: Docker và Docker Compose.
- Mở Port `80` (HTTP) và `443` (HTTPS) trên giao diện cấu hình Firewall/NSG (Network Security Group) của Azure.

## 2. Thiết lập VPS lần đầu

1. **SSH vào VPS Azure của bạn:**
   ```bash
   ssh username@ip-vps
   ```

2. **Cài đặt Git, Docker và Docker Compose:**
   ```bash
   sudo apt update
   sudo apt install git docker.io docker-compose-v2 -y
   ```

3. **Clone project:**
   Tạo thư mục cài đặt, ví dụ `/opt/frappe_docker_deployment`:
   ```bash
   mkdir -p /opt/frappe_docker_deployment
   cd /opt/frappe_docker_deployment
   git clone https://github.com/your-username/school_app.git
   cd school_app
   ```

4. **Khởi chạy hệ thống lần đầu:**
   ```bash
   docker compose build
   docker compose up -d
   ```
   Lúc này MariaDB, Redis, Backend, Frontend (Nginx) sẽ cùng khởi chạy. Bạn cần truy cập vào backend để khởi tạo site lần đầu:
   ```bash
   docker compose exec backend bench new-site school.localhost --mariadb-root-password admin --admin-password admin
   docker compose exec backend bench --site school.localhost install-app school_app
   ```

## 3. Cấu hình GitHub Actions CI/CD và Admin Approval

Để CI/CD tự động deploy code mỗi khi có push lên nhánh `main`, bạn cần cung cấp thông tin kết nối SSH của VPS cho GitHub.

### Bước 1: Bật tính năng Admin Approval
1. Truy cập Repository trên GitHub > **Settings** > **Environments**.
2. Nhấn **New environment**, nhập tên là `production`.
3. Trong giao diện thiết lập của `production`:
   - Đánh dấu tích vào ô **Required reviewers**.
   - Gõ tên tài khoản GitHub (Admin) của bạn hoặc team vào để phân quyền duyệt.
   - Nhấn **Save protection rules**.

### Bước 2: Thiết lập Secrets (Mật khẩu/Key)
Truy cập **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
1. **`SERVER_HOST`**: Địa chỉ IP Public của Azure VPS.
2. **`SERVER_USER`**: Tên user ssh (ví dụ: `ubuntu` hoặc `azureuser`).
3. **`SERVER_SSH_KEY`**: Nội dung Private Key (`.pem` hoặc `.key`) dùng để SSH vào VPS.

Sau khi hoàn tất cài đặt, mỗi khi có code merge vào `main`, pipeline sẽ tạm dừng lại và yêu cầu Admin vào ấn nút **Approve** trước khi tiến hành SSH và chạy lệnh Docker update.
