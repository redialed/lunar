const express = require("express");
const router = express.Router();

router.get("/inbox", (req, res) => {
  const response = {
    counts: {
      relationships: 0,
      comments: 0,
      media_to_approve: 0,
      shopping_notification: 0,
      usertags: 0,
      fundraiser: 0,
      new_posts: 0,
      comment_likes: 0,
      activity_feed_dot_badge: 0,
      activity_feed_dot_badge_only: 0,
      campaign_notification: 0,
      promotional: 0,
      likes: 0,
      photos_of_you: 0,
      requests: 0,
    },
    last_checked: 1713476110.339625,
    priority_stories: [],
    new_stories: [
      {
        story_type: 101,
        notif_name: "user_followed",
        type: 3,
        args: {
          extra_actions: ["hide", "block", "remove_follower"],
          profile_id: "3905206957",
          profile_name: "paris",
          profile_image: "http://localhost:3000/public/profilePictures/default.png",
          inline_follow: {
            user_info: {
              id: "3905206957",
              username: "paris",
              is_private: false,
              profile_pic_url:
              "http://localhost:3000/public/profilePictures/default.png",
            },
            following: false,
            outgoing_request: false,
            incoming_request: false,
            user_relationship: {
              blocking: false,
              followed_by: true,
              following: false,
              incoming_request: false,
              is_bestie: false,
              is_blocking_reel: false,
              is_muting_reel: false,
              is_private: true,
              is_restricted: false,
              muting: false,
              outgoing_request: false,
              is_feed_favorite: false,
              subscribed: false,
              is_eligible_to_subscribe: false,
              is_supervised_by_viewer: false,
              is_guardian_of_viewer: false,
            },
          },
          rich_text: "Sadly notifications aren't a thing yet.",
          text: "Sadly notifications aren't a thing yet.",
          links: [],
          content_version_id: "0",
          aggregation_type: "no_aggregation",
          timestamp: 1713483349.532484,
          tuuid: "0",
          af_candidate_id: "0",
          latest_reel_seen_time: 0,
        },
        counts: {},
        pk: "0",
      },
    ],
    old_stories: [],
    continuation_token: 0,
    subscription: null,
    is_last_page: true,
    status: "ok",
  };
  res.json(response);
});

module.exports = router;
