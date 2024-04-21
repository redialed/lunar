const User = require("../models/User");
const Ban = require("../models/Ban");
const config = require("../config.json");

module.exports = async (req, res, next) => {
  const { ds_user_id, sessionid } = req.cookies;

  if (!ds_user_id || !sessionid) {
    return res.status(401).json({
      message: "Unauthorized",
      status: "fail",
      error_type: "authentication",
    });
  }

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

  const ban = await Ban.findOne({ userID: ds_user_id }).exec();

  if (ban) {
    return res.status(400).json({
      message: "checkpoint_required",
      checkpoint_url: "https://xcxi.net/web/banned.html",
      lock: true,
      flow_render_type: 0,
      status: "fail",
    });
  }

  next();
};
