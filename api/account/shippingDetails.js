// allowing env variables
require("dotenv").config();
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const ShippingDetails = require("../../auth/database/mongoModels/user/userDetails.model");

// GET =>  /api/account/users/shipping-details : get shopping details
router.get("/", async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await ShippingDetails.findOne({ userId });
    let data = user
      ? {
          userAddress1: user.street.userAddress1,
          userAddress2: user.street.userAddress2,
          userCity: user.userCity,
          userState: user.userState,
          userCountry: user.userCountry,
          userPinCode: user.userPinCode,
          userContactNumber: user.userContactNumber,
        }
      : "Not Found";
    return res.send(data);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

// PUT => /api/account/users/shipping-details : update shipping details of user
router.put(
  "/",
  [
    body("userAddress1", "Enter a valid address").isLength({ min: 5 }),
    body("userAddress2", "Enter a valid address").isLength({ min: 5 }),
    body("userCity", "Enter a valid city").isLength({ min: 3 }),
    body("userState", "Enter a valid state").isLength({ min: 3 }),
    body("userCountry", "Enter a valid country").isLength({ min: 2 }),
    body("userPinCode", "Enter a valid pin code").isLength({ min: 6 }),
    body("userContactNumber", "Enter a valid number")
      .isLength({ min: 10 })
      .isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no error in req, perform next
    try {
      let userId = req.user.id;
      let done = await ShippingDetails.findOneAndUpdate(
        { userId },
        {
          street: {
            userAddress1: req.body.userAddress1,
            userAddress2: req.body.userAddress2,
          },
          userCity: req.body.userCity,
          userState: req.body.userState,
          userCountry: req.body.userCountry,
          userPinCode: req.body.userPinCode,
          userContactNumber: req.body.userContactNumber,
        }
      );
      return done ? res.send("Done") : res.send("Not FOund");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// DELETE  => /api/account/users/shipping-details : remove details of usr
router.delete("/", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If there are no error in req, perform next
  try {
    let userId = req.user.id;
    let done = await ShippingDetails.findOneAndUpdate(
      { userId },
      {
        street: {
          userAddress1: "",
          userAddress2: "",
        },
        userCity: "",
        userState: "",
        userCountry: "",
        userPinCode: "",
        userContactNumber: "",
      }
    );
    return done ? res.send("Done") : res.send("Not FOund");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
