const express = require("express");
const router = express.Router();

const Post = require("../../../models/Post"); // Assuming your Post model is defined in a separate file
const User = require("../../../models/User");
const Like = require("../../../models/Like");
const Follow = require("../../../models/Follow");

router.post("/configure", async (req, res) => {
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
    const user = await User.findOne({
      userID: ds_user_id,
      sessionID: sessionid,
    }).exec();
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

    await Post.updateOne(
      { originalUploadID: upload_id, originalUUID: uuid },
      { description: caption }
    );
    await User.updateOne({ userID: ds_user_id }, { $inc: { photoCount: 1 } });

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/:id/like", async (req, res) => {
  const { ds_user_id, sessionid } = req.cookies;

  if (!ds_user_id || !sessionid) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  // Ensure user is authenticated
  const user = await User.findOne({
    userID: ds_user_id,
    sessionID: sessionid,
  }).exec();
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

  res.json({ status: "ok" });
});

router.post("/:id/unlike", async (req, res) => {
  const { ds_user_id, sessionid } = req.cookies;

  if (!ds_user_id || !sessionid) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  // Ensure user is authenticated
  const user = await User.findOne({
    userID: ds_user_id,
    sessionID: sessionid,
  }).exec();
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

  res.json({ status: "ok" });
});

router.get("/:id/likers", async (req, res) => {
  const { ds_user_id, sessionid } = req.cookies;

  if (!ds_user_id || !sessionid) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  // Ensure user is authenticated
  const user = await User.findOne({
    userID: ds_user_id,
    sessionID: sessionid,
  }).exec();
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

  // Ensure post exists
  const post = await Post.findOne({ postID: req.params.id }).exec();

  if (!post) {
    return res.status(404).json({
      status: "fail",
      error_type: "post_not_found",
    });
  }

  const likers = await Like.find({ to: post.postID }).exec();

  const likersList = [];

  for (const like of likers) {
    const liker = await User.findOne({ userID: like.from }).exec();

    // check if logged in user is following the liker
    const following = await Follow.findOne({
      from: ds_user_id,
      to: liker.userID,
    }).exec();

    // check if liker is following the logged in user
    const followedBy = await Follow.findOne({
      from: liker.userID,
      to: ds_user_id,
    }).exec();

    likersList.push({
      pk: liker.userID,
      pk_id: liker.userID,
      username: liker.username,
      full_name: liker.fullname,
      is_private: liker.private,
      strong_id__: liker.userID,
      is_verified: liker.verified,
      profile_pic_id: "3332305783938388991_58387806137",
      profile_pic_url: liker.profilePicture,
      account_badges: [],
      friendship_status: {
        following: following ? true : false,
        followed_by: followedBy ? true : false,
        blocking: false,
        muting: false,
        is_private: false,
        incoming_request: false,
        outgoing_request: false,
        is_blocking_reel: false,
        is_muting_reel: false,
        is_bestie: false,
        is_restricted: false,
        is_feed_favorite: false,
        subscribed: false,
        is_eligible_to_subscribe: false,
        is_muting_notes: false,
      },
      latest_reel_media: 0,
    });
  }

  res.json({
    users: likersList,
    user_count: likersList.length,
    status: "ok",
  });
});

module.exports = router;
