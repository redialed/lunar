const express = require("express");
const router = express.Router();

const User = require("../../../models/User");

router.get("/show/:id", async (req, res) => {
  res.json({
    blocking: false,
    followed_by: false,
    following: false,
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
  res.json({
    friendship_status: {
      following: true,
      followed_by: false,
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
});

router.post("/destroy/:id", async (req, res) => {
  res.json({
    friendship_status: {
      following: false,
      followed_by: false,
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
    status: "ok",
  });
});

module.exports = router;
