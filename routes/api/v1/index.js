const router = require('express').Router();

router.use('/accounts', require('./accounts'));
router.use('/users', require('./users'));

module.exports = router;