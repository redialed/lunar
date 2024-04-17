const express = require("express");
const multer = require("multer");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/check_email", upload.none(), async (req, res) => {
    const signedBody = req.body.signed_body;

    let email;

    if (signedBody) {
        const sentJson = signedBody.substring(65);
        const decodedJson = JSON.parse(sentJson);
        email = decodedJson.email;
    } else {
        return res.status(400).json({
          errors: {
            error: ["Signed body is missing!"],
          },
          status: "ok",
          error_type: "generic_request_error",
        });
    }

    // check if email exists in the database
    const user = await User.findOne({ email });

    if (user) {
        return res.json({
            "valid": true,
            "available": false,
            "allow_shared_email_registration": true,
            "error_type": "email_is_taken",
            "status": "ok"
        });
    } else {
        return res.json({
            "valid": true,
            "available": true,
            "allow_shared_email_registration": false,
            "username_suggestions": [],
            "tos_version": "eu",
            "age_required": true,
            "status": "ok"
        });
    }
});

module.exports = router;