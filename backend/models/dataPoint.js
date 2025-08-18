const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
  userKey: { type: String, required: true },
  category: { type: String, required: true },
  data: { type: {}, required: true },
  createdDate: { type: Date, required: true },
});

module.exports = mongoose.model("DataPoint", dataPointSchema);
