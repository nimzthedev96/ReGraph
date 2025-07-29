const express = require("express");
const PORT = process.env.PORT || 3002;
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const auth = require("./middleware/auth");

const app = express();

//middleware
app.use(express.json());
app.use(cors());
//app.use(bodyParser.json({ limit: "50mb" }));
app.use((req, res, next) => {
  // Apply auth middleware only on certain paths
  if (req.path.startsWith("/data") || req.path.startsWith("/report")) {
    auth(req, res, next);
  } else {
    next();
  }
});

//TO DO: make directory configurable
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/user_files/");
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
  await mongoose.connect(
    "mongodb+srv://naominemeti96:2qWJr1y6sEbqk7fM@cluster0.e9u6rag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
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

app.listen(PORT, () => {
  console.log("listening on " + PORT);
});
