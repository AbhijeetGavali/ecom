// allowing env variables
require("dotenv").config();

var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchStore = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token-store");
  if (!token) {
    res.status(401).send({
      error: "Please authenticate using a valid token store token not found",
    });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.store = data.store;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      err: "Please authenticate using a valid token store token not validate",
    });
  }
};

module.exports = fetchStore;
