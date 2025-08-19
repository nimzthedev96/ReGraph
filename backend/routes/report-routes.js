/* Report module - Reports */

const reportController = require("../controllers/report-controller");

const express = require("express");
const authCheck = require("../middleware/auth");

const router = express.Router();

router.use(authCheck);

router.post("/createNewReport", reportController.createNewReport);

router.get("/fetchAllReports", reportController.fetchReports);

module.exports = router;
