// importing router to set api paths
const router = require("express").Router();
const Product = require("../../auth/database/mongoModels/product/product.model");

router.use("/", require("./product"));

router.get("/:collections/:type", async (req, res) => {
  try {
    const { collections, type } = req.params;
    let products = await Product.find({ collections, type }).exec();
    res.json({ products });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

// exporting the module
module.exports = router;
