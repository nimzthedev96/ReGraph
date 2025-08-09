const express = require("express");
const port = process.env.PORT || 3002;
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const auth = require("./middleware/auth");

require("dotenv").config(); //For our environment variables

console.log("Starting backend server...");

const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  // Apply auth middleware only on certain paths
  if (req.path.startsWith("/data") || req.path.startsWith("/report")) {
    auth(req, res, next);
  } else {
    next();
  }
});

console.log("Files will be uploaded to: " + process.env.UPLOADS_FILE_PATH);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_FILE_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Get our routes
const dataRoutes = require("./routes/datapoint-routes");
const reportingRoutes = require("./routes/report-routes");
const reportHistRoutes = require("./routes/report-history-routes");
const userRoutes = require("./routes/user-routes");

//Connext to DB
main().catch((err) => console.log(err));
async function main() {
  console.log("Connecting to DB...");
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log("DB connection successful!");
  console.log("Server is ready to accept requests");
}

app.use("/user", userRoutes);
app.use("/data", dataRoutes);
app.use("/reporting", reportingRoutes);
app.use("/reportHistory", reportHistRoutes);

// File upload route
app.post("/uploadFile", upload.single("file"), function (req, res) {
  res.json({ message: "File uploaded successfully" });
});

// catch all error route
app.use((req, res, next) => {
  res.status(404).json({
    message: "NOT FOUND",
    code: 404,
    data: "Invalid",
  });
});

app.listen(port, () => {
  console.log("Backend server started. Listening on port " + port);
});
