const express = require("express");
const router = express.Router();

const User = require("../../../models/User");
const Post = require("../../../models/Post");

router.get("/user/:id", async (req, res) => {
  try {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    // Ensure user is authenticated
    const user = await User.findOne({ _id: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const id = req.params.id;

    // Retrieve username based on ID
    const idUser = await User.findById(id).exec();
    if (!idUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
        error_type: "not_found",
      });
    }
    const idUsername = idUser.username;

    const fullArray = [];

    const posts = await Post.find({ uploadedBy: id }).exec();

    // Loop through each post
    for (const post of posts) {
      if (post) {
        // The timestamp needs to be in milliseconds, convert the full date (2024-04-17T23:34:20.748Z) to milliseconds
        const convertedTimestamp = new Date(post.postTimestamp).getTime();
        const pfpURL = idUser.profilePicture;
        const itemsArrayBro = {
          taken_at: convertedTimestamp,
          pk: post.uploadedBy,
          id: post._id,
          device_timestamp: null,
          media_type: 1,
          code: null,
          client_cache_key: null,
          filter_type: 1,
          is_unified_video: false,
          should_request_ads: false,
          original_media_has_visual_reply_media: false,
          caption_is_edited: false,
          like_and_view_counts_disabled: false,
          commerciality_status: "not_commercial",
          is_paid_partnership: false,
          is_visual_reply_commenter_notice_enabled: false,
          clips_tab_pinned_user_ids: [],
          has_delayed_metadata: false,
          comment_likes_enabled: false,
          comment_threading_enabled: false,
          max_num_visible_preview_comments: 2,
          has_more_comments: false,
          preview_comments: [],
          comments: [],
          comment_count: 2,
          photo_of_you: false,
          is_organic_product_tagging_eligible: false,
          can_see_insights_as_brand: false,
          user: {
            pk: post.uploadedBy,
            username: idUsername,
            is_verified: false,
            profile_pic_id: "2577010241112975910_47422889959",
            profile_pic_url: pfpURL,
            pk_id: post.uploadedBy,
            full_name: idUsername,
            is_private: false,
            account_badges: [],
            has_anonymous_profile_picture: false,
            fan_club_info: {
              fan_club_id: null,
              fan_club_name: null,
              is_fan_club_referral_eligible: null,
              fan_consideration_page_revamp_eligiblity: null,
              is_fan_club_gifting_eligible: null,
            },
            transparency_product_enabled: false,
            is_unpublished: false,
          },
          can_viewer_reshare: true,
          like_count: post.likes,
          has_liked: false,
          top_likers: [],
          facepile_top_likers: [],
          likers: [],
          image_versions: [
            {
              type: 7,
              width: 640,
              height: 640,
              url: post.mediaURL,
              scans_profile: "",
            },
            {
              type: 6,
              width: 320,
              height: 320,
              url: post.mediaURL,
              scans_profile: "",
            },
            {
              type: 5,
              width: 150,
              height: 150,
              url: post.mediaURL,
              scans_profile: "",
            },
          ],
          caption: {
            pk: post.uploadedBy,
            user_id: 47422889959,
            text: `${post.description}`,
            type: 1,
            created_at: 1664003134,
            created_at_utc: 1664003134,
            content_type: "comment",
            status: "Active",
            bit_flags: 0,
            did_report_as_spam: false,
            share_enabled: false,
            user: {
              pk: post.uploadedBy,
              username: idUsername,
              is_verified: false,
              profile_pic_id: "2577010241112975910_47422889959",
              profile_pic_url: pfpURL,
              fbid_v2: "17841447338787861",
              pk_id: "47422889959",
              full_name: idUsername,
              is_private: false,
            },
            is_covered: false,
            is_ranked_comment: false,
            media_id: 2934193405222034301,
            private_reply_status: 0,
          },
          comment_inform_treatment: {
            should_have_inform_treatment: false,
            text: "",
            url: null,
            action_type: null,
          },
          sharing_friction_info: {
            should_have_sharing_friction: false,
            bloks_app_url: null,
            sharing_friction_payload: null,
          },
          is_in_profile_grid: true,
          profile_grid_control_enabled: false,
          organic_tracking_token:
            "eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjpmYWxzZSwidXVpZCI6ImMzOTQ3ODE5ODljZTRiZTdiZjZmYThmOGQ4YzQ2ZjFiMjkzNDE5MzQwNTIyMjAzNDMwMSJ9LCJzaWduYXR1cmUiOiIifQ==",
          has_shared_to_fb: 0,
          product_type: "feed",
          deleted_reason: 0,
          integrity_review_decision: "pending",
          commerce_integrity_review_decision: null,
          music_metadata: null,
          is_artist_pick: false,
          can_view_more_preview_comments: false,
          hide_view_all_comment_entrypoint: false,
          inline_composer_display_condition: "impression_trigger",
        };

        fullArray.push(itemsArrayBro);
      }
    }

    res.json({
      items: fullArray,
      num_items: 0,
      idusername: idUsername,
      more_available: false,
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: "fail" });
  }
});

