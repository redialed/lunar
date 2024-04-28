const express = require("express");
const router = express.Router();

const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const config = require("../../../config");

const Post = require("../../../models/Post");
const User = require("../../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const auth = require("../../../middleware/auth");

router.post("/photo", upload.single("photo"), auth, async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;

    const upload_id = req.body.upload_id;
    const uuid = req.body._uuid || null;

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

    const newName = `public/photos/tmp/${account.userID}/${upload_id}_${uuid}.png`;

    if (!fs.existsSync(`public/photos/tmp/${account.userID}`)) {
      fs.mkdirSync(`public/photos/tmp/${account.userID}`, { recursive: true });
    }

    if (!fs.existsSync(`public/photos/${account.userID}`)) {
      fs.mkdirSync(`public/photos/${account.userID}`, { recursive: true });
    }

    await sharp(req.file.buffer).png().toFile(newName);

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
