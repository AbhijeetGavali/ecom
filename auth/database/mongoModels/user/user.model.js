const mongoose = require("mongoose");

const data = {
  userName: {
    userFirstName: {
      type: String,
      required: true,
    },
    userLastName: {
      type: String,
      required: true,
    },
  },
  userEmail: {
    type: String,
    required: true,
  },
};

const userSchema = new mongoose.Schema(data);

module.exports = mongoose.model("user", userSchema);
