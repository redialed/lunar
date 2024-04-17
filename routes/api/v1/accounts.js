const express = require("express");
const multer = require("multer");
const router = express.Router();
const bcrypt = require("bcrypt");

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
          message: "This account couldn't be found. Please check your username and try again.",
          status: "fail",
          error_type: "generic_request_error",
        });
      }
  
      const token = user.uniqueToken;
      const hashedPassword = user.password;
      const saltedPassword = token + password + token;
  
      if (await bcrypt.compare(saltedPassword, hashedPassword)) {
        // Generate session ID
        const sessionID = Math.random().toString(36).substring(2);
  
        // Update session ID in the database
        await User.updateOne({ username }, { sessionID });
  
        // Construct response object
        const response = {
            logged_in_user: {
              pk: user._id,
              username: user.username,
              is_verified: user.verified,
              profile_pic_id: user._id,
              profile_pic_url: "/ign/icon.png",
              is_private: user.isaccountprivate,
              pk_id: user._id,
              full_name: user.fullname,
              account_badges: [],
              has_anonymous_profile_picture: false,
              is_supervision_features_enabled: false,
              all_media_count: 0,
              liked_clips_count: 0,
              fbid_v2: user._id,
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

router.post("/create", upload.none(), async (req, res) => {
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
  
      const token = Math.floor(Math.random() * 2147483647); // Random token
      const hashedPassword = await bcrypt.hash(token + password + token, 10);
  
      // Create new user
      const newUser = new User({
        username,
        password: hashedPassword,
        uniqueToken: token,
        deviceID,
        sessionID: "default",
        private: false,
        verified: false,
        followerCount: 0,
        followingCount: 0,
        photoCount: 0,
        profilePicture: "/ign/icon.png",
        fullname: username,
      });
  
      await newUser.save();
  
      return res.json({
        errors: {
          error: ["Your account has been created successfully! Just login and have fun!"],
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

module.exports = router;
