const express = require("express");
const router = express.Router();

const User = require("../../../models/User");
const Post = require("../../../models/Post");

router.get("/user/:id", async (req, res) => {
  try {
    const accountId = req.cookies.ds_user_id;
    const sessionID = req.cookies.sessionid;

    // Ensure user is authenticated
    const user = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const id = req.params.id;

    // Retrieve username based on ID
    const idUser = await User.findOne({ userID: id }).exec();
    if (!idUser) {
      return res.status(404).json({
        message: "User not found",
        status: "fail",
        error_type: "not_found",
      });
    }

    const fullArray = [];

    // get posts from the newest to the oldest
    const posts = await Post.find({ uploadedBy: id })
      .sort({ postTimestamp: -1 })
      .exec();
    const postCount = posts.length;

    // Loop through each post
    for (const post of posts) {
      if (post) {
        const itemsArrayBro = {
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
          comment_threading_enabled: true,
          is_unified_video: true,
          has_privately_liked: false,
          commerciality_status: "not_commercial",
          filter_type: 0,
          client_cache_key: "MzM0ODk4OTU3NzgxNTg5NjEyNw==.2",
          integrity_review_decision: "pending",
          device_timestamp: 1713450689814,
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
          inline_composer_display_condition: "impression_trigger",
          inline_composer_imp_trigger_time: 5,
          is_comments_gif_composer_enabled: true,
          comment_inform_treatment: {
            should_have_inform_treatment: false,
            text: "",
            url: null,
            action_type: null,
          },
          has_hidden_comments: false,
          has_liked: false,
          like_count: 0,
          top_likers: [],
          clips_tab_pinned_user_ids: [],
          can_viewer_save: true,
          can_viewer_reshare: true,
          shop_routing_user_id: null,
          is_organic_product_tagging_eligible: false,
          featured_products: [],
          product_suggestions: [],
          can_view_more_preview_comments: false,
          has_more_comments: false,
          max_num_visible_preview_comments: 2,
          likers: [],
          is_open_to_public_submission: false,
          can_see_insights_as_brand: false,
          media_type: 1,
          code: "code",
          caption: {
            bit_flags: 0,
            created_at: Math.floor(post.createdAt.getTime() / 1000),
            created_at_utc: Math.floor(post.createdAt.getTime() / 1000),
            did_report_as_spam: false,
            is_ranked_comment: false,
            pk: "18320627236121324",
            share_enabled: false,
            content_type: "comment",
            media_id: 3348989577815896127,
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
              profile_pic_url:
                user.profilePicture,
            },
            is_covered: false,
            private_reply_status: 0,
          },
          fundraiser_tag: {
            has_standalone_fundraiser: false,
          },
          sharing_friction_info: {
            should_have_sharing_friction: false,
            bloks_app_url: null,
            sharing_friction_payload: null,
          },
          original_media_has_visual_reply_media: false,
          fb_user_tags: {
            in: [],
          },
          invited_coauthor_producers: [],
          mashup_info: {
            mashups_allowed: false,
            can_toggle_mashups_allowed: true,
            has_been_mashed_up: false,
            is_light_weight_check: true,
            formatted_mashups_count: null,
            original_media: null,
            privacy_filtered_mashups_media_count: null,
            non_privacy_filtered_mashups_media_count: null,
            mashup_type: null,
            is_creator_requesting_mashup: false,
            has_nonmimicable_additional_audio: false,
            is_pivot_page_available: false,
          },
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
            is_private: user.private,
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
            interop_messaging_user_fbid: 17842303733433012,
            is_verified: user.verified,
            liked_clips_count: 0,
            profile_pic_id: "2832243363949919680_43034513011",
            profile_pic_url:
              user.profilePicture,
            transparency_product_enabled: false,
          },
          image_versions2: {
            candidates: [
              {
                width: 480,
                height: 480,
                url: post.mediaURL,
                scans_profile: "",
                estimated_scans_sizes: [],
              }
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
          organic_tracking_token: "",
          ig_media_sharing_disabled: false,
          boost_unavailable_identifier: null,
          boost_unavailable_reason: null,
          is_auto_created: false,
          is_cutout_sticker_allowed: false,
          is_reuse_allowed: false,
          enable_waist: true,
          owner: {
            allowed_commenter_type: "any",
            fbid_v2: 17841442990339314,
            feed_post_reshare_disabled: false,
            full_name: "TV47 Belgium",
            has_onboarded_to_text_post_app: false,
            id: "43034513011",
            is_private: false,
            is_unpublished: false,
            pk: 43034513011,
            pk_id: "43034513011",
            reel_auto_archive: "on",
            show_account_transparency_details: true,
            show_insights_terms: false,
            strong_id__: "43034513011",
            third_party_downloads_enabled: 0,
            username: "tv47be",
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
            interop_messaging_user_fbid: 17842303733433012,
            is_verified: false,
            profile_pic_id: "2832243363949919680_43034513011",
            profile_pic_url:
              "https://instagram.fbru4-1.fna.fbcdn.net/v/t51.2885-19/280058051_486653159914252_3984367702781253637_n.jpg?stp=dst-jpg_e0_s150x150\u0026_nc_ht=instagram.fbru4-1.fna.fbcdn.net\u0026_nc_cat=104\u0026_nc_ohc=3BS_VPo951kAb6kCufQ\u0026edm=ABmJApABAAAA\u0026ccb=7-5\u0026oh=00_AfBPSShV4Kb92UWbjZKGDGWzPBB7aT_0reRa3_P9EFnXAA\u0026oe=6626F98D\u0026_nc_sid=b41fef",
            transparency_product_enabled: false,
          },
          fb_aggregated_like_count: 0,
          fb_aggregated_comment_count: 0,
          thumbnail_url_for_post_or_reel:
            "https://instagram.fbru4-1.fna.fbcdn.net/v/t51.29350-15/438938460_1329461437927349_7749528799845782321_n.jpg?stp=dst-jpg_e15_s150x150\u0026_nc_ht=instagram.fbru4-1.fna.fbcdn.net\u0026_nc_cat=105\u0026_nc_ohc=dMaXJpOXBF0Ab67zkrn\u0026edm=ABmJApABAAAA\u0026ccb=7-5\u0026ig_cache_key=MzM0ODk4OTU3NzgxNTg5NjEyNw%3D%3D.2-ccb7-5\u0026oh=00_AfAbkxeotZ3gAWecxcc-ZsJzFvwUx0D_jfZrLZthWLLuUg\u0026oe=6626EFEE\u0026_nc_sid=b41fef",
        };

        fullArray.push(itemsArrayBro);
      }
    }

    res.json({
      num_results: postCount,
      more_available: false,
      items: fullArray,
      user: {
        pk: idUser.userID,
        pk_id: idUser.userID,
        username: idUser.username,
        full_name: idUser.fullname,
        is_private: idUser.private,
        has_onboarded_to_text_post_app: false,
        strong_id__: idUser.userID,
        profile_grid_display_type: "default",
        is_verified: idUser.verified,
        profile_pic_id: "2832243363949919680_43034513011",
        profile_pic_url: idUser.profilePicture,
        can_see_quiet_post_attribution: false,
      },
      auto_load_more_enabled: true,
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: "fail" });
  }
});

