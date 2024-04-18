const express = require("express");
const multer = require("multer");
const router = express.Router();
const bcrypt = require("bcrypt");
const sharp = require('sharp');
const fs = require('fs');
const config = require("../../../config");

const User = require("../../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", async (req, res) => {
  const signedBody = req.body.signed_body;

  let username, password;

  if (signedBody) {
    const sentJson = signedBody.substring(65);
    const decodedJson = JSON.parse(sentJson);
    username = decodedJson.username;
    password = decodedJson.password;
  } else {
    return res.status(400).json({
      errors: {
        error: ["Signed body is missing!"],
      },
      status: "ok",
      error_type: "generic_request_error",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message:
          "This account couldn't be found. Please check your username and try again.",
        status: "fail",
        error_type: "generic_request_error",
      });
    }

    const token = user.uniqueToken;
    const hashedPassword = user.password;
    const saltedPassword = token + password + token;

    if (await bcrypt.compare(saltedPassword, hashedPassword)) {
      const generateRandomString = (length) => {
        let result = "";
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      };

      const sessionID = generateRandomString(64);

      await User.updateOne({ username }, { sessionID });

      const id = user.userID;

      res.cookie("sessionid", sessionID, { maxAge: 30 * 24 * 60 * 60 * 1000 });
      res.cookie("ds_user_id", id, { maxAge: 30 * 24 * 60 * 60 * 1000 });

      const response = {
        logged_in_user: {
          pk: user.userID,
          username: user.username,
          is_verified: user.verified,
          profile_pic_id: user.userID,
          profile_pic_url: user.profilePicture,
          is_private: user.isaccountprivate,
          pk_id: user.userID,
          full_name: user.fullname,
          account_badges: [],
          has_anonymous_profile_picture: false,
          is_supervision_features_enabled: false,
          all_media_count: 0,
          liked_clips_count: 0,
          fbid_v2: user.userID,
          interop_messaging_user_fbid: 0,
          is_using_unified_inbox_for_direct: false,
          biz_user_inbox_state: 0,
          show_insights_terms: false,
          nametag: {
            mode: 0,
            gradient: "2",
            emoji: "😀",
            selfie_sticker: "0",
          },
          allowed_commenter_type: "any",
          has_placed_orders: false,
          reel_auto_archive: "on",
          total_igtv_videos: 0,
          can_boost_post: false,
          can_see_organic_insights: false,
          wa_addressable: false,
          wa_eligibility: 0,
          is_business: false,
          professional_conversion_suggested_account_type: 2,
          account_type: 1,
          is_category_tappable: false,
          is_call_to_action_enabled: null,
          allow_contacts_sync: false,
          phone_number: "",
        },
        session_flush_nonce: null,
        token: null,
        auth_token: null,
        status: "ok",
      };

      return res.json(response);
    } else {
      return res.status(400).json({
        message: "Incorrect username or password!",
        status: "fail",
        error_type: "generic_request_error",
      });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", upload.single('profile_pic'), async (req, res) => {
  const signedBody = req.body.signed_body;

  if (!signedBody) {
    return res.status(400).json({
      errors: {
        error: ["Signed body is missing!"],
      },
      status: "ok",
      error_type: "generic_request_error",
    });
  }

  const sentJson = signedBody.substring(65);
  const decodedJson = JSON.parse(sentJson);

  const username = decodedJson.username.toLowerCase();
  const email = decodedJson.email;
  const password = decodedJson.password;
  const deviceID = decodedJson.device_id;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        errors: {
          error: ["This username is already taken!"],
        },
        status: "ok",
        error_type: "generic_request_error",
      });
    }

    function generateUserId() {
      const min = 1000000000;
      const max = 9999999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Example usage
    const userID = generateUserId();
    console.log(userID);

    const token = Math.floor(Math.random() * 2147483647); // Random token
    const hashedPassword = await bcrypt.hash(token + password + token, 10);

    function generateId(length) {
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const pfpPK = generateId(19);

    let profilePictureUrl = config.host + "public/profilePictures/default.png"; 

    if (req.file) {
      const uploadedPhoto = req.file;

      if (req.file.size > 8000000) {
        return res.status(400).json({ message: "File too large" });
      }

      if (!fs.existsSync(`public/profilePictures/${userID}`)) {
        fs.mkdirSync(`public/profilePictures/${userID}`, { recursive: true });
      }

      const fileName = `public/profilePictures/${userID}/${pfpPK}_${userID}.png`;
      await sharp(uploadedPhoto.buffer).resize({ width: 500, height: 500 }).png().toFile(fileName);

      profilePictureUrl = config.host + fileName;
    }

    const generateRandomString = (length) => {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    const sessionID = generateRandomString(64);

    // Create new user
    const newUser = new User({
      userID,
      email,
      username,
      password: hashedPassword,
      uniqueToken: token,
      deviceID,
      sessionID,
      private: false,
      verified: false,
      followerCount: 0,
      followingCount: 0,
      photoCount: 0,
      profilePicture: profilePictureUrl,
      fullname: username,
    });

    await newUser.save();

    return res.json({
      errors: {
        error: [
          "Your account has been created successfully! Just login and have fun!",
        ],
      },
      status: "ok",
      error_type: "generic_request_error",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/username_suggestions", async (req, res) => {
  res.json({
    username_suggestions: [],
    status: "ok",
  });
});

router.get("/current_user", async (req, res) => {
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
    const userAuth = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!userAuth) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const user = await User.findOne({ userID: accountId }).exec();

    const response = {
      user: {
        biography: user.biography,
        primary_profile_link_type: 0,
        show_fb_link_on_profile: false,
        show_fb_page_link_on_profile: false,
        can_hide_category: true,
        smb_support_partner: null,
        can_add_fb_group_link_on_profile: false,
        is_quiet_mode_enabled: false,
        last_seen_timezone: "",
        account_category: "",
        allowed_commenter_type: "any",
        fbid_v2: "0",
        full_name: user.fullname,
        gender: 3,
        is_hide_more_comment_enabled: false,
        is_muted_words_custom_enabled: false,
        is_muted_words_global_enabled: false,
        is_muted_words_spamscam_enabled: false,
        is_private: user.private,
        has_nme_badge: false,
        pk: user.userID,
        pk_id: user.userID,
        reel_auto_archive: "on",
        show_ig_app_switcher_badge: true,
        strong_id__: user.userID,
        external_url: user.website,
        category: null,
        is_category_tappable: false,
        is_business: false,
        professional_conversion_suggested_account_type: 2,
        account_type: 1,
        displayed_action_button_partner: null,
        smb_delivery_partner: null,
        smb_support_delivery_partner: null,
        displayed_action_button_type: null,
        is_call_to_action_enabled: null,
        num_of_admined_pages: null,
        page_id: null,
        page_name: null,
        ads_page_id: null,
        ads_page_name: null,
        bio_links: [],
        account_badges: [],
        all_media_count: 0,
        birthday_today_visibility_for_viewer: "NOT_VISIBLE",
        email: user.email,
        has_anonymous_profile_picture: false,
        hd_profile_pic_url_info: {
          url: "",
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
        interop_messaging_user_fbid: 17846310074577960,
        is_mv4b_biz_asset_profile_locked: false,
        has_legacy_bb_pending_profile_picture_update: false,
        is_showing_birthday_selfie: false,
        is_supervision_features_enabled: false,
        is_verified: user.verified,
        liked_clips_count: 0,
        has_active_mv4b_application: false,
        phone_number: "",
        profile_pic_id: "1",
        profile_pic_url: user.profilePicture,
        profile_edit_params: {
          username: {
            should_show_confirmation_dialog: false,
            is_pending_review: false,
            confirmation_dialog_text:
              "Because your account reaches a lot of people, your username change may need to be reviewed. If so, you'll be notified when we've reviewed it. If not, your username will change immediately.",
            disclaimer_text: "",
          },
          full_name: {
            should_show_confirmation_dialog: false,
            is_pending_review: false,
            confirmation_dialog_text:
              "Because your account is verified, your name change may need to be reviewed. If so, you'll be notified when we've reviewed it. If not, your name will change immediately.",
            disclaimer_text: "",
          },
        },
        show_conversion_edit_entry: false,
        show_together_pog: false,
        trusted_username: user.username,
        trust_days: 0,
        username: user.username,
      },
      status: "ok",
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: "fail" });
  }
});

router.post("/edit_profile", async (req, res) => {
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
    const userAuth = await User.findOne({ userID: accountId, sessionID }).exec();
    if (!userAuth) {
      return res.status(401).json({
        message: "Unauthorized",
        status: "fail",
        error_type: "authentication",
      });
    }

    const user = await User.findOne({ userID: accountId }).exec();

    const signedBody = req.body.signed_body;
    if (!signedBody) {
      return res.status(400).json({
        errors: {
          error: ["Signed body is missing!"],
        },
        status: "ok",
        error_type: "generic_request_error",
      });
    }

    const sentJson = signedBody.substring(65);
    const decodedJson = JSON.parse(sentJson);

    const username = decodedJson.username;
    const fullname = decodedJson.first_name;
    const biography = decodedJson.biography;
    const website = decodedJson.external_url;
    const email = decodedJson.email;

    await User.updateOne(
      { userID: accountId },
      { username, fullname, biography, website, email }
    );

    if (user.verified && user.username !== username) {
      await User.updateOne({ userID: accountId }, { verified: false });
    }

    // Reply with the updated user information
    const response = {
      user: {
        biography,
        full_name: fullname,
        gender: 3,
        is_private: user.private,
        pk: user.userID,
        pk_id: user.userID,
        strong_id__: user.userID,
        external_url: website,
        email,
        has_anonymous_profile_picture: false,
        hd_profile_pic_url_info: {
          url: "",
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
        is_verified: user.verified,
        phone_number: "",
        profile_pic_id: "1",
        profile_pic_url: user.profilePicture,
        trusted_username: username,
        trust_days: 0,
        username,
      },
      status: "ok",
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: "fail" });
  }
});

