/* Datapoints module */

const HttpError = require("../models/httpError");
const DataPoint = require("../models/dataPoint");

const csvToJsonReader = require("csvtojson");

/* readDataPointsFromFile: This API is used to read data from a CSV file
   and create individual data points in our database. 
   We read the file row by row, and use the file's heading to form a 
   JSON object which is stored as the datapoint */
const readDataPointsFromFile = async (req, res, next) => {
  const { filename, category } = req.body;
  let userKey = req.userData.userKey;

  const dataFromCsv = await csvToJsonReader().fromFile(filename);

  /* If all is well, then go ahead and create */
  try {
    dataFromCsv.forEach(async (element) => {
      let newDp = new DataPoint({
        userKey,
        category,
        data: element,
        createdDate: new Date().toDateString(),
      });

      await newDp.save();
    });
  } catch (e) {
    console.log("Error saving single data point: " + e);
    return res.status(500).json({
      error: "Error saving data points, please contact support",
    });
  }

  return res.status(200).json({
    success: "All data points read from file and saved!",
  });
};

/* getDataPointFields: This API is used to fetch the 'headings' of the
   datapoints. In order the words, the fields */
const getDataPointFields = async (req, res, next) => {
  /* The idea of this function is to get the different fields / properties
     we have available to report on for this userKey and category 
     Making life easier for the front end - hopefully :) */
  const { category } = req.body;
  /* First do some validations */
  let userKey = req.userData.userKey;
  //let userKey = "3c32d290-34d7-4df2-9e95-ee9c8ccdfaae";

  if (userKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data = await DataPoint.find({
    category: category,
    userKey: userKey,
  });

  let keysArray = data.map((dp) => Object.keys(dp.data));

  return res.status(200).json({
    success: "Datapoint keys retrieved",
    fieldNames: keysArray,
  });
};

/* fetchAllDataPoints: This API fetches ALL datapoints for a specific user,
   regardless of category */
const fetchAllDataPoints = async (req, res, next) => {
  let userKey = req.userData.userKey;

  if (userKey == "" || userKey == undefined) {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await DataPoint.find(
      { userKey: userKey },
      { _id: 0, category: 1, data: 1, createdDate: 1 } //only return the necessary info...
    );
  } catch (err) {
    const error = new HttpError("Cant find data", 500);
    return next(error);
  }

  return res.json({
    dataPoints: data.map((dp) => dp.toObject({ getters: true })),
  });
};

/* fetchDataPointsByCategory: This API fetches ALL datapoints for a specific user,
   and for a specific category. This is the main API called to fetch the datapoints
   for to run and render a report on the front end */
const fetchDataPointsByCategory = async (req, res, next) => {
  const { category } = req.body;
  let userKey = req.userData.userKey;

  let data;

  try {
    data = await DataPoint.find(
      {
        category: category,
        userKey: userKey,
      },
      { _id: 0, category: 1, data: 1, createdDate: 1 } //only return the necessary info...
    );
  } catch (err) {
    const error = new HttpError("Cant find data", 500);
    return next(error);
  }

  return res.json({
    dataPoints: data.map((dp) => dp.toObject({ getters: true })),
  });
};

module.exports.getDataPointFields = getDataPointFields;
module.exports.readDataPointsFromFile = readDataPointsFromFile;
module.exports.fetchAllDataPoints = fetchAllDataPoints;
module.exports.fetchDataPointsByCategory = fetchDataPointsByCategory;
