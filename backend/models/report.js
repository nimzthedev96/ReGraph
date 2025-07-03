const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  integrationKey: { type: String, required: true },
  reportKey: { type: String, required: true },
  reportDescription: { type: String, required: true },
  createdDate: { type: Date, required: true },
  dataCategory: { type: String, required: true },
  filters: { type: [], required: true },
  reportType: {
    type: String,
    required: true,
    enum: ["Table", "Summary", "PiGraph", "BarGraph", "LineGraph"],
  },
});

module.exports = mongoose.model("Report", reportSchema);