router.post("/timeline", async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;
    if (!ds_user_id || !sessionid) {
      return res.status(403).json({ message: "Not allowed!" });
    }

    const account = await User.findOne({ userID: ds_user_id });
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

    //    const itemsarraybro = {
    //      taken_at: post.postTimestamp,
    //      pk: post._id,
    //      id: post._id,
    //      device_timestamp: 1664003125404877,
    //      media_type: 1,
    //      code: "Ci4WVskjZt9",
    //      client_cache_key: "MjkzNDE5MzQwNTIyMjAzNDMwMQ==.2",
    //      filter_type: 24,
    //      is_unified_video: false,
    //      should_request_ads: false,
    //      original_media_has_visual_reply_media: false,
    //      caption_is_edited: false,
    //      like_and_view_counts_disabled: false,
    //      commerciality_status: "not_commercial",
    //      is_paid_partnership: false,
    //      is_visual_reply_commenter_notice_enabled: false,
    //      clips_tab_pinned_user_ids: [],
    //      has_delayed_metadata: false,
    //      comment_likes_enabled: false,
    //      comment_threading_enabled: false,
    //      max_num_visible_preview_comments: 2,
    //      has_more_comments: false,
    //      preview_comments: [],
    //      comments: [],
    //      comment_count: 0,
    //      photo_of_you: false,
    //      is_organic_product_tagging_eligible: false,
    //      can_see_insights_as_brand: false,
    //      user: {
    //        pk: "662021b98b6192fee9dee451",
    //        username: "paris",
    //        is_verified: false,
    //        profile_pic_id: "2577010241112975910_47422889959",
    //        profile_pic_url: pfpURL,
    //        pk_id: "662021b98b6192fee9dee451",
    //        full_name: "paris",
    //        is_private: false,
    //        account_badges: [],
    //        has_anonymous_profile_picture: false,
    //        fan_club_info: {
    //          fan_club_id: null,
    //          fan_club_name: null,
    //          is_fan_club_referral_eligible: null,
    //          fan_consideration_page_revamp_eligiblity: null,
    //          is_fan_club_gifting_eligible: null,
    //        },
    //        transparency_product_enabled: false,
    //        is_unpublished: false,
    //      },
    //      can_viewer_reshare: true,
    //      like_count: post.likes,
    //      has_liked: false,
    //      top_likers: [],
    //      facepile_top_likers: [],
    //      likers: [],
    //      image_versions: [
    //        {
    //          type: 7,
    //          width: 640,
    //          height: 640,
    //          url: post.mediaURL,
    //          scans_profile: "",
    //        },
    //        {
    //          type: 6,
    //          width: 320,
    //          height: 320,
    //          url: post.mediaURL,
    //          scans_profile: "",
    //        },
    //        {
    //          type: 5,
    //          width: 150,
    //          height: 150,
    //          url: post.mediaURL,
    //          scans_profile: "",
    //        },
    //      ],
    //      caption: {
    //        pk: post._id,
    //        user_id: 47422889959,
    //        text: `${post.description} PostID: ${post.ID}`,
    //        type: 1,
    //        created_at: 1664003134,
    //        created_at_utc: 1664003134,
    //        content_type: "comment",
    //        status: "Active",
    //        bit_flags: 0,
    //        did_report_as_spam: false,
    //        share_enabled: false,
    //        user: {
    //          pk: post._id,
    //          username: "paris",
    //          is_verified: false,
    //          profile_pic_id: "2577010241112975910_47422889959",
    //          profile_pic_url: pfpURL,
    //          fbid_v2: "17841447338787861",
    //          pk_id: "47422889959",
    //          full_name: "paris",
    //          is_private: false,
    //        },
    //        is_covered: false,
    //        is_ranked_comment: false,
    //        media_id: 2934193405222034301,
    //        private_reply_status: 0,
    //      },
    //      comment_inform_treatment: {
    //        should_have_inform_treatment: false,
    //        text: "",
    //        url: null,
    //        action_type: null,
    //      },
    //      sharing_friction_info: {
    //        should_have_sharing_friction: false,
    //        bloks_app_url: null,
    //        sharing_friction_payload: null,
    //      },
    //      is_in_profile_grid: false,
    //      profile_grid_control_enabled: false,
    //      organic_tracking_token:
    //        "eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjpmYWxzZSwidXVpZCI6ImMzOTQ3ODE5ODljZTRiZTdiZjZmYThmOGQ4YzQ2ZjFiMjkzNDE5MzQwNTIyMjAzNDMwMSJ9LCJzaWduYXR1cmUiOiIifQ==",
    //      has_shared_to_fb: 0,
    //      product_type: "feed",
    //      deleted_reason: 0,
    //      integrity_review_decision: "pending",
    //      commerce_integrity_review_decision: null,
    //      music_metadata: null,
    //      is_artist_pick: false,
    //      can_view_more_preview_comments: false,
    //      hide_view_all_comment_entrypoint: false,
    //      inline_composer_display_condition: "impression_trigger",
    //    };

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

router.get("/timeline", async (req, res) => {
  try {
    const { ds_user_id, sessionid } = req.cookies;
    if (!ds_user_id || !sessionid) {
      return res.status(403).json({ message: "Not allowed!" });
    }

    const account = await User.findOne({ userID: ds_user_id });
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

    //    const itemsarraybro = {
    //      taken_at: post.postTimestamp,
    //      pk: post._id,
    //      id: post._id,
    //      device_timestamp: 1664003125404877,
    //      media_type: 1,
    //      code: "Ci4WVskjZt9",
    //      client_cache_key: "MjkzNDE5MzQwNTIyMjAzNDMwMQ==.2",
    //      filter_type: 24,
    //      is_unified_video: false,
    //      should_request_ads: false,
    //      original_media_has_visual_reply_media: false,
    //      caption_is_edited: false,
    //      like_and_view_counts_disabled: false,
    //      commerciality_status: "not_commercial",
    //      is_paid_partnership: false,
    //      is_visual_reply_commenter_notice_enabled: false,
    //      clips_tab_pinned_user_ids: [],
    //      has_delayed_metadata: false,
    //      comment_likes_enabled: false,
    //      comment_threading_enabled: false,
    //      max_num_visible_preview_comments: 2,
    //      has_more_comments: false,
    //      preview_comments: [],
    //      comments: [],
    //      comment_count: 0,
    //      photo_of_you: false,
    //      is_organic_product_tagging_eligible: false,
    //      can_see_insights_as_brand: false,
    //      user: {
    //        pk: "662021b98b6192fee9dee451",
    //        username: "paris",
    //        is_verified: false,
    //        profile_pic_id: "2577010241112975910_47422889959",
    //        profile_pic_url: pfpURL,
    //        pk_id: "662021b98b6192fee9dee451",
    //        full_name: "paris",
    //        is_private: false,
    //        account_badges: [],
    //        has_anonymous_profile_picture: false,
    //        fan_club_info: {
    //          fan_club_id: null,
    //          fan_club_name: null,
    //          is_fan_club_referral_eligible: null,
    //          fan_consideration_page_revamp_eligiblity: null,
    //          is_fan_club_gifting_eligible: null,
    //        },
    //        transparency_product_enabled: false,
    //        is_unpublished: false,
    //      },
    //      can_viewer_reshare: true,
    //      like_count: post.likes,
    //      has_liked: false,
    //      top_likers: [],
    //      facepile_top_likers: [],
    //      likers: [],
    //      image_versions: [
    //        {
    //          type: 7,
    //          width: 640,
    //          height: 640,
    //          url: post.mediaURL,
    //          scans_profile: "",
    //        },
    //        {
    //          type: 6,
    //          width: 320,
    //          height: 320,
    //          url: post.mediaURL,
    //          scans_profile: "",
    //        },
    //        {
    //          type: 5,
    //          width: 150,
    //          height: 150,
    //          url: post.mediaURL,
    //          scans_profile: "",
    //        },
    //      ],
    //      caption: {
    //        pk: post._id,
    //        user_id: 47422889959,
    //        text: `${post.description} PostID: ${post.ID}`,
    //        type: 1,
    //        created_at: 1664003134,
    //        created_at_utc: 1664003134,
    //        content_type: "comment",
    //        status: "Active",
    //        bit_flags: 0,
    //        did_report_as_spam: false,
    //        share_enabled: false,
    //        user: {
    //          pk: post._id,
    //          username: "paris",
    //          is_verified: false,
    //          profile_pic_id: "2577010241112975910_47422889959",
    //          profile_pic_url: pfpURL,
    //          fbid_v2: "17841447338787861",
    //          pk_id: "47422889959",
    //          full_name: "paris",
    //          is_private: false,
    //        },
    //        is_covered: false,
    //        is_ranked_comment: false,
    //        media_id: 2934193405222034301,
    //        private_reply_status: 0,
    //      },
    //      comment_inform_treatment: {
    //        should_have_inform_treatment: false,
    //        text: "",
    //        url: null,
    //        action_type: null,
    //      },
    //      sharing_friction_info: {
    //        should_have_sharing_friction: false,
    //        bloks_app_url: null,
    //        sharing_friction_payload: null,
    //      },
    //      is_in_profile_grid: false,
    //      profile_grid_control_enabled: false,
    //      organic_tracking_token:
    //        "eyJ2ZXJzaW9uIjo1LCJwYXlsb2FkIjp7ImlzX2FuYWx5dGljc190cmFja2VkIjpmYWxzZSwidXVpZCI6ImMzOTQ3ODE5ODljZTRiZTdiZjZmYThmOGQ4YzQ2ZjFiMjkzNDE5MzQwNTIyMjAzNDMwMSJ9LCJzaWduYXR1cmUiOiIifQ==",
    //      has_shared_to_fb: 0,
    //      product_type: "feed",
    //      deleted_reason: 0,
    //      integrity_review_decision: "pending",
    //      commerce_integrity_review_decision: null,
    //      music_metadata: null,
    //      is_artist_pick: false,
    //      can_view_more_preview_comments: false,
    //      hide_view_all_comment_entrypoint: false,
    //      inline_composer_display_condition: "impression_trigger",
    //    };

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
