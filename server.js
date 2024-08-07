const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

const app = express();
const port = 300;

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 2);

if (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

const options = {
  auth: {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
  },
};

mongoose
  .connect(process.env.MONGO_URL, options)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/public", express.static(__dirname + "/public"));
app.use(require("./routes"));

if (!fs.existsSync("public/photos")) {
  fs.mkdirSync("public/photos", { recursive: true });
}

if (!fs.existsSync("public/profilePictures")) {
  fs.mkdirSync("public/profilePictures", { recursive: true });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
