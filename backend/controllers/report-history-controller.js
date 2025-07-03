const HttpError = require("../models/httpError");
const ReportHistory = require("../models/reportHistory");
const Report = require("../models/report");

const addReportHistory = async (req, res, next) => {
  const { reportKey } = req.body;

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
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
    integrationKey,
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

const fetchAllReportHistory = async (req, res, next) => {
  /* Fetch all available reports for this user */
  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await ReportHistory.find(
      { integrationKey: integrationKey },
      { _id: 0 } //remove ID's
    );
  } catch (err) {
    const error = new HttpError("Cant find any reports", 500);
    return next(error);
  }

  return res.json({
    reports: data.map((reportHistory) =>
      reportHistory.toObject({ getters: true })
    ),
  });
};

const fetchReportHistory = async (req, res, next) => {
  /* Fetch all available reports for this user */
  const { reportKey } = req.body;

  let integrationKey = req.userData.integrationKey;

  if (integrationKey == "Error") {
    return res.status(500).json({
      error: "Error finding user, please contact support",
    });
  }

  let data;

  try {
    data = await ReportHistory.find(
      {
        integrationKey: integrationKey,
        reportKey: reportKey,
      },
      { _id: 0 } //remove ID's
    );
  } catch (err) {
    const error = new HttpError("Cant find any reports", 500);
    return next(error);
  }

  return res.json({
    reports: data.map((reportHistory) =>
      reportHistory.toObject({ getters: true })
    ),
  });
};

module.exports.addReportHistory = addReportHistory;
module.exports.fetchAllReportHistory = fetchAllReportHistory;
module.exports.fetchReportHistory = fetchReportHistory;
