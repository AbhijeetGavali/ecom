const mongoose = require("mongoose");

const data = {
  userId: { type: mongoose.Types.ObjectId, required: true },
  street: {
    userAddress1: { type: String, trim: true },
    userAddress2: { type: String, trim: true },
  },
  userCity: { type: String, trim: true },
  userState: { type: String, trim: true },
  userCountry: { type: String, trim: true },
  userPinCode: { type: Number, trim: true },
  userContactNumber: { type: Number, trim: true },
};

const userDetailSchema = new mongoose.Schema(data);

module.exports = mongoose.model("userDetail", userDetailSchema);
