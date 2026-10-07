require('dotenv').config({ quiet: true });

const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const config = require('./src/config');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

// Biến dùng chung cho Footer
app.locals.student = {
  name: config.STUDENT_NAME,
  mssv: config.MSSV,
  vat: config.VAT_PERCENT,
  prefix: config.PRODUCT_PREFIX,
};

app.get('/', (req, res) => {
  res.render('home', { books: [] });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
