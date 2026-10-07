// Thông tin cá nhân hóa theo MSSV (không phải thông tin bí mật)
const STUDENT_NAME = 'Nguyễn Thiên';
const MSSV = '23IT257';

// Tiền tố mã sách = 3 số cuối MSSV
const PRODUCT_PREFIX = MSSV.slice(-3); // "257"

// VAT = (chữ số cuối MSSV + 4)%
const VAT_PERCENT = Number(MSSV.slice(-1)) + 4; // 11

const DB_NAME = `DB_${MSSV}`;

module.exports = { STUDENT_NAME, MSSV, PRODUCT_PREFIX, VAT_PERCENT, DB_NAME };
