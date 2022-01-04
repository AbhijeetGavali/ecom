// allowing env variables
require("dotenv").config();
const router = require("express").Router();
const Mongoose = require("mongoose");

const UserCart = require("../../auth/database/mongoModels/user/userCart.model");

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    var userCart = await UserCart.findOne({ userId });
    return res.status(200).json({ userCart: userCart.cart });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Inernal server error" });
  }
});

router.post("/:product", async (req, res) => {
  try {
    const userId = req.user.id;
    const product = req.params.product;
    var userCart = await UserCart.findOne({ userId });
    var cart = userCart.cart.filter((prod) =>
      prod.productId.equals(Mongoose.Types.ObjectId(product))
    );
    if (cart.length === 0) {
      cart = [...userCart.cart, { productId: product, count: 1 }];
      await UserCart.findOneAndUpdate({ userId }, { cart });
      return res.status(200).json({ done: "done" });
    }
    return res.send("exist");
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Inernal server error" });
  }
});

router.put("/:product", async (req, res) => {
  try {
    const userId = req.user.id;
    const product = req.params.product;
    if (req.body.type === "increse" || req.body.type === "decrese") {
      var userCart = await UserCart.findOne({ userId });
      var cart = userCart.cart.map((prod) => {
        if (prod.productId.equals(Mongoose.Types.ObjectId(product))) {
          var count =
            req.body.type === "increse" ? prod.count + 1 : prod.count - 1;
          return { productId: prod.productId, count };
        } else {
          return prod;
        }
      });
      cart = cart.filter((prod) => prod.count !== 0);
      let update = await UserCart.findOneAndUpdate({ userId }, { cart });
      return res.status(200).json({ done: "done" });
    }
    return res.status(300).json({ msg: "entre valid operation" });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Inernal server error" });
  }
});

router.delete("/:product", async (req, res) => {
  try {
    const userId = req.user.id;
    const product = req.params.product;
    var userCart = await UserCart.findOne({ userId });
    var cart = userCart.cart.filter(
      (prod) => !prod.productId.equals(Mongoose.Types.ObjectId(product))
    );
    await UserCart.findOneAndUpdate({ userId }, { cart });
    return res.status(200).json({ done: "done" });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Inernal server error" });
  }
});

module.exports = router;
