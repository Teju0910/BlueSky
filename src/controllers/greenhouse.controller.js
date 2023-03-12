const express = require("express");
const router = express.Router();
const GreenhouseEmissions = require("../models/greenhouse.model");
const { createClient } = require("redis");
const insertCSVFile = require("../scripts/insertCSVFile");
const authenticate = require("../middlewares/authenticate");
const redis = require("redis");
const client = createClient();

// Get all Greenhouse Emissions data
router.get("/q", async (req, res) => {
  try {
    const greenhouseEmissions = await GreenhouseEmissions.find().lean().exec();

    return res.status(200).send({ greenhouseEmissions: greenhouseEmissions });
  } catch (err) {
    return err;
  }
});

// Get Greenhouse Emissions for any country
router.get("/", async (req, res) => {
  try {
    const { start_year, end_year, parameter, country_name } = req.query;
    await client.connect();
    let emissions;
    let cacheKey = `${start_year}-${country_name}`;
    client.get(cacheKey, async (err, data) => {
      if (err) throw err;
      if (data == null) {
        // If data exists in cache, return it
        emissions = JSON.parse(data);
      } else {
        // If data doesn't exist in cache, query MongoDB and add it to cache
        const query = {
          country: country_name ? country_name : "",
          parameter: parameter ? parameter : { $in: ["CO2", "NO2", "SO2"] },
          year:
            start_year || end_year
              ? { $gte: parseInt(start_year), $lte: parseInt(end_year) }
              : "",
        };

        const gec = await GreenhouseEmissions.find(query).lean().exec();
        res.json(gec);

        client.setex(cacheKey, 3600, JSON.stringify(gec));
        console.log("Stored into Catched data");
      }
    });

    return res
      .status(200)
      .send({ greenhouseEmissions: GreenhouseEmissionsOfCountry });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Create  Greenhouse Emissions data
router.post("/", authenticate, async (req, res) => {
  try {
    if (
      !req.body.country_or_area ||
      !req.body.year ||
      !req.body.value ||
      !req.body.parameter
    ) {
      return res.status(400).send({
        message: "All parameters are required",
      });
    }

    const greenhouseEmissions = GreenhouseEmissions({
      country_or_area: req.body.country_or_area,
      year: req.body.year,
      value: req.body.value,
      parameter: req.body.parameter,
    });

    const data = await GreenhouseEmissions.findOne({
      country_or_area: req.body.country_or_area,
      year: req.body.year,
      value: req.body.value,
      parameter: req.body.parameter,
    });
    if (data == null) {
      const greenhouseEmissionsPost = await GreenhouseEmissions.create(
        greenhouseEmissions
      );
      insertCSVFile();
      return res.status(201).send(greenhouseEmissionsPost);
    }
    return res.status(404).send("Data is already present");
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
