const fs = require("fs");
const GreenhouseEmissions = require("../models/greenhouse.model");
const csv = require("csv-parser");

const insertCSVFile = () => {
  fs.createReadStream("src/greenhouse_gas_inventory_data.csv")
    .pipe(csv())
    .on("data", async (row) => {
      await GreenhouseEmissions.create({
        country: row.country_or_area,
        year: row.year,
        value: row.value,
        parameter: row.parameter,
      });
    })
    .on("end", () => {
      console.log("Finished reading data from CSV");
    });
};

module.exports = insertCSVFile;