router.get("/timeline", async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;
    if (!ds_user_id || !sessionid) {
      return res.status(403).json({ message: "Not allowed!" });
    }

    const account = await User.findOne({ _id: ds_user_id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const biggestPost = await Post.findOne({}).sort({ ID: -1 }).limit(1);
    const biggestPostId = biggestPost ? biggestPost.ID : 0;

    if (biggestPostId === 0) {
      return res.json({
        items: [],
        num_results: 0,
        more_available: false,
        auto_load_more_enabled: false,
        status: "ok",
      });
    }

    const postid = "66205eb42eb0e3f32a2c6112";

    const post = await Post.findOne({ _id: postid });

    const pfpURL = account.profilePicture;

    const itemsarraybro = {
      taken_at: post.postTimestamp,
      pk: post._id,
      id: post._id,
      device_timestamp: 1664003125404877,
      media_type: 1,
      code: "Ci4WVskjZt9",
      client_cache_key: "MjkzNDE5MzQwNTIyMjAzNDMwMQ==.2",
      filter_type: 24,
      is_unified_video: false,
      should_request_ads: false,
      original_media_has_visual_reply_media: false,
      caption_is_edited: false,
      like_and_view_counts_disabled: false,
      commerciality_status: "not_commercial",
      is_paid_partnership: false,
      is_visual_reply_commenter_notice_enabled: false,
      clips_tab_pinned_user_ids: [],
      has_delayed_metadata: false,
      comment_likes_enabled: false,
      comment_threading_enabled: false,
      max_num_visible_preview_comments: 2,
      has_more_comments: false,
      preview_comments: [],
      comments: [],
      comment_count: 0,
      photo_of_you: false,
      is_organic_product_tagging_eligible: false,
      can_see_insights_as_brand: false,
      user: {
        pk: "662021b98b6192fee9dee451",
        username: "paris",
        is_verified: false,
        profile_pic_id: "2577010241112975910_47422889959",
        profile_pic_url: pfpURL,
        pk_id: "662021b98b6192fee9dee451",
        full_name: "paris",
        is_private: false,
        account_badges: [],
        has_anonymous_profile_picture: false,
        fan_club_info: {
          fan_club_id: null,
          fan_club_name: null,
          is_fan_club_referral_eligible: null,
          fan_consideration_page_revamp_eligiblity: null,
          is_fan_club_gifting_eligible: null,
        },
        transparency_product_enabled: false,
        is_unpublished: false,
      },
      can_viewer_reshare: true,
      like_count: post.likes,
      has_liked: false,
      top_likers: [],
      facepile_top_likers: [],
      likers: [],
      image_versions: [
        {
          type: 7,
          width: 640,
          height: 640,
          url: post.mediaURL,
          scans_profile: "",
        },
        {
          type: 6,
          width: 320,
          height: 320,
          url: post.mediaURL,
          scans_profile: "",
        },
        {
          type: 5,
          width: 150,
          height: 150,
          url: post.mediaURL,
          scans_profile: "",
        },
      ],
      caption: {
        pk: post._id,
        user_id: 47422889959,
        text: `${post.description} PostID: ${post.ID}`,
        type: 1,
        created_at: 1664003134,
        created_at_utc: 1664003134,
        content_type: "comment",
        status: "Active",
        bit_flags: 0,
        did_report_as_spam: false,
        share_enabled: false,
        user: {
          pk: post._id,
          username: "paris",
          is_verified: false,
          profile_pic_id: "2577010241112975910_47422889959",
          profile_pic_url: pfpURL,
          fbid_v2: "17841447338787861",
          pk_id: "47422889959",
          full_name: "paris",
          is_private: false,
        },
        is_covered: false,
        is_ranked_comment: false,
        media_id: 2934193405222034301,
        private_reply_status: 0,
      },
      comment_inform_treatment: {
        should_have_inform_treatment: false,
        text: "",
        url: null,
        action_type: null,
      },
      sharing_friction_info: {
        should_have_sharing_friction: false,
        bloks_app_url: null,
        sharing_friction_payload: null,
      },
      is_in_profile_grid: false,
      profile_grid_control_enabled: false,
      organic_tracking_token:
        "eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjpmYWxzZSwidXVpZCI6ImMzOTQ3ODE5ODljZTRiZTdiZjZmYThmOGQ4YzQ2ZjFiMjkzNDE5MzQwNTIyMjAzNDMwMSJ9LCJzaWduYXR1cmUiOiIifQ==",
      has_shared_to_fb: 0,
      product_type: "feed",
      deleted_reason: 0,
      integrity_review_decision: "pending",
      commerce_integrity_review_decision: null,
      music_metadata: null,
      is_artist_pick: false,
      can_view_more_preview_comments: false,
      hide_view_all_comment_entrypoint: false,
      inline_composer_display_condition: "impression_trigger",
    };

    const response = {
      items: [],
      num_results: 1,
      more_available: true,
      auto_load_more_enabled: true,
      status: "ok",
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
