const mongoose = require("mongoose");

const data = {
  productId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: String, required: true },
  rate: { type: Number, required: true },
  comments: { typr: String },
};

const productRatingSchema = new mongoose.Schema(data);

module.exports = mongoose.model("productRating", productRatingSchema);
