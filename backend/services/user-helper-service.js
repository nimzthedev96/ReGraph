const User = require("../models/user");

class UserHelperService {
  static getuserKey() {
    let user;

    try {
      user = User.findOne({ email: userEmail });
    } catch (e) {
      return "Error";
    }

    return user.userKey;
  }
}

module.exports = UserHelperService;
