const mongoose = require("mongoose");

// user liked products
const data = {
  productId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
};

const productLikesSchema = new mongoose.Schema(data);

module.exports = mongoose.model("productLikes", productLikesSchema);
