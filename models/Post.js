const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    id: Number,
    uploadedBy: String,
    mediaURL: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    postTimestamp: { type: Date, default: Date.now },
    description: String,
    originalUploadID: String,
    isVideo: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
