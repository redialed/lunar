const express = require("express");
const router = express.Router();

const auth = require("../../../middleware/auth");

router.get("/:type", auth, async (req, res) => {
    const response = {
        "items": [],
        "num_results": 0,
        "more_available": false,
        "auto_load_more_enabled": false,
        "status": "ok"
    };
    res.json(response);
});

module.exports = router;