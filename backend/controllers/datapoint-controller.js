const HttpError = require("../models/httpError");
const DataPoint = require("../models/dataPoint");

const csvToJsonReader = require("csvtojson");

const readDataPointsFromFile = async (req, res, next) => {
  /* Create single data point API */
  const { filename, category } = req.body;
  //const filename = "D:/user_files/test1.csv";
  //const category = "test";
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
        source: "test",
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

const fetchAllDataPoints = async (req, res, next) => {
  /* Fetch ALL data for this specific user account */
  console.log("INSIDE fetchAllDataPoints");
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
      { _id: 0, category: 1, data: 1, createdDate: 1, source: 1 } //only return the necessary info...
    );
  } catch (err) {
    const error = new HttpError("Cant find data", 500);
    return next(error);
  }

  return res.json({
    dataPoints: data.map((dp) => dp.toObject({ getters: true })),
  });
};

const fetchDataPointsByCategory = async (req, res, next) => {
  /* Fetch data for this specific user account and category */
  const { category } = req.body;
  let userKey = req.userData.userKey;
  console.log("INSIDE fetchDataPointsByCategory");
  console.log(category);
  console.log(userKey);

  let data;

  try {
    data = await DataPoint.find(
      {
        category: category,
        userKey: userKey,
      },
      { _id: 0, category: 1, data: 1, createdDate: 1, source: 1 } //only return the necessary info...
    );
  } catch (err) {
    const error = new HttpError("Cant find data", 500);
    return next(error);
  }

  return res.json({
    dataPoints: data.map((dp) => dp.toObject({ getters: true })),
  });
};

const fetchDataWithFilters = async (req, res, next) => {
  /* Fetch data using filters from a report... Or on demand filters,
     works with either or 
     Actions can be:
       - DATA: Fetches actual data records
       - COUNT: Counts records (TO-DO)
       - SUM|Field: Sums specific field (TO-DO)
    
    TO-DO: Figure out operators so we can search with < and >

    TO-DO: Aggregations? Joins? Perhaps across different categories for the same 
           integration keys   */
  const { category, filters, action } = req.body;

  let userKey = req.userData.userKey;

  if (userKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  /* ALWAYS ADD THESE GUYS */
  Object.defineProperty(filters, "category", { value: category });
  Object.defineProperty(filters, "userKey", { value: userKey });

  switch (action) {
    case "DATA":
      try {
        data = await DataPoint.find(filters, {
          _id: 0,
          category: 1,
          data: 1,
          createdDate: 1,
          source: 1,
        });
      } catch (err) {
        console.log(err);
        const error = new HttpError("Cant find data", 500);
        return next(error);
      }

      return res.json({
        dataPoints: data.map((dp) => dp.toObject({ getters: true })),
      });

    case "COUNT":
      /* TO-DO */

      return res.status(500).json({
        error: "Not yet implemented!",
      });
    case "SUM":
      /* TO-DO */

      return res.status(500).json({
        error: "Not yet implemented!",
      });
    default:
      return res.status(500).json({
        error: "Please specify an action: DATA|COUNT|SUM",
      });
  }
};

module.exports.getDataPointFields = getDataPointFields;
module.exports.readDataPointsFromFile = readDataPointsFromFile;
module.exports.fetchAllDataPoints = fetchAllDataPoints;
module.exports.fetchDataPointsByCategory = fetchDataPointsByCategory;
module.exports.fetchDataWithFilters = fetchDataWithFilters;
