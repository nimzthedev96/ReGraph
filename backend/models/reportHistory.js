const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportHistorySchema = new Schema({
  userKey: { type: String, required: true },
  reportKey: { type: String, required: true },
  reportRunDate: { type: Date, required: true },
});

module.exports = mongoose.model("ReportHistorySchema", reportHistorySchema);
