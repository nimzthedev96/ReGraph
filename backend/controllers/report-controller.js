const HttpError = require("../models/httpError");
const Report = require("../models/report");

const createNewReport = async (req, res, next) => {
  /* Create single data point API */
  const { reportKey, reportDesc, reportType, filters, category } = req.body;

  let integrationKey = req.userData.integrationKey;

  /* If all is well, then go ahead and create */
  let newReport = new Report({
    integrationKey,
    reportKey,
    reportDescription: reportDesc,
    createdDate: new Date().toDateString(),
    dataCategory: category,
    filters,
    reportType,
  });

  try {
    await newReport.save();
  } catch (e) {
    console.log("Error saving report: " + e);
    return res.status(500).json({
      error: "Error saving report, please contact support",
    });
  }

  return res.status(200).json({
    success: "Created new report",
  });
};

const fetchReports = async (req, res, next) => {
  /* Fetch all available reports for this user */

  let integrationKey = req.userData.integrationKey;

  let data;

  try {
    data = await Report.find({ integrationKey: integrationKey });
  } catch (err) {
    const error = new HttpError("Cant find any reports", 500);
    return next(error);
  }

  return res.json({
    reports: data.map((report) => report.toObject({ getters: true })),
  });
};

module.exports.createNewReport = createNewReport;
module.exports.fetchReports = fetchReports;
