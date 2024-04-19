const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

const app = express();
const port = 3000;

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// connect to mongoose and console log the connection
mongoose.connect("mongodb://localhost:27017/oldgram");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/public", express.static(__dirname + '/public'));
app.use(require("./routes"));


if (!fs.existsSync("public/photos")) {
  fs.mkdirSync("public/photos", { recursive: true });
}

if (!fs.existsSync("public/profilePictures")) {
  fs.mkdirSync("public/profilePictures", { recursive: true });
}

app.get("/api/v2/status", (req, res) => {
  res.send("Oldgram API is running!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
