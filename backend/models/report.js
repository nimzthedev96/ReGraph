const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  userKey: { type: String, required: true },
  reportKey: { type: String, required: true },
  reportDescription: { type: String, required: true },
  createdDate: { type: Date, required: true },
  dataCategory: { type: String, required: true },
  filters: { type: [], required: false },
  reportType: {
    type: String,
    required: true,
    enum: ["PieChart", "BarGraph"],
  },
});

module.exports = mongoose.model("Report", reportSchema);
