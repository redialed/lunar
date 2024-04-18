const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaURL: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    postTimestamp: { type: Date, default: Date.now },
    description: String,
    originalUploadID: { type: String, default: "0" },
    isVideo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
