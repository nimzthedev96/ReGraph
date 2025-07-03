const datapointController = require("../controllers/datapoint-controller");
const { check } = require("express-validator");

const express = require("express");
const authCheck = require("../middleware/auth");

const router = express.Router();

router.use(authCheck);

router.post(
  "/addDataPoint",
  [check("data").not().isEmpty(), check("category").not().isEmpty()],
  datapointController.createSingleDataPoint
);

router.post(
  "/bulkAddDataPoints",
  [check("data").not().isEmpty(), check("category").not().isEmpty()],
  datapointController.bulkCreateDataPoints
);

router.get(
  "/getDataPointFields",
  [check("category").not().isEmpty()],
  datapointController.getDataPointFields
);

router.get("/fetchAllDataPoints", datapointController.fetchAllDataPoints);

router.get(
  "/fetchDataPointsByCategory",
  [check("category").not().isEmpty()],
  datapointController.fetchDataPointsByCategory
);

router.get(
  "/fetchDataWithFilters",
  [
    check("category").not().isEmpty(),
    check("filters").not().isEmpty(),
    check("action").not().isEmpty(),
  ],
  datapointController.fetchDataWithFilters
);

module.exports = router;
