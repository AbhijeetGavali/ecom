// importing router to set api paths
const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const Product = require("../../auth/database/mongoModels/product/product.model");

router.get("/get/:id", async (req, res) => {
  try {
    let productId = req.params.id;
    const product = await Product.findById(productId);
    if (!!product) {
      let data = product
        ? {
            id: product.id,
            photos: product.productUrl.map((url) => url),
            name: product.productName,
            description: product.productDescription,
            actualPrice: product.actualPrice,
            discountPrice: product.discountPrice,
            collection: product.collections,
            type: product.type,
            size: product.size ? product.size.map((siz) => siz) : [""],
          }
        : "Not Found";
      return res.json({ data });
    } else {
      return res.status(401).send("product not found");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 3 }),
    body("type", "Enter a valid type").isLength({ min: 3 }),
    body("collection", "Enter a valid collection").isLength({ min: 3 }),
    body("collection", "Enter a valid collection").isLength({ min: 3 }),
    body("size", "Enter a valid size").isLength({ min: 1 }),
    body("discountPrice", "Enter a valid discountPrice")
      .isNumeric()
      .isLength({ min: 1 }),
    body("actualPrice", "Enter a valid actualPrice")
      .isNumeric()
      .isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      if (req.body.actualPrice <= req.body.discountPrice) {
        return res.status(400).json({ message: "Discount is not valid" });
      }

      let data = {
        productUrl: req.body.photos ? req.body.photos.map((url) => url) : [""],
        productName: req.body.name,
        productDescription: req.body.description,
        actualPrice: req.body.actualPrice,
        discountPrice: req.body.discountPrice,
        collections: req.body.collection,
        type: req.body.type,
        size: req.body.size ? req.body.size.map((siz) => siz) : [""],
      };

      let newProduct = await Product.create(data);
      return res.json({ createrd: newProduct.id });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);
router.delete("/delete/:id", async (req, res) => {
  try {
    let productId = req.params.id;
    let responce = await Product.findByIdAndDelete(productId);
    return res.status(200).json({ responce });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
// exporting the module
module.exports = router;
