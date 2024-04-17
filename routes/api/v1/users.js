const express = require("express");
const multer = require("multer");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/check_email", upload.none(), async (req, res) => {
  const signedBody = req.body.signed_body;

  let email;

  if (signedBody) {
    const sentJson = signedBody.substring(65);
    const decodedJson = JSON.parse(sentJson);
    email = decodedJson.email;
  } else {
    return res.status(400).json({
      errors: {
        error: ["Signed body is missing!"],
      },
      status: "ok",
      error_type: "generic_request_error",
    });
  }

  // check if email exists in the database
  const user = await User.findOne({ email });

  if (user) {
    return res.json({
      valid: true,
      available: false,
      allow_shared_email_registration: true,
      error_type: "email_is_taken",
      status: "ok",
    });
  } else {
    return res.json({
      valid: true,
      available: true,
      allow_shared_email_registration: false,
      username_suggestions: [],
      tos_version: "eu",
      age_required: true,
      status: "ok",
    });
  }
});

router.get("/:id/info", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        status: "fail",
        error_type: "error",
      });
    }

    const response = {
      user: {
        pk: user._id,
        username: user.username,
        follow_friction_type: 0,
        is_verified: user.verified,
        profile_pic_id: "2577010241112975910_47422889959",
        profile_pic_url: user.profilePicture,
        full_name: user.fullname,
        pk_id: user._id,
        is_private: user.private,
        account_badges: [],
        has_anonymous_profile_picture: false,
        is_supervision_features_enabled: false,
        follower_count: user.followerCount,
        media_count: user.photoCount,
        following_count: user.followingCount,
        following_tag_count: 0,
        geo_media_count: 0,
        can_use_affiliate_partnership_messaging_as_creator: false,
        can_use_affiliate_partnership_messaging_as_brand: false,
        has_private_collections: false,
        all_media_count: 10,
        has_music_on_profile: false,
        is_direct_roll_call_enabled: false,
        liked_clips_count: 0,
        is_potential_business: false,
        fan_club_info: {
          fan_club_id: null,
          fan_club_name: null,
          is_fan_club_referral_eligible: null,
          fan_consideration_page_revamp_eligiblity: null,
          is_fan_club_gifting_eligible: null,
        },
        is_muted_words_global_enabled: false,
        is_muted_words_custom_enabled: false,
        is_muted_words_spamscam_enabled: false,
        fbid_v2: "17841447338787861",
        whatsapp_number: "",
        is_whatsapp_linked: false,
        transparency_product_enabled: false,
        is_hide_more_comment_enabled: false,
        is_quiet_mode_enabled: false,
        last_seen_timezone: "",
        allow_tag_setting: "everyone",
        allow_mention_setting: "everyone",
        interop_messaging_user_fbid: 0,
        bio_links: [],
        can_add_fb_group_link_on_profile: false,
        can_follow_hashtag: false,
        show_insights_terms: false,
        external_url: user.website,
        can_tag_products_from_merchants: false,
        eligible_shopping_signup_entrypoints: [],
        is_igd_product_picker_enabled: false,
        is_eligible_for_affiliate_shop_onboarding: false,
        eligible_shopping_formats: [],
        needs_to_accept_shopping_seller_onboarding_terms: false,
        is_shopping_settings_enabled: false,
        is_shopping_community_content_enabled: false,
        is_shopping_auto_highlight_eligible: false,
        is_shopping_catalog_source_selection_enabled: false,
        is_eligible_to_show_fb_cross_sharing_nux: true,
        has_guides: false,
        has_highlight_reels: false,
        allowed_commenter_type: "any",
        aggregate_promote_engagement: true,
        show_conversion_edit_entry: false,
        fbpay_experience_enabled: false,
        has_placed_orders: false,
        hd_profile_pic_url_info: {
          url: user.profilePicture,
          width: 1080,
          height: 1080,
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
        is_interest_account: false,
        is_needy: true,
        usertags_count: 0,
        usertag_review_enabled: false,
        is_profile_action_needed: false,
        reel_auto_archive: "on",
        total_ar_effects: 0,
        has_saved_items: false,
        total_clips_count: 0,
        has_videos: false,
        total_igtv_videos: 0,
        can_see_support_inbox_v1: true,
        can_boost_post: false,
        can_see_support_inbox: false,
        can_be_tagged_as_sponsor: false,
        is_allowed_to_create_standalone_nonprofit_fundraisers: true,
        is_allowed_to_create_standalone_personal_fundraisers: false,
        can_create_new_standalone_fundraiser: true,
        can_create_new_standalone_personal_fundraiser: true,
        biography: user.biography,
        include_direct_blacklist_status: true,
        show_fb_link_on_profile: false,
        primary_profile_link_type: 0,
        can_create_sponsor_tags: false,
        can_convert_to_business: false,
        can_see_organic_insights: false,
        is_business: false,
        professional_conversion_suggested_account_type: 2,
        account_type: 1,
        is_category_tappable: false,
        current_catalog_id: null,
        mini_shop_seller_onboarding_status: null,
        shopping_post_onboard_nux_type: null,
        ads_incentive_expiration_date: null,
        page_id_for_new_suma_biz_account: null,
        displayed_action_button_partner: null,
        smb_delivery_partner: null,
        smb_support_delivery_partner: null,
        displayed_action_button_type: null,
        smb_support_partner: null,
        is_call_to_action_enabled: null,
        num_of_admined_pages: null,
        request_contact_enabled: false,
        robi_feedback_source: null,
        is_memorialized: false,
        open_external_url_with_in_app_browser: true,
        has_exclusive_feed_content: false,
        has_fan_club_subscriptions: false,
        pinned_channels_info: {
          pinned_channels_list: [],
          has_public_channels: false,
        },
        besties_count: 0,
        show_besties_badge: true,
        recently_bestied_by_count: 0,
        nametag: null,
        about_your_account_bloks_entrypoint_enabled: false,
        auto_expanding_chaining: false,
        existing_user_age_collection_enabled: true,
        show_post_insights_entry_point: true,
        has_public_tab_threads: true,
        feed_post_reshare_disabled: false,
        auto_expand_chaining: false,
        is_new_to_instagram: false,
        highlight_reshare_disabled: false,
      },
      status: "ok",
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: "fail" });
  }
});

module.exports = router;
