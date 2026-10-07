const express = require('express');
const { db } = require('../db');
const { buildBook } = require('../bookService');

const router = express.Router();

// Xem danh sách -> luồng ĐỌC
router.get('/', async (req, res) => {
  const books = await db.read.Book.find().sort({ createdAt: -1 }).lean();

  // Thông báo một lần (flash) được lưu trong session trên Atlas
  const flash = req.session.flash;
  delete req.session.flash;

  res.render('home', {
    books,
    flash,
    form: flash?.form,
    addedCount: req.session.addedCount || 0,
  });
});

// Thêm mới -> luồng GHI
router.post('/books', async (req, res) => {
  const { error, book } = buildBook(req.body);

  if (error) return reject(req, res, error);

  // Kiểm tra trùng mã dùng tài khoản đọc (tài khoản ghi không có quyền find)
  const existed = await db.read.Book.exists({ code: book.code });
  if (existed) return reject(req, res, `Mã sách "${book.code}" đã tồn tại.`);

  await db.write.Book.create(book);

  req.session.addedCount = (req.session.addedCount || 0) + 1;
  req.session.flash = {
    type: 'success',
    message: `Đã thêm "${book.title}" - giá sau thuế ${book.priceAfterTax.toLocaleString('vi-VN')} ₫.`,
  };
  res.redirect('/');
});

function reject(req, res, message) {
  req.session.flash = { type: 'error', message, form: req.body };
  res.redirect('/');
}

module.exports = router;
