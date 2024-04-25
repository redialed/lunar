const router = require("express").Router();
const v1 = require("./v1");
const config = require("../config.json");

const auth = require("../middleware/auth");

router.use("/api/v1", v1);

router.get("/api/v2/status", (req, res) => {
  res.json({ env: process.env.NODE_ENV, host: config.host, status: "ok" });
});

router.get("/media/:id/flag", auth, async (req, res) => {
  res.send("Please use the Discord server to report stuff.");
});

router.get("/api/v1/si/fetch_headers", (req, res) => {
  res.json({
    status: "ok",
  });
});

router.get("/api/v1/direct_share/recent_recipients", (req, res) => {
  res.json({
    status: "ok",
  });
});

router.use((req, res) => {
  res.status(400).json({
    message: "Not implemented yet.",
    status: "fail",
    error_type: "generic_request_error",
  });
});

module.exports = router;
