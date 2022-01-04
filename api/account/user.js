// allowing env variables
require("dotenv").config();
// importing router to set api paths
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

// auth verification jwt import
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;

var fetchuser = require("../middleware/fetchuser");

const User = require("../../auth/database/mongoModels/user/user.model");
const UserPassword = require("../../auth/database/mongoModels/user/userPassword.model");
const UserDetails = require("../../auth/database/mongoModels/user/userDetails.model");
const UserCart = require("../../auth/database/mongoModels/user/userCart.model");
const UserBucketList = require("../../auth/database/mongoModels/user/userBucketList.model");

router.get("/", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId);
    let data = user
      ? {
          first_Name: user.userName.userFirstName,
          last_Name: user.userName.userFirstName,
          email: user.userEmail,
        }
      : "Not Found";
    return res.send(data);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

// POST =>  /api/account/users/ : creating a new user
router.post(
  "/",
  [
    body("first_Name", "Enter a valid name").isLength({ min: 3 }),
    body("last_Name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no error in req, perform next
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ userEmail: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      // Create a new user
      user = await User.create({
        userName: {
          userFirstName: req.body.first_Name,
          userLastName: req.body.last_Name,
        },
        userEmail: req.body.email,
      });

      var userId = user.id;
      // generationg password for storing in db
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      await UserPassword.create({
        userId,
        userPassword: securePassword,
      });
      await UserDetails.create({
        userId,
        street: {
          userAddress1: "",
          userAddress2: "",
        },
        userCity: "",
        userState: "",
        userCountry: "",
        userPinCode: 0,
        userContactNumber: -1,
      });
      await UserCart.create({
        userId,
        cart: [],
      });
      await UserBucketList.create({
        userId,
        bucket: [],
      });

      // set data with user id
      const data = {
        user: {
          id: userId,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // send token to clientside
      return res.status(200).json({ authtoken });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// PUT ⇒ /api/account/users/ : updating an existing user
router.put(
  "/",
  [
    body("first_Name", "Enter a valid name").isLength({ min: 3 }),
    body("last_Name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
  ],
  fetchuser,
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no error in req, perform next
    try {
      let userId = req.user.id;
      let done = await User.findByIdAndUpdate(userId, {
        userName: {
          userFirstName: req.body.first_Name,
          userLastName: req.body.last_Name,
        },
        userEmail: req.body.email,
      });
      return done ? res.send("Done") : res.send("Not FOund");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// DELETE ⇒ /api/account/users/ : deleting and existing user
router.delete(
  "/",
  [body("password", "Password cannot be blank").exists()],
  fetchuser,
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no error in req, perform next
    try {
      let userId = req.user.id;
      const { password } = req.body;

      const userPass = await UserPassword.findOne({ userId });
      if (userPass === null) {
        return res.status(400).send("pass null");
      }
      const passwordCompare = await bcrypt.compare(
        password,
        userPass.userPassword
      );

      if (!passwordCompare) {
        return res.status(400).json({
          error: "incorrect credentials",
        });
      }
      await User.findByIdAndDelete(userId);
      await UserPassword.findByIdAndDelete(userPass._id);
      await UserDetails.findOneAndDelete({ userId });
      await UserCart.findOneAndDelete({ userId });
      await UserBucketList.findOneAndDelete({ userId });
      return res.status(200).send("Done");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// exporting the module
module.exports = router;
