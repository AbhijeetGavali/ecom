// importing router to set api paths
const router = require("express").Router();
const Mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

var fetchuser = require("../middleware/fetchuser");
var fetchStore = require("../middleware/fetchStore");

const Product = require("../../auth/database/mongoModels/product/product.model");

// POST =>  /api/account/users/ : creating a new user
router.post(
  "/",
  fetchuser,
  fetchStore,
  [
    body("productUrls", "Product should have min 1 img").isLength({ min: 1 }),
    body("productUrls", "Product should in array format").isArray(),
    body("title", "Product should have title").isLength({ min: 3 }),
    body("description", "Product should have description").isLength({ min: 3 }),
    body("price", "Product should have valid price").contains(),
    body("category", "Give category to product ").contains(),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no error in req, perform next
    try {
      // Create a new user
      var product = await Product.create({
        productUrl: req.body.productUrls.map((url) => url),
        productTitle: req.body.title,
        productDescription: req.body.description,
        price: req.body.price,
        like: 0,
        category: req.body.category,
        companyId: req.store.id,
        rating: {
          rate: 0,
          count: 0,
        },
        colors: req.body.availableColors
          ? req.body.availableColors.map((col) => col)
          : [""],
      });

      var productId = product.id;

      return res.status(200).send(productId);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// PUT ⇒ /api/account/users/ : updating an existing user
router.put(
  "/:id",
  [body().contains()],
  fetchuser,
  fetchStore,
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no error in req, perform next
    try {
      let productId = req.params.id;
      var product = await Product.findById(productId);
      if (!!product) {
        if (product.companyId.equals(Mongoose.Types.ObjectId(req.store.id))) {
          let done = await Product.findByIdAndUpdate(productId, {
            productUrl: req.body.productUrls
              ? req.body.productUrls.map((url) => url)
              : product.productUrl,
            productTitle: req.body.title
              ? req.body.title
              : product.productTitle,
            productDescription: req.body.description
              ? req.body.description
              : product.productDescription,
            price: req.body.price ? req.body.price : product.price,
            like: 0,
            category: req.body.category ? req.body.category : product.category,
            rating: {
              rate: 0,
              count: 0,
            },
            colors: req.body.availableColors
              ? req.body.availableColors.map((col) => col)
              : product.colors,
          });
          return done
            ? res.json({ status: "Updated", done })
            : res.status(200).json({ status: "Not Found", done });
        } else {
          console.log(companyId, Mongoose.Types.ObjectId(req.store.id));
          return res.status(302).send("Authentication of store");
        }
      } else {
        return res.status(302).send("product not found");
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// DELETE ⇒ /api/account/users/ : deleting and existing user
router.delete("/:id", fetchuser, fetchStore, async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If there are no error in req, perform next
  try {
    let productId = req.params.id;
    var product = await Product.findById(productId);
    if (!!product) {
      if (product.companyId.equals(Mongoose.Types.ObjectId(req.store.id))) {
        var del = await Product.findByIdAndDelete(productId);
      }
      return del
        ? res.status(200).json({ status: "deleted", del })
        : res.status(200).json({ status: "error occued", del });
    } else {
      return res.status(302).send("product not found");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

// exporting the module
module.exports = router;
