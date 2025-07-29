const jwt = require("jsonwebtoken");

const HttpError = require("../models/httpError");

module.exports = async (req, res, next) => {
  const token = req.headers["authorization"]; //Split out the token from 'Bearer [token]' in auth
  console.log(req.headers);
  console.log(token);
  try {
    if (!token) {
      const error = new HttpError("Authentication failed!", 401);
      return next(error);
    }
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      "supersecretkey_themostsecretever"
    );
    console.log(decodedToken);
    req.userData = {
      email: decodedToken.email,
      userKey: decodedToken.userKey,
    };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Invalid Authentication", 401);
    return next(error);
  }
};
