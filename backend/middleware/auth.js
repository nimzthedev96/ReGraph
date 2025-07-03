const jwt = require("jsonwebtoken");

const HttpError = require("../models/httpError");

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization.split(" ")[1]; //Split out the token from 'Bearer [token]' in auth
  try {
    const token = await auth;
    if (!token) {
      const error = new HttpError("Authentication failed!", 401);
      return next(error);
    }
    const decodedToken = jwt.verify(token, "supersecretkey_themostsecretever");
    console.log(decodedToken);
    req.userData = {
      email: decodedToken.email,
      integrationKey: decodedToken.integrationKey,
    };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Invalid Authentication", 401);
    return next(error);
  }
};
