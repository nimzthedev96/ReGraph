const HttpError = require("../models/httpError");
const DataPoint = require("../models/dataPoint");

const createSingleDataPoint = async (req, res, next) => {
  /* Create single data point API */
  const { data, category } = req.body;

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error with credentials, please contact support",
    });
  }

  /* If all is well, then go ahead and create */
  let newDp = new DataPoint({
    integrationKey,
    category,
    data,
    createdDate: new Date().toDateString(),
    source: "test",
  });

  try {
    await newDp.save();
  } catch (e) {
    console.log("Error saving single data point: " + e);
    return res.status(500).json({
      error: "Error saving single data point, please contact support",
    });
  }

  return res.status(200).json({
    success: "Create single data point successful",
  });
};

const getDataPointFields = async (req, res, next) => {
  /* The idea of this function is to get the different fields / properties
     we have available to report on for this integrationKey and category 
     Making life easier for the front end - hopefully :) */
  const { category } = req.body;
  /* First do some validations */
  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data = await DataPoint.find({
    category: category,
    integrationKey: integrationKey,
  });

  let keysArray = data.map((dp) => Object.keys(dp.data));

  return res.status(200).json({
    success: "Datapoint keys retrieved",
    fieldNames: keysArray,
  });
};

const bulkCreateDataPoints = async (req, res, next) => {
  /* Bulk create data points API  */
  const { data, category } = req.body;

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  /* TO-DO: DO THIS WITH A BULK  UPDATE!! */

  /* If all is well, then go ahead and create */
  data.array.forEach(async (element) => {
    let newDp = new DataPoint({
      integrationKey,
      category,
      data: element,
      createdDate: new Date().toDateString,
      source: "test",
    });

    try {
      await newDp.save();
    } catch (e) {
      console.log("Error bulk saving data points: " + e);
      return res.status(500).json({
        error: "Error saving datapoints, please contact support",
      });
    }
  });

  return res.status(200).json({
    success: "Bulk create data points successful",
  });
};

const fetchAllDataPoints = async (req, res, next) => {
  /* Fetch ALL data for this specific user account */

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await DataPoint.find(
      { integrationKey: integrationKey },
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

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await DataPoint.find(
      {
        category: category,
        integrationKey: integrationKey,
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

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  /* ALWAYS ADD THESE GUYS */
  Object.defineProperty(filters, "category", { value: category });
  Object.defineProperty(filters, "integrationKey", { value: integrationKey });

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
module.exports.createSingleDataPoint = createSingleDataPoint;
module.exports.bulkCreateDataPoints = bulkCreateDataPoints;
module.exports.fetchAllDataPoints = fetchAllDataPoints;
module.exports.fetchDataPointsByCategory = fetchDataPointsByCategory;
module.exports.fetchDataWithFilters = fetchDataWithFilters;
