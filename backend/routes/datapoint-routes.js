const datapointController = require("../controllers/datapoint-controller");
const { check } = require("express-validator");

const express = require("express");
const authCheck = require("../middleware/auth");

const router = express.Router();

router.use(authCheck);

router.post(
  "/readDataPointsFromFile",
  [check("filename").not().isEmpty(), check("category").not().isEmpty()],
  datapointController.readDataPointsFromFile
);

router.post(
  "/getDataPointFields",
  [check("category").not().isEmpty()],
  datapointController.getDataPointFields
);

router.get("/fetchAllDataPoints", datapointController.fetchAllDataPoints);

router.post(
  "/fetchDataPointsByCategory",
  [check("category").not().isEmpty()],
  datapointController.fetchDataPointsByCategory
);

router.post(
  "/fetchDataWithFilters",
  [
    check("category").not().isEmpty(),
    check("filters").not().isEmpty(),
    check("action").not().isEmpty(),
  ],
  datapointController.fetchDataWithFilters
);

module.exports = router;
