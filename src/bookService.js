const { PRODUCT_PREFIX, VAT_PERCENT } = require('./config');

// Kiểm tra dữ liệu đầu vào và tính giá sau thuế trước khi lưu lên cloud.
// Trả về { error } nếu không hợp lệ, ngược lại { book }.
function buildBook(input) {
  const code = String(input.code || '').trim();
  const title = String(input.title || '').trim();
  const author = String(input.author || '').trim();
  const price = Number(input.price);

  // Bộ lọc cá nhân hóa: mã sách bắt buộc có tiền tố 3 số cuối MSSV
  if (!code.startsWith(PRODUCT_PREFIX)) {
    return { error: `Từ chối: mã sách "${code}" không có tiền tố ${PRODUCT_PREFIX}.` };
  }
  if (!title) return { error: 'Tên sách không được để trống.' };
  if (!Number.isFinite(price) || price < 0) return { error: 'Giá sách không hợp lệ.' };

  const priceAfterTax = Math.round(price * (100 + VAT_PERCENT)) / 100;

  return {
    book: { code, title, author, price, vatPercent: VAT_PERCENT, priceAfterTax },
  };
}

module.exports = { buildBook };
