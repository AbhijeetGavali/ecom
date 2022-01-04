// importing router to set api paths
const router = require("express").Router();

var fetchuser = require("../middleware/fetchuser");

router.use("/", require("./user"));
router.use("/login", require("./login"));
router.use("/reset-password", require("./resetPassword"));
router.use("/cart", fetchuser, require("./cart"));
router.use("/bucket", fetchuser, require("./bucket"));
router.use("/shipping-details", fetchuser, require("./shippingDetails"));

// exporting the module
module.exports = router;
