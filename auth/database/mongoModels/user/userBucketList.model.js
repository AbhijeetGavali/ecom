const mongoose = require("mongoose");

const data = {
  userId: { type: mongoose.Types.ObjectId, required: true },
  bucket: [
    {
      productId: { type: mongoose.Types.ObjectId },
      count: { type: Number },
    },
  ],
};

const userBucketListSchema = new mongoose.Schema(data);

module.exports = mongoose.model("userBucketList", userBucketListSchema);
