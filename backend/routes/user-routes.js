/* User module */

const userController = require("../controllers/user-controller");
const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

router.post(
  "/registerUser",
  [
    check("userEmail").not().isEmpty(),
    check("firstName").not().isEmpty(),
    check("lastName").not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  userController.registerUser
);

router.post(
  "/loginUser",
  [check("userEmail").not().isEmpty(), check("password").not().isEmpty()],
  userController.loginUser
);

module.exports = router;
