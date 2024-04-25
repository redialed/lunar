const router = require("express").Router();

router.use("/accounts", require("./routes/accounts"));
router.use("/users", require("./routes/users"));
// router.use('/activity', require('./activity'));
router.use('/upload', require('./routes/upload'));
router.use('/media', require('./routes/media'));
router.use('/feed', require('./routes/feed'));
router.use('/friendships', require('./routes/friendships'));
router.use('/news', require('./routes/news'));
router.use('/fbsearch', require('./routes/fbsearch'));
router.use('/discover', require('./routes/discover'));
router.use('/usertags', require('./routes/usertags'));

module.exports = router;
