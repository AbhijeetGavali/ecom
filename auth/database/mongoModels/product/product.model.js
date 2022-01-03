const mongoose = require("mongoose");

const data = {
  productUrl: [{ type: String, required: true, trim: true }],
  productName: { type: String, required: true, trim: true },
  productDescription: { type: String, required: true, trim: true },
  actualPrice: { type: Number, required: true, trim: true },
  discountPrice: { type: Number, required: true, trim: true },
  collections: { type: String, required: true },
  type: { type: String, required: true },
  size: [{ type: String }],
};

const productSchema = new mongoose.Schema(data);

module.exports = mongoose.model("product", productSchema);
