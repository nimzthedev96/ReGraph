const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const PORT = process.env.PORT || 3002;
const uuid = require("uuid");

const HttpError = require("./models/httpError");
const mongoose = require("mongoose");

// custom
const app = express();

// routes
const dataRoutes = require("./routes/datapoint-routes");
const reportingRoutes = require("./routes/report-routes");
const reportHistRoutes = require("./routes/report-history-routes");
const userRoutes = require("./routes/user-routes");

app.use(bodyParser.json({ limit: "50mb" }));
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://naominemeti96:2qWJr1y6sEbqk7fM@cluster0.e9u6rag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  //"mongodb+srv://mikesreactnative:bKEj0Q2I0ewLNxOU@driversfriend.1qlrssc.mongodb.net/?retryWrites=true&w=majority&appName=DriversFriend"
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,"
  );

  next();
});

app.use("/user", userRoutes);
app.use("/payment", userPaymentHistRoutes);
app.use("/data", dataRoutes);
app.use("/reporting", reportingRoutes);
app.use("/reportHistory", reportHistRoutes);

// catch all error route
app.use((req, res, next) => {
  res.status(404).json({
    message: "NOT FOUND",
    code: 404,
    data: "Invalid",
  });
});

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
