const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        uniqueToken: { type: String, required: true, unique: true },
        deviceID: { type: String, required: true },
        sessionID: { type: String, required: true },
        private: { type: Boolean, required: true },
        verified: { type: Boolean, required: true },
        followerCount: { type: Number, required: true, default: 0 },
        followingCount: { type: Number, required: true, default: 0 },
        photoCount: { type: Number, required: true, default: 0 },
        profilePicture: { type: String },
        fullname: { type: String, default: null },
        biography: { type: String, default: null },
        website: { type: String, default: null }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

// ID, username, Password, uniquetoken, device_id, sessionid, isaccountprivate, isverified, followercount, followingcount, photocount, pfpURL, fullname, biography, website