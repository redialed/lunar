const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// connect to mongoose and console log the connection
mongoose.connect("mongodb://localhost:27017/oldgram");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.static("public"));
app.use(require("./routes"));

app.get("/api/v2/status", (req, res) => {
  res.send("Oldgram API is running!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
