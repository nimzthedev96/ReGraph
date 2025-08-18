/* Report module - report history */

const HttpError = require("../models/httpError");
const ReportHistory = require("../models/reportHistory");
const Report = require("../models/report");

/*addReportHistory: Add a new report history record for an existing report */
const addReportHistory = async (req, res, next) => {
  const { reportKey } = req.body;

  let userKey = req.userData.userKey;

  if (userKey == "" || userKey == null) {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let report = await Report.findOne({ reportKey: reportKey });
  console.log(report);
  if (!report) {
    return res.status(500).json({
      error: "Invalid report key provided, unable to save report history.",
    });
  }

  /* If all is well, then go ahead and create */
  let newReportHistory = new ReportHistory({
    userKey,
    reportKey,
    reportRunDate: new Date().toDateString(),
  });

  try {
    await newReportHistory.save();
  } catch (e) {
    console.log("Error saving report history: " + e);
    return res.status(500).json({
      error: "Error saving report hisotry, please contact support",
    });
  }

  return res.status(200).json({
    success: "Created new report history record",
  });
};

/*fetchAllReportHistory: Fetch all the report history for a user  */
const fetchAllReportHistory = async (req, res, next) => {
  /* Fetch all available reports for this user */
  let userKey = req.userData.userKey;

  if (userKey == "" || userKey == undefined) {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await ReportHistory.find({ userKey: userKey });
  } catch (err) {
    const error = new HttpError("Cant find any reports", 500);
    return next(error);
  }

  return res.json({
    reportHistory: data.map((reportHistory) =>
      reportHistory.toObject({ getters: true })
    ),
  });
};

/*fetchReportHistory: Fetch all the report history for a user and specific
  report */
const fetchReportHistory = async (req, res, next) => {
  /* Fetch all available reports for this user */
  const { reportKey } = req.body;

  let userKey = req.userData.userKey;

  if (userKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await ReportHistory.find({
      userKey: userKey,
      reportKey: reportKey,
    });
  } catch (err) {
    const error = new HttpError("Cant find any reports", 500);
    return next(error);
  }

  return res.json({
    reportHistory: data.map((reportHistory) =>
      reportHistory.toObject({ getters: true })
    ),
  });
};

module.exports.addReportHistory = addReportHistory;
module.exports.fetchAllReportHistory = fetchAllReportHistory;
module.exports.fetchReportHistory = fetchReportHistory;
