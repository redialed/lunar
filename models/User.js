const mongoose = require("mongoose");
const config = require("../config");

const UserSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uniqueToken: { type: String, required: true, unique: true },
    deviceID: { type: String, required: true },
    sessionID: { type: String },
    private: { type: Boolean, required: true },
    verified: { type: Boolean, required: true },
    followerCount: { type: Number, required: true, default: 0 },
    followingCount: { type: Number, required: true, default: 0 },
    photoCount: { type: Number, required: true, default: 0 },
    profilePicture: { type: String },
    fullname: { type: String, default: null },
    biography: { type: String, default: null },
    website: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);