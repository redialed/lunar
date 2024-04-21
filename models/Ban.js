const mongoose = require("mongoose");

const BanSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
	reason: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ban", BanSchema);
