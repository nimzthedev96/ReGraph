const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/* 
  TO-DO: 
  - Validate/Verify Email 
  - Forgot password functionality
  - Implement JWT
  - Validate user status on login 
*/

const registerUser = async (req, res, next) => {
  const { firstName, lastName, cellNumber, email, password, acceptedTandC } =
    req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log("check", err);
    return res
      .status(500)
      .json({ error: "Error creating user, please contact support" });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ error: "User already exists with this email address." });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error creating user, please contact support" });
  }

  let integrationKey = uuidv4();

  const newUser = new User({
    firstName: firstName.replace(/\\|\//g, ""),
    lastName: lastName.replace(/\\|\//g, ""),
    cellNumber: cellNumber.replace(/\\|\//g, ""),
    email: email.replace(/\s+/g, ""),
    integrationKey: integrationKey,
    password: hashedPassword,
    acceptedTandC,
    userStatus: "Pending Validation", //Default initial status - we need to verify email address first
  });
  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ error: "Error creating user, please contact support" });
  }

  res.status(201).json({
    userEmail: newUser.email,
    userIntegrationKey: newUser.integrationKey,
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      message: "unable to Login please try again later",
    });
  }

  if (!existingUser) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(500).json({ message: "could not log you in" });
  }

  if (!isValidPassword) {
    return res.status(500).json({ message: "invalid user credentials" });
  }

  try {
    await existingUser.save();
  } catch (err) {
    console.log(err);
    return res.status(422).json({ message: "could not update last on date" });
  }

  /* TO-DO: Validate user status */

  // Generate JWT token
  let token;
  try {
    token = jwt.sign(
      {
        email: existingUser.email,
        integrationKey: existingUser.integrationKey,
      },
      "supersecretkey_themostsecretever",
      { expiresIn: "24h" }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again" });
  }

  res.json({
    token: token,
    userStatus: existingUser.userStatus,
    message: "Success",
  });
};

const updateEmail = async (req, res, next) => {
  const { userId, email } = req.body;

  let existingEmail;

  try {
    existingEmail = await User.findById({ _id: userId });
  } catch (err) {
    return res.status(500).json({ message: "unable to find user" });
  }

  existingEmail.email = email;
  existingEmail.dateCreated = new Date().toDateString();
  try {
    await existingEmail.save();
  } catch (err) {
    console.log("error", err);

    return res.status(500).json({ message: "unable to find user and save" });
  }

  return res.status(200).json({
    data: existingEmail.toObject({ getters: true }),
    message: "Your email has been updated",
  });
};

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.updateEmail = updateEmail;
//module.exports.validateUserEmail = validateUserEmail;
