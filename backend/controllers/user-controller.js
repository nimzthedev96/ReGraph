/* User module */

const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*registerUser: Register a new user on the system  */
const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

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
    console.log(err);
    return res
      .status(500)
      .json({ error: "Error creating user, please contact support" });
  }

  let userKey = uuidv4();

  const newUser = new User({
    firstName: firstName.replace(/\\|\//g, ""),
    lastName: lastName.replace(/\\|\//g, ""),
    email: email.replace(/\s+/g, ""),
    userKey: userKey,
    password: hashedPassword,
  });
  try {
    let createdUser = await newUser.save();
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ error: "Error creating user, please contact support" });
  }

  res.status(201).json({
    userEmail: newUser.email,
    userKey: newUser.userKey,
    message: "Success",
  });
};

/*loginUser: Logs a user into the system. Validates user credentials and 
  returns a JWT token */
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

  // Generate JWT token
  let token;
  try {
    token = jwt.sign(
      {
        email: existingUser.email,
        userKey: existingUser.userKey,
      },
      //This would normally be stored securely, secrets should not be hardcoded
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
    message: "Success",
  });
};

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
