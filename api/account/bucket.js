// allowing env variables
require("dotenv").config();
const router = require("express").Router();
const Mongoose = require("mongoose");

const UserBucketList = require("../../auth/database/mongoModels/user/userBucketList.model");

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    var userBucket = await UserBucketList.findOne({ userId });
    return res.status(200).json({ userBucket: userBucket.bucket });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Inernal server error" });
  }
});

router.post("/:product", async (req, res) => {
  try {
    const userId = req.user.id;
    const product = req.params.product;
    var userBucket = await UserBucketList.findOne({ userId });
    var bucket = userBucket.bucket.filter((prod) =>
      prod.productId.equals(Mongoose.Types.ObjectId(product))
    );
    if (bucket.length === 0) {
      bucket = [...userBucket.bucket, { productId: product, count: 1 }];
      await UserBucketList.findOneAndUpdate({ userId }, { bucket });
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
      var userBucket = await UserBucketList.findOne({ userId });
      var bucket = userBucket.bucket.map((prod) => {
        if (prod.productId.equals(Mongoose.Types.ObjectId(product))) {
          var count =
            req.body.type === "increse" ? prod.count + 1 : prod.count - 1;
          return { productId: prod.productId, count };
        } else {
          return prod;
        }
      });
      bucket = bucket.filter((prod) => prod.count !== 0);
      let update = await UserBucketList.findOneAndUpdate(
        { userId },
        { bucket }
      );
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
    var userBucket = await UserBucketList.findOne({ userId });
    var bucket = userBucket.bucket.filter(
      (prod) => !prod.productId.equals(Mongoose.Types.ObjectId(product))
    );
    await UserBucketList.findOneAndUpdate({ userId }, { bucket });
    return res.status(200).json({ done: "done" });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Inernal server error" });
  }
});

module.exports = router;
