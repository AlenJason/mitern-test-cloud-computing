const express = require('express');
const { db } = require('../db');
const { buildBook } = require('../bookService');

const router = express.Router();

// Xem danh sách -> luồng ĐỌC
router.get('/', async (req, res) => {
  const books = await db.read.Book.find().sort({ createdAt: -1 }).lean();
  res.render('home', { books });
});

// Thêm mới -> luồng GHI
router.post('/books', async (req, res) => {
  const { error, book } = buildBook(req.body);

  if (!error) {
    // Kiểm tra trùng mã dùng tài khoản đọc (tài khoản ghi không có quyền find)
    const existed = await db.read.Book.exists({ code: book.code });
    if (existed) {
      return renderWithError(res, `Mã sách "${book.code}" đã tồn tại.`, req.body);
    }
    await db.write.Book.create(book);
    return res.redirect('/');
  }

  return renderWithError(res, error, req.body);
});

async function renderWithError(res, message, form) {
  const books = await db.read.Book.find().sort({ createdAt: -1 }).lean();
  res.status(400).render('home', { books, error: message, form });
}

module.exports = router;
