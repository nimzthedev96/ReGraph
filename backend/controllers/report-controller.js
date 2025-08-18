/* Report module */

const HttpError = require("../models/httpError");
const Report = require("../models/report");

/* createNewReport: This API saves a new report to the database */
const createNewReport = async (req, res, next) => {
  const { reportKey, reportDesc, reportType, filters, category } = req.body;

  let userKey = req.userData.userKey;

  /* If all is well, then go ahead and create */
  let newReport = new Report({
    userKey,
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

/*fetchReports: This API fetches all existing reports for a user */
const fetchReports = async (req, res, next) => {
  let userKey = req.userData.userKey;
  let data;

  try {
    data = await Report.find({ userKey: userKey });
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
