const { Schema } = require('mongoose');
const { PRODUCT_PREFIX } = require('../config');

const bookSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => v.startsWith(PRODUCT_PREFIX),
        message: `Mã sách phải bắt đầu bằng ${PRODUCT_PREFIX}`,
      },
    },
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    vatPercent: { type: Number, required: true },
    priceAfterTax: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = bookSchema;
