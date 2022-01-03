// allowing env variables
require("dotenv").config();

const mongoDB_Password = process.env.MONGODB_PASSWORD;
const mongoDB_User = process.env.MONGODB_USER;

// mongo client
const mongoose = require("mongoose");
const uri = `mongodb+srv://${mongoDB_User}:${mongoDB_Password}@ecom-collection.8ikk7.mongodb.net/ecomCollection?retryWrites=true&w=majority`;

// setting up mongooes for global usage
mongoose.Promise = global.Promise;

// connecting to mongooes
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// getting databases
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// if we connected successfully
db.once("open", function () {
  // we're connected!
  console.log("We are connected :");
});
