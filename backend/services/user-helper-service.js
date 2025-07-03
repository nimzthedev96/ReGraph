const User = require("../models/user");

class UserHelperService {
  static getIntegrationKey() {
    let user;

    try {
      user = User.findOne({ email: userEmail });
    } catch (e) {
      return "Error";
    }

    return user.integrationKey;
  }
}

module.exports = UserHelperService;
