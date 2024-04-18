const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    postPK: { type: String, required: true, unique: true },
    postID: { type: String, required: true, unique: true },
    uploadedBy: { type: String, required: true },
    mediaURL: { type: String, required: true, default: null },
    mediaURI: { type: String, required: true, default: null },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    postTimestamp: { type: Date, default: Date.now },
    description: { type: String },
    originalUploadID: { type: String, default: "0" },
    originalUUID: { type: String, default: "0" },
    isVideo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
