/* Report module - Report history */

const reportHistoryController = require("../controllers/report-history-controller");
const { check } = require("express-validator");

const express = require("express");
const authCheck = require("../middleware/auth");

const router = express.Router();

router.use(authCheck);

router.post("/addReportHistory", reportHistoryController.addReportHistory);

router.get(
  "/fetchAllReportHistory",
  reportHistoryController.fetchAllReportHistory
);
router.get("/fetchReportHistory", reportHistoryController.fetchReportHistory);

module.exports = router;
