require('dotenv').config({ quiet: true });

const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const config = require('./src/config');
const { connectAll } = require('./src/db');
const { createSessionMiddleware } = require('./src/session');
const bookRoutes = require('./src/routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { money: (value) => money.format(value) },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Render đặt app phía sau reverse proxy HTTPS
app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: false }));

// Biến dùng chung cho Footer
app.locals.student = {
  name: config.STUDENT_NAME,
  mssv: config.MSSV,
  vat: config.VAT_PERCENT,
  prefix: config.PRODUCT_PREFIX,
};

async function start() {
  await connectAll();

  app.use(createSessionMiddleware());
  app.use('/', bookRoutes);
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Lỗi máy chủ: ' + err.message);
  });

  app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Không thể kết nối MongoDB Atlas:', err.message);
  process.exit(1);
});
