const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  acceptedTandC: { type: String, required: true },
  /* userKey:  This field should never be known available to the outside world. Its our unique ID for ALL the users data */
  userKey: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
