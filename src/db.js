const mongoose = require('mongoose');
const { DB_NAME } = require('./config');
const bookSchema = require('./models/book');

// Tài khoản chỉ đọc / chỉ ghi không có quyền createIndex, createCollection
// nên tắt tự động tạo index & collection của Mongoose.
const options = { dbName: DB_NAME, autoIndex: false, autoCreate: false };

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Thiếu biến môi trường ${name}`);
  return value;
}

// Luồng ĐỌC: dùng tài khoản reader_23IT257 (chỉ có quyền find)
const readConnection = mongoose.createConnection(requireEnv('MONGODB_URI_READ'), options);
// Luồng GHI: dùng tài khoản writer_23IT257 (chỉ có quyền insert)
const writeConnection = mongoose.createConnection(requireEnv('MONGODB_URI_WRITE'), options);

readConnection.on('connected', () => console.log('[DB] Kết nối luồng ĐỌC thành công'));
writeConnection.on('connected', () => console.log('[DB] Kết nối luồng GHI thành công'));
readConnection.on('error', (err) => console.error('[DB] Lỗi luồng ĐỌC:', err.message));
writeConnection.on('error', (err) => console.error('[DB] Lỗi luồng GHI:', err.message));

// Cùng một schema nhưng gắn vào 2 kết nối khác nhau
const BookReader = readConnection.model('Book', bookSchema, 'books');
const BookWriter = writeConnection.model('Book', bookSchema, 'books');

// Bộ điều hướng: truy vấn đọc -> reader, truy vấn ghi -> writer
const db = {
  read: { Book: BookReader },
  write: { Book: BookWriter },
};

async function connectAll() {
  await Promise.all([readConnection.asPromise(), writeConnection.asPromise()]);
}

module.exports = { db, connectAll, readConnection, writeConnection };
