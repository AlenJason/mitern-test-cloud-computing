const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const { writeConnection } = require('./db');
const { DB_NAME } = require('./config');

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) {
  throw new Error('Thiếu biến môi trường SESSION_SECRET');
}

// Session KHÔNG lưu trong RAM (MemoryStore) mà lưu tập trung trên MongoDB Atlas,
// nhờ đó nhiều instance phía sau load balancer dùng chung được phiên làm việc.
// Chỉ gọi sau khi kết nối DB thành công.
function createSessionMiddleware() {
  const store = MongoStore.create({
    client: writeConnection.getClient(),
    dbName: DB_NAME,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 ngày
    autoRemove: 'native', // TTL index do MongoDB tự xoá phiên hết hạn
  });

  return session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction, // Render chạy HTTPS phía sau proxy
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

module.exports = { createSessionMiddleware };
