const express = require("express");
const router = express.Router();

const User = require("../../../models/User");
const Follow = require("../../../models/Follow");

router.get("/show/:id", async (req, res) => {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    if (!accountId || !sessionID) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    // Ensure user is authenticated
    const user = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

  const idToLookup = req.params.id;

  const follow = await Follow.findOne({
    from: accountId,
    to: idToLookup,
  }).exec();

  const followedBy = await Follow.findOne({
    from: idToLookup,
    to: accountId,
  }).exec();

  res.json({
    blocking: false,
    followed_by: followedBy ? true : false,
    following: follow ? true : false,
    incoming_request: false,
    is_bestie: false,
    is_blocking_reel: false,
    is_muting_reel: false,
    is_private: false,
    is_restricted: false,
    muting: false,
    outgoing_request: false,
    is_feed_favorite: false,
    subscribed: false,
    is_eligible_to_subscribe: false,
    is_supervised_by_viewer: false,
    is_guardian_of_viewer: false,
    is_muting_notes: false,
    is_muting_media_notes: false,
    is_viewer_unconnected: true,
    status: "ok",
  });
});

router.post("/create/:id", async (req, res) => {
  try {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    if (!accountId || !sessionID) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    // Ensure user is authenticated
    const user = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const idToFollow = req.params.id;

    // check if user to follow exists
    const userToFollow = await User.findOne({ userID: idToFollow }).exec();
    if (!userToFollow) {
      return res.status(404).json({
        status: "fail",
        error_type: "user_not_found",
      });
    }

    if (accountId === idToFollow) {
      return res.status(400).json({
        status: "fail",
        error_type: "cannot_follow_self",
      });
    }

    const existingFollow = await Follow.findOne({
      from: accountId,
      to: idToFollow,
    }).exec();

    if (existingFollow) {
      return res.status(400).json({
        status: "fail",
        error_type: "already_following",
      });
    }

    const follow = new Follow({
      from: accountId,
      to: idToFollow,
    });

    const followedBy = await Follow.findOne({
      from: idToFollow,
      to: accountId,
    }).exec();

    await follow.save();

    userToFollow.followerCount += 1;
    await userToFollow.save();

    user.followingCount += 1;
    await user.save();

    res.json({
      friendship_status: {
        following: true,
        followed_by: followedBy ? true : false,
        blocking: false,
        muting: false,
        is_private: false,
        incoming_request: false,
        outgoing_request: false,
        is_bestie: false,
        is_restricted: false,
        is_feed_favorite: false,
        subscribed: false,
        is_eligible_to_subscribe: false,
      },
      previous_following: false,
      status: "ok",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      error_type: "generic_request_error",
    });
  }
});

router.post("/destroy/:id", async (req, res) => {
  try {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    if (!accountId || !sessionID) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    // Ensure user is authenticated
    const user = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const idToUnfollow = req.params.id;

    const userToUnfollow = await User.findOne({ userID: idToUnfollow }).exec();
    if (!userToUnfollow) {
        return res.status(404).json({
            status: "fail",
            error_type: "user_not_found",
            });
    }

    if (accountId === idToUnfollow) {
      return res.status(400).json({
        status: "fail",
        error_type: "cannot_follow_self",
      });
    }

    const existingFollow = await Follow.findOne({
      from: accountId,
      to: idToUnfollow,
    }).exec();

    if (!existingFollow) {
      return res.status(400).json({
        status: "fail",
        error_type: "not_following",
      });
    }

    // check if user to follow follows back
    const followedBy = await Follow.findOne({
      from: idToUnfollow,
      to: accountId,
    }).exec();

    await existingFollow.deleteOne({ from: accountId, to: idToUnfollow });

    userToUnfollow.followerCount -= 1;
    await userToUnfollow.save();

    user.followingCount -= 1;
    await user.save();

    res.json({
      friendship_status: {
        following: false,
        followed_by: followedBy ? true : false,
        blocking: false,
        muting: false,
        is_private: false,
        incoming_request: false,
        outgoing_request: false,
        is_bestie: false,
        is_restricted: false,
        is_feed_favorite: false,
        subscribed: false,
        is_eligible_to_subscribe: false,
      },
      previous_following: true,
      status: "ok",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      error_type: "generic_request_error",
    });
  }
});

router.get("/:id/followers", async (req, res) => {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    if (!accountId || !sessionID) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    // Ensure user is authenticated
    const user = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const idToLookup = req.params.id;

    const followers = await Follow.find({ to: idToLookup }).sort({ createdAt: -1 }).exec();

    const followersList = [];

    for (const follower of followers) {
        const user = await User.findOne({ userID: follower.from }).exec();
        followersList.push({
            pk: user.userID,
            pk_id: user.userID,
            id: user.userID,
            username: user.username,
            full_name: user.fullname,
            is_private: user.private,
            fbid_v2: user.userID,
            third_party_downloads_enabled: 0,
            strong_id__: user.userID,
            profile_pic_id: "3336601179441187388_62995714406",
            profile_pic_url: user.profilePicture,
            is_verified: user.verified,
            has_anonymous_profile_picture: false,
            account_badges: [],
            latest_reel_media: 0,
        });
    }

    res.json({
        users: followersList,
        has_more: true,
        status: "ok"
    });
});

router.get("/:id/following", async (req, res) => {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    if (!accountId || !sessionID) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    // Ensure user is authenticated
    const user = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const idToLookup = req.params.id;

    const following = await Follow.find({ from: idToLookup }).sort({ createdAt: -1 }).exec();

    const followingList = [];

    for (const followed of following) {
        const user = await User.findOne({ userID: followed.to }).exec();
        followingList.push({
            pk: user.userID,
            pk_id: user.userID,
            id: user.userID,
            username: user.username,
            full_name: user.fullname,
            is_private: user.private,
            fbid_v2: user.userID,
            third_party_downloads_enabled: 0,
            strong_id__: user.userID,
            profile_pic_id: "3336601179441187388_62995714406",
            profile_pic_url: user.profilePicture,
            is_verified: user.verified,
            has_anonymous_profile_picture: false,
            account_badges: [],
            latest_reel_media: 0,
        });
    }

    res.json({
        users: followingList,
        has_more: true,
        status: "ok"
    });
});

module.exports = router;
