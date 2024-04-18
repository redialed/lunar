const express = require("express");
const router = express.Router();

const Post = require("../../../models/Post"); // Assuming your Post model is defined in a separate file
const User = require("../../../models/User");
const Like = require("../../../models/Like");

router.post('/configure', async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;

    if (!ds_user_id || !sessionid) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    // Ensure user is authenticated
    const user = await User.findOne({ userID: ds_user_id, sessionID: sessionid }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
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

router.post('/:id/like', async (req, res) => {
  const { ds_user_id, sessionid } = req.cookies;

  if (!ds_user_id || !sessionid) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  // Ensure user is authenticated
  const user = await User.findOne({ userID: ds_user_id, sessionID: sessionid }).exec();
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  const post = await Post.findOne({ postID: req.params.id }).exec();

  if (!post) {
    return res.status(404).json({
      status: "fail",
      error_type: "post_not_found",
    });
  }

  const like = await Like.findOne({ from: ds_user_id, to: post.postID }).exec();

  if (like) {
    return res.status(400).json({
      status: "fail",
      error_type: "already_liked",
    });
  }

  await Like.create({
    from: user.userID,
    to: post.postID,
  });

  await Post.updateOne({ postID: post.postID }, { $inc: { likes: 1 } });

  res.json({ status: 'ok' });
});

router.post('/:id/unlike', async (req, res) => {
  const { ds_user_id, sessionid } = req.cookies;

  if (!ds_user_id || !sessionid) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  // Ensure user is authenticated
  const user = await User.findOne({ userID: ds_user_id, sessionID: sessionid }).exec();
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  const post = await Post.findOne({ postID: req.params.id }).exec();

  if (!post) {
    return res.status(404).json({
      status: "fail",
      error_type: "post_not_found",
    });
  }

  const like = await Like.findOne({ to: post.postID, from: ds_user_id }).exec();

  if (!like) {
    return res.status(400).json({
      status: "fail",
      error_type: "not_liked",
    });
  }

  await Post.updateOne({ postID: post.postID }, { $inc: { likes: -1 } });

  await Like.deleteOne();

  res.json({ status: 'ok' });
});

module.exports = router;
