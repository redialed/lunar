const express = require("express");
const router = express.Router();

const Post = require("../../../models/Post"); // Assuming your Post model is defined in a separate file
const User = require("../../../models/User");

router.post('/configure', async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;
    if (!ds_user_id || !sessionid) {
      return res.status(403).json({ message: 'Not allowed!' });
    }

    const account = await User.findOne({ userID: ds_user_id });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const { signed_body } = req.body;
    let device_timestamp;
    let caption;
    let upload_id;
    let uuid;

    if (signed_body) {
      const sentjson = signed_body.substring(65);
      const decodedjson = JSON.parse(sentjson);
      upload_id = decodedjson.upload_id || decodedjson.device_timestamp;
      device_timestamp = decodedjson.device_timestamp;
      uuid = decodedjson._uuid;
      caption = decodedjson.caption || null;
    } else {
      upload_id = device_timestamp;
    }

    await Post.updateOne({ originalUploadID: upload_id, originalUUID: uuid }, { description: caption });
    await User.updateOne({ userID: ds_user_id }, { $inc: { photoCount: 1 } });


    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
