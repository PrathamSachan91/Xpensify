const PORT = 2000;
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
const cors = require("cors");
const path = require("path");
const routes = require("./routes/routes");
const fileUpload = require("express-fileupload");
const { tableMigration } = require("./migration");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/v1", routes);
try {
   tableMigration();
} catch (e) {
  console.log("Something wend wrong in table migration");
}
// app.use(express.static(path.join(__dirname, "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