router.post('/change_profile_picture', upload.single('profile_pic'), async (req, res) => {
  try {
      const { ds_user_id, sessionid } = req.cookies;

      if (!ds_user_id || !sessionid) {
          return res.status(401).json({
              message: 'Unauthorized',
              status: 'fail',
              error_type: 'authentication',
          });
      }

      // Ensure user is authenticated
      const account = await User.findOne({ userID: ds_user_id, sessionID: sessionid }).exec();
      if (!account) {
          return res.status(401).json({
              message: 'Unauthorized',
              status: 'fail',
              error_type: 'authentication',
          });
      }

      function generateId(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
  
      const pfpPK = generateId(19);

      const uploadedPhoto = req.file;

      if (req.file.size > 8000000) {
        return res.status(400).json({ message: "File too large" });
      }

      if (!fs.existsSync(`public/profilePictures/${account.userID}`)) {
        fs.mkdirSync(`public/profilePictures/${account.userID}`, { recursive: true });
      }

      const fileName = `public/profilePictures/${account.userID}/${pfpPK}_${account.userID}.png`;
      await sharp(uploadedPhoto.buffer).resize({ width: 500, height: 500 }).png().toFile(fileName);

      // change the link in the database
      await User.updateOne({ userID: account.userID }, { profilePicture: config.host + fileName });

      // Reply with the updated user information
      const response = {
        user: {
          biography: account.biography,
          full_name: account.fullname,
          gender: 3,
          is_private: account.private,
          pk: account.userID,
          pk_id: account.userID,
          strong_id__: account.userID,
          external_url: account.website,
          email: account.email,
          has_anonymous_profile_picture: false,
          hd_profile_pic_url_info: {
            url: "",
            width: 1080,
            height: 1080,
          },
          hd_profile_pic_versions: [
            {
              width: 320,
              height: 320,
              url: account.profilePicture,
            },
            {
              width: 640,
              height: 640,
              url: account.profilePicture,
            },
          ],
          is_verified: account.verified,
          phone_number: "",
          profile_pic_id: "1",
          profile_pic_url: account.profilePicture,
          trusted_username: account.username,
          trust_days: 0,
          username: account.username,
        },
        status: "ok",
      };

      res.json(response);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/logout", async (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
