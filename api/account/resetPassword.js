// allowing env variables
require("dotenv").config();
const express = require("express");
const path = require("path");
const router = express.Router();
const { body, validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../../auth/database/mongoModels/user/user.model");
const UserPassword = require("../../auth/database/mongoModels/user/userPassword.model");
const mailer = require("../middleware/mailer");

router.get("/:token", async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(200).send("try again sending email");
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return res.sendFile(path.join(__dirname, "../../static/resetPass/"));
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
});

router.put("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    // Check whether the user with this email exists
    let user = await User.findOne({ userEmail: email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email not exists" });
    }

    var userId = user.id;
    const data = {
      userId,
      email,
    };
    const authtoken = jwt.sign(data, JWT_SECRET, {
      expiresIn: 15 * 60,
    });
    // send mail to email with sub and pass reset email
    console.log(
      `http://${process.env.WEBSITEURL}/api/account/users/reset-password/${authtoken}`
    );
    var htmlData = `http://${process.env.WEBSITEURL}/api/account/users/reset-password/${authtoken}`;
    var props = {
      MAIL_TO: email,
      MAILER_SUBJECT: "reset password of dogecart",
      MAILER_TEMPLATE: htmlData,
    };
    let responce = await mailer(props);
    return res.status(200).send(responce);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

router.patch(
  "/:token",
  [
    body("new_password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;
    if (!token) {
      return res.status(200).send("try again sending email");
    }
    try {
      const data = jwt.verify(token, JWT_SECRET);
      var userId = data.userId;
      // generationg password for storing in db
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(new_password, salt);

      await UserPassword.findOneAndUpdate(
        { userId },
        {
          userPassword: securePassword,
        }
      );
      res.send("done");
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }
  }
);

module.exports = router;
