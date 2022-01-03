// require all dependancies to use
const express = require("express");
const path = require("path");
const cors = require("cors");

// creating an express app
const app = express();

// setting app for allowing json data passing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // allow connection

// connection to mongoDB
require("./auth/database/mongoDB");

// seting api routs here
app.use("/api", require("./api"));

// defining port number
const PORT = process.env.PORT || 5000;

// listing on port
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
