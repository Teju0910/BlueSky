const mongoose = require("mongoose");

const GreenhouseEmissionsSchema = new mongoose.Schema(
  {
    country: { type: String, require: true },
    year: { type: String, require: true },
    value: { type: Number, require: true },
    start_year: { type: Number },
    end_year: { type: Number },
    parameter: {
      type: String,
      require: true,
      enum: ["CO2", "NO2", "SO2"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GreenhouseEmissions",
  GreenhouseEmissionsSchema
);
