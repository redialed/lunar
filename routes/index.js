const router = require('express').Router();
const v1 = require('./api/v1');
const config = require('../config.json');

router.use('/api/v1', v1);

router.get('/api/v1/si/fetch_headers', (req, res) => {
    res.json({
        "status": "ok"
    });
});

router.use((req, res) => {
    res.status(400).json({
        message: "Not implemented yet.",
        status: "fail",
        error_type: "generic_request_error",
    });
})

module.exports = router;