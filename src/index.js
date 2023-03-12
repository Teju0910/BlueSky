const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const greenhouseController = require("../src/controllers/greenhouse.controller");

const app = express();
app.use(express.json());
app.use("/ghg-emissions", greenhouseController);

module.exports = app;
