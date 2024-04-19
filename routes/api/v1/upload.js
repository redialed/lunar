const express = require("express");
const router = express.Router();

const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const config = require("../../../config");

const Post = require("../../../models/Post"); // Assuming your Post model is defined in a separate file
const User = require("../../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const auth = require("../../../middleware/auth");

router.post("/photo", upload.single("photo"), auth, async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;

    const upload_id = req.body.upload_id;
    const uuid = req.body._uuid;

    let originaluploadid = upload_id;

    const existingPost = await Post.findOne({
      originalUploadID: originaluploadid,
      originalUUID: uuid,
    });

    if (req.file.size > 8000000) {
      return res.status(400).json({ message: "File too large" });
    }

    if (existingPost) {
      return res.status(409).json({ message: "Post already exists" });
    }

    const account = await User.findOne({ userID: ds_user_id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const postTimestamp = Date.now();
    const description = null;
    const isVideo = 0;

    function generateId(length) {
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const postPK = generateId(19);
    console.log(postPK);

    const postID = postPK + "_" + account.userID;

    const newPost = new Post({
      postPK,
      postID,
      uploadedBy: account.userID,
      mediaURL: null,
      mediaURI: null,
      postTimestamp: postTimestamp,
      description: description,
      originalUploadID: originaluploadid,
      originalUUID: uuid,
      isVideo: isVideo,
    });

    await User.updateOne({ userID: ds_user_id }, { $inc: { photoCount: 1 } });

    const photoURL = config.host + `public/photos/${account.userID}/${postID}.png`;
    newPost.mediaURL = photoURL;
    const photoURI = `public/photos/${account.userID}/${postID}.png`;
    newPost.mediaURI = photoURI;

    const newName = `public/photos/${account.userID}/${postID}.png`;

    if (!fs.existsSync(`public/photos/${account.userID}`)) {
      fs.mkdirSync(`public/photos/${account.userID}`, { recursive: true });
    }

    await sharp(req.file.buffer).png().toFile(newName);

    await newPost.save();

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
