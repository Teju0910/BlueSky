require("dotenv").config();
const mongoose = require("mongoose");

// connect to MongoDB database
const connect = () => {
  return mongoose
    .connect("mongodb://localhost:27017/greenhouse-emissions-data")
};

module.exports = connect;
