const router = require("express").Router();

router.use("/accounts", require("./accounts"));
router.use("/users", require("./users"));
// router.use('/activity', require('./activity'));

module.exports = router;
