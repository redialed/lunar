const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const config = require("../../../config");

const Post = require("../../../models/Post"); // Assuming your Post model is defined in a separate file
const User = require("../../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/photo", upload.single("photo"), async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;
    const upload_id = req.body.upload_id;

    if (!ds_user_id || !sessionid) {
      return res.status(403).json({ message: "Not allowed!" });
    }

    let postid;
    let originaluploadid = upload_id;

    const existingPost = await Post.findOne({
      originalUploadID: originaluploadid,
    });
    if (existingPost) {
      postid = existingPost._id;
    } else {
      const account = await User.findOne({ _id: ds_user_id });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const biggestPost = await Post.findOne({}).sort({ id: -1 }).limit(1);

      const postTimestamp = Date.now();
      const description = "Currently descriptions are not supported!";
      const views = 0;
      const isVideo = 0;

      const newPost = new Post({
        uploadedBy: account._id,
        mediaURL: null,
        postTimestamp: postTimestamp,
        description: description,
        originalUploadID: originaluploadid,
        isVideo: isVideo,
      });

      const photoURL = config.host + `public/photos/${newPost._id}.png`;
      newPost.mediaURL = photoURL;

      await newPost.save();
      postid = newPost._id;
    }

    const newName = `public/photos/${postid}.png`;
    fs.writeFile(newName, req.file.buffer, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ status: "fail" });
      }
      res.json({ status: "ok" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
