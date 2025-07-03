const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataPointSchema = new Schema({
  integrationKey: { type: String, required: true },
  category: { type: String, required: true },
  data: { type: {}, required: true },
  createdDate: { type: Date, required: true },
  source: { type: String, required: false },
});

module.exports = mongoose.model("DataPoint", dataPointSchema);
