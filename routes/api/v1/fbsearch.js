const express = require("express");
const router = express.Router();

const auth = require("../../../middleware/auth");

router.get("/topsearch", auth, (req, res) => {
  const response = {
    status: "fail",
  };
  res.json(response).status(400);
});

module.exports = router;
