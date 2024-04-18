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

    // get post info
    const post = await Post.findOne({
      originalUploadID: upload_id,
      originalUUID: uuid,
    }).exec();

    res.json({
      media: {
        taken_at: Math.floor(post.postTimestamp.getTime() / 1000),
        pk: post.postPK,
        id: post.postID,
        hide_view_all_comment_entrypoint: false,
        is_visual_reply_commenter_notice_enabled: true,
        like_and_view_counts_disabled: false,
        sticker_translations_enabled: false,
        is_post_live_clips_media: false,
        is_reshare_of_text_post_app_media_in_ig: false,
        explore_hide_comments: false,
        comment_threading_enabled: false,
        is_unified_video: true,
        has_privately_liked: false,
        commerciality_status: "not_commercial",
        filter_type: 0,
        client_cache_key: "",
        integrity_review_decision: "pending",
        device_timestamp: null,
        caption_is_edited: false,
        strong_id__: post.postID,
        deleted_reason: 0,
        has_shared_to_fb: 0,
        should_request_ads: false,
        has_delayed_metadata: false,
        is_quiet_post: false,
        mezql_token: "",
        commenting_disabled_for_viewer: false,
        preview_comments: [],
        comment_count: 0,
        is_comments_gif_composer_enabled: true,
        comment_inform_treatment: {
          should_have_inform_treatment: false,
          text: "",
          url: null,
          action_type: null,
        },
        has_hidden_comments: false,
        clips_tab_pinned_user_ids: [],
        can_viewer_save: true,
        can_viewer_reshare: true,
        shop_routing_user_id: null,
        is_organic_product_tagging_eligible: false,
        featured_products: [],
        product_suggestions: [],
        comments: [],
        can_view_more_preview_comments: false,
        has_more_comments: false,
        max_num_visible_preview_comments: 2,
        likers: [],
        is_open_to_public_submission: false,
        can_see_insights_as_brand: false,
        media_type: 1,
        code: "",
        caption: post.description
          ? {
              bit_flags: 0,
              created_at: Math.floor(post.createdAt.getTime() / 1000),
              created_at_utc: Math.floor(post.createdAt.getTime() / 1000),
              did_report_as_spam: false,
              is_ranked_comment: false,
              pk: post.postPK,
              share_enabled: false,
              content_type: "comment",
              media_id: post.postPK,
              status: "Active",
              type: 1,
              user_id: user.userID,
              text: post.description,
              user: {
                pk: user.userID,
                pk_id: user.userID,
                id: user.userID,
                username: user.username,
                full_name: user.fullname,
                is_private: false,
                has_onboarded_to_text_post_app: false,
                strong_id__: user.userID,
                fbid_v2: user.userID,
                is_verified: user.verified,
                profile_pic_id: "2832243363949919680_43034513011",
                profile_pic_url: user.profilePicture,
              },
              is_covered: false,
              private_reply_status: 0,
            }
          : null,
        sharing_friction_info: {
          should_have_sharing_friction: false,
          bloks_app_url: null,
          sharing_friction_payload: null,
        },
        accessibility_caption: "",
        original_media_has_visual_reply_media: false,
        fb_user_tags: {
          in: [],
        },
        invited_coauthor_producers: [],
        is_in_profile_grid: false,
        profile_grid_control_enabled: false,
        highlights_info: {
          added_to: [],
        },
        user: {
          allowed_commenter_type: "any",
          fbid_v2: user.userID,
          feed_post_reshare_disabled: false,
          full_name: user.fullname,
          has_onboarded_to_text_post_app: false,
          id: user.userID,
          is_private: false,
          is_unpublished: false,
          pk: user.userID,
          pk_id: user.userID,
          reel_auto_archive: "on",
          show_account_transparency_details: true,
          show_insights_terms: false,
          strong_id__: user.userID,
          third_party_downloads_enabled: 0,
          username: user.username,
          account_badges: [],
          all_media_count: 9,
          can_boost_post: false,
          can_see_organic_insights: false,
          fan_club_info: {
            fan_club_id: null,
            fan_club_name: null,
            is_fan_club_referral_eligible: null,
            fan_consideration_page_revamp_eligiblity: null,
            is_fan_club_gifting_eligible: null,
            subscriber_count: null,
            connected_member_count: null,
            autosave_to_exclusive_highlight: null,
            has_enough_subscribers_for_ssc: null,
          },
          has_anonymous_profile_picture: false,
          hd_profile_pic_url_info: {
            url: user.profilePicture,
            width: 714,
            height: 714,
          },
          hd_profile_pic_versions: [
            {
              width: 320,
              height: 320,
              url: user.profilePicture,
            },
            {
              width: 640,
              height: 640,
              url: user.profilePicture,
            },
          ],
          interop_messaging_user_fbid: "",
          is_verified: user.verified,
          profile_pic_id: "2832243363949919680_43034513011",
          profile_pic_url: user.profilePicture,
        },
        image_versions2: {
          candidates: [
            {
              width: 1080,
              height: 1080,
              url: post.imageURL,
            },
          ],
        },
        original_width: 1080,
        original_height: 1080,
        enable_media_notes_production: false,
        product_type: "feed",
        is_paid_partnership: false,
        music_metadata: {
          music_canonical_id: "0",
          audio_type: null,
          music_info: null,
          original_sound_info: null,
          pinned_media_ids: null,
        },
        organic_tracking_token: null,
        ig_media_sharing_disabled: false,
        boost_unavailable_identifier: null,
        boost_unavailable_reason: null,
        is_auto_created: false,
        is_cutout_sticker_allowed: false,
        owner: {
          allowed_commenter_type: "any",
          fbid_v2: user.userID,
          feed_post_reshare_disabled: false,
          full_name: user.fullname,
          has_onboarded_to_text_post_app: false,
          id: user.userID,
          is_private: false,
          is_unpublished: false,
          pk: user.userID,
          pk_id: user.userID,
          reel_auto_archive: "on",
          show_account_transparency_details: true,
          show_insights_terms: false,
          strong_id__: user.userID,
          third_party_downloads_enabled: 0,
          username: user.username,
          account_badges: [],
          can_boost_post: false,
          can_see_organic_insights: false,
          fan_club_info: {
            fan_club_id: null,
            fan_club_name: null,
            is_fan_club_referral_eligible: null,
            fan_consideration_page_revamp_eligiblity: null,
            is_fan_club_gifting_eligible: null,
            subscriber_count: null,
            connected_member_count: null,
            autosave_to_exclusive_highlight: null,
            has_enough_subscribers_for_ssc: null,
          },
          has_anonymous_profile_picture: false,
          hd_profile_pic_url_info: {
            url: user.profilePicture,
            width: 714,
            height: 714,
          },
          hd_profile_pic_versions: [
            {
              width: 320,
              height: 320,
              url: user.profilePicture,
            },
            {
              width: 640,
              height: 640,
              url: user.profilePicture,
            },
          ],
          interop_messaging_user_fbid: "",
          is_verified: user.verified,
          profile_pic_id: "2832243363949919680_43034513011",
          profile_pic_url: user.profilePicture,
          transparency_product_enabled: false,
        },
        fb_aggregated_like_count: 0,
        fb_aggregated_comment_count: 0,
      },
      status: "ok",
    });
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
      profile_pic_id: liker.userID,
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

router.post("/:id/delete", async (req, res) => {
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

  try {
    const post = await Post.findOne({ postID: req.params.id }).exec();

    if (!post) {
      return res.status(404).json({
        status: "fail",
        error_type: "post_not_found",
      });
    }

    await Like.deleteMany({ to: req.params.id });
    await Post.deleteOne({ postID: req.params.id });
    await User.updateOne({ userID: ds_user_id }, { $inc: { photoCount: -1 } });

    res.json({
      did_delete: true,
      cxp_deep_deletion_global_response: {},
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
