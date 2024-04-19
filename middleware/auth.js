const User = require("../models/User");

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

  next();
};
