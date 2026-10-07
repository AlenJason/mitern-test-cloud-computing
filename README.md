# Quản lý Sách — Kiểm tra giữa kì Điện toán đám mây

- Họ tên: **Nguyễn Thiên**, MSSV: **23IT257**
- Database: `DB_23IT257`
- Tiền tố mã sách: `257`, VAT = (7 + 4)% = **11%**

## Kiến trúc

| Thành phần | Cách làm |
|---|---|
| Phân quyền DB | 2 user Atlas: `reader_23IT257` (chỉ `find` trên `books`) và `writer_23IT257` (chỉ `insert` trên `books`) |
| Điều hướng Read/Write | `src/db.js` tạo 2 kết nối Mongoose: `db.read.Book` cho truy vấn đọc, `db.write.Book` cho truy vấn ghi |
| Stateless session | `express-session` + `connect-mongo`, lưu vào collection `sessions` trên Atlas (không dùng MemoryStore) |
| Bộ lọc mã sách | `src/bookService.js`: mã không bắt đầu bằng `257` thì bị từ chối (kiểm tra thêm ở schema Mongoose) |
| VAT | Tính `priceAfterTax = price × 1.11` trước khi ghi xuống Atlas; footer hiển thị Họ tên, MSSV, VAT |

## 1. Cấu hình MongoDB Atlas

1. Tạo cluster (M0 Free).
2. **Database Access → Custom Roles → Add New Custom Role**:
   - `readBooks_23IT257`: action `find` trên database `DB_23IT257`, collection `books`.
   - `writeBooks_23IT257`:
     - action `insert` trên `DB_23IT257.books`
     - action `find`, `insert`, `update`, `remove`, `createIndex` trên `DB_23IT257.sessions` (để lưu session)
3. **Database Access → Add New Database User**:
   - `reader_23IT257` → gán role `readBooks_23IT257`
   - `writer_23IT257` → gán role `writeBooks_23IT257`
4. **Network Access**: thêm `0.0.0.0/0` (để Render kết nối được).
5. Lấy connection string (Connect → Drivers) cho từng user.

> Tài khoản ghi cần quyền trên collection `sessions` vì session store phải đọc/cập nhật phiên.
> Với collection `books`, nó chỉ có quyền `insert`. Riêng việc kiểm tra trùng mã sách dùng tài khoản đọc.

## 2. Chạy local

```bash
cp .env.example .env   # rồi điền chuỗi kết nối thật
npm install
npm run dev
```

## 3. Git workflow

```bash
git log --graph --oneline --all
```

Hai nhánh tính năng `feature/database` và `feature/session` được gộp về `main` bằng `git merge --no-ff`, nên đồ thị giữ lại các merge commit.

Đẩy lên GitHub (repo **Private**):

```bash
git remote add origin https://github.com/<username>/quan-ly-sach-23it257.git
git push -u origin main feature/database feature/session
```

Sau đó vào **Settings → Collaborators → Add people** để thêm giảng viên.

## 4. Triển khai trên Render

1. New → **Web Service** → chọn repo GitHub.
2. Build command: `npm install` — Start command: `npm start`.
3. Tab **Environment**, thêm các biến:
   - `MONGODB_URI_READ`
   - `MONGODB_URI_WRITE`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
4. Deploy. Không có chuỗi kết nối nào nằm trong mã nguồn.
