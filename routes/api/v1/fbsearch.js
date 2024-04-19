const express = require("express");
const router = express.Router();

router.get("/topsearch", (req, res) => {
  const response = {
    status: "fail",
  };
  res.json(response).status(400);
});

module.exports = router;
